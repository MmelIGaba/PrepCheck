import { rest } from 'msw';

export const handlers = [
  // Mock CV analysis endpoint
  rest.post('http://localhost:5000/api/analyse', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        analysis: {
          overall_score: 80,
          summary: 'You are ready for most roles.',
          buckets: [
            { name: 'Experience', score: 16, strengths: ['Good projects'], recommendations: ['Gain more leadership experience'] },
            { name: 'Skills', score: 14, strengths: ['Technical skills'], recommendations: ['Improve soft skills'] }
          ],
          top_priorities: ['Leadership', 'Soft skills']
        }
      })
    );
  }),

  // Mock ChatAssistant endpoint
  rest.post('http://localhost:5000/api/chat', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ response: 'This is a mock assistant response.' }));
  }),
];

