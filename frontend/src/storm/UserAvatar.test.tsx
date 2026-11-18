import { fireEvent, render, screen } from '@testing-library/react';
import { UserAvatar } from './UserAvatar';

it('shows the image and falls back after a download failure, then accepts a new URL', () => {
  const view = render(<UserAvatar name="alice" src="/avatar?v=1" initials="A" />);
  expect(screen.getByRole('img', { name: 'alice' })).toHaveAttribute('src', '/avatar?v=1');
  fireEvent.error(screen.getByRole('img'));
  expect(screen.queryByRole('img')).not.toBeInTheDocument();
  expect(screen.getByText('A')).toBeInTheDocument();
  view.rerender(<UserAvatar name="alice" src="/avatar?v=2" initials="A" />);
  expect(screen.getByRole('img', { name: 'alice' })).toHaveAttribute('src', '/avatar?v=2');
});

it('renders the supplied username letter when no image is configured', () => {
  render(<UserAvatar name="alice" initials="A" />);
  expect(screen.getByText('A')).toBeInTheDocument();
  expect(screen.queryByRole('img')).not.toBeInTheDocument();
});
