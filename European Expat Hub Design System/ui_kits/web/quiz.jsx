/** @jsx React.createElement */
/* Quiz + Results pages */

function Quiz({ setView, setResults }) {
  const [step, setStep] = React.useState(0);
  const [answers, setAnswers] = React.useState({});
  const current = QUIZ[step];
  const selected = answers[step];
  const pct = ((step + 1) / QUIZ.length) * 100;

  return (
    <div className="quiz-wrap">
      <div className="quiz-progress">
        <span className="quiz-step">Q{String(step+1).padStart(2,'0')} / {String(QUIZ.length).padStart(2,'0')}</span>
        <div className="quiz-bar"><div className="quiz-bar-fill" style={{ width: pct + '%' }}/></div>
        <span className="quiz-step">{Math.round(pct)}%</span>
      </div>
      <h2 className="quiz-q" dangerouslySetInnerHTML={{ __html: current.q.replace(/(right now|preference|size|comfort)/, '<em>$1</em>') }}/>
      {current.sub && <p className="quiz-sub">{current.sub}</p>}
      <div className="quiz-options">
        {current.options.map((o, i) => (
          <button key={o}
                  className={"quiz-option" + (selected === i ? " selected" : "")}
                  onClick={() => setAnswers({ ...answers, [step]: i })}>
            <span className="n">{String.fromCharCode(65+i)}</span>
            <span className="t">{o}</span>
            <span className="dot"/>
          </button>
        ))}
      </div>
      <div className="quiz-actions">
        <button className="btn btn-ghost"
                onClick={() => step === 0 ? setView('home') : setStep(step - 1)}>
          <span className="rule"/> Back
        </button>
        <button className="btn btn-primary"
                disabled={selected == null}
                onClick={() => {
                  if (step === QUIZ.length - 1) { setResults(['ams','cop','vie']); setView('results'); }
                  else setStep(step + 1);
                }}>
          {step === QUIZ.length - 1 ? 'See results' : 'Continue'} <Icon.Arrow/>
        </button>
      </div>
    </div>
  );
}

function Results({ setView, results, openCompareFor }) {
  return (
    <>
      <PageHead
        eyebrow="Your matches · curated from 35 cities"
        title="Three cities, <em>weighed for you.</em>"
        lede="These are the European cities most likely to fit your answers on lifestyle, family, and finances. Open a profile or drop any into a comparison."
      />
      <div className="results-wrap">
        {results.map((id, idx) => {
          const c = CITIES.find(x => x.id === id);
          const match = 94 - idx * 6;
          return (
            <div key={id} className="result-card" onClick={() => openCompareFor(id)}>
              <div className="result-rank">{String(idx+1).padStart(2,'0')}</div>
              <div>
                <h3 className="result-city">{c.name}</h3>
                <p className="result-country">{c.country}</p>
              </div>
              <div className="result-stats">
                <div><div className="stat-lbl">Safety</div><div className="stat-val">{c.safety}</div></div>
                <div><div className="stat-lbl">Median</div><div className="stat-val">€{c.salary}k</div></div>
                <div><div className="stat-lbl">Sun/yr</div><div className="stat-val">{c.sun}</div></div>
              </div>
              <div className="result-match">{match}% match</div>
            </div>
          );
        })}
        <div className="result-actions">
          <button className="btn btn-outline" onClick={() => setView('quiz')}>Retake the quiz</button>
          <button className="btn btn-primary" onClick={() => setView('compare')}>
            Compare the top two <Icon.Arrow/>
          </button>
        </div>
      </div>
    </>
  );
}

Object.assign(window, { Quiz, Results });
