import { render, screen, waitFor } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import CollectionPage from '@/app/collection/page';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

describe('CollectionPage', () => {
  const originalFetch = global.fetch;
  const mockUsePathname = usePathname as jest.Mock;

  beforeEach(() => {
    global.fetch = jest.fn();
    mockUsePathname.mockReturnValue('/collection');
    localStorage.clear();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it('renders Collection title and Header without Collection link', async () => {
    render(<CollectionPage />);

    expect(screen.getByRole('heading', { level: 1, name: 'Collection' })).toBeInTheDocument();
    // On /collection route, the Collection link in header should be hidden
    expect(screen.queryByRole('link', { name: 'Collection' })).not.toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('No artwork found')).toBeInTheDocument();
    });
  });

  it('loads favorite IDs from localStorage and displays artwork cards', async () => {
    localStorage.setItem('favorites', JSON.stringify([436535]));

    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('/436535')) {
        return Promise.resolve({
          json: () =>
            Promise.resolve({
              objectID: 436535,
              title: 'Wheat Field with Cypresses',
              primaryImageSmall: 'https://images.metmuseum.org/CRDImages/ep/web-large/cypresses.jpg',
            }),
        });
      }
      return Promise.reject(new Error('Unknown URL'));
    });

    render(<CollectionPage />);

    await waitFor(() => {
      expect(screen.getByText('Wheat Field with Cypresses')).toBeInTheDocument();
    });
  });

  it('handles empty localStorage gracefully', async () => {
    render(<CollectionPage />);

    await waitFor(() => {
      expect(screen.getByText('No artwork found')).toBeInTheDocument();
    });
  });

  it('handles corrupted non-array localStorage data safely', async () => {
    localStorage.setItem('favorites', JSON.stringify({ invalid: true }));

    render(<CollectionPage />);

    await waitFor(() => {
      expect(screen.getByText('No artwork found')).toBeInTheDocument();
    });
  });
});
