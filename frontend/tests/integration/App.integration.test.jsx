import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../src/App';

test('uploads CV and displays results with chat', async () => {
  render(<App />);
  
  // Upload section visible
  expect(screen.getByText(/Drop your CV here/i)).toBeInTheDocument();

  // Upload file
  const file = new File(['dummy'], 'test.pdf', { type: 'application/pdf' });
  const input = screen.getByRole('textbox', { hidden: true });
  userEvent.upload(input, file);

  const analyzeBtn = screen.getByText(/Analyse My CV/i);
  userEvent.click(analyzeBtn);

  // Wait for results
  await waitFor(() => screen.getByText(/Your Career Readiness Score/i));

  // Chat assistant visible
  const chatBtn = screen.getByRole('button', { name: /message/i });
  userEvent.click(chatBtn);
  const chatInput = screen.getByPlaceholderText(/Ask about your CV analysis/i);
  userEvent.type(chatInput, 'Hello{enter}');

  await waitFor(() => screen.getByText(/mock assistant response/i));
});
