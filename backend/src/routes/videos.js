import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Get all videos
router.get('/', async (req, res) => {
  try {
    // First check if the cyberleo_videos table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'cyberleo_videos'
      )
    `);

    if (!tableCheck.rows[0].exists) {
      // Return empty array if table doesn't exist yet
      return res.json({
        videos: [],
        total: 0,
        message: 'Videos coming soon!'
      });
    }

    const { page = 1, limit = 12 } = req.query;
    const offset = (page - 1) * limit;

    const result = await pool.query(`
      SELECT
        id, title, title_en, topic_id,
        youtube_video_id as youtube_id,
        video_file_path, thumbnail_path,
        duration_seconds, published_at as created_at
      FROM cyberleo_videos
      WHERE upload_status = 'published'
      ORDER BY published_at DESC
      LIMIT $1 OFFSET $2
    `, [limit, offset]);

    const countResult = await pool.query(`
      SELECT COUNT(*) FROM cyberleo_videos WHERE upload_status = 'published'
    `);

    res.json({
      videos: result.rows,
      total: parseInt(countResult.rows[0].count),
      page: parseInt(page),
      totalPages: Math.ceil(countResult.rows[0].count / limit)
    });
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

// Get featured videos (latest 3)
router.get('/featured', async (req, res) => {
  try {
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'cyberleo_videos'
      )
    `);

    if (!tableCheck.rows[0].exists) {
      return res.json([]);
    }

    const result = await pool.query(`
      SELECT
        id, title, title_en, topic_id,
        youtube_video_id as youtube_id,
        video_file_path, thumbnail_path,
        duration_seconds, published_at as created_at
      FROM cyberleo_videos
      WHERE upload_status = 'published'
      ORDER BY published_at DESC
      LIMIT 3
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching featured videos:', error);
    res.status(500).json({ error: 'Failed to fetch featured videos' });
  }
});

// Get single video
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      SELECT
        id, title, title_en, topic_id,
        youtube_video_id as youtube_id,
        video_file_path, thumbnail_path,
        duration_seconds, published_at as created_at
      FROM cyberleo_videos
      WHERE id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Video not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching video:', error);
    res.status(500).json({ error: 'Failed to fetch video' });
  }
});

export default router;
