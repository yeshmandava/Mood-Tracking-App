import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app header', () => {
  render(<App />);
  const headerElement = screen.getByText(/Minion's Daily Report/i);
  expect(headerElement).toBeInTheDocument();
});
