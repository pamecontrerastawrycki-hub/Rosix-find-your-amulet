/**
 * The early-2000s application window that frames every screen.
 * Generic OS chrome only — no logo, typeface or identity belonging to anyone.
 */

import type { ReactNode } from 'react';

interface WindowFrameProps {
  title: string;
  children: ReactNode;
  wide?: boolean;
}

export function WindowFrame({ title, children, wide = false }: WindowFrameProps) {
  return (
    <div className={`shell${wide ? ' shell--wide' : ''}`}>
      <div className="window">
        <div className="window__bar">
          <span className="window__dots" aria-hidden="true">
            <span className="window__dot" />
            <span className="window__dot" />
            <span className="window__dot" />
          </span>
          <span className="window__title">{title}</span>
        </div>
        <div className="window__body">{children}</div>
      </div>
    </div>
  );
}
