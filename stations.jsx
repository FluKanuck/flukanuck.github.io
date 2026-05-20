/* ============================================================
   Stations — mockups
   Captain: mid-fi UI mockup (per design doc §3.1)
   Sonar / Navigator / Engineer / Torpedo: schematic outlines
   Tweaks 'station_style' switches between diegetic vs ui-clean look
   ============================================================ */

/* ----------------- Captain mid-fi station ----------------- */
function CaptainStation({ style = "diegetic" }) {
  // Plotting table with five station cards, BdU clipboard, command toggles,
  // and a periscope nacelle preview.
  const [activeStation, setActiveStation] = useState(null);
  const [bsMode, setBsMode] = useState("watch"); // watch | battle
  const [look, setLook] = useState("down"); // down | up | left

  const isDiegetic = style === "diegetic";

  return (
    <div style={{
      background: isDiegetic ? "var(--bg-deep)" : "var(--bg-warm)",
      border: "1px solid var(--rule-strong)",
      padding: 0,
      boxShadow: "var(--paper-shadow)",
      overflow: "hidden",
    }}>
      {/* Top status bar */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        alignItems: "center",
        padding: "10px 18px",
        borderBottom: "1px solid var(--rule-strong)",
        background: isDiegetic ? "var(--bg-deep)" : "var(--bg-warm)",
        fontFamily: "IBM Plex Mono, monospace",
        fontSize: 11,
        letterSpacing: "0.14em",
        color: "var(--ink-muted)",
        textTransform: "uppercase",
      }}>
        <div style={{ display: "flex", gap: 16 }}>
          <span>U-241 ATLANTIK</span>
          <span style={{ color: "var(--ink)" }}>● Patrol day 23</span>
          <span>Grid AN-3614</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setBsMode("watch")}
                  className="chip"
                  style={{
                    background: bsMode === "watch" ? "var(--ink)" : "transparent",
                    color: bsMode === "watch" ? "var(--bg)" : "var(--ink-muted)",
                    borderColor: bsMode === "watch" ? "var(--ink)" : "var(--rule-strong)",
                    cursor: "pointer",
                  }}>Std Watch</button>
          <button onClick={() => setBsMode("battle")}
                  className="chip"
                  style={{
                    background: bsMode === "battle" ? "var(--accent)" : "transparent",
                    color: bsMode === "battle" ? "var(--bg)" : "var(--accent)",
                    borderColor: "var(--accent)",
                    cursor: "pointer",
                  }}>Battle Stations</button>
        </div>
        <div style={{ display: "flex", gap: 16, justifyContent: "flex-end" }}>
          <span>Depth 080 m</span>
          <span>Crs 270°</span>
          <span>Spd 04 kn</span>
          <span style={{ color: "var(--accent)" }}>BAT 67%</span>
        </div>
      </div>

      {/* Three-anchor camera switcher (left rail) */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "78px 1fr 240px",
        minHeight: 540,
      }}>
        <div style={{
          background: isDiegetic ? "rgba(0,0,0,0.06)" : "var(--bg-warm)",
          borderRight: "1px solid var(--rule-strong)",
          padding: "16px 8px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}>
          <div className="mono" style={{ fontSize: 9, letterSpacing: "0.18em", color: "var(--ink-muted)", textAlign: "center" }}>LOOK</div>
          {[
            { id: "down", label: "TABLE", sub: "Down" },
            { id: "up",   label: "WALL",  sub: "Up" },
            { id: "left", label: "SCOPE", sub: "Left" },
          ].map((b) => (
            <button key={b.id}
                    onClick={() => setLook(b.id)}
                    style={{
                      padding: "12px 4px",
                      background: look === b.id ? "var(--ink)" : "transparent",
                      color: look === b.id ? "var(--bg)" : "var(--ink-muted)",
                      border: "1px solid " + (look === b.id ? "var(--ink)" : "var(--rule-strong)"),
                      cursor: "pointer",
                      fontFamily: "IBM Plex Mono",
                      fontSize: 10,
                      letterSpacing: "0.14em",
                      textAlign: "center",
                    }}>
              <div style={{ fontWeight: 600 }}>{b.label}</div>
              <div style={{ fontSize: 8, marginTop: 2, opacity: 0.7 }}>{b.sub}</div>
            </button>
          ))}
        </div>

        {/* Central plot — varies by look anchor */}
        <div style={{ padding: 18, position: "relative" }}>
          {look === "down" && <PlotTable activeStation={activeStation} setActiveStation={setActiveStation} bsMode={bsMode} isDiegetic={isDiegetic}/>}
          {look === "up"   && <WallReadouts isDiegetic={isDiegetic}/>}
          {look === "left" && <PeriscopeView isDiegetic={isDiegetic}/>}
        </div>

        {/* Right side dock — BdU inbox / commands */}
        <div style={{
          borderLeft: "1px solid var(--rule-strong)",
          padding: 14,
          background: isDiegetic ? "rgba(0,0,0,0.04)" : "var(--bg-warm)",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}>
          <BdUClipboard isDiegetic={isDiegetic}/>
          <CommandToggles/>
        </div>
      </div>

      {/* Audit ticker strip */}
      <div style={{
        borderTop: "1px solid var(--rule-strong)",
        padding: "8px 18px",
        background: "var(--bg)",
        display: "flex",
        gap: 24,
        overflow: "hidden",
        fontFamily: "IBM Plex Mono, monospace",
        fontSize: 10,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "var(--ink-muted)",
      }}>
        <span style={{ color: "var(--ink)" }}>AUDIT</span>
        <span>· Bauer ↗ Damage Ctrl · 14:22:08</span>
        <span>· Krüger ↘ from Engineer (return) · 14:21:45</span>
        <span>· Tube 3 reload start · 14:19:12</span>
        <span>· Bold reload tube 2 complete · 14:14:30</span>
      </div>
    </div>
  );
}

/* ----------------- Plot table (down anchor) ----------------- */
function PlotTable({ activeStation, setActiveStation, bsMode, isDiegetic }) {
  const stations = [
    { id: "SONAR",     bs: { watch: "1/2", battle: "2/2" }, pip: "amber",
      tasks: ["Track Mehrfach contact 274°", "Calibrate GHG [CMD]", "Bauer ↗ Damage Ctrl «log»"],
      named: { initial: "B", name: "Funkmaat Bauer", tier: 4, sub: "Sonar veteran" } },
    { id: "NAVIGATOR", bs: { watch: "2/3", battle: "3/3" }, pip: "off",
      tasks: ["Decode burst 14:11 [CMD]", "Plot DR fix"],
      named: { initial: "S", name: "Obersteuermann Stahl", tier: 3, sub: "Plot + cipher" } },
    { id: "ENGINEER",  bs: { watch: "3/4", battle: "5/5" }, pip: "off",
      tasks: ["Snorkel charge ETA 02:14", "Trim adjust"],
      named: { initial: "K", name: "Obermaschinist Krüger", tier: 4, sub: "LI deputy" } },
    { id: "TORPEDO",   bs: { watch: "4/5", battle: "7/7" }, pip: "red",
      tasks: ["Reload tube 3 [CMD]", "Bold reload (×2 pending)", "Wire-spool rewind"],
      named: { initial: "H", name: "Bootsmaat Hellmann", tier: 3, sub: "WO @ Vorhaltrechner" } },
    { id: "ORDERLY",   bs: { watch: "1/2", battle: "2/2" }, pip: "off",
      tasks: ["Coffee tray", "Slip filing"],
      named: { initial: "—", name: "Orderly (Captain)", tier: 2, sub: "Galley loaner" } },
  ];

  return (
    <div>
      <div className="mono" style={{ fontSize: 10, letterSpacing: "0.18em", color: "var(--ink-muted)", marginBottom: 10 }}>
        PLOTTING TABLE · TACTICAL BOARD
      </div>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: 10,
      }}>
        {stations.map((s) => (
          <StationCard key={s.id} {...s} active={activeStation === s.id}
                       bsMode={bsMode}
                       isDiegetic={isDiegetic}
                       onClick={() => setActiveStation(activeStation === s.id ? null : s.id)}/>
        ))}
      </div>
    </div>
  );
}

function StationCard({ id, tasks, named, bs, pip, active, isDiegetic, bsMode, onClick }) {
  const accentColour = pip === "red" ? "var(--accent)" : pip === "amber" ? "#c9a13a" : "var(--rule-strong)";
  return (
    <button onClick={onClick}
            style={{
              background: isDiegetic ? "var(--bg)" : "var(--bg-warm)",
              border: `1px solid ${active ? "var(--ink)" : "var(--rule-strong)"}`,
              padding: "12px 12px 10px",
              cursor: "pointer",
              textAlign: "left",
              fontFamily: "inherit",
              color: "inherit",
              boxShadow: active ? "0 4px 14px rgba(26,20,16,0.18)" : "none",
              position: "relative",
              minHeight: 280,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3, background: accentColour
      }}/>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span className="mono" style={{ fontSize: 11, letterSpacing: "0.18em", fontWeight: 600 }}>
          {id}
        </span>
        {pip !== "off" && (
          <span className="pulse" style={{
            width: 8, height: 8, borderRadius: "50%", background: accentColour
          }}/>
        )}
      </div>

      {/* Task queue */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 11, lineHeight: 1.35, color: "var(--ink-muted)", flex: 1 }}>
        {tasks.map((t, i) => (
          <div key={i} style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 10 }}>
            <span style={{ color: "var(--ink)", marginRight: 4 }}>·</span>{t}
          </div>
        ))}
      </div>

      {/* Crew divider */}
      <div style={{
        fontFamily: "IBM Plex Mono, monospace", fontSize: 9, letterSpacing: "0.14em",
        color: "var(--ink-faint)", borderTop: "1px dashed var(--rule-strong)", paddingTop: 6,
        display: "flex", justifyContent: "space-between"
      }}>
        <span>CREW</span><span>{bsMode === "battle" ? bs.battle : bs.watch}</span>
      </div>

      {/* Named NCO */}
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <div style={{
          width: 32, height: 32,
          background: "var(--bg-deep)",
          border: "1px solid var(--rule-strong)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "Cormorant Garamond, serif",
          fontSize: 16, fontWeight: 600, color: "var(--ink)",
        }}>{named.initial}</div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 10.5, fontWeight: 600, color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {named.name}
          </div>
          <div style={{ fontFamily: "IBM Plex Mono", fontSize: 8.5, color: "var(--ink-muted)", letterSpacing: "0.06em" }}>
            {named.sub} · {"●".repeat(named.tier)}{"○".repeat(4 - named.tier)}
          </div>
        </div>
      </div>

      {/* Pool pips + status icons */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        fontFamily: "IBM Plex Mono", fontSize: 10, color: "var(--ink-muted)"
      }}>
        <div style={{ display: "flex", gap: 3 }}>
          {Array.from({length: 4}).map((_, i) => (
            <span key={i} style={{
              width: 9, height: 9,
              background: i < 2 ? "var(--ink)" : "transparent",
              border: "1px solid var(--ink-muted)",
              transform: "rotate(45deg)",
              display: "inline-block",
            }}/>
          ))}
        </div>
        <div style={{ display: "flex", gap: 4, fontSize: 11 }}>
          <span title="Morale">⚡</span><span title="Fatigue">⏰</span>
        </div>
      </div>
    </button>
  );
}

/* ----------------- Wall readouts (up anchor) ----------------- */
function WallReadouts({ isDiegetic }) {
  const dials = [
    { lbl: "DEPTH",   val: "080", unit: "m",  scale: 0.4 },
    { lbl: "COURSE",  val: "270", unit: "°",  scale: 0.75 },
    { lbl: "SPEED",   val: "04",  unit: "kn", scale: 0.2 },
    { lbl: "BATT",    val: "67",  unit: "%",  scale: 0.67, accent: true },
    { lbl: "AIR",     val: "82",  unit: "%",  scale: 0.82 },
    { lbl: "TRIM",    val: "00",  unit: "°",  scale: 0.5 },
  ];
  return (
    <div>
      <div className="mono" style={{ fontSize: 10, letterSpacing: "0.18em", color: "var(--ink-muted)", marginBottom: 10 }}>
        WALL INSTRUMENTS · READ-ONLY
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {dials.map((d) => (
          <div key={d.lbl} style={{
            background: isDiegetic ? "var(--bg)" : "var(--bg-warm)",
            border: "1px solid var(--rule-strong)",
            padding: 16,
            textAlign: "center",
          }}>
            <div className="mono" style={{ fontSize: 9, letterSpacing: "0.2em", color: "var(--ink-muted)" }}>{d.lbl}</div>
            <div className="serif" style={{ fontSize: 44, fontWeight: 500, lineHeight: 1, marginTop: 8, color: d.accent ? "var(--accent)" : "var(--ink)" }}>
              {d.val}<span style={{ fontSize: 18, color: "var(--ink-muted)", marginLeft: 4 }}>{d.unit}</span>
            </div>
            <div style={{ marginTop: 12, height: 4, background: "var(--bg-deep)", border: "1px solid var(--rule-strong)" }}>
              <div style={{ width: `${d.scale * 100}%`, height: "100%", background: d.accent ? "var(--accent)" : "var(--ink)" }}/>
            </div>
          </div>
        ))}
      </div>
      {/* damage map */}
      <div style={{ marginTop: 18, background: "var(--bg)", border: "1px solid var(--rule-strong)", padding: 14 }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.2em", color: "var(--ink-muted)", marginBottom: 8 }}>
          DAMAGE MAP · TYPE XXI/M3
        </div>
        <svg viewBox="0 0 600 90" style={{ width: "100%", display: "block" }}>
          {/* simplified hull silhouette */}
          <path d="M 20 45 Q 30 25 60 22 L 540 22 Q 570 22 580 45 Q 570 68 540 68 L 60 68 Q 30 65 20 45 Z"
                fill="var(--bg-warm)" stroke="var(--ink)" strokeWidth="1.5"/>
          {/* conning tower */}
          <rect x="260" y="6" width="60" height="18" fill="var(--bg-warm)" stroke="var(--ink)" strokeWidth="1.5"/>
          {/* compartment dividers */}
          {[100, 180, 260, 340, 420, 500].map((x) => (
            <line key={x} x1={x} y1="22" x2={x} y2="68" stroke="var(--rule-strong)" strokeDasharray="3 2"/>
          ))}
          {/* labels */}
          {[
            {x:60, lbl:"FWD TORP"},{x:140, lbl:"BERTH"},{x:220, lbl:"CTRL"},
            {x:300, lbl:"ENGINE"},{x:380, lbl:"MOTOR"},{x:460, lbl:"AFT TORP"},{x:540, lbl:"STERN"}
          ].map(s => (
            <text key={s.x} x={s.x} y={50} fontFamily="IBM Plex Mono" fontSize="7"
                  textAnchor="middle" fill="var(--ink-muted)" letterSpacing="0.1em">{s.lbl}</text>
          ))}
          {/* one damage marker */}
          <circle cx="380" cy="45" r="6" fill="rgba(217,120,41,0.4)" stroke="var(--accent)" strokeWidth="1"/>
        </svg>
      </div>
    </div>
  );
}

/* ----------------- Periscope (left anchor) ----------------- */
function PeriscopeView({ isDiegetic }) {
  const [mode, setMode] = useState("attack");
  return (
    <div>
      <div className="mono" style={{ fontSize: 10, letterSpacing: "0.18em", color: "var(--ink-muted)", marginBottom: 10, display: "flex", justifyContent: "space-between" }}>
        <span>PERISCOPE NACELLE · MODE: {mode.toUpperCase()}</span>
        <span style={{ color: "var(--accent)" }}>● BUDGET 06.0 s</span>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button onClick={() => setMode("search")}
                className="chip"
                style={{
                  background: mode === "search" ? "var(--ink)" : "transparent",
                  color: mode === "search" ? "var(--bg)" : "var(--ink-muted)",
                  borderColor: "var(--rule-strong)", cursor: "pointer",
                }}>Search · 70° FoV · 6 s</button>
        <button onClick={() => setMode("attack")}
                className="chip"
                style={{
                  background: mode === "attack" ? "var(--ink)" : "transparent",
                  color: mode === "attack" ? "var(--bg)" : "var(--ink-muted)",
                  borderColor: "var(--rule-strong)", cursor: "pointer",
                }}>Attack · 20° FoV · 9 s</button>
      </div>
      <div style={{
        background: isDiegetic ? "#0e1014" : "var(--bg)",
        border: "1px solid var(--rule-strong)",
        aspectRatio: "16 / 9",
        position: "relative",
        overflow: "hidden",
      }}>
        <svg viewBox="0 0 800 450" style={{ width: "100%", height: "100%", display: "block" }}>
          {/* horizon */}
          <defs>
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1f2a30"/>
              <stop offset="100%" stopColor="#2a3a3e"/>
            </linearGradient>
            <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0e1a1e"/>
              <stop offset="100%" stopColor="#04080a"/>
            </linearGradient>
          </defs>
          <rect width="800" height="220" fill="url(#sky)"/>
          <rect y="220" width="800" height="230" fill="url(#sea)"/>
          {/* ship silhouette */}
          <g transform="translate(430, 195)">
            <rect x="-60" y="0" width="120" height="22" fill="#0a0c0e"/>
            <rect x="-50" y="-14" width="40" height="14" fill="#0a0c0e"/>
            <rect x="0" y="-10" width="14" height="10" fill="#0a0c0e"/>
            <rect x="20" y="-22" width="6" height="22" fill="#0a0c0e"/>
          </g>
          {/* reticle (attack) */}
          {mode === "attack" && (
            <g stroke="rgba(120,160,140,0.6)" strokeWidth="1" fill="none">
              <circle cx="400" cy="225" r="180"/>
              <circle cx="400" cy="225" r="60"/>
              <line x1="220" y1="225" x2="580" y2="225"/>
              <line x1="400" y1="45" x2="400" y2="405"/>
              {/* stadimeter ticks */}
              {[-90, -60, -30, 30, 60, 90].map((d) => (
                <line key={d} x1={400+d} y1="220" x2={400+d} y2="230"/>
              ))}
              {/* bearing readout */}
              <text x="400" y="385" textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="14" fill="rgba(120,180,140,0.85)" letterSpacing="0.18em">
                BRG 274° · RNG 3800 m
              </text>
            </g>
          )}
          {mode === "search" && (
            <g stroke="rgba(120,160,140,0.4)" strokeWidth="1" fill="none">
              <line x1="0" y1="225" x2="800" y2="225"/>
              <line x1="400" y1="0" x2="400" y2="450"/>
              <text x="20" y="36" fontFamily="IBM Plex Mono" fontSize="10" fill="rgba(120,180,140,0.65)" letterSpacing="0.18em">
                AZIMUTH 270°  ·  ELEV 00°
              </text>
            </g>
          )}
          {/* vignette */}
          <circle cx="400" cy="225" r="225" fill="none" stroke="black" strokeWidth="60" opacity="0.6"/>
        </svg>
      </div>
      <div className="mono" style={{ fontSize: 10, color: "var(--ink-muted)", marginTop: 10, letterSpacing: "0.08em" }}>
        Oben, schwenken, unten — up, sweep, down. Past budget, detection probability rises.
        Voice-only feedback: 1st Watch Officer warns. No HUD, no vignette pulse.
      </div>
    </div>
  );
}

/* ----------------- BdU clipboard ----------------- */
function BdUClipboard({ isDiegetic }) {
  const slips = [
    { lvl: "HIGH",  txt: "Recall Brest immediately", date: "14:31" },
    { lvl: "MED",   txt: "Convoy ONS-42 brg 270 / 045 / 8.5kn", date: "12:08" },
    { lvl: "INFO",  txt: "Force-7 gale NW, ETA 22h", date: "08:14" },
    { lvl: "LOW",   txt: "Proceed to grid AN-1234", date: "06:45" },
  ];
  const colour = (lvl) => ({
    HIGH: "var(--accent)", MED: "#c9a13a", INFO: "var(--blueprint)", LOW: "var(--ink-muted)",
  }[lvl]);
  return (
    <div>
      <div className="mono" style={{ fontSize: 9, letterSpacing: "0.18em", color: "var(--ink-muted)", marginBottom: 8 }}>
        BdU CLIPBOARD · INBOX
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {slips.map((s, i) => (
          <div key={i} style={{
            background: "var(--bg)",
            borderLeft: `3px solid ${colour(s.lvl)}`,
            padding: "8px 10px",
            fontSize: 11,
            position: "relative",
            transform: i === 0 ? "rotate(-0.6deg)" : "rotate(0.2deg)",
            boxShadow: "0 1px 2px rgba(26,20,16,0.1)",
          }}>
            <div className="mono" style={{ fontSize: 8.5, letterSpacing: "0.18em", color: colour(s.lvl), marginBottom: 3 }}>
              {s.lvl} · {s.date}
            </div>
            <div style={{ fontSize: 11.5, lineHeight: 1.35 }}>{s.txt}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ----------------- Command toggles ----------------- */
function CommandToggles() {
  const [comp, setComp] = useState(1);
  const [engaged, setEngaged] = useState(true);
  const times = [1, 2, 8, 32, 256];
  return (
    <div>
      <div className="mono" style={{ fontSize: 9, letterSpacing: "0.18em", color: "var(--ink-muted)", marginBottom: 8 }}>
        COMMAND ENGAGEMENT
      </div>
      <div style={{ background: "var(--bg)", border: "1px solid var(--rule-strong)", padding: 12 }}>
        <div className="mono" style={{ fontSize: 9, color: "var(--ink-muted)", marginBottom: 4 }}>TIME COMPRESSION</div>
        <div style={{ display: "flex", gap: 4 }}>
          {times.map((t) => (
            <button key={t} onClick={() => setComp(t)}
                    style={{
                      flex: 1, padding: "6px 0",
                      background: comp === t ? "var(--ink)" : "transparent",
                      color: comp === t ? "var(--bg)" : "var(--ink-muted)",
                      border: "1px solid var(--rule-strong)",
                      fontFamily: "IBM Plex Mono", fontSize: 11, cursor: "pointer",
                    }}>×{t}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
          <button onClick={() => setEngaged(!engaged)}
                  style={{
                    flex: 1, padding: "10px 0",
                    background: engaged ? "var(--accent)" : "transparent",
                    color: engaged ? "var(--bg)" : "var(--accent)",
                    border: "1px solid var(--accent)",
                    fontFamily: "IBM Plex Mono", fontSize: 11, letterSpacing: "0.14em",
                    cursor: "pointer", textTransform: "uppercase",
                  }}>{engaged ? "Engaged" : "Disengaged"}</button>
        </div>
      </div>
    </div>
  );
}

/* ----------------- Other 4 station schematics ----------------- */
function StationSchematic({ id, role, char, panels, work, color, deferred = true }) {
  return (
    <div className="card" style={{ borderColor: color === "accent" ? "var(--accent)" : "var(--rule-strong)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h3 className="serif" style={{ fontSize: 26, fontWeight: 500, margin: 0, color: "var(--ink)", letterSpacing: 0, textTransform: "none" }}>
          {id}
        </h3>
        {deferred ? <span className="stamp muted">Deep-dive deferred</span> : <span className="stamp">Designed</span>}
      </div>
      <div className="mono" style={{ fontSize: 10, letterSpacing: "0.16em", color: "var(--ink-muted)", marginBottom: 12, textTransform: "uppercase" }}>
        {role}
      </div>
      <p style={{ margin: "0 0 16px", fontSize: 13.5, color: "var(--ink)", lineHeight: 1.5 }}>{char}</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <div>
          <div className="mono" style={{ fontSize: 9, color: "var(--ink-muted)", letterSpacing: "0.2em", marginBottom: 6 }}>PANELS</div>
          <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 4 }}>
            {panels.map((p, i) => (
              <li key={i} style={{ fontFamily: "IBM Plex Mono", fontSize: 11, color: "var(--ink)", padding: "4px 0", borderBottom: "1px dashed var(--rule)" }}>
                <span style={{ color: "var(--accent)", marginRight: 6 }}>▸</span>{p}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="mono" style={{ fontSize: 9, color: "var(--ink-muted)", letterSpacing: "0.2em", marginBottom: 6 }}>WORK</div>
          <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 4 }}>
            {work.map((p, i) => (
              <li key={i} style={{ fontFamily: "IBM Plex Mono", fontSize: 11, color: "var(--ink)", padding: "4px 0", borderBottom: "1px dashed var(--rule)" }}>
                <span style={{ color: "var(--blueprint)", marginRight: 6 }}>◆</span>{p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { CaptainStation, StationSchematic });
