/* eslint-disable */
// @ts-nocheck
// Componentes do fluxo de pagamento de evento — extraídos dos previews
// (preview-eventos.jsx) pra virar implementação real. São renderizados
// como OVERLAYS por cima do event-detalhe existente, sem refatorá-lo.
//
// Exporta:
//  • <PaymentBanner kind={pix|admin|pago|expir}>  → banner contextual
//  • <ConfirmadoBanner>                            → banner ao reabrir o app
//  • <ParticiparSheet privacy={publica|privada} paid={bool}>
//  • <EscolherMetodoSheet>
//  • <PixLaciSheet status={aguardando|confirmado}>
//  • <PagarForaSheet>
//  • <CancelarSheet janela={A|B|C}>
import React from 'react';
import { Button } from './components.jsx';
import { Icon, T } from './tokens.jsx';

// ─── Banner contextual de pagamento ──────────────────────────
function PaymentBanner({ kind, label, sub, ctaLabel, onCta }) {
  const map = {
    pix:   { bg: T.c.w100, fg: T.c.w700, ic: 'schedule',      border: T.c.w700 },
    admin: { bg: T.c.i100, fg: T.c.i700, ic: 'hourglass_top', border: T.c.i700 },
    pago:  { bg: T.c.s100, fg: T.c.s700, ic: 'check_circle',  border: T.c.s700 },
    expir: { bg: T.c.e100, fg: T.c.e700, ic: 'error',         border: T.c.e700 },
  };
  const m = map[kind] || map.pix;
  return (
    <div style={{
      background: m.bg, border: `1px solid ${m.border}`, borderRadius: T.r.md,
      padding: '12px 14px', margin: '12px 16px 0',
      display: 'flex', gap: 10, alignItems: 'flex-start',
    }}>
      <Icon name={m.ic} size={20} color={m.fg} fill={1} style={{ flexShrink: 0, marginTop: 1 }}/>
      <div style={{ flex: 1 }}>
        <div style={{ ...T.t.bodyB, color: m.fg, fontSize: 14, marginBottom: 2 }}>{label}</div>
        {sub && <div style={{ ...T.t.caption, color: T.c.n800, lineHeight: 1.4 }}>{sub}</div>}
        {ctaLabel && (
          <button onClick={onCta} style={{
            marginTop: 8, padding: '6px 12px', background: m.fg, color: T.c.n0,
            border: 'none', borderRadius: T.r.full, cursor: 'pointer',
            fontFamily: T.font, fontSize: 12, fontWeight: 700,
          }}>{ctaLabel}</button>
        )}
      </div>
    </div>
  );
}

// ─── Banner ao reabrir o app ──────────────────────────────────
function ConfirmadoBanner({ eventName = 'Degustação de Malbecs', onTap }) {
  return (
    <div onClick={onTap} style={{
      background: T.c.s100, borderBottom: `1px solid ${T.c.s700}`,
      padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10,
      cursor: 'pointer',
      animation: 'tcSlideDownIn 320ms cubic-bezier(0.2, 0.8, 0.2, 1)',
    }}>
      <Icon name="check_circle" size={22} color={T.c.s700} fill={1} style={{ flexShrink: 0 }}/>
      <div style={{ flex: 1 }}>
        <div style={{ ...T.t.bodyB, color: T.c.s700, fontSize: 13.5 }}>✓ Pagamento de {eventName} confirmado</div>
        <div style={{ ...T.t.caption, color: T.c.n800, fontSize: 11.5 }}>Vaga garantida · toque pra ver o evento</div>
      </div>
      <Icon name="chevron_right" size={20} color={T.c.s700}/>
    </div>
  );
}

// ─── SheetWrapper (backdrop + container bottom) ──────────────
function Sheet({ children, onClose }) {
  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, background: 'rgba(15,15,15,0.55)', zIndex: 90,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: '100%', background: T.c.n0, borderTopLeftRadius: 24, borderTopRightRadius: 24,
        padding: 20, animation: 'tcSlideUp 220ms', maxHeight: '92%', overflowY: 'auto',
      }}>
        <div style={{ width: 36, height: 4, background: T.c.n300, borderRadius: 2, margin: '-8px auto 14px' }}/>
        {children}
      </div>
    </div>
  );
}

// ─── ParticiparSheet ─────────────────────────────────────────
function ParticiparSheet({ privacy = 'publica', paid = false, price = 80, evento = 'Degustação de Malbecs', confraria = 'Brindar em Brasília', onClose, onProceed }) {
  const isPriv = privacy === 'privada';
  return (
    <Sheet onClose={onClose}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: isPriv ? T.c.a100 : T.c.s100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={isPriv ? 'lock' : 'public'} size={18} color={isPriv ? T.c.a700 : T.c.s700} fill={1}/>
        </div>
        <div style={{ ...T.t.overline, color: isPriv ? T.c.a700 : T.c.s700, fontWeight: 700, fontSize: 11 }}>
          CONFRARIA {isPriv ? 'PRIVADA' : 'PÚBLICA'}{paid ? ' · PAGO' : ' · GRATUITO'}
        </div>
      </div>
      <div style={{ ...T.t.h2, color: T.c.n950, fontFamily: '"Fraunces", Georgia, serif', marginBottom: 6 }}>
        {isPriv ? 'Solicitar para participar' : 'Participar do evento'}
      </div>
      <div style={{ ...T.t.body, color: T.c.n800, lineHeight: 1.5, marginBottom: 12, fontSize: 14 }}>
        {isPriv ? (
          <><strong>{confraria}</strong> é privada. Vamos mandar uma solicitação pro admin pra você participar de <strong>{evento}</strong> e entrar na confraria. Você é notificado quando aprovar.</>
        ) : (
          <>Ao confirmar, você participa de <strong>{evento}</strong> e entra na confraria <strong>{confraria}</strong>.</>
        )}
      </div>
      {paid && !isPriv && (
        <div style={{ padding: '12px 14px', background: T.c.a100, border: `1px solid ${T.c.a700}`, borderRadius: T.r.md, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon name="payments" size={18} color={T.c.a700}/>
          <div style={{ flex: 1 }}>
            <div style={{ ...T.t.bodyB, color: T.c.n950, fontSize: 14 }}>Evento pago · R$ {price.toFixed(2)} por pessoa</div>
            <div style={{ ...T.t.caption, color: T.c.n800, fontSize: 11.5 }}>Escolha o método no próximo passo. Vaga reservada por 2h.</div>
          </div>
        </div>
      )}
      {isPriv && paid && (
        <div style={{ background: T.c.i100, padding: '10px 12px', borderRadius: T.r.md, marginBottom: 12, display: 'flex', gap: 8 }}>
          <Icon name="info" size={14} color={T.c.i700} style={{ flexShrink: 0, marginTop: 1 }}/>
          <div style={{ ...T.t.caption, color: T.c.n800, lineHeight: 1.45, fontSize: 12 }}>
            O pagamento (R$ {price.toFixed(2)}) só rola <strong>depois que o admin aprovar</strong>. A gente nunca cobra antes da aprovação.
          </div>
        </div>
      )}
      {!isPriv && !paid && (
        <>
          <div style={{ ...T.t.overline, color: T.c.n600, marginBottom: 6, fontSize: 11 }}>VOCÊ VAI?</div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
            {[['vou', 'Vou', 'check_circle', true], ['talvez', 'Talvez', 'help', false], ['nao', 'Não vou', 'cancel', false]].map(([k, l, ic, on]) => (
              <div key={k} style={{ flex: 1, padding: '10px 4px', borderRadius: T.r.md, background: on ? T.c.p50 : T.c.n0, border: `1.5px solid ${on ? T.c.p700 : T.c.n200}`, color: on ? T.c.p700 : T.c.n800, fontFamily: T.font, fontSize: 12, fontWeight: 700, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <Icon name={ic} size={16} color={on ? T.c.p700 : T.c.n600} fill={on ? 1 : 0}/>{l}
              </div>
            ))}
          </div>
        </>
      )}
      {!isPriv && paid && (
        <>
          <div style={{ ...T.t.overline, color: T.c.n600, marginBottom: 6, fontSize: 11 }}>VOCÊ VAI? <span style={{ color: T.c.n400, fontWeight: 400 }}>(sem "Talvez" em pago)</span></div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
            <div style={{ flex: 2, padding: '10px 4px', borderRadius: T.r.md, background: T.c.p50, border: `1.5px solid ${T.c.p700}`, color: T.c.p700, fontFamily: T.font, fontSize: 12, fontWeight: 700, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
              <Icon name="check_circle" size={16} color={T.c.p700} fill={1}/>Vou (+ R$ {price.toFixed(2)})
            </div>
            <div style={{ flex: 1, padding: '10px 4px', borderRadius: T.r.md, background: T.c.n0, border: `1.5px solid ${T.c.n200}`, color: T.c.n800, fontFamily: T.font, fontSize: 12, fontWeight: 700, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
              <Icon name="cancel" size={16} color={T.c.n600}/>Não vou
            </div>
          </div>
        </>
      )}
      {isPriv && (
        <>
          <div style={{ ...T.t.label, color: T.c.n800, marginBottom: 4, fontSize: 12 }}>Mensagem pro admin (opcional)</div>
          <textarea placeholder="Conta rapidinho por que quer entrar..." rows={2} style={{ width: '100%', padding: '8px 10px', border: `1.5px solid ${T.c.n300}`, borderRadius: T.r.md, fontFamily: T.font, fontSize: 13, resize: 'none', outline: 'none', boxSizing: 'border-box', marginBottom: 12 }}/>
        </>
      )}
      <Button variant="primary" size="md" fullWidth leading={isPriv ? <Icon name="send" size={16}/> : null} trailing={paid && !isPriv ? <Icon name="arrow_forward" size={16}/> : null} onClick={onProceed}>
        {isPriv ? 'Enviar solicitação' : (paid ? 'Confirmar e escolher pagamento' : 'Confirmar participação')}
      </Button>
      <div style={{ height: 6 }}/>
      <Button variant="ghost" size="sm" fullWidth onClick={onClose}>Cancelar</Button>
    </Sheet>
  );
}

// ─── EscolherMetodoSheet ─────────────────────────────────────
function EscolherMetodoSheet({ price = 80, modality = 'presencial', onClose, onPickLaci, onPickFora }) {
  const allowNoLocal = modality !== 'online';
  return (
    <Sheet onClose={onClose}>
      <div style={{ ...T.t.overline, color: T.c.p700, fontWeight: 700, fontSize: 11, marginBottom: 6 }}>2/2 · PAGAMENTO</div>
      <div style={{ ...T.t.h2, color: T.c.n950, fontFamily: '"Fraunces", Georgia, serif', marginBottom: 4 }}>Como você quer pagar?</div>
      <div style={{ ...T.t.body, color: T.c.n600, marginBottom: 16, fontSize: 13.5 }}>R$ {price.toFixed(2)} por pessoa · vaga reservada por 2h</div>
      <div onClick={onPickLaci} style={{ border: `2px solid ${T.c.p700}`, background: T.c.p50, borderRadius: T.r.lg, padding: 14, marginBottom: 10, cursor: 'pointer' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: T.r.md, background: T.c.p700, color: T.c.n0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name="bolt" size={20} color={T.c.n0} fill={1}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ ...T.t.bodyB, color: T.c.n950, fontSize: 14 }}>Pagar agora via LACI</div>
              <span style={{ padding: '2px 7px', background: T.c.p700, color: T.c.n0, borderRadius: T.r.full, fontSize: 10, fontWeight: 800 }}>RECOMENDADO</span>
            </div>
            <div style={{ ...T.t.caption, color: T.c.n800, lineHeight: 1.45, marginTop: 3, fontSize: 12 }}>PIX instantâneo · confirmação automática · vaga garantida na hora</div>
          </div>
          <Icon name="radio_button_checked" size={20} color={T.c.p700}/>
        </div>
      </div>
      <div onClick={onPickFora} style={{ border: `1.5px solid ${T.c.n300}`, background: T.c.n0, borderRadius: T.r.lg, padding: 14, marginBottom: 16, cursor: 'pointer' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: T.r.md, background: T.c.n100, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name="handshake" size={20} color={T.c.n800}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ ...T.t.bodyB, color: T.c.n950, fontSize: 14 }}>Combinar com o admin</div>
            <div style={{ ...T.t.caption, color: T.c.n600, lineHeight: 1.45, marginTop: 3, fontSize: 12 }}>
              {allowNoLocal ? 'PIX em outra conta · dinheiro no local · etc.' : 'PIX em outra conta do admin.'} O admin marca como pago quando receber.
            </div>
          </div>
          <Icon name="radio_button_unchecked" size={20} color={T.c.n400}/>
        </div>
      </div>
      <Button variant="primary" size="md" fullWidth trailing={<Icon name="arrow_forward" size={16}/>} onClick={onPickLaci}>Continuar com LACI</Button>
      <div style={{ height: 6 }}/>
      <Button variant="ghost" size="sm" fullWidth onClick={onClose}>Voltar</Button>
    </Sheet>
  );
}

// ─── PixLaciSheet (estados: aguardando | confirmado) ─────────
function PixLaciSheet({ status = 'aguardando', price = 80, evento = 'Degustação de Malbecs', onClose, onAlreadyPaid, onSeeEvent }) {
  if (status === 'confirmado') {
    return (
      <Sheet onClose={onClose}>
        <div style={{ textAlign: 'center', padding: '12px 0 8px' }}>
          <div style={{ width: 96, height: 96, borderRadius: '50%', background: T.c.s100, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
            <Icon name="check_circle" size={56} color={T.c.s700} fill={1}/>
          </div>
          <div style={{ ...T.t.overline, color: T.c.s700, marginBottom: 4, letterSpacing: 1.4 }}>PAGAMENTO CONFIRMADO</div>
          <div style={{ ...T.t.h2, color: T.c.n950, fontFamily: '"Fraunces", Georgia, serif', marginBottom: 8 }}>Sua vaga está garantida</div>
          <div style={{ ...T.t.body, color: T.c.n600, lineHeight: 1.5, marginBottom: 18, fontSize: 14 }}>
            <strong>R$ {price.toFixed(2)}</strong> recebidos via LACI · vaga em <strong>{evento}</strong> consolidada.
          </div>
        </div>
        <div style={{ background: T.c.s100, padding: '10px 12px', borderRadius: T.r.md, marginBottom: 14, display: 'flex', gap: 8 }}>
          <Icon name="check" size={14} color={T.c.s700} fill={1} style={{ flexShrink: 0, marginTop: 1 }}/>
          <div style={{ ...T.t.caption, color: T.c.n800, lineHeight: 1.45, fontSize: 12 }}>Endereço + lista liberados. Adicionamos no calendário e mandamos lembretes (D-7 / D-1 / 2h).</div>
        </div>
        <Button variant="primary" size="md" fullWidth onClick={onSeeEvent}>Ver o evento</Button>
        <div style={{ height: 6 }}/>
        <Button variant="ghost" size="sm" fullWidth onClick={onClose}>Adicionar ao calendário</Button>
      </Sheet>
    );
  }
  return (
    <Sheet onClose={onClose}>
      <div style={{ ...T.t.overline, color: T.c.p700, fontWeight: 700, fontSize: 11, marginBottom: 4 }}>LACI · PAGUE COM PIX</div>
      <div style={{ ...T.t.h2, color: T.c.n950, fontFamily: '"Fraunces", Georgia, serif', marginBottom: 12 }}>R$ {price.toFixed(2)}</div>
      <div style={{ background: T.c.n0, border: `2px dashed ${T.c.n300}`, borderRadius: T.r.lg, padding: 16, marginBottom: 12, display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: 180, height: 180, background: '#000', backgroundImage: 'repeating-conic-gradient(#000 0 90deg, #fff 0 180deg)', backgroundSize: '14px 14px', borderRadius: 6 }}/>
      </div>
      <div style={{ background: T.c.n50, padding: '10px 12px', borderRadius: T.r.md, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Icon name="content_copy" size={16} color={T.c.p700}/>
        <div style={{ flex: 1, fontFamily: T.mono, fontSize: 11, color: T.c.n800, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>00020126...laci.app/p/abc123def</div>
        <span style={{ ...T.t.caption, color: T.c.p700, fontWeight: 700, fontSize: 11 }}>Copiar</span>
      </div>
      <div style={{ background: T.c.w100, border: `1px solid ${T.c.w700}`, borderRadius: T.r.md, padding: '12px 14px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 12, height: 12, borderRadius: '50%', background: T.c.w700, animation: 'tcBreath 1.4s ease-in-out infinite' }}/>
        <div style={{ flex: 1 }}>
          <div style={{ ...T.t.bodyB, color: T.c.w700, fontSize: 13 }}>Aguardando seu pagamento…</div>
          <div style={{ ...T.t.caption, color: T.c.n800, fontSize: 11.5 }}>Expira em <strong style={{ fontFamily: T.mono }}>29:45</strong></div>
        </div>
      </div>
      <div style={{ background: T.c.i100, padding: '10px 12px', borderRadius: T.r.md, marginBottom: 12, display: 'flex', gap: 8 }}>
        <Icon name="info" size={14} color={T.c.i700} style={{ flexShrink: 0, marginTop: 1 }}/>
        <div style={{ ...T.t.caption, color: T.c.n800, lineHeight: 1.4, fontSize: 12 }}>Pode fechar essa tela — a gente te avisa por push quando o PIX cair.</div>
      </div>
      <Button variant="secondary" size="md" fullWidth onClick={onAlreadyPaid}>Já paguei, fechar</Button>
      <div style={{ height: 6 }}/>
      <Button variant="ghost" size="sm" fullWidth onClick={onClose}>Cancelar pagamento</Button>
    </Sheet>
  );
}

// ─── PagarForaSheet ──────────────────────────────────────────
function PagarForaSheet({ admin = 'Carla', adminPix = 'carla.mendes@gmail.com', price = 80, onClose, onConfirm }) {
  return (
    <Sheet onClose={onClose}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: T.c.n100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="handshake" size={18} color={T.c.n800}/>
        </div>
        <div style={{ ...T.t.overline, color: T.c.n800, fontWeight: 700, fontSize: 11 }}>COMBINAR COM O ADMIN</div>
      </div>
      <div style={{ ...T.t.h2, color: T.c.n950, fontFamily: '"Fraunces", Georgia, serif', marginBottom: 12 }}>Como pagar</div>
      <div style={{ background: T.c.n50, borderRadius: T.r.md, padding: 14, marginBottom: 14 }}>
        <div style={{ ...T.t.overline, color: T.c.n600, marginBottom: 8, fontSize: 11 }}>INSTRUÇÕES DA {admin.toUpperCase()} (ADMIN)</div>
        <div style={{ ...T.t.body, color: T.c.n800, lineHeight: 1.55, fontSize: 13.5 }}>
          "PIX pra <strong style={{ fontFamily: T.mono }}>{adminPix}</strong> com seu nome no recibo — ou paga em dinheiro no local. R$ {price.toFixed(2)}."
        </div>
      </div>
      <div style={{ background: T.c.i100, padding: '10px 12px', borderRadius: T.r.md, marginBottom: 14, display: 'flex', gap: 8 }}>
        <Icon name="info" size={14} color={T.c.i700} style={{ flexShrink: 0, marginTop: 1 }}/>
        <div style={{ ...T.t.caption, color: T.c.n800, lineHeight: 1.45, fontSize: 12 }}>
          Sua vaga é <strong>provisória</strong> até o admin marcar como pago. Você tem até <strong>24h antes</strong> do evento.
        </div>
      </div>
      <div style={{ background: T.c.w100, padding: '10px 12px', borderRadius: T.r.md, marginBottom: 14, display: 'flex', gap: 8 }}>
        <Icon name="notifications_active" size={14} color={T.c.w700} style={{ flexShrink: 0, marginTop: 1 }}/>
        <div style={{ ...T.t.caption, color: T.c.n800, lineHeight: 1.45, fontSize: 12 }}>Te avisamos quando {admin} marcar seu pagamento.</div>
      </div>
      <Button variant="primary" size="md" fullWidth onClick={onConfirm}>Combinado, fechar</Button>
      <div style={{ height: 6 }}/>
      <Button variant="ghost" size="sm" fullWidth onClick={onClose}>Voltar (usar LACI)</Button>
    </Sheet>
  );
}

// ─── CancelarSheet (3 variações em uma — escolhe pela janela) ─
function CancelarSheet({ janela = 'A', price = 80, onClose, onConfirm }) {
  const cfg = {
    A: {
      tagBg: T.c.s100, tagFg: T.c.s700, tag: 'JANELA · > 24h ANTES',
      iconBg: T.c.s100, iconFg: T.c.s700, icon: 'undo',
      title: 'Cancelar sua presença?',
      body: `Você vai receber R$ ${price.toFixed(2)} de volta (no mesmo método). Sua vaga libera pra lista de espera.`,
      bullets: ['✓ Reembolso integral', '✓ Vaga vai pra lista de espera'],
      cta: 'Sim, cancelar', ctaTone: T.c.p700,
    },
    B: {
      tagBg: T.c.w100, tagFg: T.c.w700, tag: 'JANELA · 24h-2h ANTES',
      iconBg: T.c.w100, iconFg: T.c.w700, icon: 'redeem',
      title: 'Cancelamento tardio',
      body: `O admin já se planejou pro número confirmado. O valor (R$ ${price.toFixed(2)}) NÃO volta em dinheiro — vira ${Math.round(price * 10)} pontos Tchin pra usar no marketplace.`,
      bullets: ['⚠️ Sem reembolso em dinheiro', `✓ ${Math.round(price * 10)} pts Tchin de crédito`, '✓ Vaga libera se houver tempo'],
      cta: 'Aceitar e cancelar', ctaTone: T.c.w700,
    },
    C: {
      tagBg: T.c.e100, tagFg: T.c.e700, tag: 'JANELA · < 2h / EM ANDAMENTO',
      iconBg: T.c.e100, iconFg: T.c.e700, icon: 'block',
      title: 'Não dá mais pra cancelar',
      body: 'Faltam menos de 2h e o admin já se preparou. Sem reembolso nem crédito. Se não conseguir ir, avise o admin pelo chat — fica registrado como falta.',
      bullets: ['❌ Sem reembolso', '❌ Sem crédito', '· Conta como falta no histórico'],
      cta: 'Avisar o admin', ctaTone: T.c.n800,
    },
  }[janela] || {};
  return (
    <Sheet onClose={onClose}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', background: cfg.tagBg, color: cfg.tagFg, borderRadius: T.r.full, fontFamily: T.mono, fontSize: 10, fontWeight: 700, letterSpacing: 0.4, marginBottom: 12 }}>
        {cfg.tag}
      </div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: cfg.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon name={cfg.icon} size={18} color={cfg.iconFg} fill={1}/>
        </div>
        <div style={{ flex: 1, ...T.t.h3, color: T.c.n950, fontSize: 17, fontFamily: '"Fraunces", Georgia, serif' }}>{cfg.title}</div>
      </div>
      <div style={{ ...T.t.body, color: T.c.n800, lineHeight: 1.5, fontSize: 13.5, marginBottom: 12 }}>{cfg.body}</div>
      <ul style={{ margin: 0, padding: 0, listStyle: 'none', marginBottom: 14 }}>
        {(cfg.bullets || []).map((b, k) => (
          <li key={k} style={{ ...T.t.caption, color: T.c.n800, padding: '3px 0', fontSize: 12.5 }}>{b}</li>
        ))}
      </ul>
      <Button variant="primary" size="md" fullWidth onClick={onConfirm} style={{ background: cfg.ctaTone }}>{cfg.cta}</Button>
      <div style={{ height: 6 }}/>
      <Button variant="ghost" size="sm" fullWidth onClick={onClose}>Voltar</Button>
    </Sheet>
  );
}

Object.assign(window, {
  PaymentBanner, ConfirmadoBanner,
  ParticiparSheet, EscolherMetodoSheet, PixLaciSheet, PagarForaSheet, CancelarSheet,
});

export {
  CancelarSheet, ConfirmadoBanner, EscolherMetodoSheet, PagarForaSheet,
  ParticiparSheet, PaymentBanner, PixLaciSheet,
};
