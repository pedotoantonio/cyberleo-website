import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'cyberleo-secret-key-change-in-production';
const CYBERLEO_CATEGORY_ID = 13;

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Query existing users table from antoniopedoto.it
    const result = await pool.query(`
      SELECT id, username, password_hash FROM users WHERE username = $1
    `, [username]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, username: user.username });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Protected routes below
router.use(verifyToken);

// Get all stories (admin)
router.get('/stories', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id, title, slug, excerpt,
        CASE WHEN published THEN 'published' ELSE 'draft' END as status,
        cover_image as image_url, created_at, updated_at
      FROM articles
      WHERE category_id = $1
      ORDER BY created_at DESC
    `, [CYBERLEO_CATEGORY_ID]);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching admin stories:', error);
    res.status(500).json({ error: 'Failed to fetch stories' });
  }
});

// Create story
router.post('/stories', async (req, res) => {
  try {
    const { title, slug, excerpt, content, image_url, status = 'draft' } = req.body;

    const result = await pool.query(`
      INSERT INTO articles (title, slug, excerpt, content, image_url, status, category_id, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      RETURNING *
    `, [title, slug, excerpt, content, image_url, status, CYBERLEO_CATEGORY_ID]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating story:', error);
    res.status(500).json({ error: 'Failed to create story' });
  }
});

// Update story
router.put('/stories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, excerpt, content, image_url, status } = req.body;

    const result = await pool.query(`
      UPDATE articles
      SET title = $1, slug = $2, excerpt = $3, content = $4,
          image_url = $5, status = $6, updated_at = NOW()
      WHERE id = $7 AND category_id = $8
      RETURNING *
    `, [title, slug, excerpt, content, image_url, status, id, CYBERLEO_CATEGORY_ID]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Story not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating story:', error);
    res.status(500).json({ error: 'Failed to update story' });
  }
});

// Delete story
router.delete('/stories/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      DELETE FROM articles WHERE id = $1 AND category_id = $2 RETURNING id
    `, [id, CYBERLEO_CATEGORY_ID]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Story not found' });
    }

    res.json({ message: 'Story deleted successfully' });
  } catch (error) {
    console.error('Error deleting story:', error);
    res.status(500).json({ error: 'Failed to delete story' });
  }
});

// Dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const storiesCount = await pool.query(`
      SELECT COUNT(*) FROM articles WHERE category_id = $1
    `, [CYBERLEO_CATEGORY_ID]);

    const publishedCount = await pool.query(`
      SELECT COUNT(*) FROM articles WHERE category_id = $1 AND published = true
    `, [CYBERLEO_CATEGORY_ID]);

    // Check if videos table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'cyberleo_videos'
      )
    `);

    let videosCount = { rows: [{ count: 0 }] };
    if (tableCheck.rows[0].exists) {
      videosCount = await pool.query(`SELECT COUNT(*) FROM cyberleo_videos`);
    }

    res.json({
      totalStories: parseInt(storiesCount.rows[0].count),
      publishedStories: parseInt(publishedCount.rows[0].count),
      totalVideos: parseInt(videosCount.rows[0].count)
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;
