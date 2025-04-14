const express = require('express');
const axios = require('axios');
const cors = require('cors');
const Authorization = require('./middleware/Authorization');
require('dotenv').config();

const app = express();
const port = 8080;

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // Store your API key in a .env file

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add CORS middleware
app.use(cors({
  origin: '*'
}));

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the Emoji Picker API!', version: '1.0.0' });
});

app.get('/pick', Authorization, async (req, res) => {
  try {
    const prompt = req.query.prompt || 'Suggest an emoji for suspicious';
    const number = req.query.number || 3;
    const auto = req.query.auto || false;
    const autoPrompt = auto ? 
      `Return as many emojis so they best explain/suit the user's description! No spacing, no punctuation, just emoji`
      :
      `Return ${number} emojis that best suits the user's description! No spacing, no punctuation, just emoji`;

    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-4o',
        messages: [
            { role: 'system', content: autoPrompt },
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

app.get('/me', Authorization, (req, res) => {
  res.status(200).json({ authenticated: true });
});

app.post("/login", (req, res) => {
  const { password } = req.body || {};

  if(password === undefined || password === null || password === '') {
    return res.status(400).json({ error: "Password is required" });
  }

  if(password === process.env.PASSWORD) {
    res.status(200).json({ 
      message: "Login successful",
      token: process.env.TOKEN
    });
  } else {
    res.status(401).json({ error: "Invalid password" });
  }
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});