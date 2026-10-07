'use client';

import { useEffect, useState } from 'react';
import ArtworkGrid from '@/components/ArtworkGrid';
import Header from '@/components/Header';
import styles from '../page.module.css';

export default function CollectionPage() {
  const [ids, setIds] = useState<number[]>([]);

  useEffect(() => {
    const favorites = localStorage.getItem('favorites');
    const ids = favorites ? JSON.parse(favorites) : [];
    setIds(Array.isArray(ids) ? ids : []);
  }, []);

  return (
    <>
      <Header />
      <section className={styles.page}>
        <h1>Collection</h1>
        <ArtworkGrid ids={ids} />
      </section>
    </>
  );
}