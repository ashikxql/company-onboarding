"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ADDRESSES, GEO_ADDRESS, TRAVEL_MAX, TRAVEL_MIN } from "@/lib/data";
import { isStepComplete, useOnboarding } from "@/lib/store";
import { Check, Crosshair, Pin, Spinner } from "../Icons";
import { HelpModal } from "../Modal";
import { StepShell } from "../Shell";
import { FieldHead } from "../ui";

function AddressCombobox({
  value,
  onSelect,
  onClear,
}: {
  value?: string;
  onSelect: (address: string) => void;
  onClear: () => void;
}) {
  const listId = useId();
  const [query, setQuery] = useState(value ?? "");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const wrap = useRef<HTMLDivElement>(null);

  // Reflect addresses set from outside (e.g. "Use my location"); never wipe what the user is typing.
  useEffect(() => {
    if (value) setQuery(value);
  }, [value]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const q = query.trim().toLowerCase();
  const results = q && q !== value?.toLowerCase() ? ADDRESSES.filter((a) => a.toLowerCase().includes(q)) : ADDRESSES;

  const choose = (a: string) => {
    onSelect(a);
    setQuery(a);
    setOpen(false);
  };

  return (
    <div className="combo" ref={wrap}>
      <div className={`input-wrap ${open ? "is-focus" : ""}`}>
        <Pin size={20} className="input-icon" />
        <input
          className="input input-with-icon"
          placeholder="Search by address"
          value={query}
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-label="Work address"
          aria-activedescendant={open && results[active] ? `${listId}-${active}` : undefined}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActive(0);
            if (value) onClear();
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
              setActive((i) => Math.min(i + 1, results.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((i) => Math.max(i - 1, 0));
            } else if (e.key === "Enter" && open && results[active]) {
              e.preventDefault();
              choose(results[active]);
            } else if (e.key === "Escape") {
              setOpen(false);
            }
          }}
        />
      </div>
      {open && (
        <ul className="dropdown" id={listId} role="listbox">
          {results.length === 0 && <li className="dropdown-empty">No addresses found</li>}
          {results.map((a, i) => (
            <li
              key={a}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={a === value}
              className={`dropdown-item address-item ${i === active ? "is-active" : ""}`}
              onMouseDown={(e) => e.preventDefault()}
              onMouseEnter={() => setActive(i)}
              onClick={() => choose(a)}
            >
              <Pin size={20} className="muted-icon" />
              <span>{a}</span>
              {a === value && <Check size={20} className="item-check" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function TravelSlider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const pct = ((value - TRAVEL_MIN) / (TRAVEL_MAX - TRAVEL_MIN)) * 100;
  return (
    <div className="slider-block">
      <div className="slider-value">{value} minutes</div>
      <div className="slider" style={{ "--pct": `${pct}%` } as React.CSSProperties}>
        <span className="slider-bubble" style={{ left: `${pct}%` }} aria-hidden="true">
          {value} minutes
        </span>
        <input
          type="range"
          min={TRAVEL_MIN}
          max={TRAVEL_MAX}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label="Maximum travel distance in minutes"
          aria-valuetext={`${value} minutes`}
        />
      </div>
      <div className="slider-scale">
        <span>{TRAVEL_MIN} minutes</span>
        <span>{TRAVEL_MAX} minutes</span>
      </div>
    </div>
  );
}

export function LocationStep() {
  const { state, update } = useOnboarding();
  const [help, setHelp] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);

  const useMyLocation = () => {
    setLocating(true);
    // Simulated reverse-geocoding lookup. Swap for navigator.geolocation + a geocoding API.
    setTimeout(() => {
      update({ address: GEO_ADDRESS, addressFromGeo: true });
      setLocating(false);
    }, 900);
  };

  return (
    <StepShell step="location" canContinue={isStepComplete("location", state)}>
      <FieldHead
        title="Work address"
        desc="Search and select where the work takes place. Only the area is shown to workers."
        onHelp={() => setHelp("address")}
      />
      <div className="address-row">
        <AddressCombobox
          value={state.address}
          onSelect={(a) => update({ address: a, addressFromGeo: false })}
          onClear={() => update({ address: undefined, addressFromGeo: false })}
        />
        <button type="button" className="btn btn-soft btn-locate" onClick={useMyLocation} disabled={locating}>
          {locating ? <Spinner size={20} /> : <Crosshair size={20} />}
          {locating ? "Locating…" : "Use my location"}
        </button>
      </div>
      {state.addressFromGeo && state.address && (
        <p className="msg msg-success">We found your work address. Feel free to edit it if needed.</p>
      )}

      {state.address && (
        <div className="section">
          <FieldHead
            title="Maximum travel distance"
            desc="How far the worker will travel to reach the job."
            onHelp={() => setHelp("travel")}
          />
          <TravelSlider value={state.travel} onChange={(travel) => update({ travel })} />
        </div>
      )}
      <HelpModal topic={help} onClose={() => setHelp(null)} />
    </StepShell>
  );
}
