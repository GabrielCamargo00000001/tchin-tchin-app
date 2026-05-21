/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { Button } from './components.jsx';
import { Icon, T } from './tokens.jsx';

// ─────────────────────────────────────────────────────────────
// Tchin Tchin — Galeria de Conquistas / Badges (1 tela)
//
//   32.01 badges-galeria → grid de selos conquistados + locked + progressos
// ─────────────────────────────────────────────────────────────

const TC_BADGES = [
  // Unlocked
  { id: 'b-1',  name: 'Primeiro brinde',    desc: 'Primeira garrafa registrada no diário', icon: 'wine_bar', tier: 'bronze', unlockedAt: 'mar/2026', earned: true },
  { id: 'b-2',  name: 'Globetrotter',       desc: 'Provou vinhos de 5 países diferentes',  icon: 'public',   tier: 'prata',  unlockedAt: 'abr/2026', earned: true },
  { id: 'b-3',  name: 'Confraria fiel',     desc: 'Compareceu a 5 encontros seguidos',     icon: 'groups',   tier: 'prata',  unlockedAt: 'mai/2026', earned: true },
  { id: 'b-4',  name: 'Curioso',            desc: 'Leu 10 artigos da seção Aprenda',       icon: 'menu_book',tier: 'bronze', unlockedAt: 'abr/2026', earned: true },
  { id: 'b-5',  name: 'Streak 7 dias',      desc: 'Registrou vinho 7 dias seguidos',       icon: 'local_fire_department', tier: 'ouro', unlockedAt: 'mai/2026', earned: true },
  { id: 'b-6',  name: 'Recém-chegado',      desc: 'Completou seu paladar 5D',              icon: 'science',  tier: 'bronze', unlockedAt: 'mar/2026', earned: true },
  // In progress
  { id: 'b-7',  name: 'Tour pela Argentina',desc: 'Prove 10 Malbecs de regiões diferentes', icon: 'flag',    tier: 'prata',  earned: false, progress: 6, target: 10 },
  { id: 'b-8',  name: 'Mestre dos Desafios',desc: 'Cumpra 10 desafios semanais',             icon: 'emoji_events', tier: 'ouro', earned: false, progress: 3, target: 10 },
  { id: 'b-9',  name: 'Sommelier verificado',desc: 'Responda 50 perguntas da comunidade',    icon: 'verified', tier: 'ouro',  earned: false, progress: 12, target: 50, requiresApp: true },
  // Locked / future
  { id: 'b-10', name: 'Espumante feliz',    desc: 'Prove 5 espumantes diferentes',          icon: 'celebration', tier: 'bronze', earned: false, progress: 1, target: 5 },
  { id: 'b-11', name: 'Mil pontos',         desc: 'Acumule 1.000 pontos',                   icon: 'workspace_premium', tier: 'prata', earned: false, progress: 240, target: 1000 },
  { id: 'b-12', name: 'Embaixador',         desc: 'Convide 5 amigos que entrem no app',     icon: 'campaign', tier: 'ouro',   earned: false, progress: 0, target: 5 },
];

function BadgesGaleriaScreen({ go }) {
  const [filter, setFilter] = React.useState('todos');
  const [open, setOpen] = React.useState(null);
  const earned = TC_BADGES.filter(b => b.earned);
  const inprog = TC_BADGES.filter(b => !b.earned && b.progress > 0);
  const locked = TC_BADGES.filter(b => !b.earned && (!b.progress || b.progress === 0));
  const shown = filter === 'todos' ? TC_BADGES
              : filter === 'earned' ? earned
              : filter === 'progress' ? inprog
              : locked;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n50, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '8px 8px', background: T.c.n0, borderBottom: `1px solid ${T.c.n200}`, flexShrink: 0 }}>
        <button onClick={() => go('back')} style={{ width: 44, height: 44, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="arrow_back" size={24} color={T.c.n950}/>
        </button>
        <div style={{ ...T.t.h3, color: T.c.n950, flex: 1 }}>Conquistas</div>
        <button onClick={() => go('toast', { kind: 'success', message: 'Coleção compartilhada!' })} style={{ width: 44, height: 44, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="share" size={22} color={T.c.n950}/>
        </button>
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>
        {/* Hero stats */}
        <div style={{
          background: `linear-gradient(135deg, ${T.c.p700} 0%, ${T.c.p900} 100%)`,
          color: T.c.n0, padding: '24px 20px 28px', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.15,
            backgroundImage: `repeating-linear-gradient(135deg, rgba(255,255,255,0.4) 0 1px, transparent 1px 14px)`,
          }}/>
          <div style={{ position: 'relative' }}>
            <div style={{ ...T.t.overline, color: 'rgba(255,255,255,0.75)', marginBottom: 4 }}>SUA COLEÇÃO</div>
            <div style={{ fontSize: 42, fontWeight: 700, fontFamily: T.font, lineHeight: 1 }}>
              {earned.length}<span style={{ fontSize: 22, opacity: 0.7 }}>/{TC_BADGES.length}</span>
            </div>
            <div style={{ ...T.t.body, color: 'rgba(255,255,255,0.85)', marginTop: 4 }}>selos conquistados</div>
            <div style={{ display: 'flex', gap: 6, marginTop: 16 }}>
              {[
                { l: 'Ouro',   c: earned.filter(b => b.tier === 'ouro').length,   bg: '#D4A574', fg: '#4A1F24' },
                { l: 'Prata',  c: earned.filter(b => b.tier === 'prata').length,  bg: '#C0C0C0', fg: '#3A3A3A' },
                { l: 'Bronze', c: earned.filter(b => b.tier === 'bronze').length, bg: '#B87333', fg: T.c.n0 },
              ].map(t => (
                <div key={t.l} style={{ padding: '6px 10px', borderRadius: T.r.full, background: t.bg, color: t.fg, display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700 }}>
                  <Icon name="workspace_premium" size={14} color={t.fg}/>
                  {t.c} {t.l}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 8, padding: '12px 16px', overflowX: 'auto', background: T.c.n0, borderBottom: `1px solid ${T.c.n200}` }}>
          {[
            { id: 'todos',    l: `Todos (${TC_BADGES.length})` },
            { id: 'earned',   l: `Conquistados (${earned.length})` },
            { id: 'progress', l: `Em progresso (${inprog.length})` },
            { id: 'locked',   l: `Bloqueados (${locked.length})` },
          ].map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{
              padding: '6px 12px', borderRadius: T.r.full,
              background: filter === f.id ? T.c.p700 : T.c.n100,
              color: filter === f.id ? T.c.n0 : T.c.n800,
              border: 'none', cursor: 'pointer', fontFamily: T.font, fontSize: 13, fontWeight: 600,
              whiteSpace: 'nowrap', flexShrink: 0,
            }}>{f.l}</button>
          ))}
        </div>

        {/* Grid */}
        <div style={{ padding: 16, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {shown.map(b => <BadgeCell key={b.id} b={b} onClick={() => setOpen(b)}/>)}
        </div>

        {/* Upcoming hint */}
        <div style={{ padding: '0 16px 32px' }}>
          <div style={{ padding: 16, background: T.c.p50, borderRadius: T.r.lg, display: 'flex', gap: 12, alignItems: 'center' }}>
            <Icon name="emoji_events" size={28} color={T.c.p700}/>
            <div style={{ flex: 1 }}>
              <div style={{ ...T.t.bodyB, color: T.c.n950 }}>Próximo de conquistar:</div>
              <div style={{ ...T.t.caption, color: T.c.n600, marginTop: 2 }}>Tour pela Argentina · falta 4 Malbecs.</div>
            </div>
            <button onClick={() => go('descobrir')} style={{ background: T.c.p700, border: 'none', cursor: 'pointer', color: T.c.n0, fontFamily: T.font, fontSize: 13, fontWeight: 600, padding: '8px 14px', borderRadius: T.r.full }}>
              Descobrir
            </button>
          </div>
        </div>
      </div>

      {open && <BadgeDetailSheet badge={open} onClose={() => setOpen(null)} onShare={() => { setOpen(null); go('toast', { kind: 'success', message: 'Conquista compartilhada!' }); }}/>}
    </div>
  );
}

function BadgeCell({ b, onClick }) {
  const tierColors = {
    ouro:   { bg: 'linear-gradient(135deg, #F5D78E, #C99B3F)', fg: '#4A1F24' },
    prata:  { bg: 'linear-gradient(135deg, #E8E8E8, #A8A8A8)', fg: '#3A3A3A' },
    bronze: { bg: 'linear-gradient(135deg, #E0A86A, #8B5A1F)', fg: T.c.n0 },
  };
  const tc = tierColors[b.tier];
  return (
    <button onClick={onClick} style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
      padding: 12, background: T.c.n0, border: `1px solid ${T.c.n200}`, borderRadius: T.r.md,
      cursor: 'pointer', textAlign: 'center', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        width: 64, height: 64, borderRadius: '50%',
        background: b.earned ? tc.bg : T.c.n200,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: b.earned ? T.el[2] : 'none',
        position: 'relative',
        filter: b.earned ? 'none' : 'grayscale(1) opacity(0.5)',
      }}>
        <Icon name={b.icon} size={28} color={b.earned ? tc.fg : T.c.n600}/>
        {!b.earned && b.progress > 0 && (
          <svg style={{ position: 'absolute', inset: -3, width: 70, height: 70 }} viewBox="0 0 70 70">
            <circle cx="35" cy="35" r="33" fill="none" stroke={T.c.n200} strokeWidth="3"/>
            <circle cx="35" cy="35" r="33" fill="none" stroke={T.c.p700} strokeWidth="3"
              strokeDasharray={`${(b.progress / b.target) * 207} 207`} strokeLinecap="round"
              transform="rotate(-90 35 35)"/>
          </svg>
        )}
        {!b.earned && !b.progress && (
          <div style={{
            position: 'absolute', bottom: -2, right: -2, width: 22, height: 22, borderRadius: '50%',
            background: T.c.n600, color: T.c.n0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: `2px solid ${T.c.n0}`,
          }}><Icon name="lock" size={12} color={T.c.n0}/></div>
        )}
      </div>
      <div style={{ ...T.t.caption, color: b.earned ? T.c.n950 : T.c.n600, fontWeight: 600, lineHeight: 1.3 }}>{b.name}</div>
      {!b.earned && b.progress > 0 && (
        <div style={{ ...T.t.caption, color: T.c.p700, fontFamily: T.mono, fontSize: 10, fontWeight: 700 }}>
          {b.progress}/{b.target}
        </div>
      )}
      {b.earned && (
        <div style={{ ...T.t.caption, color: T.c.n600, fontSize: 10 }}>{b.unlockedAt}</div>
      )}
    </button>
  );
}

function BadgeDetailSheet({ badge, onClose, onShare }) {
  const tierColors = {
    ouro:   { bg: 'linear-gradient(135deg, #F5D78E, #C99B3F)', fg: '#4A1F24', label: 'Ouro' },
    prata:  { bg: 'linear-gradient(135deg, #E8E8E8, #A8A8A8)', fg: '#3A3A3A', label: 'Prata' },
    bronze: { bg: 'linear-gradient(135deg, #E0A86A, #8B5A1F)', fg: T.c.n0,     label: 'Bronze' },
  };
  const tc = tierColors[badge.tier];
  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, background: 'rgba(15,15,15,0.55)', zIndex: 60,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center', animation: 'tcFadeIn 180ms',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: T.c.n0, borderTopLeftRadius: T.r.xl, borderTopRightRadius: T.r.xl,
        padding: '24px 20px 28px', width: '100%', animation: 'tcSlideUp 220ms', textAlign: 'center',
      }}>
        <div style={{ width: 36, height: 4, background: T.c.n300, borderRadius: 2, margin: '-8px auto 20px' }}/>
        <div style={{
          width: 120, height: 120, borderRadius: '50%',
          background: badge.earned ? tc.bg : T.c.n200, margin: '0 auto 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: badge.earned ? T.el[3] : 'none',
          filter: badge.earned ? 'none' : 'grayscale(1) opacity(0.5)',
          animation: badge.earned ? 'tcDrawIn 320ms cubic-bezier(0.2, 0.8, 0.2, 1)' : 'none',
        }}>
          <Icon name={badge.icon} size={56} color={badge.earned ? tc.fg : T.c.n600}/>
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: T.r.full, background: badge.earned ? tc.bg : T.c.n200, color: badge.earned ? tc.fg : T.c.n600, fontFamily: T.font, fontSize: 11, fontWeight: 700, marginBottom: 8 }}>
          <Icon name="workspace_premium" size={14} color={badge.earned ? tc.fg : T.c.n600}/>
          Tier {tc.label}
        </div>
        <div style={{ ...T.t.h1, color: T.c.n950, fontFamily: '"Fraunces", Georgia, serif', marginBottom: 8 }}>{badge.name}</div>
        <div style={{ ...T.t.bodyLg, color: T.c.n600, lineHeight: 1.5, maxWidth: 320, margin: '0 auto 24px' }}>{badge.desc}</div>
        {badge.earned ? (
          <>
            <div style={{
              padding: 14, background: T.c.s100, borderRadius: T.r.md, marginBottom: 16,
              display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center',
            }}>
              <Icon name="check_circle" size={20} color={T.c.s700}/>
              <span style={{ ...T.t.body, color: T.c.s700, fontWeight: 600 }}>Conquistado em {badge.unlockedAt}</span>
            </div>
            <Button variant="primary" size="lg" fullWidth leading={<Icon name="share" size={20}/>} onClick={onShare}>Compartilhar conquista</Button>
          </>
        ) : badge.progress > 0 ? (
          <>
            <div style={{ padding: '16px', background: T.c.n50, borderRadius: T.r.md, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ ...T.t.body, color: T.c.n800, fontWeight: 600 }}>Seu progresso</span>
                <span style={{ ...T.t.body, color: T.c.p700, fontWeight: 700, fontFamily: T.mono }}>{badge.progress}/{badge.target}</span>
              </div>
              <div style={{ height: 8, background: T.c.n200, borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(badge.progress / badge.target) * 100}%`, background: T.c.p700, transition: 'width 300ms' }}/>
              </div>
            </div>
            <Button variant="primary" size="lg" fullWidth onClick={onClose}>Continuar conquistando</Button>
          </>
        ) : (
          <>
            <div style={{ padding: 14, background: T.c.n100, borderRadius: T.r.md, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
              <Icon name="lock" size={18} color={T.c.n600}/>
              <span style={{ ...T.t.body, color: T.c.n600 }}>Ainda não começou</span>
            </div>
            <Button variant="primary" size="lg" fullWidth onClick={onClose}>Bora começar</Button>
          </>
        )}
        <div style={{ height: 8 }}/>
        <Button variant="ghost" size="md" fullWidth onClick={onClose}>Fechar</Button>
      </div>
    </div>
  );
}

Object.assign(window, { BadgesGaleriaScreen, TC_BADGES });


export { BadgeCell, BadgeDetailSheet, BadgesGaleriaScreen, TC_BADGES };
