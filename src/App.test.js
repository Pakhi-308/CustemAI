import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the landing page brand selector', () => {
  render(<App />);
  const heading = screen.getByText(/Hyper-personalization at scale/i);
  expect(heading).toBeInTheDocument();
});
