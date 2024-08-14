import axios from 'axios';

const API_KEY = 'key';
const API_URL = 'https://api.openai.com/v1/chat/completions';

export async function sendMessageToChatGPT(messages) {
  try {
    const response = await axios.post(
      API_URL,
      {
        model: 'gpt-4', // Use 'gpt-3.5-turbo' if GPT-4 is unavailable
        messages,
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error communicating with ChatGPT:', error);
    throw new Error('Failed to fetch response from ChatGPT');
  }
}
