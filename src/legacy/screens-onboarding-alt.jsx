/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { Button } from './components.jsx';
import { Icon, T } from './tokens.jsx';

// ─────────────────────────────────────────────────────────────
// Tchin Tchin — Onboarding alternativo (4 telas)
//
//   34.01 login-social        → social picker (Google, Apple, E-mail link)
//   34.02 magic-link-enviado  → magic link sent confirmation
//   34.03 verif-telefone-otp  → telefone OTP (6 dígitos)
//   34.04 verif-concluida     → confirmação visual + CTA
// ─────────────────────────────────────────────────────────────

function ObShell({ title, subtitle, onBack, children, step, total }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n0, overflow: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '8px 8px' }}>
        {onBack && (
          <button onClick={onBack} style={{ width: 44, height: 44, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="arrow_back" size={24} color={T.c.n950}/>
          </button>
        )}
        <div style={{ flex: 1 }}/>
        {step && total && (
          <div style={{ ...T.t.caption, color: T.c.n600, fontFamily: T.mono, padding: '4px 10px', background: T.c.n100, borderRadius: T.r.full, marginRight: 12 }}>{step}/{total}</div>
        )}
      </div>
      <div style={{ padding: '4px 24px 24px' }}>
        {title && <div style={{ ...T.t.h1, color: T.c.n950, marginBottom: 8, fontFamily: '"Fraunces", Georgia, serif', fontWeight: 600, letterSpacing: '-0.02em' }}>{title}</div>}
        {subtitle && <div style={{ ...T.t.bodyLg, color: T.c.n600, marginBottom: 24, lineHeight: 1.5 }}>{subtitle}</div>}
        {children}
      </div>
    </div>
  );
}

// 34.01 ─────────────────────────────────────────────────
function LoginSocialScreen({ go, mode = 'cadastro' }) {
  const isLogin = mode === 'login';
  return (
    <ObShell onBack={() => go('back')}
      title={isLogin ? 'Entrar no Tchin Tchin' : 'Criar sua conta'}
      subtitle={isLogin ? 'Escolha como você quer entrar.' : 'Em segundos. Sem precisar de senha.'}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <SocialBtn provider="google" go={go}/>
        <SocialBtn provider="apple"  go={go}/>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '12px 0' }}>
          <div style={{ flex: 1, height: 1, background: T.c.n200 }}/>
          <span style={{ ...T.t.overline, color: T.c.n600 }}>OU</span>
          <div style={{ flex: 1, height: 1, background: T.c.n200 }}/>
        </div>
        <SocialBtn provider="magic"  go={go}/>
        <SocialBtn provider="phone"  go={go}/>
        <SocialBtn provider="email"  go={go} mode={mode}/>
      </div>
      <div style={{ marginTop: 24, ...T.t.caption, color: T.c.n600, textAlign: 'center', lineHeight: 1.6 }}>
        Ao continuar você concorda com nossos <button onClick={() => go('termos')} style={{ background: 'none', border: 'none', padding: 0, color: T.c.p700, textDecoration: 'underline', cursor: 'pointer', fontWeight: 600 }}>Termos</button> e <button onClick={() => go('politica-privacidade')} style={{ background: 'none', border: 'none', padding: 0, color: T.c.p700, textDecoration: 'underline', cursor: 'pointer', fontWeight: 600 }}>Política de Privacidade</button>.
      </div>
      <div style={{ marginTop: 24, ...T.t.body, color: T.c.n800, textAlign: 'center' }}>
        {isLogin ? 'Não tem conta? ' : 'Já tem conta? '}
        <button onClick={() => go(isLogin ? 'cadastro' : 'login')} style={{ background: 'none', border: 'none', padding: 0, color: T.c.p700, fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
          {isLogin ? 'Criar agora' : 'Entrar'}
        </button>
      </div>
    </ObShell>
  );
}

function SocialBtn({ provider, go, mode = 'cadastro' }) {
  const meta = {
    google: { label: 'Continuar com Google',     bg: T.c.n0,   fg: T.c.n950, border: true,  glyph: <GoogleGlyph/> },
    apple:  { label: 'Continuar com Apple',      bg: '#000',   fg: T.c.n0,   border: false, glyph: <AppleGlyph/> },
    magic:  { label: 'Entrar com link mágico',   bg: T.c.p50,  fg: T.c.p700, border: false, glyph: <Icon name="auto_fix_high" size={20} color={T.c.p700}/>, route: 'magic-link-enviado' },
    phone:  { label: 'Continuar com telefone',   bg: T.c.n0,   fg: T.c.n950, border: true,  glyph: <Icon name="phone" size={20} color={T.c.n800}/>, route: 'verif-telefone-otp' },
    email:  { label: 'Continuar com e-mail e senha', bg: T.c.n0, fg: T.c.n800, border: true, glyph: <Icon name="mail" size={20} color={T.c.n800}/>, route: mode === 'login' ? 'login' : 'cadastro' },
  }[provider];
  return (
    <button onClick={() => {
      if (meta.route) go(meta.route);
      else go('toast', { kind: 'info', message: `Em breve: ${meta.label}.` });
    }} style={{
      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
      padding: '14px 16px', borderRadius: T.r.md,
      background: meta.bg, color: meta.fg,
      border: meta.border ? `1.5px solid ${T.c.n300}` : 'none',
      cursor: 'pointer', fontFamily: T.font, fontSize: 15, fontWeight: 600,
      minHeight: 52,
    }}>
      {meta.glyph}
      {meta.label}
    </button>
  );
}

function GoogleGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}
function AppleGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
  );
}

// 34.02 ─────────────────────────────────────────────────
function MagicLinkEnviadoScreen({ go, params }) {
  const [email, setEmail] = React.useState((params && params.email) || '');
  const [sent, setSent] = React.useState(!!(params && params.email));
  const [cooldown, setCooldown] = React.useState(0);
  React.useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!sent) {
    return (
      <ObShell onBack={() => go('back')} title="Link mágico" subtitle="Manda o e-mail. Você entra com um toque, sem precisar de senha.">
        <div style={{ ...T.t.label, color: T.c.n800, marginBottom: 6 }}>E-mail</div>
        <input autoFocus type="email" inputMode="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="voce@email.com" style={{
          width: '100%', padding: '14px 16px', border: `1.5px solid ${T.c.n300}`, borderRadius: T.r.md,
          background: T.c.n0, fontFamily: T.font, fontSize: 16, color: T.c.n950,
          outline: 'none', boxSizing: 'border-box', marginBottom: 20,
        }}/>
        <Button variant="primary" size="lg" fullWidth disabled={!valid} onClick={() => { setSent(true); setCooldown(30); }}>
          Enviar link
        </Button>
      </ObShell>
    );
  }

  return (
    <ObShell onBack={() => go('back')}>
      <div style={{
        width: 96, height: 96, borderRadius: '50%', background: T.c.p50,
        display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '24px auto 24px',
        animation: 'tcDrawIn 320ms cubic-bezier(0.2, 0.8, 0.2, 1)',
      }}>
        <Icon name="auto_fix_high" size={44} color={T.c.p700}/>
      </div>
      <div style={{ textAlign: 'center', ...T.t.h1, color: T.c.n950, marginBottom: 8, fontFamily: '"Fraunces", Georgia, serif' }}>Confere seu e-mail</div>
      <div style={{ textAlign: 'center', ...T.t.bodyLg, color: T.c.n600, lineHeight: 1.5, marginBottom: 8 }}>
        Mandamos um link mágico pra <strong style={{ color: T.c.n950 }}>{email}</strong>.
      </div>
      <div style={{ textAlign: 'center', ...T.t.body, color: T.c.n600, marginBottom: 32 }}>
        Toca no link no e-mail pra entrar direto. Válido por 15 minutos.
      </div>
      <Button variant="primary" size="lg" fullWidth leading={<Icon name="mail" size={18}/>} onClick={() => go('toast', { kind: 'info', message: 'Abrindo seu app de e-mail...' })}>
        Abrir aplicativo de e-mail
      </Button>
      <div style={{ height: 10 }}/>
      <Button variant="ghost" size="lg" fullWidth disabled={cooldown > 0} onClick={() => { setCooldown(30); go('toast', { kind: 'success', message: 'Link reenviado.' }); }}>
        {cooldown > 0 ? `Reenviar em ${cooldown}s` : 'Reenviar link'}
      </Button>
      <button onClick={() => setSent(false)} style={{
        background: 'none', border: 'none', cursor: 'pointer',
        color: T.c.n600, fontFamily: T.font, fontSize: 13, fontWeight: 500,
        marginTop: 16, padding: '8px 0', textDecoration: 'underline', width: '100%',
      }}>Usar outro e-mail</button>
    </ObShell>
  );
}

// 34.03 ─────────────────────────────────────────────────
function VerifTelefoneOtpScreen({ go, params }) {
  const [phone, setPhone] = React.useState('');
  const [sent, setSent] = React.useState(false);
  const [digits, setDigits] = React.useState(['','','','','','']);
  const [cooldown, setCooldown] = React.useState(0);
  const refs = React.useRef([]);
  React.useEffect(() => { if (cooldown <= 0) return; const t = setTimeout(() => setCooldown(c => c - 1), 1000); return () => clearTimeout(t); }, [cooldown]);
  const phoneValid = phone.replace(/\D/g, '').length >= 10;
  const code = digits.join('');

  const setAt = (i, v) => {
    const clean = v.replace(/\D/g, '').slice(0, 1);
    setDigits(d => { const c = [...d]; c[i] = clean; return c; });
    if (clean && i < 5) refs.current[i + 1] && refs.current[i + 1].focus();
  };

  if (!sent) {
    return (
      <ObShell onBack={() => go('back')} title="Continuar com telefone" subtitle="A gente envia um SMS com código de 6 dígitos.">
        <div style={{ ...T.t.label, color: T.c.n800, marginBottom: 6 }}>Seu número</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '14px 12px', border: `1.5px solid ${T.c.n300}`, borderRadius: T.r.md, background: T.c.n0, fontSize: 16, color: T.c.n950, gap: 6 }}>
            <span style={{ fontSize: 18 }}>🇧🇷</span>
            <span style={{ fontFamily: T.mono, fontWeight: 600 }}>+55</span>
          </div>
          <input value={phone} onChange={e => {
            const raw = e.target.value.replace(/\D/g, '').slice(0, 11);
            const f = raw.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
            setPhone(f);
          }} inputMode="tel" placeholder="(11) 99999-9999" style={{
            flex: 1, padding: '14px 16px', border: `1.5px solid ${T.c.n300}`, borderRadius: T.r.md,
            background: T.c.n0, fontFamily: T.font, fontSize: 16, color: T.c.n950, outline: 'none', boxSizing: 'border-box',
          }}/>
        </div>
        <div style={{ ...T.t.caption, color: T.c.n600, marginTop: 8, marginBottom: 20 }}>
          Pode rolar custo de SMS na sua operadora.
        </div>
        <Button variant="primary" size="lg" fullWidth disabled={!phoneValid} onClick={() => { setSent(true); setCooldown(45); }}>
          Enviar código
        </Button>
      </ObShell>
    );
  }

  return (
    <ObShell onBack={() => setSent(false)} title="Digita o código" subtitle={`Enviamos por SMS pra +55 ${phone}.`}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {digits.map((d, i) => (
          <input key={i} ref={el => refs.current[i] = el} value={d}
            onChange={e => setAt(i, e.target.value)}
            onKeyDown={e => { if (e.key === 'Backspace' && !digits[i] && i > 0) refs.current[i - 1] && refs.current[i - 1].focus(); }}
            inputMode="numeric" maxLength={1}
            style={{
              flex: 1, height: 56, textAlign: 'center', fontFamily: T.mono, fontSize: 22, fontWeight: 600,
              color: T.c.n950, background: T.c.n0,
              border: `1.5px solid ${d ? T.c.p700 : T.c.n300}`,
              borderRadius: T.r.md, outline: 'none',
            }}/>
        ))}
      </div>
      <Button variant="primary" size="lg" fullWidth disabled={code.length < 6} onClick={() => go('verif-concluida')}>
        Verificar
      </Button>
      <div style={{ height: 10 }}/>
      <Button variant="ghost" size="lg" fullWidth disabled={cooldown > 0} onClick={() => { setCooldown(45); go('toast', { kind: 'success', message: 'Código reenviado.' }); }}>
        {cooldown > 0 ? `Reenviar em ${cooldown}s` : 'Reenviar código'}
      </Button>
    </ObShell>
  );
}

// 34.04 ─────────────────────────────────────────────────
function VerifConcluidaScreen({ go, params }) {
  const what = (params && params.what) || 'telefone';
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n0, padding: '40px 24px', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <div style={{
        width: 120, height: 120, borderRadius: '50%', background: T.c.s100,
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24,
        animation: 'tcDrawIn 400ms cubic-bezier(0.2, 0.8, 0.2, 1)',
        boxShadow: '0 8px 24px rgba(46, 125, 50, 0.18)',
      }}>
        <Icon name="verified" size={64} color={T.c.s700} fill={1}/>
      </div>
      <div style={{ ...T.t.h1, color: T.c.n950, marginBottom: 8, fontFamily: '"Fraunces", Georgia, serif' }}>Tudo certo!</div>
      <div style={{ ...T.t.bodyLg, color: T.c.n600, marginBottom: 36, maxWidth: 320, lineHeight: 1.5 }}>
        Seu {what} foi verificado. Você ganhou um selo de conta verificada — outros membros confiam mais.
      </div>
      <div style={{ width: '100%', maxWidth: 320 }}>
        <Button variant="primary" size="lg" fullWidth onClick={() => go('quiz')}>Continuar pra calibrar o paladar</Button>
        <div style={{ height: 8 }}/>
        <Button variant="ghost" size="lg" fullWidth onClick={() => go('home')}>Pular por agora</Button>
      </div>
    </div>
  );
}

Object.assign(window, {
  ObShell, LoginSocialScreen, MagicLinkEnviadoScreen,
  VerifTelefoneOtpScreen, VerifConcluidaScreen,
});


export { AppleGlyph, GoogleGlyph, LoginSocialScreen, MagicLinkEnviadoScreen, ObShell, SocialBtn, VerifConcluidaScreen, VerifTelefoneOtpScreen };
