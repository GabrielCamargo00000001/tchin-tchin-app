/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { Button } from './components.jsx';
import { fbEvent } from './screens-wizard-confraria.jsx';
import { Icon, T } from './tokens.jsx';

// Tchin Tchin — 11.05 Plus One (convidar acompanhante não-membro)
// ────────────────────────────────────────────────────────────────
// Fluxo de convite por LINK COMPARTILHÁVEL pra acompanhante que ainda não é
// membro do Tchin (NÃO coletamos telefone — Gabriel decidiu). US-14-2-01.
// Aparece após user confirmar RSVP via CTA "Levar acompanhante?" na tela do evento.
//
// Regras:
//   • 1 Plus One por user por evento (default; admin configura em 09.04)
//   • Se evento esgotado → convidado vai pra lista de espera (inline)
//   • Plus One que vira "membro ativo" (3+ registros em 14d) dá ao
//     anfitrião o badge "Embaixador" (+300 pts)

const NAME_MAX = 60;

// ─── Pure component ─────────────────────────────────────────
//  props:
//    event: { id, title, date, time, location, modality, capacity?, confirmedCount? }
//    inviterName?: string                        — pra montar o preview
//    onGenerateLink: (data) => Promise<string>    — retorna a URL do convite
//    onShare: (link) => void                      — dispara o share nativo
//    onDone / onCancel: () => void
function PlusOne({ event, inviterName, onGenerateLink, onShare, onDone, onCancel }) {
  const [name, setName]     = React.useState('');
  const [photo, setPhoto]   = React.useState(null);     // mock — só flag
  const [generating, setGenerating] = React.useState(false);
  const [link, setLink]     = React.useState(null);     // null = ainda não gerou
  const [copied, setCopied] = React.useState(false);
  const [error, setError]   = React.useState(null);

  // Lista de espera quando o evento está esgotado
  const isSoldOut = event && event.capacity != null && event.confirmedCount != null
    && event.confirmedCount >= event.capacity;

  const nameValid  = name.trim().length >= 2;
  const valid = nameValid && !generating;

  const onChangeName = (v) => setName(v.slice(0, NAME_MAX));

  // Gera um link de convite compartilhável (sem coletar telefone — Gabriel decidiu).
  const handleGenerate = async () => {
    if (!valid) return;
    setGenerating(true); setError(null);
    fbEvent('plus_one_link_generated', {
      event_id: event.id,
      waitlisted: isSoldOut,
    });
    try {
      const url = await onGenerateLink({
        eventId: event.id,
        name: name.trim(),
        photoAttached: Boolean(photo),
        waitlisted: isSoldOut,
      });
      setLink(url || `tchin.app/e/${event.id || 'evt'}/a1b2c3`);
    } catch (e) {
      setError('Não conseguimos gerar o link agora. Tenta de novo.');
    }
    setGenerating(false);
  };

  const handleCopy = () => {
    try { if (navigator && navigator.clipboard) navigator.clipboard.writeText('https://' + link); } catch (e) {}
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const inviterDisplayName = inviterName
    || (typeof window !== 'undefined' && window.MOCK_USER && window.MOCK_USER.name)
    || 'Um amigo';

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n0, position: 'relative', overflow: 'hidden' }}>
      {/* ── Top bar ── */}
      <header style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 12px 8px 4px', minHeight: 56, flexShrink: 0,
      }}>
        <button
          onClick={onCancel} aria-label="Fechar"
          disabled={generating}
          style={{
            width: 44, height: 44, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'transparent', border: 'none',
            cursor: generating ? 'not-allowed' : 'pointer',
            color: T.c.n950, opacity: generating ? 0.5 : 1,
          }}>
          <Icon name="close" size={24}/>
        </button>
        <div style={{
          flex: 1, textAlign: 'center',
          fontFamily: '"Fraunces", Georgia, serif',
          fontSize: 17, lineHeight: 1.2, fontWeight: 600,
          letterSpacing: '-0.01em', color: T.c.n950,
        }}>
          Levar acompanhante
        </div>
        <div style={{ width: 44, flexShrink: 0 }}/>
      </header>

      {/* ── Body ── */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        <div style={{ padding: '20px 24px 0' }}>
          <p style={{
            margin: 0,
            fontFamily: T.font,
            fontSize: 15, lineHeight: 1.5, color: T.c.n800,
            textWrap: 'pretty',
          }}>
            Você pode convidar <strong style={{ color: T.c.n950 }}>1 amigo</strong> que ainda não tá no Tchin. Gera um link e manda pra ele por onde quiser — ao abrir, ele cai direto no evento.
          </p>

          {isSoldOut && (
            <div style={{
              marginTop: 16,
              display: 'flex', alignItems: 'flex-start', gap: 10,
              padding: '12px 14px',
              background: T.c.w100, border: `1px solid ${T.c.w700}`,
              borderRadius: T.r.md,
            }}>
              <Icon name="hourglass_top" size={18} color={T.c.w700} fill={1} style={{ flexShrink: 0, marginTop: 1 }}/>
              <div style={{
                fontFamily: T.font, fontSize: 13, lineHeight: 1.45, color: T.c.w700,
              }}>
                <strong style={{ fontWeight: 700 }}>Evento esgotado.</strong> Seu convidado entra na lista de espera e a gente avisa se vagar.
              </div>
            </div>
          )}

          <div style={{ height: 24 }}/>

          {/* Nome */}
          <FloatingInput
            label="Nome do convidado"
            value={name}
            onChange={onChangeName}
            maxLength={NAME_MAX}
            placeholder="Ex: João Silva"
            counter
            required
          />

          <div style={{ height: 16 }}/>

          {/* Foto (opcional) */}
          <PhotoPicker hasPhoto={photo} onPick={() => setPhoto(true)} onRemove={() => setPhoto(null)}/>

          {/* Link gerado */}
          {link && (
            <div style={{ marginTop: 20 }}>
              <div style={{
                fontFamily: T.font, fontSize: 11, fontWeight: 600, lineHeight: 1.4,
                color: T.c.n600, marginBottom: 8, paddingLeft: 4,
                textTransform: 'uppercase', letterSpacing: '0.5px',
              }}>
                Link do convite
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '12px 14px',
                background: T.c.s100, border: `1px solid ${T.c.s700}`, borderRadius: T.r.md,
              }}>
                <Icon name="link" size={18} color={T.c.s700} fill={1} style={{ flexShrink: 0 }}/>
                <div style={{
                  flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  fontFamily: T.mono, fontSize: 13, color: T.c.n950,
                }}>
                  {link}
                </div>
                <button onClick={handleCopy} style={{
                  flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 4,
                  padding: '6px 10px', background: T.c.n0, border: `1.5px solid ${T.c.s700}`,
                  borderRadius: T.r.sm, color: T.c.s700, cursor: 'pointer',
                  fontFamily: T.font, fontSize: 12, fontWeight: 600,
                }}>
                  <Icon name={copied ? 'check' : 'content_copy'} size={14} color={T.c.s700}/>
                  {copied ? 'Copiado' : 'Copiar'}
                </button>
              </div>
            </div>
          )}

          <div style={{ height: 24 }}/>

          {/* Preview card */}
          <PreviewCard
            event={event}
            inviterName={inviterDisplayName}
            guestName={name.trim() || 'João'}
            isSoldOut={isSoldOut}
          />

          {/* Embaixador hint */}
          <div style={{
            marginTop: 16,
            display: 'flex', alignItems: 'flex-start', gap: 10,
            padding: '10px 14px',
            background: T.c.a100,
            borderRadius: T.r.md,
          }}>
            <Icon name="emoji_events" size={18} color={T.c.a700} fill={1} style={{ flexShrink: 0, marginTop: 1 }}/>
            <div style={{
              fontFamily: T.font, fontSize: 12, lineHeight: 1.45, color: T.c.n800,
            }}>
              Se ele virar membro ativo (3+ registros em 14d), você ganha o badge <strong style={{ color: T.c.a700 }}>Embaixador</strong> + 300 pts.
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              marginTop: 16,
              display: 'flex', alignItems: 'flex-start', gap: 10,
              padding: '12px 14px',
              background: T.c.e100, border: `1px solid ${T.c.e700}`,
              borderRadius: T.r.md,
            }}>
              <Icon name="error" size={18} color={T.c.e700} fill={1}/>
              <div style={{
                fontFamily: T.font, fontSize: 13, lineHeight: 1.4, color: T.c.e700,
              }}>
                {error}
              </div>
            </div>
          )}

          <div style={{ height: 24 }}/>
        </div>
      </div>

      {/* ── Bottom CTAs ── */}
      <div style={{
        padding: '12px 24px 24px',
        paddingBottom: 'max(24px, env(safe-area-inset-bottom))',
        display: 'flex', flexDirection: 'column', gap: 8,
        background: T.c.n0, borderTop: `1px solid ${T.c.n100}`,
        flexShrink: 0,
      }}>
        {!link ? (
          <>
            <Button
              variant="primary" size="lg" fullWidth
              loading={generating}
              disabled={!valid}
              onClick={handleGenerate}
              leading={!generating && <Icon name="link" size={18} color="#FFFFFF" fill={1}/>}>
              {generating ? 'Gerando…' : 'Gerar link de convite'}
            </Button>
            <Button variant="ghost" size="md" fullWidth onClick={onCancel} disabled={generating}>
              Cancelar
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="primary" size="lg" fullWidth
              onClick={() => onShare && onShare(link)}
              leading={<Icon name="ios_share" size={18} color="#FFFFFF" fill={1}/>}>
              Compartilhar convite
            </Button>
            <Button variant="ghost" size="md" fullWidth onClick={onDone || onCancel}>
              Concluir
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── FloatingInput ──────────────────────────────────────────
function FloatingInput({ label, value, onChange, type = 'text', placeholder, helper, leading, maxLength, counter, required }) {
  const [focused, setFocused] = React.useState(false);
  const labelFloating = focused || (value && value.length > 0);
  const len = value ? value.length : 0;
  return (
    <div>
      <div style={{
        position: 'relative',
        border: `1.5px solid ${focused ? T.c.p700 : T.c.n300}`,
        borderRadius: T.r.md, background: T.c.n0,
        transition: 'border-color 160ms',
        display: 'flex', alignItems: 'center',
      }}>
        <label
          style={{
            position: 'absolute',
            left: labelFloating ? 12 : (leading ? 40 : 16),
            top: labelFloating ? -8 : 18,
            padding: labelFloating ? '0 6px' : 0,
            background: labelFloating ? T.c.n0 : 'transparent',
            fontFamily: T.font,
            fontSize: labelFloating ? 11 : 15,
            fontWeight: labelFloating ? 600 : 400,
            color: focused ? T.c.p700 : T.c.n600,
            pointerEvents: 'none',
            transition: 'all 140ms cubic-bezier(0.2, 0.8, 0.2, 1)',
            letterSpacing: labelFloating ? '0.2px' : '0',
          }}>
          {label}{required && labelFloating ? '' : ''}
        </label>
        {leading && (
          <div style={{ marginLeft: 12, display: 'flex', flexShrink: 0 }}>
            {leading}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={labelFloating ? placeholder : ''}
          maxLength={maxLength}
          inputMode={type === 'tel' ? 'tel' : undefined}
          style={{
            width: '100%', padding: leading ? '18px 16px 18px 10px' : '18px 16px',
            paddingRight: counter ? 56 : 16,
            border: 'none', outline: 'none', background: 'transparent',
            fontFamily: T.font, fontSize: 16, lineHeight: 1.4, color: T.c.n950,
            boxSizing: 'border-box',
          }}
        />
        {counter && maxLength && (
          <span style={{
            position: 'absolute', right: 12, bottom: 6,
            fontFamily: T.mono, fontSize: 11, fontWeight: 500,
            color: len > maxLength * 0.9 ? T.c.w700 : T.c.n400,
            pointerEvents: 'none',
          }}>
            {len}/{maxLength}
          </span>
        )}
      </div>
      {helper && (
        <div style={{
          marginTop: 6, paddingLeft: 4,
          fontFamily: T.font, fontSize: 12, color: T.c.n600,
        }}>
          {helper}
        </div>
      )}
    </div>
  );
}

// ─── PhotoPicker ────────────────────────────────────────────
function PhotoPicker({ hasPhoto, onPick, onRemove }) {
  if (hasPhoto) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: 12,
        background: T.c.n50, border: `1px solid ${T.c.n200}`, borderRadius: T.r.md,
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: T.r.sm,
          background: `linear-gradient(135deg, ${T.c.p300}, ${T.c.p700})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Icon name="photo" size={22} color="#FFFFFF" fill={1}/>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: T.font, fontSize: 13, fontWeight: 600, color: T.c.n950,
          }}>
            Foto adicionada
          </div>
          <div style={{
            fontFamily: T.font, fontSize: 11, color: T.c.n600,
          }}>
            Vai aparecer no convite
          </div>
        </div>
        <button onClick={onRemove}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: 8, color: T.c.n600,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
          <Icon name="close" size={18}/>
        </button>
      </div>
    );
  }
  return (
    <button
      onClick={onPick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '10px 16px',
        background: T.c.n0,
        border: `1.5px solid ${T.c.p700}`,
        borderRadius: T.r.md,
        color: T.c.p700, cursor: 'pointer',
        fontFamily: T.font, fontSize: 14, fontWeight: 600,
      }}>
      <Icon name="photo_camera" size={18} color={T.c.p700}/>
      Adicionar foto
      <span style={{
        marginLeft: 4, fontWeight: 500, color: T.c.n600, fontSize: 12,
      }}>
        (opcional)
      </span>
    </button>
  );
}

// ─── PreviewCard — como vai aparecer pro convidado ─────────
function PreviewCard({ event, inviterName, guestName, isSoldOut }) {
  return (
    <div>
      <div style={{
        fontFamily: T.font, fontSize: 11, fontWeight: 600, lineHeight: 1.4,
        color: T.c.n600, marginBottom: 8, paddingLeft: 4,
        textTransform: 'uppercase', letterSpacing: '0.5px',
      }}>
        Como vai aparecer pra ele
      </div>
      <div style={{
        background: T.c.n50,
        border: `1px solid ${T.c.n200}`,
        borderRadius: T.r.lg,
        padding: 16,
      }}>
        {/* Header do convite */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12,
          paddingBottom: 10, borderBottom: `1px solid ${T.c.n200}`,
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: T.c.p700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="wine_bar" size={16} color="#FFFFFF" fill={1}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: T.font, fontSize: 12, fontWeight: 700, color: T.c.n950,
            }}>
              Tchin Tchin
            </div>
            <div style={{
              fontFamily: T.font, fontSize: 10, color: T.c.n600,
            }}>
              Convite pra evento
            </div>
          </div>
        </div>

        {/* Event preview "card" */}
        <div style={{
          background: T.c.n0,
          border: `1px solid ${T.c.n200}`,
          borderRadius: T.r.md,
          overflow: 'hidden', marginBottom: 12,
        }}>
          <div style={{
            height: 64,
            background: `linear-gradient(135deg, ${T.c.p700} 0%, ${T.c.p900} 100%)`,
            position: 'relative',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ opacity: 0.18, position: 'absolute', inset: 0,
              backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.4) 0 1px, transparent 1px 14px)' }}/>
            <Icon name="event" size={28} color="#FFFFFF" fill={1} style={{ position: 'relative' }}/>
          </div>
          <div style={{ padding: 10 }}>
            <div style={{
              fontFamily: T.font, fontSize: 13, fontWeight: 700, color: T.c.n950,
              lineHeight: 1.25, marginBottom: 4,
            }}>
              {event && event.title}
            </div>
            <div style={{
              fontFamily: T.font, fontSize: 11, color: T.c.n600,
            }}>
              {event && formatEventShort(event.date, event.time)} · {event && (event.location || 'online')}
            </div>
          </div>
        </div>

        {/* Message body */}
        <div style={{
          fontFamily: T.font, fontSize: 13, lineHeight: 1.5, color: T.c.n950,
          marginBottom: 12,
        }}>
          Oi <strong style={{ fontWeight: 700 }}>{guestName}</strong>! <strong style={{ fontWeight: 700 }}>{inviterName}</strong> te convidou pra <strong style={{ fontWeight: 700 }}>{event && event.title}</strong> da <strong style={{ fontWeight: 700 }}>confraria</strong> dele. {' '}
          {event && (event.date ? `${formatEventShort(event.date, event.time)}.` : '')}
          {' '}Quer ir?
        </div>

        {/* Fake CTA */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          padding: '8px 16px',
          background: T.c.p700, color: '#FFFFFF',
          borderRadius: T.r.full,
          fontFamily: T.font, fontSize: 12, fontWeight: 700,
        }}>
          <Icon name="check_circle" size={14} color="#FFFFFF" fill={1}/>
          {isSoldOut ? 'Entrar na lista de espera' : 'Confirmar presença'}
        </div>

        <div style={{
          marginTop: 10, paddingTop: 10, borderTop: `1px dashed ${T.c.n300}`,
          fontFamily: T.mono, fontSize: 10, color: T.c.n600,
          letterSpacing: '0.4px', textTransform: 'uppercase',
        }}>
          Abrindo o link → app store ou direto pro evento
        </div>
      </div>
    </div>
  );
}

// ─── Helpers ────────────────────────────────────────────────
function formatEventShort(dateStr, time) {
  if (!dateStr) return time || '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  const s = dt.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' }).replace(/\./g, '');
  return time ? `${s} · ${time}` : s;
}

// ─── Prototype-integration wrapper ──────────────────────────
function PlusOneScreen({ go, params = {} }) {
  const event = params.event || {
    id: 'evt_demo',
    title: 'Degustação de Malbecs',
    date: '2026-05-23',
    time: '19:30',
    location: 'Bar do Vinho · Asa Sul',
    modality: 'presencial',
    capacity: 12,
    confirmedCount: 7,
  };
  const inviterName = (typeof window !== 'undefined' && window.MOCK_USER && window.MOCK_USER.name) || 'Ana';

  // Gera um link de convite (mock). Em produção: deep link único por convite
  // (token + atribuição), sem coletar telefone de ninguém.
  const onGenerateLink = async (data) => {
    await new Promise(r => setTimeout(r, 700));
    return `tchin.app/e/${data.eventId || 'evt'}/a1b2c3`;
  };
  const onShare = (link) => {
    try {
      if (navigator && navigator.share) { navigator.share({ title: 'Convite Tchin Tchin', url: 'https://' + link }); return; }
    } catch (e) {}
    go('toast', { kind: 'success', message: 'Link pronto — manda pro seu convidado.' });
  };
  const onDone = () => go('back');
  const onCancel = () => go('back');

  return (
    <PlusOne
      event={event}
      inviterName={inviterName}
      onGenerateLink={onGenerateLink}
      onShare={onShare}
      onDone={onDone}
      onCancel={onCancel}
    />
  );
}

Object.assign(window, {
  PlusOne,
  PlusOneScreen,
});


export { FloatingInput, NAME_MAX, PhotoPicker, PlusOne, PlusOneScreen, PreviewCard, formatEventShort };
