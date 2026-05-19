/* ============================================================
   Torpedo mid-fi station mockup (per design doc §3.5)

   Single standing stance, THREE-SURFACE console: Vorhaltrechner
   (left) · plotting table (centre with Plotting Aid switch) ·
   tube-status + Bold + Sieglinde (right). Forward bulkhead: tube
   observation viewport. Two wire-guidance consoles below the
   Vorhaltrechner. Brass + oil + steel aesthetic.
   ============================================================ */

function TorpedoStation({ style = "diegetic" }) {
  const [plotAid, setPlotAid] = useState("standard"); // auto | standard | manual
  const [targetSlot, setTargetSlot] = useState("T1");
  const [signature, setSignature] = useState("submerged");
  const [sieglinde, setSieglinde] = useState("deployed"); // stowed | deploying | deployed | recovering | lost
  const isDiegetic = style === "diegetic";

  return (
    <div style={{
      background: isDiegetic ? "#100a04" : "var(--bg-warm)",
      border: "1px solid var(--rule-strong)",
      padding: 0,
      boxShadow: "var(--paper-shadow)",
      overflow: "hidden",
      color: isDiegetic ? "#f0e4c0" : "var(--ink)",
    }}>
      {/* Top status bar */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        alignItems: "center",
        padding: "10px 18px",
        background: isDiegetic ? "#1a1408" : "var(--bg-deep)",
        borderBottom: "1px solid rgba(212, 167, 106, 0.3)",
        fontFamily: "IBM Plex Mono, monospace",
        fontSize: 11,
        letterSpacing: "0.14em",
        color: isDiegetic ? "#c4a86a" : "var(--ink-muted)",
        textTransform: "uppercase",
      }}>
        <div style={{ display: "flex", gap: 16 }}>
          <span>TORPEDORAUM · U-241</span>
          <span style={{ color: isDiegetic ? "#d4a76a" : "var(--ink)" }}>● WO + Krüger · Trp 9 · ●●●●</span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ color: "#ff8a4a" }}>SLOT: {targetSlot}</span>
          <span style={{ color: plotAid === "manual" ? "#ff5a3a" : plotAid === "standard" ? "#ffc950" : "#7ad07a" }}>
            PLOTTING AID: {plotAid.toUpperCase()}
          </span>
        </div>
        <div style={{ display: "flex", gap: 16, justifyContent: "flex-end" }}>
          <span>Inventory: 14 fish · 22 Bold · 8 mines</span>
          <span style={{ color: "#ffc950" }}>Air 82%</span>
        </div>
      </div>

      {/* Tube observation viewport */}
      <TubeViewport isDiegetic={isDiegetic}/>

      {/* Three-surface console */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1.1fr 1.4fr 1fr",
        gap: 0,
        background: isDiegetic ? "radial-gradient(ellipse at center top, #1a1408 0%, #08050a 100%)" : "var(--bg-warm)",
      }}>
        {/* LEFT — Vorhaltrechner + wire-guide */}
        <div style={{
          padding: 18,
          borderRight: "1px solid rgba(212, 167, 106, 0.18)",
          display: "flex", flexDirection: "column", gap: 14,
        }}>
          <VorhaltrechnerPanel targetSlot={targetSlot} setTargetSlot={setTargetSlot} isDiegetic={isDiegetic}/>
          <WireGuidanceConsoles isDiegetic={isDiegetic}/>
        </div>

        {/* CENTER — Plotting table */}
        <div style={{
          padding: 18,
          borderRight: "1px solid rgba(212, 167, 106, 0.18)",
          display: "flex", flexDirection: "column", gap: 14,
        }}>
          <PlottingTable plotAid={plotAid} setPlotAid={setPlotAid} isDiegetic={isDiegetic}/>
          <LauschangriffStrip isDiegetic={isDiegetic}/>
        </div>

        {/* RIGHT — Tube status + Bold + Sieglinde */}
        <div style={{
          padding: 18,
          display: "flex", flexDirection: "column", gap: 14,
        }}>
          <TubeStatusPanel isDiegetic={isDiegetic}/>
          <BoldLauncher signature={signature} setSignature={setSignature} isDiegetic={isDiegetic}/>
          <SieglindePanel state={sieglinde} setState={setSieglinde} isDiegetic={isDiegetic}/>
        </div>
      </div>

      {/* Bottom audit */}
      <div style={{
        borderTop: "1px solid rgba(212, 167, 106, 0.18)",
        padding: "8px 18px",
        background: isDiegetic ? "#08050a" : "var(--bg)",
        fontFamily: "IBM Plex Mono, monospace", fontSize: 10,
        letterSpacing: "0.14em", textTransform: "uppercase",
        color: isDiegetic ? "#c4a86a" : "var(--ink-muted)",
        display: "flex", gap: 24, overflow: "hidden",
      }}>
        <span style={{ color: isDiegetic ? "#d4a76a" : "var(--ink)" }}>WEAPONS LOG</span>
        <span style={{ color: "#ff8a4a" }}>· 14:31  Lerche A wire active · brg 274 · 0.6 nm to run</span>
        <span>· 14:18  Sieglinde streamed · 6 kn cap</span>
        <span style={{ color: "#7ad07a" }}>· 13:44  Tube 3 reload complete · Schlange T16</span>
        <span>· 13:31  Captain authorised compressed-air refill</span>
      </div>
    </div>
  );
}

/* ----------------- Tube observation viewport ----------------- */
function TubeViewport({ isDiegetic }) {
  const bowTubes = [1, 2, 3, 4, 5, 6];
  const sternTubes = [7, 8];
  const states = {
    1: { type: "Zaunkönig III", state: "armed",    colour: "#ff8a4a" },
    2: { type: "Lerche II",      state: "armed",    colour: "#ff8a4a" },
    3: { type: "Schlange",       state: "loading",  colour: "#ffc950" },
    4: { type: "Zaunkönig III",  state: "ready",    colour: "#7ad07a" },
    5: { type: "Lerche II",      state: "ready",    colour: "#7ad07a" },
    6: { type: "TMC mine",       state: "ready",    colour: "#7fb4dc" },
    7: { type: "Steinbutt",      state: "ready",    colour: "#7ad07a" },
    8: { type: "Zaunkönig III",  state: "empty",    colour: "#5a3a18" },
  };
  return (
    <div style={{
      background: isDiegetic ? "#0a0805" : "var(--bg-warm)",
      borderBottom: "1px solid rgba(212, 167, 106, 0.18)",
      padding: "10px 18px",
    }}>
      <div className="mono" style={{
        fontSize: 9, letterSpacing: "0.18em",
        color: isDiegetic ? "#c4a86a" : "var(--ink-muted)",
        marginBottom: 8, textTransform: "uppercase",
        display: "flex", justifyContent: "space-between",
      }}>
        <span>Tube observation viewport · forward bulkhead</span>
        <span>STORAGE: 14 fish remaining · brass + oil</span>
      </div>
      <svg viewBox="0 0 1100 100" style={{ width: "100%", display: "block" }}>
        <defs>
          <pattern id="brass" patternUnits="userSpaceOnUse" width="10" height="10">
            <rect width="10" height="10" fill={isDiegetic ? "#241808" : "var(--bg)"}/>
            <line x1="0" y1="5" x2="10" y2="5" stroke={isDiegetic ? "#5a3a18" : "var(--rule-strong)"} strokeWidth="0.3" opacity="0.6"/>
          </pattern>
        </defs>
        <rect x="0" y="0" width="1100" height="100" fill="url(#brass)"/>
        {/* Bow tubes — 6 across left side */}
        <text x="20" y="14" fontFamily="IBM Plex Mono" fontSize="9" fill={isDiegetic ? "#d4a76a" : "var(--ink-muted)"} letterSpacing="0.2em">BOW</text>
        {bowTubes.map((n, i) => {
          const x = 50 + i * 110;
          const s = states[n];
          return (
            <g key={n}>
              <rect x={x} y={20} width="98" height="56" fill={isDiegetic ? "#1a1208" : "var(--bg-warm)"}
                    stroke={s.colour} strokeWidth="1.5"/>
              {/* Tube circle face */}
              <circle cx={x + 49} cy={48} r="22" fill={isDiegetic ? "#0a0502" : "var(--bg)"} stroke={s.colour} strokeWidth="1.2"/>
              <circle cx={x + 49} cy={48} r="14" fill="none" stroke={s.colour} strokeWidth="0.6" opacity="0.5"/>
              {s.state !== "empty" && (
                <text x={x + 49} y={51} textAnchor="middle" fontFamily="Cormorant Garamond" fontSize="14" fontWeight="600" fill={s.colour}>
                  {n}
                </text>
              )}
              <text x={x + 49} y={88} textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="7" fill={s.colour} letterSpacing="0.1em">
                {s.type}
              </text>
            </g>
          );
        })}
        {/* Stern tubes — 2 across right side */}
        <text x="775" y="14" fontFamily="IBM Plex Mono" fontSize="9" fill={isDiegetic ? "#d4a76a" : "var(--ink-muted)"} letterSpacing="0.2em">STERN</text>
        {sternTubes.map((n, i) => {
          const x = 820 + i * 110;
          const s = states[n];
          return (
            <g key={n}>
              <rect x={x} y={20} width="98" height="56" fill={isDiegetic ? "#1a1208" : "var(--bg-warm)"}
                    stroke={s.colour} strokeWidth="1.5"/>
              <circle cx={x + 49} cy={48} r="22" fill={isDiegetic ? "#0a0502" : "var(--bg)"} stroke={s.colour} strokeWidth="1.2"/>
              <circle cx={x + 49} cy={48} r="14" fill="none" stroke={s.colour} strokeWidth="0.6" opacity="0.5"/>
              {s.state !== "empty" && (
                <text x={x + 49} y={51} textAnchor="middle" fontFamily="Cormorant Garamond" fontSize="14" fontWeight="600" fill={s.colour}>
                  {n}
                </text>
              )}
              <text x={x + 49} y={88} textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="7" fill={s.colour} letterSpacing="0.1em">
                {s.type}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ----------------- Vorhaltrechner M-7 panel ----------------- */
function VorhaltrechnerPanel({ targetSlot, setTargetSlot, isDiegetic }) {
  const ink = isDiegetic ? "#f0e4c0" : "var(--ink)";
  const muted = isDiegetic ? "#c4a86a" : "var(--ink-muted)";
  const brass = "#d4a76a";

  const dials = [
    { lbl: "COURSE",  val: "045°",  norm: 0.125 },
    { lbl: "SPEED",   val: "8.5 kn", norm: 0.5 },
    { lbl: "RANGE",   val: "3,800",  norm: 0.4 },
    { lbl: "AOB",     val: "STBD 70°", norm: 0.7 },
    { lbl: "DEPTH",   val: "5 m",    norm: 0.15 },
    { lbl: "GYRO",    val: "+12°",   norm: 0.55 },
  ];

  return (
    <div style={{
      background: isDiegetic ? "#0e0a04" : "var(--bg)",
      border: `1px solid ${isDiegetic ? "#5a3a18" : "var(--rule-strong)"}`,
      padding: 14,
    }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8,
      }}>
        <div>
          <div className="mono" style={{ fontSize: 9.5, letterSpacing: "0.18em", color: muted, textTransform: "uppercase" }}>
            VORHALTRECHNER M-7
          </div>
          <div className="serif" style={{ fontSize: 18, fontStyle: "italic", color: ink, lineHeight: 1, marginTop: 2 }}>
            Fire control · 4-target
          </div>
        </div>
        <span style={{
          fontFamily: "IBM Plex Mono", fontSize: 9, letterSpacing: "0.16em",
          color: "#7ad07a", padding: "2px 8px",
          border: "1px solid #7ad07a", textTransform: "uppercase",
        }}>
          ● SOLUTION LOCKED
        </span>
      </div>

      {/* Target slot switcher */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 4, marginBottom: 10 }}>
        {["T1", "T2", "T3", "T4"].map((t) => (
          <button key={t} onClick={() => setTargetSlot(t)}
                  style={{
                    padding: "6px 0",
                    background: targetSlot === t ? brass : "transparent",
                    color: targetSlot === t ? "#0e0a04" : muted,
                    border: `1px solid ${targetSlot === t ? brass : (isDiegetic ? "#5a3a18" : "var(--rule-strong)")}`,
                    fontFamily: "IBM Plex Mono", fontSize: 10.5, letterSpacing: "0.16em",
                    cursor: "pointer", fontWeight: 600,
                  }}>
            {t}
          </button>
        ))}
      </div>

      {/* 6 input dials */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 10 }}>
        {dials.map((d) => {
          const angle = d.norm * 270 - 135;
          return (
            <div key={d.lbl} style={{
              background: isDiegetic ? "#1a1208" : "var(--bg-warm)",
              border: `1px solid ${isDiegetic ? "#3a2410" : "var(--rule)"}`,
              padding: 6, textAlign: "center",
            }}>
              <div className="mono" style={{ fontSize: 8, letterSpacing: "0.16em", color: muted, textTransform: "uppercase" }}>
                {d.lbl}
              </div>
              <div style={{ position: "relative", width: 40, height: 40, margin: "4px auto 2px" }}>
                <div style={{
                  position: "absolute", inset: 0, borderRadius: "50%",
                  background: isDiegetic ? "#0a0502" : "var(--bg)",
                  border: `1.5px solid ${brass}`,
                }}/>
                <div style={{
                  position: "absolute", top: 3, left: "50%",
                  width: 2, height: 12,
                  background: brass,
                  transformOrigin: "1px 17px",
                  transform: `rotate(${angle}deg)`, marginLeft: -1,
                }}/>
              </div>
              <div className="mono" style={{ fontSize: 9.5, color: brass, letterSpacing: "0.06em", fontWeight: 600 }}>
                {d.val}
              </div>
            </div>
          );
        })}
      </div>

      {/* PULL SOLUTION + confidence */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
        <button style={{
          padding: "8px 0",
          background: brass, color: "#0e0a04",
          border: `1px solid ${brass}`,
          fontFamily: "IBM Plex Mono", fontSize: 10, letterSpacing: "0.18em",
          cursor: "pointer", fontWeight: 600, textTransform: "uppercase",
        }}>
          ▶ PULL SOLUTION
        </button>
        <div style={{
          padding: "6px 8px",
          background: isDiegetic ? "#1a1208" : "var(--bg-warm)",
          border: `1px solid ${isDiegetic ? "#3a2410" : "var(--rule)"}`,
          fontFamily: "IBM Plex Mono", fontSize: 9, letterSpacing: "0.12em", color: muted,
          textTransform: "uppercase", textAlign: "center",
        }}>
          CONFIDENCE
          <div style={{ height: 4, background: isDiegetic ? "#3a2410" : "var(--bg-deep)", marginTop: 4 }}>
            <div style={{ width: "78%", height: "100%", background: "#7ad07a" }}/>
          </div>
          <div style={{ marginTop: 2, color: "#7ad07a", fontWeight: 600 }}>78%</div>
        </div>
      </div>

      {/* Salvo assignment */}
      <div className="mono" style={{ fontSize: 8.5, letterSpacing: "0.18em", color: muted, marginBottom: 4, textTransform: "uppercase" }}>
        Salvo · {targetSlot}
      </div>
      <div style={{
        background: isDiegetic ? "#1a1208" : "var(--bg-warm)",
        border: `1px solid ${isDiegetic ? "#3a2410" : "var(--rule)"}`,
        padding: "8px 10px",
        fontFamily: "IBM Plex Mono", fontSize: 10, color: ink,
      }}>
        {targetSlot} → Tubes <strong style={{ color: brass }}>[1, 3]</strong> · spread <span style={{ color: brass }}>2.5°</span>
      </div>
    </div>
  );
}

/* ----------------- Wire-guidance consoles (A + B) ----------------- */
function WireGuidanceConsoles({ isDiegetic }) {
  const muted = isDiegetic ? "#c4a86a" : "var(--ink-muted)";
  const green = "#5fbf8f";
  return (
    <div style={{
      background: isDiegetic ? "#0e0a04" : "var(--bg)",
      border: `1px solid ${isDiegetic ? "#5a3a18" : "var(--rule-strong)"}`,
      padding: 12,
    }}>
      <div className="mono" style={{ fontSize: 9, letterSpacing: "0.18em", color: muted, marginBottom: 8, textTransform: "uppercase" }}>
        Wire-guide consoles · 2 in flight max
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {[
          { lbl: "A", active: true,  type: "Lerche II",  brg: "274°", rng: "0.6 nm", spool: 64 },
          { lbl: "B", active: false, type: "—",          brg: "—",     rng: "—",      spool: 0 },
        ].map((c) => (
          <div key={c.lbl} style={{
            background: isDiegetic ? "#020805" : "var(--bg-warm)",
            border: `1px solid ${c.active ? green : (isDiegetic ? "#3a2410" : "var(--rule)")}`,
            padding: 8,
            boxShadow: c.active && isDiegetic ? "inset 0 0 14px rgba(95, 191, 143, 0.12)" : "none",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span className="mono" style={{ fontSize: 9, fontWeight: 600, color: c.active ? green : muted, letterSpacing: "0.14em" }}>
                {c.active ? "● " : "○ "}CRT {c.lbl}
              </span>
              <span className="mono" style={{ fontSize: 8, color: muted, letterSpacing: "0.1em" }}>
                {c.type}
              </span>
            </div>
            {/* Mini CRT */}
            <div style={{
              background: "#020a05",
              border: "1px solid #1a4030",
              padding: 6, marginBottom: 4,
              minHeight: 50, position: "relative",
            }}>
              {c.active ? (
                <svg viewBox="0 0 100 50" style={{ width: "100%", display: "block" }}>
                  {/* CRT grid */}
                  <line x1="50" y1="0" x2="50" y2="50" stroke={green} strokeWidth="0.4" opacity="0.4"/>
                  <line x1="0" y1="25" x2="100" y2="25" stroke={green} strokeWidth="0.4" opacity="0.4"/>
                  {/* Target indicator */}
                  <line x1="42" y1="0" x2="42" y2="50" stroke={green} strokeWidth="0.8"/>
                  <circle cx="42" cy="22" r="3" fill={green}/>
                  <text x="6" y="46" fontFamily="IBM Plex Mono" fontSize="6" fill={green} letterSpacing="0.1em">BRG 274</text>
                </svg>
              ) : (
                <div style={{ fontFamily: "IBM Plex Mono", fontSize: 9, color: "#3a5040", textAlign: "center", paddingTop: 14, letterSpacing: "0.18em" }}>
                  IDLE
                </div>
              )}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, fontFamily: "IBM Plex Mono", fontSize: 8.5, letterSpacing: "0.08em" }}>
              <span style={{ color: muted }}>BRG <span style={{ color: c.active ? green : muted }}>{c.brg}</span></span>
              <span style={{ color: muted }}>RNG <span style={{ color: c.active ? green : muted }}>{c.rng}</span></span>
            </div>
            <div style={{ marginTop: 6 }}>
              <div style={{ height: 3, background: isDiegetic ? "#1a2a20" : "var(--bg-deep)" }}>
                <div style={{ width: `${c.spool}%`, height: "100%", background: c.spool > 0 ? green : "transparent" }}/>
              </div>
              <div style={{ fontFamily: "IBM Plex Mono", fontSize: 7.5, color: muted, marginTop: 2, letterSpacing: "0.14em" }}>
                SPOOL {c.spool}%
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 8, fontFamily: "Cormorant Garamond", fontStyle: "italic", fontSize: 11, color: muted, lineHeight: 1.4 }}>
        Joystick precision = assigned crewman specialty stat. Krüger (●●●●) on A = crisp response, 0 ms latency.
      </div>
    </div>
  );
}

/* ----------------- Plotting table (centre, with difficulty switch) ----------------- */
function PlottingTable({ plotAid, setPlotAid, isDiegetic }) {
  // Render different states based on plotAid (3-tier visibility):
  // auto = full plot + candidate tracks
  // standard = bearing lines only
  // manual = just own-ship + bearing tick marks
  const paper = "#e8dcc0";
  const ink = "#2a1f10";
  const accent = "#c4711f";
  const blue = "#3a5f80";

  return (
    <div style={{
      background: paper,
      border: `1px solid ${isDiegetic ? "#7a5028" : "var(--rule-strong)"}`,
      padding: 14,
      color: ink,
      boxShadow: isDiegetic ? "0 6px 18px rgba(0,0,0,0.4)" : "var(--paper-shadow)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
        <div>
          <div className="mono" style={{ fontSize: 9.5, letterSpacing: "0.2em", color: ink, opacity: 0.7, textTransform: "uppercase" }}>
            PLOTTING TABLE
          </div>
          <div className="serif" style={{ fontSize: 18, fontStyle: "italic", color: ink, lineHeight: 1, marginTop: 2 }}>
            Fire control plot
          </div>
        </div>
      </div>

      {/* Plotting Aid 3-position switch */}
      <div style={{
        background: "#3a2a10", padding: "6px 8px", marginBottom: 10,
        border: "1px solid #7a5028",
      }}>
        <div className="mono" style={{ fontSize: 8.5, letterSpacing: "0.2em", color: "#d4a76a", marginBottom: 4, textTransform: "uppercase" }}>
          PLOTTING AID
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 4 }}>
          {[
            { id: "auto",     lbl: "Auto",     col: "#7ad07a" },
            { id: "standard", lbl: "Standard", col: "#ffc950" },
            { id: "manual",   lbl: "Manual",   col: "#ff5a3a" },
          ].map((p) => (
            <button key={p.id} onClick={() => setPlotAid(p.id)}
                    style={{
                      padding: "5px 0",
                      background: plotAid === p.id ? p.col : "transparent",
                      color: plotAid === p.id ? "#3a2a10" : p.col,
                      border: `1px solid ${p.col}`,
                      fontFamily: "IBM Plex Mono", fontSize: 9, letterSpacing: "0.14em",
                      cursor: "pointer", textTransform: "uppercase", fontWeight: 600,
                    }}>
              {p.lbl}
            </button>
          ))}
        </div>
      </div>

      {/* Plot SVG — content varies by plotAid level */}
      <svg viewBox="0 0 400 240" style={{ width: "100%", display: "block" }}>
        <defs>
          <pattern id="trpgrid" patternUnits="userSpaceOnUse" width="20" height="20">
            <line x1="0" y1="0" x2="20" y2="0" stroke={ink} strokeWidth="0.4" opacity="0.18"/>
            <line x1="0" y1="0" x2="0" y2="20" stroke={ink} strokeWidth="0.4" opacity="0.18"/>
          </pattern>
        </defs>
        <rect width="400" height="240" fill="url(#trpgrid)"/>

        {/* Own-ship */}
        <circle cx="100" cy="180" r="6" fill={accent} stroke="white" strokeWidth="1.5"/>
        <line x1="100" y1="180" x2="108" y2="172" stroke={accent} strokeWidth="2"/>
        <text x="112" y="183" fontFamily="IBM Plex Mono" fontSize="8" fill={accent} fontWeight="600">U-241</text>

        {/* Bearing tick marks (always visible) */}
        {[
          { brg: 274, t: "14:12" },
          { brg: 270, t: "14:18" },
          { brg: 268, t: "14:25" },
        ].map((b, i) => {
          const rad = (b.brg - 90) * Math.PI / 180;
          const tx = 100 + Math.cos(rad) * 14;
          const ty = 180 + Math.sin(rad) * 14;
          return (
            <g key={i}>
              <line x1={100} y1={180} x2={tx} y2={ty}
                    stroke={accent} strokeWidth="1.6"/>
              {plotAid !== "manual" && (
                <line x1={100} y1={180}
                      x2={100 + Math.cos(rad) * 200}
                      y2={180 + Math.sin(rad) * 200}
                      stroke={accent} strokeWidth="0.5" strokeDasharray="4 3" opacity="0.55"/>
              )}
            </g>
          );
        })}

        {/* AUTO + STANDARD show candidate tracks */}
        {plotAid !== "manual" && (
          <g>
            {/* Primary target track */}
            <line x1="180" y1="60" x2="260" y2="120" stroke={blue} strokeWidth="2.4"/>
            <polygon points="-6,-3 0,0 -6,3"
                     fill={blue}
                     transform="translate(260, 120) rotate(36)"/>
            <circle cx="180" cy="60" r="5" fill="none" stroke={blue} strokeWidth="1.2"/>
            <text x="186" y="56" fontFamily="IBM Plex Mono" fontSize="8" fill={blue} fontWeight="600">K-7 · 8.5 kn · 270°</text>
          </g>
        )}

        {/* AUTO shows alt candidates and TMA candidate ribbons */}
        {plotAid === "auto" && (
          <g>
            <line x1="178" y1="78" x2="254" y2="138" stroke={ink} strokeWidth="1.2" opacity="0.45"/>
            <line x1="182" y1="42" x2="270" y2="110" stroke={ink} strokeWidth="1.2" opacity="0.45"/>
            <text x="200" y="155" fontFamily="IBM Plex Mono" fontSize="7" fill={ink} opacity="0.6">ALT · 55%</text>
            <text x="220" y="45" fontFamily="IBM Plex Mono" fontSize="7" fill={ink} opacity="0.6">ALT · 41%</text>
          </g>
        )}

        {/* MANUAL — show grid prominently, no candidates, encourage paper-plot */}
        {plotAid === "manual" && (
          <g>
            <text x="200" y="30" textAnchor="middle" fontFamily="Cormorant Garamond, serif"
                  fontSize="11" fontStyle="italic" fill={ink} opacity="0.65">
              Paper-plot using printable kit · bearings only
            </text>
          </g>
        )}

        {/* Compass corner */}
        <g transform="translate(370, 220)">
          <circle r="12" fill="none" stroke={ink} strokeWidth="0.7" opacity="0.6"/>
          <line x1="0" y1="-12" x2="0" y2="12" stroke={ink} strokeWidth="0.5" opacity="0.6"/>
          <line x1="-12" y1="0" x2="12" y2="0" stroke={ink} strokeWidth="0.5" opacity="0.6"/>
          <polygon points="0,-12 -2,-6 2,-6" fill={ink}/>
        </g>
      </svg>

      <div style={{
        marginTop: 10, fontFamily: "Cormorant Garamond, serif", fontStyle: "italic",
        fontSize: 12, color: ink, opacity: 0.75, lineHeight: 1.4,
        background: "rgba(58, 42, 16, 0.06)", padding: "6px 10px", borderLeft: `2px solid ${accent}`,
      }}>
        {plotAid === "auto"     && "Auto: full digital plot + candidate tracks + AI solution overlay."}
        {plotAid === "standard" && "Standard: bearings drawn + primary candidate visible. Hardcore players see less."}
        {plotAid === "manual"   && "Manual: only own-ship + bearing ticks. Use the printable plotting kit on your desk."}
      </div>
    </div>
  );
}

/* ----------------- Lauschangriff strip (cross-station verbal moment) ----------------- */
function LauschangriffStrip({ isDiegetic }) {
  const muted = isDiegetic ? "#c4a86a" : "var(--ink-muted)";
  const lines = [
    { who: "Sonar (Bauer)", msg: '"Target locked — destroyer, range four thousand, ±20%."', col: "#ff8a4a" },
    { who: "Nav (Stahl)",   msg: '"TMA solution: course 045, speed 8.5, range 3,800."',     col: "#d4a76a" },
    { who: "Torpedo (Krüger)", msg: '"Vorhaltrechner ready. Lauschangriff confirmed."',     col: "#7ad07a" },
    { who: "Captain",        msg: '"Rohr eins, Rohr drei… Lauschangriff… LOSS!"',           col: "#ff5a3a" },
    { who: "Sonar (Bauer)", msg: '"Aal läuft! Aal läuft!" — eels running.',                  col: "#ff8a4a" },
  ];
  return (
    <div style={{
      background: isDiegetic ? "rgba(255, 138, 74, 0.05)" : "var(--bg-warm)",
      border: `1px solid ${isDiegetic ? "#7a5028" : "var(--rule-strong)"}`,
      padding: "10px 14px",
    }}>
      <div className="mono" style={{ fontSize: 9, letterSpacing: "0.18em", color: muted, marginBottom: 6, textTransform: "uppercase" }}>
        Lauschangriff · cross-station verbal cascade
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {lines.map((l, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 8, alignItems: "baseline" }}>
            <span style={{
              fontFamily: "IBM Plex Mono", fontSize: 9.5, letterSpacing: "0.08em",
              color: l.col, fontWeight: 600,
            }}>
              {l.who}
            </span>
            <span style={{
              fontFamily: "Cormorant Garamond, serif", fontStyle: "italic", fontSize: 13.5,
              color: isDiegetic ? "#f0e4c0" : "var(--ink)", lineHeight: 1.4,
            }}>
              {l.msg}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ----------------- Tube status panel ----------------- */
function TubeStatusPanel({ isDiegetic }) {
  const muted = isDiegetic ? "#c4a86a" : "var(--ink-muted)";
  const ink = isDiegetic ? "#f0e4c0" : "var(--ink)";
  const tubes = [
    { n: 1, type: "Zaunkönig III", state: "ARMED",    eta: "—",       crew: 1, colour: "#ff8a4a" },
    { n: 2, type: "Lerche II",     state: "ARMED",    eta: "—",       crew: 1, colour: "#ff8a4a" },
    { n: 3, type: "Schlange",      state: "RELOADING", eta: "T-04:12", crew: 2, colour: "#ffc950" },
    { n: 4, type: "Zaunkönig III", state: "READY",    eta: "—",       crew: 0, colour: "#7ad07a" },
    { n: 5, type: "Lerche II",     state: "READY",    eta: "—",       crew: 0, colour: "#7ad07a" },
    { n: 6, type: "TMC mine",      state: "READY",    eta: "—",       crew: 0, colour: "#7fb4dc" },
    { n: 7, type: "Steinbutt",     state: "READY",    eta: "—",       crew: 0, colour: "#7ad07a" },
    { n: 8, type: "—",             state: "EMPTY",    eta: "—",       crew: 0, colour: "#5a3a18" },
  ];
  return (
    <div style={{
      background: isDiegetic ? "#0e0a04" : "var(--bg)",
      border: `1px solid ${isDiegetic ? "#5a3a18" : "var(--rule-strong)"}`,
      padding: 12,
    }}>
      <div className="mono" style={{
        fontSize: 9, letterSpacing: "0.18em", color: muted, marginBottom: 8,
        textTransform: "uppercase", display: "flex", justifyContent: "space-between",
      }}>
        <span>Tube status · 8 tubes</span>
        <span style={{ color: "#ff5a3a" }}>FIRE [SAFETY]</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {tubes.map((t) => (
          <div key={t.n} style={{
            display: "grid", gridTemplateColumns: "auto 1fr auto auto", gap: 8, alignItems: "center",
            padding: "4px 8px",
            background: t.state === "ARMED" ? "rgba(255, 138, 74, 0.08)" : "transparent",
            borderLeft: `3px solid ${t.colour}`,
            fontFamily: "IBM Plex Mono", fontSize: 9.5, letterSpacing: "0.06em",
          }}>
            <span style={{ color: t.colour, fontWeight: 700, width: 14 }}>{t.n}</span>
            <span style={{ color: ink }}>{t.type}</span>
            <span style={{ color: t.colour, letterSpacing: "0.14em" }}>{t.state}</span>
            <span style={{ color: muted, fontSize: 8.5 }}>{t.eta}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ----------------- Bold-VII launcher panel ----------------- */
function BoldLauncher({ signature, setSignature, isDiegetic }) {
  const muted = isDiegetic ? "#c4a86a" : "var(--ink-muted)";
  const ink = isDiegetic ? "#f0e4c0" : "var(--ink)";
  const sigs = [
    { id: "surfaced",    lbl: "Surfaced" },
    { id: "snorkelling", lbl: "Snorkel" },
    { id: "submerged",   lbl: "Submerged" },
  ];
  const tubes = [
    { n: 1, state: "ready",     colour: "#7ad07a" },
    { n: 2, state: "reloading", colour: "#ff5a3a", eta: "00:42" },
    { n: 3, state: "ready",     colour: "#7ad07a" },
    { n: 4, state: "empty",     colour: "#5a3a18" },
  ];
  return (
    <div style={{
      background: isDiegetic ? "#0e0a04" : "var(--bg)",
      border: `1px solid ${isDiegetic ? "#5a3a18" : "var(--rule-strong)"}`,
      padding: 12,
    }}>
      <div className="mono" style={{
        fontSize: 9, letterSpacing: "0.18em", color: muted, marginBottom: 8,
        textTransform: "uppercase", display: "flex", justifyContent: "space-between",
      }}>
        <span>Bold-VII launcher</span>
        <span style={{ color: ink, fontWeight: 600 }}>22 / 24</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 4, marginBottom: 10 }}>
        {tubes.map((t) => (
          <div key={t.n} style={{
            background: isDiegetic ? "#1a1208" : "var(--bg-warm)",
            border: `1px solid ${t.colour}`,
            padding: "6px 4px", textAlign: "center",
          }}>
            <div className="mono" style={{ fontSize: 8, color: muted, letterSpacing: "0.14em" }}>R{t.n}</div>
            <div style={{ fontFamily: "Cormorant Garamond", fontSize: 14, color: t.colour, lineHeight: 1.2, fontWeight: 600 }}>
              {t.state === "ready" ? "●" : t.state === "reloading" ? "↻" : t.state === "empty" ? "○" : "—"}
            </div>
            <div className="mono" style={{ fontSize: 8, color: t.colour, letterSpacing: "0.12em", textTransform: "uppercase" }}>
              {t.eta || t.state}
            </div>
          </div>
        ))}
      </div>
      <div className="mono" style={{ fontSize: 8.5, letterSpacing: "0.14em", color: muted, textTransform: "uppercase", marginBottom: 4 }}>
        Signature
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 3 }}>
        {sigs.map((s) => (
          <button key={s.id} onClick={() => setSignature(s.id)}
                  style={{
                    padding: "5px 0",
                    background: signature === s.id ? "#d4a76a" : "transparent",
                    color: signature === s.id ? "#0e0a04" : muted,
                    border: `1px solid ${isDiegetic ? "#5a3a18" : "var(--rule-strong)"}`,
                    fontFamily: "IBM Plex Mono", fontSize: 8.5, letterSpacing: "0.12em",
                    cursor: "pointer", textTransform: "uppercase",
                  }}>
            {s.lbl}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ----------------- Sieglinde towed-decoy panel ----------------- */
function SieglindePanel({ state, setState, isDiegetic }) {
  const muted = isDiegetic ? "#c4a86a" : "var(--ink-muted)";
  const ink = isDiegetic ? "#f0e4c0" : "var(--ink)";
  const states = ["stowed", "deploying", "deployed", "recovering", "lost"];
  const colour = {
    stowed: "#5a3a18", deploying: "#ffc950", deployed: "#ff8a4a",
    recovering: "#ffc950", lost: "#ff5a3a",
  };
  const cableLen = { stowed: 0, deploying: 45, deployed: 100, recovering: 60, lost: 0 }[state];
  return (
    <div style={{
      background: isDiegetic ? "#0e0a04" : "var(--bg)",
      border: `1px solid ${isDiegetic ? "#5a3a18" : "var(--rule-strong)"}`,
      padding: 12,
    }}>
      <div className="mono" style={{
        fontSize: 9, letterSpacing: "0.18em", color: muted, marginBottom: 8,
        textTransform: "uppercase", display: "flex", justifyContent: "space-between",
      }}>
        <span>Sieglinde · towed decoy</span>
        <span style={{ color: state === "deployed" ? "#ff5a3a" : muted }}>
          {state === "deployed" ? "● 6 KN CAP" : "—"}
        </span>
      </div>
      <div style={{
        padding: "5px 10px", background: colour[state], color: "#0e0a04",
        fontFamily: "IBM Plex Mono", fontSize: 11, letterSpacing: "0.16em",
        textTransform: "uppercase", fontWeight: 600, marginBottom: 8, textAlign: "center",
      }}>
        {state}
      </div>
      <div style={{ marginBottom: 8 }}>
        <div className="mono" style={{ fontSize: 8, color: muted, letterSpacing: "0.14em", marginBottom: 3, textTransform: "uppercase" }}>
          Cable length
        </div>
        <div style={{ height: 4, background: isDiegetic ? "#3a2410" : "var(--bg-deep)" }}>
          <div style={{ width: `${cableLen}%`, height: "100%", background: colour[state] }}/>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 3 }}>
        {[
          { id: "stowed",    lbl: "Recover" },
          { id: "deployed",  lbl: "Deploy" },
          { id: "lost",      lbl: "Cut",   danger: true },
        ].map((b) => (
          <button key={b.id} onClick={() => setState(b.id)}
                  style={{
                    padding: "5px 0",
                    background: state === b.id ? colour[b.id] : "transparent",
                    color: state === b.id ? "#0e0a04" : (b.danger ? "#ff5a3a" : muted),
                    border: `1px solid ${b.danger ? "#ff5a3a" : (isDiegetic ? "#5a3a18" : "var(--rule-strong)")}`,
                    fontFamily: "IBM Plex Mono", fontSize: 8.5, letterSpacing: "0.12em",
                    cursor: "pointer", textTransform: "uppercase",
                  }}>
            {b.lbl}
          </button>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { TorpedoStation });
