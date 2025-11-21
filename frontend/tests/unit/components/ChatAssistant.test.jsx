import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChatAssistant from '../../../src/components/ChatAssistant';
import userEvent from '@testing-library/user-event';

const analysisContext = { overall_score: 80 };

test('renders initial assistant message', () => {
  render(<ChatAssistant analysisContext={analysisContext} />);
  expect(screen.getByText(/Hi! I'm your career assistant/i)).toBeInTheDocument();
});

test('sends message and receives response', async () => {
  render(<ChatAssistant analysisContext={analysisContext} />);
  const toggleBtn = screen.getByRole('button');
  fireEvent.click(toggleBtn);

  const input = screen.getByPlaceholderText(/Ask about your CV analysis/i);
  userEvent.type(input, 'Hello{enter}');

  await waitFor(() => screen.getByText(/mock assistant response/i));
  expect(screen.getByText(/mock assistant response/i)).toBeInTheDocument();
});

