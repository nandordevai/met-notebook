'use client';

import ArtworkCard from '@/components/ArtworkCard';
import Loading from '@/components/Loading';
import { useArtworks } from '@/hooks/useArtworks';
import styles from './ArtworkGrid.module.css';

export default function ArtworkGrid({
  ids,
}: {
  ids: number[];
}) {
  const { artworks, loading } = useArtworks(ids);

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