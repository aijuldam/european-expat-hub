/** @jsx React.createElement */
/* Salary Calculator page */

function SalaryCalc() {
  const [country, setCountry] = React.useState('NL');
  const [gross, setGross] = React.useState(65000);
  const [ruling, setRuling] = React.useState(true);
  const rates = { NL: ruling ? 0.78 : 0.66, FR: 0.72, DE: 0.62, HU: 0.67 };
  const names = { NL:'Netherlands', FR:'France', DE:'Germany', HU:'Hungary' };
  const rate = rates[country];
  const net = Math.round(gross * rate);
  const tax = gross - net;
  return (
    <>
      <PageHead
        eyebrow="Gross to net · 2026 parameters"
        title="What you'll <em>actually</em> take home."
        lede="Current tax tables for the Netherlands, France, Germany, and Hungary. Indicative — the figure your employer wires, before line-level adjustments."
      />
      <div className="calc-wrap">
        <div className="calc-panel">
          <span className="eyebrow">Your inputs</span>
          <h3>Where &amp; how much</h3>
          <div style={{height: 24}}/>
          <div className="calc-field">
            <label className="field-label">Country</label>
            <select className="select" value={country} onChange={e => setCountry(e.target.value)}>
              <option value="NL">Netherlands</option>
              <option value="FR">France</option>
              <option value="DE">Germany</option>
              <option value="HU">Hungary</option>
            </select>
          </div>
          <div className="calc-field">
            <label className="field-label">Annual gross (€)</label>
            <input className="calc-input" type="number" value={gross}
                   onChange={e => setGross(+e.target.value || 0)}/>
          </div>
          {country === 'NL' && (
            <label className="calc-check">
              <input type="checkbox" checked={ruling} onChange={e => setRuling(e.target.checked)}/>
              Apply the 30% ruling
            </label>
          )}
        </div>
        <div className="calc-panel out">
          <span className="eyebrow">Estimated net · {names[country]}</span>
          <div className="calc-out-big">Annual take-home</div>
          <div className="calc-out-val">€{net.toLocaleString()}</div>
          <div className="calc-out-sub">{(rate*100).toFixed(1)}% kept · €{Math.round(net/12).toLocaleString()}/mo</div>
          <div className="calc-breakdown">
            <div className="calc-breakdown-row"><span>Gross</span><span>€{gross.toLocaleString()}</span></div>
            <div className="calc-breakdown-row"><span>Income tax &amp; contributions</span><span>−€{tax.toLocaleString()}</span></div>
            <div className="calc-breakdown-row total"><span>Net</span><span>€{net.toLocaleString()}</span></div>
          </div>
        </div>
      </div>
    </>
  );
}

Object.assign(window, { SalaryCalc });
