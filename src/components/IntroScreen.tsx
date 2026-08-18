/**
 * The first thing anyone sees, usually one tap after an Instagram story.
 * Job: say what this is, look irresistible, and get out of the way.
 */

import { siteConfig } from '../data/siteConfig';
import { CharacterArtwork } from './CharacterArtwork';
import { Sparkle } from './Sparkle';

interface IntroScreenProps {
  onStart: () => void;
}

export function IntroScreen({ onStart }: IntroScreenProps) {
  const { intro } = siteConfig;

  return (
    <section className="intro anim-enter" aria-labelledby="intro-title">
      <div className="intro__meta">
        {intro.meta.map((item) => (
          <span key={item} className="meta">
            {item}
          </span>
        ))}
      </div>

      <h1 className="display intro__title" id="intro-title">
        WHICH <mark>ROSIX GIRL</mark> ARE YOU?
      </h1>

      <div className="intro__art">
        {/* Decorative stars, purely CSS-animated. */}
        <Sparkle
          size={26}
          className="sparkle sparkle--turn"
          style={{ top: '4%', right: '6%' }}
        />
        <Sparkle
          size={18}
          className="sparkle"
          style={{ top: '30%', left: '2%' }}
          color="var(--rosix-pink)"
        />
        <Sparkle
          size={14}
          className="sparkle sparkle--slow"
          style={{ bottom: '14%', right: '10%' }}
        />

        <CharacterArtwork
          src={intro.coverImage}
          alt={intro.coverAlt}
          label="Cover girl"
          priority
          float
          flash
          sizes="(min-width: 30rem) 22rem, 88vw"
        />
      </div>

      <div className="intro__lines">
        <p className="intro__primary">{intro.primaryLine}</p>
        <p className="intro__secondary">{intro.secondaryLine}</p>
      </div>

      <button type="button" className="btn btn--primary btn--block" onClick={onStart}>
        {intro.startLabel}
      </button>

      <p className="intro__footnote">Found you for a reason.</p>
    </section>
  );
}
