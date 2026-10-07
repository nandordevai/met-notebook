import { render, screen } from '@testing-library/react';
import Pagination from '@/components/Pagination';

describe('Pagination component', () => {
  it('renders current page number', () => {
    render(<Pagination page={1} query="rembrandt" />);
    expect(screen.getByText('Page 1')).toBeInTheDocument();
  });

  it('renders only Next link on page 1', () => {
    render(<Pagination page={1} query="rembrandt" />);

    expect(screen.queryByRole('link', { name: /previous/i })).not.toBeInTheDocument();
    
    const nextLink = screen.getByRole('link', { name: /next/i });
    expect(nextLink).toBeInTheDocument();
    expect(nextLink).toHaveAttribute('href', '/?q=rembrandt&page=2');
  });

  it('renders both Previous and Next links on page > 1', () => {
    render(<Pagination page={3} query="monet" />);

    const prevLink = screen.getByRole('link', { name: /previous/i });
    expect(prevLink).toBeInTheDocument();
    expect(prevLink).toHaveAttribute('href', '/?q=monet&page=2');

    const nextLink = screen.getByRole('link', { name: /next/i });
    expect(nextLink).toBeInTheDocument();
    expect(nextLink).toHaveAttribute('href', '/?q=monet&page=4');
  });

  it('properly URI encodes the search query in links', () => {
    render(<Pagination page={2} query="vincent van gogh & sunflowers" />);

    const expectedQuery = encodeURIComponent('vincent van gogh & sunflowers');
    const prevLink = screen.getByRole('link', { name: /previous/i });
    const nextLink = screen.getByRole('link', { name: /next/i });

    expect(prevLink).toHaveAttribute('href', `/?q=${expectedQuery}&page=1`);
    expect(nextLink).toHaveAttribute('href', `/?q=${expectedQuery}&page=3`);
  });
});

