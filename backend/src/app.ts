import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import assignmentRoutes from './routes/assignmentRoutes.js';
import subjectRoutes from './routes/subjectRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';

export function createExpressApp() {
  const app = express();

  // Middleware
  app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));
  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'StudySync API', timestamp: new Date().toISOString() });
  });

  // REST API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/assignments', assignmentRoutes);
  app.use('/api/subjects', subjectRoutes);
  app.use('/api/notes', noteRoutes);
  app.use('/api/analytics', analyticsRoutes);

  // Global error handler
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Unhandled error:', err);
    res.status(err.status || 500).json({
      message: err.message || 'Internal server error',
    });
  });

  return app;
}
