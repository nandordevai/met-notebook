import { render, screen } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

describe('Header component', () => {
  const mockUsePathname = usePathname as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePathname.mockReturnValue('/');
  });

  it('renders search form with input and submit button', () => {
    render(<Header />);

    const searchInput = screen.getByRole('textbox');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute('name', 'q');

    const submitButton = screen.getByRole('button', { name: /search/i });
    expect(submitButton).toBeInTheDocument();
  });

  it('sets search input default value from query prop', () => {
    render(<Header query="impressionism" />);

    const searchInput = screen.getByRole('textbox');
    expect(searchInput).toHaveValue('impressionism');
  });

  it('defaults search input to empty string when query is undefined', () => {
    render(<Header />);

    const searchInput = screen.getByRole('textbox');
    expect(searchInput).toHaveValue('');
  });

  it('shows Collection link when not on /collection route', () => {
    mockUsePathname.mockReturnValue('/');
    render(<Header />);

    const collectionLink = screen.getByRole('link', { name: /collection/i });
    expect(collectionLink).toBeInTheDocument();
    expect(collectionLink).toHaveAttribute('href', '/collection');
  });

  it('hides Collection link when on /collection route', () => {
    mockUsePathname.mockReturnValue('/collection');
    render(<Header />);

    expect(screen.queryByRole('link', { name: /collection/i })).not.toBeInTheDocument();
  });

  it('renders page number when query is present', () => {
    render(<Header query="picasso" page={2} />);

    expect(screen.getByText('Page 2')).toBeInTheDocument();
  });

  it('does not render page number when query is absent', () => {
    render(<Header page={1} />);

    expect(screen.queryByText(/page/i)).not.toBeInTheDocument();
  });

  it('does not render page number when query is an empty string', () => {
    render(<Header query="" page={1} />);

    expect(screen.queryByText(/page/i)).not.toBeInTheDocument();
  });
});

