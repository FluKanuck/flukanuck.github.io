/* ============================================================
   Identity — logo concepts + naming exploration
   Six logo marks, five name variants. Marks use currentColor so
   they re-tone with the palette.
   ============================================================ */

const LOGO_MARKS = [
  {
    id: "type",
    name: "Typographic",
    desc: "Display-italic, hairline rule, mono subtitle. Most editorial — sits naturally on the dossier page. Best for headers, book covers, the title screen.",
    tags: ["primary", "wordmark", "no mark"],
    render: ({ tone }) => (
      <svg viewBox="0 0 360 200" style={{ width: "100%", height: "100%", display: "block" }}>
        <text x="180" y="80" textAnchor="middle"
              fontFamily="Cormorant Garamond, serif" fontStyle="italic" fontWeight="600"
              fontSize="58" fill="currentColor" letterSpacing="-1">
          Hunter Hunted
        </text>
        <line x1="60" y1="100" x2="300" y2="100" stroke="currentColor" strokeWidth="1"/>
        <text x="180" y="130" textAnchor="middle"
              fontFamily="IBM Plex Mono, monospace" fontWeight="500"
              fontSize="14" fill={tone} letterSpacing="0.32em">
          IRON · TIDE
        </text>
        <text x="180" y="160" textAnchor="middle"
              fontFamily="IBM Plex Mono, monospace"
              fontSize="9" fill="currentColor" opacity="0.55" letterSpacing="0.4em">
          KAISERLICHE · MARINE · MCMLV
        </text>
      </svg>
    ),
  },
  {
    id: "monogram",
    name: "HH Monogram",
    desc: "Two H's sharing a waterline crossbar — split above/below evokes the hunter/hunted duality. Good app-icon scale; reads tight at 32 px.",
    tags: ["icon", "monogram", "app mark"],
    render: ({ tone }) => (
      <svg viewBox="0 0 200 200" style={{ width: "100%", height: "100%", display: "block" }}>
        <rect x="20" y="20" width="160" height="160" fill="none" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="40" y="50"  width="10" height="100" fill="currentColor"/>
        <rect x="80" y="50"  width="10" height="100" fill="currentColor"/>
        <rect x="110" y="50" width="10" height="100" fill="currentColor"/>
        <rect x="150" y="50" width="10" height="100" fill="currentColor"/>
        <rect x="40"  y="96" width="120" height="8" fill={tone}/>
        <rect x="99" y="38" width="2" height="14" fill="currentColor"/>
        <text x="100" y="180" textAnchor="middle" fontFamily="IBM Plex Mono, monospace"
              fontSize="10" letterSpacing="0.32em" fill="currentColor">
          HUNTER · HUNTED
        </text>
      </svg>
    ),
  },
  {
    id: "periscope",
    name: "Periscope Eye",
    desc: "Crosshair reticle with stadimeter ticks. Pure tactical iconography. Excellent for loading screens, scope HUDs, multiplayer lobby avatars.",
    tags: ["icon", "tactical", "in-game"],
    render: ({ tone }) => (
      <svg viewBox="0 0 200 200" style={{ width: "100%", height: "100%", display: "block" }}>
        <circle cx="100" cy="100" r="78" fill="none" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="100" cy="100" r="58" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.5"/>
        <circle cx="100" cy="100" r="24" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.5"/>
        <line x1="22"  y1="100" x2="178" y2="100" stroke="currentColor" strokeWidth="1"/>
        <line x1="100" y1="22"  x2="100" y2="178" stroke="currentColor" strokeWidth="1"/>
        {[-60, -40, -20, 20, 40, 60].map((d) => (
          <line key={d} x1={100+d} y1="96" x2={100+d} y2="104" stroke="currentColor" strokeWidth="1"/>
        ))}
        <rect x="118" y="92" width="18" height="6" fill={tone}/>
        <rect x="121" y="86" width="3" height="6" fill={tone}/>
        <text x="100" y="190" textAnchor="middle" fontFamily="IBM Plex Mono, monospace"
              fontSize="9" letterSpacing="0.3em" fill="currentColor" opacity="0.75">
          BRG 274
        </text>
      </svg>
    ),
  },
  {
    id: "sonar",
    name: "Sonar Arc",
    desc: "Quarter-arc bearing display with numbered ticks and a single ping. Hints at the Lauschangriff — listening attack. Quiet, focused, distinctly naval.",
    tags: ["icon", "diegetic", "atmospheric"],
    render: ({ tone }) => (
      <svg viewBox="0 0 200 200" style={{ width: "100%", height: "100%", display: "block" }}>
        <g transform="translate(100, 130)">
          {[100, 80, 60, 40].map((r) => (
            <path key={r} d={`M ${-r} 0 A ${r} ${r} 0 0 1 ${r} 0`}
                  fill="none" stroke="currentColor" strokeWidth={r === 100 ? 1.6 : 0.6}
                  opacity={r === 100 ? 1 : 0.45}/>
          ))}
          {[-90, -60, -30, 0, 30, 60, 90].map((d) => {
            const rad = (d - 90) * Math.PI / 180;
            const x1 = Math.cos(rad) * 96;
            const y1 = Math.sin(rad) * 96;
            const x2 = Math.cos(rad) * 104;
            const y2 = Math.sin(rad) * 104;
            const lx = Math.cos(rad) * 116;
            const ly = Math.sin(rad) * 116 + 4;
            const lbl = String(((d + 360 + 270) % 360)).padStart(3, "0");
            return (
              <g key={d}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="1.2"/>
                {(d === -60 || d === 0 || d === 60) && (
                  <text x={lx} y={ly} textAnchor="middle"
                        fontFamily="IBM Plex Mono, monospace" fontSize="9"
                        fill="currentColor" opacity="0.6" letterSpacing="0.14em">
                    {lbl}
                  </text>
                )}
              </g>
            );
          })}
          <line x1="0" y1="0" x2="22" y2="-80" stroke={tone} strokeWidth="2"/>
          <circle cx="22" cy="-80" r="5" fill={tone}/>
          <circle cx="22" cy="-80" r="14" fill="none" stroke={tone} strokeWidth="1" opacity="0.5"/>
          <circle cx="0" cy="0" r="4" fill="currentColor"/>
        </g>
        <text x="100" y="184" textAnchor="middle" fontFamily="IBM Plex Mono, monospace"
              fontSize="9" letterSpacing="0.3em" fill="currentColor" opacity="0.75">
          HUNTER · HUNTED
        </text>
      </svg>
    ),
  },
  {
    id: "tide",
    name: "Iron Tide",
    desc: "Three rising parallel hatch-rules over a deep horizon — the tide itself. Most abstract, most poster-friendly. Pairs well with the typographic mark above it.",
    tags: ["secondary", "supporting", "poster"],
    render: ({ tone }) => (
      <svg viewBox="0 0 200 200" style={{ width: "100%", height: "100%", display: "block" }}>
        <rect x="22" y="22" width="156" height="156" fill="none" stroke="currentColor" strokeWidth="1"/>
        <line x1="40" y1="118" x2="160" y2="118" stroke="currentColor" strokeWidth="1.4"/>
        {[0, 1, 2].map((i) => {
          const y = 138 + i * 8;
          const w = 110 - i * 14;
          const x = (200 - w) / 2;
          return (
            <g key={i}>
              <line x1={x} y1={y} x2={x + w} y2={y} stroke={tone} strokeWidth="2.2" opacity={1 - i * 0.15}/>
              <g stroke="currentColor" strokeWidth="0.5" opacity="0.35">
                {Array.from({length: Math.floor(w / 4)}).map((_, j) => (
                  <line key={j} x1={x + j * 4} y1={y + 1} x2={x + j * 4 - 3} y2={y + 4}/>
                ))}
              </g>
            </g>
          );
        })}
        <circle cx="100" cy="76" r="22" fill="none" stroke="currentColor" strokeWidth="1.2"/>
        <line x1="78" y1="76" x2="122" y2="76" stroke="currentColor" strokeWidth="0.6" opacity="0.45"/>
        <text x="100" y="190" textAnchor="middle" fontFamily="IBM Plex Mono, monospace"
              fontSize="9" letterSpacing="0.3em" fill="currentColor" opacity="0.7">
          IRON · TIDE
        </text>
      </svg>
    ),
  },
  {
    id: "seal",
    name: "Tactical Seal",
    desc: "Dossier-stamp form — bordered emblem with a hull silhouette, year, and curved type. Most institutional; reads as squadron heraldry. End-credits, limited-edition packaging.",
    tags: ["heraldic", "stamp", "credit"],
    render: ({ tone }) => (
      <svg viewBox="0 0 200 200" style={{ width: "100%", height: "100%", display: "block" }}>
        <circle cx="100" cy="100" r="88" fill="none" stroke="currentColor" strokeWidth="2"/>
        <circle cx="100" cy="100" r="76" fill="none" stroke="currentColor" strokeWidth="0.8"/>
        <defs>
          <path id="topCurve" d="M 28 100 A 72 72 0 0 1 172 100"/>
          <path id="botCurve" d="M 28 100 A 72 72 0 0 0 172 100"/>
        </defs>
        <text fontFamily="IBM Plex Mono, monospace" fontSize="10" letterSpacing="0.4em"
              fill="currentColor">
          <textPath href="#topCurve" startOffset="50%" textAnchor="middle">
            HUNTER · HUNTED
          </textPath>
        </text>
        <text fontFamily="IBM Plex Mono, monospace" fontSize="9" letterSpacing="0.4em"
              fill="currentColor" opacity="0.7">
          <textPath href="#botCurve" startOffset="50%" textAnchor="middle">
            IRON · TIDE · MCMLV
          </textPath>
        </text>
        <g transform="translate(100, 100)">
          <line x1="-46" y1="6" x2="46" y2="6" stroke="currentColor" strokeWidth="0.6" opacity="0.5"/>
          <path d="M -42 0 Q -34 -6 -20 -7 L 22 -7 Q 38 -6 42 0 Q 34 6 22 6 L -20 6 Q -36 6 -42 0 Z"
                fill="currentColor"/>
          <rect x="-3" y="-14" width="6" height="8" fill="currentColor"/>
          <line x1="0" y1="-22" x2="0" y2="-14" stroke="currentColor" strokeWidth="1"/>
          <g transform="translate(-58, 0)" fill={tone}>
            <polygon points="0,-3 1,-1 3,0 1,1 0,3 -1,1 -3,0 -1,-1"/>
          </g>
          <g transform="translate(58, 0)" fill={tone}>
            <polygon points="0,-3 1,-1 3,0 1,1 0,3 -1,1 -3,0 -1,-1"/>
          </g>
        </g>
        <line x1="40" y1="100" x2="60" y2="100" stroke="currentColor" strokeWidth="0.8"/>
        <line x1="140" y1="100" x2="160" y2="100" stroke="currentColor" strokeWidth="0.8"/>
      </svg>
    ),
  },
];

const NAME_VARIANTS = [
  {
    id: "hh_iron",
    name: "Hunter Hunted: Iron Tide",
    style: "Series-title form",
    weight: "Primary recommendation",
    pros: [
      "Strongest packaging — name + subtitle gives storefronts a hook.",
      "Subtitle ties the universe to the era (1955, Iron Tide chapter).",
      "Sequel / expansion-friendly: 'Hunter Hunted: <Next>' scales.",
    ],
    cons: [
      "Six words. Long on a steam shelf.",
      "Subtitle does heavy lifting in conversation.",
    ],
    feel: "Cinematic, expansion-ready. Like a published war series.",
  },
  {
    id: "hh_plain",
    name: "Hunter Hunted",
    style: "Two-word concept",
    weight: "Tight & punchy",
    pros: [
      "Owns the verb. Two roles, one game.",
      "Easy to say. Easy to search.",
      "Captures the doctrine inversion the project is about.",
    ],
    cons: [
      "Doesn't signal era or theatre — could read as any predator/prey title.",
      "Less protectable on its own without a mark.",
    ],
    feel: "Trade-paperback thriller. Survival-doctrine focus.",
  },
  {
    id: "hh_comma",
    name: "Hunter, Hunted",
    style: "Comma rhetorical",
    weight: "Editorial / literary",
    pros: [
      "The pivot lives in the punctuation — typographically interesting.",
      "Pairs beautifully with the dossier aesthetic.",
      "Stronger pause; you hear it spoken slowly.",
    ],
    cons: [
      "Storefront listings strip punctuation — degrades to 'Hunter Hunted'.",
      "URL / handle gymnastics.",
    ],
    feel: "Le Carré on cover. Quiet, attritional, deliberate.",
  },
  {
    id: "iron_tide",
    name: "The Iron Tide",
    style: "Universe-only",
    weight: "Atmosphere-first",
    pros: [
      "Sets era and theatre instantly.",
      "Allows companion titles ('The Iron Tide: <Boat>') for variants.",
      "Already the in-fiction name for the period.",
    ],
    cons: [
      "Loses the hunter/hunted hook entirely.",
      "Less retrievable in search — many 'tide' games and films.",
    ],
    feel: "Naval-history-shelf. Reads as a campaign book.",
  },
  {
    id: "hh_slash",
    name: "Hunter / Hunted",
    style: "Slash split",
    weight: "Experimental",
    pros: [
      "Visually distinctive on a marquee.",
      "Modern, indie tonality.",
    ],
    cons: [
      "Same listing-strip problem as the comma.",
      "Pronounced 'Hunter slash Hunted' is awkward.",
    ],
    feel: "Festival-circuit indie. A bit too modern for the period fiction.",
  },
];

/* ---------- Wordmark renderer per name variant ---------- */
function NameDisplay({ variant }) {
  const base = {
    fontFamily: "Cormorant Garamond, serif",
    fontWeight: 600,
    fontStyle: "italic",
    color: "var(--ink)",
    lineHeight: 1,
  };
  if (variant === "hh_iron") {
    return (
      <div>
        <div style={{ ...base, fontSize: 38, letterSpacing: "-0.01em" }}>Hunter Hunted</div>
        <div style={{ height: 1, background: "var(--ink)", margin: "10px 0", width: 320 }}/>
        <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 13, letterSpacing: "0.3em", color: "var(--accent)", textTransform: "uppercase" }}>
          Iron · Tide
        </div>
      </div>
    );
  }
  if (variant === "hh_plain") {
    return <div style={{ ...base, fontSize: 48, letterSpacing: "-0.015em" }}>Hunter Hunted</div>;
  }
  if (variant === "hh_comma") {
    return (
      <div style={{ ...base, fontSize: 44, letterSpacing: "-0.015em" }}>
        Hunter<span style={{ color: "var(--accent)", fontStyle: "normal", fontWeight: 700 }}>,</span> Hunted
      </div>
    );
  }
  if (variant === "iron_tide") {
    return (
      <div>
        <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 11, letterSpacing: "0.32em", color: "var(--ink-muted)", marginBottom: 8 }}>
          THE
        </div>
        <div style={{ ...base, fontStyle: "normal", fontSize: 50, letterSpacing: "-0.01em", color: "var(--ink)" }}>
          Iron Tide
        </div>
      </div>
    );
  }
  if (variant === "hh_slash") {
    return (
      <div style={{ ...base, fontSize: 44, letterSpacing: "-0.015em", display: "flex", alignItems: "baseline", gap: 14 }}>
        <span>Hunter</span>
        <span style={{ fontFamily: "IBM Plex Sans, sans-serif", fontStyle: "normal", fontSize: 36, fontWeight: 300, color: "var(--accent)" }}>/</span>
        <span>Hunted</span>
      </div>
    );
  }
  return null;
}

/* ---------- The section component ---------- */
function IdentitySection({ subRoute }) {
  const [selectedMark, setSelectedMark] = useState(subRoute || "type");
  const [nameVariant, setNameVariant] = useState("hh_iron");
  const [bg, setBg] = useState("paper");

  React.useEffect(() => {
    if (subRoute && subRoute !== selectedMark) setSelectedMark(subRoute);
  }, [subRoute]);

  const mark = LOGO_MARKS.find((m) => m.id === selectedMark);

  const stageBg = {
    paper:  { bg: "var(--bg-warm)",  fg: "var(--ink)",   accent: "var(--accent)" },
    dark:   { bg: "#0e1014",         fg: "#f6f1de",      accent: "var(--accent)" },
    accent: { bg: "var(--accent)",   fg: "var(--bg)",    accent: "var(--bg-warm)" },
  }[bg];

  return (
    <div className="section-body">
      <p>
        This section is for deciding what the project looks and sounds like. Six logo directions and
        five name variants are laid out below for comparison; the marks re-tone with whichever
        palette you've set in Tweaks. Pick what you'd like to carry forward into briefing artwork.
      </p>

      {/* ---------- Mark grid ---------- */}
      <div>
        <h2 style={{ marginBottom: 4 }}>Six logo directions</h2>
        <p style={{ color: "var(--ink-muted)", fontFamily: "Cormorant Garamond, serif", fontStyle: "italic", fontSize: 18, margin: "0 0 16px" }}>
          From most editorial to most heraldic. Click any mark to focus it on the stage below.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {LOGO_MARKS.map((m) => (
            <button key={m.id}
                    onClick={() => setSelectedMark(m.id)}
                    style={{
                      padding: 0, background: "var(--bg-warm)",
                      border: `1px solid ${selectedMark === m.id ? "var(--accent)" : "var(--rule-strong)"}`,
                      cursor: "pointer", color: "inherit", fontFamily: "inherit",
                      display: "flex", flexDirection: "column",
                      boxShadow: selectedMark === m.id ? "0 6px 18px rgba(0,0,0,0.18)" : "var(--paper-shadow)",
                      transition: "border-color .18s, box-shadow .18s",
                    }}>
              <div style={{
                aspectRatio: "4 / 3",
                padding: 18,
                background: "var(--bg)",
                borderBottom: "1px solid var(--rule-strong)",
                color: "var(--ink)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {m.render({ tone: "var(--accent)" })}
              </div>
              <div style={{ padding: "12px 14px 14px", textAlign: "left", flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                  <span className="serif" style={{ fontSize: 18, fontWeight: 500, color: "var(--ink)" }}>
                    {m.name}
                  </span>
                  <span className="mono" style={{ fontSize: 9.5, letterSpacing: "0.16em", color: "var(--ink-faint)", textTransform: "uppercase" }}>
                    {selectedMark === m.id ? "● Selected" : "OPT"}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: "var(--ink-muted)", lineHeight: 1.45, marginBottom: 8 }}>
                  {m.desc}
                </div>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {m.tags.map((t) => (
                    <span key={t} className="chip" style={{ fontSize: 9 }}>{t}</span>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ---------- Focused mark stage ---------- */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
          <h2 style={{ margin: 0 }}>Stage — {mark.name}</h2>
          <div style={{ display: "flex", gap: 6 }}>
            {[
              { id: "paper",  lbl: "Paper" },
              { id: "dark",   lbl: "Dark" },
              { id: "accent", lbl: "Accent" },
            ].map((b) => (
              <button key={b.id}
                      onClick={() => setBg(b.id)}
                      className="chip"
                      style={{
                        background: bg === b.id ? "var(--ink)" : "transparent",
                        color: bg === b.id ? "var(--bg)" : "var(--ink-muted)",
                        borderColor: bg === b.id ? "var(--ink)" : "var(--rule-strong)",
                        cursor: "pointer", padding: "4px 10px",
                      }}>
                {b.lbl}
              </button>
            ))}
          </div>
        </div>
        <div style={{
          background: stageBg.bg,
          color: stageBg.fg,
          padding: "56px 40px",
          border: "1px solid var(--rule-strong)",
          display: "flex", alignItems: "center", justifyContent: "center",
          minHeight: 320,
          boxShadow: "var(--paper-shadow)",
        }}>
          <div style={{ width: 380, height: 240 }}>
            {mark.render({ tone: stageBg.accent })}
          </div>
        </div>
        <p style={{ marginTop: 10, fontSize: 12, color: "var(--ink-muted)", fontFamily: "IBM Plex Mono", letterSpacing: "0.06em" }}>
          The marks use <code>currentColor</code> for the primary ink and a tone-shifted accent for the focal — they re-tone with the palette automatically.
        </p>
      </div>

      {/* ---------- Naming exploration ---------- */}
      <div>
        <h2 style={{ marginBottom: 4 }}>Naming — five variants</h2>
        <p style={{ color: "var(--ink-muted)", fontFamily: "Cormorant Garamond, serif", fontStyle: "italic", fontSize: 18, margin: "0 0 16px" }}>
          What we call this thing. Each variant lays the wordmark out the way it would actually be set.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {NAME_VARIANTS.map((v) => (
            <button key={v.id}
                    onClick={() => setNameVariant(v.id)}
                    style={{
                      background: nameVariant === v.id ? "var(--bg-warm)" : "var(--bg)",
                      border: `1px solid ${nameVariant === v.id ? "var(--accent)" : "var(--rule-strong)"}`,
                      padding: 0, cursor: "pointer", color: "inherit",
                      fontFamily: "inherit", textAlign: "left",
                      display: "grid", gridTemplateColumns: "1.2fr 1fr",
                      boxShadow: nameVariant === v.id ? "0 6px 18px rgba(0,0,0,0.18)" : "var(--paper-shadow)",
                      transition: "all .18s",
                    }}>
              <div style={{
                padding: "32px 28px",
                borderRight: "1px solid var(--rule-strong)",
                display: "flex", flexDirection: "column", justifyContent: "center",
                minHeight: 140,
              }}>
                <NameDisplay variant={v.id}/>
                <div style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "center" }}>
                  <span className="mono" style={{ fontSize: 9.5, letterSpacing: "0.18em", color: "var(--ink-muted)", textTransform: "uppercase" }}>
                    {v.style}
                  </span>
                  <span style={{
                    fontFamily: "IBM Plex Mono, monospace", fontSize: 9.5, letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    padding: "2px 8px",
                    background: v.id === "hh_iron" ? "var(--accent)" : "transparent",
                    color: v.id === "hh_iron" ? "var(--bg)" : "var(--ink-muted)",
                    border: `1px solid ${v.id === "hh_iron" ? "var(--accent)" : "var(--rule-strong)"}`,
                  }}>
                    {v.weight}
                  </span>
                </div>
              </div>
              <div style={{ padding: "20px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, fontSize: 12.5 }}>
                <div>
                  <div className="mono" style={{ fontSize: 9, letterSpacing: "0.2em", color: "var(--blueprint)", marginBottom: 6 }}>FOR</div>
                  <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 4 }}>
                    {v.pros.map((p, i) => (
                      <li key={i} style={{ paddingLeft: 12, position: "relative", lineHeight: 1.4 }}>
                        <span style={{ position: "absolute", left: 0, top: 2, color: "var(--blueprint)" }}>+</span>{p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="mono" style={{ fontSize: 9, letterSpacing: "0.2em", color: "var(--accent)", marginBottom: 6 }}>AGAINST</div>
                  <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 4 }}>
                    {v.cons.map((p, i) => (
                      <li key={i} style={{ paddingLeft: 12, position: "relative", lineHeight: 1.4 }}>
                        <span style={{ position: "absolute", left: 0, top: 2, color: "var(--accent)" }}>−</span>{p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div style={{ gridColumn: "1 / -1", borderTop: "1px solid var(--rule)", paddingTop: 8, fontStyle: "italic", fontFamily: "Cormorant Garamond, serif", fontSize: 15, color: "var(--ink-muted)" }}>
                  {v.feel}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ---------- Recommendation ---------- */}
      <div className="callout">
        Working recommendation: <strong>Hunter Hunted: Iron Tide</strong> as the canonical full title
        for packaging and press; <strong>Hunter Hunted</strong> as the conversational short form; the
        typographic wordmark as the primary lockup, the Periscope Eye for in-game / HUD use, and the
        Tactical Seal for end-credits.
        <cite>— open to debate</cite>
      </div>
    </div>
  );
}

window.IdentitySection = IdentitySection;
