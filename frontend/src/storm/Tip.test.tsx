import { fireEvent, render, screen } from '@testing-library/react';
import { Tip } from './Tip';

it('uses the shared tooltip for a disabled action and suppresses the native duplicate', () => {
  render(<Tip label="No access"><button disabled title="No access">Action</button></Tip>);
  const button = screen.getByRole('button');
  const wrapper = button.closest('[data-storm-tooltip]')!;
  fireEvent.mouseEnter(wrapper);
  expect(screen.getByRole('tooltip')).toHaveTextContent('No access');
  expect(button).not.toHaveAttribute('title');
  fireEvent.mouseLeave(wrapper);
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  expect(button).toHaveAttribute('title', 'No access');
});

it('also shows the same tooltip for keyboard focus', () => {
  render(<Tip label="Edit"><button>Edit</button></Tip>);
  fireEvent.focus(screen.getByRole('button'));
  expect(screen.getByRole('tooltip')).toHaveTextContent('Edit');
  fireEvent.blur(screen.getByRole('button'));
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
});
