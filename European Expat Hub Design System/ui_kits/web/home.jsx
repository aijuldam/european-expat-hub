/** @jsx React.createElement */
/* Home page */

function Home({ setView, openCompareFor }) {
  const featured = CITIES.slice(0, 4);
  const indexItems = [
    { n:'01', t:'City Match Quiz',    p:'/quiz' },
    { n:'02', t:'Compare Cities',     p:'/compare' },
    { n:'03', t:'Salary Calculator',  p:'/calc' },
    { n:'04', t:'Settle-Down Guides', p:'/guides' },
  ];
  const pathMap = { '/quiz':'quiz', '/compare':'compare', '/calc':'calc', '/guides':'guides' };

  return (
    <>
      {/* --- Editorial matte hero --- */}
      <section className="hero">
        <div className="hero-inner">
          <div>
            <div className="hero-kicker">Issue № 04 · Spring 2026 · Relocation Intelligence</div>
            <h1>
              Find the European city that actually fits your <em>life</em>, family, and finances.
            </h1>
            <p className="hero-lede">
              A structured decision tool for the move that is too expensive to get wrong. Quiz, compare, calculate — grounded in current data on cost of living, salaries, taxes, and schools.
            </p>
            <div className="hero-ctas">
              <button className="btn btn-accent btn-lg" onClick={() => setView('quiz')}>
                <Icon.Compass/> Take the Quiz <Icon.Arrow/>
              </button>
              <button className="btn btn-outline-light btn-lg" onClick={() => setView('compare')}>
                Browse Countries
              </button>
            </div>
          </div>
          <aside>
            <div className="hero-index">
              <div className="hero-index-head"><span>Inside</span><span>Tools</span></div>
              {indexItems.map(it => (
                <div key={it.n} className="hero-index-row" onClick={() => setView(pathMap[it.p])}>
                  <span className="n">{it.n}</span>
                  <span className="t">{it.t}</span>
                  <span className="p">{it.p}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      {/* --- How it works --- */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div className="section-head-left">
              <span className="eyebrow"><span className="num">01</span>The method</span>
              <h2>Three steps, <em>no guesswork.</em></h2>
            </div>
            <div className="section-head-right">
              Expatflix combines quantitative city data with your personal weighting. No inspiration boards — just the numbers that decide where you'll actually be happy.
            </div>
          </div>
          <div className="how">
            {[
              { n:'Step one',   Ic: Icon.Compass, t:'Take the quiz',       d:'Ten questions about lifestyle, career stage, family, and climate. Takes four minutes.' },
              { n:'Step two',   Ic: Icon.Bar,     t:'Explore & compare',   d:'Browse profiles for 35+ cities. Put any two side-by-side across safety, salary, and cost of living.' },
              { n:'Step three', Ic: Icon.Calc,    t:'Plan financially',    d:'Gross-to-net for NL, FR, DE, HU with current tax parameters and the 30% ruling.' },
            ].map(s => (
              <div key={s.t} className="how-step">
                <div className="how-num">{s.n}</div>
                <s.Ic className="how-icon"/>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Featured cities --- */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <div className="section-head-left">
              <span className="eyebrow"><span className="num">02</span>Featured cities</span>
              <h2>Four to <em>start with.</em></h2>
            </div>
            <div className="section-head-right">
              A tasting of the catalogue. Click any city to open its profile or drop it into a comparison.
            </div>
          </div>
          <div className="city-grid">
            {featured.map((c, i) => (
              <div key={c.id} className="city-card" onClick={() => openCompareFor(c.id)}>
                <div className="city-num">No. 0{i+1}</div>
                <div className="city-country">{c.country}</div>
                <h3 className="city-name">{c.name}</h3>
                <p className="city-desc">{c.bestFor}</p>
                <div className="stats">
                  <div className="stat"><div className="stat-lbl">Safety</div><div className="stat-val">{c.safety}</div></div>
                  <div className="stat"><div className="stat-lbl">Sun/yr</div><div className="stat-val">{c.sun}</div></div>
                  <div className="stat"><div className="stat-lbl">CoL</div><div className="stat-val">{c.col}</div></div>
                  <div className="stat"><div className="stat-lbl">Median</div><div className="stat-val">€{c.salary}k</div></div>
                </div>
              </div>
            ))}
          </div>
          <div style={{marginTop: 48, textAlign:'center'}}>
            <button className="btn btn-ghost" onClick={() => openCompareFor('ams')}>
              See all 35 cities <span className="rule"/>
            </button>
          </div>
        </div>
      </section>

      {/* --- Countries as editorial index --- */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div className="section-head-left">
              <span className="eyebrow"><span className="num">03</span>Countries</span>
              <h2>Start with a <em>country,</em> then drill in.</h2>
            </div>
            <div className="section-head-right">
              Twelve countries profiled. Tax, housing, healthcare, and schooling frameworks — plus the cities within each.
            </div>
          </div>
          <div className="country-list">
            {COUNTRIES.map(c => (
              <div key={c.slug} className="country-row" onClick={() => openCompareFor('ams')}>
                <div className="flag">{c.flag}</div>
                <div className="name">{c.name}</div>
                <div className="summary">{c.summary}</div>
                <div className="count">{c.cities} cities</div>
                <div className="arrow"><Icon.Arrow width="18" height="18"/></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

Object.assign(window, { Home });
