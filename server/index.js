import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const isProd = process.env.NODE_ENV === 'production';
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, name: 'Thilan Portfolio' });
});

app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ ok: false, error: 'All fields are required.' });
  }
  console.log('Contact message:', { name, email, message: message.slice(0, 200) });
  res.json({ ok: true, message: 'Thanks — I’ll get back to you soon.' });
});

if (isProd) {
  app.use(express.static(path.join(root, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(root, 'dist', 'index.html'));
  });
} else {
  app.get('/', (_req, res) => {
    res.redirect('http://localhost:5173');
  });
}

app.listen(PORT, () => {
  console.log(`Portfolio server on http://localhost:${PORT}`);
  if (!isProd) {
    console.log('Dev UI: http://localhost:5173 (run npm run dev)');
  }
});
