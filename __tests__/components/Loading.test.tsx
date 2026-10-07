import { render, screen } from '@testing-library/react';
import Loading from '@/components/Loading';

describe('Loading component', () => {
  it('renders loading text', () => {
    render(<Loading />);
    expect(screen.getByText('Loading results...')).toBeInTheDocument();
  });
});
