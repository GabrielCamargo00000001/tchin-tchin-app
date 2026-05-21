/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { SubHeader } from './components.jsx';
import { MOCK_USER } from './data.jsx';
import { Icon, T } from './tokens.jsx';

// ─────────────────────────────────────────────────────────────
// 14.02 · Configuracoes — settings screen
//
//   <Configuracoes
//     go={(screen, params) => ...}
//     ctx={{ user, settings }}
//   />
// ─────────────────────────────────────────────────────────────

const APP_VERSION = '1.0.0 (build 1452)';

const WINE_TYPES = ['Tinto', 'Branco', 'Rosé', 'Espumante', 'Sobremesa', 'Fortificado'];

const DEFAULT_SETTINGS = {
  notifications: {
    push: true,
    email: true,
    eventReminders: true,
    weeklyChallenges: true,
    monthlyDigest: false,
    brotherhoodActivity: true,
  },
  privacy: {
    publicProfile: true,
    publicDiary: false,
    cellarVisible: true,
    allowDMs: true,
  },
  permissions: {
    location: 'granted',     // 'granted' | 'denied' | 'never_asked'
    camera: 'granted',
    photos: 'denied',
  },
  preferences: {
    language: 'Português (Brasil)',
    priceRange: [80, 350],
    preferredTypes: ['Tinto', 'Espumante'],
  },
};

function Configuracoes({ go = () => {}, ctx = {} }) {
  const user = ctx.user || (typeof MOCK_USER !== 'undefined' ? MOCK_USER : { name: 'Você', email: 'voce@email.com' });
  const initial = ctx.settings || DEFAULT_SETTINGS;

  const [settings, setSettings] = React.useState(initial);

  const patch = (path, value) => {
    setSettings(prev => {
      const next = { ...prev };
      const segments = path.split('.');
      let ref = next;
      for (let i = 0; i < segments.length - 1; i++) {
        ref[segments[i]] = { ...ref[segments[i]] };
        ref = ref[segments[i]];
      }
      ref[segments[segments.length - 1]] = value;
      return next;
    });
  };

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      background: T.c.n50, fontFamily: T.font, overflow: 'hidden',
    }}>
      <SubHeader title="Configurações" onBack={() => go('home')}/>

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>

        {/* ─── CONTA ────────────────────────────────────────────── */}
        <SettingsSection title="Conta">
          <SettingsRow
            icon="mail"
            label="Email"
            sub={user.email || 'voce@email.com'}
            disabled
          />
          <SettingsRow
            icon="lock"
            label="Alterar senha"
            sub="Última atualização há 3 meses"
            onTap={() => go('change-password')}
          />
          <SettingsRow
            icon="delete_forever"
            label="Excluir conta"
            destructive
            onTap={() => go('delete-account')}
          />
        </SettingsSection>

        {/* ─── NOTIFICAÇÕES ─────────────────────────────────────── */}
        <SettingsSection title="Notificações" subtitle="Como queremos te avisar">
          <SettingsToggleRow
            icon="notifications"
            label="Push notifications"
            sub="No celular, em tempo real"
            value={settings.notifications.push}
            onChange={(v) => patch('notifications.push', v)}
          />
          <SettingsToggleRow
            icon="alternate_email"
            label="Email"
            sub="Resumos e novidades"
            value={settings.notifications.email}
            onChange={(v) => patch('notifications.email', v)}
          />
          <SettingsToggleRow
            icon="event"
            label="Lembretes de evento"
            sub="D-3, D-1 e dia do encontro"
            value={settings.notifications.eventReminders}
            onChange={(v) => patch('notifications.eventReminders', v)}
          />
          <SettingsToggleRow
            icon="flag"
            label="Desafios semanais"
            sub="Toda quinta-feira"
            value={settings.notifications.weeklyChallenges}
            onChange={(v) => patch('notifications.weeklyChallenges', v)}
          />
          <SettingsToggleRow
            icon="calendar_month"
            label="Resumo mensal"
            sub="Sua jornada do mês"
            value={settings.notifications.monthlyDigest}
            onChange={(v) => patch('notifications.monthlyDigest', v)}
          />
          <SettingsToggleRow
            icon="groups"
            label="Confraria — atividade"
            sub="Posts e mensagens importantes"
            value={settings.notifications.brotherhoodActivity}
            onChange={(v) => patch('notifications.brotherhoodActivity', v)}
            last
          />
        </SettingsSection>

        {/* ─── PRIVACIDADE ──────────────────────────────────────── */}
        <SettingsSection title="Privacidade" subtitle="Quem pode ver seu conteúdo">
          <SettingsToggleRow
            icon="badge"
            label="Perfil público"
            sub="Qualquer um pode ver seu perfil"
            value={settings.privacy.publicProfile}
            onChange={(v) => patch('privacy.publicProfile', v)}
          />
          <SettingsToggleRow
            icon="auto_stories"
            label="Diário público"
            sub="Outros usuários veem o que você bebeu"
            value={settings.privacy.publicDiary}
            onChange={(v) => patch('privacy.publicDiary', v)}
          />
          <SettingsToggleRow
            icon="cellar"
            label="Adega visível"
            sub="Aparece em Adegas Espelho de amigos"
            value={settings.privacy.cellarVisible}
            onChange={(v) => patch('privacy.cellarVisible', v)}
          />
          <SettingsToggleRow
            icon="forum"
            label="Permitir mensagens diretas"
            sub="DMs de quem não é da sua confraria"
            value={settings.privacy.allowDMs}
            onChange={(v) => patch('privacy.allowDMs', v)}
            last
          />
        </SettingsSection>

        {/* ─── PERMISSÕES ───────────────────────────────────────── */}
        <SettingsSection title="Permissões" subtitle="Acesso a recursos do celular">
          <PermissionRow
            icon="location_on"
            label="Localização"
            status={settings.permissions.location}
            onTap={() => go('settings-permissions', { kind: 'location' })}
          />
          <PermissionRow
            icon="photo_camera"
            label="Câmera"
            status={settings.permissions.camera}
            onTap={() => go('settings-permissions', { kind: 'camera' })}
          />
          <PermissionRow
            icon="photo_library"
            label="Galeria"
            status={settings.permissions.photos}
            onTap={() => go('settings-permissions', { kind: 'photos' })}
            last
          />
        </SettingsSection>

        {/* ─── PREFERÊNCIAS ─────────────────────────────────────── */}
        <SettingsSection title="Preferências">
          <SettingsRow
            icon="language"
            label="Idioma"
            sub={settings.preferences.language}
            onTap={() => go('settings-language')}
          />
          <PriceRangeRow
            value={settings.preferences.priceRange}
            onChange={(v) => patch('preferences.priceRange', v)}
          />
          <PreferredTypesRow
            value={settings.preferences.preferredTypes}
            onChange={(v) => patch('preferences.preferredTypes', v)}
            last
          />
        </SettingsSection>

        {/* ─── SOBRE ────────────────────────────────────────────── */}
        <SettingsSection title="Sobre">
          <SettingsRow
            icon="info"
            label="Versão do app"
            sub={APP_VERSION}
            disabled
          />
          <SettingsRow
            icon="gavel"
            label="Termos de uso"
            onTap={() => go('terms')}
          />
          <SettingsRow
            icon="privacy_tip"
            label="Política de privacidade"
            onTap={() => go('privacy-policy')}
          />
          <SettingsRow
            icon="code"
            label="Open source licenses"
            onTap={() => go('oss')}
          />
          <SettingsRow
            icon="star_rate"
            label="Avalie o app"
            sub="Adoramos receber 5 estrelas 🍷"
            onTap={() => go('rate-app')}
            last
          />
        </SettingsSection>

        {/* ─── LOGOUT BUTTON ────────────────────────────────────── */}
        <div style={{ padding: '24px 16px 32px' }}>
          <button
            onClick={() => go('logout')}
            style={{
              width: '100%',
              height: 48,
              background: 'transparent',
              border: `1.5px solid ${T.c.p100}`,
              color: T.c.p700,
              borderRadius: T.r.md,
              fontFamily: T.font,
              fontSize: 14, fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'background 120ms, border-color 120ms',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = T.c.p50; e.currentTarget.style.borderColor = T.c.p300 || '#C97D87'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent';   e.currentTarget.style.borderColor = T.c.p100; }}
          >
            <Icon name="logout" size={18} color={T.c.p700}/>
            Sair
          </button>
          <div style={{
            marginTop: 16,
            fontSize: 11, color: T.c.n400, textAlign: 'center',
            letterSpacing: 0.2,
          }}>
            Tchin Tchin · {APP_VERSION}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Section wrapper ──────────────────────────────────────────
function SettingsSection({ title, subtitle, children }) {
  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ padding: '0 20px 8px' }}>
        <div style={{
          fontFamily: T.font,
          fontSize: 11, fontWeight: 700,
          color: T.c.p700,
          textTransform: 'uppercase',
          letterSpacing: 0.6,
        }}>{title}</div>
        {subtitle && (
          <div style={{
            fontSize: 12, color: T.c.n600,
            marginTop: 2, lineHeight: 1.4,
          }}>{subtitle}</div>
        )}
      </div>
      <div style={{
        background: T.c.n0,
        border: `1px solid ${T.c.n200}`,
        borderTop: `1px solid ${T.c.n200}`,
        borderBottom: `1px solid ${T.c.n200}`,
        marginInline: 0,
        display: 'flex', flexDirection: 'column',
      }}>
        {children}
      </div>
    </div>
  );
}

// ─── Plain row (label + sub + chevron) ────────────────────────
function SettingsRow({ icon, label, sub, onTap, disabled, destructive, last, right }) {
  const [hover, setHover] = React.useState(false);
  const interactive = !!onTap && !disabled;

  const labelColor = destructive ? T.c.e700 : T.c.n950;
  const iconColor  = destructive ? T.c.e700 : T.c.n800;

  return (
    <button
      type="button"
      onClick={interactive ? onTap : undefined}
      onMouseEnter={() => interactive && setHover(true)}
      onMouseLeave={() => setHover(false)}
      disabled={!interactive}
      style={{
        width: '100%',
        background: hover ? T.c.n50 : T.c.n0,
        border: 'none',
        borderBottom: last ? 'none' : `1px solid ${T.c.n100}`,
        padding: '14px 20px',
        display: 'flex', alignItems: 'center', gap: 14,
        cursor: interactive ? 'pointer' : 'default',
        textAlign: 'left',
        fontFamily: T.font,
        transition: 'background 120ms',
      }}
    >
      <Icon name={icon} size={22} color={iconColor}/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 14, fontWeight: 600,
          color: labelColor,
          lineHeight: 1.3,
        }}>{label}</div>
        {sub && (
          <div style={{
            fontSize: 12, color: T.c.n600, marginTop: 2,
            lineHeight: 1.4,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{sub}</div>
        )}
      </div>
      {right || (interactive && !destructive && (
        <Icon name="chevron_right" size={18} color={T.c.n400}/>
      ))}
    </button>
  );
}

// ─── Toggle row ───────────────────────────────────────────────
function SettingsToggleRow({ icon, label, sub, value, onChange, last }) {
  return (
    <div
      style={{
        width: '100%',
        background: T.c.n0,
        borderBottom: last ? 'none' : `1px solid ${T.c.n100}`,
        padding: '14px 20px',
        display: 'flex', alignItems: 'center', gap: 14,
        fontFamily: T.font,
      }}
    >
      <Icon name={icon} size={22} color={T.c.n800}/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 14, fontWeight: 600, color: T.c.n950, lineHeight: 1.3,
        }}>{label}</div>
        {sub && (
          <div style={{
            fontSize: 12, color: T.c.n600, marginTop: 2, lineHeight: 1.4,
          }}>{sub}</div>
        )}
      </div>
      <Switch value={value} onChange={onChange} ariaLabel={label}/>
    </div>
  );
}

// ─── Switch atom ──────────────────────────────────────────────
function Switch({ value, onChange, ariaLabel }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      aria-label={ariaLabel}
      onClick={() => onChange(!value)}
      style={{
        width: 44, height: 26, borderRadius: 13,
        background: value ? T.c.p700 : T.c.n300,
        position: 'relative',
        border: 'none', padding: 0,
        cursor: 'pointer', flexShrink: 0,
        transition: 'background 180ms',
        outline: 'none',
      }}
    >
      <div style={{
        position: 'absolute',
        top: 3, left: value ? 21 : 3,
        width: 20, height: 20, borderRadius: '50%',
        background: T.c.n0,
        boxShadow: '0 1px 3px rgba(0,0,0,0.18), 0 1px 2px rgba(0,0,0,0.10)',
        transition: 'left 200ms cubic-bezier(0.2, 0.8, 0.2, 1)',
      }}/>
    </button>
  );
}

// ─── Permission row ───────────────────────────────────────────
function PermissionRow({ icon, label, status, onTap, last }) {
  const statusMap = {
    granted:     { label: 'Permitido',    fg: T.c.s700, bg: T.c.s100 || '#E8F5E9' },
    denied:      { label: 'Negado',       fg: T.c.e700, bg: T.c.e100 || '#FFEBEE' },
    never_asked: { label: 'Não solicitado', fg: T.c.n600, bg: T.c.n100 },
  };
  const s = statusMap[status] || statusMap.never_asked;
  return (
    <SettingsRow
      icon={icon}
      label={label}
      onTap={onTap}
      last={last}
      right={
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
        }}>
          <span style={{
            padding: '3px 8px', borderRadius: 9999,
            background: s.bg, color: s.fg,
            fontSize: 11, fontWeight: 700,
            letterSpacing: 0.2,
          }}>{s.label}</span>
          <Icon name="chevron_right" size={18} color={T.c.n400}/>
        </span>
      }
    />
  );
}

// ─── Price range row (slider de R$ a R$) ───────────────────
function PriceRangeRow({ value, onChange, last }) {
  const [min, max] = value || [0, 500];
  const ABS_MIN = 0;
  const ABS_MAX = 1000;

  return (
    <div style={{
      width: '100%',
      background: T.c.n0,
      borderBottom: last ? 'none' : `1px solid ${T.c.n100}`,
      padding: '16px 20px',
      display: 'flex', flexDirection: 'column', gap: 12,
      fontFamily: T.font,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <Icon name="payments" size={22} color={T.c.n800}/>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 14, fontWeight: 600, color: T.c.n950, lineHeight: 1.3,
          }}>Faixa de preço de interesse</div>
          <div style={{
            fontSize: 12, color: T.c.n600, marginTop: 2, lineHeight: 1.4,
          }}>R$ {min} — R$ {max}</div>
        </div>
      </div>
      <DualRangeSlider
        min={ABS_MIN}
        max={ABS_MAX}
        step={10}
        value={[min, max]}
        onChange={onChange}
      />
    </div>
  );
}

// ─── Dual-handle range slider ─────────────────────────────────
function DualRangeSlider({ min, max, step, value, onChange }) {
  const [lo, hi] = value;
  const trackRef = React.useRef(null);
  const dragging = React.useRef(null);

  const pctLo = ((lo - min) / (max - min)) * 100;
  const pctHi = ((hi - min) / (max - min)) * 100;

  const valueFromX = (clientX) => {
    const rect = trackRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const raw = min + ratio * (max - min);
    return Math.round(raw / step) * step;
  };

  const onPointerDown = (which) => (e) => {
    e.preventDefault();
    e.target.setPointerCapture && e.target.setPointerCapture(e.pointerId);
    dragging.current = which;
  };
  const onPointerMove = (e) => {
    if (!dragging.current) return;
    const v = valueFromX(e.clientX);
    if (dragging.current === 'lo') {
      onChange([Math.min(v, hi - step), hi]);
    } else {
      onChange([lo, Math.max(v, lo + step)]);
    }
  };
  const onPointerUp = () => { dragging.current = null; };

  return (
    <div
      ref={trackRef}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{
        position: 'relative',
        height: 28,
        marginInline: 12,
        touchAction: 'none',
      }}
    >
      {/* Rail */}
      <div style={{
        position: 'absolute', top: 12, left: 0, right: 0,
        height: 4, borderRadius: 2,
        background: T.c.n200,
      }}/>
      {/* Active range */}
      <div style={{
        position: 'absolute', top: 12,
        left: `${pctLo}%`, width: `${pctHi - pctLo}%`,
        height: 4, borderRadius: 2,
        background: T.c.p700,
      }}/>
      {/* Lo thumb */}
      <SliderThumb
        leftPct={pctLo}
        onPointerDown={onPointerDown('lo')}
      />
      {/* Hi thumb */}
      <SliderThumb
        leftPct={pctHi}
        onPointerDown={onPointerDown('hi')}
      />
    </div>
  );
}
function SliderThumb({ leftPct, onPointerDown }) {
  return (
    <div
      onPointerDown={onPointerDown}
      role="slider"
      aria-orientation="horizontal"
      style={{
        position: 'absolute',
        top: 4, left: `calc(${leftPct}% - 10px)`,
        width: 20, height: 20, borderRadius: '50%',
        background: T.c.n0,
        border: `2.5px solid ${T.c.p700}`,
        boxShadow: '0 1px 4px rgba(0,0,0,0.18)',
        cursor: 'grab', touchAction: 'none',
        transition: 'transform 80ms',
      }}
      onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
    />
  );
}

// ─── Preferred wine types (multi-select chips) ────────────────
function PreferredTypesRow({ value, onChange, last }) {
  const toggle = (t) => {
    const next = value.includes(t) ? value.filter(x => x !== t) : [...value, t];
    onChange(next);
  };
  return (
    <div style={{
      width: '100%',
      background: T.c.n0,
      borderBottom: last ? 'none' : `1px solid ${T.c.n100}`,
      padding: '16px 20px',
      display: 'flex', flexDirection: 'column', gap: 12,
      fontFamily: T.font,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <Icon name="wine_bar" size={22} color={T.c.n800}/>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 14, fontWeight: 600, color: T.c.n950, lineHeight: 1.3,
          }}>Tipos preferidos</div>
          <div style={{
            fontSize: 12, color: T.c.n600, marginTop: 2, lineHeight: 1.4,
          }}>{value.length === 0 ? 'Nenhum selecionado' : `${value.length} ${value.length === 1 ? 'selecionado' : 'selecionados'}`}</div>
        </div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {WINE_TYPES.map(t => {
          const active = value.includes(t);
          return (
            <button
              key={t}
              type="button"
              onClick={() => toggle(t)}
              style={{
                padding: '7px 12px',
                borderRadius: 9999,
                border: `1.5px solid ${active ? T.c.p700 : T.c.n200}`,
                background: active ? T.c.p50 : T.c.n0,
                color: active ? T.c.p700 : T.c.n800,
                fontSize: 12, fontWeight: 600,
                cursor: 'pointer',
                fontFamily: T.font,
                transition: 'background 120ms, border-color 120ms, color 120ms',
                display: 'inline-flex', alignItems: 'center', gap: 4,
              }}
            >
              {active && <Icon name="check" size={12} color={T.c.p700}/>}
              {t}
            </button>
          );
        })}
      </div>
    </div>
  );
}

Object.assign(window, { Configuracoes, DEFAULT_SETTINGS });


export { APP_VERSION, Configuracoes, DEFAULT_SETTINGS, DualRangeSlider, PermissionRow, PreferredTypesRow, PriceRangeRow, SettingsRow, SettingsSection, SettingsToggleRow, SliderThumb, Switch, WINE_TYPES };
