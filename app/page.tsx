import ArtworkCard from '@/components/ArtworkCard';
import Header from '@/components/Header';
import styles from './page.module.css';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{q?: string, page?: string}>;
}) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const pageSize = 12;
  const query = params.q ?? '';
  let artworks;
  if (query) {
    // TODO: make search always return 12 items with image
    const response = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1.1/search?q=flora&title=true&hasImage=true&offset=${(page - 1) * pageSize}&limit=${pageSize}`);
    const result = await response.json();
    artworks = await Promise.all(
      result.objectIDs.map(async (id: number) => {
        const response = await fetch(
          `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`
        );
        return response.json();
      })
    );
  }

  return (
    <>
      <Header page={page} query={params.q}/>
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
            <a href={`/?q=flora&page=${page - 1}`}>Previous</a>
            <a href={`/?q=flora&page=${page + 1}`}>Next</a>
          </p>
        </div>
      }
    </>
  );
}