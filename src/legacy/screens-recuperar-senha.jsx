/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { Button } from './components.jsx';
import { Icon, T } from './tokens.jsx';

// ─────────────────────────────────────────────────────────────
// Tchin Tchin — Recuperar senha (fluxo completo, 5 telas)
//
//   25.01 recuperar-email      → pedir e-mail
//   25.02 recuperar-enviado    → confirmação envio (with reenviar / abrir email)
//   25.03 recuperar-otp        → digitar código de 6 dígitos
//   25.04 recuperar-redefinir  → nova senha + confirmar
//   25.05 recuperar-sucesso    → sucesso + CTA voltar pro login
// ─────────────────────────────────────────────────────────────

function RecSenhaShell({ step, total, title, subtitle, children, onBack }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n0, overflow: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '8px 8px 4px' }}>
        <button onClick={onBack} style={{
          width: 44, height: 44, background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}><Icon name="arrow_back" size={24} color={T.c.n950}/></button>
        <div style={{ flex: 1 }}/>
        <div style={{
          ...T.t.caption, color: T.c.n600, fontFamily: T.mono,
          padding: '4px 10px', background: T.c.n100, borderRadius: T.r.full, marginRight: 12,
        }}>{step}/{total}</div>
      </div>
      <div style={{ padding: '8px 24px 24px' }}>
        <div style={{ ...T.t.h1, color: T.c.n950, marginBottom: 8, fontFamily: '"Fraunces", Georgia, serif', fontWeight: 600, letterSpacing: '-0.02em' }}>{title}</div>
        {subtitle && <div style={{ ...T.t.bodyLg, color: T.c.n600, marginBottom: 28, lineHeight: 1.5 }}>{subtitle}</div>}
        {children}
      </div>
    </div>
  );
}

// 25.01 ─────────────────────────────────────────────────
function RecuperarEmailScreen({ go }) {
  const [email, setEmail] = React.useState('');
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  return (
    <RecSenhaShell step={1} total={4} onBack={() => go('back')}
      title="Esqueceu a senha?"
      subtitle="Tudo bem. Manda o e-mail que usou no cadastro e a gente envia um código de 6 dígitos.">
      <div style={{ ...T.t.label, color: T.c.n800, marginBottom: 6 }}>E-mail</div>
      <input autoFocus type="email" inputMode="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="voce@email.com" style={{
        width: '100%', padding: '14px 16px', border: `1.5px solid ${email && !valid ? T.c.e700 : T.c.n300}`,
        borderRadius: T.r.md, background: T.c.n0, fontFamily: T.font, fontSize: 16, color: T.c.n950,
        outline: 'none', boxSizing: 'border-box', marginBottom: 8,
      }}/>
      {email && !valid && <div style={{ ...T.t.caption, color: T.c.e700, marginBottom: 12 }}>Esse e-mail não parece válido.</div>}
      <div style={{ marginTop: 20 }}>
        <Button variant="primary" size="lg" fullWidth disabled={!valid} onClick={() => go('recuperar-enviado', { email })}>
          Enviar código
        </Button>
      </div>
      <div style={{ marginTop: 16, padding: 14, background: T.c.n100, borderRadius: T.r.md, display: 'flex', gap: 10 }}>
        <Icon name="info" size={18} color={T.c.n600}/>
        <div style={{ ...T.t.caption, color: T.c.n800, lineHeight: 1.5 }}>
          Não tem mais acesso a esse e-mail? <button onClick={() => go('suporte-contato')} style={{ background: 'none', border: 'none', padding: 0, color: T.c.p700, fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>Fale com o suporte.</button>
        </div>
      </div>
    </RecSenhaShell>
  );
}

// 25.02 ─────────────────────────────────────────────────
function RecuperarEnviadoScreen({ go, params }) {
  const email = (params && params.email) || 'seu e-mail';
  const [cooldown, setCooldown] = React.useState(0);
  React.useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);
  return (
    <RecSenhaShell step={2} total={4} onBack={() => go('back')} title="Confere o e-mail">
      <div style={{
        width: 72, height: 72, borderRadius: '50%', background: T.c.p50,
        display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '8px 0 20px',
      }}>
        <Icon name="mark_email_read" size={36} color={T.c.p700}/>
      </div>
      <div style={{ ...T.t.bodyLg, color: T.c.n800, lineHeight: 1.5, marginBottom: 8 }}>
        Mandamos um código de 6 dígitos pra <strong style={{ color: T.c.n950 }}>{email}</strong>.
      </div>
      <div style={{ ...T.t.body, color: T.c.n600, marginBottom: 28 }}>
        Pode demorar até 2 minutinhos. Confere também a caixa de spam.
      </div>
      <Button variant="primary" size="lg" fullWidth onClick={() => go('recuperar-otp', { email })}>
        Digitar código
      </Button>
      <div style={{ marginTop: 12 }}>
        <Button variant="ghost" size="lg" fullWidth
          disabled={cooldown > 0}
          onClick={() => { setCooldown(30); go('toast', { kind: 'success', message: 'Código reenviado.' }); }}>
          {cooldown > 0 ? `Reenviar em ${cooldown}s` : 'Reenviar código'}
        </Button>
      </div>
      <button onClick={() => go('recuperar-email')} style={{
        background: 'none', border: 'none', cursor: 'pointer',
        color: T.c.n600, fontFamily: T.font, fontSize: 13, fontWeight: 500,
        marginTop: 16, padding: '8px 0', textDecoration: 'underline',
      }}>Usar outro e-mail</button>
    </RecSenhaShell>
  );
}

// 25.03 ─────────────────────────────────────────────────
function RecuperarOtpScreen({ go, params }) {
  const email = (params && params.email) || '';
  const [digits, setDigits] = React.useState(['', '', '', '', '', '']);
  const [error, setError] = React.useState(false);
  const refs = React.useRef([]);
  const setAt = (i, v) => {
    const clean = v.replace(/\D/g, '').slice(0, 1);
    setDigits(d => { const c = [...d]; c[i] = clean; return c; });
    if (clean && i < 5) refs.current[i + 1] && refs.current[i + 1].focus();
  };
  const code = digits.join('');
  const submit = () => {
    if (code === '000000') { setError(true); return; }
    setError(false);
    go('recuperar-redefinir', { email, code });
  };
  return (
    <RecSenhaShell step={2} total={4} onBack={() => go('back')}
      title="Digita o código"
      subtitle={`Enviamos 6 dígitos pra ${email || 'seu e-mail'}. Cola ou digita abaixo.`}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
        {digits.map((d, i) => (
          <input key={i} ref={el => refs.current[i] = el} value={d}
            onChange={e => setAt(i, e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Backspace' && !digits[i] && i > 0) refs.current[i - 1] && refs.current[i - 1].focus();
            }}
            inputMode="numeric" maxLength={1}
            style={{
              flex: 1, height: 56, textAlign: 'center', fontFamily: T.mono, fontSize: 22, fontWeight: 600,
              color: T.c.n950, background: T.c.n0,
              border: `1.5px solid ${error ? T.c.e700 : (d ? T.c.p700 : T.c.n300)}`,
              borderRadius: T.r.md, outline: 'none',
            }}/>
        ))}
      </div>
      {error && <div style={{ ...T.t.caption, color: T.c.e700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
        <Icon name="error" size={16} color={T.c.e700}/>Código inválido ou expirado.
      </div>}
      <div style={{ marginTop: 20 }}>
        <Button variant="primary" size="lg" fullWidth disabled={code.length < 6} onClick={submit}>Continuar</Button>
      </div>
      <div style={{ ...T.t.caption, color: T.c.n600, textAlign: 'center', marginTop: 16 }}>
        Dica: pra testar erro, digite <strong style={{ fontFamily: T.mono, color: T.c.n800 }}>000000</strong>.
      </div>
    </RecSenhaShell>
  );
}

// 25.04 ─────────────────────────────────────────────────
function RecuperarRedefinirScreen({ go }) {
  const [p1, setP1] = React.useState('');
  const [p2, setP2] = React.useState('');
  const [show, setShow] = React.useState(false);
  const longEnough = p1.length >= 8;
  const hasNumber  = /\d/.test(p1);
  const hasCase    = /[a-z]/.test(p1) && /[A-Z]/.test(p1);
  const match      = p1 && p1 === p2;
  const ok = longEnough && hasNumber && hasCase && match;
  const Rule = ({ ok, label }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <Icon name={ok ? 'check_circle' : 'radio_button_unchecked'} size={16} color={ok ? T.c.s700 : T.c.n400} fill={ok ? 1 : 0}/>
      <span style={{ ...T.t.caption, color: ok ? T.c.s700 : T.c.n600 }}>{label}</span>
    </div>
  );
  return (
    <RecSenhaShell step={3} total={4} onBack={() => go('back')}
      title="Cria a senha nova"
      subtitle="Mínimo 8 caracteres, com uma letra maiúscula e um número.">
      <div style={{ ...T.t.label, color: T.c.n800, marginBottom: 6 }}>Nova senha</div>
      <div style={{ position: 'relative', marginBottom: 12 }}>
        <input type={show ? 'text' : 'password'} value={p1} onChange={e => setP1(e.target.value)} autoFocus style={{
          width: '100%', padding: '14px 48px 14px 16px', border: `1.5px solid ${T.c.n300}`,
          borderRadius: T.r.md, fontFamily: T.font, fontSize: 16, color: T.c.n950, outline: 'none', boxSizing: 'border-box',
        }}/>
        <button onClick={() => setShow(s => !s)} style={{
          position: 'absolute', right: 8, top: 8, width: 36, height: 36,
          background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}><Icon name={show ? 'visibility_off' : 'visibility'} size={20} color={T.c.n600}/></button>
      </div>
      <div style={{ ...T.t.label, color: T.c.n800, marginBottom: 6 }}>Confirma a nova senha</div>
      <input type={show ? 'text' : 'password'} value={p2} onChange={e => setP2(e.target.value)} style={{
        width: '100%', padding: '14px 16px', border: `1.5px solid ${p2 && !match ? T.c.e700 : T.c.n300}`,
        borderRadius: T.r.md, fontFamily: T.font, fontSize: 16, color: T.c.n950, outline: 'none', boxSizing: 'border-box', marginBottom: 12,
      }}/>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: 12, background: T.c.n50, borderRadius: T.r.md, marginBottom: 24 }}>
        <Rule ok={longEnough} label="Pelo menos 8 caracteres"/>
        <Rule ok={hasCase}    label="Uma maiúscula e uma minúscula"/>
        <Rule ok={hasNumber}  label="Pelo menos um número"/>
        <Rule ok={match}      label="As duas senhas batem"/>
      </div>
      <Button variant="primary" size="lg" fullWidth disabled={!ok} onClick={() => go('recuperar-sucesso')}>
        Redefinir senha
      </Button>
    </RecSenhaShell>
  );
}

// 25.05 ─────────────────────────────────────────────────
function RecuperarSucessoScreen({ go }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n0, padding: '40px 24px', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <div style={{
        width: 96, height: 96, borderRadius: '50%', background: T.c.s100,
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24,
        animation: 'tcDrawIn 400ms cubic-bezier(0.2, 0.8, 0.2, 1)',
      }}>
        <Icon name="check_circle" size={56} color={T.c.s700} fill={1}/>
      </div>
      <div style={{ ...T.t.h1, color: T.c.n950, marginBottom: 8, fontFamily: '"Fraunces", Georgia, serif' }}>Senha redefinida!</div>
      <div style={{ ...T.t.bodyLg, color: T.c.n600, marginBottom: 36, maxWidth: 320, lineHeight: 1.5 }}>
        Pode entrar com a nova. A gente também desconectou as outras sessões pra ficar seguro.
      </div>
      <div style={{ width: '100%', maxWidth: 320 }}>
        <Button variant="primary" size="lg" fullWidth onClick={() => go('login')}>Voltar pro login</Button>
      </div>
    </div>
  );
}

Object.assign(window, {
  RecuperarEmailScreen, RecuperarEnviadoScreen, RecuperarOtpScreen,
  RecuperarRedefinirScreen, RecuperarSucessoScreen,
});


export { RecSenhaShell, RecuperarEmailScreen, RecuperarEnviadoScreen, RecuperarOtpScreen, RecuperarRedefinirScreen, RecuperarSucessoScreen };
