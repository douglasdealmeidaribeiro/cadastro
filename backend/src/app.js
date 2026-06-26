import cors from 'cors';
import express from 'express';
import { funcionarioRoutes } from './routes/funcionarioRoutes.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';

const app = express();

function buildAllowedOrigins() {
  const configuredOrigins = process.env.CORS_ORIGIN;

  if (!configuredOrigins) {
    return ['http://localhost:5173', 'http://127.0.0.1:5173'];
  }

  return configuredOrigins
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

app.use(express.json());
app.use(
  cors({
    origin(origin, callback) {
      const allowedOrigins = buildAllowedOrigins();

      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Origem nao permitida pelo CORS.'));
    }
  })
);

app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: 'API online.',
    data: {
      service: 'cadastro-funcionarios-api'
    }
  });
});

app.use('/api/funcionarios', funcionarioRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

export { app };
