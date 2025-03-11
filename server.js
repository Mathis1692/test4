// Load dotenv first, before any other imports
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Set up __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables immediately
dotenv.config({ path: path.join(__dirname, '.env') });

// Then import other modules
import express from 'express';
import cors from 'cors';
import fs from 'fs';

// Debug: Check if SENDGRID_API_KEY is loaded correctly
console.log('SENDGRID_API_KEY exists:', !!process.env.SENDGRID_API_KEY);
if (process.env.SENDGRID_API_KEY) {
  console.log('SENDGRID_API_KEY starts with:', 
    process.env.SENDGRID_API_KEY.substring(0, 5) + '...');
}

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Determine if the dist directory exists
const distPath = path.join(__dirname, 'dist');
const distExists = fs.existsSync(distPath);

if (!distExists) {
  console.warn('WARNING: The "dist" directory does not exist. You may need to run "npm run build" first.');
  console.warn('Expected dist path:', distPath);
}

// API Routes - Add your email routes manually if needed
// app.use('/api/email', ...);

// For Vite, static files are in the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Handle requests for static assets in the dist directory
app.use('/assets', express.static(path.join(__dirname, 'dist/assets')));

// Catch-all route for client-side routing - this should come AFTER your API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error', 
    message: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:3000`);
  console.log(`Serving files from: ${path.join(__dirname, 'dist')}`);
});