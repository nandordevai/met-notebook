import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ArtworkCard, { Artwork } from '@/components/ArtworkCard';

describe('ArtworkCard component', () => {
  const mockArtwork: Artwork = {
    objectID: 12345,
    title: 'Self-Portrait with a Straw Hat',
    artistDisplayName: 'Vincent van Gogh',
    objectDate: '1887',
    primaryImageSmall: 'https://images.metmuseum.org/CRDImages/ep/web-large/DT1502.jpg',
  };

  beforeEach(() => {
    localStorage.clear();
  });

  it('renders artwork image with correct src and alt attributes', () => {
    render(<ArtworkCard artwork={mockArtwork} />);

    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', mockArtwork.primaryImageSmall);
    expect(img).toHaveAttribute('alt', mockArtwork.title);
  });

  it('renders title without truncation when <= 60 characters', () => {
    render(<ArtworkCard artwork={mockArtwork} />);

    // mockArtwork.title is 31 chars
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(mockArtwork.title);
  });

  it('truncates title with ellipsis when exceeding 60 characters', () => {
    const longTitleArtwork: Artwork = {
      ...mockArtwork,
      title: 'A Very Long Title That Definitely Exceeds Sixty Characters In Length And Should Be Truncated By The Function',
    };

    render(<ArtworkCard artwork={longTitleArtwork} />);

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading.textContent).toContain('…');
    expect(heading.textContent!.length).toBeLessThan(longTitleArtwork.title.length);
  });

  it('renders "Save" button when artwork is not in localStorage favorites', () => {
    render(<ArtworkCard artwork={mockArtwork} />);

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Save');
  });

  it('renders "Unsave" button when artwork is already in localStorage favorites', () => {
    localStorage.setItem('favorites', JSON.stringify([12345, 67890]));

    render(<ArtworkCard artwork={mockArtwork} />);

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Unsave');
  });

  it('saves artwork to favorites when clicking Save', async () => {
    const user = userEvent.setup();
    render(<ArtworkCard artwork={mockArtwork} />);

    const button = screen.getByRole('button', { name: 'Save' });
    await user.click(button);

    expect(screen.getByRole('button', { name: 'Unsave' })).toBeInTheDocument();
    const stored = JSON.parse(localStorage.getItem('favorites') ?? '[]');
    expect(stored).toEqual([12345]);
  });

  it('preserves existing favorites when saving a new artwork', async () => {
    localStorage.setItem('favorites', JSON.stringify([99999]));
    const user = userEvent.setup();

    render(<ArtworkCard artwork={mockArtwork} />);

    await user.click(screen.getByRole('button', { name: 'Save' }));

    const stored = JSON.parse(localStorage.getItem('favorites') ?? '[]');
    expect(stored).toEqual([99999, 12345]);
  });

  it('removes artwork from favorites when clicking Unsave', async () => {
    localStorage.setItem('favorites', JSON.stringify([99999, 12345]));
    const user = userEvent.setup();

    render(<ArtworkCard artwork={mockArtwork} />);

    const button = screen.getByRole('button', { name: 'Unsave' });
    await user.click(button);

    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    const stored = JSON.parse(localStorage.getItem('favorites') ?? '[]');
    expect(stored).toEqual([99999]);
  });
});

