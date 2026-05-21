/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { SubHeader } from './components.jsx';
import { MOCK_CONFRARIAS, MOCK_USER, MOCK_WINES } from './data.jsx';
import { Avatar } from './f13_01_Avatar.jsx';
import { PaladarRadar } from './screens-quiz.jsx';
import { Icon, T } from './tokens.jsx';

// ─────────────────────────────────────────────────────────────
// 14.01 · PerfilUsuario — perfil do próprio usuário
//
//   <PerfilUsuario
//     go={(screen) => ...}
//     ctx={{ user, diary, brotherhoods, quizDone }}
//   />
//
// Depends on (from design system):
//   T, Icon, Avatar, BottomNav, SubHeader, MatchBadge, PaladarRadar,
//   MOCK_USER, MOCK_WINES, MOCK_CONFRARIAS
// ─────────────────────────────────────────────────────────────

function PerfilUsuario({ go = () => {}, ctx = {} }) {
  const user = ctx.user || MOCK_USER;
  const quizDone = ctx.quizDone !== false;  // default true if paladar present
  const paladar = user.paladar;
  const diary = ctx.diary || DEFAULT_DIARY;
  const brotherhoods = ctx.brotherhoods || (typeof MOCK_CONFRARIAS !== 'undefined' ? MOCK_CONFRARIAS.slice(0, 3) : []);

  // Aggregated stats
  const stats = computePerfilStats(diary);

  // Recent ratings (last 3 with rating)
  const recent = diary
    .filter(d => typeof d.rating === 'number' && d.wine)
    .slice(0, 3);

  // Paladar trait label (e.g. "Tinto encorpado e tânico")
  const paladarLabel = quizDone && paladar ? describePaladar(paladar) : null;

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      background: T.c.n50, fontFamily: T.font, overflow: 'hidden',
    }}>
      <SubHeader
        title="Meu Perfil"
        onBack={() => go('home')}
        actions={
          <button
            onClick={() => go('settings')}
            aria-label="Editar perfil"
            style={{
              width: 44, height: 44, border: 'none', background: 'none',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Icon name="edit" size={22} color={T.c.n800}/>
          </button>
        }
      />

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>

        {/* ─── HEADER (burgundy/50 wash) ────────────────────────── */}
        <div style={{
          background: T.c.p50,
          padding: '24px 24px 28px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
        }}>
          <Avatar size={80} name={user.name} src={user.avatarUrl}/>
          <div style={{
            marginTop: 12,
            fontFamily: T.serif || "'Fraunces', Georgia, serif",
            fontSize: 24, fontWeight: 600,
            letterSpacing: '-0.01em',
            color: T.c.n950,
            lineHeight: 1.2,
          }}>{user.name}</div>
          <div style={{
            marginTop: 4,
            fontSize: 13, color: T.c.n600, fontWeight: 500,
            letterSpacing: '0.1px',
          }}>@{usernameOf(user)}</div>

          <div style={{
            marginTop: 12, display: 'inline-flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center',
          }}>
            <PerfilChip icon="workspace_premium" label={`Nível: ${levelLabel(user.level)}`} tone="primary"/>
            {user.city && <PerfilChip icon="location_on" label={user.city} tone="neutral"/>}
          </div>
        </div>

        {/* ─── STATS BANNER (US-12-3-03) ──────────────────────────── */}
        <div style={{ padding: '16px 16px 0' }}>
          <div style={{
            background: T.c.n0,
            border: `1px solid ${T.c.n200}`,
            borderRadius: T.r.lg,
            padding: 0,
            boxShadow: T.el[1],
            overflow: 'hidden',
          }}>
            {/* Followers / Following bar */}
            <div style={{ display: 'flex', borderBottom: `1px solid ${T.c.n100}` }}>
              <button onClick={() => go('perfil-seguidores')} style={{
                flex: 1, padding: '14px 8px', background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                borderRight: `1px solid ${T.c.n100}`,
              }}>
                <span style={{ fontSize: 22, fontWeight: 700, color: T.c.n950, fontFamily: T.font, lineHeight: 1 }}>12</span>
                <span style={{ ...T.t.caption, color: T.c.n600 }}>seguidores</span>
              </button>
              <button onClick={() => go('perfil-seguindo')} style={{
                flex: 1, padding: '14px 8px', background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                borderRight: `1px solid ${T.c.n100}`,
              }}>
                <span style={{ fontSize: 22, fontWeight: 700, color: T.c.n950, fontFamily: T.font, lineHeight: 1 }}>8</span>
                <span style={{ ...T.t.caption, color: T.c.n600 }}>seguindo</span>
              </button>
              <button onClick={() => go('jornada')} style={{
                flex: 1, padding: '14px 8px', background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              }}>
                <span style={{ fontSize: 22, fontWeight: 700, color: T.c.p700, fontFamily: T.font, lineHeight: 1 }}>240</span>
                <span style={{ ...T.t.caption, color: T.c.n600 }}>pontos</span>
              </button>
            </div>
            {/* Sua jornada */}
            <div style={{ padding: 16 }}>
              <div style={{
                fontSize: 11, fontWeight: 700, color: T.c.p700,
                textTransform: 'uppercase', letterSpacing: 0.5,
                marginBottom: 12,
              }}>Sua jornada</div>
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16,
              }}>
                <StatTile value={String(stats.wineCount)} caption="vinhos provados"/>
                <StatTile value={String(stats.countryCount)} caption="países"/>
                <StatTile value={stats.topGrape || '—'} caption="uva favorita"/>
                <StatBadgeTile badge={stats.topBadge}/>
              </div>
            </div>
          </div>
        </div>

        {/* ─── MEU PALADAR ──────────────────────────────────────── */}
        <div style={{ padding: '16px 16px 0' }}>
          <SectionTitle>Meu Paladar</SectionTitle>
          <button
            onClick={() => go(quizDone ? 'paladar' : 'quiz')}
            style={{
              width: '100%', textAlign: 'left',
              background: T.c.n0, border: `1px solid ${T.c.n200}`,
              borderRadius: T.r.lg, padding: 16,
              boxShadow: T.el[1], cursor: 'pointer',
              display: 'flex', gap: 14, alignItems: 'center',
              fontFamily: T.font,
            }}
          >
            <div style={{
              width: 120, height: 120, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {quizDone && paladar ? (
                <PaladarRadar paladar={paladar} size={120} showLabels={false} animate={false}/>
              ) : (
                <div style={{
                  width: 100, height: 100, borderRadius: '50%',
                  background: T.c.p50, border: `1.5px dashed ${T.c.p300 || '#C97D87'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon name="psychology" size={40} color={T.c.p700}/>
                </div>
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              {quizDone && paladar ? (
                <React.Fragment>
                  <div style={{ fontSize: 11, fontWeight: 600, color: T.c.n600, textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 4 }}>
                    Perfil
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: T.c.n950, lineHeight: 1.3, marginBottom: 8 }}>
                    {paladarLabel}
                  </div>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    fontSize: 12, fontWeight: 600, color: T.c.p700,
                  }}>
                    <Icon name="edit" size={14}/> Editar
                  </div>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <div style={{ fontSize: 15, fontWeight: 700, color: T.c.n950, lineHeight: 1.3, marginBottom: 6 }}>
                    Você ainda não fez o quiz
                  </div>
                  <div style={{ fontSize: 12, color: T.c.n600, lineHeight: 1.5, marginBottom: 10 }}>
                    Descubra seu perfil em 5 perguntas.
                  </div>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    background: T.c.p700, color: T.c.n0,
                    padding: '8px 14px', borderRadius: 10,
                    fontSize: 13, fontWeight: 600,
                  }}>
                    <Icon name="play_arrow" size={16} color={T.c.n0}/>
                    Descobrir em 90s
                  </div>
                </React.Fragment>
              )}
            </div>
          </button>
        </div>

        {/* ─── AVALIAÇÕES RECENTES ──────────────────────────────── */}
        <div style={{ padding: '16px 16px 0' }}>
          <SectionTitle
            action={recent.length > 0 ? { label: 'Ver tudo', onTap: () => go('diary') } : null}
          >Avaliações recentes</SectionTitle>
          {recent.length === 0 ? (
            <div style={{
              background: T.c.n0, border: `1px solid ${T.c.n200}`,
              borderRadius: T.r.lg, padding: 20,
              textAlign: 'center', boxShadow: T.el[1],
            }}>
              <div style={{ fontSize: 13, color: T.c.n600, lineHeight: 1.5 }}>
                Suas avaliações vão aparecer aqui conforme você registrar vinhos.
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {recent.map((entry, i) => (
                <RecentWineCard
                  key={i}
                  wine={entry.wine}
                  rating={entry.rating}
                  date={entry.date}
                  onTap={() => go('wine-detail', { wine: entry.wine })}
                />
              ))}
            </div>
          )}
        </div>

        {/* ─── CONFRARIAS ───────────────────────────────────────── */}
        <div style={{ padding: '16px 16px 24px' }}>
          <SectionTitle
            action={{ label: 'Ver tudo', onTap: () => go('confrarias') }}
          >Confrarias</SectionTitle>
          {brotherhoods.length === 0 ? (
            <div style={{
              background: T.c.n0, border: `1px solid ${T.c.n200}`,
              borderRadius: T.r.lg, padding: 16,
              boxShadow: T.el[1],
              display: 'flex', gap: 12, alignItems: 'center',
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: T.c.p50, color: T.c.p700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Icon name="groups" size={20} color={T.c.p700}/>
              </div>
              <div style={{ flex: 1, fontSize: 13, color: T.c.n800, lineHeight: 1.4 }}>
                Você ainda não participa de nenhuma.
              </div>
              <button
                onClick={() => go('confrarias')}
                style={{
                  background: 'transparent', border: 'none',
                  color: T.c.p700, fontSize: 13, fontWeight: 600,
                  cursor: 'pointer', padding: '6px 8px',
                }}
              >Explorar</button>
            </div>
          ) : (
            <div style={{
              display: 'flex', gap: 10,
              overflowX: 'auto',
              paddingBottom: 4,
              scrollbarWidth: 'none',
              marginInline: -16, paddingInline: 16,
            }}>
              {brotherhoods.map((b, i) => (
                <BrotherhoodChip
                  key={i}
                  brotherhood={b}
                  onTap={() => go('confraria-detail', { confraria: b })}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────

function PerfilChip({ icon, label, tone = 'neutral' }) {
  const tones = {
    primary: { bg: T.c.n0, fg: T.c.p700, border: T.c.p100, iconColor: T.c.p700 },
    neutral: { bg: T.c.n0, fg: T.c.n800, border: T.c.n200, iconColor: T.c.n600 },
  };
  const t = tones[tone] || tones.neutral;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '5px 11px',
      background: t.bg, color: t.fg,
      border: `1px solid ${t.border}`,
      borderRadius: 9999,
      fontSize: 12, fontWeight: 600,
      letterSpacing: '0.1px',
    }}>
      <Icon name={icon} size={14} color={t.iconColor}/>
      {label}
    </span>
  );
}

function SectionTitle({ children, action }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
      marginBottom: 10, marginTop: 4,
    }}>
      <div style={{
        fontFamily: T.serif || "'Fraunces', Georgia, serif",
        fontSize: 18, fontWeight: 600,
        letterSpacing: '-0.01em', color: T.c.n950,
      }}>{children}</div>
      {action && (
        <button
          onClick={action.onTap}
          style={{
            background: 'transparent', border: 'none',
            color: T.c.p700, fontSize: 13, fontWeight: 600,
            cursor: 'pointer', padding: '4px 0',
          }}
        >{action.label}</button>
      )}
    </div>
  );
}

function StatTile({ value, caption }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <div style={{
        fontFamily: T.serif || "'Fraunces', Georgia, serif",
        fontSize: 24, fontWeight: 700, lineHeight: 1.1,
        color: T.c.n950, letterSpacing: '-0.01em',
      }}>{value}</div>
      <div style={{
        fontSize: 11, fontWeight: 500, color: T.c.n600,
        textTransform: 'lowercase', letterSpacing: 0.2,
        lineHeight: 1.3,
      }}>{caption}</div>
    </div>
  );
}

function StatBadgeTile({ badge }) {
  if (!badge) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '4px 8px', borderRadius: 9999,
          background: T.c.n100, color: T.c.n600,
          fontSize: 12, fontWeight: 600,
          alignSelf: 'flex-start',
        }}>
          <Icon name="lock" size={12} color={T.c.n600}/>
          A conquistar
        </div>
        <div style={{
          fontSize: 11, fontWeight: 500, color: T.c.n600,
          marginTop: 4, lineHeight: 1.3,
        }}>primeiro badge</div>
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '4px 8px', borderRadius: 9999,
        background: T.c.a500 ? `${T.c.a500}33` : '#F5E9D4',
        color: T.c.a700,
        fontSize: 12, fontWeight: 700,
        border: `1px solid ${T.c.a500}66`,
        alignSelf: 'flex-start',
      }}>
        <Icon name={badge.icon || 'workspace_premium'} size={12} color={T.c.a700}/>
        {badge.name}
      </div>
      <div style={{
        fontSize: 11, fontWeight: 500, color: T.c.n600,
        marginTop: 4, lineHeight: 1.3,
      }}>badge atual</div>
    </div>
  );
}

function RecentWineCard({ wine, rating, date, onTap }) {
  return (
    <button
      onClick={onTap}
      style={{
        width: '100%', textAlign: 'left',
        background: T.c.n0, border: `1px solid ${T.c.n200}`,
        borderRadius: T.r.md, padding: 12,
        display: 'flex', gap: 12, alignItems: 'center',
        boxShadow: T.el[1], cursor: 'pointer',
        fontFamily: T.font,
      }}
    >
      <div style={{
        width: 44, height: 60, flexShrink: 0,
        borderRadius: 6, overflow: 'hidden',
        background: `linear-gradient(160deg, ${T.c.p100} 0%, ${T.c.p500} 55%, ${T.c.p900} 100%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name="wine_bar" size={20} color="rgba(255,255,255,0.92)"/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 11, fontWeight: 600, color: T.c.n600,
          textTransform: 'uppercase', letterSpacing: 0.2,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{wine.producer}</div>
        <div style={{
          fontSize: 14, fontWeight: 700, color: T.c.n950, lineHeight: 1.3, marginTop: 2,
          display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>{wine.name}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
          <MiniStars value={rating}/>
          {date && (
            <span style={{ fontSize: 11, color: T.c.n600 }}>· {shortDate(date)}</span>
          )}
        </div>
      </div>
      <Icon name="chevron_right" size={18} color={T.c.n400}/>
    </button>
  );
}

function MiniStars({ value = 0 }) {
  return (
    <span style={{ display: 'inline-flex', gap: 1 }} aria-label={`${value} de 5 estrelas`}>
      {[0, 1, 2, 3, 4].map(i => (
        <Icon
          key={i}
          name="star"
          size={13}
          color={i < value ? T.c.p700 : T.c.n300}
          fill={i < value ? 1 : 0}
        />
      ))}
    </span>
  );
}

function BrotherhoodChip({ brotherhood, onTap }) {
  const initials = (brotherhood.name || '?').split(/\s+/).filter(Boolean).slice(0, 2).map(s => s[0]).join('').toUpperCase();
  return (
    <button
      onClick={onTap}
      style={{
        flexShrink: 0,
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '8px 14px 8px 8px',
        background: T.c.n0, border: `1px solid ${T.c.n200}`,
        borderRadius: 9999,
        cursor: 'pointer', boxShadow: T.el[1],
        fontFamily: T.font,
      }}
    >
      <div style={{
        width: 32, height: 32, borderRadius: '50%',
        background: `linear-gradient(135deg, ${T.c.p500}, ${T.c.p900})`,
        color: T.c.n0,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 700, fontSize: 12,
      }}>{initials}</div>
      <span style={{
        fontSize: 13, fontWeight: 600, color: T.c.n950,
        maxWidth: 140, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      }}>{brotherhood.name}</span>
    </button>
  );
}

// ─── Default diary (fallback when ctx doesn't provide one) ────
const DEFAULT_DIARY = (typeof MOCK_WINES !== 'undefined') ? [
  { wine: MOCK_WINES[0], date: '2026-05-08', rating: 5, occasion: 'Confraria' },
  { wine: MOCK_WINES[6] || MOCK_WINES[1], date: '2026-05-05', rating: 4 },
  { wine: MOCK_WINES[3] || MOCK_WINES[2], date: '2026-04-28', rating: 3 },
  { wine: MOCK_WINES[1], date: '2026-04-20', rating: 5 },
  { wine: MOCK_WINES[2], date: '2026-04-10', rating: 4 },
] : [];

// ─── Stats computation ────────────────────────────────────────
function computePerfilStats(diary) {
  const wines = diary.filter(d => d.wine).map(d => d.wine);

  // unique wine count = total diary entries
  const wineCount = wines.length;

  // unique countries
  const countries = new Set(wines.map(w => w.country).filter(Boolean));
  const countryCount = countries.size;

  // top grape (most frequent first word of name OR producer for now)
  const grapeKeywords = ['Malbec','Cabernet','Merlot','Pinot','Tempranillo','Sangiovese','Touriga','Chardonnay','Sauvignon','Carmenere','Tannat'];
  const grapeCount = {};
  wines.forEach(w => {
    const hay = `${w.name || ''} ${w.producer || ''}`.toLowerCase();
    grapeKeywords.forEach(g => { if (hay.includes(g.toLowerCase())) grapeCount[g] = (grapeCount[g] || 0) + 1; });
  });
  const topGrape = Object.keys(grapeCount).sort((a, b) => grapeCount[b] - grapeCount[a])[0];

  // Top badge based on # of wines
  let topBadge = null;
  if (wineCount >= 50) topBadge = { name: 'Sommelier', icon: 'workspace_premium' };
  else if (wineCount >= 20) topBadge = { name: 'Connoisseur', icon: 'auto_awesome' };
  else if (wineCount >= 5)  topBadge = { name: 'Aprendiz',  icon: 'school' };

  return { wineCount, countryCount, topGrape, topBadge };
}

// ─── Paladar trait label ──────────────────────────────────────
function describePaladar(p) {
  if (!p) return null;
  const body = p.corpo >= 65 ? 'encorpado' : (p.corpo >= 40 ? 'equilibrado' : 'leve');
  const tannin = p.tanino >= 65 ? ' e tânico' : (p.tanino <= 30 ? ' e macio' : '');
  const sweet = p.docura >= 60 ? 'doce' : (p.docura <= 25 ? 'seco' : null);
  const acid = p.acidez >= 65 ? 'vibrante' : null;

  // Prefer red profile when corpo + tanino are dominant
  const type = (p.corpo + p.tanino) / 2 >= 55 ? 'Tinto' : (p.acidez >= 60 ? 'Branco' : 'Estilo');

  const adjectives = [body + tannin, sweet, acid].filter(Boolean);
  return `${type} ${adjectives.join(', ')}`;
}

// ─── Misc helpers ─────────────────────────────────────────────
function levelLabel(level) {
  const map = {
    iniciante: 'Iniciante',
    intermediario: 'Intermediário',
    intermediário: 'Intermediário',
    expert: 'Expert',
  };
  return map[(level || '').toLowerCase()] || 'Iniciante';
}
function usernameOf(user) {
  if (user.username) return user.username;
  return (user.name || 'usuario').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '.').replace(/^\.+|\.+$/g, '');
}
function shortDate(iso) {
  if (!iso) return '';
  const months = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return `${d.getDate()} ${months[d.getMonth()]}`;
}

Object.assign(window, {
  PerfilUsuario,
  computePerfilStats,
  describePaladar,
});


export { BrotherhoodChip, DEFAULT_DIARY, MiniStars, PerfilChip, PerfilUsuario, RecentWineCard, SectionTitle, StatBadgeTile, StatTile, computePerfilStats, describePaladar, levelLabel, shortDate, usernameOf };
