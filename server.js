const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config(); // Load .env file

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

app.post('/generate-prompt', async (req, res) => {
  const { category, tone, topic } = req.body;

  const userPrompt = `Generate a prompt for an AI that helps with "${category}".
Tone: ${tone}.
Topic/Context: ${topic}.
Make it clear, concise, and useful for a language model to understand.`;

  try {
    const response = await axios.post(
      'https://api.deepseek.com/v1/chat/completions', // Replace with correct URL if needed
      {
        model: 'deepseek-chat', // Or 'deepseek-coder' if you are using coder model
        messages: [
          {
            role: 'user',
            content: userPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 300
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const aiMessage = response.data.choices?.[0]?.message?.content || 'No response';
    res.json({ prompt: aiMessage.trim() });

  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send('Error generating prompt');
  }
});

app.listen(port, () => {
  console.log(`✅ Backend running at http://localhost:${port}`);
});
