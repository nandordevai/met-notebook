import { render, screen, waitFor } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import Home from '@/app/page';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

describe('Home page', () => {
  const originalFetch = global.fetch;
  const mockUsePathname = usePathname as jest.Mock;

  beforeEach(() => {
    global.fetch = jest.fn();
    mockUsePathname.mockReturnValue('/');
    localStorage.clear();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it('renders default home page with empty query and page 1', async () => {
    const jsx = await Home({
      searchParams: Promise.resolve({}),
    });
    render(jsx);

    const searchInput = screen.getByRole('textbox');
    expect(searchInput).toHaveValue('');

    // Pagination displays "Page 1", but Header does not when query is empty
    expect(screen.getAllByText('Page 1')).toHaveLength(1);

    await waitFor(() => {
      expect(screen.getByText('No artwork found')).toBeInTheDocument();
    });
  });

  it('renders home page with query and page parsed from searchParams', async () => {
    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('/search')) {
        return Promise.resolve({
          json: () => Promise.resolve({ objectIDs: [] }),
        });
      }
      return Promise.reject(new Error('Unknown URL'));
    });

    const jsx = await Home({
      searchParams: Promise.resolve({ q: 'cezanne', page: '3' }),
    });
    render(jsx);

    const searchInput = screen.getByRole('textbox');
    expect(searchInput).toHaveValue('cezanne');

    // Both Header and Pagination display page info when query is present
    expect(screen.getAllByText('Page 3')).toHaveLength(2);

    await waitFor(() => {
      expect(screen.getByText('No artwork found')).toBeInTheDocument();
    });
  });
});

