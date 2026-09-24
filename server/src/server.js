require('dotenv').config();
const app = require('./app');

// Friends Garden AG Church - Backend Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`========================================`);
  console.log(`⛪ FGAG Church API Server running on port ${PORT}`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  console.log(`========================================`);
});
