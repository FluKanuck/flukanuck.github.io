/* ============================================================
   App shell — masthead, hub, section-view, tweaks
   ============================================================ */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "amber",
  "layout": "hub",
  "stationStyle": "diegetic"
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [view, setView] = useState("hub"); // "hub" | section.id
  const [subRoute, setSubRoute] = useState(null);
  const [sectionAnim, setSectionAnim] = useState(0);

  useEffect(() => {
    document.documentElement.setAttribute("data-palette", tweaks.palette);
    document.documentElement.setAttribute("data-layout", tweaks.layout);
    document.body.className = `layout-${tweaks.layout}`;
  }, [tweaks.palette, tweaks.layout]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setSectionAnim((n) => n + 1);
  }, [view]);

  const goToSection = (id, sub = null) => {
    setView(id);
    setSubRoute(sub);
  };
  const goHome = () => { setView("hub"); setSubRoute(null); };

  return (
    <>
      <div className="app-root" data-screen-label={view === "hub" ? "Hub" : view}>
        <Masthead view={view} goHome={goHome}/>
        {tweaks.layout === "hub" && view === "hub" && (
          <HubView onPick={goToSection}/>
        )}
        {tweaks.layout === "hub" && view !== "hub" && (
          <SectionView key={sectionAnim + (subRoute || "")} id={view}
                       goHome={goHome} goToSection={goToSection}
                       subRoute={subRoute} stationStyle={tweaks.stationStyle}/>
        )}
        {tweaks.layout === "sidebar" && (
          <SidebarLayout view={view} setView={(id) => goToSection(id, null)}
                         subRoute={subRoute} stationStyle={tweaks.stationStyle}/>
        )}
        {tweaks.layout === "scroll" && (
          <ScrollLayout stationStyle={tweaks.stationStyle}/>
        )}
      </div>

      <TweaksPanel title="Walkthrough Tweaks">
        <TweakSection label="Visual palette"/>
        <TweakRadio
          label="Palette"
          value={tweaks.palette}
          onChange={(v) => setTweak("palette", v)}
          options={[
            { value: "paper", label: "Paper" },
            { value: "slate", label: "Slate" },
            { value: "amber", label: "Amber" },
          ]}
        />

        <TweakSection label="Walkthrough layout"/>
        <TweakRadio
          label="Layout"
          value={tweaks.layout}
          onChange={(v) => setTweak("layout", v)}
          options={[
            { value: "hub", label: "Hub" },
            { value: "sidebar", label: "Sidebar" },
            { value: "scroll", label: "Scroll" },
          ]}
        />

        <TweakSection label="Captain station"/>
        <TweakRadio
          label="Style"
          value={tweaks.stationStyle}
          onChange={(v) => setTweak("stationStyle", v)}
          options={[
            { value: "diegetic", label: "Diegetic" },
            { value: "clean",    label: "UI-clean" },
          ]}
        />
      </TweaksPanel>
    </>
  );
}

/* ----------------- Masthead ----------------- */
function Masthead({ view, goHome }) {
  return (
    <header className="masthead">
      <div className="masthead-title">
        <div className="crest">Kaiserliche Marine · U-Boots-Waffe</div>
        <div className="display-xl" style={{ cursor: view === "hub" ? "default" : "pointer" }}
             onClick={view === "hub" ? undefined : goHome}>
          Hunter Hunted: <em>Iron Tide</em>
        </div>
        <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 11, color: "var(--ink-muted)", letterSpacing: "0.18em", textTransform: "uppercase" }}>
          Project Walkthrough · Stakeholder edition
        </div>
      </div>
      <div className="masthead-meta">
        <div className="doc-no">DOC.{view === "hub" ? "00" : window.SECTIONS.find(s => s.id === view)?.num ?? "00"}</div>
        <div>Rev. 2026-05-19 · v0.1</div>
        <div style={{ color: "var(--accent)" }}>● Living draft</div>
      </div>
    </header>
  );
}

/* ----------------- Hub view ----------------- */
function HubView({ onPick }) {
  return (
    <div className="fade-in">
      <div className="hub-intro">
        <div className="lede">
          A five-player co-op submarine command sim set in 1955. Sixteen years into a war that never
          ended after the Gersdorff bomb succeeded. This index opens the eleven topics that define the
          project as it stands today — pick any folder.
        </div>
        <div className="side">
          <span className="stamp">For stakeholder review</span>
          <span className="stamp blue">Atlantik · Type XXI/M3</span>
          <span className="stamp muted">All 5 stations designed</span>
        </div>
      </div>

      <div className="hub-grid">
        {window.SECTIONS.map((s) => {
          const featured = s.id === "stations" || s.id === "variants" || s.id === "premise";
          const span = featured ? 6 : 4;
          return (
            <button key={s.id}
                    className={`dossier ${s.color === "accent" ? "accent" : s.color === "blue" ? "blue" : ""}`}
                    style={{ gridColumn: `span ${span}` }}
                    onClick={() => onPick(s.id)}>
              <div className="dossier-num">
                <span>FILE / {s.num}</span>
                <span>{s.color === "accent" ? "● PRIORITY" : s.color === "blue" ? "● TECHNICAL" : "● CONTEXT"}</span>
              </div>
              <h3 className="dossier-title">{s.title}</h3>
              <p className="dossier-tag">{s.tagline}</p>

              {s.links && s.links.length > 0 && (
                <div style={{
                  display: "flex", flexWrap: "wrap", gap: 4,
                  paddingTop: 4,
                }}>
                  {s.links.map((l) => (
                    <span key={l.id}
                          role="button"
                          tabIndex={0}
                          onClick={(e) => { e.stopPropagation(); onPick(s.id, l.id); }}
                          onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); onPick(s.id, l.id); } }}
                          className="hub-jump">
                      {l.label}
                    </span>
                  ))}
                </div>
              )}

              <div className="dossier-meta">
                <span>{s.classLine}</span>
              </div>
              <span className="dossier-arrow">→</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ----------------- Section detail view ----------------- */
function SectionView({ id, goHome, goToSection, subRoute, stationStyle }) {
  const s = window.SECTIONS.find((x) => x.id === id);
  const Component = window.SECTION_COMPONENTS[id];
  const idx = window.SECTIONS.findIndex((x) => x.id === id);
  const prev = window.SECTIONS[idx - 1];
  const next = window.SECTIONS[idx + 1];

  return (
    <div className="section-view fade-in">
      <aside className="section-aside">
        <button className="back-btn" onClick={goHome}>← Back to index</button>
        <div className="sec-num">FILE / {s.num}</div>
        <div className="rule"/>
        {s.links && s.links.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 8 }}>
            <div className="mono" style={{ fontSize: 9, letterSpacing: "0.2em", color: "var(--ink-muted)", marginBottom: 2, textTransform: "uppercase" }}>
              Jump
            </div>
            {s.links.map((l) => (
              <button key={l.id}
                      onClick={() => goToSection(id, l.id)}
                      className="back-btn"
                      style={{
                        textAlign: "left",
                        color: subRoute === l.id ? "var(--accent)" : "var(--ink-muted)",
                        textTransform: "none",
                        letterSpacing: 0,
                        fontFamily: "Cormorant Garamond, serif",
                        fontSize: 15,
                        fontStyle: "italic",
                        padding: "2px 0",
                      }}>
                {subRoute === l.id ? "● " : "· "}{l.label}
              </button>
            ))}
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 16 }}>
          {prev && (
            <button className="back-btn" onClick={() => goToSection(prev.id)}
                    style={{ textAlign: "left" }}>
              <span style={{ display: "block" }}>← Previous</span>
              <span style={{ color: "var(--ink)", fontFamily: "Cormorant Garamond, serif", fontSize: 18, textTransform: "none", letterSpacing: 0 }}>{prev.title}</span>
            </button>
          )}
          {next && (
            <button className="back-btn" onClick={() => goToSection(next.id)}
                    style={{ textAlign: "left" }}>
              <span style={{ display: "block" }}>Next →</span>
              <span style={{ color: "var(--ink)", fontFamily: "Cormorant Garamond, serif", fontSize: 18, textTransform: "none", letterSpacing: 0 }}>{next.title}</span>
            </button>
          )}
        </div>
      </aside>
      <main className="section-main">
        <header className="section-header">
          <span className="eyebrow">FILE · {s.num} · {s.classLine}</span>
          <h1>{s.title}</h1>
          <p className="standfirst">{s.tagline}</p>
        </header>
        <Component stationStyle={stationStyle} subRoute={subRoute}/>
      </main>
    </div>
  );
}

/* ----------------- Sidebar layout ----------------- */
function SidebarLayout({ view, setView, subRoute, stationStyle }) {
  const current = view === "hub" ? "premise" : view;
  const s = window.SECTIONS.find((x) => x.id === current);
  const Component = window.SECTION_COMPONENTS[current];
  return (
    <div className="section-view fade-in" style={{ gridTemplateColumns: "260px 1fr" }}>
      <aside className="sidebar-nav">
        <div className="mono" style={{ fontSize: 10, letterSpacing: "0.2em", color: "var(--ink-muted)", marginBottom: 10 }}>INDEX</div>
        {window.SECTIONS.map((sec) => (
          <button key={sec.id}
                  className={current === sec.id ? "active" : ""}
                  onClick={() => setView(sec.id)}>
            <span className="sec-no">{sec.num}</span>
            <span>{sec.title}</span>
          </button>
        ))}
      </aside>
      <main className="section-main">
        <header className="section-header">
          <span className="eyebrow">FILE · {s.num} · {s.classLine}</span>
          <h1>{s.title}</h1>
          <p className="standfirst">{s.tagline}</p>
        </header>
        <Component stationStyle={stationStyle} subRoute={subRoute}/>
      </main>
    </div>
  );
}

/* ----------------- Scroll layout ----------------- */
function ScrollLayout({ stationStyle }) {
  return (
    <div className="fade-in">
      {window.SECTIONS.map((s) => {
        const Component = window.SECTION_COMPONENTS[s.id];
        return (
          <section key={s.id} className="scroll-section" id={s.id}>
            <header className="section-header">
              <span className="eyebrow">FILE · {s.num} · {s.classLine}</span>
              <h1>{s.title}</h1>
              <p className="standfirst">{s.tagline}</p>
            </header>
            <Component stationStyle={stationStyle}/>
          </section>
        );
      })}
    </div>
  );
}

/* ----------------- Mount ----------------- */
ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
