import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { rateLimit } from 'express-rate-limit';
import storiesRoutes from './routes/stories.js';
import charactersRoutes from './routes/characters.js';
import videosRoutes from './routes/videos.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8004;

// Trust proxy (behind nginx)
app.set('trust proxy', 1);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
});

app.use(limiter);
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/stories', storiesRoutes);
app.use('/api/characters', charactersRoutes);
app.use('/api/videos', videosRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'cyberleo-api' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`CyberLeo API running on port ${PORT}`);
});
