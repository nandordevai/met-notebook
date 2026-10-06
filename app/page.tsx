import Header from '@/components/Header';
import Results from '@/components/Results';
import styles from './page.module.css';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const query = params.q ?? '';

  return (
    <>
      <Header page={page} query={query} />
      <section className={styles.page}>
        <Results page={page} query={query} />
      </section>
    </>
  );
}