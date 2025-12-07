"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./Map.module.css";

type Step = {
  id: string;
  title: string;
  xy: { x: number; y: number }; // % of stage
  icon: string;
  size?: number;                 // px
  bullets: string[];
  side?: "left" | "right";
};

/* Your positions/sizes exactly as you’ve been using them */
const RAW_STEPS: Step[] = [
  {
    id: "arch",
    title: "Arch — Purpose",
    xy: { x: 48, y: 7.5 },
    icon: "/Arch.png",
    size: 65,
    bullets: [
      "The First Amendment provides the right to freedom of expression, speech, and peaceful assembly.",
      "UGA’s Freedom of Expression policy ensures opportunities are provided on an equal basis, remaining content- and viewpoint-neutral, with guidelines that keep a safe, non-disruptive environment.",
      "Hate speech can offend, attack, threaten, or insult individuals or groups—but there is no general “hate speech” exception to the First Amendment. Public institutions (including UGA) cannot punish protected speech simply because it’s hateful.",
    ],
  },
  {
    id: "fountain",
    title: "Fountain — Definitions",
    xy: { x: 52, y: 29.5 },
    icon: "/Outline_Fountain.png",
    size: 55,
    bullets: [
      "Designated Forums: high-traffic areas available for speeches, demonstrations, and events — Tate Plaza, Memorial Plaza, and Northwest Lawn.",
      "Expressive Activity: First-Amendment-protected activity including speeches, demonstrations, marches, protests, picketing, literature distribution, and signage.",
      "University Community: anyone enrolled at or employed by the University.",
      "Non-University-Affiliated Speakers: individuals or groups not part of the University Community.",
      "Spontaneous Expressive Activity: unplanned responses to events or news within 48 hours.",
    ],
  },
  {
    id: "lawn",
    title: "North West Lawn — Additional Provisions",
    xy: { x: 46.5, y: 84 },
    icon: "/NW_LAWN.png",
    size: 175,
    bullets: [
      "Written materials may be distributed person-to-person in outdoor, publicly accessible areas.",
      "Promotions must identify the University Community sponsor (individual or organization).",
      "Organizations/individuals are financially liable for damages or property destruction.",
      "All materials must be removed at the conclusion; the University isn’t responsible for items left behind.",
    ],
  },
  {
    id: "tate",
    title: "Tate Plaza — Non-UGA Affiliates",
    xy: { x: 62, y: 88.5 },
    icon: "/TATE_PLAZA.png",
    size: 165,
    bullets: [
      "Non-University-Affiliated speakers may use only the Designated Forums, Monday–Friday, 8:00am–9:00pm, with a reservation.",
    ],
  },
  {
    id: "memorial",
    title: "Memorial Plaza — Expressive Activity",
    xy: { x: 80, y: 78.5 },
    icon: "/MEMORIAL_PLAZA.png",
    size: 190,
    bullets: [
      "University Community members may use any outdoor, publicly accessible campus areas for expressive activity without a reservation.",
      "Reservations for Designated Forums can be requested ≥48 hours in advance through the Associate VP for Student Affairs.",
      "Requests may be denied if a space is unavailable or cannot accommodate the event.",
    ],
  },
  {
    id: "police",
    title: "UGA Police — Public Safety",
    xy: { x: 93, y: 5 },
    icon: "/Outline_PD.png",
    size: 65,
    bullets: [
      "UGA Police maintain ultimate discretion for campus safety and may end any activity if it threatens safety.",
      "A security fee may be charged if size/manner of audience requires personnel for safety.",
      "The University may modify or end expressive activity if it poses a threat to public health.",
    ],
  },
];

export default function Map() {
  const [active, setActive] = useState<string | null>(null);

  // right-third → open to the left
  const steps = useMemo(
    () => RAW_STEPS.map(s => ({ ...s, side: s.xy.x > 66 ? "left" : "right" as const })),
    []
  );

  const scrollRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  // Refs for the specific open card/pin so we can measure
  const pinRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const setPinRef = (id: string) => (el: HTMLButtonElement | null) => { pinRefs.current[id] = el; };
  const setCardRef = (id: string) => (el: HTMLDivElement | null) => { cardRefs.current[id] = el; };

  const toggle = (id: string) => setActive(prev => (prev === id ? null : id));

  // When a card opens (or on scroll/resize), nudge it so it's not hidden under the header or offscreen
  useEffect(() => {
    const scroller = scrollRef.current;
    const sticky = stickyRef.current;
    const id = active;
    if (!scroller || !sticky || !id) return;

    const nudge = () => {
      const card = cardRefs.current[id];
      if (!card) return;

      // reset before measuring
      card.style.setProperty("--card-shift-x", "0px");
      card.style.setProperty("--card-shift-y", "0px");

      const cardRect = card.getBoundingClientRect();
      const stickyRect = sticky.getBoundingClientRect();

      // 1) keep clear of sticky header (top)
      const margin = 12; // breathing room
      let dy = 0;
      const stickyBottom = stickyRect.bottom;
      if (cardRect.top < stickyBottom + margin) {
        dy = (stickyBottom + margin) - cardRect.top;
      }

      // 2) keep inside left/right edges of the viewport
      let dx = 0;
      const leftGap = 8;
      const rightGap = 8;
      if (cardRect.left < leftGap) dx = leftGap - cardRect.left;
      const overflowR = (window.innerWidth - rightGap) - cardRect.right;
      if (overflowR < 0) dx = overflowR; // negative moves left

      // apply
      card.style.setProperty("--card-shift-x", `${dx}px`);
      card.style.setProperty("--card-shift-y", `${dy}px`);
    };

    nudge();
    scroller.addEventListener("scroll", nudge, { passive: true });
    window.addEventListener("resize", nudge);

    return () => {
      scroller.removeEventListener("scroll", nudge);
      window.removeEventListener("resize", nudge);
    };
  }, [active]);

  return (
    <section id="map" className={styles.section} aria-labelledby="map-heading">
      <div className={styles.shell}>
        <div ref={scrollRef} className={styles.scroll}>
          {/* Sticky header band (the thing we avoid overlapping) */}
          <div ref={stickyRef} className={styles.sticky}>
            <div className={styles.stickyInner}>
              <h2 id="map-heading" className={styles.heading}>Learn Your Rights</h2>
              <p className={styles.sub}>
                Hover or tap each spot on the map to learn about your rights at each campus location.
              </p>
            </div>
          </div>

          {/* Tall stage that scrolls under the sticky band */}
          <div className={styles.stage} role="application" aria-label="Campus map">
            <Image src="/Map.svg" alt="" fill className={styles.mapImage} priority={false} />

            {steps.map((s) => {
              const isOpen = active === s.id;
              return (
                <div
                  key={s.id}
                  className={`${styles.marker} ${isOpen ? styles.markerActive : ""}`}
                  style={{ left: `${s.xy.x}%`, top: `${s.xy.y}%` }}
                >
                  <button
                    ref={setPinRef(s.id)}
                    className={styles.pin}
                    style={s.size ? { width: s.size, height: s.size } : undefined}
                    onClick={() => toggle(s.id)}
                    aria-expanded={isOpen}
                    aria-controls={`card-${s.id}`}
                  >
                    <Image
                      src={s.icon}
                      alt=""
                      width={s.size ?? 72}
                      height={s.size ?? 72}
                      className={styles.pinImg}
                    />
                  </button>

                  <div
                    ref={setCardRef(s.id)}
                    id={`card-${s.id}`}
                    className={[
                      styles.card,
                      isOpen ? styles.cardOpen : "",
                      s.side === "left" ? styles.cardLeft : styles.cardRight,
                    ].join(" ")}
                    role="dialog"
                    aria-label={s.title}
                  >
                    <h3 className={styles.cardTitle}>{s.title}</h3>
                    <ul className={styles.cardList}>
                      {s.bullets.map((b, i) => <li key={i}>{b}</li>)}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile fallback (unchanged) */}
          <ol className={styles.mobileList}>
            {steps.map((s) => {
              const open = active === s.id;
              return (
                <li key={s.id} className={styles.mobileItem}>
                  <button
                    className={styles.mobileHeader}
                    onClick={() => toggle(s.id)}
                    aria-expanded={open}
                    aria-controls={`m-card-${s.id}`}
                  >
                    <Image src={s.icon} alt="" width={40} height={40} className={styles.mobileIcon}/>
                    <span className={styles.mobileTitle}>{s.title}</span>
                  </button>
                  <div
                    id={`m-card-${s.id}`}
                    className={`${styles.mobileCard} ${open ? styles.mobileCardOpen : ""}`}
                  >
                    <ul className={styles.cardList}>
                      {s.bullets.map((b, i) => <li key={i}>{b}</li>)}
                    </ul>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
