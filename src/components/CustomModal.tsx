/**
 * "YOUR STONE IS STILL BEING FOUND."
 *
 * Shown when MAKE IT YOURS is pressed while `customAvailable` is false.
 * There is deliberately no fake checkout and no invented stone inventory here.
 *
 * Uses a native <dialog>, so focus trapping, Escape and inertness of the page
 * behind it come from the platform rather than hand-rolled JavaScript.
 */

import { useEffect, useRef } from 'react';
import { siteConfig } from '../data/siteConfig';

interface CustomModalProps {
  open: boolean;
  onClose: () => void;
  /** Where "TELL ME WHEN" should go once a real destination exists. */
  onNotify: () => void;
}

export function CustomModal({ open, onClose, onNotify }: CustomModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const { modal } = siteConfig.custom;

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="modal"
      aria-labelledby="custom-modal-title"
      onClose={onClose}
      onClick={(event) => {
        // Clicking the backdrop (the dialog element itself) dismisses it.
        if (event.target === ref.current) onClose();
      }}
    >
      <div className="modal__panel">
        <div className="modal__stone" aria-hidden="true">
          ✦
        </div>

        <h2 className="display modal__title" id="custom-modal-title">
          {modal.title}
        </h2>

        <div className="modal__body">
          {modal.body.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>

        <div className="modal__actions">
          <button type="button" className="btn btn--primary" onClick={onNotify}>
            {modal.buttonLabel}
          </button>
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            Back to my result
          </button>
        </div>
      </div>
    </dialog>
  );
}
