/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { Button } from './components.jsx';
import { fbEvent, readWizardDraft, writeWizardDraft } from './screens-wizard-confraria.jsx';
import { Icon, T } from './tokens.jsx';

// Tchin Tchin — 08.04 Wizard Criar Confraria, Passo 4 de 5
// ────────────────────────────────────────────────────────────
// Localização. GPS é pedido AQUI (e não no onboarding) para não bloquear
// usuários antes de mostrar valor. Se o passo 3 escolheu "Online", esta
// tela faz auto-skip via efeito — o caller (wizard router) deve respeitar
// `onContinue(null)` e pular pra 08.05.
//
// Três variantes:
//   A · GPS não solicitado ainda — convite com primary "Detectar agora"
//   B · GPS granted               — cidade preenchida, "Mudar"
//   C · Manual input              — 2 campos (Cidade + UF), "Usar GPS"
//
// US-12-10-01 — emite `gps_requested_in_wizard` + `gps_response_in_wizard`
// (granted | denied | manual) para entender o trade-off entre permissão e
// digitação no contexto da criação de confraria.

const BRAZIL_UFS = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB',
  'PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO',
];

// ─── Pure component (matches spec contract) ─────────────────
//  props:
//    isOnline: boolean         — se true, faz auto-skip
//    onContinue: (location?: { city, uf, source }) => void
//    onBack: () => void
//    initialLocation?: { city, uf, source }   — pré-hidrata variants
//    detectedCity?: string                    — usado quando GPS retorna granted (mock pro protótipo)
//    detectedUF?: string
function WizardCriarConfrariaP4({
  isOnline,
  onContinue,
  onBack,
  initialLocation,
  detectedCity = 'Brasília',
  detectedUF = 'DF',
}) {
  // Auto-skip — se 08.03 marcou Online, dispara onContinue(null) e sai
  React.useEffect(() => {
    if (isOnline) {
      fbEvent('brotherhood_p4_auto_skipped', { reason: 'meeting_type_online' });
      onContinue(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);

  // Estado de variant: 'invite' | 'granted' | 'manual' | 'prompting'
  const initVariant = initialLocation
    ? (initialLocation.source === 'gps' ? 'granted' : 'manual')
    : 'invite';
  const [variant, setVariant] = React.useState(initVariant);

  const [city, setCity] = React.useState(
    initialLocation ? initialLocation.city : (initVariant === 'granted' ? detectedCity : '')
  );
  const [uf, setUF] = React.useState(
    initialLocation ? initialLocation.uf : (initVariant === 'granted' ? detectedUF : '')
  );

  const requestGPS = () => {
    fbEvent('gps_requested_in_wizard');
    setVariant('prompting');
    // No protótipo simula prompt nativo e resolve granted após 700ms.
    // Em produção: navigator.geolocation.getCurrentPosition(...).
    window.setTimeout(() => {
      const granted = true; // mock — produção lê do callback real
      fbEvent('gps_response_in_wizard', { result: granted ? 'granted' : 'denied' });
      if (granted) {
        setCity(detectedCity);
        setUF(detectedUF);
        setVariant('granted');
      } else {
        setVariant('manual');
      }
    }, 700);
  };

  const goToManual = () => {
    fbEvent('gps_response_in_wizard', { result: 'manual' });
    setVariant('manual');
  };

  const valid = variant === 'granted'
    ? Boolean(city && uf)
    : variant === 'manual'
      ? Boolean(city.trim().length >= 2 && uf)
      : false;

  const handleContinue = () => {
    if (!valid) return;
    const source = variant === 'granted' ? 'gps' : 'manual';
    const location = { city: city.trim(), uf, source };
    const draft = readWizardDraft() || {};
    writeWizardDraft({ ...draft, location, step: 5 });
    onContinue(location);
  };

  // Se isOnline, renderiza placeholder mínimo (auto-skip já disparou)
  if (isOnline) {
    return (
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: T.c.n0, padding: 24, color: T.c.n600, fontFamily: T.font, fontSize: 14,
      }}>
        Confraria 100% online — pulando localização…
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n0, position: 'relative', overflow: 'hidden' }}>
      {/* ── Top bar ── */}
      <header style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 12px 8px 4px', minHeight: 56, flexShrink: 0,
      }}>
        <button
          onClick={onBack}
          aria-label="Voltar"
          style={{
            width: 44, height: 44, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'transparent', border: 'none', cursor: 'pointer', color: T.c.n950,
          }}>
          <Icon name="close" size={24}/>
        </button>
        <div style={{
          flex: 1, textAlign: 'center',
          fontFamily: '"Fraunces", Georgia, serif',
          fontSize: 17, lineHeight: 1.2, fontWeight: 600,
          letterSpacing: '-0.01em', color: T.c.n950,
        }}>
          Criar confraria
        </div>
        <div style={{
          ...T.t.caption, color: T.c.n600,
          fontFamily: T.mono, fontWeight: 600,
          padding: '4px 10px', background: T.c.n100, borderRadius: T.r.full,
        }} aria-label="Passo 4 de 5">
          4 de 5
        </div>
      </header>

      {/* Progress bar — 5 segments, 1–4 burgundy */}
      <div style={{ padding: '4px 16px 0', display: 'flex', gap: 6, flexShrink: 0 }}
           role="progressbar" aria-valuenow={4} aria-valuemin={1} aria-valuemax={5}>
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} style={{
            flex: 1, height: 4, borderRadius: 2,
            background: i <= 3 ? T.c.p700 : T.c.n200,
            transition: 'background 240ms',
          }}/>
        ))}
      </div>

      {/* ── Scrollable body ── */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        <div style={{ padding: '24px 24px 0' }}>
          <h2 style={{
            margin: 0,
            fontFamily: '"Fraunces", Georgia, serif',
            fontSize: 22, lineHeight: 1.2, fontWeight: 600,
            letterSpacing: '-0.01em', color: T.c.n950,
            textWrap: 'balance',
          }}>
            Onde sua confraria se encontra?
          </h2>
          <div style={{ height: 12 }}/>
          <p style={{
            margin: 0,
            fontFamily: T.font,
            fontSize: 16, lineHeight: 1.5, color: T.c.n800,
          }}>
            Pra membros da sua região encontrarem mais fácil.
          </p>

          <div style={{ height: 24 }}/>

          {/* Variants */}
          {(variant === 'invite' || variant === 'prompting') && (
            <InviteGPSCard
              loading={variant === 'prompting'}
              onDetect={requestGPS}
              onManual={goToManual}
            />
          )}

          {variant === 'granted' && (
            <GrantedCard
              city={city} uf={uf}
              onChange={() => setVariant('manual')}
            />
          )}

          {variant === 'manual' && (
            <ManualInputs
              city={city} uf={uf}
              onCityChange={setCity}
              onUFChange={setUF}
              onUseGPS={requestGPS}
            />
          )}

          <div style={{ height: 24 }}/>
        </div>
      </div>

      {/* ── Fixed bottom CTAs ── */}
      <div style={{
        padding: '12px 24px 24px',
        paddingBottom: 'max(24px, env(safe-area-inset-bottom))',
        display: 'flex', flexDirection: 'column', gap: 8,
        background: T.c.n0,
        borderTop: `1px solid ${T.c.n100}`,
        flexShrink: 0,
      }}>
        <Button
          variant="primary" size="lg" fullWidth
          disabled={!valid}
          onClick={handleContinue}
          trailing={<Icon name="arrow_forward" size={18}/>}
          data-route="wizard_step_5">
          Continuar
        </Button>
        <button
          onClick={onBack}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '8px 16px', alignSelf: 'center',
            fontFamily: T.font, fontSize: 13, fontWeight: 500,
            color: T.c.n600, letterSpacing: '0.1px',
          }}>
          Voltar
        </button>
      </div>
    </div>
  );
}

// ─── Variant A · GPS não solicitado ─────────────────────────
function InviteGPSCard({ loading, onDetect, onManual }) {
  return (
    <div style={{
      background: T.c.p50,
      border: `1px solid ${T.c.p100}`,
      borderRadius: T.r.lg,
      padding: 20,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      textAlign: 'center',
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: '50%',
        background: T.c.n0, border: `1px solid ${T.c.p100}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 12,
      }}>
        <Icon name="location_on" size={32} color={T.c.p700} fill={1}/>
      </div>
      <div style={{
        fontFamily: T.font, fontSize: 15, fontWeight: 700,
        color: T.c.n950, marginBottom: 4,
      }}>
        Usar minha localização
      </div>
      <div style={{
        fontFamily: T.font, fontSize: 12, lineHeight: 1.45, color: T.c.n800,
        marginBottom: 16, maxWidth: 260,
      }}>
        Detectamos cidade e UF automaticamente
      </div>
      <Button
        variant="primary" size="md"
        onClick={onDetect}
        loading={loading}
        leading={!loading && <Icon name="my_location" size={18}/>}>
        {loading ? 'Detectando…' : 'Detectar agora'}
      </Button>
      <div style={{ height: 12 }}/>
      <button
        onClick={onManual}
        disabled={loading}
        style={{
          background: 'none', border: 'none',
          padding: '4px 8px',
          fontFamily: T.font, fontSize: 13, fontWeight: 600,
          color: T.c.p700, cursor: loading ? 'not-allowed' : 'pointer',
          textDecoration: 'underline', textUnderlineOffset: 3,
          opacity: loading ? 0.5 : 1,
        }}>
        Prefiro digitar manualmente
      </button>
    </div>
  );
}

// (Spinner is provided by components.jsx — não redefinir aqui pra não colidir
// com o usado pelo <Button loading/>.)

// ─── Variant B · GPS granted ────────────────────────────────
function GrantedCard({ city, uf, onChange }) {
  return (
    <div style={{
      background: T.c.n50,
      border: `1px solid ${T.c.n200}`,
      borderRadius: T.r.lg,
      padding: 20,
      display: 'flex', alignItems: 'center', gap: 16,
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: '50%',
        background: T.c.s100, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name="check_circle" size={28} color={T.c.s700} fill={1}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: T.font, fontSize: 17, fontWeight: 700,
          color: T.c.n950, marginBottom: 2,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {city}, {uf}
        </div>
        <div style={{
          fontFamily: T.font, fontSize: 12, lineHeight: 1.4, color: T.c.n800,
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          <Icon name="location_on" size={14} color={T.c.n600} fill={1}/>
          Detectado automaticamente
        </div>
      </div>
      <button
        onClick={onChange}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          padding: '6px 10px',
          fontFamily: T.font, fontSize: 13, fontWeight: 600,
          color: T.c.p700, borderRadius: T.r.sm,
          flexShrink: 0,
        }}>
        Mudar
      </button>
    </div>
  );
}

// ─── Variant C · Manual inputs ──────────────────────────────
function ManualInputs({ city, uf, onCityChange, onUFChange, onUseGPS }) {
  const [cityFocus, setCityFocus] = React.useState(false);
  const [ufFocus, setUFFocus] = React.useState(false);

  return (
    <div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        {/* Cidade */}
        <div style={{ flex: 1 }}>
          <label style={{
            display: 'block', marginBottom: 6, paddingLeft: 4,
            fontFamily: T.font, fontSize: 11, fontWeight: 600,
            color: T.c.n800, textTransform: 'uppercase', letterSpacing: '0.4px',
          }}>
            Cidade
          </label>
          <div style={{
            position: 'relative',
            border: `1.5px solid ${cityFocus ? T.c.p700 : T.c.n300}`,
            borderRadius: T.r.md, background: T.c.n0,
            transition: 'border-color 160ms',
            display: 'flex', alignItems: 'center',
          }}>
            <Icon name="search" size={18} color={T.c.n600} style={{ marginLeft: 12 }}/>
            <input
              value={city}
              onChange={e => onCityChange(e.target.value)}
              onFocus={() => setCityFocus(true)}
              onBlur={() => setCityFocus(false)}
              placeholder="Ex: Brasília"
              style={{
                width: '100%', padding: '12px 14px 12px 10px',
                border: 'none', outline: 'none', background: 'transparent',
                fontFamily: T.font, fontSize: 15, color: T.c.n950,
                boxSizing: 'border-box',
              }}
            />
          </div>
        </div>
        {/* UF */}
        <div style={{ width: 92, flexShrink: 0 }}>
          <label style={{
            display: 'block', marginBottom: 6, paddingLeft: 4,
            fontFamily: T.font, fontSize: 11, fontWeight: 600,
            color: T.c.n800, textTransform: 'uppercase', letterSpacing: '0.4px',
          }}>
            UF
          </label>
          <div style={{
            position: 'relative',
            border: `1.5px solid ${ufFocus ? T.c.p700 : T.c.n300}`,
            borderRadius: T.r.md, background: T.c.n0,
            transition: 'border-color 160ms',
          }}>
            <select
              value={uf}
              onChange={e => onUFChange(e.target.value)}
              onFocus={() => setUFFocus(true)}
              onBlur={() => setUFFocus(false)}
              style={{
                width: '100%', padding: '12px 32px 12px 14px',
                border: 'none', outline: 'none', background: 'transparent',
                fontFamily: T.font, fontSize: 15, color: uf ? T.c.n950 : T.c.n600,
                appearance: 'none', WebkitAppearance: 'none',
                cursor: 'pointer', boxSizing: 'border-box',
                fontWeight: uf ? 600 : 400,
              }}>
              <option value="" disabled>UF</option>
              {BRAZIL_UFS.map(u => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
            <div style={{
              position: 'absolute', right: 10, top: '50%',
              transform: 'translateY(-50%)', pointerEvents: 'none',
              display: 'flex', color: T.c.n600,
            }}>
              <Icon name="expand_more" size={20}/>
            </div>
          </div>
        </div>
      </div>
      <div style={{ height: 12 }}/>
      <button
        onClick={onUseGPS}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'none', border: 'none', cursor: 'pointer',
          padding: '4px 4px',
          fontFamily: T.font, fontSize: 13, fontWeight: 600,
          color: T.c.p700, textDecoration: 'underline', textUnderlineOffset: 3,
        }}>
        <Icon name="my_location" size={14}/>
        Usar GPS
      </button>
    </div>
  );
}

// ─── Prototype-integration wrapper ──────────────────────────
function WizardCriarConfrariaP4Screen({ go, params = {}, ctx }) {
  const draft = React.useMemo(() => readWizardDraft() || {}, []);
  const isOnline = (params.meeting_type || draft.meeting_type) === 'online';

  // Mock detected city seed — em produção viria do navigator.geolocation
  const userCity = (ctx && ctx.user && ctx.user.city) || 'Brasília, DF';
  const [seedCity, seedUF] = userCity.split(',').map(s => s.trim());

  const onContinue = (location) => {
    go('wizard-confraria-5');
  };

  const onBack = () => go('back');

  return (
    <WizardCriarConfrariaP4
      isOnline={isOnline}
      onContinue={onContinue}
      onBack={onBack}
      initialLocation={draft.location}
      detectedCity={seedCity || 'Brasília'}
      detectedUF={seedUF || 'DF'}
    />
  );
}

Object.assign(window, {
  WizardCriarConfrariaP4,
  WizardCriarConfrariaP4Screen,
  BRAZIL_UFS,
});


export { BRAZIL_UFS, GrantedCard, InviteGPSCard, ManualInputs, WizardCriarConfrariaP4, WizardCriarConfrariaP4Screen };
