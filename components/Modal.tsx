"use client";

import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { Close, Play } from "./Icons";
import { HELP, HOW_IT_WORKS } from "@/lib/data";
import { HelpPanel } from "./Sidebar";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  labelledBy?: string;
  className?: string;
  children: React.ReactNode;
}

export function Modal({ open, onClose, labelledBy, className = "", children }: ModalProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && ref.current) {
        const items = ref.current.querySelectorAll<HTMLElement>(
          'button, [href], input, [tabindex]:not([tabindex="-1"])'
        );
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    ref.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      previous?.focus();
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;
  return createPortal(
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={ref} role="dialog" aria-modal="true" aria-labelledby={labelledBy} className={`modal ${className}`}>
        {children}
      </div>
    </div>,
    document.body
  );
}

/** Small "What is this?" explainer */
export function HelpModal({ topic, onClose }: { topic: string | null; onClose: () => void }) {
  const id = useId();
  const content = topic ? HELP[topic] : null;
  return (
    <Modal open={!!content} onClose={onClose} labelledBy={id} className="modal-help">
      <div className="modal-grid" aria-hidden="true" />
      <button className="icon-btn modal-close" onClick={onClose} aria-label="Close">
        <Close size={22} />
      </button>
      {content && (
        <>
          <h2 id={id} className="modal-help-title">
            {content.title}
          </h2>
          <p className="modal-help-body">{content.body}</p>
          <button className="btn btn-outline btn-block" onClick={onClose} data-autofocus>
            Got it
          </button>
        </>
      )}
    </Modal>
  );
}

export function HowItWorksModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const id = useId();
  return (
    <Modal open={open} onClose={onClose} labelledBy={id} className="modal-how">
      <div className="modal-how-head">
        <button className="icon-btn" onClick={onClose} aria-label="Close" data-autofocus>
          <Close size={20} />
        </button>
        <h2 id={id}>How it works</h2>
      </div>
      <div className="modal-how-body">
        <div className="video">
          <button className="video-play" aria-label="Play video">
            <Play size={22} />
          </button>
        </div>
        <h3>Hire a worker in minutes</h3>
        <ol className="how-list">
          {HOW_IT_WORKS.map((s, i) => (
            <li key={s.title}>
              <span className="how-num">{i + 1}</span>
              <div>
                <strong>{s.title}</strong>
                <p>{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Modal>
  );
}

export function NeedHelpModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const id = useId();
  return (
    <Modal open={open} onClose={onClose} labelledBy={id} className="modal-how">
      <div className="modal-how-head">
        <button className="icon-btn" onClick={onClose} aria-label="Close" data-autofocus>
          <Close size={20} />
        </button>
        <h2 id={id}>Need help?</h2>
      </div>
      <div className="modal-how-body">
        <HelpPanel />
      </div>
    </Modal>
  );
}
