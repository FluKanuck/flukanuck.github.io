/* ============================================================
   Navigator mid-fi station mockup (per design doc §3.3)

   Single standing stance. Chart table primary; Schlüsselgerät /
   VLF / Schnellschreiber / UHF cabinets arrayed on right wall.
   Back wall: gyrocompass + speed log + inertial nav readout.
   Left wall: Sonne almanac + key sheet + celestial conditions.
   Drafting-corner aesthetic: warm tungsten primary, brass
   yellow back-wall, cipher cabinet green test-phrase, UHF red/green
   transmit/receive, VLF amber encrypted-slip glow.
   ============================================================ */

function NavigatorStation({ style = "diegetic" }) {
  const [cabinet, setCabinet] = useState("cipher"); // cipher | vlf | xmit | uhf
  const [rotors, setRotors] = useState(["K", "M", "F", "P"]);
  const [decodeStage, setDecodeStage] = useState("set"); // set | testing | running | done
  const isDiegetic = style === "diegetic";

  return (
    <div style={{
      background: isDiegetic ? "#1b1208" : "var(--bg-warm)",
      border: "1px solid var(--rule-strong)",
      padding: 0,
      boxShadow: "var(--paper-shadow)",
      overflow: "hidden",
      color: isDiegetic ? "#f0e4cf" : "var(--ink)",
    }}>
      {/* Top status bar — drafting-corner tungsten warm */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        alignItems: "center",
        padding: "10px 18px",
        background: isDiegetic ? "#2a1d10" : "var(--bg-deep)",
        borderBottom: "1px solid rgba(196, 113, 31, 0.3)",
        fontFamily: "IBM Plex Mono, monospace",
        fontSize: 11,
        letterSpacing: "0.14em",
        color: isDiegetic ? "#c4a86a" : "var(--ink-muted)",
        textTransform: "uppercase",
      }}>
        <div style={{ display: "flex", gap: 16 }}>
          <span>FUNKRAUM · U-241</span>
          <span style={{ color: isDiegetic ? "#ffb143" : "var(--ink)" }}>● Standing stance</span>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {[
            { id: "cipher", lbl: "Schlüsselgerät 51" },
            { id: "vlf",    lbl: "VLF Inbox" },
            { id: "xmit",   lbl: "Schnellschreiber" },
            { id: "uhf",    lbl: "Wolf-pack UHF" },
          ].map((f) => (
            <button key={f.id} onClick={() => setCabinet(f.id)}
                    style={{
                      padding: "4px 10px",
                      background: cabinet === f.id ? (isDiegetic ? "#ffb143" : "var(--ink)") : "transparent",
                      color: cabinet === f.id ? "#1b1208" : "inherit",
                      border: `1px solid ${isDiegetic ? "rgba(196, 168, 106, 0.4)" : "var(--rule-strong)"}`,
                      fontFamily: "IBM Plex Mono", fontSize: 10, letterSpacing: "0.14em",
                      cursor: "pointer", textTransform: "uppercase",
                    }}>
              {f.lbl}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 16, justifyContent: "flex-end" }}>
          <span>Watch: Stahl · Nav 8 · ●●●○</span>
          <span>Depth 18 m · ≤25 VLF OK</span>
        </div>
      </div>

      {/* Main two-column layout */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1.5fr 1fr",
        gap: 0,
        minHeight: 600,
        background: isDiegetic ? "radial-gradient(ellipse at top, #261a0e 0%, #150c06 90%)" : "var(--bg-warm)",
      }}>
        {/* LEFT — chart table + nav aids */}
        <div style={{
          padding: 18,
          borderRight: "1px solid rgba(196, 113, 31, 0.18)",
          display: "flex", flexDirection: "column", gap: 14,
        }}>
          <ChartTable isDiegetic={isDiegetic}/>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <SonneTuner isDiegetic={isDiegetic}/>
            <CelestialConditions isDiegetic={isDiegetic}/>
          </div>
        </div>

        {/* RIGHT — cabinet stack (one focused, rest minimised) */}
        <div style={{
          padding: 18,
          display: "flex", flexDirection: "column", gap: 12,
        }}>
          {cabinet === "cipher" && <SchluesselgeraetCabinet rotors={rotors} setRotors={setRotors} stage={decodeStage} setStage={setDecodeStage} isDiegetic={isDiegetic}/>}
          {cabinet === "vlf"    && <VLFInboxCabinet isDiegetic={isDiegetic}/>}
          {cabinet === "xmit"   && <SchnellschreiberCabinet isDiegetic={isDiegetic}/>}
          {cabinet === "uhf"    && <UHFCabinet isDiegetic={isDiegetic}/>}
        </div>
      </div>

      {/* Bottom — back-wall instruments + audit ticker */}
      <BackWallInstruments isDiegetic={isDiegetic}/>
      <div style={{
        borderTop: "1px solid rgba(196, 113, 31, 0.18)",
        padding: "8px 18px",
        background: isDiegetic ? "#0e0804" : "var(--bg)",
        fontFamily: "IBM Plex Mono, monospace", fontSize: 10,
        letterSpacing: "0.14em", textTransform: "uppercase",
        color: isDiegetic ? "#c4a86a" : "var(--ink-muted)",
        display: "flex", gap: 24, overflow: "hidden",
      }}>
        <span style={{ color: isDiegetic ? "#ffb143" : "var(--ink)" }}>NAV LOG</span>
        <span>· 14:31  TMA solve K-7 · 274° · 8.5 kn ± 1</span>
        <span>· 14:18  Sonne fix accepted · cone collapsed</span>
        <span>· 14:02  KEY-SHEET decoded · BdU traffic</span>
        <span>· 13:44  Wolf-pack RELAY from U-509 · brg 092</span>
      </div>
    </div>
  );
}

/* ----------------- Chart table — DR cone, bearings, TMA candidates ----------------- */
function ChartTable({ isDiegetic }) {
  const paper = "#e8dcc0";
  const ink = "#2a1f10";
  const accent = "#c4711f";
  const blue = "#3a5f80";

  return (
    <div style={{
      background: paper,
      border: `1px solid ${isDiegetic ? "#7a5028" : "var(--rule-strong)"}`,
      padding: 16,
      boxShadow: isDiegetic ? "0 6px 24px rgba(0,0,0,0.45)" : "var(--paper-shadow)",
      color: ink,
      position: "relative",
    }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "baseline",
        marginBottom: 10,
      }}>
        <div>
          <div className="mono" style={{ fontSize: 9.5, letterSpacing: "0.2em", color: ink, opacity: 0.65, textTransform: "uppercase" }}>
            CHART · GRID AN-3614 · 1955 ATLANTIC
          </div>
          <div className="serif" style={{ fontSize: 20, fontStyle: "italic", color: ink, lineHeight: 1, marginTop: 2 }}>
            Plot — 14:31 watch
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button style={{
            padding: "4px 10px",
            background: accent, color: "white",
            border: `1px solid ${accent}`,
            fontFamily: "IBM Plex Mono", fontSize: 9.5, letterSpacing: "0.14em",
            textTransform: "uppercase", cursor: "pointer",
          }}>
            DR confirmed
          </button>
          <button style={{
            padding: "4px 10px",
            background: "transparent", color: ink,
            border: `1px solid ${ink}`,
            fontFamily: "IBM Plex Mono", fontSize: 9.5, letterSpacing: "0.14em",
            textTransform: "uppercase", cursor: "pointer",
          }}>
            Solve TMA
          </button>
        </div>
      </div>

      <svg viewBox="0 0 800 460" style={{ width: "100%", display: "block" }}>
        {/* Latitude/longitude grid */}
        <defs>
          <pattern id="grid" patternUnits="userSpaceOnUse" width="80" height="80">
            <line x1="0" y1="0" x2="80" y2="0" stroke={ink} strokeWidth="0.4" opacity="0.15"/>
            <line x1="0" y1="0" x2="0" y2="80" stroke={ink} strokeWidth="0.4" opacity="0.15"/>
          </pattern>
          <pattern id="hatch" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke={ink} strokeWidth="0.4" opacity="0.4"/>
          </pattern>
        </defs>
        <rect width="800" height="460" fill="url(#grid)"/>

        {/* Edge marks */}
        {[0, 80, 160, 240, 320, 400, 480, 560, 640, 720].map((x) => (
          <text key={`x${x}`} x={x} y={14} fontFamily="IBM Plex Mono" fontSize="8" fill={ink} opacity="0.55" letterSpacing="0.06em">{("0" + (53 + Math.floor(x/80)))}°N</text>
        ))}
        {[40, 120, 200, 280, 360, 440].map((y) => (
          <text key={`y${y}`} x={4} y={y} fontFamily="IBM Plex Mono" fontSize="8" fill={ink} opacity="0.55" letterSpacing="0.06em">{(15 + Math.floor(y/80))}°W</text>
        ))}

        {/* Coastline hint top-left */}
        <path d="M 0 80 Q 60 70 80 90 L 100 110 Q 90 130 0 140 Z"
              fill="url(#hatch)" stroke={ink} strokeWidth="0.8" opacity="0.35"/>
        <text x="40" y="115" fontFamily="Cormorant Garamond" fontStyle="italic" fontSize="11" fill={ink} opacity="0.5">Iceland</text>

        {/* DR trail — dots from past to present */}
        {[
          [120, 380], [180, 350], [240, 320], [300, 290], [360, 270], [420, 250],
          [480, 240], [540, 232], [600, 228]
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i === 8 ? 5 : 2.5}
                  fill={i === 8 ? accent : ink} opacity={0.4 + i * 0.07}/>
        ))}
        {/* Trail line */}
        <polyline points="120,380 180,350 240,320 300,290 360,270 420,250 480,240 540,232 600,228"
                  fill="none" stroke={ink} strokeWidth="1" strokeDasharray="3 2" opacity="0.6"/>

        {/* DR uncertainty cone (growing forward) */}
        <ellipse cx="650" cy="220" rx="50" ry="22" fill={accent} opacity="0.10" stroke={accent} strokeWidth="1" strokeDasharray="4 2"/>
        <text x="650" y="225" textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="8.5" fill={accent} letterSpacing="0.12em">DR ±2.5 nm</text>

        {/* Boat position marker */}
        <circle cx="600" cy="228" r="7" fill={accent} stroke="white" strokeWidth="1.5"/>
        <line x1="600" y1="228" x2="610" y2="218" stroke={accent} strokeWidth="2"/>
        <text x="608" y="245" fontFamily="IBM Plex Mono" fontSize="9" fill={accent} letterSpacing="0.06em" fontWeight="600">U-241</text>

        {/* Timestamped Sonar bearing lines */}
        {[
          { bearing: 274, t: "14:12", colour: accent },
          { bearing: 270, t: "14:18", colour: accent },
          { bearing: 268, t: "14:25", colour: accent },
        ].map((b, i) => {
          const rad = (b.bearing - 90) * Math.PI / 180;
          const x2 = 600 + Math.cos(rad) * 400;
          const y2 = 228 + Math.sin(rad) * 400;
          return (
            <g key={i}>
              <line x1="600" y1="228" x2={x2} y2={y2}
                    stroke={accent} strokeWidth="0.7" opacity={0.35 + i * 0.15}
                    strokeDasharray="6 3"/>
              <text x={600 + Math.cos(rad) * 200} y={228 + Math.sin(rad) * 200 - 4}
                    fontFamily="IBM Plex Mono" fontSize="7" fill={accent} opacity="0.7" letterSpacing="0.1em">
                {b.t} · BRG {b.bearing}
              </text>
            </g>
          );
        })}

        {/* TMA candidate target tracks */}
        {[
          { x: 220, y: 100, dir: 130, conf: 78, lbl: "K-7 · 8.5 kn · 270°", primary: true },
          { x: 210, y: 130, dir: 140, conf: 55, lbl: "alt · 6.0 kn · 280°", primary: false },
          { x: 230, y: 80,  dir: 120, conf: 41, lbl: "alt · 11 kn · 260°", primary: false },
        ].map((t, i) => {
          const rad = t.dir * Math.PI / 180;
          const x2 = t.x + Math.cos(rad) * 80;
          const y2 = t.y - Math.sin(rad) * 80;
          return (
            <g key={i}>
              <line x1={t.x} y1={t.y} x2={x2} y2={y2}
                    stroke={t.primary ? blue : ink}
                    strokeWidth={t.primary ? 2.4 : 1.2}
                    opacity={t.primary ? 1 : 0.45}/>
              <polygon points="-7,-3 0,0 -7,3"
                       fill={t.primary ? blue : ink}
                       opacity={t.primary ? 1 : 0.45}
                       transform={`translate(${x2}, ${y2}) rotate(${-t.dir})`}/>
              <circle cx={t.x} cy={t.y} r={t.primary ? 5 : 3}
                      fill="none" stroke={t.primary ? blue : ink} strokeWidth="1.2"
                      opacity={t.primary ? 1 : 0.45}/>
              <text x={t.x - 10} y={t.y - 8}
                    fontFamily="IBM Plex Mono" fontSize="8"
                    fill={t.primary ? blue : ink}
                    opacity={t.primary ? 1 : 0.6} textAnchor="end" letterSpacing="0.1em" fontWeight={t.primary ? 600 : 400}>
                {t.lbl} [{t.conf}%]
              </text>
            </g>
          );
        })}

        {/* Doppler-shift indicator on K-7 latest bearing */}
        <text x="540" y="170" fontFamily="IBM Plex Mono" fontSize="9" fill={accent} letterSpacing="0.06em" fontWeight="600">
          ▾ DOPPLER · COURSE SHIFT
        </text>

        {/* Compass rose corner */}
        <g transform="translate(740, 410)">
          <circle r="22" fill="none" stroke={ink} strokeWidth="0.8" opacity="0.5"/>
          <line x1="0" y1="-22" x2="0" y2="22" stroke={ink} strokeWidth="0.6" opacity="0.5"/>
          <line x1="-22" y1="0" x2="22" y2="0" stroke={ink} strokeWidth="0.6" opacity="0.5"/>
          <polygon points="0,-22 -3,-12 3,-12" fill={ink}/>
          <text y="-26" textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="8" fill={ink} letterSpacing="0.16em">N</text>
        </g>
      </svg>

      {/* Solution candidate readout */}
      <div style={{
        marginTop: 10,
        display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
        gap: 8,
        fontFamily: "IBM Plex Mono",
        fontSize: 10.5,
      }}>
        <div style={{ padding: "6px 10px", background: "rgba(58, 95, 128, 0.12)", border: `1px solid ${blue}`, color: blue }}>
          <div style={{ fontSize: 8.5, letterSpacing: "0.18em", opacity: 0.7 }}>★ PRIMARY · 78%</div>
          <div style={{ marginTop: 2, fontWeight: 600 }}>K-7 · 8.5 kn · crs 270°</div>
        </div>
        <div style={{ padding: "6px 10px", background: "rgba(42, 31, 16, 0.06)", border: `1px solid ${ink}`, opacity: 0.55 }}>
          <div style={{ fontSize: 8.5, letterSpacing: "0.18em", opacity: 0.7 }}>· ALT · 55%</div>
          <div style={{ marginTop: 2 }}>6.0 kn · crs 280°</div>
        </div>
        <div style={{ padding: "6px 10px", background: "rgba(42, 31, 16, 0.06)", border: `1px solid ${ink}`, opacity: 0.45 }}>
          <div style={{ fontSize: 8.5, letterSpacing: "0.18em", opacity: 0.7 }}>· ALT · 41%</div>
          <div style={{ marginTop: 2 }}>11 kn · crs 260°</div>
        </div>
      </div>
    </div>
  );
}

/* ----------------- Schlüsselgerät 51 cipher cabinet ----------------- */
function SchluesselgeraetCabinet({ rotors, setRotors, stage, setStage, isDiegetic }) {
  const ink = isDiegetic ? "#ffb143" : "var(--ink)";
  const muted = isDiegetic ? "#c4a86a" : "var(--ink-muted)";
  const cipherGreen = "#7ad07a";

  // Test phrase rendering: "TAG IST GUT" if rotors match key, garbage otherwise
  const KEY = ["K", "M", "F", "P"];
  const correct = rotors.every((r, i) => r === KEY[i]);
  const testPhrase = correct ? "TAG IST GUT" : "XQJ ZRT PLM";

  const cycleRotor = (i) => {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const next = [...rotors];
    const idx = alphabet.indexOf(rotors[i]);
    next[i] = alphabet[(idx + 1) % 26];
    setRotors(next);
  };

  return (
    <div style={{
      background: isDiegetic ? "#1a1308" : "var(--bg)",
      border: `1px solid ${isDiegetic ? "#7a5028" : "var(--rule-strong)"}`,
      padding: 16,
      display: "flex", flexDirection: "column", gap: 14,
      minHeight: 580,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div>
          <div className="mono" style={{ fontSize: 9.5, letterSpacing: "0.18em", color: muted, textTransform: "uppercase" }}>
            CABINET · SCHLÜSSELGERÄT 51
          </div>
          <div className="serif" style={{ fontSize: 22, fontStyle: "italic", color: ink, lineHeight: 1, marginTop: 2 }}>
            Cipher
          </div>
        </div>
        <span className="chip" style={{
          color: correct ? cipherGreen : "#ff8a4a",
          borderColor: correct ? cipherGreen : "#ff8a4a",
          padding: "2px 8px",
        }}>
          {correct ? "● VERIFIED" : "○ ROTORS MISALIGNED"}
        </span>
      </div>

      {/* Key sheet display */}
      <div style={{
        background: "#e8dcc0", color: "#2a1f10",
        padding: "10px 12px",
        border: "1px solid rgba(42, 31, 16, 0.4)",
        transform: "rotate(-0.8deg)",
        boxShadow: "0 3px 8px rgba(0,0,0,0.4)",
      }}>
        <div className="mono" style={{ fontSize: 8.5, letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.7 }}>
          KEY SHEET · WEEK 23 · 1955-09-04 — 09-10
        </div>
        <div className="mono" style={{ fontSize: 14, fontWeight: 600, letterSpacing: "0.32em", marginTop: 6 }}>
          R1: K · R2: M · R3: F · R4: P
        </div>
      </div>

      {/* Rotor dials */}
      <div>
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.18em", color: muted, marginBottom: 8, textTransform: "uppercase" }}>
          Rotors · click to advance
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
          {rotors.map((r, i) => {
            const ok = r === KEY[i];
            return (
              <button key={i} onClick={() => cycleRotor(i)}
                      style={{
                        background: isDiegetic ? "#0e0804" : "var(--bg-warm)",
                        border: `2px solid ${ok ? cipherGreen : "#7a5028"}`,
                        padding: "16px 0",
                        cursor: "pointer",
                        color: ok ? cipherGreen : ink,
                        fontFamily: "Cormorant Garamond, serif",
                        fontSize: 36, fontWeight: 600,
                        textAlign: "center",
                        position: "relative",
                        boxShadow: ok ? `0 0 12px rgba(122, 208, 122, 0.4)` : "none",
                      }}>
                {r}
                <div style={{
                  position: "absolute", bottom: 4, left: 0, right: 0,
                  fontFamily: "IBM Plex Mono", fontSize: 8,
                  color: muted, letterSpacing: "0.14em",
                }}>
                  R{i + 1}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Test-phrase window */}
      <div>
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.18em", color: muted, marginBottom: 6, textTransform: "uppercase" }}>
          Test-phrase window
        </div>
        <div style={{
          background: "#082008",
          border: `1px solid ${cipherGreen}`,
          padding: "12px 16px",
          fontFamily: "IBM Plex Mono, monospace",
          fontSize: 18, fontWeight: 600, letterSpacing: "0.3em",
          color: correct ? cipherGreen : "#5a8050",
          textAlign: "center",
          boxShadow: `inset 0 0 16px rgba(122, 208, 122, 0.15)`,
        }}>
          {testPhrase}
        </div>
        <div className="mono" style={{ fontSize: 9, color: muted, marginTop: 4, letterSpacing: "0.1em" }}>
          {correct ? "Sentinel matches — ready to run." : "Garbage — adjust rotors per key sheet."}
        </div>
      </div>

      {/* Run / auto-decode buttons */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <button disabled={!correct}
                style={{
                  padding: "10px 0",
                  background: correct ? cipherGreen : "transparent",
                  color: correct ? "#0e0804" : muted,
                  border: `1px solid ${correct ? cipherGreen : "#7a5028"}`,
                  fontFamily: "IBM Plex Mono", fontSize: 11, letterSpacing: "0.18em",
                  cursor: correct ? "pointer" : "not-allowed", textTransform: "uppercase", fontWeight: 600,
                }}>
          ▶ RUN
        </button>
        <button style={{
          padding: "10px 0",
          background: "transparent", color: muted,
          border: `1px solid ${isDiegetic ? "#7a5028" : "var(--rule-strong)"}`,
          fontFamily: "IBM Plex Mono", fontSize: 11, letterSpacing: "0.18em",
          cursor: "pointer", textTransform: "uppercase",
        }}>
          ◆ AUTO-DECODE · −morale
        </button>
      </div>

      {/* Output tray */}
      <div style={{
        background: isDiegetic ? "rgba(255, 177, 67, 0.06)" : "var(--bg-warm)",
        border: `1px solid ${isDiegetic ? "#7a5028" : "var(--rule-strong)"}`,
        padding: 10,
        marginTop: "auto",
      }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.18em", color: muted, marginBottom: 6, textTransform: "uppercase" }}>
          Output tray · 1 pending
        </div>
        <div style={{
          background: "#e8dcc0", color: "#2a1f10",
          padding: "8px 10px",
          fontFamily: "Cormorant Garamond, serif",
          transform: "rotate(-0.4deg)",
          boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
        }}>
          <div className="mono" style={{ fontSize: 8, letterSpacing: "0.2em", color: "#c4711f" }}>[DECRYPTED] · 14:31</div>
          <div style={{ fontSize: 14, fontStyle: "italic", marginTop: 2 }}>
            Convoy ONS-42 bearing 270, course 045, speed 8.5 kn.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------- VLF inbox cabinet ----------------- */
function VLFInboxCabinet({ isDiegetic }) {
  const ink = isDiegetic ? "#ffb143" : "var(--ink)";
  const muted = isDiegetic ? "#c4a86a" : "var(--ink-muted)";
  const slips = [
    { id: 4, time: "14:31", t: "Wolf-pack RELAY · U-509", urgency: "MED" },
    { id: 3, time: "13:18", t: "Patrol grid change · AN-3614", urgency: "LOW" },
    { id: 2, time: "12:02", t: "KEY-SHEET · Week 24", urgency: "HIGH" },
    { id: 1, time: "08:14", t: "Weather · Force-7 gale NW", urgency: "INFO" },
  ];
  const colour = { HIGH: "#ff5a3a", MED: "#ffc950", LOW: "#7fb4dc", INFO: "#a06a3a" };

  return (
    <div style={{
      background: isDiegetic ? "#1a1308" : "var(--bg)",
      border: `1px solid ${isDiegetic ? "#7a5028" : "var(--rule-strong)"}`,
      padding: 16, minHeight: 580,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
        <div>
          <div className="mono" style={{ fontSize: 9.5, letterSpacing: "0.18em", color: muted, textTransform: "uppercase" }}>
            CABINET · VLF RECEIVER
          </div>
          <div className="serif" style={{ fontSize: 22, fontStyle: "italic", color: ink, lineHeight: 1, marginTop: 2 }}>
            Inbox
          </div>
        </div>
        <span className="chip" style={{ color: "#7fb4dc", borderColor: "#7fb4dc", padding: "2px 8px" }}>
          ● Depth 18 m · VLF OK
        </span>
      </div>

      <div className="mono" style={{ fontSize: 9, letterSpacing: "0.18em", color: muted, marginBottom: 8, textTransform: "uppercase" }}>
        Intake tray · 4 ciphered slips
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {slips.map((s, i) => (
          <div key={s.id} style={{
            background: "#e8dcc0", color: "#2a1f10",
            padding: "8px 12px",
            transform: `rotate(${i % 2 === 0 ? -0.6 : 0.4}deg)`,
            boxShadow: "0 2px 6px rgba(0,0,0,0.35)",
            borderLeft: `4px solid ${colour[s.urgency]}`,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3, fontFamily: "IBM Plex Mono", fontSize: 8.5, letterSpacing: "0.18em", textTransform: "uppercase" }}>
              <span style={{ color: colour[s.urgency], fontWeight: 700 }}>★ ENCRYPTED ★ {s.urgency}</span>
              <span style={{ opacity: 0.6 }}>{s.time}</span>
            </div>
            <div style={{ fontFamily: "Cormorant Garamond, serif", fontStyle: "italic", fontSize: 15, color: "#2a1f10" }}>
              {s.t}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16, fontFamily: "Cormorant Garamond, serif", fontStyle: "italic", fontSize: 13.5, color: muted, lineHeight: 1.45 }}>
        Audio cue on new signal — teleprinter clack + relay click. Backlog queues automatically when depth exceeds 25 m; drains in order on return.
      </div>
    </div>
  );
}

/* ----------------- Schnellschreiber compose cabinet ----------------- */
function SchnellschreiberCabinet({ isDiegetic }) {
  const ink = isDiegetic ? "#ffb143" : "var(--ink)";
  const muted = isDiegetic ? "#c4a86a" : "var(--ink-muted)";
  const [template, setTemplate] = useState("Sit-Rep");
  const templates = ["Sit-Rep", "Attack Result", "Status", "Request", "Wolf-pack Relay", "Emergency", "Free-text"];
  const isRoutine = ["Sit-Rep", "Status", "Request"].includes(template);

  return (
    <div style={{
      background: isDiegetic ? "#1a1308" : "var(--bg)",
      border: `1px solid ${isDiegetic ? "#7a5028" : "var(--rule-strong)"}`,
      padding: 16, minHeight: 580,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
        <div>
          <div className="mono" style={{ fontSize: 9.5, letterSpacing: "0.18em", color: muted, textTransform: "uppercase" }}>
            CABINET · SCHNELLSCHREIBER
          </div>
          <div className="serif" style={{ fontSize: 22, fontStyle: "italic", color: ink, lineHeight: 1, marginTop: 2 }}>
            HF Burst-transmit
          </div>
        </div>
      </div>

      <div className="mono" style={{ fontSize: 9, letterSpacing: "0.18em", color: muted, marginBottom: 6, textTransform: "uppercase" }}>
        Template
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, marginBottom: 14 }}>
        {templates.map((t) => (
          <button key={t} onClick={() => setTemplate(t)}
                  style={{
                    padding: "6px 8px",
                    background: template === t ? ink : "transparent",
                    color: template === t ? "#1a1308" : muted,
                    border: `1px solid ${isDiegetic ? "#7a5028" : "var(--rule-strong)"}`,
                    fontFamily: "IBM Plex Mono", fontSize: 9.5, letterSpacing: "0.1em",
                    cursor: "pointer", textTransform: "uppercase", textAlign: "left",
                  }}>
            {t}
          </button>
        ))}
      </div>

      <div className="mono" style={{ fontSize: 9, letterSpacing: "0.18em", color: muted, marginBottom: 6, textTransform: "uppercase" }}>
        Compose pad — {template}
      </div>
      <div style={{
        background: "#e8dcc0", color: "#2a1f10",
        padding: "10px 12px",
        minHeight: 90,
        marginBottom: 12,
        fontFamily: "Cormorant Garamond, serif", fontStyle: "italic", fontSize: 14, lineHeight: 1.5,
      }}>
        {template === "Sit-Rep" && "Patrol grid AN-3614. Battery 67%. No contacts last 14 h. Continuing south."}
        {template === "Attack Result" && "[—]"}
        {template === "Status" && "Boat fully operational. Crew morale steady. Snorkel cycle complete."}
        {template === "Request" && "[—]"}
        {template === "Wolf-pack Relay" && "[—]"}
        {template === "Emergency" && "[—]"}
        {template === "Free-text" && "[—]"}
      </div>

      <div className="mono" style={{ fontSize: 9, letterSpacing: "0.18em", color: muted, marginBottom: 6, textTransform: "uppercase" }}>
        Boat-state gates
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 12 }}>
        {[
          { lbl: "Depth ≤ 25 m", ok: true },
          { lbl: "Intercept quiet 60 s", ok: true },
        ].map((g) => (
          <div key={g.lbl} style={{
            padding: "5px 8px",
            background: g.ok ? "rgba(122, 208, 122, 0.1)" : "rgba(255, 90, 58, 0.1)",
            border: `1px solid ${g.ok ? "#7ad07a" : "#ff5a3a"}`,
            color: g.ok ? "#7ad07a" : "#ff5a3a",
            fontFamily: "IBM Plex Mono", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase",
          }}>
            {g.ok ? "●" : "○"} {g.lbl}
          </div>
        ))}
      </div>

      <div style={{
        padding: "6px 10px",
        background: isRoutine ? "rgba(122, 208, 122, 0.08)" : "rgba(255, 138, 74, 0.1)",
        border: `1px solid ${isRoutine ? "#7ad07a" : "#ff8a4a"}`,
        color: isRoutine ? "#7ad07a" : "#ff8a4a",
        fontFamily: "IBM Plex Mono", fontSize: 9, letterSpacing: "0.14em",
        textTransform: "uppercase", marginBottom: 10,
      }}>
        {isRoutine ? "● PRE-AUTHORISED · FIRE AT WILL" : "○ CAPTAIN AUTH REQUIRED"}
      </div>

      <button style={{
        width: "100%", padding: "12px 0",
        background: ink, color: "#1a1308",
        border: `1px solid ${ink}`,
        fontFamily: "IBM Plex Mono", fontSize: 12, letterSpacing: "0.2em",
        cursor: "pointer", textTransform: "uppercase", fontWeight: 600,
      }}>
        ▶ ENCODE & TRANSMIT
      </button>

      <div style={{ marginTop: 12, fontFamily: "Cormorant Garamond, serif", fontStyle: "italic", fontSize: 12, color: muted, lineHeight: 1.4 }}>
        Every burst increments local DF counter — Allied ASW probability rises hours-to-days.
      </div>
    </div>
  );
}

/* ----------------- UHF wolf-pack panel ----------------- */
function UHFCabinet({ isDiegetic }) {
  const ink = isDiegetic ? "#ffb143" : "var(--ink)";
  const muted = isDiegetic ? "#c4a86a" : "var(--ink-muted)";
  const [ptt, setPtt] = useState(false);

  const pack = [
    { sign: "U-241", us: true, status: "OWN", last: "—" },
    { sign: "U-509", us: false, status: "IN RANGE", last: "23 min" },
    { sign: "U-712", us: false, status: "IN RANGE", last: "4 h" },
    { sign: "U-188", us: false, status: "OUT OF RANGE", last: "11 h" },
  ];

  return (
    <div style={{
      background: isDiegetic ? "#1a1308" : "var(--bg)",
      border: `1px solid ${isDiegetic ? "#7a5028" : "var(--rule-strong)"}`,
      padding: 16, minHeight: 580,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
        <div>
          <div className="mono" style={{ fontSize: 9.5, letterSpacing: "0.18em", color: muted, textTransform: "uppercase" }}>
            CABINET · UHF TACTICAL
          </div>
          <div className="serif" style={{ fontSize: 22, fontStyle: "italic", color: ink, lineHeight: 1, marginTop: 2 }}>
            Wolf-pack
          </div>
        </div>
      </div>

      {/* Frequency dial */}
      <div style={{
        background: isDiegetic ? "#0e0804" : "var(--bg-warm)",
        border: `1px solid ${isDiegetic ? "#7a5028" : "var(--rule-strong)"}`,
        padding: 14,
        marginBottom: 14,
      }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.18em", color: muted, marginBottom: 6, textTransform: "uppercase" }}>
          Frequency · Pack Channel A
        </div>
        <div className="serif" style={{ fontSize: 36, fontStyle: "italic", color: ink, lineHeight: 1, fontWeight: 600 }}>
          241.74<span style={{ fontSize: 16, color: muted, marginLeft: 6 }}>MHz</span>
        </div>
        <div style={{ height: 4, background: isDiegetic ? "#3a2810" : "var(--bg-deep)", marginTop: 8 }}>
          <div style={{ width: "62%", height: "100%", background: ink }}/>
        </div>
        <div className="mono" style={{ fontSize: 8.5, color: muted, marginTop: 4, letterSpacing: "0.12em" }}>
          SIGNAL STRENGTH · STRONG
        </div>
      </div>

      {/* Pack roster */}
      <div className="mono" style={{ fontSize: 9, letterSpacing: "0.18em", color: muted, marginBottom: 6, textTransform: "uppercase" }}>
        Pack roster — Eisbär Group
      </div>
      <div style={{ marginBottom: 14 }}>
        {pack.map((p) => (
          <div key={p.sign} style={{
            display: "grid", gridTemplateColumns: "1fr auto auto",
            gap: 8, alignItems: "center",
            padding: "5px 8px",
            background: p.us ? "rgba(255, 177, 67, 0.1)" : "transparent",
            borderBottom: `1px dashed ${isDiegetic ? "#3a2810" : "var(--rule)"}`,
            fontFamily: "IBM Plex Mono", fontSize: 10,
          }}>
            <span style={{ color: p.us ? ink : "#f0e4cf", fontWeight: p.us ? 600 : 400, letterSpacing: "0.1em" }}>
              {p.us ? "★" : "·"} {p.sign}
            </span>
            <span style={{
              color: p.status === "IN RANGE" ? "#7ad07a" : p.status === "OUT OF RANGE" ? "#ff5a3a" : muted,
              fontSize: 9, letterSpacing: "0.14em",
            }}>
              {p.status}
            </span>
            <span style={{ color: muted, fontSize: 9 }}>{p.last}</span>
          </div>
        ))}
      </div>

      {/* PTT */}
      <div style={{ marginBottom: 14 }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.18em", color: muted, marginBottom: 6, textTransform: "uppercase" }}>
          Push-to-talk
        </div>
        <button onMouseDown={() => setPtt(true)} onMouseUp={() => setPtt(false)} onMouseLeave={() => setPtt(false)}
                style={{
                  width: "100%", padding: "16px 0",
                  background: ptt ? "#ff5a3a" : "transparent",
                  color: ptt ? "#1a1308" : "#ff5a3a",
                  border: `2px solid #ff5a3a`,
                  fontFamily: "IBM Plex Mono", fontSize: 12, letterSpacing: "0.2em",
                  cursor: "pointer", textTransform: "uppercase", fontWeight: 600,
                  boxShadow: ptt ? "0 0 16px rgba(255, 90, 58, 0.4)" : "none",
                }}>
          {ptt ? "● TRANSMITTING" : "○ HOLD TO TRANSMIT"}
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <div style={{
          padding: "6px 10px",
          background: ptt ? "rgba(255, 90, 58, 0.18)" : "transparent",
          border: "1px solid #ff5a3a",
          color: "#ff5a3a",
          fontFamily: "IBM Plex Mono", fontSize: 9, letterSpacing: "0.14em",
          textTransform: "uppercase", textAlign: "center",
        }}>
          {ptt ? "● XMIT" : "○ XMIT"}
        </div>
        <div style={{
          padding: "6px 10px",
          background: "rgba(122, 208, 122, 0.12)",
          border: "1px solid #7ad07a",
          color: "#7ad07a",
          fontFamily: "IBM Plex Mono", fontSize: 9, letterSpacing: "0.14em",
          textTransform: "uppercase", textAlign: "center",
        }}>
          ● RX U-509
        </div>
      </div>
    </div>
  );
}

/* ----------------- Sonne tuner ----------------- */
function SonneTuner({ isDiegetic }) {
  const ink = isDiegetic ? "#ffb143" : "var(--ink)";
  const muted = isDiegetic ? "#c4a86a" : "var(--ink-muted)";
  const accent = "#c4711f";
  return (
    <div style={{
      background: isDiegetic ? "#1a1308" : "var(--bg)",
      border: `1px solid ${isDiegetic ? "#7a5028" : "var(--rule-strong)"}`,
      padding: 12,
    }}>
      <div className="mono" style={{ fontSize: 9, letterSpacing: "0.18em", color: muted, marginBottom: 8, textTransform: "uppercase" }}>
        Sonne Radio Nav
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 12, alignItems: "center" }}>
        <svg width="68" height="68" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="32" fill={isDiegetic ? "#0e0804" : "var(--bg-warm)"} stroke={accent} strokeWidth="1.5"/>
          {Array.from({length: 12}).map((_, i) => {
            const rad = (i * 30 - 90) * Math.PI / 180;
            const x1 = 40 + Math.cos(rad) * 26;
            const y1 = 40 + Math.sin(rad) * 26;
            const x2 = 40 + Math.cos(rad) * 32;
            const y2 = 40 + Math.sin(rad) * 32;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={ink} strokeWidth="0.7" opacity="0.5"/>;
          })}
          {/* needle */}
          <line x1="40" y1="40" x2="56" y2="22" stroke={accent} strokeWidth="2"/>
          <circle cx="40" cy="40" r="3" fill={ink}/>
        </svg>
        <div>
          <div className="mono" style={{ fontSize: 12, color: ink, fontWeight: 600, letterSpacing: "0.14em" }}>
            STELLE C · 286 kHz
          </div>
          <div className="mono" style={{ fontSize: 9, color: muted, marginTop: 2, letterSpacing: "0.1em" }}>
            BEATS 14 · LOP ±3 nm
          </div>
        </div>
      </div>
      <div style={{ fontFamily: "Cormorant Garamond, serif", fontStyle: "italic", fontSize: 11.5, color: muted, marginTop: 8, lineHeight: 1.4 }}>
        Count beats in the 30-60 s window; specialty stat scales accuracy and speed.
      </div>
    </div>
  );
}

/* ----------------- Celestial conditions ----------------- */
function CelestialConditions({ isDiegetic }) {
  const ink = isDiegetic ? "#ffb143" : "var(--ink)";
  const muted = isDiegetic ? "#c4a86a" : "var(--ink-muted)";
  return (
    <div style={{
      background: isDiegetic ? "#1a1308" : "var(--bg)",
      border: `1px solid ${isDiegetic ? "#7a5028" : "var(--rule-strong)"}`,
      padding: 12,
    }}>
      <div className="mono" style={{ fontSize: 9, letterSpacing: "0.18em", color: muted, marginBottom: 8, textTransform: "uppercase" }}>
        Celestial conditions
      </div>
      <div style={{
        display: "grid", gridTemplateColumns: "1fr auto", gap: 4, fontFamily: "IBM Plex Mono", fontSize: 10,
        marginBottom: 8,
      }}>
        <span style={{ color: muted, textTransform: "uppercase", letterSpacing: "0.1em" }}>Cloud cover</span>
        <span style={{ color: ink }}>60%</span>
        <span style={{ color: muted, textTransform: "uppercase", letterSpacing: "0.1em" }}>Sea state</span>
        <span style={{ color: ink }}>3</span>
        <span style={{ color: muted, textTransform: "uppercase", letterSpacing: "0.1em" }}>Time</span>
        <span style={{ color: ink }}>14:31 day</span>
        <span style={{ color: muted, textTransform: "uppercase", letterSpacing: "0.1em" }}>Stars visible</span>
        <span style={{ color: "#ff8a4a" }}>NONE</span>
      </div>
      <button disabled style={{
        width: "100%", padding: "6px 0",
        background: "transparent",
        border: `1px dashed ${muted}`,
        color: muted,
        fontFamily: "IBM Plex Mono", fontSize: 9, letterSpacing: "0.16em",
        textTransform: "uppercase", cursor: "not-allowed",
      }}>
        ○ TAKE SIGHT · UNAVAILABLE
      </button>
      <div style={{ fontFamily: "Cormorant Garamond, serif", fontStyle: "italic", fontSize: 11.5, color: muted, marginTop: 8, lineHeight: 1.4 }}>
        Surface + clear horizon required. Dawn / dusk windows ~0445 / 1928.
      </div>
    </div>
  );
}

/* ----------------- Back-wall instruments strip ----------------- */
function BackWallInstruments({ isDiegetic }) {
  const ink = isDiegetic ? "#ffb143" : "var(--ink)";
  const muted = isDiegetic ? "#c4a86a" : "var(--ink-muted)";
  const brass = "#d4a76a";
  return (
    <div style={{
      borderTop: "1px solid rgba(196, 113, 31, 0.18)",
      background: isDiegetic ? "#160e06" : "var(--bg)",
      padding: "12px 18px",
      display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16,
    }}>
      <div className="mono" style={{
        fontSize: 9, letterSpacing: "0.18em", color: muted, textTransform: "uppercase",
        gridColumn: "1 / -1", marginBottom: -4,
      }}>
        Back-wall instruments · look up to consult
      </div>
      {/* Gyrocompass */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span className="mono" style={{ fontSize: 9, color: muted, letterSpacing: "0.14em" }}>GYRO</span>
          <span style={{ color: brass, fontFamily: "IBM Plex Mono", fontSize: 9 }}>±0.5°</span>
        </div>
        <div style={{
          background: isDiegetic ? "#0e0804" : "var(--bg-warm)",
          border: `1px solid ${brass}`,
          padding: "8px 10px", textAlign: "center",
        }}>
          <div className="serif" style={{ fontSize: 26, fontStyle: "italic", color: brass, lineHeight: 1, fontWeight: 600 }}>
            268°
          </div>
        </div>
      </div>
      {/* Speed log */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span className="mono" style={{ fontSize: 9, color: muted, letterSpacing: "0.14em" }}>SPD-LOG</span>
          <span style={{ color: brass, fontFamily: "IBM Plex Mono", fontSize: 9 }}>WATER</span>
        </div>
        <div style={{
          background: isDiegetic ? "#0e0804" : "var(--bg-warm)",
          border: `1px solid ${brass}`,
          padding: "8px 10px", textAlign: "center",
        }}>
          <div className="serif" style={{ fontSize: 26, fontStyle: "italic", color: brass, lineHeight: 1, fontWeight: 600 }}>
            4.2 kn
          </div>
        </div>
      </div>
      {/* Mag backup */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span className="mono" style={{ fontSize: 9, color: muted, letterSpacing: "0.14em" }}>MAG · BACKUP</span>
          <span style={{ color: brass, fontFamily: "IBM Plex Mono", fontSize: 9 }}>—</span>
        </div>
        <div style={{
          background: isDiegetic ? "#0e0804" : "var(--bg-warm)",
          border: `1px solid ${brass}`,
          padding: "8px 10px", textAlign: "center",
        }}>
          <div className="serif" style={{ fontSize: 26, fontStyle: "italic", color: brass, lineHeight: 1, fontWeight: 600 }}>
            271°
          </div>
        </div>
      </div>
      {/* Inertial nav (M3+) */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span className="mono" style={{ fontSize: 9, color: muted, letterSpacing: "0.14em" }}>INERTIAL · M3+</span>
          <span style={{ color: "#7ad07a", fontFamily: "IBM Plex Mono", fontSize: 9 }}>● ONLINE</span>
        </div>
        <div style={{
          background: "#082008",
          border: `1px solid #7ad07a`,
          padding: "8px 10px", textAlign: "center",
        }}>
          <div className="mono" style={{ fontSize: 11, color: "#7ad07a", lineHeight: 1.2, fontWeight: 600, letterSpacing: "0.1em" }}>
            54°12'N<br/>17°48'W
          </div>
          <div className="mono" style={{ fontSize: 8, color: "#5a8050", marginTop: 2, letterSpacing: "0.14em" }}>
            DRIFT 0.3 nm / 24 h
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { NavigatorStation });
