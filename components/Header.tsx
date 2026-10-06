'use client';

import Link from 'next/link';
import styles from './Header.module.css';

export default function Header({
  page,
  query,
}: {
  page?: number;
  query?: string;
}) {
  return (
    <header className={styles.header}>
      <p className={styles.links}>
        <Link href={'/collection'}>Collection</Link>
      </p>
      <form method="get" action="/">
        <input type="text" name="q" defaultValue={query ?? ''}></input>
        <input type="submit" value="Search"></input>
      </form>
      { query && <p>Page { page }</p> }
    </header>
  );
}