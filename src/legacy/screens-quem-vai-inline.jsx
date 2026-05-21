/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { fbEvent } from './screens-wizard-confraria.jsx';
import { Icon, T } from './tokens.jsx';

// Tchin Tchin — 11.03 Quem Vai Inline
// ────────────────────────────────────────────────────────────
// Linha de avatares dos primeiros confirmados + contagem total.
// Self-contained: clica no row → abre o sheet com lista completa.
//
// Frente H5. Usado no CardProximoEvento e em qualquer surface que
// precise dar "social proof" de quem confirmou um evento.

// ─── Pure component ─────────────────────────────────────────
//  props:
//    confirmedUsers: User[]      — { id, name, src?, level? }
//    totalConfirmed: number
//    onListTap?: () => void      — opcional; se omitido, usa o sheet interno
//    tone?: 'light' | 'dark'     — light=fundo claro (texto n600), dark=card escuro (texto white/80)
//    avatarBorder?: string       — cor da borda do avatar pra criar separação (default n0/white)
function QuemVaiInline({
  confirmedUsers = [],
  totalConfirmed = 0,
  onListTap,
  tone = 'light',
  avatarBorder = '#FFFFFF',
}) {
  const [showSheet, setShowSheet] = React.useState(false);

  const shown = confirmedUsers.slice(0, 5);
  const useExternalHandler = typeof onListTap === 'function';
  const handleTap = () => {
    fbEvent('event_attendees_opened', { total: totalConfirmed, source: useExternalHandler ? 'caller' : 'inline_sheet' });
    if (useExternalHandler) onListTap();
    else setShowSheet(true);
  };

  // Show "+N" pill when there are MORE confirmed than shown.
  // If total ≤ 5, show all real avatars and skip the +N pill.
  const overflowCount = Math.max(0, totalConfirmed - shown.length);

  const captionColor = tone === 'dark' ? 'rgba(255,255,255,0.85)' : T.c.n600;

  return (
    <>
      <button
        onClick={handleTap}
        aria-label={`${totalConfirmed} ${totalConfirmed === 1 ? 'pessoa confirmada' : 'pessoas confirmadas'} — abrir lista`}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          height: 40, padding: '0 4px 0 0',
          background: 'transparent', border: 'none', cursor: 'pointer',
          fontFamily: T.font,
        }}>
        {/* Avatar stack */}
        <div style={{ display: 'flex', alignItems: 'center', height: 32 }}>
          {shown.map((u, i) => (
            <AvatarChip
              key={u.id || i}
              user={u}
              borderColor={avatarBorder}
              offset={i === 0 ? 0 : -8}
              z={shown.length - i}
            />
          ))}
          {overflowCount > 0 && (
            <OverflowChip
              count={overflowCount}
              borderColor={avatarBorder}
              tone={tone}
            />
          )}
        </div>

        {/* Caption */}
        <span style={{
          fontFamily: T.font, fontSize: 13, fontWeight: 500,
          color: captionColor, lineHeight: 1.4,
          whiteSpace: 'nowrap',
        }}>
          {totalConfirmed === 0
            ? 'Sem confirmados ainda'
            : `${totalConfirmed} ${totalConfirmed === 1 ? 'confirmado' : 'confirmados'}`}
        </span>
      </button>

      {showSheet && (
        <QuemVaiSheet
          users={confirmedUsers}
          totalConfirmed={totalConfirmed}
          onClose={() => setShowSheet(false)}
        />
      )}
    </>
  );
}

// ─── AvatarChip ─────────────────────────────────────────────
function AvatarChip({ user, borderColor, offset, z }) {
  const name = user.name || '?';
  return (
    <div
      title={name}
      style={{
        width: 32, height: 32, borderRadius: '50%',
        border: `2px solid ${borderColor}`,
        background: user.src ? `url(${user.src}) center/cover` : initialsBgForQuemVai(name),
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#FFFFFF', fontFamily: T.font, fontSize: 11, fontWeight: 700,
        marginLeft: offset, position: 'relative', zIndex: z,
        boxShadow: '0 1px 2px rgba(0,0,0,0.18)',
        flexShrink: 0,
      }}>
      {!user.src && initialsForQuemVai(name)}
    </div>
  );
}

function OverflowChip({ count, borderColor, tone }) {
  const isDark = tone === 'dark';
  return (
    <div style={{
      width: 32, height: 32, borderRadius: '50%',
      border: `2px solid ${borderColor}`,
      background: isDark ? 'rgba(255,255,255,0.18)' : T.c.n200,
      color: isDark ? '#FFFFFF' : T.c.n800,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: T.font, fontSize: 12, fontWeight: 700,
      marginLeft: -8, position: 'relative', zIndex: 0,
      boxShadow: '0 1px 2px rgba(0,0,0,0.12)',
      flexShrink: 0,
    }}>
      +{count}
    </div>
  );
}

// ─── QuemVaiSheet — bottom sheet com lista completa ─────────
function QuemVaiSheet({ users, totalConfirmed, onClose }) {
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'absolute', inset: 0, zIndex: 80,
        background: 'rgba(15,15,15,0.55)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        animation: 'tcFadeIn 180ms ease',
      }}>
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog" aria-modal="true" aria-labelledby="quem-vai-title"
        style={{
          width: '100%', maxHeight: '78%',
          background: T.c.n0,
          borderTopLeftRadius: T.r.lg, borderTopRightRadius: T.r.lg,
          padding: '12px 0 0',
          boxShadow: '0 -8px 32px rgba(0,0,0,0.18)',
          animation: 'tcSlideUp 240ms cubic-bezier(0.2, 0.8, 0.2, 1)',
          fontFamily: T.font,
          display: 'flex', flexDirection: 'column',
        }}>
        <div style={{
          width: 32, height: 4, borderRadius: 2,
          background: T.c.n300, margin: '0 auto 12px',
        }}/>
        <div style={{ padding: '0 20px 12px' }}>
          <h3 id="quem-vai-title" style={{
            margin: 0,
            fontFamily: '"Fraunces", Georgia, serif',
            fontSize: 18, fontWeight: 600, color: T.c.n950,
            letterSpacing: '-0.01em',
          }}>
            Quem vai
          </h3>
          <div style={{
            fontFamily: T.mono, fontSize: 11, fontWeight: 500,
            color: T.c.n600, marginTop: 2,
            textTransform: 'uppercase', letterSpacing: '0.5px',
          }}>
            {totalConfirmed} {totalConfirmed === 1 ? 'confirmado' : 'confirmados'}
          </div>
        </div>
        <div style={{
          flex: 1, overflowY: 'auto',
          padding: '0 20px 20px',
          paddingBottom: 'max(20px, env(safe-area-inset-bottom))',
        }}>
          {users.length === 0 ? (
            <div style={{
              padding: '32px 8px', textAlign: 'center',
              fontFamily: T.font, fontSize: 13, color: T.c.n600,
            }}>
              Ainda ninguém confirmou. Seja o primeiro.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {users.map((u, i) => (
                <button
                  key={u.id || i}
                  onClick={() => {
                    fbEvent('attendee_profile_opened', { user_id: u.id });
                    // Em produção: go('perfil-outro', { user: u })
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 4px',
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    textAlign: 'left', borderBottom: i < users.length - 1 ? `1px solid ${T.c.n100}` : 'none',
                  }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: u.src ? `url(${u.src}) center/cover` : initialsBgForQuemVai(u.name || '?'),
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#FFFFFF', fontFamily: T.font, fontSize: 14, fontWeight: 700,
                    flexShrink: 0,
                  }}>
                    {!u.src && initialsForQuemVai(u.name || '?')}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontFamily: T.font, fontSize: 14, fontWeight: 600,
                      color: T.c.n950, lineHeight: 1.3,
                    }}>
                      {u.name}
                    </div>
                    {u.level && (
                      <div style={{
                        fontFamily: T.font, fontSize: 11, color: T.c.n600,
                        lineHeight: 1.4,
                      }}>
                        {u.level}{u.city ? ` · ${u.city}` : ''}
                      </div>
                    )}
                  </div>
                  <Icon name="chevron_right" size={20} color={T.c.n400}/>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Helpers ────────────────────────────────────────────────
function initialsForQuemVai(name) {
  return name.split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase();
}
function initialsBgForQuemVai(name) {
  const hues = ['#B8894A', '#A04A55', '#D4A574', '#722F37', '#6B6B6B'];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return hues[h % hues.length];
}

Object.assign(window, {
  QuemVaiInline,
  QuemVaiSheet,
});


export { AvatarChip, OverflowChip, QuemVaiInline, QuemVaiSheet, initialsBgForQuemVai, initialsForQuemVai };
