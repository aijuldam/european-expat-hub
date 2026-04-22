/** @jsx React.createElement */
/* Top-level App: composes everything */

function App() {
  const [view, setView] = React.useState('home');
  const [results, setResults] = React.useState(['ams','cop','vie']);
  const [compareSeed, setCompareSeed] = React.useState('ams');
  const openCompareFor = (id) => { setCompareSeed(id); setView('compare'); };

  React.useEffect(() => { window.scrollTo(0, 0); }, [view]);

  return (
    <>
      <TopNav view={view} setView={setView}/>
      <main>
        {view === 'home'    && <Home    setView={setView} openCompareFor={openCompareFor}/>}
        {view === 'quiz'    && <Quiz    setView={setView} setResults={setResults}/>}
        {view === 'results' && <Results setView={setView} results={results} openCompareFor={openCompareFor}/>}
        {view === 'compare' && <Compare preselect={compareSeed}/>}
        {view === 'calc'    && <SalaryCalc/>}
        {view === 'guides'  && <Guides/>}
      </main>
      <Footer/>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
