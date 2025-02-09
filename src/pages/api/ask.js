import { initChain } from './chat';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    // Initialize the chain before using it
    const chain = await initChain();
    
    // Pass the query string directly, not as an object
    const result = await chain.invoke(query);

    const response = {
      answer: result,
      sources: [] 
    };

    return res.status(200).json(response);

  } catch (error) {
    console.error('Ask error:', error);
    return res.status(500).json({
      error: error.message,
      success: false,
    });
  }
} 