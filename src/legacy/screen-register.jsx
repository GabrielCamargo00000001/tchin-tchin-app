/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { Button, Card, Chip } from './components.jsx';
import { MOCK_WINES } from './data.jsx';
import { BottlePlaceholder, Icon, T } from './tokens.jsx';

// Tchin Tchin — Registrar consumo (2-step flow, B2C only)

function RegisterConsumoScreen({ go, ctx, setCtx }) {
  const [step, setStep] = React.useState(1);
  const [wine, setWine] = React.useState(null);
  const [manualMode, setManualMode] = React.useState(false);

  const onPickWine = (w) => { setWine(w); setStep(2); };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n50, overflow: 'hidden' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '8px 4px 8px 4px',
        background: T.c.n0, borderBottom: `1px solid ${T.c.n200}`,
      }}>
        <button onClick={() => {
          if (step === 2) { setStep(1); setWine(null); return; }
          if (manualMode) { setManualMode(false); return; }
          go('back');
        }} style={{
          width: 44, height: 44, background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}><Icon name="arrow_back" size={24} color={T.c.n950}/></button>
        <div style={{ ...T.t.h3, color: T.c.n950 }}>Registrar consumo</div>
        <div style={{ flex: 1 }}/>
        <div style={{
          ...T.t.caption, color: T.c.n600, fontFamily: 'JetBrains Mono, monospace',
          padding: '4px 10px', background: T.c.n100, borderRadius: T.r.full, marginRight: 12,
        }}>{step}/2</div>
      </div>
      <div style={{ flex: 1, overflow: 'auto' }}>
        {step === 1 && !manualMode && <Step1Pick onPick={onPickWine} onScan={() => go('scanner')} onManual={() => setManualMode(true)}/>}
        {step === 1 && manualMode && <ManualForm onSave={onPickWine} onCancel={() => setManualMode(false)}/>}
        {step === 2 && wine && <Step2Rate wine={wine} onSave={(entry) => {
          const isOffline = ctx.online === false;
          setCtx(c => ({ ...c, diary: [{ ...entry, wine, date: new Date().toISOString(), _pending: isOffline }, ...c.diary] }));
          go('toast', {
            variant: isOffline ? 'warning' : 'success',
            message: isOffline ? 'Salvo localmente. Sincroniza quando voltar online.' : '+10 pontos! Vinho salvo no seu diário.',
          });
          go('home');
        }}/>}
      </div>
    </div>
  );
}

function Step1Pick({ onPick, onScan, onManual }) {
  const [q, setQ] = React.useState('');
  const results = MOCK_WINES.filter(w => {
    if (!q.trim()) return false;
    const t = (w.name + ' ' + w.producer + ' ' + w.country).toLowerCase();
    return t.includes(q.toLowerCase());
  }).slice(0, 6);
  return (
    <div style={{ padding: 16 }}>
      <div style={{ ...T.t.h2, color: T.c.n950, marginBottom: 16 }}>Qual vinho você tomou?</div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px',
        background: T.c.n0, border: `1px solid ${T.c.n300}`, borderRadius: T.r.md,
        marginBottom: q ? 12 : 24,
      }}>
        <Icon name="search" size={20} color={T.c.n600}/>
        <input autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar vinho na base" style={{
          flex: 1, border: 'none', outline: 'none', background: 'transparent',
          fontFamily: T.font, fontSize: 15, color: T.c.n950,
        }}/>
        {q && <button onClick={() => setQ('')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0 }}><Icon name="close" size={18} color={T.c.n600}/></button>}
      </div>
      {q && (
        <div style={{ marginBottom: 24 }}>
          {results.length === 0 ? (
            <div style={{ ...T.t.body, color: T.c.n600, textAlign: 'center', padding: '24px 16px' }}>
              Nenhum vinho encontrado para "{q}".
              <div style={{ marginTop: 12 }}>
                <Button variant="secondary" size="md" onClick={onManual}>Cadastrar manualmente</Button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {results.map((w, i) => (
                <button key={i} onClick={() => onPick(w)} style={{
                  display: 'flex', gap: 12, padding: 10, background: T.c.n0,
                  border: `1px solid ${T.c.n200}`, borderRadius: T.r.md, cursor: 'pointer', textAlign: 'left',
                }}>
                  <BottlePlaceholder width={40} height={56} label=""/>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ ...T.t.bodyB, color: T.c.n950, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{w.name}</div>
                    <div style={{ ...T.t.caption, color: T.c.n600 }}>{w.producer} · {w.country}</div>
                  </div>
                  <Icon name="chevron_right" size={22} color={T.c.n400}/>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      {!q && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '8px 0 16px' }}>
            <div style={{ flex: 1, height: 1, background: T.c.n200 }}/>
            <span style={{ ...T.t.overline, color: T.c.n600 }}>OU</span>
            <div style={{ flex: 1, height: 1, background: T.c.n200 }}/>
          </div>
          <BigOption icon="qr_code_scanner" title="Escanear o rótulo" subtitle="Identifica automaticamente pela imagem" onClick={onScan}/>
          <div style={{ height: 12 }}/>
          <BigOption icon="edit" title="Cadastrar manualmente" subtitle="Pra vinhos que ainda não estão na base" onClick={onManual}/>
        </>
      )}
    </div>
  );
}

function BigOption({ icon, title, subtitle, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: '100%', display: 'flex', alignItems: 'center', gap: 16, padding: 16,
      background: T.c.n0, border: `1px solid ${T.c.n200}`, borderRadius: T.r.lg, cursor: 'pointer',
      textAlign: 'left',
    }}>
      <div style={{
        width: 52, height: 52, background: T.c.p50, borderRadius: T.r.md,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Icon name={icon} size={26} color={T.c.p700}/>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ ...T.t.bodyB, color: T.c.n950 }}>{title}</div>
        <div style={{ ...T.t.caption, color: T.c.n600 }}>{subtitle}</div>
      </div>
      <Icon name="chevron_right" size={22} color={T.c.n400}/>
    </button>
  );
}

function Step2Rate({ wine, onSave }) {
  const [rating, setRating] = React.useState(0);
  const [companhia, setCompanhia] = React.useState(null);
  const [ocasiao, setOcasiao] = React.useState(null);
  const [note, setNote] = React.useState('');
  const RATING_LABEL = ['Sua nota', 'Fraco', 'Regular', 'Bom', 'Muito bom', 'Excelente'];

  return (
    <div style={{ padding: '16px 16px 24px' }}>
      <Card padding={12} style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <BottlePlaceholder width={56} height={76} label=""/>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ ...T.t.bodyB, color: T.c.n950, marginBottom: 2 }}>{wine.name}</div>
          <div style={{ ...T.t.caption, color: T.c.n600 }}>{wine.country}{wine.region ? ' · ' + wine.region : ''}</div>
        </div>
      </Card>

      {/* Rating */}
      <div style={{ ...T.t.h3, color: T.c.n950, marginBottom: 8 }}>Que nota você dá?</div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
        {[1,2,3,4,5].map(i => (
          <button key={i} onClick={() => setRating(i)} style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: 4,
            transition: 'transform 120ms', transform: rating === i ? 'scale(1.1)' : 'scale(1)',
          }}><Icon name="star" size={36} color={i <= rating ? T.c.a700 : T.c.n300} fill={i <= rating ? 1 : 0}/></button>
        ))}
      </div>
      <div style={{ ...T.t.caption, color: T.c.n600, marginBottom: 24, height: 16 }}>{RATING_LABEL[rating]}</div>

      {/* Companhia */}
      <div style={{ ...T.t.h3, color: T.c.n950, marginBottom: 4 }}>Com quem você tomou? <span style={{ ...T.t.caption, color: T.c.n600, fontWeight: 400 }}>(opcional)</span></div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20, marginTop: 8 }}>
        {['Sozinho', 'Com alguém', 'Em grupo'].map(opt => (
          <Chip key={opt} size="md" selected={companhia === opt} onClick={() => setCompanhia(companhia === opt ? null : opt)}>{opt}</Chip>
        ))}
      </div>

      {/* Ocasião */}
      <div style={{ ...T.t.h3, color: T.c.n950, marginBottom: 4 }}>Em que ocasião? <span style={{ ...T.t.caption, color: T.c.n600, fontWeight: 400 }}>(opcional)</span></div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20, marginTop: 8 }}>
        {['Jantar', 'Reunião', 'Comemoração', 'Confraria', 'Final de semana'].map(opt => (
          <Chip key={opt} size="md" selected={ocasiao === opt} onClick={() => setOcasiao(ocasiao === opt ? null : opt)}>{opt}</Chip>
        ))}
      </div>

      {/* Notas */}
      <div style={{ ...T.t.h3, color: T.c.n950, marginBottom: 8 }}>Conta como foi <span style={{ ...T.t.caption, color: T.c.n600, fontWeight: 400 }}>(opcional)</span></div>
      <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Suas notas de degustação, com que comida foi…" rows={4} style={{
        width: '100%', padding: 12, border: `1px solid ${T.c.n300}`, borderRadius: T.r.md,
        background: T.c.n0, fontFamily: T.font, fontSize: 14, color: T.c.n950,
        resize: 'vertical', outline: 'none', boxSizing: 'border-box', marginBottom: 16,
      }}/>

      {/* Photo link */}
      <button style={{
        background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0',
        display: 'flex', alignItems: 'center', gap: 8, color: T.c.p700, fontFamily: T.font,
        fontSize: 14, fontWeight: 600, marginBottom: 28,
      }}><Icon name="photo_camera" size={20} color={T.c.p700}/>Adicionar foto <span style={{ ...T.t.caption, color: T.c.n600, fontWeight: 400 }}>(opcional)</span></button>

      <Button variant="primary" size="lg" fullWidth disabled={rating === 0} onClick={() => onSave({
        rating, companhia, occasion: ocasiao, note,
      })}>Salvar no diário</Button>
      {rating === 0 && <div style={{ ...T.t.caption, color: T.c.n600, textAlign: 'center', marginTop: 8 }}>Dá uma nota pra salvar</div>}
    </div>
  );
}

function ManualForm({ onSave, onCancel }) {
  const [name, setName] = React.useState('');
  const [country, setCountry] = React.useState('');
  const [type, setType] = React.useState('');
  const [uva, setUva] = React.useState('');
  const valid = name.trim() && country.trim() && type;
  return (
    <div style={{ padding: 16 }}>
      <div style={{ ...T.t.h2, color: T.c.n950, marginBottom: 6 }}>Cadastrar manualmente</div>
      <div style={{ ...T.t.body, color: T.c.n600, marginBottom: 24 }}>Só o básico — você dá a nota no próximo passo.</div>
      <FormField label="Nome do vinho" required value={name} onChange={setName} placeholder="Ex.: Catena Malbec 2021"/>
      <FormField label="País" required value={country} onChange={setCountry} placeholder="Ex.: Argentina"/>
      <div style={{ ...T.t.label, color: T.c.n800, marginBottom: 6 }}>Tipo <span style={{ color: T.c.e700 }}>*</span></div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
        {['Tinto', 'Branco', 'Rosé', 'Espumante', 'Fortificado'].map(opt => (
          <Chip key={opt} size="md" selected={type === opt} onClick={() => setType(opt)}>{opt}</Chip>
        ))}
      </div>
      <FormField label="Uva principal" value={uva} onChange={setUva} placeholder="Ex.: Malbec (opcional)"/>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
        <Button variant="primary" size="lg" fullWidth disabled={!valid} onClick={() => onSave({
          name: name.trim(), producer: 'Cadastro próprio', country: country.trim(), type, uvas: uva ? [uva] : [],
        })}>Continuar</Button>
        <Button variant="ghost" size="lg" fullWidth onClick={onCancel}>Cancelar</Button>
      </div>
    </div>
  );
}

function FormField({ label, required, value, onChange, placeholder }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ ...T.t.label, color: T.c.n800, marginBottom: 6 }}>
        {label}{required && <span style={{ color: T.c.e700 }}> *</span>}
      </div>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{
        width: '100%', padding: '12px 14px', border: `1px solid ${T.c.n300}`, borderRadius: T.r.md,
        background: T.c.n0, fontFamily: T.font, fontSize: 15, color: T.c.n950,
        outline: 'none', boxSizing: 'border-box',
      }}/>
    </div>
  );
}

Object.assign(window, { RegisterConsumoScreen });


export { BigOption, FormField, ManualForm, RegisterConsumoScreen, Step1Pick, Step2Rate };
