import { render, screen } from '@testing-library/react';
import ResultsDashboard from '../../../src/components/ResultsDashboard';

const mockData = {
  overall_score: 80,
  summary: 'Ready for most roles.',
  buckets: [
    { name: 'Experience', score: 16, strengths: ['Good projects'], recommendations: ['Gain more leadership experience'] },
    { name: 'Skills', score: 14, strengths: ['Technical skills'], recommendations: ['Improve soft skills'] }
  ],
  top_priorities: ['Leadership', 'Soft skills']
};

test('renders overall score and summary', () => {
  render(<ResultsDashboard data={mockData} onBack={() => {}} />);
  expect(screen.getByText(/80/)).toBeInTheDocument();
  expect(screen.getByText(/Ready for most roles./i)).toBeInTheDocument();
});

test('renders bucket names and scores', () => {
  render(<ResultsDashboard data={mockData} onBack={() => {}} />);
  mockData.buckets.forEach(bucket => {
    expect(screen.getByText(bucket.name)).toBeInTheDocument();
    expect(screen.getByText(`${bucket.score}/20`)).toBeInTheDocument();
  });
});

