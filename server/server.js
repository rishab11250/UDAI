import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, AuditLog } from './database.js'; // Import Mongoose Models
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key-123';

// Middleware to verify Token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.sendStatus(403);
        req.user = decoded;
        next();
    });
};

// Helper to log user activity
const logActivity = async (userId, action, details) => {
    try {
        await AuditLog.create({ userId, action, details });
    } catch (err) {
        console.error("Failed to log activity:", err);
    }
};

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.static(join(__dirname, '../dist')));
app.use(cors());
app.use(express.json());

// Register Endpoint
app.post('/api/auth/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const hashedPassword = bcrypt.hashSync(password, 8);
    const userRole = req.body.role || 'User';

    try {
        // Mongoose: Create user
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role: userRole
        });

        res.status(201).json({
            message: "User registered successfully",
            userId: newUser._id
        });
        logActivity(newUser._id, "REGISTER", `User registered as ${userRole}`);
    } catch (err) {
        if (err.code === 11000) { // Duplicate key error code for MongoDB
            return res.status(400).json({ error: "Email already exists" });
        }
        res.status(500).json({ error: err.message });
    }
});

// Login Endpoint
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "User not found" });

        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) {
            return res.status(401).json({ error: "Invalid password" });
        }

        const token = jwt.sign({ id: user._id }, SECRET_KEY, {
            expiresIn: 86400 // 24 hours
        });

        res.status(200).json({
            message: "Login successful",
            accessToken: token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
        logActivity(user._id, "LOGIN", "User logged in successfully");
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

// Verify Session Endpoint
app.get('/api/auth/me', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); // Exclude password
        if (!user) return res.status(404).json({ error: "User not found" });
        // Standardize response to match what frontend expects (id as string/number)
        res.json({ id: user._id, name: user.name, email: user.email, role: user.role });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

// Fallback to React app
app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
