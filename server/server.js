const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = 8080;

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // Store your API key in a .env file

app.use(express.json());

app.get('/pick', async (req, res) => {
  try {
    const prompt = req.query.prompt || 'Suggest an emoji for happiness';

    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-4o',
        messages: [
            { role: 'system', content: "Return 3 emojis that best suits the user's description! No spacing, no punctuation, just emoji" },
            { role: 'user', content: prompt }
        ],
        max_tokens: 100,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    res.json({ completion: response.data.choices[0].message.content.trim() });
  } catch (error) {
    console.error('Error communicating with GPT-4o:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    res.status(500).json({ error: 'Failed to fetch completion from GPT-4o' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});