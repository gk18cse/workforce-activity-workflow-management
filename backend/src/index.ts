import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import workflowRoutes from './routes/workflowRoutes';
import taskRoutes from './routes/taskRoutes';
import { errorHandler } from './middlewares/errorMiddleware';
import { seedInitialData } from './utils/seed';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Health Check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'online',
    service: 'Workforce Workflow & Operational Activity Management Platform API',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/workflows', workflowRoutes);
app.use('/api/tasks', taskRoutes);

// Global Error Handler
app.use(errorHandler);

app.listen(port, async () => {
  console.log(`⚡️[server]: Express Server is running at http://localhost:${port}`);
  // Run initial DB seed for roles & default entities
  await seedInitialData();
});

export default app;
