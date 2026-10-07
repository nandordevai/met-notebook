import { render, screen, waitFor } from '@testing-library/react';
import ArtworkGrid from '@/components/ArtworkGrid';

describe('ArtworkGrid component', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = jest.fn();
    localStorage.clear();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it('displays loading indicator initially while fetching data', async () => {
    (global.fetch as jest.Mock).mockReturnValue(new Promise(() => {})); // pending promise

    render(<ArtworkGrid ids={[1, 2]} />);

    expect(screen.getByText('Loading results...')).toBeInTheDocument();
  });

  it('renders "No artwork found" when ids is empty', async () => {
    render(<ArtworkGrid ids={[]} />);

    await waitFor(() => {
      expect(screen.queryByText('Loading results...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('No artwork found')).toBeInTheDocument();
  });

  it('fetches artwork for each ID and renders ArtworkCard for items with images', async () => {
    const mockArtwork1 = {
      objectID: 101,
      title: 'Water Lilies',
      artistDisplayName: 'Claude Monet',
      objectDate: '1919',
      primaryImageSmall: 'https://images.metmuseum.org/CRDImages/ep/web-large/monet.jpg',
    };
    const mockArtwork2 = {
      objectID: 102,
      title: 'Starry Night',
      artistDisplayName: 'Vincent van Gogh',
      objectDate: '1889',
      primaryImageSmall: 'https://images.metmuseum.org/CRDImages/ep/web-large/vangogh.jpg',
    };

    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('/101')) {
        return Promise.resolve({ json: () => Promise.resolve(mockArtwork1) });
      }
      if (url.includes('/102')) {
        return Promise.resolve({ json: () => Promise.resolve(mockArtwork2) });
      }
      return Promise.reject(new Error('Unknown URL'));
    });

    render(<ArtworkGrid ids={[101, 102]} />);

    await waitFor(() => {
      expect(screen.getByText('Water Lilies')).toBeInTheDocument();
      expect(screen.getByText('Starry Night')).toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalledWith(
      'https://collectionapi.metmuseum.org/public/collection/v1/objects/101'
    );
    expect(global.fetch).toHaveBeenCalledWith(
      'https://collectionapi.metmuseum.org/public/collection/v1/objects/102'
    );
  });

  it('filters out artworks that lack a primaryImageSmall', async () => {
    const artworkWithImage = {
      objectID: 201,
      title: 'Has Image Artwork',
      artistDisplayName: 'Artist One',
      objectDate: '1900',
      primaryImageSmall: 'https://images.metmuseum.org/CRDImages/ep/web-large/has-image.jpg',
    };
    const artworkWithoutImage = {
      objectID: 202,
      title: 'No Image Artwork',
      artistDisplayName: 'Artist Two',
      objectDate: '1900',
      primaryImageSmall: '',
    };

    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('/201')) {
        return Promise.resolve({ json: () => Promise.resolve(artworkWithImage) });
      }
      return Promise.resolve({ json: () => Promise.resolve(artworkWithoutImage) });
    });

    render(<ArtworkGrid ids={[201, 202]} />);

    await waitFor(() => {
      expect(screen.getByText('Has Image Artwork')).toBeInTheDocument();
    });

    expect(screen.queryByText('No Image Artwork')).not.toBeInTheDocument();
  });

  it('handles fetch API errors gracefully without crashing', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network failure'));

    render(<ArtworkGrid ids={[301]} />);

    await waitFor(() => {
      expect(screen.queryByText('Loading results...')).not.toBeInTheDocument();
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith('API error');
  });
});

