/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { Button } from './components.jsx';
import { BottlePlaceholder, Icon, T } from './tokens.jsx';

// ─────────────────────────────────────────────────────────────
// Tchin Tchin — Marketplace Checkout (4 telas)
//
//   33.01 carrinho          → itens, sub-total, frete estimado, cupom
//   33.02 endereco          → endereços salvos + adicionar novo
//   33.03 pagamento         → cartão, Pix, boleto, parcelamento
//   33.04 pedido-confirmado → confirmação + tracking
//
//   Acessadas via MarketplaceScreen (botão Comprar) → WineDetailScreen
// ─────────────────────────────────────────────────────────────

function CkShell({ title, step, total, onBack, children, sticky }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n50, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '8px 8px', background: T.c.n0, borderBottom: `1px solid ${T.c.n200}`, flexShrink: 0 }}>
        <button onClick={onBack} style={{ width: 44, height: 44, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="arrow_back" size={24} color={T.c.n950}/>
        </button>
        <div style={{ ...T.t.h3, color: T.c.n950, flex: 1 }}>{title}</div>
        {step && total && (
          <div style={{ ...T.t.caption, color: T.c.n600, fontFamily: T.mono, padding: '4px 10px', background: T.c.n100, borderRadius: T.r.full, marginRight: 12 }}>{step}/{total}</div>
        )}
      </div>
      {/* Step indicator */}
      {step && total && (
        <div style={{ display: 'flex', gap: 4, padding: '8px 16px', background: T.c.n0, borderBottom: `1px solid ${T.c.n200}` }}>
          {[...Array(total)].map((_, i) => (
            <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i < step ? T.c.p700 : T.c.n200 }}/>
          ))}
        </div>
      )}
      <div style={{ flex: 1, overflow: 'auto' }}>{children}</div>
      {sticky}
    </div>
  );
}

const MOCK_CART = [
  { id: 'w1', name: 'Catena Malbec Reserva 2021', producer: 'Casa Catena',    price: 189, qty: 2, stock: 8 },
  { id: 'w2', name: 'Quinta do Crasto Douro 2019', producer: 'Quinta do Crasto', price: 156, qty: 1, stock: 4 },
];

// 33.01 ─────────────────────────────────────────────────
function CarrinhoScreen({ go }) {
  const [items, setItems] = React.useState(MOCK_CART);
  const [coupon, setCoupon] = React.useState('');
  const [couponApplied, setCouponApplied] = React.useState(false);
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const freteEstimado = subtotal > 300 ? 0 : 24.90;
  const total = subtotal - discount + freteEstimado;

  const setQty = (id, delta) => setItems(is => is.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i).filter(i => i.qty > 0));
  const empty = items.length === 0;

  if (empty) {
    return (
      <CkShell title="Carrinho" onBack={() => go('back')}>
        <div style={{ padding: '60px 24px', textAlign: 'center' }}>
          <Icon name="shopping_cart" size={64} color={T.c.n400}/>
          <div style={{ ...T.t.h2, color: T.c.n950, marginTop: 16 }}>Seu carrinho está vazio</div>
          <div style={{ ...T.t.body, color: T.c.n600, marginTop: 8, marginBottom: 24 }}>Volta pro Descobrir pra achar vinhos pelo seu paladar.</div>
          <Button variant="primary" size="lg" onClick={() => go('descobrir')}>Explorar vinhos</Button>
        </div>
      </CkShell>
    );
  }

  return (
    <CkShell title="Carrinho" step={1} total={3} onBack={() => go('back')}
      sticky={
        <div style={{ padding: 16, background: T.c.n0, borderTop: `1px solid ${T.c.n200}`, boxShadow: '0 -4px 16px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ ...T.t.body, color: T.c.n600 }}>Total</span>
            <span style={{ ...T.t.h2, color: T.c.n950, fontFamily: T.font }}>R$ {total.toFixed(2).replace('.', ',')}</span>
          </div>
          <Button variant="primary" size="lg" fullWidth trailing={<Icon name="arrow_forward" size={20}/>} onClick={() => go('endereco', { items, subtotal, discount, frete: freteEstimado, total })}>
            Continuar pra entrega
          </Button>
        </div>
      }>
      {/* Items */}
      <div style={{ background: T.c.n0, padding: '8px 0' }}>
        {items.map((it, i) => (
          <div key={it.id} style={{ display: 'flex', gap: 12, padding: '12px 16px', borderBottom: i === items.length - 1 ? 'none' : `1px solid ${T.c.n100}` }}>
            <BottlePlaceholder width={56} height={80} label=""/>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ ...T.t.bodyB, color: T.c.n950, marginBottom: 2 }}>{it.name}</div>
              <div style={{ ...T.t.caption, color: T.c.n600, marginBottom: 8 }}>{it.producer}</div>
              <div style={{ ...T.t.bodyB, color: T.c.n950, fontFamily: T.font, marginBottom: 8 }}>R$ {it.price.toFixed(2).replace('.', ',')}</div>
              {/* Stepper */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 0, background: T.c.n100, borderRadius: T.r.full, padding: 2, width: 'fit-content' }}>
                <button onClick={() => setQty(it.id, -1)} style={{
                  width: 32, height: 32, borderRadius: '50%', background: T.c.n0, border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: T.el[1],
                }}><Icon name="remove" size={18} color={T.c.n800}/></button>
                <div style={{ minWidth: 36, textAlign: 'center', ...T.t.bodyB, color: T.c.n950, fontFamily: T.mono }}>{it.qty}</div>
                <button onClick={() => setQty(it.id, +1)} disabled={it.qty >= it.stock} style={{
                  width: 32, height: 32, borderRadius: '50%', background: T.c.n0, border: 'none', cursor: it.qty >= it.stock ? 'default' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: T.el[1], opacity: it.qty >= it.stock ? 0.4 : 1,
                }}><Icon name="add" size={18} color={T.c.n800}/></button>
              </div>
              {it.qty >= it.stock - 1 && it.stock > 0 && <div style={{ ...T.t.caption, color: T.c.w700, marginTop: 6, fontWeight: 600 }}>Restam só {it.stock} no estoque.</div>}
            </div>
            <button onClick={() => setItems(is => is.filter(x => x.id !== it.id))} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, alignSelf: 'flex-start' }}>
              <Icon name="delete_outline" size={20} color={T.c.n600}/>
            </button>
          </div>
        ))}
      </div>

      {/* Frete */}
      <div style={{ margin: '12px 16px', padding: 14, background: T.c.s100, borderRadius: T.r.md, display: 'flex', gap: 10, alignItems: 'center' }}>
        <Icon name="local_shipping" size={20} color={T.c.s700}/>
        <div style={{ ...T.t.body, color: T.c.n800, flex: 1, lineHeight: 1.4 }}>
          {freteEstimado === 0
            ? <span><strong>Frete grátis</strong> pra esse pedido (acima de R$ 300).</span>
            : <span>Faltam <strong>R$ {(300 - subtotal).toFixed(2).replace('.', ',')}</strong> pra ganhar frete grátis.</span>
          }
        </div>
      </div>

      {/* Cupom */}
      <div style={{ background: T.c.n0, padding: 16, marginBottom: 12 }}>
        <div style={{ ...T.t.label, color: T.c.n800, marginBottom: 8 }}>Cupom de desconto</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input value={coupon} onChange={e => setCoupon(e.target.value.toUpperCase())} placeholder="Ex.: BRINDE10" style={{
            flex: 1, padding: '12px 14px', border: `1.5px solid ${T.c.n300}`, borderRadius: T.r.md,
            fontFamily: T.mono, fontSize: 14, color: T.c.n950, outline: 'none', background: T.c.n0,
          }}/>
          <Button variant="secondary" size="md" disabled={!coupon || couponApplied} onClick={() => { if (coupon === 'BRINDE10') { setCouponApplied(true); go('toast', { kind: 'success', message: '10% de desconto aplicado!' }); } else { go('toast', { kind: 'error', message: 'Cupom inválido.' }); }}}>
            Aplicar
          </Button>
        </div>
        {couponApplied && (
          <div style={{ marginTop: 10, padding: 10, background: T.c.s100, borderRadius: T.r.sm, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="check_circle" size={18} color={T.c.s700}/>
            <span style={{ ...T.t.caption, color: T.c.s700, flex: 1, fontWeight: 600 }}>BRINDE10 · 10% off no subtotal</span>
            <button onClick={() => { setCouponApplied(false); setCoupon(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
              <Icon name="close" size={16} color={T.c.s700}/>
            </button>
          </div>
        )}
      </div>

      {/* Sumário */}
      <div style={{ background: T.c.n0, padding: '12px 16px 24px' }}>
        <SumRow label="Subtotal"      value={`R$ ${subtotal.toFixed(2).replace('.', ',')}`}/>
        {discount > 0 && <SumRow label="Desconto (10%)" value={`− R$ ${discount.toFixed(2).replace('.', ',')}`} positive/>}
        <SumRow label="Frete estimado" value={freteEstimado === 0 ? 'Grátis' : `R$ ${freteEstimado.toFixed(2).replace('.', ',')}`}/>
        <div style={{ height: 1, background: T.c.n200, margin: '12px 0' }}/>
        <SumRow label="Total" value={`R$ ${total.toFixed(2).replace('.', ',')}`} big/>
      </div>
    </CkShell>
  );
}

function SumRow({ label, value, big, positive }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '4px 0' }}>
      <span style={{ ...T.t[big ? 'h3' : 'body'], color: big ? T.c.n950 : T.c.n600 }}>{label}</span>
      <span style={{ ...T.t[big ? 'h3' : 'bodyB'], color: positive ? T.c.s700 : T.c.n950, fontFamily: T.font }}>{value}</span>
    </div>
  );
}

// 33.02 ─────────────────────────────────────────────────
function EnderecoScreen({ go, params }) {
  const enderecos = [
    { id: 'a1', label: 'Casa',      rua: 'SQS 408 Bloco B Apto 304', cidade: 'Brasília — DF', cep: '70.257-020', main: true },
    { id: 'a2', label: 'Trabalho',  rua: 'CLN 412 Bloco A Sala 201', cidade: 'Brasília — DF', cep: '70.867-510', main: false },
  ];
  const [selected, setSelected] = React.useState('a1');
  const [showNew, setShowNew] = React.useState(false);
  return (
    <CkShell title="Entrega" step={2} total={3} onBack={() => go('back')}
      sticky={
        <div style={{ padding: 16, background: T.c.n0, borderTop: `1px solid ${T.c.n200}`, boxShadow: '0 -4px 16px rgba(0,0,0,0.06)' }}>
          <Button variant="primary" size="lg" fullWidth trailing={<Icon name="arrow_forward" size={20}/>} disabled={!selected} onClick={() => go('pagamento', { ...params, endereco: enderecos.find(a => a.id === selected) })}>
            Ir pro pagamento
          </Button>
        </div>
      }>
      {/* Estimativa */}
      <div style={{ padding: '14px 16px', background: T.c.n0, borderBottom: `8px solid ${T.c.n50}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Icon name="schedule" size={20} color={T.c.s700}/>
          <div style={{ ...T.t.body, color: T.c.n800, flex: 1, lineHeight: 1.45 }}>
            <strong style={{ color: T.c.n950 }}>Chega em 3-5 dias úteis</strong> via Casa Valduga, com seguro de transporte.
          </div>
        </div>
      </div>

      <div style={{ ...T.t.overline, color: T.c.n600, padding: '16px 20px 6px' }}>── ESCOLHA UM ENDEREÇO ──</div>
      <div style={{ background: T.c.n0 }}>
        {enderecos.map((e, i) => (
          <button key={e.id} onClick={() => setSelected(e.id)} style={{
            width: '100%', display: 'flex', alignItems: 'flex-start', gap: 12, padding: 16,
            background: selected === e.id ? T.c.p50 : 'none',
            border: 'none', borderBottom: i === enderecos.length - 1 ? 'none' : `1px solid ${T.c.n100}`,
            cursor: 'pointer', textAlign: 'left',
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: '50%', flexShrink: 0, marginTop: 2,
              border: `2px solid ${selected === e.id ? T.c.p700 : T.c.n400}`,
              background: selected === e.id ? T.c.p700 : T.c.n0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{selected === e.id && <div style={{ width: 10, height: 10, borderRadius: '50%', background: T.c.n0 }}/>}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <span style={{ ...T.t.bodyB, color: T.c.n950 }}>{e.label}</span>
                {e.main && <span style={{ ...T.t.caption, padding: '2px 6px', borderRadius: T.r.xs, background: T.c.p100, color: T.c.p700, fontWeight: 600 }}>Principal</span>}
              </div>
              <div style={{ ...T.t.body, color: T.c.n800, lineHeight: 1.4 }}>{e.rua}</div>
              <div style={{ ...T.t.caption, color: T.c.n600, marginTop: 2 }}>{e.cidade} · CEP {e.cep}</div>
            </div>
            <button onClick={ev => { ev.stopPropagation(); go('toast', { kind: 'info', message: 'Em breve: editar endereço.' }); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
              <Icon name="edit" size={18} color={T.c.n600}/>
            </button>
          </button>
        ))}
      </div>

      <div style={{ padding: 16 }}>
        <Button variant="secondary" size="md" fullWidth leading={<Icon name="add" size={18}/>} onClick={() => setShowNew(true)}>
          Adicionar novo endereço
        </Button>
      </div>

      {/* Aviso CPF */}
      <div style={{ margin: '8px 16px 32px', padding: 14, background: T.c.w100, borderRadius: T.r.md, display: 'flex', gap: 10 }}>
        <Icon name="info" size={20} color={T.c.w700}/>
        <div style={{ ...T.t.caption, color: T.c.n800, lineHeight: 1.5 }}>
          <strong>Recebedor maior de 18:</strong> a transportadora confere idade e documento na entrega de bebida alcoólica.
        </div>
      </div>

      {showNew && (
        <div onClick={() => setShowNew(false)} style={{
          position: 'absolute', inset: 0, background: 'rgba(15,15,15,0.55)', zIndex: 60,
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center', animation: 'tcFadeIn 180ms',
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: T.c.n0, borderTopLeftRadius: T.r.xl, borderTopRightRadius: T.r.xl,
            padding: 24, width: '100%', animation: 'tcSlideUp 220ms',
          }}>
            <div style={{ width: 36, height: 4, background: T.c.n300, borderRadius: 2, margin: '-8px auto 16px' }}/>
            <div style={{ ...T.t.h3, color: T.c.n950, marginBottom: 16 }}>Novo endereço</div>
            <input placeholder="CEP" style={ckInput}/>
            <input placeholder="Logradouro" style={ckInput}/>
            <div style={{ display: 'flex', gap: 8 }}>
              <input placeholder="Número" style={{ ...ckInput, flex: 1 }}/>
              <input placeholder="Complemento" style={{ ...ckInput, flex: 2 }}/>
            </div>
            <div style={{ height: 8 }}/>
            <Button variant="primary" size="lg" fullWidth onClick={() => { setShowNew(false); go('toast', { kind: 'success', message: 'Endereço salvo.' }); }}>
              Salvar endereço
            </Button>
            <div style={{ height: 10 }}/>
            <Button variant="ghost" size="lg" fullWidth onClick={() => setShowNew(false)}>Cancelar</Button>
          </div>
        </div>
      )}
    </CkShell>
  );
}

const ckInput = {
  width: '100%', padding: '12px 14px', border: `1.5px solid ${T.c.n300}`,
  borderRadius: T.r.md, fontFamily: T.font, fontSize: 15, color: T.c.n950,
  outline: 'none', boxSizing: 'border-box', background: T.c.n0, marginBottom: 10,
};

// 33.03 ─────────────────────────────────────────────────
function PagamentoScreen({ go, params }) {
  const total = (params && params.total) || 559.80;
  const [method, setMethod] = React.useState('cartao');
  const [card, setCard] = React.useState({ num: '', name: '', exp: '', cvv: '' });
  const [parcelas, setParcelas] = React.useState(1);
  const valid = method === 'pix' || method === 'boleto' || (card.num.length >= 12 && card.name && card.exp && card.cvv);
  return (
    <CkShell title="Pagamento" step={3} total={3} onBack={() => go('back')}
      sticky={
        <div style={{ padding: 16, background: T.c.n0, borderTop: `1px solid ${T.c.n200}`, boxShadow: '0 -4px 16px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ ...T.t.body, color: T.c.n600 }}>Você paga</span>
            <span style={{ ...T.t.h2, color: T.c.n950, fontFamily: T.font }}>R$ {total.toFixed(2).replace('.', ',')}</span>
          </div>
          <Button variant="primary" size="lg" fullWidth disabled={!valid} leading={<Icon name="lock" size={18}/>} onClick={() => go('pedido-confirmado', { ...params, method })}>
            Confirmar pagamento
          </Button>
        </div>
      }>
      <div style={{ background: T.c.n0, padding: '12px 16px 16px' }}>
        <div style={{ ...T.t.overline, color: T.c.n600, marginBottom: 10 }}>FORMA DE PAGAMENTO</div>
        {[
          { id: 'cartao', icon: 'credit_card', label: 'Cartão de crédito', sub: 'Visa, Master, Elo · até 6x sem juros' },
          { id: 'pix',    icon: 'qr_code_2',   label: 'Pix',                sub: '5% off · aprovação em 30s' },
          { id: 'boleto', icon: 'receipt_long', label: 'Boleto bancário',   sub: 'Aprovação em 1-2 dias úteis' },
        ].map(m => (
          <button key={m.id} onClick={() => setMethod(m.id)} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: 14,
            background: method === m.id ? T.c.p50 : T.c.n0,
            border: `1.5px solid ${method === m.id ? T.c.p700 : T.c.n200}`,
            borderRadius: T.r.md, cursor: 'pointer', textAlign: 'left', marginBottom: 8,
          }}>
            <Icon name={m.icon} size={24} color={method === m.id ? T.c.p700 : T.c.n800}/>
            <div style={{ flex: 1 }}>
              <div style={{ ...T.t.bodyB, color: T.c.n950 }}>{m.label}</div>
              <div style={{ ...T.t.caption, color: T.c.n600, marginTop: 2 }}>{m.sub}</div>
            </div>
            <Icon name={method === m.id ? 'check_circle' : 'radio_button_unchecked'} size={20} color={method === m.id ? T.c.p700 : T.c.n400} fill={method === m.id ? 1 : 0}/>
          </button>
        ))}
      </div>

      {method === 'cartao' && (
        <div style={{ background: T.c.n0, padding: 16, marginTop: 8 }}>
          {/* Card mock */}
          <div style={{
            background: `linear-gradient(135deg, ${T.c.p700} 0%, ${T.c.p900} 100%)`,
            color: T.c.n0, borderRadius: T.r.lg, padding: 20, marginBottom: 16,
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', inset: 0, opacity: 0.15, backgroundImage: `repeating-linear-gradient(135deg, rgba(255,255,255,0.4) 0 1px, transparent 1px 14px)` }}/>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
              <Icon name="credit_card" size={28} color="rgba(255,255,255,0.85)"/>
              <div style={{ fontFamily: T.mono, fontSize: 12, opacity: 0.7 }}>visa</div>
            </div>
            <div style={{ ...T.t.body, color: 'rgba(255,255,255,0.7)', marginTop: 16, position: 'relative' }}>{card.num || '•••• •••• •••• ••••'}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, position: 'relative' }}>
              <div style={{ fontFamily: T.mono, fontSize: 13, textTransform: 'uppercase', opacity: 0.85 }}>{card.name || 'NOME NO CARTÃO'}</div>
              <div style={{ fontFamily: T.mono, fontSize: 13, opacity: 0.85 }}>{card.exp || 'MM/AA'}</div>
            </div>
          </div>

          <div style={{ ...T.t.label, color: T.c.n800, marginBottom: 6 }}>Número do cartão</div>
          <input inputMode="numeric" value={card.num} onChange={e => setCard(c => ({ ...c, num: e.target.value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').slice(0, 19) }))} placeholder="0000 0000 0000 0000" style={ckInput}/>

          <div style={{ ...T.t.label, color: T.c.n800, marginBottom: 6 }}>Nome impresso</div>
          <input value={card.name} onChange={e => setCard(c => ({ ...c, name: e.target.value.toUpperCase() }))} placeholder="MARIA SILVA" style={ckInput}/>

          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: 1 }}>
              <div style={{ ...T.t.label, color: T.c.n800, marginBottom: 6 }}>Validade</div>
              <input inputMode="numeric" value={card.exp} onChange={e => setCard(c => ({ ...c, exp: e.target.value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').slice(0, 5) }))} placeholder="MM/AA" style={ckInput}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ ...T.t.label, color: T.c.n800, marginBottom: 6 }}>CVV</div>
              <input inputMode="numeric" value={card.cvv} onChange={e => setCard(c => ({ ...c, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))} placeholder="000" style={ckInput}/>
            </div>
          </div>

          <div style={{ ...T.t.label, color: T.c.n800, marginBottom: 6, marginTop: 6 }}>Parcelas</div>
          <select value={parcelas} onChange={e => setParcelas(+e.target.value)} style={{ ...ckInput, paddingRight: 32 }}>
            {[1,2,3,4,5,6].map(p => {
              const v = total / p;
              return <option key={p} value={p}>{p}x de R$ {v.toFixed(2).replace('.', ',')} {p <= 6 ? 'sem juros' : ''}</option>;
            })}
          </select>
        </div>
      )}

      {method === 'pix' && (
        <div style={{ background: T.c.n0, padding: 20, marginTop: 8, textAlign: 'center' }}>
          <div style={{ width: 180, height: 180, margin: '0 auto 16px', background: T.c.n50, borderRadius: T.r.md, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            {/* QR mock */}
            <div style={{ width: 140, height: 140, background: `repeating-linear-gradient(0deg, ${T.c.n950} 0 6px, transparent 6px 12px), repeating-linear-gradient(90deg, ${T.c.n950} 0 6px, transparent 6px 12px)`, opacity: 0.85 }}/>
            <div style={{ position: 'absolute', width: 32, height: 32, background: T.c.n0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4 }}>
              <Icon name="qr_code_2" size={24} color={T.c.p700}/>
            </div>
          </div>
          <div style={{ ...T.t.h3, color: T.c.n950, marginBottom: 4 }}>Escaneie pra pagar</div>
          <div style={{ ...T.t.body, color: T.c.n600, marginBottom: 16 }}>O QR expira em 15 minutos.</div>
          <Button variant="secondary" size="md" fullWidth leading={<Icon name="content_copy" size={18}/>} onClick={() => go('toast', { kind: 'success', message: 'Código Pix copiado.' })}>Copiar código Pix</Button>
          <div style={{ marginTop: 12, padding: 12, background: T.c.s100, borderRadius: T.r.md, display: 'flex', gap: 8, textAlign: 'left' }}>
            <Icon name="check_circle" size={18} color={T.c.s700}/>
            <div style={{ ...T.t.caption, color: T.c.s700, fontWeight: 600 }}>5% off · você economiza R$ {(total * 0.05).toFixed(2).replace('.', ',')}</div>
          </div>
        </div>
      )}

      {method === 'boleto' && (
        <div style={{ background: T.c.n0, padding: 16, marginTop: 8 }}>
          <div style={{ padding: 14, background: T.c.w100, borderRadius: T.r.md, marginBottom: 16, display: 'flex', gap: 10 }}>
            <Icon name="info" size={20} color={T.c.w700}/>
            <div style={{ ...T.t.caption, color: T.c.n800, lineHeight: 1.5 }}>
              O pedido só é enviado depois que o boleto for compensado (1-2 dias úteis).
            </div>
          </div>
          <input placeholder="CPF do pagador" style={ckInput}/>
          <input placeholder="Nome completo" style={ckInput}/>
        </div>
      )}

      <div style={{ padding: '12px 16px 24px', display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
        <Icon name="lock" size={16} color={T.c.s700}/>
        <span style={{ ...T.t.caption, color: T.c.s700, fontWeight: 600 }}>Pagamento criptografado · não guardamos seus dados</span>
      </div>
    </CkShell>
  );
}

// 33.04 ─────────────────────────────────────────────────
function PedidoConfirmadoScreen({ go, params }) {
  const total = (params && params.total) || 559.80;
  const items = (params && params.items) || MOCK_CART;
  const orderId = '#TC' + Math.floor(Math.random() * 900000 + 100000);
  const method = (params && params.method) || 'cartao';
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n0, overflow: 'auto' }}>
      {/* Hero success */}
      <div style={{
        background: `linear-gradient(180deg, ${T.c.s100} 0%, ${T.c.n0} 100%)`,
        padding: '40px 24px 32px', textAlign: 'center',
      }}>
        <div style={{
          width: 96, height: 96, borderRadius: '50%', background: T.c.s700,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px', animation: 'tcDrawIn 320ms cubic-bezier(0.2, 0.8, 0.2, 1)',
          boxShadow: '0 8px 24px rgba(46, 125, 50, 0.25)',
        }}>
          <Icon name="check" size={52} color={T.c.n0}/>
        </div>
        <div style={{ ...T.t.h1, color: T.c.n950, marginBottom: 6, fontFamily: '"Fraunces", Georgia, serif' }}>Pedido confirmado!</div>
        <div style={{ ...T.t.bodyLg, color: T.c.n600, lineHeight: 1.5 }}>
          {method === 'pix' && 'Assim que compensar o Pix você recebe um aviso por push e e-mail.'}
          {method === 'boleto' && 'Mandamos o boleto pro seu e-mail.'}
          {method === 'cartao' && 'Pagamento aprovado. Comerciante já foi notificado.'}
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 16,
          padding: '6px 12px', background: T.c.n0, borderRadius: T.r.full,
          border: `1px solid ${T.c.n200}`, ...T.t.caption, color: T.c.n800, fontFamily: T.mono, fontWeight: 700,
        }}>Pedido {orderId}</div>
      </div>

      {/* Steps */}
      <div style={{ padding: '20px 16px', background: T.c.n50 }}>
        <div style={{ ...T.t.h3, color: T.c.n950, marginBottom: 14 }}>Próximos passos</div>
        {[
          { icon: 'inventory_2',     label: 'Preparando seu pedido',     when: 'Hoje · até 18h', active: true },
          { icon: 'local_shipping',  label: 'Saiu pra entrega',          when: 'Amanhã',          active: false },
          { icon: 'home',            label: 'Chega em casa',             when: '3-5 dias úteis',  active: false },
        ].map((s, i, arr) => (
          <div key={s.label} style={{ display: 'flex', gap: 12, position: 'relative' }}>
            {i < arr.length - 1 && <div style={{ position: 'absolute', left: 21, top: 44, bottom: -8, width: 2, background: T.c.n200 }}/>}
            <div style={{
              width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
              background: s.active ? T.c.p700 : T.c.n200,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 1,
            }}>
              <Icon name={s.icon} size={22} color={s.active ? T.c.n0 : T.c.n600}/>
            </div>
            <div style={{ flex: 1, padding: '10px 0' }}>
              <div style={{ ...T.t.bodyB, color: s.active ? T.c.n950 : T.c.n800 }}>{s.label}</div>
              <div style={{ ...T.t.caption, color: T.c.n600, marginTop: 2 }}>{s.when}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Items */}
      <div style={{ padding: '20px 16px', background: T.c.n0 }}>
        <div style={{ ...T.t.h3, color: T.c.n950, marginBottom: 12 }}>O que vai vir</div>
        {items.map((it, i) => (
          <div key={it.id} style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: i === items.length - 1 ? 'none' : `1px solid ${T.c.n100}` }}>
            <BottlePlaceholder width={36} height={50} label="" showLabel={false}/>
            <div style={{ flex: 1 }}>
              <div style={{ ...T.t.body, color: T.c.n950, fontWeight: 500 }}>{it.name}</div>
              <div style={{ ...T.t.caption, color: T.c.n600 }}>{it.qty} {it.qty === 1 ? 'garrafa' : 'garrafas'} · R$ {(it.price * it.qty).toFixed(2).replace('.', ',')}</div>
            </div>
          </div>
        ))}
        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ ...T.t.body, color: T.c.n600 }}>Total pago</span>
          <span style={{ ...T.t.h3, color: T.c.n950, fontFamily: T.font }}>R$ {total.toFixed(2).replace('.', ',')}</span>
        </div>
      </div>

      {/* CTAs */}
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Button variant="primary" size="lg" fullWidth leading={<Icon name="local_shipping" size={20}/>} onClick={() => go('toast', { kind: 'info', message: 'Em breve: rastreamento.' })}>
          Acompanhar entrega
        </Button>
        <Button variant="secondary" size="lg" fullWidth leading={<Icon name="share" size={20}/>} onClick={() => go('toast', { kind: 'success', message: 'Você ganhou 50 pontos por compartilhar!' })}>
          Compartilhar achado com a confraria
        </Button>
        <Button variant="ghost" size="lg" fullWidth onClick={() => go('descobrir')}>
          Voltar pra Descobrir
        </Button>
      </div>
      <div style={{ height: 24 }}/>
    </div>
  );
}

Object.assign(window, {
  CkShell, CarrinhoScreen, EnderecoScreen,
  PagamentoScreen, PedidoConfirmadoScreen, MOCK_CART,
});


export { CarrinhoScreen, CkShell, EnderecoScreen, MOCK_CART, PagamentoScreen, PedidoConfirmadoScreen, SumRow, ckInput };
