/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { Button } from './components.jsx';
import { TourAdega } from './screens-tour-adega.jsx';
import { Icon, T, TchinLogo } from './tokens.jsx';

// Tchin Tchin — 04.C AdegaVazia (was AdegaFirstTime)
// ────────────────────────────────────────────────────────────
// Empty-state landing for users with intent='diary_empty' / 'catalog'.
// Three elements carry `data-tour-anchor` attributes the optional 3-step
// tour overlay can read to position its highlights:
//   - "add-button"    → step 1
//   - "matrix-empty"  → step 2
//   - "scan-button"   → step 3
//
// One-time only: once any diary entry exists, AdegaScreen renders normally.

function AdegaVazia({
  user,
  onRegistrarVinho,
  onEscanearRotulo,
  onPaladarTabTap,
  onNotifOpen,
  onProfileOpen,
}) {
  const [activeTab, setActiveTab] = React.useState('diario');

  // The old 3-step TourAdega has been superseded by the new TchinTutor system
  // (auto-fires on this screen from TchinApp). Keep state but always null.
  const [tourStep, setTourStep] = React.useState(null);

  const TABS = [
    { id: 'diario',   label: 'Diário',     hasContent: false },
    { id: 'estante',  label: 'Estante',    hasContent: false },
    { id: 'wishlist', label: 'Wishlist',   hasContent: false },
    { id: 'paladar',  label: 'Meu Paladar', hasContent: false },
  ];

  const onTabTap = (id) => {
    if (id === 'paladar' && typeof onPaladarTabTap === 'function') {
      onPaladarTabTap();
      return;
    }
    setActiveTab(id);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n0, overflow: 'hidden', position: 'relative' }}>
      {/* ── White top bar — logo · bell · avatar ── */}
      <header style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 16px', background: T.c.n0,
        borderBottom: `1px solid ${T.c.n100}`,
        flexShrink: 0, zIndex: 5,
      }}>
        <TchinLogo size={28} withWordmark color={T.c.p700}/>
        <div style={{ flex: 1 }}/>
        <button
          onClick={onNotifOpen}
          aria-label="Notificações"
          style={{
            width: 40, height: 40, borderRadius: T.r.full,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'transparent', border: 'none', cursor: 'pointer',
          }}>
          <Icon name="notifications" size={22} color={T.c.n800}/>
        </button>
        <button
          onClick={onProfileOpen}
          aria-label="Seu perfil"
          style={{
            width: 32, height: 32, borderRadius: '50%',
            background: T.c.n300, color: T.c.n800,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: 'none', cursor: 'pointer',
            fontFamily: T.font, fontSize: 13, fontWeight: 700,
          }}>
          {user && user.initials ? user.initials : '·'}
        </button>
      </header>

      {/* ── Tab bar — 4 tabs ── */}
      <div role="tablist" style={{
        display: 'flex', padding: '0 16px',
        borderBottom: `1px solid ${T.c.n200}`, gap: 4,
        background: T.c.n0, flexShrink: 0,
      }}>
        {TABS.map(t => {
          const on = activeTab === t.id;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={on}
              onClick={() => onTabTap(t.id)}
              data-tab={t.id}
              style={{
                position: 'relative',
                padding: '14px 4px', flex: '0 0 auto', minWidth: 72,
                background: 'transparent', border: 'none', cursor: 'pointer',
                fontFamily: '"Geist", "Inter", system-ui, sans-serif',
                fontSize: 14, fontWeight: on ? 600 : 500,
                color: on ? T.c.p700 : T.c.n600,
                textAlign: 'center',
                display: 'inline-flex', alignItems: 'center', gap: 6,
                justifyContent: 'center',
              }}>
              <span>{t.label}</span>
              {t.hasContent && (
                <span aria-hidden style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: T.c.p500,
                }}/>
              )}
              {on && <span aria-hidden style={{
                position: 'absolute', left: 0, right: 0, bottom: -1, height: 2,
                background: T.c.p700, borderRadius: '2px 2px 0 0',
              }}/>}
            </button>
          );
        })}
      </div>

      {/* ── Empty-state body ── */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', padding: '0 24px',
        overflow: 'auto',
      }}>
        <div style={{ height: 48 }}/>

        {/* Empty cellar matrix — 6×4 grid of dashed slots */}
        <EmptyCellarMatrix/>

        <div style={{ height: 24 }}/>

        <h2 style={{
          margin: 0, textAlign: 'center', maxWidth: 312,
          fontFamily: '"Fraunces", "Inter", Georgia, serif',
          fontSize: 24, lineHeight: 1.2, fontWeight: 600,
          letterSpacing: '-0.01em', color: T.c.n950,
          textWrap: 'balance',
        }}>
          Sua adega começa aqui
        </h2>

        <div style={{ height: 12 }}/>

        <p style={{
          margin: 0, textAlign: 'center', maxWidth: 280,
          fontFamily: '"Geist", "Inter", system-ui, sans-serif',
          fontSize: 14, lineHeight: 1.5, color: T.c.n800,
          textWrap: 'pretty',
        }}>
          Registre seu primeiro vinho em 15 segundos. Foto, nota e um pensamento curto.
        </p>

        <div style={{ flex: 1, minHeight: 24 }}/>
      </div>

      {/* ── Bottom CTAs ── */}
      <div style={{
        padding: '12px 24px 24px',
        paddingBottom: 'max(24px, env(safe-area-inset-bottom))',
        display: 'flex', flexDirection: 'column', gap: 12,
        background: T.c.n0,
        borderTop: `1px solid ${T.c.n100}`,
      }}>
        <Button
          variant="primary" size="lg" fullWidth
          onClick={onRegistrarVinho}
          leading={<Icon name="add" size={20}/>}
          data-route="add_first_wine"
          data-tour-anchor="add-button">
          Adicionar vinho
        </Button>
        <Button
          variant="secondary" size="md" fullWidth
          onClick={onEscanearRotulo}
          leading={<Icon name="qr_code_scanner" size={18}/>}
          data-route="scan_label"
          data-tour-anchor="scan-button">
          Escanear rótulo
        </Button>
      </div>

      {/* 05.Adega Tour overlay — auto-fires once over the empty state */}
      {tourStep != null && typeof TourAdega === 'function' && (
        <TourAdega
          currentStep={tourStep}
          onStepComplete={(s) => setTourStep(s + 1)}
          onSkip={() => setTourStep(null)}
          onTourComplete={() => setTourStep(null)}
          onAddFirstWine={() => { setTourStep(null); if (typeof onRegistrarVinho === 'function') onRegistrarVinho(); }}
        />
      )}
    </div>
  );
}

// ─── Empty cellar matrix — 6 cols × 4 rows ────────────────
// Suggests a wine-cellar slot wall. Pure CSS grid + dashed-border tiles.
// Carries data-tour-anchor="matrix-empty" so the 3-step tour can highlight it.
function EmptyCellarMatrix() {
  // 24 slots = 6 cols × 4 rows
  const slots = Array.from({ length: 24 });
  return (
    <div
      data-tour-anchor="matrix-empty"
      role="img"
      aria-label="Adega vazia — 24 slots disponíveis"
      style={{
        width: 240, height: 280,
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gridTemplateRows: 'repeat(4, 1fr)',
        gap: 6,
        padding: 8,
        background: T.c.n50,
        border: `1px solid ${T.c.n200}`,
        borderRadius: T.r.md,
      }}>
      {slots.map((_, i) => (
        <div
          key={i}
          aria-hidden="true"
          style={{
            background: T.c.n100,
            border: `1px dashed ${T.c.n300}`,
            borderRadius: T.r.sm,
            position: 'relative',
          }}>
          {/* Tiny notch at top suggests bottle neck silhouette */}
          <div style={{
            position: 'absolute',
            top: '20%', left: '50%', transform: 'translateX(-50%)',
            width: 4, height: 2, borderRadius: 1,
            background: T.c.n300,
          }}/>
        </div>
      ))}
    </div>
  );
}

// Maintain the previous export name so existing imports keep working
const AdegaFirstTime = AdegaVazia;

Object.assign(window, { AdegaVazia, AdegaFirstTime, EmptyCellarMatrix });


export { AdegaFirstTime, AdegaVazia, EmptyCellarMatrix };
