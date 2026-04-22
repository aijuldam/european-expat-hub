/** @jsx React.createElement */
/* Settle-down Guides page */

const GUIDES = [
  { tag:'Housing',    t:'Rent your first flat',         d:'What to expect on deposits, agency fees, registration, and common clauses country by country.' },
  { tag:'Banking',    t:'Open a bank account',          d:'Digital-first banks vs local branches, ID requirements, and when salary accounts are mandatory.' },
  { tag:'Admin',      t:'Register as a resident',       d:'BSN, NIF, Anmeldung — how the paperwork actually works and how long each piece takes.' },
  { tag:'Family',     t:'International schools 101',    d:'School years, IB vs national curricula, realistic waitlists, and when to apply.' },
  { tag:'Healthcare', t:'Health insurance basics',      d:'Who pays what, when cover starts, getting added as a dependent, and private top-ups.' },
  { tag:'Tax',        t:'Your first tax year',          d:'Filing windows, double-taxation treaties, and the specific forms you will actually see.' },
];

function Guides() {
  return (
    <>
      <PageHead
        eyebrow="Practical field notes · updated quarterly"
        title="Settle down, <em>properly.</em>"
        lede="The six things that make or break the first six months. Read in any order — each guide stands alone."
      />
      <div className="guides-wrap">
        <div className="guides-grid">
          {GUIDES.map(g => (
            <div key={g.t} className="guide-card">
              <div className="guide-tag">{g.tag}</div>
              <h3>{g.t}</h3>
              <p>{g.d}</p>
              <div className="guide-read">Read guide <span className="rule"/></div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

Object.assign(window, { Guides });
