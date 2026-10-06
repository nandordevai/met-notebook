'use client';

import { useEffect, useState } from 'react';
import ArtworkGrid from '@/components/ArtworkGrid';
import Header from '@/components/Header';
import styles from '../page.module.css';

export default function CollectionPage() {
  const [ids, setIds] = useState<number[]>([]);

  useEffect(() => {
    async function loadCollection() {
      const ids = JSON.parse(localStorage.getItem('favorites') ?? '{}') || [];
      setIds(ids);
    }

    loadCollection();
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