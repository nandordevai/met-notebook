import { render, screen, waitFor } from '@testing-library/react';
import Results from '@/components/Results';

describe('Results component', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = jest.fn();
    localStorage.clear();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it('does not fetch when query is empty', async () => {
    render(<Results query="" page={1} />);

    expect(global.fetch).not.toHaveBeenCalled();
    // ArtworkGrid receives empty ids, so it displays "No artwork found"
    await waitFor(() => {
      expect(screen.getByText('No artwork found')).toBeInTheDocument();
    });
  });

  it('fetches search API with correct offset for page 1', async () => {
    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('/search')) {
        return Promise.resolve({
          json: () => Promise.resolve({ objectIDs: [436535] }),
        });
      }
      if (url.includes('/objects/436535')) {
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

    render(<Results query="wheat field" page={1} />);

    expect(global.fetch).toHaveBeenCalledWith(
      'https://collectionapi.metmuseum.org/public/collection/v1.1/search?q=wheat field&title=true&hasImage=true&offset=0&limit=12'
    );

    await waitFor(() => {
      expect(screen.getByText('Wheat Field with Cypresses')).toBeInTheDocument();
    });

    // Pagination should render page 1 info
    expect(screen.getByText('Page 1')).toBeInTheDocument();
  });

  it('calculates correct offset for page 2', async () => {
    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('/search')) {
        return Promise.resolve({
          json: () => Promise.resolve({ objectIDs: [] }),
        });
      }
      return Promise.reject(new Error('Unknown URL'));
    });

    render(<Results query="sunflowers" page={2} />);

    expect(global.fetch).toHaveBeenCalledWith(
      'https://collectionapi.metmuseum.org/public/collection/v1.1/search?q=sunflowers&title=true&hasImage=true&offset=12&limit=12'
    );

    await waitFor(() => {
      expect(screen.getByText('No artwork found')).toBeInTheDocument();
    });

    expect(screen.getByText('Page 2')).toBeInTheDocument();
  });
});

