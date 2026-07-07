import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const generateChatResponse = async (messages) => {
  try {
    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    // Add system prompt if needed
    const systemPrompt = {
      role: 'system',
      content: 'You are an advanced AI assistant. You are helpful, intelligent, and professional.'
    };
    
    formattedMessages.unshift(systemPrompt);

    const completion = await groq.chat.completions.create({
      messages: formattedMessages,
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 2048,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Groq API Error:', error);
    throw new Error('Failed to generate AI response');
  }
};

export const generateTitle = async (firstUserMessage) => {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that generates a concise title (maximum 5 words) for a conversation based on the first user message. Do not include quotes or any extra text, just the title itself.'
        },
        {
          role: 'user',
          content: firstUserMessage
        }
      ],
      model: 'llama-3.1-8b-instant', // Use a smaller, faster model for title generation
      temperature: 0.5,
      max_tokens: 10,
    });

    return completion.choices[0].message.content.trim().replace(/^"|"$/g, '');
  } catch (error) {
    console.error('Groq Title Generation Error:', error);
    return 'New Conversation'; // Fallback title
  }
};
