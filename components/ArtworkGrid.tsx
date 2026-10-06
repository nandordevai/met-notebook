'use client';

import { useState, useEffect } from 'react';
import ArtworkCard from '@/components/ArtworkCard';
import Loading from '@/components/Loading';
import styles from './ArtworkGrid.module.css';

export default function ArtworkGrid({
  ids,
}: {
  ids: number[];
}) {
  const [artworks, setArtworks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const results = await Promise.all(
          ids.map(async (id) => {
            const response = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`);
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

  if (loading) {
    return <Loading />
  }

  return ids.length > 0 ? (
    <div className={styles.artworks}>
      {artworks.filter((artwork) => artwork.primaryImageSmall).map((artwork) => (
        <ArtworkCard key={artwork.objectID} artwork={artwork} />
      ))}
    </div>
   ) : (
    <div className={styles.empty}>No artwork found</div>
  );
}