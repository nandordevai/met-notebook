'use client';

import { useEffect, useState } from 'react';
import styles from './ArtworkCard.module.css';

export interface Artwork {
  objectID: number;
  title: string;
  artistDisplayName: string;
  objectDate: string;
  primaryImageSmall: string;
};

function truncate(text: string) {
  const newText = text.split(' ').reduce((acc, curr) => {
    if (curr.length + acc.length <= 60) {
      acc += ` ${curr}`;
    }
    return acc;
  }, '');
  return newText.length < text.length ? `${newText}…` : newText;
}

export default function ArtworkCard({ artwork }: {
  artwork: Artwork;
}) {
  function addOrRemove() {
    const existing = JSON.parse(localStorage.getItem('favorites') ?? '[]');
    const updated = isSaved() ?
      existing.filter((item: number) => item !== artwork.objectID) :
      [...existing, artwork.objectID];
    localStorage.setItem('favorites', JSON.stringify(updated));
    setSaved(!saved);
  }

  function isSaved() {
    const favorites: number[] = JSON.parse(localStorage.getItem('favorites') ?? '[]');
    return favorites.includes(artwork.objectID);
  }

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isSaved());
  });

  return (
    <article className={styles.card}>
      <h2 className={styles.title}>{truncate(artwork.title)}</h2>
      <button onClick={addOrRemove}>{ saved ? 'Unsave' : 'Save'}</button>
      <img
        className={styles.image}
        src={artwork.primaryImageSmall}
        alt={artwork.title}
      />
    </article>
  );
}