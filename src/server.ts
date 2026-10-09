import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { AgentOrchestrator } from './agents/orchestrator.js';

dotenv.config();

const app = express();
app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
    })
  : null;

const orchestrator = new AgentOrchestrator(ai);

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'operational',
    service: 'gemini-agent-mesh',
    model: 'gemini-3.8-flash',
    uptimeSeconds: Math.floor(process.uptime()),
    hasApiKey: Boolean(apiKey),
  });
});

// Autonomous task execution endpoint
app.post('/api/tasks/dispatch', async (req: Request, res: Response) => {
  try {
    const { taskGoal, context } = req.body;
    if (!taskGoal) {
      return res.status(400).json({ error: 'taskGoal is required' });
    }

    const result = await orchestrator.executePipeline(taskGoal, context);
    res.json(result);
  } catch (err: any) {
    console.error('Task execution error:', err);
    res.status(500).json({ error: err.message || 'Pipeline execution failed' });
  }
});

const PORT = Number(process.env.PORT) || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Gemini Agent Mesh service active on port ${PORT}`);
});
