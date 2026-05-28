/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { Button } from './components.jsx';
import { Icon, T } from './tokens.jsx';

// ─────────────────────────────────────────────────────────────
// Tchin Tchin — Onboarding alternativo
//
//   34.01 login-social        → social picker (Google, Apple, E-mail/senha)
//   (34.02 magic-link, 34.03 OTP de telefone e 34.04 verif-concluída REMOVIDOS:
//    auth é só SSO Apple/Google + e-mail/senha; não coletamos telefone.)
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

// 34.02–04 (magic-link, OTP de telefone e verif-concluída) REMOVIDOS do produto.
// Escopo definido: auth é SSO Apple/Google + e-mail/senha. Não coletamos telefone,
// não há login por SMS/OTP nem link mágico. Gabriel decidiu.

Object.assign(window, {
  ObShell, LoginSocialScreen,
});


export { AppleGlyph, GoogleGlyph, LoginSocialScreen, ObShell, SocialBtn };
