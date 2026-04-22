/** @jsx React.createElement */
/* Compare page */

function Compare({ preselect }) {
  const [a, setA] = React.useState(preselect || 'ams');
  const [b, setB] = React.useState('lis');
  const cA = CITIES.find(c => c.id === a);
  const cB = CITIES.find(c => c.id === b);
  const rows = [
    { label:'Safety index',   key:'safety', unit:'',   higher:true  },
    { label:'Median salary',  key:'salary', unit:'k',  prefix:'€', higher:true  },
    { label:'Cost of living', key:'col',    unit:'',   higher:false },
    { label:'Sunny days/yr',  key:'sun',    unit:'',   higher:true  },
  ];
  return (
    <>
      <PageHead
        eyebrow="Side-by-side · dispassionate"
        title="Compare, <em>one number at a time.</em>"
        lede="Pick two cities. See them judged across the dimensions that actually decide a relocation — no bars, no badges, just the numbers."
      />
      <div className="compare-wrap">
        <div className="compare-pickers">
          <div>
            <label className="field-label">First city</label>
            <select className="select" value={a} onChange={e => setA(e.target.value)}>
              {CITIES.map(c => <option key={c.id} value={c.id}>{c.name}, {c.country}</option>)}
            </select>
          </div>
          <div>
            <label className="field-label">Second city</label>
            <select className="select" value={b} onChange={e => setB(e.target.value)}>
              {CITIES.map(c => <option key={c.id} value={c.id}>{c.name}, {c.country}</option>)}
            </select>
          </div>
        </div>
        <div className="compare-heads">
          <div>
            <div className="compare-head-name">{cA.name}</div>
            <div className="compare-head-sub">{cA.country}</div>
          </div>
          <div className="compare-vs">versus</div>
          <div>
            <div className="compare-head-name">{cB.name}</div>
            <div className="compare-head-sub">{cB.country}</div>
          </div>
        </div>
        {rows.map(r => {
          const vA = cA[r.key], vB = cB[r.key];
          const winA = r.higher ? vA > vB : vA < vB;
          const winB = r.higher ? vB > vA : vB < vA;
          const diff = Math.abs(vA - vB);
          return (
            <div key={r.key} className="compare-row">
              <div className={"compare-side" + (winA ? " win" : "")}>
                <div className="compare-val">{r.prefix||''}{vA}{r.unit}</div>
                {winA && <div className="compare-better"><Icon.Check/> Better</div>}
              </div>
              <div className="compare-mid">
                <div className="compare-mid-lbl">{r.label}</div>
                <div className="compare-mid-sub">Δ {r.prefix||''}{diff}{r.unit}</div>
              </div>
              <div className={"compare-side" + (winB ? " win" : "")}>
                <div className="compare-val">{r.prefix||''}{vB}{r.unit}</div>
                {winB && <div className="compare-better"><Icon.Check/> Better</div>}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

Object.assign(window, { Compare });
