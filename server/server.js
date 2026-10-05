import express from 'express';
import cors from 'cors';
import apiRouter from './routes/api.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logger for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// Mount API routes
app.use('/api', apiRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    appName: 'SecondLife ♻️ API',
    tagline: 'Give unused electronics a second life',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`\n========================================`);
  console.log(` SecondLife ♻️ Backend Server Running`);
  console.log(` Port: http://localhost:${PORT}`);
  console.log(` API:  http://localhost:${PORT}/api/projects`);
  console.log(`========================================\n`);
});
