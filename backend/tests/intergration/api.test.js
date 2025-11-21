const request = require('supertest');
const express = require('express');
const multer = require('multer');
const app = require('../../server'); // make sure server.js exports app

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

describe('API Integration', () => {
  test('Health endpoint returns ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('Analyse endpoint works with PDF', async () => {
    const res = await request(app)
      .post('/api/analyse')
      .attach('cv', './tests/fixtures/sample.pdf');
    expect(res.statusCode).toBe(200);
    expect(res.body.analysis.overall_score).toBe(75);
  });

  test('Analyse endpoint returns 400 if no file', async () => {
    const res = await request(app).post('/api/analyse');
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('No file uploaded');
  });

  test('Chat endpoint works', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ message: 'What should I improve?' });
    expect(res.statusCode).toBe(200);
    expect(res.body.response).toBe('Mocked response');
  });
});

