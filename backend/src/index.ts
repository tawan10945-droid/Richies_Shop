import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123';

app.use(cors());
app.use(express.json());

// --- Authentication Middleware ---
const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// --- AUTH API ---
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingUser = await prisma.user.findUnique({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { username, password_hash: hashedPassword }
        });
        res.json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await prisma.user.findUnique({ where: { username } });
        if (!user) return res.status(400).json({ error: 'Invalid credentials' });

        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, username: user.username });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// --- ORDERS API ---

app.get('/api/orders', authenticateToken, async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            orderBy: { created_at: 'desc' },
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/orders/:id', authenticateToken, async (req, res) => {
    try {
        const order = await prisma.order.findUnique({
            where: { id: parseInt(req.params.id) }
        });
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/orders', authenticateToken, async (req, res) => {
    try {
        const data = req.body;
        // Calculate revenue and profit if not provided by frontend
        const revenue = data.revenue ?? (data.quantity * data.selling_price);
        const profit = data.profit ?? (revenue - (data.quantity * data.cost));

        const order = await prisma.order.create({
            data: {
                ...data,
                revenue,
                profit,
                // Ensure set_name is a string (JSON stringified array from frontend)
                set_name: typeof data.set_name === 'string' ? data.set_name : JSON.stringify(data.set_name),
            }
        });
        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error while creating order' });
    }
});

app.delete('/api/orders/:id', authenticateToken, async (req, res) => {
    try {
        await prisma.order.delete({
            where: { id: parseInt(req.params.id) },
        });
        res.json({ message: 'Order deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.put('/api/orders/:id', authenticateToken, async (req, res) => {
    try {
        const data = req.body;
        const revenue = data.revenue ?? (data.quantity * data.selling_price);
        const profit = data.profit ?? (revenue - (data.quantity * data.cost));

        const order = await prisma.order.update({
            where: { id: parseInt(req.params.id) },
            data: {
                ...data,
                revenue,
                profit,
                // Ensure set_name is a string (JSON stringified array from frontend)
                set_name: typeof data.set_name === 'string' ? data.set_name : JSON.stringify(data.set_name),
            }
        });
        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error while updating order' });
    }
});

// --- DASHBOARD API ---

app.get('/api/dashboard', authenticateToken, async (req, res) => {
    try {
        const orders = await prisma.order.findMany();

        let totalSales = 0;
        let totalProfit = 0;
        let tiktokSales = 0;
        let shopeeSales = 0;
        let tiktokProfit = 0;
        let shopeeProfit = 0;

        orders.forEach((order: any) => {
            totalSales += order.revenue;
            totalProfit += order.profit;

            if (order.platform.toLowerCase() === 'tiktok') {
                tiktokSales += order.revenue;
                tiktokProfit += order.profit;
            } else if (order.platform.toLowerCase() === 'shopee') {
                shopeeSales += order.revenue;
                shopeeProfit += order.profit;
            }
        });

        res.json({
            totalOrders: orders.length,
            totalSales,
            totalProfit,
            tiktok: { sales: tiktokSales, profit: tiktokProfit, count: orders.filter((o: any) => o.platform.toLowerCase() === 'tiktok').length },
            shopee: { sales: shopeeSales, profit: shopeeProfit, count: orders.filter((o: any) => o.platform.toLowerCase() === 'shopee').length }
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
