import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

// CORS CONFIGURATION
// Updated with your live Vercel frontend URL to allow secure requests
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://chatbot-lac-alpha-57.vercel.app' 
    : 'http://localhost:5173' // Default Vite local port
}));

app.use(express.json()); 

app.post('/api', async (req, res) => {
  const prompt = req.body.prompt;
  const history = req.body.history || []; // Fallback to empty array if history is missing

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are Nepal AI Legal Assistant, an expert in Nepalese law. Provide clear, accurate, and respectful answers based on Nepal’s legal system, including acts, constitutional provisions, and common legal practices.'
          },
          ...history,
          { role: 'user', content: prompt }
        ]
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'No response from AI.';
    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: 'Sorry, something went wrong connecting to OpenRouter.' });
  }
});

// Use the environment port provided by Render, or default to 5000 locally
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));