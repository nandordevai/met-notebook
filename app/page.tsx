'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ArtworkCard from '@/components/ArtworkCard';
import Header from '@/components/Header';
import styles from './page.module.css';

const API_URL = 'https://collectionapi.metmuseum.org/public/collection/v1.1/search';

export default function Home() {
  const params = useSearchParams();
  const page = Number(params.get('page') ?? 1);
  const pageSize = 12;
  const query = params.get('q') ?? '';
  const [artworks, setArtworks] = useState<any[]>([]);

  function buildQueryURL() {
    return `${API_URL}?q=${query}&title=true&hasImage=true&offset=${(page - 1) * pageSize}&limit=${pageSize}`;
  }

  useEffect(() => {
    async function load() {
      if (query) {
        // TODO: make search always return 12 items with image
        const response = await fetch(buildQueryURL());
        const result = await response.json();
        const artworks = await Promise.all(
          result.objectIDs.map(async (id: number) => {
            const response = await fetch(
              `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`
            );
            return response.json();
          })
        );
        setArtworks(artworks);
      }
    }
    load();
  }, [query, page]);

  return (
    <>
      <Header page={page} query={query}/>
      { artworks &&
        <section className={styles.page}>
          <div className={styles.artworks}>
            {artworks.filter((artwork) => artwork.primaryImageSmall).map((artwork) => (
              <ArtworkCard key={artwork.objectID} artwork={artwork} />
            ))}
          </div>
        </section>
      }
      { artworks &&
        <div className={styles.pagination}>
          <p>Page {page}</p>
          <p>
            {page > 1 && (
              <Link href={`/?q=${encodeURIComponent(query)}&page=${page - 1}`}>
                Previous
              </Link>
            )}
            <Link href={`/?q=${encodeURIComponent(query)}&page=${page + 1}`}>
              Next
            </Link>
          </p>
        </div>
      }
    </>
  );
}