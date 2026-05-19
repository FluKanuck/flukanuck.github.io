/* ============================================================
   Sonar mid-fi station mockup (per design doc §3.2)

   Seated console arc — operator at GHG bearing scope.
   Periphery: ESM forward-right, S-Gerät forward-left,
   Geräuschbuch right, magic-eye overhead. Lighting per colour class:
   red ambient · amber GHG · green magic-eye · blue-white ESM.
   ============================================================ */

function SonarStation({ style = "diegetic" }) {
  const [suchlauf, setSuchlauf] = useState(true);
  const [headphones, setHeadphones] = useState(true);
  const [focus, setFocus] = useState("ghg");
  const [leanIn, setLeanIn] = useState(false);
  const [bookTab, setBookTab] = useState("destroyer");
  const isDiegetic = style === "diegetic";

  return (
    <div style={{
      background: isDiegetic ? "#1a0a0a" : "var(--bg-warm)",
      border: "1px solid var(--rule-strong)",
      padding: 0,
      boxShadow: "var(--paper-shadow)",
      overflow: "hidden",
      color: isDiegetic ? "#f6f1de" : "var(--ink)",
    }}>
      {/* Top status bar — red-light discipline */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        alignItems: "center",
        padding: "10px 18px",
        background: isDiegetic ? "#240e0e" : "var(--bg-deep)",
        borderBottom: "1px solid rgba(255, 80, 80, 0.25)",
        fontFamily: "IBM Plex Mono, monospace",
        fontSize: 11,
        letterSpacing: "0.14em",
        color: isDiegetic ? "#ff8a7a" : "var(--ink-muted)",
        textTransform: "uppercase",
      }}>
        <div style={{ display: "flex", gap: 16 }}>
          <span>HORCHRAUM · U-241</span>
          <span style={{ color: isDiegetic ? "#ffb143" : "var(--ink)" }}>● {headphones ? "Headphones engaged" : "Off-ears"}</span>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {[
            { id: "ghg",  lbl: "GHG · Bearing" },
            { id: "esm",  lbl: "FuMB ESM" },
            { id: "sgrt", lbl: "S-Gerät" },
            { id: "book", lbl: "Geräuschbuch" },
          ].map((f) => (
            <button key={f.id} onClick={() => setFocus(f.id)}
                    style={{
                      padding: "4px 10px",
                      background: focus === f.id
                        ? (isDiegetic ? "#ff8a4a" : "var(--ink)")
                        : "transparent",
                      color: focus === f.id ? "#1a0a0a" : "inherit",
                      border: `1px solid ${isDiegetic ? "rgba(255, 138, 122, 0.3)" : "var(--rule-strong)"}`,
                      fontFamily: "IBM Plex Mono", fontSize: 10, letterSpacing: "0.14em",
                      cursor: "pointer", textTransform: "uppercase",
                    }}>
              {f.lbl}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 16, justifyContent: "flex-end" }}>
          <span>Watch: Bauer · Sonar 9 · ●●●●</span>
          <span style={{ color: leanIn ? "#ffb143" : "inherit" }}>LEAN {leanIn ? "IN" : "REST"}</span>
        </div>
      </div>

      {/* Main console arc */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1.6fr 1fr",
        gap: 0,
        minHeight: 600,
        background: isDiegetic ? "radial-gradient(ellipse at top, #2a0d0d 0%, #1a0606 80%)" : "var(--bg-warm)",
      }}>
        {/* LEFT — S-Gerät + audio knobs + silent state */}
        <div style={{
          padding: 18,
          borderRight: "1px solid rgba(255, 80, 80, 0.18)",
          display: "flex", flexDirection: "column", gap: 18,
        }}>
          <SGeraetPanel focused={focus === "sgrt"} isDiegetic={isDiegetic}/>
          <AudioKnobs isDiegetic={isDiegetic}/>
          <SilentBleed isDiegetic={isDiegetic}/>
        </div>

        {/* CENTER — GHG bearing scope */}
        <div style={{
          padding: "22px 22px 18px",
          display: "flex", flexDirection: "column", gap: 14,
          borderRight: "1px solid rgba(255, 80, 80, 0.18)",
        }}>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            fontFamily: "IBM Plex Mono", fontSize: 10, letterSpacing: "0.18em",
            color: isDiegetic ? "#ffb143" : "var(--ink-muted)", textTransform: "uppercase",
          }}>
            <span>GHG · BEARING WHEEL · 56 ELEM/SIDE</span>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setSuchlauf(!suchlauf)}
                      style={{
                        padding: "3px 10px",
                        background: suchlauf ? "#ffb143" : "transparent",
                        color: suchlauf ? "#1a0a0a" : "inherit",
                        border: "1px solid rgba(255, 177, 67, 0.4)",
                        fontFamily: "IBM Plex Mono", fontSize: 9.5, letterSpacing: "0.18em",
                        cursor: "pointer", textTransform: "uppercase",
                      }}>
                {suchlauf ? "● Suchlauf AUTO" : "○ Manual"}
              </button>
              <button onClick={() => setLeanIn(!leanIn)}
                      style={{
                        padding: "3px 10px",
                        background: leanIn ? "#ffb143" : "transparent",
                        color: leanIn ? "#1a0a0a" : "inherit",
                        border: "1px solid rgba(255, 177, 67, 0.4)",
                        fontFamily: "IBM Plex Mono", fontSize: 9.5, letterSpacing: "0.18em",
                        cursor: "pointer", textTransform: "uppercase",
                      }}>
                {leanIn ? "● Leaned in" : "○ Lean in (Space)"}
              </button>
            </div>
          </div>

          <GHGScope suchlauf={suchlauf} leanIn={leanIn} isDiegetic={isDiegetic}/>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <MagicEye isDiegetic={isDiegetic}/>
            <KDBLock isDiegetic={isDiegetic}/>
          </div>
        </div>

        {/* RIGHT — ESM + Geräuschbuch */}
        <div style={{
          padding: 18,
          display: "flex", flexDirection: "column", gap: 18,
        }}>
          <ESMPolarPlot isDiegetic={isDiegetic} focused={focus === "esm"}/>
          <Geraeuschbuch tab={bookTab} setTab={setBookTab} focused={focus === "book"} isDiegetic={isDiegetic}/>
        </div>
      </div>

      {/* Bottom — contact list / audit ticker */}
      <div style={{
        borderTop: "1px solid rgba(255, 80, 80, 0.18)",
        padding: "10px 18px",
        background: isDiegetic ? "#0e0606" : "var(--bg)",
        fontFamily: "IBM Plex Mono, monospace", fontSize: 10,
        letterSpacing: "0.14em", textTransform: "uppercase",
        color: isDiegetic ? "#ff8a7a" : "var(--ink-muted)",
        display: "flex", gap: 24, overflow: "hidden",
      }}>
        <span style={{ color: isDiegetic ? "#ffb143" : "var(--ink)" }}>HORCHEN</span>
        <span style={{ color: "#ff8a4a" }}>· K-7 Type 286 destroyer · brg 274 · rng ~3.8 nm</span>
        <span>· K-3 single screw merchant · brg 092 · classifying</span>
        <span>· K-1 distant carrier? · brg 318 · candidate-narrowing</span>
        <span>· 14:31 layer crossed 150 m</span>
      </div>
    </div>
  );
}

/* ----------------- GHG bearing scope ----------------- */
function GHGScope({ suchlauf, leanIn, isDiegetic }) {
  const contacts = [
    { brg: 274, strength: 0.9,  label: "K-7", hot: true,  cls: "destroyer" },
    { brg: 92,  strength: 0.55, label: "K-3", hot: false, cls: "merchant" },
    { brg: 318, strength: 0.35, label: "K-1", hot: false, cls: "unknown" },
    { brg: 200, strength: 0.18, label: "—",  hot: false, cls: "drift" },
  ];
  const sweepBrg = 178;

  const polarToXY = (brg, r, cx, cy) => {
    const rad = (brg - 90) * Math.PI / 180;
    return [cx + Math.cos(rad) * r, cy + Math.sin(rad) * r];
  };

  const SIZE = 360;
  const cx = SIZE / 2, cy = SIZE / 2;
  const R_OUTER = 160;
  const ringColour = isDiegetic ? "#7a3818" : "var(--rule-strong)";
  const scopeBg = isDiegetic ? "#0a0606" : "var(--bg)";
  const ink = isDiegetic ? "#ffb143" : "var(--ink)";
  const muted = isDiegetic ? "#a06a3a" : "var(--ink-muted)";
  const highlight = "#ff8a4a";

  return (
    <div style={{
      background: scopeBg,
      border: `1px solid ${ringColour}`,
      padding: 16,
      position: "relative",
      transform: leanIn ? "scale(1.02)" : "scale(1)",
      transition: "transform .25s ease",
      boxShadow: isDiegetic ? "inset 0 0 60px rgba(255, 130, 50, 0.06)" : "none",
    }}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <svg width="100%" viewBox={`0 0 ${SIZE} ${SIZE}`} style={{ maxWidth: 460, display: "block" }}>
          {[R_OUTER, 130, 100, 70, 40].map((r, i) => (
            <circle key={r} cx={cx} cy={cy} r={r}
                    fill="none"
                    stroke={ringColour}
                    strokeWidth={i === 0 ? 1.4 : 0.6}
                    opacity={i === 0 ? 0.85 : 0.5}/>
          ))}

          {Array.from({length: 36}).map((_, i) => {
            const brg = i * 10;
            const isMajor = brg % 30 === 0;
            const r1 = R_OUTER - (isMajor ? 12 : 6);
            const [x1, y1] = polarToXY(brg, R_OUTER, cx, cy);
            const [x2, y2] = polarToXY(brg, r1, cx, cy);
            const [tx, ty] = polarToXY(brg, R_OUTER + 16, cx, cy);
            return (
              <g key={brg}>
                <line x1={x1} y1={y1} x2={x2} y2={y2}
                      stroke={ringColour} strokeWidth={isMajor ? 1.2 : 0.6}
                      opacity={isMajor ? 1 : 0.55}/>
                {isMajor && (
                  <text x={tx} y={ty + 3} textAnchor="middle"
                        fontFamily="IBM Plex Mono" fontSize="10"
                        fill={muted} letterSpacing="0.14em">
                    {String(brg).padStart(3, "0")}
                  </text>
                )}
              </g>
            );
          })}

          {suchlauf && (() => {
            const [x, y] = polarToXY(sweepBrg, R_OUTER, cx, cy);
            const [x2, y2] = polarToXY(sweepBrg - 30, R_OUTER, cx, cy);
            return (
              <g>
                <line x1={cx} y1={cy} x2={x} y2={y} stroke={highlight} strokeWidth="1.2" opacity="0.6"/>
                <path d={`M ${cx},${cy} L ${x},${y} A ${R_OUTER},${R_OUTER} 0 0 0 ${x2},${y2} Z`}
                      fill={highlight} opacity="0.08"/>
              </g>
            );
          })()}

          {contacts.map((c, i) => {
            const r = R_OUTER * (0.45 + c.strength * 0.4);
            const [x, y] = polarToXY(c.brg, r, cx, cy);
            return (
              <g key={i}>
                {c.hot && (
                  <circle cx={x} cy={y} r="12" fill="none" stroke={highlight} strokeWidth="1" opacity="0.55" className="pulse"/>
                )}
                <circle cx={x} cy={y} r={c.hot ? 5 : 3.5}
                        fill={c.hot ? highlight : ink}
                        opacity={0.6 + c.strength * 0.4}/>
                <text x={x + 9} y={y + 3}
                      fontFamily="IBM Plex Mono" fontSize="9"
                      fill={c.hot ? highlight : muted} letterSpacing="0.1em">
                  {c.label} · {String(c.brg).padStart(3, "0")}
                </text>
              </g>
            );
          })}

          {(() => {
            const c = contacts[0];
            const [x, y] = polarToXY(c.brg, R_OUTER + 4, cx, cy);
            return (
              <g>
                <line x1={cx} y1={cy} x2={x} y2={y}
                      stroke={highlight} strokeWidth="2.4"/>
                <polygon points="-5,-8 0,0 5,-8"
                         fill={highlight}
                         transform={`translate(${x}, ${y}) rotate(${c.brg})`}/>
              </g>
            );
          })()}

          <circle cx={cx} cy={cy} r="5" fill={ink}/>
          <circle cx={cx} cy={cy} r="12" fill="none" stroke={ringColour} strokeWidth="0.8"/>

          <text x={SIZE / 2} y={SIZE - 8} textAnchor="middle"
                fontFamily="IBM Plex Mono" fontSize="9"
                fill={muted} letterSpacing="0.2em">
            {suchlauf ? "SUCHLAUF · AUTO SWEEP · WILL PAUSE ON CONTACT" : "MANUAL · WHEEL ROTATION"}
          </text>
        </svg>
      </div>

      <div style={{
        marginTop: 10,
        display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 10,
        fontFamily: "IBM Plex Mono", fontSize: 10.5,
        background: isDiegetic ? "rgba(0,0,0,0.4)" : "var(--bg-warm)",
        border: `1px solid ${ringColour}`,
        padding: "8px 12px",
      }}>
        <span style={{ color: highlight, fontWeight: 600 }}>K-7 LOCKED · KDB</span>
        <span style={{ color: ink }}>Type 286 destroyer · single screw · turbine · 14 kn est.</span>
        <span style={{ color: muted }}>BRG 274.5 · RNG 3.8 nm ±20%</span>
      </div>
    </div>
  );
}

/* ----------------- ESM polar plot ----------------- */
function ESMPolarPlot({ isDiegetic, focused }) {
  const blips = [
    { brg: 92,  cls: "red",    lock: true  },
    { brg: 175, cls: "yellow", lock: false },
    { brg: 240, cls: "green",  lock: false },
  ];
  const SIZE = 200;
  const cx = SIZE / 2, cy = SIZE / 2, R = 84;
  const grid = isDiegetic ? "#1f4566" : "var(--rule-strong)";
  const ink = isDiegetic ? "#7fb4dc" : "var(--ink)";
  const blipColour = { red: "#ff5a3a", yellow: "#ffc950", green: "#5fbf8f" };

  return (
    <div style={{
      background: isDiegetic ? "#0c1822" : "var(--bg-warm)",
      border: `1px solid ${isDiegetic ? "#2a4a66" : "var(--rule-strong)"}`,
      padding: 12,
      transform: focused ? "scale(1.01)" : "scale(1)",
      transition: "transform .25s",
      boxShadow: isDiegetic ? "inset 0 0 24px rgba(95, 165, 220, 0.1)" : "none",
    }}>
      <div style={{
        display: "flex", justifyContent: "space-between",
        fontFamily: "IBM Plex Mono", fontSize: 9.5, letterSpacing: "0.18em",
        color: isDiegetic ? "#7fb4dc" : "var(--ink-muted)",
        textTransform: "uppercase", marginBottom: 8,
      }}>
        <span>FuMB-7 ESM · 360°</span>
        <span style={{ color: "#ff5a3a" }}>● Ortung-armed</span>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <svg width="100%" viewBox={`0 0 ${SIZE} ${SIZE}`} style={{ maxWidth: 240, display: "block" }}>
          {[R, R * 0.7, R * 0.4].map((r) => (
            <circle key={r} cx={cx} cy={cy} r={r}
                    fill="none" stroke={grid} strokeWidth="0.5" opacity="0.6"/>
          ))}
          {[0, 45, 90, 135].map((a) => {
            const rad = a * Math.PI / 180;
            return (
              <line key={a}
                    x1={cx - Math.cos(rad) * R} y1={cy - Math.sin(rad) * R}
                    x2={cx + Math.cos(rad) * R} y2={cy + Math.sin(rad) * R}
                    stroke={grid} strokeWidth="0.4" opacity="0.45"/>
            );
          })}
          {[
            { lbl: "N", x: cx,     y: cy - R - 4 },
            { lbl: "E", x: cx + R + 8, y: cy + 2 },
            { lbl: "S", x: cx,     y: cy + R + 10 },
            { lbl: "W", x: cx - R - 8, y: cy + 2 },
          ].map((t) => (
            <text key={t.lbl} x={t.x} y={t.y} textAnchor="middle"
                  fontFamily="IBM Plex Mono" fontSize="8"
                  fill={ink} opacity="0.6" letterSpacing="0.14em">{t.lbl}</text>
          ))}

          {blips.map((b, i) => {
            const rad = (b.brg - 90) * Math.PI / 180;
            const r = R * 0.78;
            const x = cx + Math.cos(rad) * r;
            const y = cy + Math.sin(rad) * r;
            return (
              <g key={i}>
                {b.lock && (
                  <circle cx={x} cy={y} r="9" fill="none" stroke={blipColour[b.cls]} strokeWidth="1.2" className="pulse"/>
                )}
                <circle cx={x} cy={y} r="4" fill={blipColour[b.cls]}/>
              </g>
            );
          })}

          <circle cx={cx} cy={cy} r="2.5" fill={ink}/>
        </svg>
      </div>

      <div style={{ marginTop: 10, fontFamily: "IBM Plex Mono", fontSize: 10 }}>
        <div style={{ color: isDiegetic ? "#7fb4dc" : "var(--ink-muted)", letterSpacing: "0.16em", textTransform: "uppercase", fontSize: 9, marginBottom: 4 }}>
          CANDIDATES · LOCKED BLIP B-1
        </div>
        {[
          ["AN/APS-15", 78, "#ff5a3a"],
          ["Type 286",  65, "#ffc950"],
          ["ASV Mk.III", 42, "#7fb4dc"],
        ].map(([nm, pct, c]) => (
          <div key={nm} style={{
            display: "grid", gridTemplateColumns: "1fr 32px",
            alignItems: "center", gap: 8, marginBottom: 3,
          }}>
            <div>
              <div style={{ height: 4, background: isDiegetic ? "#1f3548" : "var(--bg-deep)" }}>
                <div style={{ width: `${pct}%`, height: "100%", background: c }}/>
              </div>
              <div style={{ color: ink, fontSize: 9.5, marginTop: 2 }}>{nm}</div>
            </div>
            <span style={{ color: c, textAlign: "right", fontWeight: 600 }}>{pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ----------------- Geräuschbuch (acoustic library) ----------------- */
function Geraeuschbuch({ tab, setTab, focused, isDiegetic }) {
  const tabs = ["destroyer", "corvette", "merchant", "carrier", "submarine", "aircraft"];
  const candidates = {
    destroyer: [
      ["Type 286 escort destroyer", 62, "★"],
      ["Flower-class corvette",     58, "·"],
      ["River-class frigate",       42, "·"],
    ],
    corvette: [
      ["Flower-class corvette",     71, "★"],
      ["Castle-class corvette",     46, "·"],
    ],
    merchant: [
      ["10,000 GRT tanker · Empire-class", 88, "★"],
      ["Liberty ship",                      54, "·"],
    ],
    carrier: [
      ["Casablanca-class CVE", 51, "★"],
      ["Bogue-class CVE",      48, "·"],
    ],
    submarine: [
      ["Balao-class SS · USN",  44, "·"],
      ["S-class SS · RN",       38, "·"],
    ],
    aircraft: [
      ["Sunderland Mk.V",       62, "★"],
      ["Liberator GR.VIII",     49, "·"],
    ],
  };

  const paper = "#f0e4cf";
  const ink   = "#3a2a1c";

  return (
    <div style={{
      background: paper,
      border: `1px solid ${isDiegetic ? "#6a4a28" : "var(--rule-strong)"}`,
      padding: 0,
      color: ink,
      transform: focused ? "rotate(-0.6deg) scale(1.01)" : "rotate(-0.6deg)",
      transition: "transform .25s",
      position: "relative",
      boxShadow: "0 6px 16px rgba(0,0,0,0.4)",
    }}>
      <div style={{
        padding: "12px 16px 6px",
        borderBottom: "1px solid rgba(58, 42, 28, 0.25)",
        display: "flex", justifyContent: "space-between", alignItems: "baseline",
      }}>
        <div>
          <div className="serif" style={{ fontSize: 18, fontStyle: "italic", color: ink, lineHeight: 1 }}>
            Geräuschbuch
          </div>
          <div className="mono" style={{ fontSize: 8.5, letterSpacing: "0.2em", color: ink, opacity: 0.6, marginTop: 2, textTransform: "uppercase" }}>
            Acoustic library — Atlantic 1955
          </div>
        </div>
        <button style={{
          background: "transparent", border: `1px solid ${ink}`,
          padding: "2px 8px", color: ink, fontFamily: "IBM Plex Mono",
          fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase",
          cursor: "pointer",
        }}>
          Übung ▶
        </button>
      </div>

      <div style={{ position: "absolute", right: -2, top: 40, display: "flex", flexDirection: "column", gap: 4 }}>
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)}
                  style={{
                    background: tab === t ? "#c4711f" : paper,
                    border: `1px solid ${ink}`,
                    color: tab === t ? "#fff" : ink,
                    fontFamily: "IBM Plex Mono", fontSize: 8.5, letterSpacing: "0.14em",
                    textTransform: "uppercase", padding: "4px 8px 4px 6px",
                    cursor: "pointer",
                    transform: tab === t ? "translateX(6px)" : "none",
                    transition: "transform .15s",
                    minWidth: 76, textAlign: "left",
                  }}>
            {t}
          </button>
        ))}
      </div>

      <div style={{ padding: "12px 90px 14px 16px" }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.18em", color: ink, opacity: 0.7, textTransform: "uppercase", marginBottom: 8 }}>
          PAGE — {tab.toUpperCase()} CANDIDATES · CONFIDENCE
        </div>
        {candidates[tab].map(([nm, pct, star], i) => (
          <div key={nm} style={{
            display: "grid", gridTemplateColumns: "14px 1fr 40px",
            alignItems: "center", gap: 6,
            padding: "6px 0",
            borderBottom: "1px dashed rgba(58, 42, 28, 0.25)",
          }}>
            <span style={{ color: i === 0 ? "#c4711f" : ink, fontSize: 12 }}>{star}</span>
            <div>
              <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 14, fontStyle: "italic", color: ink }}>{nm}</div>
              <div style={{ height: 3, background: "rgba(58, 42, 28, 0.18)", marginTop: 3 }}>
                <div style={{ width: `${pct}%`, height: "100%", background: i === 0 ? "#c4711f" : ink, opacity: i === 0 ? 1 : 0.45 }}/>
              </div>
            </div>
            <span style={{ fontFamily: "IBM Plex Mono", fontSize: 10, color: ink, textAlign: "right", fontWeight: 600 }}>{pct}%</span>
          </div>
        ))}
        <div style={{ fontFamily: "Cormorant Garamond, serif", fontStyle: "italic", fontSize: 13, color: ink, marginTop: 10, opacity: 0.7 }}>
          Listen longer — confidence sharpens as PRF samples accumulate.
        </div>
      </div>
    </div>
  );
}

/* ----------------- S-Gerät guarded panel ----------------- */
function SGeraetPanel({ focused, isDiegetic }) {
  const [stage, setStage] = useState(0);
  const stageMap = ["COVER DOWN", "COVER LIFTED", "ARMED · 10 S", "PING FIRED"];
  const stageColour = ["#7a3818", "#c4711f", "#ff8a4a", "#ffb143"];
  return (
    <div style={{
      background: isDiegetic ? "#1a0606" : "var(--bg)",
      border: `1px solid ${isDiegetic ? "#7a3818" : "var(--rule-strong)"}`,
      padding: 14,
      transform: focused ? "scale(1.01)" : "scale(1)",
      transition: "transform .25s",
    }}>
      <div className="mono" style={{ fontSize: 9.5, letterSpacing: "0.18em", color: isDiegetic ? "#ffb143" : "var(--ink-muted)", marginBottom: 6, textTransform: "uppercase" }}>
        S-GERÄT · ACTIVE PING
      </div>
      <div className="serif" style={{ fontSize: 16, fontStyle: "italic", color: isDiegetic ? "#f6f1de" : "var(--ink)", marginBottom: 4 }}>
        Ranging set
      </div>
      <div style={{ fontSize: 11, color: isDiegetic ? "#a06a3a" : "var(--ink-muted)", marginBottom: 10, lineHeight: 1.4 }}>
        Captain authorisation required. Boat-wide audio event on fire.
      </div>

      <div style={{
        background: isDiegetic ? "#240c08" : "var(--bg-warm)",
        border: `1px solid ${isDiegetic ? "#7a3818" : "var(--rule-strong)"}`,
        padding: 14,
        display: "flex", flexDirection: "column", gap: 10, alignItems: "center",
      }}>
        <div style={{
          width: 84, height: 84, borderRadius: "50%",
          background: stage >= 1 ? stageColour[stage] : "#3a1a10",
          border: `3px solid ${isDiegetic ? "#7a3818" : "var(--rule-strong)"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "Cormorant Garamond", fontSize: 24, color: stage >= 1 ? "#1a0606" : "#7a3818",
          fontWeight: 700,
          boxShadow: stage >= 2 ? "0 0 24px rgba(255, 138, 74, 0.6)" : "none",
          transition: "all .25s",
        }}>
          {stage >= 2 ? "ARM" : "S"}
        </div>
        <div style={{ fontFamily: "IBM Plex Mono", fontSize: 9, letterSpacing: "0.2em", color: stageColour[stage], textTransform: "uppercase" }}>
          {stageMap[stage]}
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {["COVER","ARM","FIRE"].map((s, i) => (
            <button key={s} onClick={() => setStage((stage + 1) % 4)}
                    style={{
                      flex: 1, padding: "5px 8px",
                      background: stage > i ? stageColour[i + 1] : "transparent",
                      color: stage > i ? "#1a0606" : (isDiegetic ? "#a06a3a" : "var(--ink-muted)"),
                      border: `1px solid ${isDiegetic ? "#7a3818" : "var(--rule-strong)"}`,
                      fontFamily: "IBM Plex Mono", fontSize: 8.5, letterSpacing: "0.14em",
                      cursor: "pointer", textTransform: "uppercase",
                    }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {stage === 3 && (
        <div style={{
          marginTop: 10,
          padding: "8px 10px",
          background: isDiegetic ? "rgba(255, 138, 74, 0.12)" : "var(--bg-warm)",
          border: "1px solid #ff8a4a",
          fontFamily: "IBM Plex Mono", fontSize: 10, color: "#ffb143", letterSpacing: "0.08em",
        }}>
          RETURN: BRG 274 · RNG 3,820 m<br/>
          <span style={{ color: isDiegetic ? "#a06a3a" : "var(--ink-muted)", fontSize: 9 }}>~60 S DECAY · STALE IN 47 S</span>
        </div>
      )}
    </div>
  );
}

/* ----------------- 3 audio-tuning knobs ----------------- */
function AudioKnobs({ isDiegetic }) {
  const knobs = [
    { lbl: "MASTER",  val: 72 },
    { lbl: "S-BAND",  val: 48 },
    { lbl: "EQ",      val: 60 },
  ];
  const ink = isDiegetic ? "#ffb143" : "var(--ink)";
  const muted = isDiegetic ? "#a06a3a" : "var(--ink-muted)";
  return (
    <div style={{
      background: isDiegetic ? "#1a0606" : "var(--bg)",
      border: `1px solid ${isDiegetic ? "#7a3818" : "var(--rule-strong)"}`,
      padding: 12,
    }}>
      <div className="mono" style={{ fontSize: 9.5, letterSpacing: "0.18em", color: muted, marginBottom: 10, textTransform: "uppercase" }}>
        Audio tuning · headphone bus
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        {knobs.map((k) => {
          const angle = (k.val / 100) * 270 - 135;
          return (
            <div key={k.lbl} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{
                width: 52, height: 52, borderRadius: "50%",
                background: isDiegetic ? "#0a0202" : "var(--bg-warm)",
                border: `2px solid ${isDiegetic ? "#7a3818" : "var(--rule-strong)"}`,
                position: "relative",
              }}>
                <div style={{
                  position: "absolute",
                  top: 4, left: "50%",
                  width: 2, height: 16,
                  background: ink,
                  transformOrigin: "1px 22px",
                  transform: `rotate(${angle}deg)`,
                  marginLeft: -1,
                }}/>
              </div>
              <div className="mono" style={{ fontSize: 8.5, letterSpacing: "0.18em", color: muted, textTransform: "uppercase" }}>
                {k.lbl}
              </div>
              <div className="mono" style={{ fontSize: 9, color: ink }}>{k.val}</div>
            </div>
          );
        })}
      </div>
      <div style={{ fontFamily: "Cormorant Garamond", fontStyle: "italic", fontSize: 11.5, color: muted, marginTop: 10, lineHeight: 1.4 }}>
        Sonar specialty stat modulates baseline S/N — Bauer's setup ≠ green crew's at the same knob positions.
      </div>
    </div>
  );
}

/* ----------------- Magic-eye repeater ----------------- */
function MagicEye({ isDiegetic }) {
  return (
    <div style={{
      background: isDiegetic ? "#020a05" : "var(--bg)",
      border: `1px solid ${isDiegetic ? "#1a4030" : "var(--rule-strong)"}`,
      padding: 12,
      display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
    }}>
      <div className="mono" style={{ fontSize: 9, letterSpacing: "0.18em", color: isDiegetic ? "#5fbf8f" : "var(--ink-muted)", textTransform: "uppercase" }}>
        MAGIC-EYE · SIG STRENGTH
      </div>
      <svg viewBox="0 0 80 80" width="64" height="64">
        <circle cx="40" cy="40" r="36" fill={isDiegetic ? "#041a0e" : "var(--bg-warm)"} stroke={isDiegetic ? "#1a4030" : "var(--rule-strong)"} strokeWidth="1.2"/>
        <path d="M 40 40 L 40 8 A 32 32 0 0 1 64 26 Z" fill="#5fbf8f" opacity="0.85"/>
        <path d="M 40 40 L 40 8 A 32 32 0 0 0 16 26 Z" fill="#5fbf8f" opacity="0.85"/>
        <path d="M 40 40 L 40 72 A 32 32 0 0 1 16 56 Z" fill="#5fbf8f" opacity="0.4"/>
        <path d="M 40 40 L 40 72 A 32 32 0 0 0 64 56 Z" fill="#5fbf8f" opacity="0.4"/>
        <circle cx="40" cy="40" r="6" fill={isDiegetic ? "#1a4030" : "var(--ink-muted)"}/>
      </svg>
      <div className="mono" style={{ fontSize: 11, color: "#5fbf8f", letterSpacing: "0.14em" }}>
        STRONG
      </div>
    </div>
  );
}

/* ----------------- KDB lock indicator ----------------- */
function KDBLock({ isDiegetic }) {
  const ink = isDiegetic ? "#ffb143" : "var(--ink)";
  const muted = isDiegetic ? "#a06a3a" : "var(--ink-muted)";
  return (
    <div style={{
      background: isDiegetic ? "#1a0606" : "var(--bg)",
      border: `1px solid ${isDiegetic ? "#7a3818" : "var(--rule-strong)"}`,
      padding: 12,
      display: "flex", flexDirection: "column", gap: 6,
    }}>
      <div className="mono" style={{ fontSize: 9, letterSpacing: "0.18em", color: muted, textTransform: "uppercase" }}>
        KDB · directional
      </div>
      <div className="serif" style={{ fontSize: 24, fontStyle: "italic", color: ink, lineHeight: 1 }}>
        274.5°
      </div>
      <div className="mono" style={{ fontSize: 9, color: muted, letterSpacing: "0.1em" }}>
        ±0.5° · LOCKED ON K-7 · 03:42 elapsed
      </div>
      <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
        <div style={{ height: 3, flex: 1, background: ink, opacity: 1 }}/>
        <div style={{ height: 3, flex: 1, background: ink, opacity: 0.7 }}/>
        <div style={{ height: 3, flex: 1, background: ink, opacity: 0.4 }}/>
        <div style={{ height: 3, flex: 1, background: ink, opacity: 0.15 }}/>
      </div>
      <div className="mono" style={{ fontSize: 8, color: muted, letterSpacing: "0.12em" }}>
        SIGNAL STRENGTH
      </div>
    </div>
  );
}

/* ----------------- Silent-running / machinery bleed indicator ----------------- */
function SilentBleed({ isDiegetic }) {
  const states = [
    { lbl: "DIESELS",  on: false, hot: true  },
    { lbl: "MOTORS",   on: true,  hot: false },
    { lbl: "CREEP",    on: false, hot: false },
    { lbl: "STUFE 3",  on: true,  hot: false },
    { lbl: "STUFE 2",  on: false, hot: false },
    { lbl: "STUFE 1",  on: false, hot: false },
  ];
  const muted = isDiegetic ? "#a06a3a" : "var(--ink-muted)";
  return (
    <div style={{
      background: isDiegetic ? "#1a0606" : "var(--bg)",
      border: `1px solid ${isDiegetic ? "#7a3818" : "var(--rule-strong)"}`,
      padding: 12,
    }}>
      <div className="mono" style={{ fontSize: 9, letterSpacing: "0.18em", color: muted, marginBottom: 8, textTransform: "uppercase" }}>
        Engineer machinery bleed
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
        {states.map((s) => (
          <div key={s.lbl} style={{
            padding: "3px 8px",
            background: s.on ? (s.hot ? "#ff5a3a" : "#5fbf8f") : "transparent",
            color: s.on ? "#1a0606" : muted,
            border: `1px solid ${s.on ? (s.hot ? "#ff5a3a" : "#5fbf8f") : (isDiegetic ? "#7a3818" : "var(--rule-strong)")}`,
            fontFamily: "IBM Plex Mono", fontSize: 9, letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}>
            {s.on ? "●" : "○"} {s.lbl}
          </div>
        ))}
      </div>
      <div style={{ fontFamily: "Cormorant Garamond", fontStyle: "italic", fontSize: 11.5, color: muted, marginTop: 8, lineHeight: 1.4 }}>
        Diesels engaged would compromise listening — request silent state via intercom.
      </div>
    </div>
  );
}

Object.assign(window, { SonarStation });
