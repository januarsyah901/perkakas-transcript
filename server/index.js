import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import transcriptRoutes from './routes/transcript.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post('/api/transcript', transcriptRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
