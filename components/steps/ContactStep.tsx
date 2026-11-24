"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { sendEmailCode } from "@/lib/api";
import { COMPANIES } from "@/lib/data";
import { isEmail, isPhone, isStepComplete, useOnboarding } from "@/lib/store";
import { stepHref } from "@/lib/steps";
import { Check, ChevronDown, ChevronUp } from "../Icons";
import { HelpModal } from "../Modal";
import { StepShell } from "../Shell";
import { FieldHead } from "../ui";

function CompanyCombobox({
  value,
  onChange,
}: {
  value: string;
  onChange: (name: string, existing: boolean) => void;
}) {
  const listId = useId();
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const [filtering, setFiltering] = useState(false);
  const [active, setActive] = useState(0);
  const wrap = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrap.current?.contains(e.target as Node)) close();
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const q = query.trim();
  const matches = q && filtering ? COMPANIES.filter((c) => c.toLowerCase().includes(q.toLowerCase())) : COMPANIES;
  const exact = COMPANIES.find((c) => c.toLowerCase() === q.toLowerCase());
  const options: { label: string; value: string; existing: boolean; add?: boolean }[] = [
    ...(q && !exact && filtering ? [{ label: q, value: q, existing: false, add: true }] : []),
    ...matches.map((c) => ({ label: c, value: c, existing: true })),
  ];

  const choose = (o: (typeof options)[number]) => {
    onChange(o.value, o.existing);
    setQuery(o.value);
    setFiltering(false);
    setOpen(false);
  };
  const close = () => {
    setFiltering(false);
    setOpen(false);
  };

  return (
    <div className="combo" ref={wrap}>
      <div className={`input-wrap ${open ? "is-focus" : ""}`}>
        <input
          ref={input}
          id="company"
          className="input input-with-trail"
          placeholder="Select"
          value={query}
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={open && options[active] ? `${listId}-${active}` : undefined}
          autoComplete="organization"
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            const v = e.target.value;
            const match = COMPANIES.find((c) => c.toLowerCase() === v.trim().toLowerCase());
            setQuery(v);
            setFiltering(true);
            setOpen(true);
            setActive(0);
            // A typed name that isn't in the list is kept as a new company.
            onChange(match ?? v.trim(), !!match);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
              setActive((i) => Math.min(i + 1, options.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((i) => Math.max(i - 1, 0));
            } else if (e.key === "Enter" && open && options[active]) {
              e.preventDefault();
              choose(options[active]);
            } else if (e.key === "Escape") close();
          }}
        />
        <button
          type="button"
          className="input-trail"
          tabIndex={-1}
          aria-label={open ? "Close list" : "Open list"}
          onClick={() => (open ? close() : (setOpen(true), input.current?.focus()))}
        >
          {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>
      {open && options.length > 0 && (
        <ul className="dropdown" id={listId} role="listbox">
          {options.map((o, i) => (
            <li
              key={(o.add ? "add:" : "") + o.value}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={o.value === value}
              className={`dropdown-item ${i === active ? "is-active" : ""}`}
              onMouseDown={(e) => e.preventDefault()}
              onMouseEnter={() => setActive(i)}
              onClick={() => choose(o)}
            >
              {o.add ? (
                <span>
                  Add &quot;<strong>{o.label}</strong>&quot;
                </span>
              ) : (
                <span>{o.label}</span>
              )}
              {o.value === value && !o.add && <Check size={20} className="item-check" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function ContactStep() {
  const { state, update } = useOnboarding();
  const router = useRouter();
  const [help, setHelp] = useState<string | null>(null);
  const [touched, setTouched] = useState({ email: false, phone: false });
  const [sending, setSending] = useState(false);

  const emailErr = touched.email && state.email !== "" && !isEmail(state.email);
  const phoneErr = touched.phone && state.phone !== "" && !isPhone(state.phone);

  const onContinue = async () => {
    if (state.emailConfirmed) {
      router.push(stepHref("review"));
      return;
    }
    setSending(true);
    await sendEmailCode(state.email);
    setSending(false);
    router.push(stepHref("confirm"));
  };

  return (
    <StepShell step="contact" canContinue={isStepComplete("contact", state)} onContinue={onContinue} busy={sending}>
      <FieldHead
        title="Where should we send them?"
        desc="Add your company details and we'll send your matches straight to your inbox."
        onHelp={() => setHelp("contact")}
      />
      <div className="form">
        <div className="form-field">
          <label htmlFor="company" className="label">
            Company name
          </label>
          <CompanyCombobox
            value={state.company}
            onChange={(company, companyExisting) => update({ company, companyExisting })}
          />
        </div>
        <div className="form-field">
          <label htmlFor="email" className="label">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            className={`input ${emailErr ? "is-error" : ""}`}
            placeholder="Enter your email"
            autoComplete="email"
            value={state.email}
            aria-invalid={emailErr}
            aria-describedby={emailErr ? "email-err" : undefined}
            onChange={(e) => update({ email: e.target.value.trim() })}
            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
          />
          {emailErr && (
            <p id="email-err" className="msg msg-error">
              Enter a valid email address
            </p>
          )}
        </div>
        <div className="form-field">
          <label htmlFor="phone" className="label">
            Phone Number
          </label>
          <div className={`phone ${phoneErr ? "is-error" : ""}`}>
            <span className="phone-prefix">DK +45</span>
            <input
              id="phone"
              type="tel"
              inputMode="numeric"
              className="input"
              placeholder="12 34 56 78"
              autoComplete="tel-national"
              value={state.phone}
              aria-invalid={phoneErr}
              aria-describedby={phoneErr ? "phone-err" : undefined}
              onChange={(e) => update({ phone: e.target.value.replace(/[^\d ]/g, "").slice(0, 13) })}
              onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
            />
          </div>
          {phoneErr && (
            <p id="phone-err" className="msg msg-error">
              Enter a valid phone number
            </p>
          )}
        </div>
      </div>
      <HelpModal topic={help} onClose={() => setHelp(null)} />
    </StepShell>
  );
}
