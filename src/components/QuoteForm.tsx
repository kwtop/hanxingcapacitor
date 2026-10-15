import { useState, type ChangeEvent, type SyntheticEvent } from 'react';
type Spec = { series:string; function:string; capacitance:string; voltage:string; dimensions:string; terminals:string; notes:string };
const blank = ():Spec => ({ series:'', function:'', capacitance:'', voltage:'', dimensions:'', terminals:'', notes:'' });
const seriesOptions = ['','CBB60','CBB61','CBB65','CD60','Not sure','Other'];
const applicationOptions = ['','HVAC / Refrigeration','Pump / Water Systems','Fan / Ventilation','Appliance / Small Motor','Other'];
export default function QuoteForm() {
  const query = new URLSearchParams(typeof window==='undefined'?'':window.location.search);
  const initialSeries=seriesOptions.includes(query.get('series')||'') ? query.get('series')||'' : '';
  const applicationMap:Record<string,string>={hvac:'HVAC / Refrigeration',pump:'Pump / Water Systems',fan:'Fan / Ventilation','hvac-and-refrigeration':'HVAC / Refrigeration','pumps-and-water-systems':'Pump / Water Systems','fans-and-ventilation':'Fan / Ventilation','appliances-and-small-motors':'Appliance / Small Motor'};
  const [specs,setSpecs]=useState<Spec[]>([{...blank(),series:initialSeries}]);
  const [files,setFiles]=useState<File[]>([]);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');
  const [application,setApplication]=useState(applicationMap[query.get('application')||'']||'');
  const setSpec=(index:number,key:keyof Spec,value:string)=>setSpecs(old=>old.map((item,i)=>i===index?{...item,[key]:value}:item));
  const onFiles=(event:ChangeEvent<HTMLInputElement>)=>{const next=Array.from(event.target.files||[]);setFiles(next);setError(next.length>4||next.some(file=>file.size>5*1024*1024)?'Attach up to four files, no more than 5 MB each.':'');};
  async function submit(event:SyntheticEvent<HTMLFormElement>) {
    event.preventDefault(); setError('');
    if(files.length>4||files.some(file=>file.size>5*1024*1024)){setError('Attach up to four files, no more than 5 MB each.');return;}
    const form=new FormData(event.currentTarget); form.set('specifications',JSON.stringify(specs)); form.set('application',application);
    files.forEach(file=>form.append('attachments',file));
    setBusy(true);
    try{const response=await fetch('/api/inquiries/',{method:'POST',body:form});const result=await response.json();if(!response.ok)throw new Error(result.id?`${result.error} Reference: ${result.id}`:result.error||'Unable to submit inquiry.');sessionStorage.setItem('hanxing-inquiry-result',JSON.stringify(result));window.location.assign('/thank-you/');}
    catch(cause){setError(cause instanceof Error?cause.message:'Unable to submit inquiry.');setBusy(false);}
  }
  return <form className="quote-form" onSubmit={submit} encType="multipart/form-data">
    <input className="visually-hidden" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
    <input type="hidden" name="context" value={initialSeries||query.get('application')||''} />
    <div className="form-section">
      <h2>Contact details</h2>
      <div className="form-grid">
        <label className="field">Full name *<input name="name" required maxLength={120} autoComplete="name" /></label>
        <label className="field">Work email *<input name="email" type="email" required maxLength={200} autoComplete="email" /></label>
        <label className="field">Company *<input name="company" required maxLength={160} autoComplete="organization" /></label>
        <label className="field">Country / region *<input name="country" required maxLength={100} autoComplete="country-name" /></label>
      </div>
    </div>
    <div className="form-section">
      <h2>Capacitor requirements</h2>
      {specs.map((spec,index)=><div className="spec-block" key={index}>
        <h3>Item {index+1}</h3>
        <div className="form-grid">
          <label className="field full">Series<select value={spec.series} onChange={e=>setSpec(index,'series',e.target.value)}>{seriesOptions.map(option=><option key={option} value={option}>{option||'Choose a series / unsure'}</option>)}</select></label>
          <label className="field">Capacitance (µF)<input value={spec.capacitance} maxLength={200} placeholder="e.g. 35 or 35+5" onChange={e=>setSpec(index,'capacitance',e.target.value)} /></label>
          <label className="field">Rated voltage (VAC)<input value={spec.voltage} maxLength={200} placeholder="e.g. 450" onChange={e=>setSpec(index,'voltage',e.target.value)} /></label>
          <label className="field full">Model or part description<input value={spec.notes} maxLength={200} placeholder="If the series or rating is unknown" onChange={e=>setSpec(index,'notes',e.target.value)} /></label>
        </div>
        <details className="form-optional"><summary>Add connection and mounting details <span>Optional</span></summary><div className="form-grid">
          <label className="field">Circuit function<select value={spec.function} onChange={e=>setSpec(index,'function',e.target.value)}><option value="">Unknown</option><option>Run</option><option>Start</option><option>Dual-run</option></select></label>
          <label className="field">Dimensions / mounting<input value={spec.dimensions} maxLength={200} onChange={e=>setSpec(index,'dimensions',e.target.value)} /></label>
          <label className="field full">Leads / terminals<input value={spec.terminals} maxLength={200} onChange={e=>setSpec(index,'terminals',e.target.value)} /></label>
        </div></details>
        {specs.length>1&&<button className="button text" type="button" onClick={()=>setSpecs(old=>old.filter((_,i)=>i!==index))}>Remove item</button>}
      </div>)}
      {specs.length<5&&<button className="button secondary" type="button" onClick={()=>setSpecs(old=>[...old,blank()])}>+ Add another item</button>}
    </div>
    <div className="form-section">
      <h2>Order details</h2>
      <div className="form-grid">
        <label className="field full">Estimated quantity<input name="quantity" maxLength={80} placeholder="Sample, first order or annual forecast" /></label>
        <label className="field full">Equipment and order requirements *<textarea name="message" required maxLength={4000} placeholder="Describe the equipment and intended use, with the order timing you need" /></label>
        <div className="field full"><label className="upload-control"><input type="file" aria-label="Attach reference files" accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp" multiple onChange={onFiles} /><span>Attach photos or a drawing</span><small>PDF, JPG, PNG or WebP · up to 4 files, 5 MB each</small></label><ul className="selected-files" aria-live="polite">{files.map((file,index)=><li key={index}>{file.name}</li>)}</ul></div>
      </div>
      <details className="form-optional"><summary>Additional project details <span>Optional</span></summary><div className="form-grid">
        <label className="field">Application<select value={application} onChange={e=>setApplication(e.target.value)}>{applicationOptions.map(option=><option key={option} value={option}>{option||'Choose an application / unsure'}</option>)}</select></label>
        <label className="field">Destination market<input name="destination" maxLength={120} /></label>
        <label className="field">Phone / WhatsApp<input name="phone" maxLength={80} autoComplete="tel" /></label>
        <label className="field">Required documents<input name="documents" maxLength={500} placeholder="Drawing, datasheet or certificate" /></label>
      </div></details>
    </div>
    <div className="form-section"><p className="small">By submitting this form, you agree to the use of your information to review and respond to the inquiry. See our <a href="/privacy-policy/" style={{textDecoration:'underline'}}>privacy notice</a>.</p>{error&&<p role="alert" className="form-error">{error}</p>}<button className="button" type="submit" disabled={busy}>{busy?'Submitting...':'Submit inquiry'}</button></div>
  </form>;
}
