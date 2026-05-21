/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import { Avatar } from './f13_01_Avatar.jsx';
import { Icon, T } from './tokens.jsx';

// ─────────────────────────────────────────────────────────────
// 22.03 · RankingConfraria — ranking semanal da confraria
//
// US-13-3-02 · ranking do desafio da semana dentro da confraria
//
//   <RankingConfraria
//     confraria={{ name, members }}
//     challenge={{ title, flag, endsAt, weekNumber, locked: false }}
//     entries={[                            // ordered desc by count/points
//       { userId, name, avatarUrl, count, points },
//     ]}
//     currentUser={{ userId, name, position, count, points }}
//     onBack={() => ...}
//     onRegisterNow={() => ...}
//   />
//
// Comportamento: top-5 sempre. "Sua posição" só aparece quando o user
// está em 6º+. Medalha permanente no 1º quando challenge.locked=true.
// ─────────────────────────────────────────────────────────────

function RankingConfraria({
  confraria = {},
  challenge = {},
  entries = [],
  currentUser,
  onBack = () => {},
  onRegisterNow = () => {},
  // Demo override pra previews
  staticTimeLine,
}) {
  const top5 = entries.slice(0, 5);
  const isUserInTop5 = currentUser && top5.some(e => e.userId === currentUser.userId);
  const showSelfCard = !!currentUser && !isUserInTop5;
  const locked = !!challenge.locked;

  const timeLine = staticTimeLine
    || (challenge.endsAt ? `Termina ${formatRankingDeadline(challenge.endsAt)}` : 'Termina domingo às 23h59');

  return (
    <div
      data-screen-label="22.03 RankingConfraria"
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
        }}>Ranking da semana</h4>
        {locked && (
          <div style={{
            ...T.t.caption, color: T.c.s700,
            fontFamily: T.mono, fontWeight: 600,
            padding: '4px 10px', background: T.c.s100,
            borderRadius: T.r.full, marginRight: 12,
            letterSpacing: 0.3,
            display: 'inline-flex', alignItems: 'center', gap: 4,
          }}>
            <Icon name="lock" size={11} color={T.c.s700}/>
            Encerrado
          </div>
        )}
      </header>

      <div style={{
        flex: 1, overflowY: 'auto', overflowX: 'hidden',
        paddingBottom: 110,
      }}>
        {/* Hero card */}
        <section style={{
          margin: 16,
          padding: 18,
          background: `linear-gradient(135deg, ${T.c.p700} 0%, ${T.c.p900} 100%)`,
          color: T.c.n0,
          borderRadius: T.r.lg,
          boxShadow: '0 6px 16px rgba(74,31,36,0.22)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div aria-hidden="true" style={{
            position: 'absolute', top: -50, right: -40,
            width: 180, height: 180, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(212,165,116,0.30) 0%, transparent 70%)',
          }}/>
          <div style={{
            ...T.t.overline,
            color: T.c.a500,
            letterSpacing: 1.4,
            position: 'relative',
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>
            <Icon name="groups" size={12} color={T.c.a500}/>
            Confraria {confraria.name || ''}
          </div>
          <h3 style={{
            margin: '6px 0 0',
            position: 'relative',
            fontFamily: T.serif || "'Fraunces', Georgia, serif",
            fontSize: 22, fontWeight: 600,
            letterSpacing: '-0.02em', lineHeight: 1.15,
            color: T.c.n0, textWrap: 'balance',
          }}>Top 5 — {challenge.title || 'Desafio'} {challenge.flag || ''}</h3>
          <div style={{
            position: 'relative',
            marginTop: 10,
            fontSize: 12, fontWeight: 500,
            color: 'rgba(255,255,255,0.78)',
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>
            <Icon name={locked ? 'check_circle' : 'schedule'} size={13} color="rgba(255,255,255,0.78)" fill={locked ? 1 : 0}/>
            {locked ? 'Encerrado · medalhas oficiais' : timeLine}
          </div>
        </section>

        {/* Top 5 list */}
        <section style={{ padding: '4px 16px 0' }}>
          <div style={{
            ...T.t.overline, color: T.c.n600,
            marginBottom: 10,
          }}>Top 5</div>
          <div style={{
            background: T.c.n0,
            border: `1px solid ${T.c.n200}`,
            borderRadius: T.r.lg,
            overflow: 'hidden',
          }}>
            {top5.length === 0 ? (
              <div style={{ padding: 24, textAlign: 'center' }}>
                <div style={{ ...T.t.bodyB, color: T.c.n950 }}>Ainda ninguém pontuou</div>
                <div style={{ ...T.t.caption, color: T.c.n600, marginTop: 4 }}>Seja o primeiro essa semana 🚀</div>
              </div>
            ) : (
              top5.map((entry, i) => (
                <RankingRow
                  key={entry.userId || i}
                  entry={entry}
                  position={i + 1}
                  isSelf={currentUser && entry.userId === currentUser.userId}
                  locked={locked}
                  showDivider={i < top5.length - 1}
                  unit={challenge.unitSingular || 'vinho'}
                  unitPlural={challenge.unitPlural || 'vinhos'}
                  qualifier={challenge.qualifier || ''}
                />
              ))
            )}
          </div>
        </section>

        {/* "Sua posição" — só quando user > 5º */}
        {showSelfCard && (
          <section style={{ padding: '20px 16px 0' }}>
            <div style={{
              ...T.t.overline, color: T.c.n600,
              marginBottom: 10,
            }}>Sua posição</div>

            {/* visual gap indicator */}
            <div aria-hidden="true" style={{
              display: 'flex', justifyContent: 'center',
              padding: '4px 0 10px',
            }}>
              <div style={{
                display: 'inline-flex', flexDirection: 'column', gap: 3,
              }}>
                {[0,1,2].map(i => (
                  <span key={i} style={{
                    width: 4, height: 4, borderRadius: '50%',
                    background: T.c.n300,
                  }}/>
                ))}
              </div>
            </div>

            <div style={{
              background: T.c.n0,
              border: `2px solid ${T.c.p700}`,
              borderRadius: T.r.lg,
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(74,31,36,0.10)',
            }}>
              <RankingRow
                entry={currentUser}
                position={currentUser.position}
                isSelf
                locked={locked}
                showDivider={false}
                unit={challenge.unitSingular || 'vinho'}
                unitPlural={challenge.unitPlural || 'vinhos'}
                qualifier={challenge.qualifier || ''}
              />
            </div>
          </section>
        )}

        {!locked && (
          <p style={{
            margin: '20px 16px 0',
            padding: '12px 14px',
            background: T.c.a100,
            border: `1px solid ${T.c.a500}`,
            borderRadius: T.r.md,
            fontSize: 12, lineHeight: 1.5,
            color: T.c.p900,
            display: 'flex', alignItems: 'flex-start', gap: 8,
          }}>
            <Icon name="emoji_events" size={16} color={T.c.a700} fill={1} style={{ flexShrink: 0, marginTop: 1 }}/>
            <span>
              Medalha do 1º vira <b>permanente</b> no domingo à noite — aparece no perfil pra sempre.
            </span>
          </p>
        )}
      </div>

      {/* Bottom CTA */}
      {!locked && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '12px 16px 16px',
          background: T.c.n0,
          borderTop: `1px solid ${T.c.n200}`,
          boxShadow: '0 -8px 24px rgba(0,0,0,0.05)',
        }}>
          <button
            type="button"
            onClick={onRegisterNow}
            style={{
              width: '100%', height: 52,
              background: T.c.p700, color: T.c.n0,
              border: 'none', borderRadius: T.r.md,
              fontFamily: T.font, fontSize: 15, fontWeight: 700,
              letterSpacing: '-0.005em',
              cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: '0 4px 12px rgba(74,31,36,0.20)',
              transition: 'background 120ms',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = T.c.p900; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = T.c.p700; }}
          >
            <Icon name="trending_up" size={18} color={T.c.n0}/>
            Registrar agora pra subir no ranking
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Ranking row ─────────────────────────────────────────────
function RankingRow({
  entry, position, isSelf, locked, showDivider,
  unit, unitPlural, qualifier,
}) {
  const isPodium = position <= 3;
  const medal = position === 1 ? '🥇' : position === 2 ? '🥈' : position === 3 ? '🥉' : null;
  const countLabel = `${entry.count} ${entry.count === 1 ? unit : unitPlural}${qualifier ? ' ' + qualifier : ''}`;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '14px 14px',
      background: isSelf ? T.c.p50 : T.c.n0,
      borderBottom: showDivider ? `1px solid ${T.c.n100}` : 'none',
      position: 'relative',
    }}>
      {/* Position */}
      <PositionBadge position={position} medal={medal} locked={locked && position === 1}/>

      {/* Avatar */}
      {typeof Avatar !== 'undefined' ? (
        <Avatar
          size="md"
          name={entry.name}
          userId={entry.userId || entry.name}
          src={entry.avatarUrl}
        />
      ) : (
        <FallbackAvatarSimple name={entry.name}/>
      )}

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          ...T.t.bodyB, color: T.c.n950, fontSize: 14,
          letterSpacing: '-0.005em',
          display: 'inline-flex', alignItems: 'center', gap: 6,
          maxWidth: '100%',
        }}>
          <span style={{
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{entry.name || '—'}</span>
          {isSelf && (
            <span style={{
              fontSize: 10, fontWeight: 700,
              color: T.c.p700,
              background: T.c.p100,
              padding: '2px 6px',
              borderRadius: T.r.full,
              letterSpacing: 0.4,
              flexShrink: 0,
            }}>VOCÊ</span>
          )}
        </div>
        <div style={{
          ...T.t.caption, color: T.c.n600,
          marginTop: 2,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{countLabel}</div>
      </div>

      {/* Points */}
      <div style={{
        ...T.t.bodyB, color: isPodium ? T.c.p700 : T.c.n950,
        fontFamily: T.serif || "'Fraunces', Georgia, serif",
        fontSize: 17, fontWeight: 600,
        letterSpacing: '-0.015em',
        flexShrink: 0,
      }}>+{entry.points}</div>
    </div>
  );
}

function PositionBadge({ position, medal, locked }) {
  if (medal) {
    return (
      <div style={{
        position: 'relative',
        width: 36, height: 36, flexShrink: 0,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 26, lineHeight: 1,
      }}>
        <span aria-hidden="true">{medal}</span>
        {locked && (
          <span aria-hidden="true" style={{
            position: 'absolute', bottom: -2, right: -2,
            width: 14, height: 14, borderRadius: '50%',
            background: T.c.s700,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            border: `1.5px solid ${T.c.n0}`,
          }}>
            <Icon name="check" size={9} color={T.c.n0} weight={700}/>
          </span>
        )}
      </div>
    );
  }
  return (
    <div style={{
      width: 36, height: 36, flexShrink: 0,
      borderRadius: '50%',
      background: T.c.n100,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: T.serif || "'Fraunces', Georgia, serif",
      fontSize: 15, fontWeight: 700,
      color: T.c.n600,
      letterSpacing: '-0.01em',
    }}>{position}</div>
  );
}

function FallbackAvatarSimple({ name }) {
  const initials = String(name || '?').trim().split(/\s+/).slice(0, 2).map(s => s[0]).join('').toUpperCase();
  return (
    <div style={{
      width: 40, height: 40, borderRadius: '50%',
      background: `linear-gradient(135deg, ${T.c.p500}, ${T.c.p900})`,
      color: T.c.n0,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: T.font, fontSize: 13, fontWeight: 700,
      flexShrink: 0,
    }}>{initials}</div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────
function formatRankingDeadline(iso) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return 'domingo às 23h59';
  const days = ['domingo','segunda','terça','quarta','quinta','sexta','sábado'];
  return `${days[d.getDay()]} às ${String(d.getHours()).padStart(2,'0')}h${String(d.getMinutes()).padStart(2,'0')}`;
}

Object.assign(window, { RankingConfraria });


export { FallbackAvatarSimple, PositionBadge, RankingConfraria, RankingRow, formatRankingDeadline };
