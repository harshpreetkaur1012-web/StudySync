import dotenv from 'dotenv';
dotenv.config();

import { createExpressApp } from './app.js';

const app = createExpressApp();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[StudySync Backend] Server running on port ${PORT}`);
  console.log(`[StudySync Backend] Health check: http://localhost:${PORT}/api/health`);
});
