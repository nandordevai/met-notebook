'use client';

import { useState, useEffect } from 'react';
import { Artwork } from '@/components/ArtworkCard';

export function useArtworks(ids: number[]) {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const results = await Promise.all(
          ids.map(async (id) => {
            const response = await fetch(
              `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`
            );
            return response.json();
          })
        );

        setArtworks(results);
      } catch {
        console.error('API error');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [ids]);

  return { artworks, loading };
}
