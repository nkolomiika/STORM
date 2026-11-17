import { render, screen, within } from '@testing-library/react';
import StormMarkdown from './StormMarkdown';

it('renders a Markdown table with inline formatting and escaped pipe cells', () => {
  render(<StormMarkdown value={'| Host | Result |\n| --- | --- |\n| **api.example** | a\\|b |'} />);
  const table = screen.getByRole('table');
  expect(within(table).getByRole('columnheader', { name: 'Host' })).toBeInTheDocument();
  expect(within(table).getByRole('cell', { name: 'a|b' })).toBeInTheDocument();
  expect(within(table).getByText('api.example').tagName).toBe('STRONG');
});

it('does not execute HTML or render dangerous link schemes inside tables', () => {
  const { container } = render(<StormMarkdown value={'| Value |\n| --- |\n| <script>alert(1)</script> [bad](javascript:alert) |'} />);
  expect(container.querySelector('script')).toBeNull();
  expect(container.querySelector('a[href^="javascript:"]')).toBeNull();
});
