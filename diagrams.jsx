/* ============================================================
   Diagrams — mesh, heatmap, timeline, station map.
   ============================================================ */
const { useState, useMemo, useEffect, useRef } = React;

/* ----------------- Comms mesh diagram ----------------- */
// Five stations arranged radially. Captain at top, NCOs around.
// Hover an edge or node to highlight related flows.
const meshLayout = {
  CAPTAIN:   { x: 400, y: 90,  label: "CAPTAIN" },
  SONAR:     { x: 170, y: 230, label: "SONAR" },
  TORPEDO:   { x: 630, y: 230, label: "TORPEDO" },
  NAVIGATOR: { x: 250, y: 460, label: "NAVIGATOR" },
  ENGINEER:  { x: 550, y: 460, label: "ENGINEER" },
};

// Phase colour swatches — match phase pills
const PHASE_COLOURS = {
  cruise:  "#3a6f9e",
  stalk:   "#c9a13a",
  attack:  "#b03520",
  evade:   "#d97829",
  recover: "#6f6b66",
};

function CommsMesh({ activePhase, highlightStation, setHighlightStation }) {
  const flows = window.COMMS_FLOWS;
  const [hoverFlow, setHoverFlow] = useState(null); // {flowIdx, x, y}

  // Group flows by unordered pair so we know how many to fan out side-by-side.
  const pairs = useMemo(() => {
    const m = new Map();
    flows.forEach((f, idx) => {
      const a = [f.from, f.to].sort().join("|");
      if (!m.has(a)) m.set(a, []);
      m.get(a).push({ ...f, idx });
    });
    return [...m.entries()].map(([k, fs]) => ({
      key: k,
      a: k.split("|")[0],
      b: k.split("|")[1],
      flows: fs,
    }));
  }, [flows]);

  const isFlowVisiblePhase = (f) => !activePhase || f.phases.includes(activePhase);
  const isFlowFocusedStation = (f) =>
    !highlightStation || f.from === highlightStation || f.to === highlightStation;

  // Offset distance between parallel sibling lines, in svg units.
  const STEP = 7;

  return (
    <div className="mesh-wrap" style={{ aspectRatio: "5 / 4", position: "relative" }}>
      <svg viewBox="0 0 800 560" className="mesh-svg">
        <defs>
          {Object.entries(PHASE_COLOURS).map(([id, c]) => (
            <marker key={id} id={`dot-${id}`} viewBox="-3 -3 6 6"
                    markerWidth="3" markerHeight="3" refX="0" refY="0">
              <circle r="2" fill={c}/>
            </marker>
          ))}
        </defs>

        {/* Edges — one line per flow, fanned out perpendicular to pair midline */}
        {pairs.map((p) => {
          const a = meshLayout[p.a];
          const b = meshLayout[p.b];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const len = Math.hypot(dx, dy) || 1;
          // Perpendicular unit vector for fanning
          const nx = -dy / len;
          const ny = dx / len;
          const n = p.flows.length;
          return p.flows.map((f, i) => {
            const offset = (i - (n - 1) / 2) * STEP;
            const ax = a.x + nx * offset;
            const ay = a.y + ny * offset;
            const bx = b.x + nx * offset;
            const by = b.y + ny * offset;
            // gentle curve via control point pushed outward perpendicular
            const cx = (ax + bx) / 2 + nx * (offset * 0.4);
            const cy = (ay + by) / 2 + ny * (offset * 0.4);
            const visiblePhase = isFlowVisiblePhase(f);
            const focusedStation = isFlowFocusedStation(f);
            const dimmed = !visiblePhase || !focusedStation;
            const isHover = hoverFlow && hoverFlow.flowIdx === f.idx;

            // Build segmented path: split into N equal slices, one per phase
            // Only draw segments for phases the flow actually fires in.
            // Simpler approach: a series of <line> chunks along the curve.
            const SAMPLES = 60;
            const points = [];
            for (let s = 0; s <= SAMPLES; s++) {
              const t = s / SAMPLES;
              const x = (1 - t) * (1 - t) * ax + 2 * (1 - t) * t * cx + t * t * bx;
              const y = (1 - t) * (1 - t) * ay + 2 * (1 - t) * t * cy + t * t * by;
              points.push([x, y]);
            }
            // Distribute the SAMPLES segments evenly across f.phases.length colours
            const phasesArr = f.phases;
            return (
              <g key={f.idx}
                 style={{ cursor: "pointer", opacity: dimmed ? 0.16 : 1, transition: "opacity .2s" }}
                 onMouseEnter={(e) => {
                   const rect = e.currentTarget.ownerSVGElement.getBoundingClientRect();
                   setHoverFlow({ flowIdx: f.idx, clientX: e.clientX, clientY: e.clientY });
                 }}
                 onMouseMove={(e) => {
                   setHoverFlow({ flowIdx: f.idx, clientX: e.clientX, clientY: e.clientY });
                 }}
                 onMouseLeave={() => setHoverFlow(null)}>
                {/* Invisible fat hit target */}
                <path d={`M ${ax} ${ay} Q ${cx} ${cy} ${bx} ${by}`}
                      stroke="transparent" strokeWidth="14" fill="none"/>
                {/* Coloured segments */}
                {points.slice(0, -1).map((pt, j) => {
                  const phaseIdx = Math.floor((j / (points.length - 1)) * phasesArr.length);
                  const phase = phasesArr[Math.min(phaseIdx, phasesArr.length - 1)];
                  const colour = PHASE_COLOURS[phase];
                  const [x1, y1] = pt;
                  const [x2, y2] = points[j + 1];
                  return (
                    <line key={j} x1={x1} y1={y1} x2={x2} y2={y2}
                          stroke={colour}
                          strokeWidth={isHover ? 3.5 : 2.2}
                          strokeLinecap="round"
                          strokeDasharray={f.tpl === "A" ? "3 2" : "none"}/>
                  );
                })}
                {/* Direction arrow at end (toward `to`) */}
                {(() => {
                  // Compute angle at end
                  const last = points[points.length - 1];
                  const prev = points[points.length - 6] || points[0];
                  const ang = Math.atan2(last[1] - prev[1], last[0] - prev[0]) * 180 / Math.PI;
                  const fromIsA = f.from === p.a;
                  const tip = fromIsA ? last : points[0];
                  const adj = fromIsA ? ang : (ang + 180);
                  const c = PHASE_COLOURS[phasesArr[fromIsA ? phasesArr.length - 1 : 0]];
                  return (
                    <polygon points="-6,-3 0,0 -6,3"
                             fill={c}
                             transform={`translate(${tip[0]}, ${tip[1]}) rotate(${adj})`}/>
                  );
                })()}
                {/* Urgent pulse marker at midpoint */}
                {f.urgent && (() => {
                  const mid = points[Math.floor(points.length / 2)];
                  return <circle cx={mid[0]} cy={mid[1]} r="3.5" fill="var(--accent)" className="pulse"/>;
                })()}
              </g>
            );
          });
        })}

        {/* Nodes — drawn on top so lines tuck behind */}
        {Object.entries(meshLayout).map(([id, p]) => {
          const isCap = id === "CAPTAIN";
          const isHi = highlightStation === id;
          return (
            <g key={id}
               className={`mesh-node ${isCap ? "captain" : ""}`}
               style={{ cursor: "pointer" }}
               onMouseEnter={() => setHighlightStation && setHighlightStation(id)}
               onMouseLeave={() => setHighlightStation && setHighlightStation(null)}>
              <circle cx={p.x} cy={p.y} r={isHi ? 38 : 32} className="outer"/>
              <circle cx={p.x} cy={p.y} r={isHi ? 30 : 24} fill="none"
                      stroke={isCap ? "var(--bg)" : "var(--ink)"} strokeOpacity="0.22"/>
              <text x={p.x} y={p.y + 4} textAnchor="middle">{p.label}</text>
            </g>
          );
        })}
      </svg>

      {/* Tooltip rendered in HTML so it sits crisply above SVG */}
      {hoverFlow && (() => {
        const f = flows[hoverFlow.flowIdx];
        const wrapRect = document.querySelector(".mesh-wrap")?.getBoundingClientRect();
        if (!wrapRect) return null;
        const x = hoverFlow.clientX - wrapRect.left;
        const y = hoverFlow.clientY - wrapRect.top;
        // Tooltip placed above-right of cursor, clamped to bounds
        const w = 280;
        const left = Math.min(wrapRect.width - w - 8, Math.max(8, x + 14));
        const top = Math.max(8, y - 80);
        return (
          <div style={{
            position: "absolute", left, top, width: w, pointerEvents: "none",
            background: "var(--bg)", border: "1px solid var(--rule-strong)",
            padding: "10px 12px", boxShadow: "var(--paper-shadow)",
            zIndex: 5, fontSize: 12, lineHeight: 1.4,
          }}>
            <div className="mono" style={{ fontSize: 9.5, letterSpacing: "0.14em", color: "var(--ink-muted)", marginBottom: 4, display: "flex", justifyContent: "space-between" }}>
              <span>{f.from} → {f.to}</span>
              <span style={{ color: f.tpl === "A" ? "var(--accent)" : "var(--blueprint)" }}>
                [{f.tpl}] {f.tpl === "A" ? "PUSH OK" : "VOICE-ONLY"}
              </span>
            </div>
            <div style={{ fontSize: 13.5, color: "var(--ink)", marginBottom: 6 }}>
              {flowDescription(f)}
            </div>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {f.phases.map((ph) => (
                <span key={ph} style={{
                  fontFamily: "IBM Plex Mono", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase",
                  padding: "2px 6px", background: PHASE_COLOURS[ph], color: "white",
                }}>{ph}</span>
              ))}
              {f.urgent && (
                <span style={{
                  fontFamily: "IBM Plex Mono", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase",
                  padding: "2px 6px", background: "var(--accent)", color: "white",
                }}>● URGENT</span>
              )}
            </div>
          </div>
        );
      })()}

      {/* Phase-colour legend at bottom of mesh */}
      <div style={{
        position: "absolute", bottom: 8, left: 12, right: 12,
        display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center",
        fontFamily: "IBM Plex Mono", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase",
      }}>
        {Object.entries(PHASE_COLOURS).map(([id, c]) => (
          <span key={id} style={{ display: "inline-flex", alignItems: "center", gap: 5, color: "var(--ink-muted)" }}>
            <span style={{ width: 18, height: 3, background: c }}/>{id}
          </span>
        ))}
        <span style={{ color: "var(--ink-muted)", marginLeft: 6 }}>· solid = voice-only · dashed = push allowed</span>
      </div>
    </div>
  );
}

// Human-readable description for a flow (more conversational than `what`)
function flowDescription(f) {
  const phrases = {
    "Contact list":           "Sonar passes the current contact roster (bearing, classification, confidence) to the Captain for tactical reading.",
    "'Ortung!' radar lock":   "Sonar's FuMB-7 ESM detects an Allied radar locking onto the boat. Highest-priority verbal interrupt — triggers the dive klaxon.",
    "Position · decoded slips":"Navigator hands the Captain the boat's current position and any decoded BdU wolf-pack slips.",
    "Battery · damage · casualties":"Engineer reports power, structural and personnel status. Voice-only — no push shortcut.",
    "Solution ready · tubes loaded":"Torpedo (WO) signals the Captain the fire-control solution has locked in and tubes are armed.",
    "Bearing / AOB / classification":"Sonar feeds Torpedo the target bearing, angle-on-bow and acoustic classification — the core of a Lauschangriff (listening attack).",
    "Bearings for TMA plot": "Sonar pushes raw bearings to Navigator for target-motion-analysis plotting on the chart.",
    "Go silent · pump noise":"Sonar tells Engineer to kill machinery noise — pumps, blowers, fans — to drop to creep regime.",
    "Own-ship course/speed": "Navigator pushes own-ship vector to Torpedo for Vorhaltrechner geometry.",
    "Snorkel ETA · charge window":"Navigator gives Engineer the next safe snorkel window so battery charge can be timed against patrol cover.",
    "Tube serviceability · air":"Engineer pushes Torpedo a serviceability map — which tubes are ready and how much compressed air is available.",
    "Fire & decoy orders":   "Captain's verbal command to fire torpedoes ('Rohr X, Loss!') or deploy a Bold-VII decoy. Voice-only — no buttons.",
  };
  return phrases[f.what] || f.what;
}

/* ----------------- Phase heat-map (interactive) ----------------- */
function PhaseHeatmap({ activePhase, setActivePhase }) {
  const stations = ["CAPTAIN", "SONAR", "NAVIGATOR", "ENGINEER", "TORPEDO"];
  const phases = window.PHASES;
  // load 1..7 → cell colour
  const heatColour = (n) => {
    // 1 idle, 2 light, 3 mod, 4 active, 5 heavy, 6 peak, 7 peak+
    const stops = [
      "transparent",
      "rgba(31, 61, 90, 0.10)",   // 2
      "rgba(31, 61, 90, 0.18)",   // 3
      "rgba(217, 120, 41, 0.22)", // 4
      "rgba(217, 120, 41, 0.42)", // 5
      "rgba(176, 53, 32, 0.55)",  // 6
      "rgba(176, 53, 32, 0.78)",  // 7
    ];
    return stops[Math.min(Math.max(n - 1, 0), stops.length - 1)];
  };

  return (
    <div>
      <div className="phase-pills" style={{ marginBottom: 12 }}>
        <button onClick={() => setActivePhase(null)}
                className={`phase-pill ${!activePhase ? "active" : ""}`}>
          <span className="dot" style={{ background: "var(--ink)" }}></span>All phases
        </button>
        {phases.map((p) => (
          <button key={p.id}
                  onClick={() => setActivePhase(activePhase === p.id ? null : p.id)}
                  className={`phase-pill ${p.id} ${activePhase === p.id ? "active" : ""}`}>
            <span className="dot"></span>{p.short}
          </button>
        ))}
      </div>

      <div className="heatmap">
        <div className="hm-cell head"></div>
        {phases.map((p) => (
          <div key={p.id} className="hm-cell head"
               style={{
                 background: activePhase === p.id ? "var(--ink)" : undefined,
                 color: activePhase === p.id ? "var(--bg)" : undefined,
                 cursor: "pointer"
               }}
               onClick={() => setActivePhase(activePhase === p.id ? null : p.id)}>
            {p.short}
          </div>
        ))}
        {stations.map((s) => (
          <React.Fragment key={s}>
            <div className="hm-cell rowhead">{s}</div>
            {phases.map((p) => {
              const v = p.loads[s];
              const isActive = !activePhase || activePhase === p.id;
              return (
                <div key={p.id} className="hm-cell"
                     style={{
                       background: heatColour(v),
                       opacity: isActive ? 1 : 0.25,
                       transition: "opacity .25s, background .25s",
                     }}>
                  <div className="num">{v}</div>
                  <div className="lbl">{v >= 6 ? "Peak" : v >= 5 ? "Heavy" : v >= 4 ? "Active" : v >= 3 ? "Moderate" : v >= 2 ? "Light" : "Idle"}</div>
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      {activePhase && (
        <div className="callout" style={{ marginTop: 16 }}>
          <strong style={{ fontFamily: "IBM Plex Mono", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", fontStyle: "normal" }}>
            {phases.find(p => p.id === activePhase).short}
          </strong>
          <br/>
          {phases.find(p => p.id === activePhase).body}
        </div>
      )}
    </div>
  );
}

/* ----------------- Clickable timeline ----------------- */
function Timeline() {
  const events = window.TIMELINE;
  const [open, setOpen] = useState(new Set([0, 11])); // open the bomb & 1955

  const toggle = (i) => {
    const n = new Set(open);
    if (n.has(i)) n.delete(i); else n.add(i);
    setOpen(n);
  };

  return (
    <div className="timeline">
      {events.map((e, i) => (
        <div key={i}
             className={`tl-event ${e.major ? "major" : ""} ${open.has(i) ? "open" : ""}`}
             onClick={() => toggle(i)}>
          <div className="date">{e.date}{e.major && " · major"}</div>
          <div className="title">{e.title}</div>
          <div className="tl-detail">{e.body}</div>
        </div>
      ))}
    </div>
  );
}

/* ----------------- Variant ladder visual ----------------- */
function VariantLadder({ highlightId }) {
  const variants = window.VARIANTS;
  const order = [...variants].sort((a, b) => a.progression - b.progression);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {order.map((v) => (
        <div key={v.id} id={`variant-${v.id}`} className="card"
             style={{
               display: "grid",
               gridTemplateColumns: "60px 1.4fr 1fr",
               gap: 24,
               alignItems: "start",
               position: "relative",
               background: v.hero ? "var(--bg-deep)" : "var(--bg-warm)",
               borderColor: highlightId === v.id ? "var(--accent)" : (v.hero ? "var(--accent)" : "var(--rule-strong)"),
               borderWidth: highlightId === v.id ? 2 : 1,
               boxShadow: highlightId === v.id ? "0 6px 20px rgba(255,138,74,0.25)" : "var(--paper-shadow)",
               transition: "border-color .3s, box-shadow .3s",
             }}>
          {v.hero && (
            <div className="stamp solid"
                 style={{ position: "absolute", top: -10, right: 12, transform: "rotate(2deg)" }}>
              Player boat
            </div>
          )}
          <div>
            <div className="mono" style={{ fontSize: 28, lineHeight: 1, color: "var(--accent)" }}>{v.progression}</div>
            <div className="mono" style={{ fontSize: 9, letterSpacing: "0.16em", color: "var(--ink-muted)", marginTop: 4 }}>ROLE</div>
          </div>
          <div>
            <div className="mono" style={{ fontSize: 10, letterSpacing: "0.18em", color: "var(--ink-muted)", textTransform: "uppercase" }}>
              Type {v.code}
            </div>
            <h3 className="serif" style={{ margin: "2px 0 4px", fontSize: 28, fontWeight: 500, color: "var(--ink)", textTransform: "none", letterSpacing: 0 }}>
              {v.name}
            </h3>
            <div style={{ color: "var(--ink-muted)", fontSize: 13, marginBottom: 6, fontStyle: "italic", fontFamily: "Cormorant Garamond, serif" }}>
              {v.role} — {v.tone}
            </div>
            <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.55, color: "var(--ink)", maxWidth: "55ch" }}>
              {v.blurb}
            </p>
          </div>
          <dl className="spec-list">
            <dt>Displ.</dt><dd>{v.stats.displ}</dd>
            <dt>Crew</dt><dd>{v.stats.crew}</dd>
            <dt>Length</dt><dd>{v.stats.len}</dd>
            <dt>Speed</dt><dd>{v.stats.speed}</dd>
            <dt>Test depth</dt><dd>{v.stats.depth}</dd>
            <dt>Armament</dt><dd>{v.stats.arm}</dd>
          </dl>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { CommsMesh, PhaseHeatmap, Timeline, VariantLadder, ActionHeatmap });

/* ----------------- Action heatmap (Stations section) -----------------
   5×5 grid (stations × phases) showing the action lists per cell,
   with intensity colour mirroring PHASES[i].loads.
   ------------------------------------------------------------------- */
function ActionHeatmap() {
  const [focusStation, setFocusStation] = useState(null);
  const [focusPhase, setFocusPhase] = useState(null);
  const stations = ["CAPTAIN", "SONAR", "NAVIGATOR", "ENGINEER", "TORPEDO"];
  const phases = window.PHASES;

  const phaseColours = {
    cruise: "#3a6f9e", stalk: "#c9a13a", attack: "#b03520",
    evade: "#d97829", recover: "#6f6b66",
  };

  const intensityBg = (load) => {
    const stops = [
      "transparent",
      "rgba(58, 111, 158, 0.08)",
      "rgba(58, 111, 158, 0.14)",
      "rgba(217, 120, 41, 0.16)",
      "rgba(217, 120, 41, 0.30)",
      "rgba(176, 53, 32, 0.42)",
      "rgba(176, 53, 32, 0.62)",
    ];
    return stops[Math.min(Math.max(load - 1, 0), stops.length - 1)];
  };
  const intensityLabel = (n) =>
    n >= 6 ? "Peak" : n >= 5 ? "Heavy" : n >= 4 ? "Active" :
    n >= 3 ? "Moderate" : n >= 2 ? "Light" : "Idle";

  // Shared cell style
  const cellBase = {
    padding: "12px 12px",
    borderRight: "1px solid var(--rule)",
    borderBottom: "1px solid var(--rule)",
    fontFamily: "IBM Plex Mono, monospace",
    fontSize: 11,
    transition: "opacity .25s, background .25s",
  };
  const headBase = {
    ...cellBase,
    background: "var(--bg-deep)",
    fontSize: 11,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: "var(--ink-muted)",
    padding: "12px 12px",
    textAlign: "center",
    cursor: "pointer",
  };
  const rowheadBase = {
    ...cellBase,
    background: "var(--bg-deep)",
    fontFamily: "IBM Plex Sans, sans-serif",
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: "var(--ink)",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: "14px 14px",
    cursor: "pointer",
  };

  return (
    <div>
      {/* Phase pills above */}
      <div style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "center", flexWrap: "wrap" }}>
        <span className="mono" style={{ fontSize: 10, letterSpacing: "0.16em", color: "var(--ink-muted)", textTransform: "uppercase" }}>
          Filter:
        </span>
        <div className="phase-pills">
          <button onClick={() => { setFocusPhase(null); setFocusStation(null); }}
                  className={`phase-pill ${!focusPhase && !focusStation ? "active" : ""}`}>
            <span className="dot" style={{ background: "var(--ink)" }}></span>All
          </button>
          {phases.map((p) => (
            <button key={p.id}
                    onClick={() => setFocusPhase(focusPhase === p.id ? null : p.id)}
                    className={`phase-pill ${p.id} ${focusPhase === p.id ? "active" : ""}`}>
              <span className="dot"></span>{p.short}
            </button>
          ))}
        </div>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "150px repeat(5, 1fr)",
        gap: 0,
        background: "var(--bg-warm)",
        border: "1px solid var(--rule-strong)",
      }}>
        {/* Top-left empty corner */}
        <div style={{ ...headBase, cursor: "default" }}></div>

        {/* Phase column headers */}
        {phases.map((p) => (
          <div key={p.id}
               style={{
                 ...headBase,
                 background: focusPhase === p.id ? "var(--ink)" : "var(--bg-deep)",
                 color: focusPhase === p.id ? "var(--bg)" : "var(--ink-muted)",
               }}
               onClick={() => setFocusPhase(focusPhase === p.id ? null : p.id)}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <span style={{
                display: "inline-block", width: 18, height: 4,
                background: phaseColours[p.id],
              }}/>
              <span>{p.short}</span>
            </div>
          </div>
        ))}

        {/* Body rows */}
        {stations.map((s) => (
          <React.Fragment key={s}>
            <div style={{
                   ...rowheadBase,
                   background: focusStation === s ? "var(--ink)" : "var(--bg-deep)",
                   color: focusStation === s ? "var(--bg)" : "var(--ink)",
                 }}
                 onClick={() => setFocusStation(focusStation === s ? null : s)}>
              {s}
            </div>
            {phases.map((p) => {
              const load = p.loads[s];
              const actions = window.STATION_PHASE_ACTIONS[s][p.id] || [];
              const isFocus =
                (!focusStation && !focusPhase) ||
                (focusStation === s && !focusPhase) ||
                (focusPhase === p.id && !focusStation) ||
                (focusStation === s && focusPhase === p.id);
              return (
                <div key={p.id}
                     style={{
                       ...cellBase,
                       background: intensityBg(load),
                       opacity: isFocus ? 1 : 0.22,
                       padding: "12px 12px",
                       textAlign: "left",
                       minHeight: 140,
                     }}>
                  <div style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    marginBottom: 8,
                    fontFamily: "IBM Plex Mono, monospace",
                    fontSize: 9, letterSpacing: "0.16em",
                    color: "var(--ink-muted)", textTransform: "uppercase",
                  }}>
                    <span>{intensityLabel(load)}</span>
                    <span style={{ color: "var(--ink)", fontWeight: 700, fontSize: 11 }}>{load}</span>
                  </div>
                  {/* Actions list — divs, NOT ul/li, to avoid global ::before bullets */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {actions.map((a, i) => (
                      <div key={i} style={{
                        position: "relative",
                        paddingLeft: 10,
                        fontFamily: "IBM Plex Mono, monospace",
                        fontSize: 10.5,
                        lineHeight: 1.32,
                        color: "var(--ink)",
                      }}>
                        <span style={{
                          position: "absolute",
                          left: 0, top: 5,
                          width: 4, height: 4,
                          background: "var(--accent)",
                        }}/>
                        {a}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      <p style={{ marginTop: 12, fontSize: 12, color: "var(--ink-muted)", fontFamily: "IBM Plex Mono", letterSpacing: "0.06em" }}>
        Click a row or column header to focus. Cell intensity tracks the qualitative load value (1=idle → 7=peak).
      </p>
    </div>
  );
}
