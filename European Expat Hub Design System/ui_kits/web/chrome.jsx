/** @jsx React.createElement */
/* Shared chrome: TopNav, Footer, PageHead */

function TopNav({ view, setView }) {
  const items = [
    { key: 'home',    label: 'Where to move' },
    { key: 'quiz',    label: 'Take the quiz' },
    { key: 'calc',    label: 'Calculate salary' },
    { key: 'compare', label: 'Compare cities' },
    { key: 'guides',  label: 'Settle down' },
  ];
  return (
    <header className="topnav">
      <div className="topnav-inner">
        <a className="logo" onClick={() => setView('home')}>
          <img className="logo-mark" src="../../assets/logo-mark.svg" alt=""/>
          <span className="logo-word">Expatflix</span>
        </a>
        <nav className="nav-links">
          {items.map(it => (
            <a key={it.key}
               className={"nav-link" + (view === it.key ? " active" : "")}
               onClick={() => setView(it.key)}>
              {it.label}
            </a>
          ))}
        </nav>
        <div className="nav-cta">
          <button className="btn btn-primary btn-sm" onClick={() => setView('quiz')}>
            Start the quiz
          </button>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <h3>Expatflix</h3>
            <p>Relocation intelligence for expats moving within Europe. Calm, numerate, and honest — because the decision matters more than the brochure.</p>
          </div>
          <div className="footer-col">
            <h5>Product</h5>
            <a>Where to move</a>
            <a>Take the quiz</a>
            <a>Compare cities</a>
            <a>Salary calculator</a>
          </div>
          <div className="footer-col">
            <h5>Guides</h5>
            <a>Cost of living</a>
            <a>Settle down</a>
            <a>Schools &amp; family</a>
            <a>Methodology</a>
          </div>
          <div className="footer-col">
            <h5>Company</h5>
            <a>About</a>
            <a>Contact</a>
            <a>Press kit</a>
            <a>Privacy</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Expatflix</span>
          <span>Informational only. Not financial or legal advice.</span>
        </div>
      </div>
    </footer>
  );
}

function PageHead({ eyebrow, title, lede }) {
  return (
    <div className="page-head">
      <div className="page-head-inner">
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <h1 dangerouslySetInnerHTML={{ __html: title }}/>
        </div>
        <p>{lede}</p>
      </div>
    </div>
  );
}

Object.assign(window, { TopNav, Footer, PageHead });
