/* ============================================================
   Engineer mid-fi station mockup (per design doc §3.4)

   Standing 1-stance, two-panel console: Propulsion (left) and
   Damage (right). Engine bay viewport on the forward bulkhead
   shows machinery physically running. Lighting: industrial
   yellow-white at engine bay; warm tungsten pendant over console;
   amber damage panel; Stufe-status banner red/amber/green per level.
   ============================================================ */

function EngineerStation({ style = "diegetic" }) {
  const [mode, setMode] = useState("electric"); // diesel | electric | creep
  const [telegraph, setTelegraph] = useState("half"); // stop | slow | half | full | flank
  const [stufe, setStufe] = useState(0); // 0..3
  const [chargeRate, setChargeRate] = useState("normal"); // slow | normal | fast | overcharge
  const isDiegetic = style === "diegetic";

  return (
    <div style={{
      background: isDiegetic ? "#0e0a06" : "var(--bg-warm)",
      border: "1px solid var(--rule-strong)",
      padding: 0,
      boxShadow: "var(--paper-shadow)",
      overflow: "hidden",
      color: isDiegetic ? "#f0e4c0" : "var(--ink)",
    }}>
      {/* Top status bar — yellow-white industrial */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        alignItems: "center",
        padding: "10px 18px",
        background: isDiegetic ? "#1a140c" : "var(--bg-deep)",
        borderBottom: "1px solid rgba(212, 167, 106, 0.3)",
        fontFamily: "IBM Plex Mono, monospace",
        fontSize: 11,
        letterSpacing: "0.14em",
        color: isDiegetic ? "#c4a86a" : "var(--ink-muted)",
        textTransform: "uppercase",
      }}>
        <div style={{ display: "flex", gap: 16 }}>
          <span>MASCHINENRAUM · U-241</span>
          <span style={{ color: isDiegetic ? "#d4a76a" : "var(--ink)" }}>● LI Krüger · Eng 9 · ●●●●</span>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <span>MODE: {mode.toUpperCase()}</span>
          <span style={{ color: stufe === 0 ? "#7ad07a" : stufe < 3 ? "#ffc950" : "#ff5a3a" }}>
            STUFE {stufe} · {["ALLE SYSTEME", "LEISE", "SEHR LEISE", "TOTENSTILLE"][stufe]}
          </span>
        </div>
        <div style={{ display: "flex", gap: 16, justifyContent: "flex-end" }}>
          <span>Trim: {String(0.4).padStart(4, '0')}°</span>
          <span style={{ color: "#ffc950" }}>Air 82%</span>
          <span style={{ color: "#7ad07a" }}>Morale 0.62</span>
        </div>
      </div>

      {/* Engine bay viewport (top strip) */}
      <EngineBayViewport mode={mode} stufe={stufe} isDiegetic={isDiegetic}/>

      {/* Two-panel split */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 0,
        background: isDiegetic ? "radial-gradient(ellipse at top, #1a140c 0%, #08050a 100%)" : "var(--bg-warm)",
      }}>
        {/* PROPULSION PANEL */}
        <div style={{
          padding: 18,
          borderRight: "1px solid rgba(212, 167, 106, 0.18)",
          display: "flex", flexDirection: "column", gap: 14,
        }}>
          <PanelTitle title="Propulsion" sub="Mode · telegraph · battery" isDiegetic={isDiegetic} accent="#d4a76a"/>
          <ModeSelector mode={mode} setMode={setMode} stufe={stufe} isDiegetic={isDiegetic}/>
          <EngineTelegraph telegraph={telegraph} setTelegraph={setTelegraph} mode={mode} isDiegetic={isDiegetic}/>
          <BatteryBanks chargeRate={chargeRate} setChargeRate={setChargeRate} isDiegetic={isDiegetic}/>
          <InterlockLights mode={mode} stufe={stufe} isDiegetic={isDiegetic}/>
        </div>

        {/* DAMAGE PANEL */}
        <div style={{
          padding: 18,
          display: "flex", flexDirection: "column", gap: 14,
        }}>
          <PanelTitle title="Damage Control" sub="Map · Stufe · cards · casualties" isDiegetic={isDiegetic} accent="#ff8a4a"/>
          <DamageMap isDiegetic={isDiegetic}/>
          <StufeLever stufe={stufe} setStufe={setStufe} isDiegetic={isDiegetic}/>
          <DamageCardQueue stufe={stufe} isDiegetic={isDiegetic}/>
          <CasualtyList isDiegetic={isDiegetic}/>
        </div>
      </div>

      {/* Bottom — morale + audit */}
      <div style={{
        borderTop: "1px solid rgba(212, 167, 106, 0.18)",
        padding: "8px 18px",
        background: isDiegetic ? "#08050a" : "var(--bg)",
        fontFamily: "IBM Plex Mono, monospace", fontSize: 10,
        letterSpacing: "0.14em", textTransform: "uppercase",
        color: isDiegetic ? "#c4a86a" : "var(--ink-muted)",
        display: "flex", gap: 24, overflow: "hidden",
      }}>
        <span style={{ color: isDiegetic ? "#d4a76a" : "var(--ink)" }}>ENGINEER LOG</span>
        <span>· 14:31  Tube 3 reload — air OK</span>
        <span style={{ color: "#ffc950" }}>· 14:18  Stufe 0 lifted — pumps restored</span>
        <span style={{ color: "#7ad07a" }}>· 13:44  Charge cycle complete · +clean</span>
        <span>· 13:02  Bauer ↗ Damage Ctrl temporary loan</span>
      </div>
    </div>
  );
}

/* ----------------- Panel title helper ----------------- */
function PanelTitle({ title, sub, isDiegetic, accent }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
      <div>
        <div className="mono" style={{
          fontSize: 9.5, letterSpacing: "0.2em",
          color: isDiegetic ? "#c4a86a" : "var(--ink-muted)",
          textTransform: "uppercase",
        }}>
          PANEL
        </div>
        <div className="serif" style={{
          fontSize: 22, fontStyle: "italic",
          color: isDiegetic ? "#f0e4c0" : "var(--ink)",
          lineHeight: 1, marginTop: 2,
        }}>
          {title}
        </div>
      </div>
      <div className="mono" style={{
        fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase",
        color: accent, padding: "2px 8px", border: `1px solid ${accent}`,
      }}>
        {sub}
      </div>
    </div>
  );
}

/* ----------------- Engine bay viewport ----------------- */
function EngineBayViewport({ mode, stufe, isDiegetic }) {
  const dieselRunning = mode === "diesel";
  const elecRunning = mode === "electric" || mode === "creep";
  const creepRunning = mode === "creep";
  return (
    <div style={{
      background: isDiegetic ? "#0a0805" : "var(--bg-warm)",
      borderBottom: "1px solid rgba(212, 167, 106, 0.18)",
      padding: "10px 18px",
    }}>
      <div className="mono" style={{
        fontSize: 9, letterSpacing: "0.18em", color: isDiegetic ? "#c4a86a" : "var(--ink-muted)",
        marginBottom: 8, textTransform: "uppercase",
        display: "flex", justifyContent: "space-between",
      }}>
        <span>Engine bay viewport · forward bulkhead</span>
        <span style={{ color: isDiegetic ? "#d4a76a" : "var(--ink-muted)" }}>OVERHEAD PIPING VISIBLE · HEAT HAZE</span>
      </div>
      <svg viewBox="0 0 1100 110" style={{ width: "100%", display: "block" }}>
        <defs>
          <pattern id="grease" patternUnits="userSpaceOnUse" width="12" height="12">
            <rect width="12" height="12" fill={isDiegetic ? "#1a1208" : "var(--bg)"}/>
            <line x1="0" y1="6" x2="12" y2="6" stroke={isDiegetic ? "#3a2810" : "var(--rule-strong)"} strokeWidth="0.4" opacity="0.5"/>
          </pattern>
        </defs>
        {/* Overhead piping band */}
        <rect x="0" y="0" width="1100" height="14" fill="url(#grease)" stroke={isDiegetic ? "#3a2810" : "var(--rule-strong)"} strokeWidth="0.5"/>
        {[0, 200, 400, 600, 800, 1000].map((x) => (
          <circle key={x} cx={x + 30} cy="7" r="2.5" fill={isDiegetic ? "#d4a76a" : "var(--ink-muted)"}/>
        ))}

        {/* Bilge floor band */}
        <rect x="0" y="96" width="1100" height="14" fill="url(#grease)" stroke={isDiegetic ? "#3a2810" : "var(--rule-strong)"} strokeWidth="0.5"/>

        {/* Three engine assemblies */}
        {/* DIESEL — left */}
        <g transform="translate(80, 30)">
          <rect width="220" height="60" fill={dieselRunning ? "#3a2410" : "#1a1208"} stroke={dieselRunning ? "#d4a76a" : "#5a3a18"} strokeWidth="1.5"/>
          {/* Pistons */}
          {[20, 65, 110, 155, 200].map((x) => (
            <g key={x}>
              <rect x={x - 6} y="14" width="12" height={dieselRunning ? 14 : 18}
                    fill={dieselRunning ? "#ffb143" : "#5a3a18"}/>
              <rect x={x - 8} y={dieselRunning ? 28 : 32} width="16" height="8"
                    fill={dieselRunning ? "#c4711f" : "#3a2410"}/>
            </g>
          ))}
          <text x="110" y="54" textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="9" fill={dieselRunning ? "#ffb143" : "#7a5028"} letterSpacing="0.2em" fontWeight="600">
            DIESEL × 2 · MAN
          </text>
          {dieselRunning && (
            <g>
              {/* Heat haze indicator */}
              <text x="110" y="6" textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="8" fill="#ff8a4a" opacity="0.7">≈≈ HEAT ≈≈</text>
            </g>
          )}
        </g>

        {/* ELECTRIC MAIN — centre */}
        <g transform="translate(450, 30)">
          <circle cx="60" cy="30" r="26" fill={elecRunning && !creepRunning ? "#0a2a3a" : "#0a141a"} stroke={elecRunning && !creepRunning ? "#5fbf8f" : "#3a5060"} strokeWidth="1.5"/>
          <circle cx="60" cy="30" r="16" fill="none" stroke={elecRunning && !creepRunning ? "#5fbf8f" : "#3a5060"} strokeWidth="0.8" opacity="0.5"/>
          {/* Armature spokes */}
          {elecRunning && !creepRunning && [0, 60, 120].map((a) => (
            <line key={a} x1="60" y1="30"
                  x2={60 + Math.cos((a + Date.now()/100) * Math.PI / 180) * 14}
                  y2={30 + Math.sin((a + Date.now()/100) * Math.PI / 180) * 14}
                  stroke="#5fbf8f" strokeWidth="1.5"/>
          ))}
          <text x="60" y="80" textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="9" fill={elecRunning && !creepRunning ? "#5fbf8f" : "#3a5060"} letterSpacing="0.2em" fontWeight="600">
            MAIN × 2
          </text>
        </g>

        {/* CREEP — right */}
        <g transform="translate(720, 30)">
          <circle cx="40" cy="30" r="20" fill={creepRunning ? "#0a2a3a" : "#0a141a"} stroke={creepRunning ? "#5fbf8f" : "#3a5060"} strokeWidth="1.5"/>
          <circle cx="40" cy="30" r="10" fill="none" stroke={creepRunning ? "#5fbf8f" : "#3a5060"} strokeWidth="0.6" opacity="0.5"/>
          <text x="40" y="80" textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="9" fill={creepRunning ? "#5fbf8f" : "#3a5060"} letterSpacing="0.2em" fontWeight="600">
            CREEP × 2
          </text>
        </g>

        {/* SHAFT lines */}
        <line x1="300" y1="60" x2="450" y2="60" stroke={isDiegetic ? "#5a4028" : "var(--rule-strong)"} strokeWidth="2" strokeDasharray="6 3" opacity="0.7"/>
        <line x1="570" y1="60" x2="720" y2="60" stroke={isDiegetic ? "#5a4028" : "var(--rule-strong)"} strokeWidth="2" strokeDasharray="6 3" opacity="0.7"/>
        <line x1="760" y1="60" x2="900" y2="60" stroke={isDiegetic ? "#5a4028" : "var(--rule-strong)"} strokeWidth="2" strokeDasharray="6 3" opacity="0.7"/>
        <text x="900" y="56" fontFamily="IBM Plex Mono" fontSize="9" fill={isDiegetic ? "#d4a76a" : "var(--ink-muted)"} letterSpacing="0.2em">→ STERN</text>

        {/* Stufe overlay */}
        {stufe >= 2 && (
          <rect x="0" y="14" width="1100" height="82" fill="#240e0e" opacity="0.45"/>
        )}
        {stufe === 3 && (
          <text x="550" y="60" textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="22" fill="#ff5a3a" letterSpacing="0.4em" fontWeight="700" opacity="0.85">
            TOTENSTILLE
          </text>
        )}
      </svg>
    </div>
  );
}

/* ----------------- Mode selector ----------------- */
function ModeSelector({ mode, setMode, stufe, isDiegetic }) {
  const modes = [
    { id: "diesel",   lbl: "Diesel-Snorkel", sub: "Transit + charge",     forbidden: stufe >= 2 },
    { id: "electric", lbl: "Electric Main",  sub: "Submerged · main motors", forbidden: stufe >= 3 },
    { id: "creep",    lbl: "Creep",          sub: "15+ dB quieter",        forbidden: false },
  ];
  const ink = isDiegetic ? "#f0e4c0" : "var(--ink)";
  const muted = isDiegetic ? "#c4a86a" : "var(--ink-muted)";
  return (
    <div style={{
      background: isDiegetic ? "#0e0805" : "var(--bg)",
      border: `1px solid ${isDiegetic ? "#5a3a18" : "var(--rule-strong)"}`,
      padding: 12,
    }}>
      <div className="mono" style={{ fontSize: 9, letterSpacing: "0.18em", color: muted, marginBottom: 8, textTransform: "uppercase" }}>
        Mode · 4–18 s transition
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
        {modes.map((m) => (
          <button key={m.id}
                  onClick={() => !m.forbidden && setMode(m.id)}
                  disabled={m.forbidden}
                  style={{
                    padding: "8px",
                    background: mode === m.id ? (isDiegetic ? "#d4a76a" : "var(--ink)") : "transparent",
                    color: mode === m.id ? "#0e0805" : (m.forbidden ? "#5a3a18" : ink),
                    border: `1px solid ${m.forbidden ? "#5a3a18" : (isDiegetic ? "#5a3a18" : "var(--rule-strong)")}`,
                    fontFamily: "IBM Plex Mono", fontSize: 10, letterSpacing: "0.1em",
                    cursor: m.forbidden ? "not-allowed" : "pointer",
                    textTransform: "uppercase", textAlign: "left",
                    opacity: m.forbidden ? 0.5 : 1,
                  }}>
            <div style={{ fontWeight: 600 }}>{mode === m.id ? "●" : "○"} {m.lbl}</div>
            <div style={{ fontSize: 8.5, opacity: 0.7, marginTop: 2, letterSpacing: "0.06em" }}>
              {m.forbidden ? "FORBIDDEN" : m.sub}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ----------------- Engine telegraph ----------------- */
function EngineTelegraph({ telegraph, setTelegraph, mode, isDiegetic }) {
  const steps = ["stop", "slow", "half", "full", "flank"];
  const ordered = "half"; // captain ordered
  const ink = isDiegetic ? "#d4a76a" : "var(--ink)";
  const muted = isDiegetic ? "#c4a86a" : "var(--ink-muted)";
  const speedMap = {
    diesel:   { stop: 0,  slow: 4,  half: 11, full: 14, flank: 17 },
    electric: { stop: 0,  slow: 3,  half: 7,  full: 12, flank: 17 },
    creep:    { stop: 0,  slow: 1,  half: 2,  full: 3,  flank: 3 },
  };
  return (
    <div style={{
      background: isDiegetic ? "#0e0805" : "var(--bg)",
      border: `1px solid ${isDiegetic ? "#5a3a18" : "var(--rule-strong)"}`,
      padding: 12,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span className="mono" style={{ fontSize: 9, letterSpacing: "0.18em", color: muted, textTransform: "uppercase" }}>
          Engine telegraph
        </span>
        <span className="mono" style={{ fontSize: 9, letterSpacing: "0.18em",
                                         color: telegraph === ordered ? "#7ad07a" : "#ff8a4a", textTransform: "uppercase" }}>
          ORDERED: {ordered.toUpperCase()}
        </span>
      </div>
      <div style={{
        position: "relative",
        background: isDiegetic ? "#3a2410" : "var(--bg-warm)",
        padding: "10px 6px",
        border: `1px solid ${isDiegetic ? "#5a3a18" : "var(--rule-strong)"}`,
      }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 0 }}>
          {steps.map((s, i) => (
            <button key={s} onClick={() => setTelegraph(s)}
                    style={{
                      padding: "8px 4px",
                      background: telegraph === s ? ink : "transparent",
                      color: telegraph === s ? "#0e0805" : (isDiegetic ? "#d4a76a" : "var(--ink)"),
                      border: "none",
                      fontFamily: "IBM Plex Mono", fontSize: 10, letterSpacing: "0.12em",
                      cursor: "pointer", textTransform: "uppercase",
                      borderRight: i < 4 ? `1px solid ${isDiegetic ? "#5a3a18" : "var(--rule-strong)"}` : "none",
                      fontWeight: 600,
                    }}>
              {s}
            </button>
          ))}
        </div>
      </div>
      <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between", fontFamily: "IBM Plex Mono", fontSize: 10, color: muted }}>
        <span>Speed @ {telegraph}</span>
        <span style={{ color: ink, fontWeight: 600 }}>{speedMap[mode][telegraph]} kn</span>
      </div>
    </div>
  );
}

/* ----------------- Battery banks + charge rate ----------------- */
function BatteryBanks({ chargeRate, setChargeRate, isDiegetic }) {
  const banks = [
    { lbl: "FWD", pct: 67, cells: 62, damaged: 0 },
    { lbl: "AFT", pct: 71, cells: 62, damaged: 2 },
  ];
  const rates = [
    { id: "slow",       lbl: "Slow",       h: "6h",   tone: "#7ad07a" },
    { id: "normal",     lbl: "Normal",     h: "4h",   tone: "#5fbfd0" },
    { id: "fast",       lbl: "Fast",       h: "2.5h", tone: "#ffc950" },
    { id: "overcharge", lbl: "Overcharge", h: "1.5h", tone: "#ff5a3a" },
  ];
  const muted = isDiegetic ? "#c4a86a" : "var(--ink-muted)";

  return (
    <div style={{
      background: isDiegetic ? "#0e0805" : "var(--bg)",
      border: `1px solid ${isDiegetic ? "#5a3a18" : "var(--rule-strong)"}`,
      padding: 12,
    }}>
      <div className="mono" style={{ fontSize: 9, letterSpacing: "0.18em", color: muted, marginBottom: 10, textTransform: "uppercase" }}>
        Battery banks · 2 × 62 cells
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {banks.map((b) => (
          <div key={b.lbl} style={{
            background: isDiegetic ? "#1a1208" : "var(--bg-warm)",
            border: `1px solid ${isDiegetic ? "#3a2410" : "var(--rule)"}`,
            padding: 8,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "IBM Plex Mono", fontSize: 9, color: muted, letterSpacing: "0.14em", marginBottom: 4 }}>
              <span>{b.lbl}</span>
              <span style={{ color: b.damaged ? "#ff8a4a" : muted }}>{b.damaged ? `${b.damaged} ISOLATED` : "OK"}</span>
            </div>
            <div className="serif" style={{ fontSize: 26, fontStyle: "italic", color: b.pct < 30 ? "#ff5a3a" : (isDiegetic ? "#d4a76a" : "var(--ink)"), lineHeight: 1, fontWeight: 600 }}>
              {b.pct}<span style={{ fontSize: 14, color: muted, marginLeft: 2 }}>%</span>
            </div>
            {/* Cell grid mini */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(31, 1fr)", gap: 1, marginTop: 6 }}>
              {Array.from({length: 62}).map((_, i) => {
                const filled = i < (b.pct / 100) * 62;
                const isDam = b.damaged > 0 && (i === 30 || i === 41);
                return (
                  <div key={i} style={{
                    height: 4,
                    background: isDam ? "#ff5a3a" : (filled ? (isDiegetic ? "#d4a76a" : "var(--ink)") : (isDiegetic ? "#3a2410" : "var(--rule)")),
                  }}/>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="mono" style={{ fontSize: 9, letterSpacing: "0.18em", color: muted, marginTop: 10, marginBottom: 6, textTransform: "uppercase" }}>
        Charge rate
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 4 }}>
        {rates.map((r) => (
          <button key={r.id} onClick={() => setChargeRate(r.id)}
                  style={{
                    padding: "6px 4px",
                    background: chargeRate === r.id ? r.tone : "transparent",
                    color: chargeRate === r.id ? "#0e0805" : r.tone,
                    border: `1px solid ${r.tone}`,
                    fontFamily: "IBM Plex Mono", fontSize: 9.5, letterSpacing: "0.1em",
                    cursor: "pointer", textTransform: "uppercase",
                  }}>
            <div style={{ fontWeight: 600 }}>{r.lbl}</div>
            <div style={{ fontSize: 8, opacity: 0.7 }}>{r.h}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ----------------- Interlock lights row ----------------- */
function InterlockLights({ mode, stufe, isDiegetic }) {
  const muted = isDiegetic ? "#c4a86a" : "var(--ink-muted)";
  const items = [
    { lbl: "DEPTH < 25 m", ok: true,  txt: "18 m" },
    { lbl: "SNORKEL",      ok: true,  txt: "ON" },
    { lbl: "BATT > 10%",   ok: true,  txt: "67%" },
    { lbl: "AIR > 50%",    ok: true,  txt: "82%" },
    { lbl: "TRIM",         ok: true,  txt: "OK" },
    { lbl: "HULL",         ok: false, txt: "BREACH" },
  ];
  return (
    <div style={{
      background: isDiegetic ? "#0e0805" : "var(--bg)",
      border: `1px solid ${isDiegetic ? "#5a3a18" : "var(--rule-strong)"}`,
      padding: 10,
    }}>
      <div className="mono" style={{ fontSize: 9, letterSpacing: "0.18em", color: muted, marginBottom: 8, textTransform: "uppercase" }}>
        Interlock status
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 4 }}>
        {items.map((i) => (
          <div key={i.lbl} style={{
            padding: "4px 8px",
            background: i.ok ? "rgba(122, 208, 122, 0.08)" : "rgba(255, 90, 58, 0.1)",
            border: `1px solid ${i.ok ? "#7ad07a" : "#ff5a3a"}`,
            fontFamily: "IBM Plex Mono", fontSize: 9, letterSpacing: "0.08em",
            color: i.ok ? "#7ad07a" : "#ff5a3a",
            display: "flex", justifyContent: "space-between",
          }}>
            <span>{i.ok ? "●" : "○"} {i.lbl}</span>
            <span style={{ opacity: 0.8 }}>{i.txt}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ----------------- Damage map ----------------- */
function DamageMap({ isDiegetic }) {
  const muted = isDiegetic ? "#c4a86a" : "var(--ink-muted)";
  const ink = isDiegetic ? "#f0e4c0" : "var(--ink)";
  return (
    <div style={{
      background: isDiegetic ? "#0e0805" : "var(--bg)",
      border: `1px solid ${isDiegetic ? "#5a3a18" : "var(--rule-strong)"}`,
      padding: 12,
    }}>
      <div className="mono" style={{ fontSize: 9, letterSpacing: "0.18em", color: muted, marginBottom: 8, textTransform: "uppercase" }}>
        Damage map · Type XXI/M3
      </div>
      <svg viewBox="0 0 600 80" style={{ width: "100%", display: "block" }}>
        <path d="M 20 40 Q 30 18 60 16 L 540 16 Q 570 18 580 40 Q 570 62 540 62 L 60 62 Q 30 60 20 40 Z"
              fill={isDiegetic ? "#1a1208" : "var(--bg-warm)"} stroke={ink} strokeWidth="1.5"/>
        <rect x="260" y="4" width="60" height="14" fill={isDiegetic ? "#1a1208" : "var(--bg-warm)"} stroke={ink} strokeWidth="1.5"/>
        {[100, 180, 260, 340, 420, 500].map((x) => (
          <line key={x} x1={x} y1="16" x2={x} y2="62" stroke={isDiegetic ? "#3a2410" : "var(--rule-strong)"} strokeDasharray="3 2"/>
        ))}
        {[
          {x:60, lbl:"FWD TORP", st: "ok"},
          {x:140, lbl:"BERTH", st: "ok"},
          {x:220, lbl:"CTRL", st: "ok"},
          {x:300, lbl:"ENG", st: "amber"},
          {x:380, lbl:"MOTOR", st: "red"},
          {x:460, lbl:"AFT TORP", st: "ok"},
          {x:540, lbl:"STERN", st: "ok"}
        ].map(s => (
          <g key={s.x}>
            <text x={s.x} y={45} fontFamily="IBM Plex Mono" fontSize="7" textAnchor="middle"
                  fill={s.st === "red" ? "#ff5a3a" : s.st === "amber" ? "#ffc950" : muted} letterSpacing="0.08em">{s.lbl}</text>
          </g>
        ))}
        {/* damage markers */}
        <circle cx="300" cy="40" r="5" fill="rgba(255,201,80,0.5)" stroke="#ffc950" strokeWidth="1.2"/>
        <circle cx="380" cy="40" r="7" fill="rgba(255,90,58,0.55)" stroke="#ff5a3a" strokeWidth="1.5" className="pulse"/>
      </svg>
      <div style={{ display: "flex", gap: 10, fontFamily: "IBM Plex Mono", fontSize: 9, letterSpacing: "0.12em", marginTop: 6, color: muted }}>
        <span><span style={{ color: "#ff5a3a" }}>●</span> Motor — flood</span>
        <span><span style={{ color: "#ffc950" }}>●</span> Eng — pump short</span>
      </div>
    </div>
  );
}

/* ----------------- Stufe lever ----------------- */
function StufeLever({ stufe, setStufe, isDiegetic }) {
  const muted = isDiegetic ? "#c4a86a" : "var(--ink-muted)";
  const labels = ["AUS · ALLE SYSTEME", "1 · LEISE", "2 · SEHR LEISE", "3 · TOTENSTILLE"];
  const colours = ["#7ad07a", "#ffc950", "#ff8a4a", "#ff5a3a"];
  return (
    <div style={{
      background: isDiegetic ? "#0e0805" : "var(--bg)",
      border: `1px solid ${isDiegetic ? "#5a3a18" : "var(--rule-strong)"}`,
      padding: 12,
    }}>
      <div className="mono" style={{ fontSize: 9, letterSpacing: "0.18em", color: muted, marginBottom: 8, textTransform: "uppercase" }}>
        Silent-running lever
      </div>
      <div style={{
        background: colours[stufe],
        color: "#0e0805", padding: "6px 10px",
        fontFamily: "IBM Plex Mono", fontSize: 11, letterSpacing: "0.14em",
        textTransform: "uppercase", fontWeight: 600, marginBottom: 8,
      }}>
        STUFE {stufe} · {["ALLE SYSTEME", "LEISE", "SEHR LEISE", "TOTENSTILLE"][stufe]}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 4 }}>
        {[0, 1, 2, 3].map((n) => (
          <button key={n} onClick={() => setStufe(n)}
                  style={{
                    padding: "8px 0",
                    background: stufe === n ? colours[n] : "transparent",
                    color: stufe === n ? "#0e0805" : colours[n],
                    border: `1px solid ${colours[n]}`,
                    fontFamily: "IBM Plex Mono", fontSize: 11, letterSpacing: "0.14em",
                    cursor: "pointer", textTransform: "uppercase", fontWeight: 600,
                  }}>
            {n === 0 ? "AUS" : n}
          </button>
        ))}
      </div>
      {stufe >= 2 && (
        <div style={{ marginTop: 8, fontSize: 11, fontStyle: "italic", color: muted, fontFamily: "Cormorant Garamond, serif", lineHeight: 1.4 }}>
          {stufe === 2 && "Diesels off. Blow restricted. Compressed-air refill disabled. Pumps low-flow only."}
          {stufe === 3 && "Electric main forced to creep. All pumps disabled. Damage repair severely restricted. Intercom whisper-only."}
        </div>
      )}
    </div>
  );
}

/* ----------------- Damage card queue ----------------- */
function DamageCardQueue({ stufe, isDiegetic }) {
  const muted = isDiegetic ? "#c4a86a" : "var(--ink-muted)";
  const ink = isDiegetic ? "#f0e4c0" : "var(--ink)";
  const cards = [
    { title: "Motor compartment flood", sev: 3, eta: "01:48", state: "ASSIGNED", crew: 3, lock: stufe >= 2, gate: null },
    { title: "Pump cell short — fwd",   sev: 2, eta: "—",     state: "STUFE-GATED", crew: 1, lock: stufe >= 2, gate: stufe >= 2 ? "Stufe ≤ 1" : null },
    { title: "Snorkel valve inspect",   sev: 1, eta: "—",     state: "QUEUED",      crew: 1, lock: false, gate: null },
  ];
  const sevColour = ["#7ad07a", "#7ad07a", "#ffc950", "#ff5a3a"];
  return (
    <div style={{
      background: isDiegetic ? "#0e0805" : "var(--bg)",
      border: `1px solid ${isDiegetic ? "#5a3a18" : "var(--rule-strong)"}`,
      padding: 12,
    }}>
      <div className="mono" style={{ fontSize: 9, letterSpacing: "0.18em", color: muted, marginBottom: 8, textTransform: "uppercase" }}>
        Damage card queue · 3 active
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {cards.map((c, i) => (
          <div key={i} style={{
            background: isDiegetic ? "#1a1208" : "var(--bg-warm)",
            border: `1px solid ${c.lock ? "#5a3a18" : sevColour[c.sev]}`,
            padding: "8px 10px",
            opacity: c.lock ? 0.55 : 1,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 3 }}>
              <span style={{ fontFamily: "IBM Plex Mono", fontSize: 11, color: ink, letterSpacing: "0.04em" }}>
                {"★".repeat(c.sev)}{"·".repeat(3 - c.sev)} {c.title}
              </span>
              <span style={{ fontFamily: "IBM Plex Mono", fontSize: 9, color: sevColour[c.sev], letterSpacing: "0.14em" }}>
                {c.eta !== "—" ? `T-${c.eta}` : "—"}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "IBM Plex Mono", fontSize: 8.5, color: muted, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              <span style={{ color: c.gate ? "#ff8a4a" : muted }}>
                {c.gate || c.state} · {c.crew} crew
              </span>
              <span>{Array.from({length: c.crew}).map((_, j) => "◆").join("")}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ----------------- Casualty list ----------------- */
function CasualtyList({ isDiegetic }) {
  const muted = isDiegetic ? "#c4a86a" : "var(--ink-muted)";
  const ink = isDiegetic ? "#f0e4c0" : "var(--ink)";
  const casualties = [
    { name: "Matr. Lange", sev: 3, comp: "Motor", timer: "08:12", treat: "Bauer · 60%" },
    { name: "Matr. Vogt",  sev: 2, comp: "Motor", timer: "32:00", treat: "Queued" },
    { name: "Matr. Frank", sev: 1, comp: "Eng",   timer: "—",     treat: "Self" },
  ];
  const sevColour = ["#7ad07a", "#7ad07a", "#ffc950", "#ff5a3a", "#5a3a18"];
  return (
    <div style={{
      background: isDiegetic ? "#0e0805" : "var(--bg)",
      border: `1px solid ${isDiegetic ? "#5a3a18" : "var(--rule-strong)"}`,
      padding: 12,
    }}>
      <div className="mono" style={{
        fontSize: 9, letterSpacing: "0.18em", color: muted, marginBottom: 8,
        textTransform: "uppercase", display: "flex", justifyContent: "space-between",
      }}>
        <span>Casualty list · 3 active</span>
        <span style={{ color: "#ff5a3a" }}>1 CRITICAL</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {casualties.map((c, i) => (
          <div key={i} style={{
            display: "grid", gridTemplateColumns: "auto 1fr auto",
            gap: 8, alignItems: "center",
            padding: "4px 0",
            borderBottom: `1px dashed ${isDiegetic ? "#3a2410" : "var(--rule)"}`,
            fontFamily: "IBM Plex Mono", fontSize: 10,
          }}>
            <span style={{ color: sevColour[c.sev], width: 50, letterSpacing: "0.06em" }}>
              {"★".repeat(c.sev)}{"·".repeat(4 - c.sev)}
            </span>
            <span style={{ color: ink, letterSpacing: "0.04em" }}>
              {c.name} <span style={{ color: muted, fontSize: 8.5 }}>· {c.comp}</span>
            </span>
            <span style={{ color: sevColour[c.sev], letterSpacing: "0.12em", textAlign: "right" }}>
              {c.timer} · {c.treat}
            </span>
          </div>
        ))}
      </div>
      <div style={{
        marginTop: 8, padding: "6px 10px",
        background: "rgba(255, 90, 58, 0.08)",
        border: "1px solid #ff5a3a",
        fontFamily: "Cormorant Garamond, serif", fontStyle: "italic", fontSize: 12, color: "#ff5a3a",
      }}>
        Matr. Lange — drag a medic-tagged pip to begin treatment.
      </div>
    </div>
  );
}

Object.assign(window, { EngineerStation });
