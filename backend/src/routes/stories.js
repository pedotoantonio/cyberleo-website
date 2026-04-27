import express from 'express';
import pool from '../db.js';
import fs from 'fs';
import path from 'path';

const router = express.Router();
const CYBERLEO_CATEGORY_ID = 13;
const UPLOADS_DIR = '/home/sysadmin/cyberleo-website/frontend/public/uploads/stories';

// Convert image URL from antoniopedoto.it format to local CyberLeo format
const convertImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  // Convert /uploads/articles/cyberleo-xyz/cover.jpg to /uploads/stories/cyberleo-xyz/cover.jpg
  if (imageUrl.startsWith('/uploads/articles/cyberleo-')) {
    return imageUrl.replace('/uploads/articles/', '/uploads/stories/');
  }
  // Already local or absolute URL
  return imageUrl;
};

// Get all CyberLeo stories
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    const offset = (page - 1) * limit;

    const result = await pool.query(`
      SELECT
        id, title, slug, excerpt, content,
        cover_image as image_url, created_at, updated_at,
        meta_title, meta_description
      FROM articles
      WHERE category_id = $1 AND published = true
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `, [CYBERLEO_CATEGORY_ID, limit, offset]);

    const countResult = await pool.query(`
      SELECT COUNT(*) FROM articles
      WHERE category_id = $1 AND published = true
    `, [CYBERLEO_CATEGORY_ID]);

    // Convert image URLs to local format
    const stories = result.rows.map(story => ({
      ...story,
      image_url: convertImageUrl(story.image_url)
    }));

    res.json({
      stories,
      total: parseInt(countResult.rows[0].count),
      page: parseInt(page),
      totalPages: Math.ceil(countResult.rows[0].count / limit)
    });
  } catch (error) {
    console.error('Error fetching stories:', error);
    res.status(500).json({ error: 'Failed to fetch stories' });
  }
});

// Get featured stories (latest 3)
router.get('/featured', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id, title, slug, excerpt, cover_image as image_url, created_at
      FROM articles
      WHERE category_id = $1 AND published = true
      ORDER BY created_at DESC
      LIMIT 3
    `, [CYBERLEO_CATEGORY_ID]);

    // Convert image URLs to local format
    const stories = result.rows.map(story => ({
      ...story,
      image_url: convertImageUrl(story.image_url)
    }));

    res.json(stories);
  } catch (error) {
    console.error('Error fetching featured stories:', error);
    res.status(500).json({ error: 'Failed to fetch featured stories' });
  }
});

// Load manifest for a story (contains pre-split pages)
const loadManifest = (slug) => {
  try {
    const manifestPath = path.join(UPLOADS_DIR, slug, 'manifest.json');
    console.log(`[DEBUG] Looking for manifest at: ${manifestPath}`);
    console.log(`[DEBUG] File exists: ${fs.existsSync(manifestPath)}`);
    if (fs.existsSync(manifestPath)) {
      const data = fs.readFileSync(manifestPath, 'utf-8');
      const manifest = JSON.parse(data);
      console.log(`[DEBUG] Manifest loaded, pages: ${manifest.pages?.length || 0}`);
      return manifest;
    }
    console.log(`[DEBUG] Manifest not found for ${slug}`);
  } catch (error) {
    console.error(`Error loading manifest for ${slug}:`, error);
  }
  return null;
};

// Get single story by slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const result = await pool.query(`
      SELECT
        id, title, slug, excerpt, content,
        cover_image as image_url, created_at, updated_at,
        meta_title, meta_description
      FROM articles
      WHERE slug = $1 AND category_id = $2
    `, [slug, CYBERLEO_CATEGORY_ID]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Story not found' });
    }

    // Convert image URL to local format
    const story = {
      ...result.rows[0],
      image_url: convertImageUrl(result.rows[0].image_url)
    };

    // Load manifest with pre-split pages if available
    const manifest = loadManifest(slug);
    if (manifest && manifest.pages) {
      // Include pre-split pages from manifest (single source of truth)
      story.pages = manifest.pages.map(p => ({
        page_number: p.page_number,
        text: p.text,
        audio_file: p.audio_file,
        image_file: p.image_file
      }));
      story.total_pages = manifest.total_pages;
    }

    res.json(story);
  } catch (error) {
    console.error('Error fetching story:', error);
    res.status(500).json({ error: 'Failed to fetch story' });
  }
});

export default router;
