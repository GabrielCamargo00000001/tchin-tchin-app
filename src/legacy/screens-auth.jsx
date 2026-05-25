/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { Button, Input, Toast } from './components.jsx';
import { ONBOARDING_SLIDES } from './data.jsx';
import { Icon, T, TchinLogo } from './tokens.jsx';

// Tchin Tchin — Screens (1 of 2): Auth, Onboarding, Quiz, Descobrir

// ─── Welcome ────────────────────────────────────────────────
function WelcomeScreen({ go }) {
  const [gLoading, setGLoading] = React.useState(false);
  const [err, setErr] = React.useState(false);
  const onGoogle = () => {
    // Live: opens the social/magic-link picker. For demo of failure path,
    // long-press would show toast; here we navigate.
    go('login-social', { mode: 'cadastro' });
  };
  return (
    <div style={{
      flex: 1, position: 'relative', display: 'flex', flexDirection: 'column',
      overflow: 'hidden', color: T.c.n0,
    }}>
      {/* Background: warm vinous photo placeholder */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at 30% 25%, ${T.c.p500} 0%, ${T.c.p700} 35%, ${T.c.p900} 75%, #2a0e12 100%)`,
      }}>
        {/* subtle textural noise via concentric vignettes */}
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 70% 80%, rgba(212,165,116,0.18) 0%, transparent 45%)` }}/>
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 15% 90%, rgba(0,0,0,0.35) 0%, transparent 50%)` }}/>
        {/* faint silhouettes evoking glasses being clinked */}
        <svg viewBox="0 0 412 600" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.12 }}>
          <path d="M120 0 L150 80 Q150 130 120 145 L120 230 L100 245 L100 250 L140 250 L140 245 L120 230" stroke={T.c.n0} strokeWidth="1" fill="none"/>
          <path d="M292 0 L262 80 Q262 130 292 145 L292 230 L312 245 L312 250 L272 250 L272 245 L292 230" stroke={T.c.n0} strokeWidth="1" fill="none"/>
        </svg>
        {/* gradient overlay burgundy/900 50% → 0% bottom-up for readability */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(180deg, rgba(74,31,36,0.0) 0%, rgba(74,31,36,0.35) 45%, rgba(74,31,36,0.85) 100%)`,
        }}/>
      </div>

      {/* Error toast */}
      {err && (
        <div style={{ position: 'absolute', top: 16, left: 16, right: 16, zIndex: 10, animation: 'tcFadeIn 240ms ease' }}>
          <Toast kind="error" message="Não foi possível continuar. Tente novamente."/>
        </div>
      )}

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2, flex: 1, display: 'flex', flexDirection: 'column', padding: '32px 24px 16px' }}>
        {/* Logo + headline */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 22, paddingBottom: 16 }}>
          <TchinLogo size={80} color={T.c.n0}/>
          <div style={{
            fontSize: 32, lineHeight: 1.15, fontWeight: 700,
            textAlign: 'center', letterSpacing: '-0.02em', textWrap: 'balance',
            maxWidth: 320, color: T.c.n0,
            textShadow: '0 2px 12px rgba(0,0,0,0.25)',
          }}>
            Onde cada vinho<br/>vira uma boa<br/>experiência
          </div>
        </div>

        {/* CTAs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button onClick={onGoogle} disabled={gLoading} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            height: 52, borderRadius: T.r.md, padding: '0 18px',
            background: T.c.n0, color: T.c.n950, border: 'none', cursor: gLoading ? 'wait' : 'pointer',
            fontSize: 15, fontWeight: 600, fontFamily: T.font,
            boxShadow: '0 1px 3px rgba(0,0,0,0.16)',
            opacity: gLoading ? 0.85 : 1, transition: 'opacity 160ms',
          }}>
            {gLoading
              ? <span style={{ width: 18, height: 18, border: '2.5px solid #d6d6d6', borderTopColor: T.c.p700, borderRadius: '50%', display: 'inline-block', animation: 'tcSpin 700ms linear infinite' }}/>
              : <GoogleG/>}
            <span>{gLoading ? 'Conectando…' : 'Continuar com Google ou outros'}</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.25)' }}/>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.5px' }}>OU</div>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.25)' }}/>
          </div>

          <button onClick={() => go('cadastro')} style={{
            height: 52, borderRadius: T.r.md, padding: '0 18px',
            background: T.c.p700, color: T.c.n0, border: 'none', cursor: 'pointer',
            fontSize: 15, fontWeight: 600, fontFamily: T.font,
            boxShadow: '0 2px 8px rgba(74,31,36,0.4)',
          }}>
            Criar conta
          </button>

          {/* "Entrar" with comfortable hit area */}
          <button onClick={() => go('login')} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            minHeight: 48, padding: '12px 16px',
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 14, color: 'rgba(255,255,255,0.9)', fontFamily: T.font,
            marginTop: 4,
          }}>
            <span>Já é do Tchin? <strong style={{ fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: 3, color: T.c.n0 }}>Entrar</strong></span>
          </button>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          gap: 4, marginTop: 12, paddingBottom: 4,
        }}>
          {['Termos', 'Privacidade', 'Suporte'].map((label, idx) => (
            <React.Fragment key={label}>
              <button style={{
                minHeight: 44, padding: '12px 10px',
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 12, color: 'rgba(255,255,255,0.6)', fontFamily: T.font,
              }}>{label}</button>
              {idx < 2 && <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>·</span>}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

function GoogleG() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.49h4.84a4.14 4.14 0 0 1-1.79 2.72v2.26h2.9c1.7-1.57 2.69-3.88 2.69-6.63z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.95-2.18l-2.9-2.26c-.81.54-1.84.86-3.05.86-2.34 0-4.33-1.58-5.04-3.71H.97v2.33A9 9 0 0 0 9 18z"/>
      <path fill="#FBBC05" d="M3.96 10.71A5.4 5.4 0 0 1 3.68 9c0-.59.1-1.17.28-1.71V4.96H.97A9 9 0 0 0 0 9c0 1.45.35 2.83.97 4.04l2.99-2.33z"/>
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A8.96 8.96 0 0 0 9 0 9 9 0 0 0 .97 4.96L3.96 7.3C4.67 5.16 6.66 3.58 9 3.58z"/>
    </svg>
  );
}

// ─── Onboarding (3 slides, swipe) ──────────────────────────
function OnboardingScreen({ go }) {
  const [i, setI] = React.useState(0);
  const total = ONBOARDING_SLIDES.length;
  const slide = ONBOARDING_SLIDES[i];
  const touchStart = React.useRef(null);
  const onTouchStart = e => { touchStart.current = e.touches[0].clientX; };
  const onTouchEnd = e => {
    if (touchStart.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStart.current;
    if (dx > 50 && i > 0) setI(i - 1);
    if (dx < -50 && i < total - 1) setI(i + 1);
    touchStart.current = null;
  };
  const next = () => { if (i < total - 1) setI(i + 1); else go('welcome'); };
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n50 }}
         onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 16, minHeight: 56 }}>
        {i < total - 1 && (
          <button onClick={() => go('welcome')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.c.n600, fontWeight: 600, fontSize: 14, padding: 8 }}>
            Pular
          </button>
        )}
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 32px', gap: 24 }}>
        <OnboardingIllo slide={i}/>
        <div style={{ ...T.t.h1, color: T.c.p900, textAlign: 'center', fontSize: 26, lineHeight: '32px', textWrap: 'balance' }}>{slide.title}</div>
        <div style={{ ...T.t.bodyLg, color: T.c.n600, textAlign: 'center', maxWidth: 320, textWrap: 'pretty' }}>{slide.subtitle}</div>
      </div>
      <div style={{ padding: '0 24px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
        <div style={{ display: 'flex', gap: 8, padding: 12, minHeight: 48, alignItems: 'center' }}>
          {ONBOARDING_SLIDES.map((_, idx) => (
            <button key={idx} onClick={() => setI(idx)} style={{
              width: idx === i ? 24 : 8, height: 8, borderRadius: 4, padding: 0,
              background: idx === i ? T.c.p700 : T.c.n300, border: 'none', cursor: 'pointer',
              transition: 'all 240ms',
            }}/>
          ))}
        </div>
        <Button variant="primary" size="lg" fullWidth onClick={next} trailing={i < total - 1 ? <Icon name="arrow_forward" size={18}/> : null}>
          {i === total - 1 ? 'Vamos começar' : 'Avançar'}
        </Button>
      </div>
    </div>
  );
}
function OnboardingIllo({ slide }) {
  if (slide === 0) return (
    <svg width="240" height="220" viewBox="0 0 240 220">
      <circle cx="120" cy="120" r="100" fill={T.c.p100} opacity="0.6"/>
      <g transform="translate(40, 30)">
        {/* Left glass tilted */}
        <g transform="rotate(-15, 50, 90)">
          <path d="M30 20 L30 80 Q30 105 50 110 L50 140 L40 140 L40 145 L70 145 L70 140 L60 140 L60 110 Q80 105 80 80 L80 20 Z" fill="none" stroke={T.c.p900} strokeWidth="3.5" strokeLinejoin="round"/>
          <path d="M33 25 L77 25 Q75 55 55 60 Q40 60 33 50 Z" fill={T.c.p700}/>
        </g>
        {/* Right glass tilted */}
        <g transform="rotate(15, 110, 90)">
          <path d="M90 20 L90 80 Q90 105 110 110 L110 140 L100 140 L100 145 L130 145 L130 140 L120 140 L120 110 Q140 105 140 80 L140 20 Z" fill="none" stroke={T.c.p900} strokeWidth="3.5" strokeLinejoin="round"/>
          <path d="M93 28 L137 28 Q135 60 115 62 Q100 60 93 52 Z" fill={T.c.p700}/>
        </g>
        {/* Sparkles */}
        <circle cx="80" cy="20" r="3" fill={T.c.a700}/>
        <circle cx="95" cy="10" r="2" fill={T.c.a700}/>
        <circle cx="70" cy="35" r="2" fill={T.c.a700}/>
      </g>
    </svg>
  );
  if (slide === 1) return (
    <svg width="280" height="220" viewBox="0 0 280 220">
      <circle cx="140" cy="120" r="100" fill={T.c.p100} opacity="0.5"/>
      {/* Three icons */}
      <g transform="translate(30, 60)">
        <circle cx="40" cy="50" r="38" fill={T.c.n0} stroke={T.c.p700} strokeWidth="2"/>
        <path d="M30 35 Q30 25 40 25 Q50 25 50 35 L50 55 Q50 65 40 65 Q30 65 30 55 Z" fill={T.c.p700}/>
        <circle cx="36" cy="40" r="2.5" fill={T.c.n0}/>
        <circle cx="44" cy="38" r="2" fill={T.c.n0}/>
        <text x="40" y="110" textAnchor="middle" fontSize="11" fill={T.c.p900} fontWeight="600">descobrir</text>
      </g>
      <g transform="translate(110, 60)">
        <circle cx="40" cy="50" r="38" fill={T.c.n0} stroke={T.c.p700} strokeWidth="2"/>
        <rect x="25" y="32" width="30" height="36" rx="2" fill={T.c.p700}/>
        <path d="M28 36 L52 36 M28 42 L48 42 M28 48 L46 48 M28 54 L50 54" stroke={T.c.n0} strokeWidth="1.5"/>
        <text x="40" y="110" textAnchor="middle" fontSize="11" fill={T.c.p900} fontWeight="600">registrar</text>
      </g>
      <g transform="translate(190, 60)">
        <circle cx="40" cy="50" r="38" fill={T.c.n0} stroke={T.c.p700} strokeWidth="2"/>
        <circle cx="32" cy="46" r="6" fill={T.c.p700}/>
        <circle cx="48" cy="46" r="6" fill={T.c.p700}/>
        <path d="M22 65 Q32 56 42 60 Q52 56 58 65" fill={T.c.p700}/>
        <text x="40" y="110" textAnchor="middle" fontSize="11" fill={T.c.p900} fontWeight="600">conectar</text>
      </g>
    </svg>
  );
  return (
    <svg width="220" height="220" viewBox="0 0 220 220">
      <circle cx="110" cy="110" r="100" fill={T.c.p100} opacity="0.6"/>
      <g transform="translate(60, 30)">
        <path d="M30 20 L30 90 Q30 120 50 125 L50 155 L35 155 L35 162 L75 162 L75 155 L60 155 L60 125 Q80 120 80 90 L80 20 Z"
              fill="none" stroke={T.c.p900} strokeWidth="3.5" strokeLinejoin="round"/>
        <path d="M33 30 L77 30 Q77 90 55 92 Q40 90 33 75 Z" fill={T.c.p700}/>
        {/* Sparkles around */}
        <g fill={T.c.a700}>
          <path d="M10 30 L13 36 L19 39 L13 42 L10 48 L7 42 L1 39 L7 36 Z"/>
          <path d="M90 15 L92 19 L96 21 L92 23 L90 27 L88 23 L84 21 L88 19 Z"/>
          <path d="M100 70 L102 74 L106 76 L102 78 L100 82 L98 78 L94 76 L98 74 Z"/>
        </g>
      </g>
    </svg>
  );
}

// ─── Login ─────────────────────────────────────────────────
function LoginScreen({ go }) {
  const [email, setEmail] = React.useState('');
  const [pwd, setPwd] = React.useState('');
  const [show, setShow] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [attempts, setAttempts] = React.useState(0);
  const [authErr, setAuthErr] = React.useState('');
  const [rateLimit, setRateLimit] = React.useState(false);

  const emailTouched = email.length > 0;
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const emailError = emailTouched && !emailValid ? 'E-mail inválido. Confere o formato.' : '';
  const canSubmit = emailValid && pwd.length >= 6 && !loading;

  const submit = () => {
    if (!canSubmit) return;
    setLoading(true);
    setAuthErr('');
    setTimeout(() => {
      setLoading(false);
      // simulate: wrong password unless email contains "ana"
      if (!email.toLowerCase().includes('ana')) {
        const n = attempts + 1;
        setAttempts(n);
        if (n >= 3) {
          setRateLimit(true);
          setTimeout(() => setRateLimit(false), 4000);
        } else {
          setAuthErr('E-mail ou senha incorretos. Tente novamente.');
        }
      } else {
        go('home');
      }
    }, 800);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n0 }}>
      {/* Header with back + brand */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 8px 8px 4px', minHeight: 56,
        borderBottom: `1px solid ${T.c.n100}`,
      }}>
        <button onClick={() => go('welcome')} style={{
          width: 48, height: 48, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'transparent', border: 'none', cursor: 'pointer', color: T.c.n950,
        }}>
          <Icon name="arrow_back" size={24}/>
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <TchinLogo size={22} color={T.c.p700}/>
          <span style={{ fontSize: 16, fontWeight: 600, color: T.c.n950 }}>Tchin Tchin</span>
        </div>
      </div>

      {/* Rate limit toast */}
      {rateLimit && (
        <div style={{ padding: '12px 16px 0', animation: 'tcFadeIn 240ms ease' }}>
          <Toast kind="warning" message="Muitas tentativas. Aguarde alguns segundos antes de tentar de novo."/>
        </div>
      )}

      {/* Auth error toast */}
      {authErr && !rateLimit && (
        <div style={{ padding: '12px 16px 0', animation: 'tcFadeIn 240ms ease' }}>
          <Toast kind="error" message={authErr}/>
        </div>
      )}

      <div style={{ flex: 1, padding: '24px 24px 16px', display: 'flex', flexDirection: 'column', gap: 20, overflowY: 'auto' }}>
        <div>
          <div style={{ fontSize: 24, lineHeight: 1.2, fontWeight: 700, color: T.c.n950, marginBottom: 4 }}>Que bom te ver de novo</div>
          <div style={{ fontSize: 14, color: T.c.n600, lineHeight: 1.45 }}>Entra com o e-mail que você usou no cadastro.</div>
        </div>

        <Input
          label="E-mail*"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="Digite seu e-mail"
          leading={<Icon name="mail" size={18}/>}
          error={emailError}
        />

        <Input
          label="Senha*"
          type={show ? 'text' : 'password'}
          value={pwd}
          onChange={setPwd}
          placeholder="Digite a senha"
          leading={<Icon name="lock" size={18}/>}
          trailing={
            <button onClick={() => setShow(!show)} aria-label={show ? 'Ocultar senha' : 'Mostrar senha'} style={{
              background: 'none', border: 'none', cursor: 'pointer', color: T.c.n600,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 36, height: 36, padding: 0, borderRadius: 6,
            }}>
              <Icon name={show ? 'visibility_off' : 'visibility'} size={20}/>
            </button>
          }
        />

        <Button variant="primary" size="lg" fullWidth disabled={!canSubmit && !loading} loading={loading} onClick={submit}>
          {loading ? 'Entrando…' : 'Entrar'}
        </Button>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: -4 }}>
          <button onClick={() => go('recuperar-email')} style={{
            minHeight: 48, padding: '12px 20px',
            background: 'none', border: 'none', cursor: 'pointer',
            color: T.c.p700, fontWeight: 600, fontSize: 14, fontFamily: T.font,
          }}>
            Esqueceu sua senha?
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px 0' }}>
          <div style={{ flex: 1, height: 1, background: T.c.n200 }}/>
          <span style={{ fontSize: 12, fontWeight: 500, color: T.c.n600, letterSpacing: '0.5px' }}>OU</span>
          <div style={{ flex: 1, height: 1, background: T.c.n200 }}/>
        </div>

        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '4px 0',
        }}>
          <div style={{ fontSize: 14, color: T.c.n600 }}>Ainda não faz parte?</div>
          <button onClick={() => go('cadastro')} style={{
            minHeight: 48, padding: '8px 20px',
            background: 'none', border: 'none', cursor: 'pointer',
            color: T.c.p700, fontWeight: 700, fontSize: 15, fontFamily: T.font,
            textDecoration: 'underline', textUnderlineOffset: 3,
          }}>
            Criar conta
          </button>
        </div>
      </div>

      <div style={{ textAlign: 'center', padding: '8px 0 16px', fontSize: 11, color: T.c.n400, letterSpacing: '0.3px' }}>
        Versão 1.4.12
      </div>
    </div>
  );
}

// ─── Cadastro (3 steps wizard) ─────────────────────────────
function CadastroScreen({ go }) {
  const [step, setStep] = React.useState(0);
  const [data, setData] = React.useState({ email: '', senha: '', showPwd: false, nome: '', nascimento: '', aceitaTermos: false, aceitaPriv: false, comms: true });
  const [modal, setModal] = React.useState(null); // 'exists' | 'underage' | null
  const [loading, setLoading] = React.useState(false);
  const u = (k, v) => setData(d => ({ ...d, [k]: v }));

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
  const senhaScore = scorePwd(data.senha);
  const senhaValid = senhaScore >= 2; // ≥ "Senha boa"
  const nomeValid = data.nome.trim().split(/\s+/).length >= 2;
  const ageOk = data.nascimento && computeAge(data.nascimento) >= 18;
  const dateTouched = data.nascimento.length > 0;
  const underage = dateTouched && !ageOk && computeAge(data.nascimento) >= 0;
  const termosOk = data.aceitaTermos && data.aceitaPriv;

  const stepValid = step === 0 ? (emailValid && senhaValid)
                  : step === 1 ? (nomeValid && ageOk)
                  : termosOk;

  const back = () => step > 0 ? setStep(step - 1) : go('welcome');
  const next = () => {
    if (!stepValid) return;
    if (step === 0) {
      // simulate email check
      if (data.email.toLowerCase() === 'ana@gmail.com' || data.email.toLowerCase().includes('exists')) {
        setModal('exists'); return;
      }
      setStep(1); return;
    }
    if (step === 1) {
      if (!ageOk) { setModal('underage'); return; }
      setStep(2); return;
    }
    // final
    setLoading(true);
    // Conta nova = estado da feature "Treine seu Paladar" zerado, pra o
    // onboarding da feature aparecer pra quem acabou de criar conta.
    try { window.localStorage.removeItem('tc.treino.v3'); } catch (e) {}
    setTimeout(() => { setLoading(false); go('quiz-nivel'); }, 800);
  };

  const titles = ['Bora começar pelo básico', 'Quem é você?', 'Quase lá! Só confirmar os termos'];
  const subs = [
    'Use um e-mail que você acessa com frequência.',
    'Seu nome aparece nas confrarias. A idade fica privada.',
    'Dá uma lida, concorda e a gente segue junto.',
  ];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n0 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px 8px 4px', minHeight: 56, borderBottom: `1px solid ${T.c.n100}` }}>
        <button onClick={back} style={{ width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', color: T.c.n950 }}>
          <Icon name="arrow_back" size={24}/>
        </button>
        <div style={{ flex: 1, fontSize: 16, fontWeight: 600, color: T.c.n950 }}>Criar conta</div>
        <div style={{ fontFamily: T.mono, fontSize: 12, fontWeight: 600, color: T.c.n600, padding: '6px 10px', background: T.c.n100, borderRadius: 999 }}>
          {step + 1} de 3
        </div>
      </div>

      {/* Progress segments */}
      <div style={{ padding: '16px 24px 0', display: 'flex', gap: 6 }}>
        {[0,1,2].map(i => (
          <div key={i} style={{
            flex: 1, height: 6, borderRadius: 3,
            background: i < step ? T.c.p700 : i === step ? T.c.p700 : T.c.n200,
            transition: 'background 240ms',
            position: 'relative', overflow: 'hidden',
          }}>
            {i === step && <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(90deg, ${T.c.p700} 0%, ${T.c.p500} 100%)` }}/>}
          </div>
        ))}
      </div>

      <div style={{ padding: '20px 24px 12px' }}>
        <div style={{ fontSize: 22, lineHeight: 1.2, fontWeight: 700, color: T.c.n950, marginBottom: 4, textWrap: 'balance' }}>{titles[step]}</div>
        <div style={{ fontSize: 14, color: T.c.n600, lineHeight: 1.45 }}>{subs[step]}</div>
      </div>

      <div style={{ flex: 1, padding: '0 24px 12px', display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto' }}>
        {step === 0 && (
          <React.Fragment>
            <Input label="E-mail*" type="email" value={data.email} onChange={v => u('email', v)} placeholder="Digite seu e-mail" leading={<Icon name="mail" size={18}/>}
                   error={data.email.length > 0 && !emailValid ? 'E-mail inválido.' : ''}/>
            <div>
              <Input label="Senha*" type={data.showPwd ? 'text' : 'password'} value={data.senha} onChange={v => u('senha', v)} placeholder="Crie uma senha"
                     leading={<Icon name="lock" size={18}/>}
                     trailing={
                       <button onClick={() => u('showPwd', !data.showPwd)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.c.n600, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, padding: 0 }}>
                         <Icon name={data.showPwd ? 'visibility_off' : 'visibility'} size={20}/>
                       </button>
                     }
                     helper="Mínimo 6 caracteres. Mistura letras, números e símbolos."/>
              <PwdMeter score={senhaScore}/>
            </div>
          </React.Fragment>
        )}
        {step === 1 && (
          <React.Fragment>
            <Input label="Nome completo*" value={data.nome} onChange={v => u('nome', v)} placeholder="Como gostaria de ser chamada(o)" autoFocus
                   leading={<Icon name="person" size={18}/>}
                   helper={data.nome.length > 0 && !nomeValid ? 'Inclua nome e sobrenome.' : ''}/>
            <Input label="Data de nascimento*" type="date" value={data.nascimento} onChange={v => u('nascimento', v)} leading={<Icon name="cake" size={18}/>}
                   error={underage ? 'Você precisa ter 18 anos ou mais para usar o Tchin Tchin.' : ''}/>
          </React.Fragment>
        )}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <TermsToggle checked={data.aceitaTermos} onChange={v => u('aceitaTermos', v)}>
              Li e concordo com os <strong style={{ color: T.c.p700 }}>Termos de Uso</strong>
            </TermsToggle>
            <TermsToggle checked={data.aceitaPriv} onChange={v => u('aceitaPriv', v)}>
              Li e concordo com a <strong style={{ color: T.c.p700 }}>Política de Privacidade</strong>
            </TermsToggle>
            <TermsToggle checked={data.comms} onChange={v => u('comms', v)}>
              Quero receber novidades sobre confrarias e eventos por e-mail <span style={{ color: T.c.n400 }}>(opcional)</span>
            </TermsToggle>
            <div style={{ marginTop: 12, padding: 14, background: T.c.p50, borderRadius: T.r.md, fontSize: 12, color: T.c.n800, lineHeight: 1.45 }}>
              <strong style={{ color: T.c.p700 }}>Importante:</strong> o Tchin Tchin é destinado a maiores de 18 anos. Conteúdo sobre bebidas alcoólicas. Beba com moderação.
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: '12px 24px 24px', background: T.c.n0, borderTop: `1px solid ${T.c.n100}` }}>
        <Button variant="primary" size="lg" fullWidth disabled={!stepValid} loading={loading}
                onClick={next}
                trailing={!loading && step < 2 ? <Icon name="arrow_forward" size={18}/> : null}>
          {step === 2 ? (loading ? 'Criando conta…' : 'Criar conta') : 'Continuar'}
        </Button>
      </div>

      {/* Email exists modal */}
      {modal === 'exists' && (
        <ModalDialog onClose={() => setModal(null)} kind="info" icon="info"
          title="Esse e-mail já está cadastrado"
          body="Parece que você já tem uma conta no Tchin Tchin. Quer entrar?"
          primary={{ label: 'Ir para Login', onClick: () => { setModal(null); go('login'); } }}
          secondary={{ label: 'Usar outro e-mail', onClick: () => setModal(null) }}/>
      )}

      {/* Underage modal */}
      {modal === 'underage' && (
        <ModalDialog onClose={() => setModal(null)} kind="destructive" icon="block"
          title="Você precisa ter 18 anos ou mais"
          body="O Tchin Tchin é destinado a maiores de 18 anos. Conteúdo sobre bebidas alcoólicas — beba com moderação."
          primary={{ label: 'Entendi', onClick: () => { setModal(null); u('nascimento', ''); } }}/>
      )}
    </div>
  );
}

function scorePwd(p) {
  if (!p) return 0;
  let s = 0;
  if (p.length >= 6) s++;
  if (p.length >= 10) s++;
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++;
  if (/\d/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return Math.min(s, 5);
}

function PwdMeter({ score }) {
  if (score === 0) return null;
  const labels = ['Muito fraca', 'Fraca', 'Senha boa', 'Senha forte', 'Excelente'];
  const colors = [T.c.e700, T.c.w700, T.c.a700, T.c.s700, T.c.s700];
  const idx = Math.max(0, score - 1);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8, padding: '0 4px' }}>
      <div style={{ display: 'flex', gap: 4, flex: 1 }}>
        {[0,1,2,3,4].map(i => (
          <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i < score ? colors[idx] : T.c.n200, transition: 'background 200ms' }}/>
        ))}
      </div>
      <div style={{ fontSize: 12, fontWeight: 600, color: colors[idx], minWidth: 70, textAlign: 'right' }}>{labels[idx]}</div>
    </div>
  );
}

function TermsToggle({ checked, onChange, children }) {
  return (
    <button onClick={() => onChange(!checked)} style={{
      display: 'flex', alignItems: 'flex-start', gap: 12,
      padding: 14, minHeight: 56,
      background: checked ? T.c.p50 : T.c.n0,
      border: `1.5px solid ${checked ? T.c.p700 : T.c.n200}`,
      borderRadius: T.r.md,
      cursor: 'pointer', textAlign: 'left', fontFamily: T.font,
      transition: 'all 160ms',
    }}>
      <div style={{
        width: 22, height: 22, borderRadius: 6, flexShrink: 0,
        background: checked ? T.c.p700 : T.c.n0,
        border: `1.5px solid ${checked ? T.c.p700 : T.c.n400}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1,
        transition: 'all 160ms',
      }}>
        {checked && <Icon name="check" size={16} color={T.c.n0}/>}
      </div>
      <div style={{ flex: 1, fontSize: 13, color: T.c.n800, lineHeight: 1.45 }}>{children}</div>
    </button>
  );
}

function computeAge(iso) {
  if (!iso) return -1;
  const dob = new Date(iso);
  if (isNaN(dob.getTime())) return -1;
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
  return age;
}

function ModalDialog({ onClose, kind = 'info', icon, title, body, primary, secondary }) {
  const bgIcon = kind === 'destructive' ? T.c.e100 : T.c.p100;
  const colorIcon = kind === 'destructive' ? T.c.e700 : T.c.p700;
  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, zIndex: 50,
      background: 'rgba(15,15,15,0.5)', display: 'flex', alignItems: 'flex-end',
      animation: 'tcFadeIn 200ms ease',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', background: T.c.n0,
        borderTopLeftRadius: 24, borderTopRightRadius: 24,
        padding: '24px 24px 28px',
        animation: 'tcSlideUp 280ms cubic-bezier(0.2, 0.8, 0.2, 1)',
      }}>
        <div style={{ width: 40, height: 4, borderRadius: 2, background: T.c.n300, margin: '0 auto 20px' }}/>
        <div style={{
          width: 56, height: 56, borderRadius: '50%', background: bgIcon,
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
        }}>
          <Icon name={icon} size={28} color={colorIcon}/>
        </div>
        <div style={{ fontSize: 20, fontWeight: 700, color: T.c.n950, marginBottom: 8, lineHeight: 1.25 }}>{title}</div>
        <div style={{ fontSize: 14, color: T.c.n600, lineHeight: 1.5, marginBottom: 24 }}>{body}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {primary && <Button variant={kind === 'destructive' ? 'destructive' : 'primary'} size="lg" fullWidth onClick={primary.onClick}>{primary.label}</Button>}
          {secondary && <Button variant="ghost" size="lg" fullWidth onClick={secondary.onClick}>{secondary.label}</Button>}
        </div>
      </div>
    </div>
  );
}



// ─── Recuperar Senha (2 etapas) ─────────────────────────
function RecuperarSenhaScreen({ go }) {
  const [step, setStep] = React.useState(0);
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const submit = () => {
    if (!emailValid) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep(1); }, 800);
  };
  const back = () => step > 0 ? setStep(0) : go('login');

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n0 }}>
      {/* Header padrão · back + logo+nome */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 8px 8px 4px', minHeight: 56, borderBottom: `1px solid ${T.c.n100}` }}>
        <button onClick={back} style={{ width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', color: T.c.n950 }}>
          <Icon name="arrow_back" size={24}/>
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <TchinLogo size={22} color={T.c.p700}/>
          <span style={{ fontSize: 16, fontWeight: 600, color: T.c.n950 }}>Tchin Tchin</span>
        </div>
      </div>

      {/* Progress 1 de 2 */}
      <div style={{ padding: '16px 24px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ display: 'flex', gap: 6, flex: 1 }}>
          {[0,1].map(i => (
            <div key={i} style={{ flex: 1, height: 6, borderRadius: 3, background: i <= step ? T.c.p700 : T.c.n200, transition: 'background 240ms' }}/>
          ))}
        </div>
        <div style={{ fontFamily: T.mono, fontSize: 12, fontWeight: 600, color: T.c.n600 }}>
          {step + 1} de 2
        </div>
      </div>

      {step === 0 ? (
        <React.Fragment>
          <div style={{ padding: '20px 24px 8px' }}>
            <div style={{ fontSize: 22, lineHeight: 1.2, fontWeight: 700, color: T.c.n950, marginBottom: 4, textWrap: 'balance' }}>
              Vamos recuperar sua senha
            </div>
            <div style={{ fontSize: 14, color: T.c.n600, lineHeight: 1.45 }}>
              Enviamos um link de redefinição pro e-mail cadastrado.
            </div>
          </div>
          <div style={{ flex: 1, padding: '12px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input label="E-mail*" type="email" value={email} onChange={setEmail}
                   placeholder="Digite seu e-mail" autoFocus
                   leading={<Icon name="mail" size={18}/>}
                   error={email.length > 0 && !emailValid ? 'E-mail inválido.' : ''}/>
          </div>
          <div style={{ padding: '12px 24px 24px', background: T.c.n0, borderTop: `1px solid ${T.c.n100}` }}>
            <Button variant="primary" size="lg" fullWidth disabled={!emailValid} loading={loading} onClick={submit}>
              {loading ? 'Enviando…' : 'Enviar link de redefinição'}
            </Button>
          </div>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <div style={{ flex: 1, padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 18 }}>
            <div style={{ width: 88, height: 88, borderRadius: '50%', background: T.c.s100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="mark_email_read" size={44} color={T.c.s700}/>
            </div>
            <div style={{ fontSize: 22, lineHeight: 1.2, fontWeight: 700, color: T.c.n950, textWrap: 'balance', maxWidth: 320 }}>
              Confere sua caixa de entrada
            </div>
            <div style={{ fontSize: 14, color: T.c.n600, lineHeight: 1.5, maxWidth: 300 }}>
              Mandamos um link de redefinição para <strong style={{ color: T.c.n950 }}>{email}</strong>. O link expira em 30 minutos.
            </div>
            <div style={{ marginTop: 8, padding: 12, background: T.c.n100, borderRadius: T.r.md, fontSize: 12, color: T.c.n600, maxWidth: 320 }}>
              Não chegou? Verifica o spam ou tenta de novo em 60s.
            </div>
          </div>
          <div style={{ padding: '12px 24px 24px', display: 'flex', flexDirection: 'column', gap: 8, borderTop: `1px solid ${T.c.n100}` }}>
            <Button variant="primary" size="lg" fullWidth onClick={() => go('login')}>Voltar para login</Button>
            <Button variant="ghost" size="lg" fullWidth onClick={() => setStep(0)}>Reenviar e-mail</Button>
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

Object.assign(window, {
  WelcomeScreen, OnboardingScreen, LoginScreen, CadastroScreen, OnboardingIllo,
  RecuperarSenhaScreen,
  ModalDialog, TermsToggle, PwdMeter,
});


export { CadastroScreen, GoogleG, LoginScreen, ModalDialog, OnboardingIllo, OnboardingScreen, PwdMeter, RecuperarSenhaScreen, TermsToggle, WelcomeScreen, computeAge, scorePwd };
