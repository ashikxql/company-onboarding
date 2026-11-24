"use client";

import { useEffect } from "react";
import { Check, Close } from "./Icons";

export function FieldHead({
  title,
  desc,
  onHelp,
  id,
}: {
  title: string;
  desc?: string;
  onHelp?: () => void;
  id?: string;
}) {
  return (
    <div className="field-head">
      <div className="field-title-row">
        <h3 className="field-title" id={id}>
          {title}
        </h3>
        {onHelp && (
          <button type="button" className="link" onClick={onHelp}>
            What is this?
          </button>
        )}
      </div>
      {desc && <p className="field-desc">{desc}</p>}
    </div>
  );
}

export function RadioCard({
  name,
  checked,
  label,
  onChange,
}: {
  name: string;
  checked: boolean;
  label: string;
  onChange: () => void;
}) {
  return (
    <label className={`option ${checked ? "is-selected" : ""}`}>
      <input type="radio" name={name} checked={checked} onChange={onChange} className="sr-only" />
      <span className="radio" aria-hidden="true" />
      <span>{label}</span>
    </label>
  );
}

export function CheckCard({
  checked,
  disabled,
  label,
  onChange,
}: {
  checked: boolean;
  disabled?: boolean;
  label: string;
  onChange: () => void;
}) {
  return (
    <label className={`option ${checked ? "is-selected" : ""} ${disabled ? "is-disabled" : ""}`}>
      <input type="checkbox" checked={checked} disabled={disabled} onChange={onChange} className="sr-only" />
      <span className="checkbox" aria-hidden="true">
        {checked && <Check size={14} strokeWidth={3} />}
      </span>
      <span>{label}</span>
    </label>
  );
}

export function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className="toast" role="status">
      <Check size={18} />
      <span>{message}</span>
      <button className="toast-close" onClick={onClose} aria-label="Dismiss">
        <Close size={16} />
      </button>
    </div>
  );
}
