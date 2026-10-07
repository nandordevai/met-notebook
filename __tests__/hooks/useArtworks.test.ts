import { renderHook, waitFor } from '@testing-library/react';
import { useArtworks } from '@/hooks/useArtworks';

describe('useArtworks hook', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it('returns initial loading state', () => {
    (global.fetch as jest.Mock).mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useArtworks([1, 2]));

    expect(result.current.loading).toBe(true);
    expect(result.current.artworks).toEqual([]);
  });

  it('fetches artwork data for provided IDs and resolves loading', async () => {
    const mockArtwork1 = {
      objectID: 10,
      title: 'Artwork Ten',
      artistDisplayName: 'Artist A',
      objectDate: '1900',
      primaryImageSmall: 'https://images.metmuseum.org/10.jpg',
    };
    const mockArtwork2 = {
      objectID: 20,
      title: 'Artwork Twenty',
      artistDisplayName: 'Artist B',
      objectDate: '1910',
      primaryImageSmall: 'https://images.metmuseum.org/20.jpg',
    };

    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('/10')) {
        return Promise.resolve({ json: () => Promise.resolve(mockArtwork1) });
      }
      if (url.includes('/20')) {
        return Promise.resolve({ json: () => Promise.resolve(mockArtwork2) });
      }
      return Promise.reject(new Error('Unknown URL'));
    });

    const { result } = renderHook(() => useArtworks([10, 20]));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.artworks).toEqual([mockArtwork1, mockArtwork2]);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://collectionapi.metmuseum.org/public/collection/v1/objects/10'
    );
    expect(global.fetch).toHaveBeenCalledWith(
      'https://collectionapi.metmuseum.org/public/collection/v1/objects/20'
    );
  });

  it('handles empty IDs array', async () => {
    const { result } = renderHook(() => useArtworks([]));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.artworks).toEqual([]);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('handles API errors gracefully and stops loading', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useArtworks([999]));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(consoleSpy).toHaveBeenCalledWith('API error');
    expect(result.current.artworks).toEqual([]);
  });

  it('re-fetches when IDs change', async () => {
    const mockItem1 = {
      objectID: 1,
      title: 'First',
      artistDisplayName: '',
      objectDate: '',
      primaryImageSmall: '',
    };
    const mockItem2 = {
      objectID: 2,
      title: 'Second',
      artistDisplayName: '',
      objectDate: '',
      primaryImageSmall: '',
    };

    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('/1')) {
        return Promise.resolve({ json: () => Promise.resolve(mockItem1) });
      }
      if (url.includes('/2')) {
        return Promise.resolve({ json: () => Promise.resolve(mockItem2) });
      }
      return Promise.reject(new Error('Unknown URL'));
    });

    const { result, rerender } = renderHook(({ ids }) => useArtworks(ids), {
      initialProps: { ids: [1] },
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.artworks).toEqual([mockItem1]);

    rerender({ ids: [2] });

    await waitFor(() => {
      expect(result.current.artworks).toEqual([mockItem2]);
    });
  });
});

