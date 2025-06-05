import { render, screen } from '@testing-library/react';
import App from './App';

test('renders MindFlow header', () => {
  render(<App />);
  const header = screen.getByText(/MindFlow/i);
  expect(header).toBeInTheDocument();
});
