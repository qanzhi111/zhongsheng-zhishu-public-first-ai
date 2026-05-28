import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: '人民链后端服务运行正常' });
});

app.use('/api', (req, res) => {
  res.json({ message: '人民链 API' });
});

app.listen(PORT, () => {
  console.log(`🚀 人民链后端服务运行在 http://localhost:${PORT}`);
});
