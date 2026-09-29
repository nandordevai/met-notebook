'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ArtworkCard, { Artwork } from '@/components/ArtworkCard';
import styles from '../page.module.css';
import headerStyles from '@/components/Header.module.css';

export default function CollectionPage() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);

  useEffect(() => {
    async function loadCollection() {
      const ids = JSON.parse(localStorage.getItem('favorites') ?? '{}') || [];

      const results = await Promise.all(
        ids.map(async (id: number) => {
          const response = await fetch(
            `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`
          );

          return response.json();
        })
      );

      setArtworks(results);
    }

    loadCollection();
  }, []);

  return (
    <>
      <header className={headerStyles.header}>
        <p className={styles.links}>
          <Link href={'/'}>Search</Link>
        </p>
      </header>
      { artworks &&
        <section className={styles.page}>
          <h1>Collection</h1>
          <div className={styles.artworks}>
            {artworks.filter((artwork) => artwork.primaryImageSmall).map((artwork) => (
              <ArtworkCard key={artwork.objectID} artwork={artwork} />
            ))}
          </div>
        </section>
      }
    </>
  );
}