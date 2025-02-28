import express from 'express';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import emailRoutes from './routes/emailRoutes.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes - add this before your catch-all route
app.use('/api/email', emailRoutes);

// For Vite, static files are in the dist directory
app.use(express.static(path.join(__dirname, '../dist')));

// Handle requests for static assets in the dist directory
app.use('/assets', express.static(path.join(__dirname, '../dist/assets')));

// Catch-all route for client-side routing - this should come AFTER your API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});