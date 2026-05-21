/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { MOCK_WINES } from './data.jsx';
import { BottlePlaceholder, Icon, T } from './tokens.jsx';

// ─────────────────────────────────────────────────────────────
// 22.02 · DetalheDesafio — detalhe full-screen do desafio da semana
//
//   <DetalheDesafio
//     challenge={{
//       id, title, weekNumber,
//       endsAt: '2026-05-25T23:59:59',
//       criteria: 'Registre no Diário um vinho da Espanha antes do prazo.',
//       filterFn: (w) => w.country === 'Espanha',     // pra montar sugestões
//     }}
//     wines={MOCK_WINES}
//     registered={[]}                  // vinhos do user que já contam
//     inConfraria={true}
//     onBack={() => ...}
//     onTapWine={(wine) => ...}
//     onRegisterFromHere={() => ...}   // → 18.01 com escopo "espanha"
//   />
// ─────────────────────────────────────────────────────────────

function DetalheDesafio({
  challenge = {},
  wines = (typeof MOCK_WINES !== 'undefined' ? MOCK_WINES : []),
  registered = [],
  inConfraria = false,
  onBack = () => {},
  onTapWine = () => {},
  onRegisterFromHere = () => {},
}) {
  const grad = ['#D4A574', '#B8894A'];
  const weekN = challenge.weekNumber || 21;
  const criteria = challenge.criteria || 'Registre um vinho que se encaixe no desafio antes do prazo.';
  const dateLine = formatDesafioDate(challenge.endsAt);

  // Suggestions: applies a filterFn or matches against country/keyword
  const suggestions = React.useMemo(() => {
    if (typeof challenge.filterFn === 'function') {
      return wines.filter(challenge.filterFn).slice(0, 6);
    }
    if (challenge.country) {
      return wines.filter(w => (w.country || '').toLowerCase() === challenge.country.toLowerCase()).slice(0, 6);
    }
    return wines.slice(0, 5);
  }, [wines, challenge.filterFn, challenge.country]);

  return (
    <div
      data-screen-label="22.02 DetalheDesafio"
      style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        background: T.c.n50,
        fontFamily: T.font, color: T.c.n950,
        overflow: 'hidden',
      }}
    >
      {/* Top bar */}
      <header style={{
        display: 'flex', alignItems: 'center', gap: 4,
        padding: '8px 8px 8px 4px',
        background: T.c.n0,
        borderBottom: `1px solid ${T.c.n200}`,
        flexShrink: 0,
      }}>
        <button
          type="button"
          onClick={onBack}
          aria-label="Voltar"
          style={{
            width: 44, height: 44, background: 'none', border: 'none',
            cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Icon name="arrow_back" size={24} color={T.c.n950}/>
        </button>
        <h4 style={{
          margin: 0, flex: 1, fontSize: 17, fontWeight: 600,
          color: T.c.n950, letterSpacing: '-0.01em',
        }}>Desafio da semana</h4>
        <div style={{
          ...T.t.caption, color: T.c.a700,
          fontFamily: T.mono, fontWeight: 600,
          padding: '4px 10px', background: T.c.a100,
          borderRadius: T.r.full, marginRight: 12,
          letterSpacing: 0.3,
        }}>Semana {weekN}</div>
      </header>

      <div style={{
        flex: 1, overflowY: 'auto', overflowX: 'hidden',
      }}>
        {/* Hero */}
        <section style={{
          position: 'relative',
          padding: '32px 20px 28px',
          background: `linear-gradient(135deg, ${grad[0]} 0%, ${grad[1]} 100%)`,
          color: T.c.n0,
          overflow: 'hidden',
        }}>
          <div aria-hidden="true" style={{
            position: 'absolute', top: -60, right: -40,
            width: 220, height: 220, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.20) 0%, transparent 70%)',
          }}/>
          <div aria-hidden="true" style={{
            position: 'absolute', bottom: -80, left: -40,
            width: 200, height: 200, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,0,0,0.10) 0%, transparent 70%)',
          }}/>

          <div style={{
            position: 'relative',
            ...T.t.overline, color: 'rgba(255,255,255,0.85)',
            letterSpacing: 1.4,
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>
            <span aria-hidden="true">🎯</span>
            Desafio da semana
          </div>
          <h1 style={{
            position: 'relative',
            margin: '6px 0 0',
            fontFamily: T.serif || "'Fraunces', Georgia, serif",
            fontSize: 30, fontWeight: 500,
            letterSpacing: '-0.025em', lineHeight: 1.1,
            color: T.c.n0, textWrap: 'balance',
          }}>{challenge.title || 'Desafio'}</h1>
          <div style={{
            position: 'relative',
            marginTop: 12,
            fontSize: 13, fontWeight: 500,
            color: 'rgba(255,255,255,0.92)',
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>
            <Icon name="schedule" size={14} color={T.c.n0}/>
            Termina {dateLine}
          </div>
        </section>

        {/* Como cumprir */}
        <section style={{ padding: '24px 20px 8px' }}>
          <SectionTitle eyebrow="01" title="Como cumprir"/>
          <p style={{
            margin: '8px 0 0',
            fontSize: 15, lineHeight: 1.55,
            color: T.c.n800, textWrap: 'pretty',
          }}>{criteria}</p>
        </section>

        {/* Recompensa */}
        <section style={{ padding: '24px 20px 8px' }}>
          <SectionTitle eyebrow="02" title="Recompensa"/>
          <ul style={{
            margin: '12px 0 0', padding: 0, listStyle: 'none',
            display: 'flex', flexDirection: 'column', gap: 8,
          }}>
            <RewardItem icon="stars" tone={T.c.a700}>
              <b>+50 pontos</b> direto na sua conta
            </RewardItem>
            <RewardItem icon="workspace_premium" tone={T.c.p700}>
              Badge <b>"Desafio Semana {weekN}"</b> no seu perfil
            </RewardItem>
            <RewardItem
              icon="leaderboard"
              tone={inConfraria ? T.c.s700 : T.c.n400}
              muted={!inConfraria}
            >
              {inConfraria
                ? <>Pontos no <b>ranking da Confraria</b></>
                : <span>Ranking da Confraria <i>(você não participa de nenhuma)</i></span>
              }
            </RewardItem>
          </ul>
        </section>

        {/* Sugestões */}
        <section style={{ padding: '24px 0 8px' }}>
          <div style={{ padding: '0 20px' }}>
            <SectionTitle
              eyebrow="03"
              title="Sugestões"
              subtitle={`Vinhos do nosso catálogo que valem pro desafio.`}
            />
          </div>
          {suggestions.length === 0 ? (
            <div style={{ padding: '12px 20px 0', ...T.t.caption, color: T.c.n600 }}>
              Ainda não temos sugestões na base — mas qualquer vinho que se encaixe vale.
            </div>
          ) : (
            <div style={{
              marginTop: 12,
              display: 'flex', gap: 12,
              overflowX: 'auto', overflowY: 'hidden',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              padding: '4px 20px',
            }}>
              {suggestions.map((w, i) => (
                <DesafioWineCard
                  key={w.id || i}
                  wine={w}
                  onTap={() => onTapWine(w)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Já tentou? */}
        <section style={{ padding: '24px 20px 28px' }}>
          <SectionTitle
            eyebrow="04"
            title="Já tentou?"
            subtitle="Vinhos que você registrou esta semana e contam pro desafio."
          />
          <div style={{ marginTop: 12 }}>
            {registered.length === 0 ? (
              <EmptyTried onRegister={onRegisterFromHere} title={challenge.title}/>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {registered.map((entry, i) => (
                  <RegisteredEntry key={entry.id || i} entry={entry} onTap={() => onTapWine(entry.wine)}/>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

// ─── Bits ────────────────────────────────────────────────────
function SectionTitle({ eyebrow, title, subtitle }) {
  return (
    <div>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
      }}>
        {eyebrow && (
          <span style={{
            fontFamily: T.mono, fontSize: 10, fontWeight: 600,
            color: T.c.p700, letterSpacing: 1.4,
            padding: '2px 6px', background: T.c.p50,
            borderRadius: T.r.xs,
          }}>{eyebrow}</span>
        )}
        <h3 style={{
          margin: 0, fontSize: 16, fontWeight: 700,
          color: T.c.n950, letterSpacing: '-0.01em',
        }}>{title}</h3>
      </div>
      {subtitle && (
        <p style={{
          margin: '6px 0 0',
          fontSize: 13, lineHeight: 1.5,
          color: T.c.n600,
        }}>{subtitle}</p>
      )}
    </div>
  );
}

function RewardItem({ icon, tone, muted, children }) {
  return (
    <li style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 14px',
      background: muted ? T.c.n100 : T.c.n0,
      border: `1px solid ${muted ? T.c.n200 : T.c.n200}`,
      borderRadius: T.r.md,
      opacity: muted ? 0.78 : 1,
    }}>
      <div style={{
        width: 34, height: 34, borderRadius: T.r.sm,
        background: muted ? T.c.n200 : `${tone}1A`,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon name={icon} size={18} color={tone} fill={muted ? 0 : 1}/>
      </div>
      <div style={{
        flex: 1, minWidth: 0,
        fontSize: 14, lineHeight: 1.45,
        color: muted ? T.c.n600 : T.c.n800,
      }}>{children}</div>
      <Icon
        name={muted ? 'remove' : 'check_circle'}
        size={18}
        color={muted ? T.c.n400 : tone}
        fill={muted ? 0 : 1}
      />
    </li>
  );
}

function DesafioWineCard({ wine, onTap }) {
  return (
    <button
      type="button"
      onClick={onTap}
      style={{
        width: 150, flexShrink: 0,
        textAlign: 'left',
        background: T.c.n0,
        border: `1px solid ${T.c.n200}`,
        borderRadius: T.r.lg,
        padding: 0,
        cursor: 'pointer',
        overflow: 'hidden',
        fontFamily: T.font,
        display: 'flex', flexDirection: 'column',
        transition: 'border-color 120ms, transform 100ms',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = T.c.p300;
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = T.c.n200;
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={{
        height: 120, background: T.c.n100,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
      }}>
        <BottlePlaceholder width={56} height={92} showLabel={false}/>
        {typeof wine.match === 'number' && (
          <div style={{
            position: 'absolute', top: 6, right: 6,
            padding: '2px 8px',
            background: matchToneColor22(wine.match),
            color: T.c.n0,
            borderRadius: T.r.full,
            fontSize: 11, fontWeight: 700,
          }}>{wine.match}%</div>
        )}
      </div>
      <div style={{ padding: 10, display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{
          ...T.t.overline, color: T.c.n600,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{wine.producer || '—'}</div>
        <div style={{
          ...T.t.bodyB, color: T.c.n950, fontSize: 13, lineHeight: 1.3,
          marginTop: 2,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>{wine.name}</div>
        <div style={{
          marginTop: 'auto', paddingTop: 6,
          ...T.t.caption, color: T.c.n600,
        }}>{wine.region || wine.country}</div>
      </div>
    </button>
  );
}

function matchToneColor22(score) {
  if (typeof score !== 'number') return T.c.n400;
  if (score >= 75) return T.c.s700;
  if (score >= 50) return T.c.a700;
  return T.c.n600;
}

function EmptyTried({ onRegister, title }) {
  return (
    <div style={{
      padding: '20px 16px',
      background: T.c.n0,
      border: `1px dashed ${T.c.n300}`,
      borderRadius: T.r.lg,
      textAlign: 'center',
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: '50%',
        background: T.c.n100,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 10,
      }}>
        <Icon name="hourglass_empty" size={22} color={T.c.n600}/>
      </div>
      <div style={{
        ...T.t.bodyB, color: T.c.n950,
        fontSize: 14, lineHeight: 1.35,
        maxWidth: 280, margin: '0 auto',
      }}>Você ainda não registrou nenhum vinho que valha pro desafio esta semana.</div>
      <button
        type="button"
        onClick={onRegister}
        style={{
          marginTop: 12,
          height: 38, padding: '0 16px',
          background: T.c.p700, color: T.c.n0,
          border: 'none', borderRadius: T.r.full,
          fontFamily: T.font, fontSize: 13, fontWeight: 700,
          cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', gap: 6,
          transition: 'background 120ms',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = T.c.p900; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = T.c.p700; }}
      >
        <Icon name="add" size={16} color={T.c.n0}/>
        Registrar agora
      </button>
    </div>
  );
}

function RegisteredEntry({ entry, onTap }) {
  const wine = entry.wine || {};
  return (
    <button
      type="button"
      onClick={onTap}
      style={{
        width: '100%', textAlign: 'left',
        background: T.c.n0,
        border: `1px solid ${T.c.s100}`,
        borderRadius: T.r.md,
        padding: 10,
        display: 'flex', alignItems: 'center', gap: 12,
        cursor: 'pointer',
        fontFamily: T.font,
        boxShadow: '0 1px 3px rgba(46,125,50,0.06)',
      }}
    >
      <BottlePlaceholder width={40} height={56} showLabel={false}/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          ...T.t.bodyB, color: T.c.n950, fontSize: 14,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{wine.name}</div>
        <div style={{ ...T.t.caption, color: T.c.n600, marginTop: 2 }}>
          {wine.producer}{wine.country ? ` · ${wine.country}` : ''}
        </div>
      </div>
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '4px 9px',
        background: T.c.s700, color: T.c.n0,
        borderRadius: T.r.full,
        fontSize: 11, fontWeight: 700,
        letterSpacing: 0.2,
        flexShrink: 0,
      }}>
        <Icon name="check_circle" size={12} color={T.c.n0} fill={1}/>
        Vale pro desafio
      </span>
    </button>
  );
}

// ─── Helpers ──────────────────────────────────────────────────
function formatDesafioDate(iso) {
  if (!iso) return 'em breve';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return 'em breve';
  const days = ['domingo','segunda','terça','quarta','quinta','sexta','sábado'];
  const months = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
  return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}, às ${String(d.getHours()).padStart(2,'0')}h${String(d.getMinutes()).padStart(2,'0')}`;
}

Object.assign(window, { DetalheDesafio });


export { DesafioWineCard, DetalheDesafio, EmptyTried, RegisteredEntry, RewardItem, SectionTitle, formatDesafioDate, matchToneColor22 };
