/* ============================================================
   Section content components.
   Each ID matches a SECTIONS entry. Composed inside SectionView.
   ============================================================ */

function Expand({ title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`expand ${open ? "open" : ""}`}>
      <button className="expand-head" onClick={() => setOpen(!open)}>
        <span>{title}</span>
        <span className="expand-toggle">{open ? "− COLLAPSE" : "+ EXPAND"}</span>
      </button>
      <div className="expand-body">{children}</div>
    </div>
  );
}

/* ---------- 01 Premise ---------- */
function PremiseSection() {
  return (
    <div className="section-body">
      <div className="callout">
        <em>Hunter Hunted: Iron Tide</em> is a five-player co-op submarine command sim set in an alternate
        Cold War where the Gersdorff bomb of 1943 succeeded. The Kaiserreich's U-boat arm fights the sixteenth
        year of an unbroken war at sea.
        <cite>— Series bible, May 2026</cite>
      </div>

      {window.PREMISE_BLOCKS.map((b, i) => (
        <div key={i}>
          <h3>{b.head}</h3>
          <p>{b.body}</p>
        </div>
      ))}

      <Expand title="Tone anchors that govern everything else" defaultOpen={true}>
        <div className="grid-2">
          {window.TONE_ANCHORS.map((t, i) => (
            <div key={i} className="card">
              <div className="card-title">{t.head}</div>
              <p style={{ fontSize: 13.5, color: "var(--ink-muted)", margin: 0 }}>{t.body}</p>
            </div>
          ))}
        </div>
      </Expand>

      <Expand title="Who's in charge — key figures of 1955">
        <div className="grid-2">
          {[
            { side: "GERMANY", people: [
              ["Kaiser Ludwig Ferdinand I", "Anglophile, prestige figurehead, real power limited"],
              ["Chancellor Carl Friedrich Goerdeler", "Conservative, civilian, at odds with the military"],
              ["Grand Admiral Karl-Friedrich Merten", "C-in-C Kriegsmarine, wartime ace, drives U-boat doctrine"],
              ["Admiral Wilhelm Canaris", "Director RND, spymaster, killed the Manhattan Project"],
            ]},
            { side: "THE ALLIES", people: [
              ["President Robert A. Taft", "Won 1952 on 'end the wars or win them'"],
              ["PM Anthony Eden", "Managing imperial collapse"],
              ["Adm. Lord Mountbatten", "First Sea Lord, architect of the Atlantic Barrier"],
              ["Adm. Arleigh Burke", "USN CNO, brings carrier-doctrine to ASW"],
            ]},
          ].map((b, i) => (
            <div key={i} className="card">
              <div className="card-sub">{b.side}</div>
              <ul style={{ margin: 0 }}>
                {b.people.map((p, j) => (
                  <li key={j}>
                    <strong>{p[0]}</strong>
                    <div style={{ color: "var(--ink-muted)", fontSize: 12, marginTop: 1 }}>{p[1]}</div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Expand>
    </div>
  );
}

/* ---------- 02 Timeline ---------- */
function TimelineSection() {
  return (
    <div className="section-body">
      <p>
        The point of divergence is one moment, one bomb, in March 1943. Everything else is a chain of
        consequences. Click any entry to expand. Major events are marked.
      </p>
      <Timeline/>
    </div>
  );
}

/* ---------- 03 The Boats — Atlantik hero + variant ladder ---------- */
function VariantsSection({ subRoute }) {
  // Scroll behaviour: 'hero' jumps to the Atlantik feature panel;
  // any variant id jumps to its row in the ladder.
  useEffect(() => {
    if (!subRoute) return;
    const targetId = subRoute === "hero" ? "atlantik-hero" : `variant-${subRoute}`;
    const el = document.getElementById(targetId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [subRoute]);

  return (
    <div className="section-body">
      <p>
        Five operational boat classes plus one prototype. The <em>Atlantik</em> is the hero — the
        boat the project is designed against first; every other variant inherits a subset or
        superset of its feature surface. The ladder below shows the player career progression from
        coastal Küstenwolf through to the nuclear Walhall.
      </p>

      {/* ---------- Atlantik hero block ---------- */}
      <div id="atlantik-hero" style={{
        padding: subRoute === "hero" ? "16px 18px" : 0,
        background: subRoute === "hero" ? "var(--bg-warm)" : "transparent",
        border: subRoute === "hero" ? "1px solid var(--accent)" : "none",
        transition: "background .3s, padding .3s",
      }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 6 }}>
          <h2 style={{ margin: 0 }}>The Atlantik — Type XXI/M3</h2>
          <span className="stamp">Player boat</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24, alignItems: "start", marginTop: 14 }}>
          <div className="card">
            <div className="card-sub">Hull silhouette · 78 m</div>
            <svg viewBox="0 0 600 140" style={{ width: "100%", display: "block" }}>
              <defs>
                <pattern id="hatch" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
                  <line x1="0" y1="0" x2="0" y2="6" stroke="var(--ink-muted)" strokeWidth="0.5" opacity="0.4"/>
                </pattern>
              </defs>
              <line x1="0" y1="70" x2="600" y2="70" stroke="var(--blueprint)" strokeDasharray="4 3" strokeWidth="0.6"/>
              <path d="M 20 80 Q 30 50 80 48 L 520 48 Q 560 50 580 80 Q 560 110 520 110 L 80 110 Q 30 108 20 80 Z"
                    fill="url(#hatch)" stroke="var(--ink)" strokeWidth="1.6"/>
              <rect x="260" y="28" width="80" height="20" fill="var(--bg-warm)" stroke="var(--ink)" strokeWidth="1.4"/>
              <rect x="288" y="14" width="14" height="14" fill="var(--bg-warm)" stroke="var(--ink)" strokeWidth="1"/>
              <line x1="295" y1="14" x2="295" y2="6" stroke="var(--ink)" strokeWidth="1"/>
              <line x1="302" y1="14" x2="302" y2="4" stroke="var(--ink)" strokeWidth="1"/>
              <line x1="20" y1="80" x2="6" y2="80" stroke="var(--accent)" strokeWidth="1"/>
              <text x="3" y="86" fontFamily="IBM Plex Mono" fontSize="7" fill="var(--accent)" textAnchor="end">6× BOW</text>
              <line x1="580" y1="80" x2="594" y2="80" stroke="var(--accent)" strokeWidth="1"/>
              <text x="597" y="86" fontFamily="IBM Plex Mono" fontSize="7" fill="var(--accent)">2× STERN</text>
              <line x1="20" y1="128" x2="580" y2="128" stroke="var(--ink)" strokeWidth="0.6"/>
              <line x1="20" y1="124" x2="20" y2="132" stroke="var(--ink)" strokeWidth="0.6"/>
              <line x1="580" y1="124" x2="580" y2="132" stroke="var(--ink)" strokeWidth="0.6"/>
              <text x="300" y="138" fontFamily="IBM Plex Mono" fontSize="8" letterSpacing="0.18em" fill="var(--ink-muted)" textAnchor="middle">78 METRES</text>
              <text x="120" y="38" fontFamily="IBM Plex Mono" fontSize="7" fill="var(--blueprint)">GHG · 56 elements/side</text>
              <line x1="120" y1="40" x2="100" y2="60" stroke="var(--blueprint)" strokeWidth="0.5"/>
            </svg>
          </div>

          <div className="card">
            <div className="card-sub">Spec card</div>
            <dl className="spec-list">
              {window.ATLANTIK_SPEC.map(([k, v]) => (
                <React.Fragment key={k}>
                  <dt>{k}</dt><dd>{v}</dd>
                </React.Fragment>
              ))}
            </dl>
          </div>
        </div>

        <div style={{ marginTop: 18 }}>
          <Expand title="Why this boat carries the design weight" defaultOpen={false}>
            <p>
              The Atlantik fields the full feature set of modern U-boat combat: full Vorhaltrechner M-7
              integration, both wire-guidance consoles, the complete sensor suite from GHG to FuMB-7,
              standard Alberich-IV coating, both burst HF and VLF comms, and the Schlüsselgerät 51 cipher
              machine. Every cross-station data flow we design has its home here first.
            </p>
            <p>
              A skilled crew on an Atlantik can engage almost any Allied force on equal terms. A careless
              one dies as easily as any other. That spread — competence vs. carelessness, named men vs.
              generic pool, the cumulative state of the boat across a 60-day patrol — is the campaign loop.
            </p>
          </Expand>

          <Expand title="What the Atlantik does NOT carry">
            <ul>
              <li><strong>No Walter HTP turbine.</strong> Sprint speed maxes at 17 kn submerged with severe battery cost. For 24-kn sprint you need the Silberfisch.</li>
              <li><strong>No Kreislaufdiesel.</strong> Sustained submerged endurance maxes at 6 days on battery alone. For longer, you need the Fernwolf.</li>
              <li><strong>No Seeschlange cruise missile.</strong> Strike role is Fernwolf-only.</li>
              <li><strong>No nuclear propulsion.</strong> Reactor work belongs to the Walhall prototype, not yet operational.</li>
            </ul>
          </Expand>
        </div>
      </div>

      {/* ---------- The ladder ---------- */}
      <div style={{ marginTop: 28 }}>
        <h2 style={{ margin: "0 0 12px" }}>The full ladder — Küstenwolf → Walhall</h2>
        <VariantLadder highlightId={subRoute === "hero" ? null : subRoute}/>
        <p style={{ color: "var(--ink-muted)", fontStyle: "italic", fontFamily: "Cormorant Garamond, serif", fontSize: 18, marginTop: 18 }}>
          Not every player will tour all five. Campaign mode may let the player specialise in one or
          two boats rather than the full ladder. The variant ladder gives the design an obvious
          progression and a way to introduce new technology and tactics in measured doses.
        </p>
      </div>
    </div>
  );
}

/* ---------- 05 Tech sections ---------- */
function TechSection({ subRoute }) {
  useEffect(() => {
    if (subRoute) {
      const el = document.getElementById(`tech-${subRoute}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [subRoute]);
  return (
    <div className="section-body">
      <p>
        Twelve years of investment in submarine technology produced a fleet vastly more capable than
        the 1943 Type VII. Sustained submerged endurance is measured in weeks. Sensor systems develop
        a tactical picture without raising a periscope. Weapons engage targets the boat has never
        visually seen. Four families below — click any item to expand.
      </p>
      {window.TECH_SECTIONS.map((g) => (
        <div key={g.id} id={`tech-${g.id}`} style={{
          marginTop: 24,
          padding: subRoute === g.id ? "16px 18px" : 0,
          background: subRoute === g.id ? "var(--bg-warm)" : "transparent",
          border: subRoute === g.id ? "1px solid var(--accent)" : "none",
          transition: "background .3s, padding .3s",
        }}>
          <h2>{g.title}</h2>
          <p style={{ color: "var(--ink-muted)", fontFamily: "Cormorant Garamond, serif", fontStyle: "italic", fontSize: 18, marginTop: 4, marginBottom: 14 }}>
            {g.blurb}
          </p>
          {g.items.map((it, i) => (
            <Expand key={i} title={it.name + " — " + it.spec} defaultOpen={subRoute === g.id && i === 0}>
              <p>{it.detail}</p>
            </Expand>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ---------- 06 Phases ---------- */
function PhasesSection({ subRoute }) {
  const [active, setActive] = useState(subRoute || null);
  useEffect(() => {
    if (subRoute) setActive(subRoute);
  }, [subRoute]);
  return (
    <div className="section-body">
      <p>
        The patrol rhythm is the spine of every cross-station design. Each phase has a distinct load
        signature per station, and the heat-map below shows where the work concentrates. Click any
        phase pill (or any column header) to focus.
      </p>
      <PhaseHeatmap activePhase={active} setActivePhase={setActive}/>

      <div className="grid-5" style={{ marginTop: 24 }}>
        {window.PHASES.map((p) => (
          <div key={p.id} className="card"
               style={{
                 cursor: "pointer",
                 borderColor: active === p.id ? "var(--accent)" : "var(--rule-strong)",
                 background: active === p.id ? "var(--bg-warm)" : "var(--bg)",
               }}
               onClick={() => setActive(active === p.id ? null : p.id)}>
            <div className="card-sub" style={{ color: active === p.id ? "var(--accent)" : "var(--ink-muted)" }}>{p.pct} {p.short.toUpperCase()}</div>
            <div className="serif" style={{ fontSize: 18, lineHeight: 1.2, color: "var(--ink)", marginBottom: 8 }}>{p.headline}</div>
            <div style={{ fontFamily: "IBM Plex Mono", fontSize: 9.5, letterSpacing: "0.12em", color: "var(--ink-muted)", textTransform: "uppercase" }}>
              HOT: {p.hot.join(" · ")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- 07 Stations ---------- */
function StationsSection({ stationStyle, subRoute }) {
  const [zoom, setZoom] = useState(subRoute || "CAPTAIN");
  useEffect(() => {
    if (subRoute && subRoute !== zoom) setZoom(subRoute);
  }, [subRoute]);
  return (
    <div className="section-body">
      <p>
        Five player-controllable stations. Two doctrinal roles (FuMB/ESM and Radio/cipher) fold into
        adjacent stations rather than getting their own consoles — Sonar absorbs ESM, Navigator
        absorbs Radio. <strong>All five stations are now designed</strong> — pick any pill to open
        its mid-fi mockup.
      </p>

      <div>
        <h2 style={{ marginBottom: 4 }}>What each station does, by phase</h2>
        <p style={{ color: "var(--ink-muted)", fontFamily: "Cormorant Garamond, serif", fontStyle: "italic", fontSize: 18, margin: "0 0 14px" }}>
          The action matrix — every station's work across the patrol rhythm.
        </p>
        <ActionHeatmap/>
      </div>

      <div className="phase-pills" style={{ margin: "8px 0 4px" }}>
        {window.STATIONS.map((s) => (
          <button key={s.id}
                  onClick={() => setZoom(s.id)}
                  className={`phase-pill ${zoom === s.id ? "active" : ""}`}>
            <span className="dot" style={{ background: s.color === "accent" ? "var(--accent)" : "var(--ink)" }}></span>
            {s.id}
          </button>
        ))}
      </div>

      {zoom === "CAPTAIN" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 16 }}>
            <h2 style={{ margin: 0 }}>CAPTAIN — mid-fi mockup</h2>
            <span className="stamp">Designed · §3.1 complete</span>
          </div>
          <p style={{ marginTop: 8 }}>
            Standing-camera, three look-anchors: <strong>down</strong> to the plotting table,
            <strong> up</strong> to wall readouts, <strong>left</strong> to the periscope nacelle.
            Crew dispatch is drag-and-drop. Wolf-pack signals arrive as paper slips on a clipboard,
            colour-coded by importance.
          </p>
          <div style={{ marginTop: 16 }}>
            <CaptainStation style={stationStyle}/>
          </div>
        </div>
      )}

      {zoom === "SONAR" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 16 }}>
            <h2 style={{ margin: 0 }}>SONAR — mid-fi mockup</h2>
            <span className="stamp">Designed · §3.2 complete</span>
          </div>
          <p style={{ marginTop: 8 }}>
            Seated console arc. <strong>GHG bearing wheel</strong> centre with Suchlauf auto-sweep
            and KDB fine-bearing lock. <strong>FuMB-7 ESM polar plot</strong> forward-right with
            candidate-narrowing library matches. <strong>S-Gerät</strong> forward-left — guarded
            three-stage ritual (cover · arm · fire). <strong>Geräuschbuch</strong> on its angled
            stand with page-folder tabs and confidence scoring. Colour-class peripheral identification:
            red ambient, amber GHG, green magic-eye, blue-white ESM. Try the focus toggles in the top
            bar and the S-Gerät arming sequence.
          </p>
          <div style={{ marginTop: 16 }}>
            <SonarStation style={stationStyle}/>
          </div>
        </div>
      )}

      {zoom === "NAVIGATOR" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 16 }}>
            <h2 style={{ margin: 0 }}>NAVIGATOR — mid-fi mockup</h2>
            <span className="stamp">Designed · §3.3 complete</span>
          </div>
          <p style={{ marginTop: 8 }}>
            Single standing stance at the chart table. <strong>DR uncertainty cone</strong> grows
            forward until precision-checked. <strong>TMA candidate tracks</strong> draw from
            timestamped Sonar bearing lines with confidence scores. Right wall: <strong>Schlüsselgerät
            51</strong> rotor-alignment cipher minigame, <strong>VLF inbox</strong> with stacked
            ciphered slips, <strong>Schnellschreiber</strong> compose console with boat-state gates,
            <strong> UHF wolf-pack</strong> panel with pack roster. Back wall: gyrocompass, speed
            log, magnetic backup, and the M3+ inertial nav readout. Try the rotors (click to advance,
            set them to <code>K·M·F·P</code>) and the cabinet switcher in the top bar.
          </p>
          <div style={{ marginTop: 16 }}>
            <NavigatorStation style={stationStyle}/>
          </div>
        </div>
      )}

      {zoom === "ENGINEER" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 16 }}>
            <h2 style={{ margin: 0 }}>ENGINEER — mid-fi mockup</h2>
            <span className="stamp">Designed · §3.4 complete</span>
          </div>
          <p style={{ marginTop: 8 }}>
            Standing 1-stance, two-panel console. <strong>Propulsion</strong> (left) — three-mode
            selector, 5-step engine telegraph, two-bank battery with charge-rate, and the interlock
            light row. <strong>Damage</strong> (right) — compartment damage map, Stufe lever
            (Aus → 1 → 2 → 3 = Totenstille), damage-card queue with severity ★ stars, and the
            casualty triage panel. The <strong>engine bay viewport</strong> on the forward bulkhead
            shows machinery physically running — pistons stop, electric motors light up — so the
            crew sees the boat's state, not just reads it. Try the mode selector and the Stufe
            lever; the viewport reflects each change.
          </p>
          <div style={{ marginTop: 16 }}>
            <EngineerStation style={stationStyle}/>
          </div>
        </div>
      )}

      {zoom === "TORPEDO" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 16 }}>
            <h2 style={{ margin: 0 }}>TORPEDO — mid-fi mockup</h2>
            <span className="stamp">Designed · §3.5 complete</span>
          </div>
          <p style={{ marginTop: 8 }}>
            Single standing stance, <strong>three-surface console</strong>:
            <strong> Vorhaltrechner M-7</strong> (left) — 6 input dials, 4-target slot switcher,
            salvo configurator, PULL SOLUTION + manual-entry dual path.
            <strong> Plotting table</strong> (centre) — Torpedo-specific plot with the iconic
            <strong> Plotting Aid</strong> 3-position switch (Auto / Standard / Manual) — set it to
            <em> Manual</em> to see the hardcore-tier paper-plot mode.
            <strong> Tube status + Bold-VII + Sieglinde</strong> (right) — 8-tube roster, decoy
            inventory + signature selector, and the towed-decoy state machine with 6-kn speed cap.
            Below the Vorhaltrechner: two wire-guidance CRT consoles (A active on a Lerche shot).
            Headline cross-station moment: the <em>Lauschangriff</em> verbal cascade is captured
            mid-plot.
          </p>
          <div style={{ marginTop: 16 }}>
            <TorpedoStation style={stationStyle}/>
          </div>
        </div>
      )}

      <Expand title="All five stations at a glance" defaultOpen={false}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          {window.STATIONS.map((s) => (
            <StationSchematic key={s.id} {...s} deferred={false}/>
          ))}
        </div>
      </Expand>
    </div>
  );
}

/* ---------- 08 Comms ---------- */
function CommsSection() {
  const [hi, setHi] = useState(null);
  const [phase, setPhase] = useState(null);
  return (
    <div className="section-body">
      <p>
        <strong>The pillar:</strong> every cross-station data exchange has a verbal component. At
        minimum one end of the exchange must be a human voice — buttons exist as formal backup, never
        as a fully-silent path. Two templates govern every flow.
      </p>

      <div className="grid-2">
        <div className="card" style={{ borderColor: "var(--accent)" }}>
          <div className="card-sub" style={{ color: "var(--accent)" }}>TEMPLATE A — verbal request, push reply allowed</div>
          <div className="card-title">"Sonar, Torpedo. Bearing on lead freighter."</div>
          <p style={{ fontSize: 13, color: "var(--ink-muted)", margin: "8px 0 0" }}>
            Sonar may answer in voice, OR press <strong>Send Fix</strong> to push bearing/range
            directly into Torpedo's Vorhaltrechner. Use for frequent, data-heavy exchanges.
          </p>
        </div>
        <div className="card" style={{ borderColor: "var(--blueprint)" }}>
          <div className="card-sub" style={{ color: "var(--blueprint)" }}>TEMPLATE B — voice-only reply, no push</div>
          <div className="card-title">"Engineer, status." — "Kaleun, battery thirty percent…"</div>
          <p style={{ fontSize: 13, color: "var(--ink-muted)", margin: "8px 0 0" }}>
            No data-push button exists on the responder side. Use for urgent, dramatic, or
            low-frequency exchanges where the human voice is the experience. ~65% of all flows.
          </p>
        </div>
      </div>

      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <h2 style={{ margin: 0 }}>The mesh — 12 NCO↔NCO pairs, all live</h2>
          <div className="phase-pills">
            <button onClick={() => setPhase(null)} className={`phase-pill ${!phase ? "active" : ""}`}>
              <span className="dot" style={{ background: "var(--ink)" }}></span>All
            </button>
            {window.PHASES.map((p) => (
              <button key={p.id}
                      onClick={() => setPhase(phase === p.id ? null : p.id)}
                      className={`phase-pill ${p.id} ${phase === p.id ? "active" : ""}`}>
                <span className="dot"></span>{p.short}
              </button>
            ))}
          </div>
        </div>
        <div className="mono" style={{ fontSize: 10, color: "var(--ink-muted)", marginBottom: 6, letterSpacing: "0.14em", textTransform: "uppercase" }}>
          Hover edges & nodes · solid line = voice-only · dashed = push allowed · pulsing dot = urgent
        </div>
        <CommsMesh activePhase={phase} highlightStation={hi} setHighlightStation={setHi}/>
      </div>

      <Expand title="Single-player AI behaviour" defaultOpen={false}>
        <p>
          In single-player, AI NPC NCOs use both paths simultaneously: they send data via the push
          channel (instant) AND play a voice line over intercom (atmospheric). The push keeps gameplay
          snappy; the voice keeps the Das-Boot fiction intact.
        </p>
      </Expand>

      <Expand title="The urgent verbal — 'Ortung!'">
        <div className="callout">
          "Kaleun, Sonar — Ortung! Bearing two-seven-zero!"
          <cite>— FuMB-7 detects an Allied aircraft radar shift from search to track</cite>
        </div>
        <p style={{ marginTop: 10 }}>
          The highest-priority interrupt in the system. Triggers the dive klaxon. In multiplayer, the
          Sonar player is load-bearing for Captain safety — periscope discipline has no HUD safety net.
          Cooperative tension by design.
        </p>
      </Expand>
    </div>
  );
}

/* ---------- 09 Crew ---------- */
function CrewSection() {
  return (
    <div className="section-body">
      <p>
        The Atlantik carries 57 men, in three watch sections of four hours on, eight off. Modified to
        battle stations on contact. Each NCO station owns 2–4 hands at any moment under standard watch;
        battle stations roughly doubles that. The thin-station problem is solved proactively by turning
        idle crew into a managed resource.
      </p>

      <div className="grid-2">
        <div className="card">
          <div className="card-sub">Named key men</div>
          <p style={{ margin: 0, fontSize: 13.5 }}>
            1–2 per station. Portrait, name, specialty, voice. <em>Funkmaat Bauer</em> is Sonar's
            senior Horcher. <em>Obermaschinist Krüger</em> is Torpedo's senior loader. Loss of a named
            man is felt; he doubles as the voice of his station in intercom callouts.
          </p>
        </div>
        <div className="card">
          <div className="card-sub">Generic pool</div>
          <p style={{ margin: 0, fontSize: 13.5 }}>
            Counted, not named individually. Each has competency in <strong>four specialty
            domains</strong> — Sonar, Engine, Torpedo, Nav — on a 1–10 scale (displayed as Novice /
            Trained / Veteran / Ace pips).
          </p>
        </div>
      </div>

      <div>
        <h2>Pool sizes — station-tailored, Battle-Stations-modulated</h2>
        <div style={{ marginTop: 12, background: "var(--bg-warm)", border: "1px solid var(--rule-strong)" }}>
          <table className="attr-table" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Station</th>
                <th>Standard Watch</th>
                <th>Battle Stations</th>
              </tr>
            </thead>
            <tbody>
              {window.CREW_STATIONS_POOLS.map((p) => (
                <tr key={p.station}>
                  <td>{p.station}</td>
                  <td>{p.watch}</td>
                  <td style={{ color: "var(--accent)" }}>{p.battle}</td>
                </tr>
              ))}
              <tr style={{ background: "var(--bg-deep)" }}>
                <td style={{ fontWeight: 700 }}>Total bridge crew on duty</td>
                <td style={{ fontWeight: 700 }}>11</td>
                <td style={{ fontWeight: 700, color: "var(--accent)" }}>19</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: 13, color: "var(--ink-muted)", marginTop: 8 }}>
          Atlantik values shown. Other variants will have different pool tables (deferred — Q-new-C).
        </p>
      </div>

      <Expand title="Cross-task efficiency — the dispatch tax" defaultOpen={true}>
        <p>
          Crew dispatched out of specialty work at the rate of their stat in the <em>task's</em> domain,
          not their primary. A Sonar hand (Sonar 7) sent to load torpedoes (Torpedo 1) loads at
          Torpedo-1 rate — <strong>2–3× slower, more error-prone, may produce misloads or partial
          fixes</strong>. The captain trades fast turnover for risk every time he reassigns out of
          domain.
        </p>
      </Expand>

      <Expand title="Card events — what crew actually do">
        <div className="grid-2">
          {[
            ["Engineer", "Patch flood compartment · electrical fire · battery cell short · pump overhaul · trim adjust"],
            ["Torpedo", "Reload tube · Bold-VII reload · Sieglinde recovery · safety inspection · wire-spool rewind"],
            ["Sonar", "Calibrate GHG · log contact in Geräuschbuch · clean intercom relay"],
            ["Navigator", "Encode outbound burst · decode incoming wolf-pack signal · update plot from sun fix · Sonne calibration"],
          ].map(([s, c]) => (
            <div key={s} className="card">
              <div className="card-sub">{s}</div>
              <p style={{ margin: 0, fontSize: 13 }}>{c}</p>
            </div>
          ))}
        </div>
        <p style={{ marginTop: 12 }}>
          Each event consumes <code>crew × time</code>. NCO raises hand when pool is overwhelmed →
          Captain reviews donor candidates → drag-and-drop reassignment. Crew auto-return to primary
          when task completes.
        </p>
      </Expand>

      <Expand title="Authority model — hybrid task-class routing">
        <p>
          Card events carry a <code>routine</code> vs <code>command</code> flag. <strong>Routine</strong>
          {" "}(tube reload, calibrate GHG, Bold reload) is peer-to-peer verbal between NCOs. Captain
          sees an audit log entry only. <strong>Command</strong> (cross-specialty surges, depth-charge
          damage-control, Lauschangriff Sonar→Torpedo, anything during Attack) requires Captain
          authority — dispatched from the tactical board.
        </p>
        <p>
          Preserves the Kaleun on dramatic decisions without making him the routing target for routine
          reloads. Matches real U-boat doctrine: informal compartment-to-compartment loans were the
          default, formal orders the exception.
        </p>
      </Expand>
    </div>
  );
}

/* ---------- 10 Tone ---------- */
function ToneSection() {
  return (
    <div className="section-body">
      <p>
        Five anchors govern every visual, audio, and copy decision. They are the most-protected part
        of the design — every system gets evaluated against them before it ships.
      </p>
      <div className="grid-2">
        {window.TONE_ANCHORS.map((t, i) => (
          <div key={i} className="card" style={{ borderColor: i === 2 ? "var(--accent)" : undefined }}>
            <div className="card-sub" style={{ color: i === 2 ? "var(--accent)" : undefined }}>0{i+1}</div>
            <div className="card-title">{t.head}</div>
            <p style={{ margin: 0, fontSize: 13.5, color: "var(--ink-muted)" }}>{t.body}</p>
          </div>
        ))}
      </div>

      <Expand title="The voice strategy" defaultOpen={true}>
        <p>
          Synthesised voices (modern neural TTS), English narrative with German accent and German
          tactical jargon. Coverage is <strong>dramatic moments + key callouts</strong>, not
          exhaustive ambient. Critical safety-net lines (~50–100) plus dramatic set-pieces (~200–400)
          with per-character voice profiles. Generic pool uses default voice variants.
        </p>
        <div className="callout" style={{ marginTop: 12 }}>
          "Aal läuft — eel running!"
          <cite>— mixed English/German pattern, jargon in source language, glossed in line</cite>
        </div>
      </Expand>

      <Expand title="Sound bed — five looped layers">
        <ul>
          <li><strong>L1 — Hull creak.</strong> Depth-modulated. Tightens audibly as you go deep.</li>
          <li><strong>L2 — Intercom static.</strong> Volume-modulated by recent voice activity.</li>
          <li><strong>L3 — Distant compartment noise.</strong> Template-B audible across compartments.</li>
          <li><strong>L4 — Lamp filament hum.</strong> Cruise phase only.</li>
          <li><strong>L5 — Condensation drip.</strong> Cruise plus Evade.</li>
        </ul>
      </Expand>

      <Expand title="Lighting model — Captain compartment">
        <ul>
          <li>Single pendant lamp over plotting table (warm tungsten ~2700K).</li>
          <li>Dim red overhead during Battle Stations and night surface (red-light discipline).</li>
          <li>Magic-eye sonar repeater on forward bulkhead — faint green glow.</li>
          <li>Periscope nacelle under-lit when raised; cooler/dimmer when lowered.</li>
          <li>Lamp swings synchronously with hull-groan during Evade.</li>
        </ul>
      </Expand>
    </div>
  );
}

/* ---------- 11 Open Questions ---------- */
function OpenSection() {
  return (
    <div className="section-body">
      <p>
        Living design document — questions deliberately deferred, each parked for a specific upcoming
        deep-dive. Captain (§3.1) is complete; Sonar, Navigator, Engineer, Torpedo deep-dives are next.
      </p>
      <div className="grid-2">
        {window.OPEN_QUESTIONS.map((q) => (
          <div key={q.tag} className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span className="mono" style={{ fontSize: 11, letterSpacing: "0.18em", color: "var(--accent)" }}>
                {q.tag}
              </span>
              <span className="chip" style={{ color: "var(--accent)", borderColor: "var(--accent)" }}>{q.state}</span>
            </div>
            <div className="card-title" style={{ fontSize: 18 }}>{q.title}</div>
            <p style={{ margin: "6px 0 0", fontSize: 13, color: "var(--ink-muted)" }}>{q.body}</p>
          </div>
        ))}
      </div>

      <Expand title="Resolved so far (all five station deep-dives complete)" defaultOpen={false}>
        <div className="grid-2">
          <div>
            <div className="mono" style={{ fontSize: 10, letterSpacing: "0.18em", color: "var(--accent)", marginBottom: 8 }}>CAPTAIN — §3.1</div>
            <ul>
              <li><strong>Q1 — Authority.</strong> Hybrid task-class routing.</li>
              <li><strong>Q2 — Pool size.</strong> Station-tailored, BS-modulated.</li>
              <li><strong>Q3 — Stat scale.</strong> Tier-displayed, numeric-stored, 4 domains.</li>
              <li><strong>Q4 — Fatigue & morale.</strong> Per-body fatigue + station morale.</li>
              <li><strong>Q5 — Dispatch UX.</strong> Drag-and-drop pip with verbal echo.</li>
              <li><strong>Q6 — Voice.</strong> TTS, English w/ German accent, German jargon.</li>
            </ul>
            <div className="mono" style={{ fontSize: 10, letterSpacing: "0.18em", color: "var(--accent)", marginBottom: 8, marginTop: 18 }}>SONAR — §3.2</div>
            <ul>
              <li><strong>Q7 — Contact list.</strong> Two-tier hybrid (B initial / A refinement).</li>
              <li><strong>Q8 — Geräuschbuch quiz.</strong> Opt-in Übung drill mode. No scoring.</li>
            </ul>
          </div>
          <div>
            <div className="mono" style={{ fontSize: 10, letterSpacing: "0.18em", color: "var(--accent)", marginBottom: 8 }}>NAVIGATOR — §3.3</div>
            <ul>
              <li><strong>Q-new-A — Cypher.</strong> Rotor + test-phrase + auto-decode with morale tax.</li>
              <li><strong>Q-new-G — UHF panel.</strong> Navigator routine; Captain handset for C2C.</li>
            </ul>
            <div className="mono" style={{ fontSize: 10, letterSpacing: "0.18em", color: "var(--accent)", marginBottom: 8, marginTop: 18 }}>ENGINEER — §3.4</div>
            <ul>
              <li><strong>Q-new-D — Morale events.</strong> ~30-event catalog, scoped propagation, slow recovery toward 0.5 baseline.</li>
            </ul>
            <div className="mono" style={{ fontSize: 10, letterSpacing: "0.18em", color: "var(--accent)", marginBottom: 8, marginTop: 18 }}>TORPEDO — §3.5</div>
            <ul>
              <li><strong>3-tier difficulty.</strong> Plotting-Aid switch Auto / Standard / Manual gates data visibility per attack.</li>
              <li><strong>Physical-plot integration.</strong> Hardcore tier uses a printable plotting kit on the player's actual desk.</li>
              <li><em>No net-new open questions surfaced — final station.</em></li>
            </ul>
          </div>
        </div>
      </Expand>
    </div>
  );
}

/* ---------- Map section.id → component ---------- */
window.SECTION_COMPONENTS = {
  premise:  PremiseSection,
  timeline: TimelineSection,
  variants: VariantsSection,
  tech:     TechSection,
  phases:   PhasesSection,
  stations: StationsSection,
  comms:    CommsSection,
  crew:     CrewSection,
  tone:     ToneSection,
  open:     OpenSection,
  identity: (props) => <window.IdentitySection {...props}/>,
};
