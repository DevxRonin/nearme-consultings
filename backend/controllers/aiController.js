const {
  recommendConsultants,
  parseUserQuery
} = require('../services/recommendationService');

// @desc    Process natural language AI Chat query
// @route   POST /api/ai/chat
// @access  Public
const handleAIChat = async (req, res, next) => {
  try {
    const { question, location, coordinates } = req.body;

    if (!question || question.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a question or search query for the AI Assistant'
      });
    }

    // Step 1: Query database using intelligent recommendation engine
    const recommendationResult = await recommendConsultants({
      query: question,
      location: location || '',
      coordinates: coordinates || null,
      limit: 4
    });

    // Step 2: If OpenAI API key is present, try OpenAI enhancement (optional)
    let aiAnswer = recommendationResult.answer;

    if (
      process.env.OPENAI_API_KEY &&
      process.env.OPENAI_API_KEY.startsWith('sk-') &&
      !process.env.OPENAI_API_KEY.includes('sk-...')
    ) {
      try {
        const https = require('https');
        const payload = JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content:
                'You are the AI Assistant for NearMe Consulting platform. Answer concisely and professionally based solely on the provided verified database results. Do NOT invent businesses or prices.'
            },
            {
              role: 'user',
              content: `User query: "${question}". Matching database records: ${JSON.stringify(
                recommendationResult.results.map((r) => ({
                  name: r.name,
                  category: r.category,
                  city: r.city,
                  price: r.price,
                  rating: r.rating,
                  services: r.services
                }))
              )}. Explain why these suit the user.`
            }
          ],
          max_tokens: 300,
          temperature: 0.5
        });

        // Async request to OpenAI
        aiAnswer = await new Promise((resolve) => {
          const reqAI = https.request(
            'https://api.openai.com/v1/chat/completions',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
              },
              timeout: 4000
            },
            (response) => {
              let data = '';
              response.on('data', (chunk) => (data += chunk));
              response.on('end', () => {
                try {
                  const parsed = JSON.parse(data);
                  if (parsed.choices && parsed.choices[0]) {
                    resolve(parsed.choices[0].message.content);
                  } else {
                    resolve(recommendationResult.answer);
                  }
                } catch {
                  resolve(recommendationResult.answer);
                }
              });
            }
          );
          reqAI.on('error', () => resolve(recommendationResult.answer));
          reqAI.on('timeout', () => {
            reqAI.destroy();
            resolve(recommendationResult.answer);
          });
          reqAI.write(payload);
          reqAI.end();
        });
      } catch (openAiErr) {
        console.warn('OpenAI fallback to rule engine:', openAiErr.message);
        aiAnswer = recommendationResult.answer;
      }
    }

    res.json({
      success: true,
      answer: aiAnswer,
      results: recommendationResult.results,
      parsedQuery: recommendationResult.parsedQuery,
      isAiEnhanced: Boolean(
        process.env.OPENAI_API_KEY &&
          process.env.OPENAI_API_KEY.startsWith('sk-') &&
          !process.env.OPENAI_API_KEY.includes('sk-...')
      )
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get structured recommendations
// @route   POST /api/ai/recommend
// @access  Public
const handleRecommend = async (req, res, next) => {
  try {
    const { category, maxBudget, location, coordinates, minRating } = req.body;

    let queryParts = [];
    if (category) queryParts.push(category);
    if (maxBudget) queryParts.push(`under ${maxBudget}`);
    if (minRating) queryParts.push(`rating ${minRating}`);

    const result = await recommendConsultants({
      query: queryParts.join(' '),
      location: location || '',
      coordinates: coordinates || null,
      limit: 6
    });

    res.json({
      success: true,
      answer: result.answer,
      results: result.results,
      count: result.count
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleAIChat,
  handleRecommend
};
