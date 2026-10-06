'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Header.module.css';

export default function Header({
  page,
  query,
}: {
  page?: number;
  query?: string;
}) {
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      { pathname !== '/collection' &&
        (<p className={styles.links}>
          <Link href={'/collection'}>Collection</Link>
        </p>)
      }
      <form method="get" action="/">
        <input type="text" name="q" defaultValue={query ?? ''}></input>
        <input type="submit" value="Search"></input>
      </form>
      { query && <p>Page { page }</p> }
    </header>
  );
}