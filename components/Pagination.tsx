import Link from 'next/link';
import styles from './Pagination.module.css';

export default function Pagination({
  page,
  query,
}: {
  page: number;
  query: string;
}) {
  return (
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
  )
}