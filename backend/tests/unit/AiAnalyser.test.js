const { analyseCV, handleChat } = require('../../utils/aiAnalyser');

jest.mock('../../utils/aiAnalyser', () => ({
  analyseCV: jest.fn(async () => ({
    overall_score: 75,
    buckets: [
      { name: 'CV Professionalism & Formatting', score: 16, strengths: [], recommendations: [] },
      { name: 'Projects & Experience', score: 14, strengths: [], recommendations: [] },
      { name: 'Technical Skills', score: 17, strengths: [], recommendations: [] },
      { name: 'Soft Skills', score: 12, strengths: [], recommendations: [] },
      { name: 'Education & Certifications', score: 16, strengths: [], recommendations: [] }
    ]
  })),
  handleChat: jest.fn(async () => 'Mocked response')
}));

describe('AI Analyser', () => {
  test('analyseCV returns correct structure', async () => {
    const result = await analyseCV('Sample CV text');
    expect(result.overall_score).toBe(75);
    expect(result.buckets).toHaveLength(5);
  });

  test('handleChat returns string', async () => {
    const response = await handleChat('What should I improve?');
    expect(response).toBe('Mocked response');
  });
});

