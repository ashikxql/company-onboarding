"use client";

import { useState } from "react";
import { FAQ } from "@/lib/data";
import { Chat, ChevronDown, ChevronUp } from "./Icons";

export function ChatCard() {
  return (
    <a className="side-card chat-card" href="#chat" onClick={(e) => e.preventDefault()}>
      <span className="chat-icon">
        <Chat size={22} />
      </span>
      <span>
        <strong>Need help? Chat with us</strong>
        <span className="muted">Our chatbot answers most questions instantly.</span>
      </span>
    </a>
  );
}

export function FaqCard() {
  const [open, setOpen] = useState(0);
  return (
    <section className="side-card">
      <h2 className="side-title">Frequently asked questions</h2>
      <ul className="faq">
        {FAQ.map((item, i) => {
          const isOpen = open === i;
          return (
            <li key={item.q}>
              <button
                className="faq-q"
                aria-expanded={isOpen}
                aria-controls={`faq-${i}`}
                onClick={() => setOpen(isOpen ? -1 : i)}
              >
                <span>{item.q}</span>
                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              <p id={`faq-${i}`} className="faq-a" hidden={!isOpen}>
                {item.a}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function AboutCard() {
  return (
    <section className="side-card">
      <h2 className="side-title">About us</h2>
      <p className="about">
        PowerMatch is a Danish staffing platform. We match companies with qualified workers using our own scoring
        algorithm — over 12.000 skilled professionals ready to work.
      </p>
      <p className="about-foot">© PowerMatch ApS · CVR-nr: 40021892</p>
    </section>
  );
}

/** Chat + FAQ + About, used in the desktop sidebar, the mobile role page and the "Need help" sheet. */
export function HelpPanel() {
  return (
    <div className="help-panel">
      <ChatCard />
      <FaqCard />
      <AboutCard />
    </div>
  );
}
