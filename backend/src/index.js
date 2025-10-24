const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors()); // allow frontend dev to call backend
app.use(express.json());

// simple request logger for diagnostics
app.use((req, res, next) => {
  console.log(`[REQ] ${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  next();
});

// health check for quick smoke test
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend listening on ${PORT}`);
});