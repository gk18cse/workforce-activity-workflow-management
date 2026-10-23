"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const workflowRoutes_1 = __importDefault(require("./routes/workflowRoutes"));
const taskRoutes_1 = __importDefault(require("./routes/taskRoutes"));
const errorMiddleware_1 = require("./middlewares/errorMiddleware");
const seed_1 = require("./utils/seed");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
// Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'online',
        service: 'Workforce Workflow & Operational Activity Management Platform API',
        timestamp: new Date().toISOString(),
    });
});
// Mount Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
app.use('/api/workflows', workflowRoutes_1.default);
app.use('/api/tasks', taskRoutes_1.default);
// Global Error Handler
app.use(errorMiddleware_1.errorHandler);
app.listen(port, async () => {
    console.log(`⚡️[server]: Express Server is running at http://localhost:${port}`);
    // Run initial DB seed for roles & default entities
    await (0, seed_1.seedInitialData)();
});
exports.default = app;
