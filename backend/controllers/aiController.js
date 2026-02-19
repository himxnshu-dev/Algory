import asyncHandler from 'express-async-handler';
import getGemini from '../utils/openai.js';
import Problem from '../models/Problem.js';

const reviewCode = asyncHandler(async (req, res) => {
    const { problemId, code } = req.body;

    if (!code) {
        res.status(400);
        throw new Error('Please provide code to review');
    }

    const prompt = `You are an expert DSA code reviewer. Analyze the given code and provide a structured review in markdown format with the following sections:

## Time Complexity
Analyze and state the time complexity with explanation.

## Space Complexity
Analyze and state the space complexity with explanation.

## Code Quality
Review the code quality, readability, and best practices.

## Optimization Suggestions
Suggest any possible optimizations or alternative approaches.

## Edge Cases
List any edge cases the code might miss.

Be concise, precise, and helpful. Use bullet points where appropriate.

Here is the code to review:

\`\`\`
${code}
\`\`\``;

    try {
        const genAI = getGemini();
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const result = await model.generateContent(prompt);
        const feedback = result.response.text();

        if (problemId) {
            await Problem.findByIdAndUpdate(problemId, { aiFeedback: feedback });
        }

        res.json({ feedback });
    } catch (error) {
        console.error('AI Review error:', error.message);
        if (error.message?.includes('API key')) {
            res.status(500);
            throw new Error(
                'Gemini API key is invalid or not configured. Please check your .env file.'
            );
        }
        res.status(500);
        throw new Error('AI review failed: ' + error.message);
    }
});

export { reviewCode };
