/* eslint-disable */
// @ts-nocheck
// Auto-converted from the Tchin Tchin design prototype. See scripts/convert-legacy.mjs
import React from 'react';
import { Button } from './components.jsx';
import { Avatar } from './f13_01_Avatar.jsx';
import { Icon, T } from './tokens.jsx';

// ─────────────────────────────────────────────────────────────
// Tchin Tchin — Editar Perfil (fluxo completo, 4 telas)
//
//   26.01 editar-perfil           → overview com seções
//   26.02 editar-perfil-foto      → trocar/recortar foto + bio
//   26.03 editar-perfil-paladar   → re-calibrar paladar (refazer quiz)
//   26.04 editar-perfil-privacidade → quem vê o quê
// ─────────────────────────────────────────────────────────────

function EpShell({ title, onBack, onSave, saveDisabled, children, rightAction }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.c.n50, overflow: 'hidden' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 4, padding: '8px 8px',
        background: T.c.n0, borderBottom: `1px solid ${T.c.n200}`, flexShrink: 0,
      }}>
        <button onClick={onBack} style={{
          width: 44, height: 44, background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}><Icon name="arrow_back" size={24} color={T.c.n950}/></button>
        <div style={{ ...T.t.h3, color: T.c.n950, flex: 1 }}>{title}</div>
        {onSave && (
          <button onClick={onSave} disabled={saveDisabled} style={{
            background: 'none', border: 'none', cursor: saveDisabled ? 'default' : 'pointer',
            color: saveDisabled ? T.c.n400 : T.c.p700,
            fontFamily: T.font, fontSize: 14, fontWeight: 600, padding: '8px 16px',
          }}>Salvar</button>
        )}
        {rightAction}
      </div>
      <div style={{ flex: 1, overflow: 'auto' }}>{children}</div>
    </div>
  );
}

function EpField({ label, value, hint, onClick, last }) {
  return (
    <button onClick={onClick} style={{
      width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
      background: T.c.n0, border: 'none', borderBottom: last ? 'none' : `1px solid ${T.c.n100}`,
      cursor: 'pointer', textAlign: 'left',
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ ...T.t.caption, color: T.c.n600, marginBottom: 2 }}>{label}</div>
        <div style={{ ...T.t.body, color: T.c.n950, fontWeight: 500 }}>{value || <span style={{ color: T.c.n400, fontStyle: 'italic' }}>Não preenchido</span>}</div>
        {hint && <div style={{ ...T.t.caption, color: T.c.n600, marginTop: 2 }}>{hint}</div>}
      </div>
      <Icon name="chevron_right" size={20} color={T.c.n400}/>
    </button>
  );
}

// 26.01 ─────────────────────────────────────────────────
function EditarPerfilScreen({ go, ctx, setCtx }) {
  const u = ctx.user;
  return (
    <EpShell title="Editar perfil" onBack={() => go('back')}>
      {/* Foto + nome */}
      <div style={{ background: T.c.n0, padding: '24px 16px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', borderBottom: `8px solid ${T.c.n50}` }}>
        <div style={{ position: 'relative', marginBottom: 12 }}>
          <Avatar name={u.name} size={96} level={u.level}/>
          <button onClick={() => go('editar-perfil-foto')} style={{
            position: 'absolute', bottom: -4, right: -4, width: 36, height: 36, borderRadius: '50%',
            background: T.c.p700, border: `3px solid ${T.c.n0}`, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><Icon name="photo_camera" size={18} color={T.c.n0}/></button>
        </div>
        <button onClick={() => go('editar-perfil-foto')} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: T.c.p700, fontFamily: T.font, fontSize: 13, fontWeight: 600, padding: '4px 8px',
        }}>Trocar foto</button>
      </div>

      <div style={{ ...T.t.overline, color: T.c.n600, padding: '12px 20px 6px' }}>── Identidade ──</div>
      <EpField label="Nome" value={u.name} onClick={() => go('editar-perfil-foto')}/>
      <EpField label="@usuário" value={`@${(u.name || 'usuario').toLowerCase().replace(/\s+/g, '')}`} onClick={() => go('editar-perfil-foto')}/>
      <EpField label="Bio" value={u.bio || ''} hint="Conta um pouco sobre você (até 160 caracteres)" onClick={() => go('editar-perfil-foto')} last/>

      <div style={{ ...T.t.overline, color: T.c.n600, padding: '12px 20px 6px' }}>── Localização ──</div>
      <EpField label="Cidade" value={u.city || 'Não informada'} onClick={() => go('toast', { kind: 'info', message: 'Em breve: editar cidade.' })}/>
      <EpField label="Bairro / Região" value="Asa Sul" hint="Visível só pra membros das suas confrarias" onClick={() => {}} last/>

      <div style={{ ...T.t.overline, color: T.c.n600, padding: '12px 20px 6px' }}>── Paladar e nível ──</div>
      <EpField label="Nível declarado" value={u.level === 'iniciante' ? 'Iniciante' : u.level === 'intermediario' ? 'Intermediário' : 'Expert'} hint="Auto-declarado no cadastro" onClick={() => {}}/>
      <EpField label="Paladar 5D" value={u.paladar ? 'Calibrado' : 'Não calibrado'} hint={u.paladar ? 'Última calibração: há 12 dias' : 'Refaça o quiz pra desbloquear matches'} onClick={() => go('editar-perfil-paladar')} last/>

      <div style={{ ...T.t.overline, color: T.c.n600, padding: '12px 20px 6px' }}>── Privacidade ──</div>
      <EpField label="Quem vê seu diário" value="Só você" onClick={() => go('editar-perfil-privacidade')}/>
      <EpField label="Quem vê suas confrarias" value="Confraria + amigos" onClick={() => go('editar-perfil-privacidade')}/>
      <EpField label="Mostrar paladar no perfil" value="Sim" onClick={() => go('editar-perfil-privacidade')} last/>

      <div style={{ padding: '24px 16px 32px' }}>
        <Button variant="ghost" size="md" fullWidth onClick={() => go('config-conta')}>Configurações de conta</Button>
      </div>
    </EpShell>
  );
}

// 26.02 ─────────────────────────────────────────────────
function EditarPerfilFotoScreen({ go, ctx, setCtx }) {
  const u = ctx.user;
  const [name, setName] = React.useState(u.name);
  const [handle, setHandle] = React.useState((u.name || 'usuario').toLowerCase().replace(/\s+/g, ''));
  const [bio, setBio] = React.useState(u.bio || '');
  const [photoHue, setPhotoHue] = React.useState(0);
  const dirty = name !== u.name || (u.bio || '') !== bio;
  return (
    <EpShell title="Foto, nome e bio" onBack={() => go('back')}
      onSave={() => { setCtx(c => ({ ...c, user: { ...c.user, name, bio } })); go('toast', { kind: 'success', message: 'Perfil atualizado.' }); go('back'); }}
      saveDisabled={!dirty}>
      {/* Photo editor */}
      <div style={{ background: T.c.n0, padding: '32px 16px 28px', display: 'flex', flexDirection: 'column', alignItems: 'center', borderBottom: `8px solid ${T.c.n50}` }}>
        <div style={{ position: 'relative', marginBottom: 16 }}>
          <div style={{
            width: 140, height: 140, borderRadius: '50%',
            background: `linear-gradient(135deg, hsl(${photoHue}, 35%, 75%), hsl(${photoHue + 60}, 45%, 55%))`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: `4px solid ${T.c.n0}`, boxShadow: T.el[3], position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ fontFamily: T.font, fontSize: 48, fontWeight: 700, color: T.c.n0 }}>
              {name.split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase()}
            </div>
            {/* Crop frame guide */}
            <div style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.6)',
            }}/>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary" size="md" leading={<Icon name="photo_camera" size={18}/>} onClick={() => setPhotoHue(h => (h + 60) % 360)}>Câmera</Button>
          <Button variant="secondary" size="md" leading={<Icon name="image" size={18}/>} onClick={() => setPhotoHue(h => (h + 120) % 360)}>Galeria</Button>
        </div>
        <div style={{ ...T.t.caption, color: T.c.n600, marginTop: 12, textAlign: 'center' }}>
          Arraste pra recortar · pinça pra dar zoom
        </div>
      </div>

      <div style={{ padding: '16px 16px 24px' }}>
        <div style={{ ...T.t.label, color: T.c.n800, marginBottom: 6 }}>Nome</div>
        <input value={name} onChange={e => setName(e.target.value)} style={epInput} maxLength={60}/>
        <div style={{ ...T.t.caption, color: T.c.n600, marginBottom: 16, marginTop: 4, textAlign: 'right' }}>{name.length}/60</div>

        <div style={{ ...T.t.label, color: T.c.n800, marginBottom: 6 }}>@usuário</div>
        <div style={{ display: 'flex', alignItems: 'center', border: `1.5px solid ${T.c.n300}`, borderRadius: T.r.md, background: T.c.n0, marginBottom: 16 }}>
          <span style={{ padding: '14px 8px 14px 16px', color: T.c.n600, fontSize: 16, fontFamily: T.font }}>@</span>
          <input value={handle} onChange={e => setHandle(e.target.value.replace(/[^a-z0-9_.]/gi, '').toLowerCase())} style={{ ...epInput, border: 'none', padding: '14px 16px 14px 0', marginBottom: 0 }}/>
        </div>

        <div style={{ ...T.t.label, color: T.c.n800, marginBottom: 6 }}>Bio</div>
        <textarea value={bio} onChange={e => setBio(e.target.value.slice(0, 160))} placeholder="Mineira em Brasília. Adora Malbec e churrasco no domingo." rows={3} style={{ ...epInput, resize: 'vertical', marginBottom: 4 }}/>
        <div style={{ ...T.t.caption, color: bio.length > 150 ? T.c.w700 : T.c.n600, textAlign: 'right' }}>{bio.length}/160</div>
      </div>
    </EpShell>
  );
}
const epInput = {
  width: '100%', padding: '14px 16px', border: `1.5px solid ${T.c.n300}`,
  borderRadius: T.r.md, fontFamily: T.font, fontSize: 16, color: T.c.n950,
  outline: 'none', boxSizing: 'border-box', marginBottom: 16, background: T.c.n0,
};

// 26.03 ─────────────────────────────────────────────────
function EditarPerfilPaladarScreen({ go }) {
  return (
    <EpShell title="Paladar" onBack={() => go('back')}>
      <div style={{ background: T.c.n0, padding: '24px 20px', borderBottom: `8px solid ${T.c.n50}` }}>
        <div style={{ ...T.t.h2, color: T.c.n950, marginBottom: 8 }}>Seu paladar 5D</div>
        <div style={{ ...T.t.body, color: T.c.n600, marginBottom: 16 }}>Calibrado há 12 dias com base em 8 vinhos.</div>
        {/* Mini radar placeholder */}
        <div style={{
          height: 200, borderRadius: T.r.md, background: T.c.n50,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backgroundImage: 'radial-gradient(circle at center, rgba(160,74,85,0.18) 0%, transparent 60%)',
        }}>
          <div style={{ ...T.t.caption, color: T.c.n600, fontFamily: T.mono }}>[ radar paladar ]</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 16 }}>
          {[['Acidez', 3], ['Tanino', 4], ['Corpo', 4], ['Frutado', 4], ['Doçura', 2]].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', background: T.c.n50, borderRadius: T.r.sm }}>
              <span style={{ ...T.t.caption, color: T.c.n800, flex: 1 }}>{k}</span>
              <span style={{ ...T.t.bodyB, color: T.c.p700, fontFamily: T.mono }}>{v}/5</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Button variant="primary" size="lg" fullWidth leading={<Icon name="refresh" size={20}/>} onClick={() => go('quiz')}>Refazer quiz paladar</Button>
        <Button variant="secondary" size="lg" fullWidth leading={<Icon name="science" size={20}/>} onClick={() => go('calibracao')}>Calibrar com 5 vinhos reais</Button>
        <div style={{ ...T.t.caption, color: T.c.n600, padding: '12px 8px 0', lineHeight: 1.5 }}>
          Refazer o quiz sobrescreve seu paladar atual. A calibração com vinhos reais é cumulativa e mais precisa.
        </div>
      </div>
    </EpShell>
  );
}

// 26.04 ─────────────────────────────────────────────────
function EditarPerfilPrivacidadeScreen({ go }) {
  const [diary, setDiary]   = React.useState('only-me');
  const [conf, setConf]     = React.useState('confraria-amigos');
  const [paladar, setPaladar] = React.useState(true);
  const [search, setSearch] = React.useState(true);
  const [reading, setReading] = React.useState(false);

  const Pick = ({ value, current, label, sub, onClick }) => (
    <button onClick={onClick} style={{
      width: '100%', display: 'flex', alignItems: 'flex-start', gap: 12, padding: 14,
      background: current === value ? T.c.p50 : T.c.n0,
      border: `1.5px solid ${current === value ? T.c.p700 : T.c.n200}`,
      borderRadius: T.r.md, cursor: 'pointer', textAlign: 'left', marginBottom: 8,
    }}>
      <div style={{
        width: 20, height: 20, borderRadius: '50%', flexShrink: 0, marginTop: 2,
        border: `2px solid ${current === value ? T.c.p700 : T.c.n400}`,
        background: current === value ? T.c.p700 : T.c.n0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {current === value && <div style={{ width: 8, height: 8, borderRadius: '50%', background: T.c.n0 }}/>}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ ...T.t.bodyB, color: T.c.n950 }}>{label}</div>
        <div style={{ ...T.t.caption, color: T.c.n600, marginTop: 2 }}>{sub}</div>
      </div>
    </button>
  );

  const Toggle = ({ on, onChange, label, sub }) => (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: 14, background: T.c.n0, borderBottom: `1px solid ${T.c.n100}` }}>
      <div style={{ flex: 1 }}>
        <div style={{ ...T.t.bodyB, color: T.c.n950 }}>{label}</div>
        <div style={{ ...T.t.caption, color: T.c.n600, marginTop: 2 }}>{sub}</div>
      </div>
      <button onClick={() => onChange(!on)} style={{
        width: 44, height: 26, borderRadius: 13, border: 'none', cursor: 'pointer',
        background: on ? T.c.p700 : T.c.n300, transition: 'background 150ms',
        position: 'relative', flexShrink: 0,
      }}>
        <div style={{
          position: 'absolute', top: 3, left: on ? 21 : 3, width: 20, height: 20,
          borderRadius: '50%', background: T.c.n0, transition: 'left 150ms',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }}/>
      </button>
    </div>
  );

  return (
    <EpShell title="Privacidade" onBack={() => go('back')} onSave={() => { go('toast', { kind: 'success', message: 'Configurações salvas.' }); go('back'); }}>
      <div style={{ padding: '16px 16px 8px' }}>
        <div style={{ ...T.t.overline, color: T.c.n600, marginBottom: 10 }}>QUEM VÊ SEU DIÁRIO</div>
        <Pick value="only-me"  current={diary} onClick={() => setDiary('only-me')}    label="Só você"          sub="Seu diário fica 100% privado."/>
        <Pick value="confraria" current={diary} onClick={() => setDiary('confraria')} label="Confraria"        sub="Membros das suas confrarias veem suas entradas."/>
        <Pick value="public"   current={diary} onClick={() => setDiary('public')}     label="Todo mundo"       sub="Qualquer pessoa no Tchin Tchin pode ver."/>
      </div>
      <div style={{ padding: '16px 16px 8px' }}>
        <div style={{ ...T.t.overline, color: T.c.n600, marginBottom: 10 }}>QUEM VÊ SUAS CONFRARIAS</div>
        <Pick value="only-me"           current={conf} onClick={() => setConf('only-me')}           label="Só você"          sub="Nem amigos veem."/>
        <Pick value="confraria-amigos"  current={conf} onClick={() => setConf('confraria-amigos')}  label="Confraria + amigos" sub="Recomendado."/>
        <Pick value="public"            current={conf} onClick={() => setConf('public')}            label="Todo mundo"       sub="Aparece pra busca pública."/>
      </div>
      <div style={{ background: T.c.n0, marginTop: 12 }}>
        <div style={{ ...T.t.overline, color: T.c.n600, padding: '12px 16px 4px' }}>NO SEU PERFIL</div>
        <Toggle on={paladar} onChange={setPaladar} label="Mostrar paladar 5D"        sub="Outros usuários veem seu radar de gostos."/>
        <Toggle on={search}  onChange={setSearch}  label="Aparecer em buscas"        sub="Pessoas conseguem te achar por nome ou @usuário."/>
        <Toggle on={reading} onChange={setReading} label="Confirmações de leitura"   sub="Mostrar quando você leu mensagens no chat."/>
      </div>
      <div style={{ padding: '16px 16px 32px' }}>
        <div style={{ ...T.t.caption, color: T.c.n600, lineHeight: 1.5 }}>
          Por padrão, mantemos privacidade alta. Você sempre pode mudar depois.
        </div>
      </div>
    </EpShell>
  );
}

Object.assign(window, {
  EpShell, EditarPerfilScreen, EditarPerfilFotoScreen,
  EditarPerfilPaladarScreen, EditarPerfilPrivacidadeScreen,
});


export { EditarPerfilFotoScreen, EditarPerfilPaladarScreen, EditarPerfilPrivacidadeScreen, EditarPerfilScreen, EpField, EpShell, epInput };
