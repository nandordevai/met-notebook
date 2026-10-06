'use client';

import { useState, useEffect } from 'react';
import Pagination from '@/components/Pagination';
import ArtworkGrid from '@/components/ArtworkGrid';
import styles from './Results.module.css';

const API_URL = 'https://collectionapi.metmuseum.org/public/collection/v1.1/search';

export default function Results({
  query,
  page,
  }: {
  query: string;
  page: number;
}) {
  const pageSize = 12;
  const [ids, setIds] = useState<number[]>([]);

  function buildQueryURL() {
    return `${API_URL}?q=${query}&title=true&hasImage=true&offset=${(page - 1) * pageSize}&limit=${pageSize}`;
  }

  useEffect(() => {
    async function load() {
      if (query) {
        // TODO: make search always return 12 items with image
        const response = await fetch(buildQueryURL());
        const result = await response.json();
        setIds(result.objectIDs);
      }
    }

    load();
  }, [query, page]);

  return (
    <>
      <section className={styles.page}>
        <ArtworkGrid ids={ids} />
      </section>
      <Pagination page={page} query={query} />
    </>
  );
}