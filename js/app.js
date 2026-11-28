/**
 * Interface do site: rotas, telas e ajustes do leitor.
 * Rotas (hash, para funcionar em qualquer hospedagem estática):
 *   #/                                início (hoje)
 *   #/dia/AAAA-MM-DD                  um dia: celebração, referências das leituras e homilias
 *   #/dia/AAAA-MM-DD/homilia/ID       homilia de um santo ligada ao dia
 *   #/homilias                        catálogo geral das homilias
 *   #/homilias/ID                     uma homilia, fora de um dia do calendário
 *   #/calendario/AAAA-MM?dia=...      calendário
 *   #/sobre                           créditos e procedência
 * Endereços antigos (#/liturgia-diaria/…, #/horas/…) são redirecionados.
 */
import * as dados from './dados.js';
import {
  CalendarioLiturgico, hojeIso, dataPorExtenso, nomeGrau, NOMES_DIAS, NOMES_MESES,
} from './liturgical-calendar.js';
import * as LT from './leituras.js';
import * as HM from './homilias.js';
import { esc, ICONE_INFO } from './render.js';
import { desenharMes, detalheDia, seletorAno, seletorMes, corHex } from './calendar.js';

const $ = (s, el = document) => el.querySelector(s);
const app = $('#app');
let cal = null;

// ------------------------------------------------------------- ícones
const I = {
  casa: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v10h14V10"/>',
  livro: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H12v16H6.5A2.5 2.5 0 0 0 4 21.5z"/><path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H12v16h5.5a2.5 2.5 0 0 1 2.5 2.5z"/>',
  cruz: '<path d="M12 3v18M7 8h10"/>',
  calendario: '<rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  esq: '<path d="m15 18-6-6 6-6"/>',
  dir: '<path d="m9 18 6-6-6-6"/>',
  som: '<path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/>',
  hoje: '<circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="9"/>',
  externo: '<path d="M14 4h6v6"/><path d="M20 4 11 13"/><path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/>',
};
const svg = (n, extra = '') => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" ${extra}>${I[n] || ''}</svg>`;

// ------------------------------------------------------------- preferências
const prefs = {
  ler(k, padrao) { try { const v = localStorage.getItem('santahomilia.' + k); return v == null ? padrao : JSON.parse(v); } catch { return padrao; } },
  gravar(k, v) { try { localStorage.setItem('santahomilia.' + k, JSON.stringify(v)); } catch { /* sem armazenamento */ } },
};
const TAMANHOS = [0.98, 1.12, 1.26, 1.42];
function aplicarPrefs() {
  const tema = prefs.ler('tema', 'auto');
  if (tema === 'auto') document.documentElement.removeAttribute('data-tema');
  else document.documentElement.setAttribute('data-tema', tema);
  const t = prefs.ler('tamanho', 1);
  document.documentElement.style.setProperty('--tam-texto', TAMANHOS[t] + 'rem');
}

// escolha de memória facultativa por data
function escolhaDoDia(iso) { return prefs.ler('escolha.' + iso, null); }
function gravarEscolha(iso, id) { prefs.gravar('escolha.' + iso, id || null); }

// ------------------------------------------------------------- utilidades de tela
function carregando() { app.innerHTML = '<div class="carregando"><div class="pontinhos"><span></span><span></span><span></span></div></div>'; }
function definirCor(cor) { document.body.dataset.cor = cor || 'verde'; }
function marcarNav(rota) {
  document.querySelectorAll('[data-nav]').forEach((a) => a.classList.toggle('ativo', a.dataset.nav === rota));
}
function isoValido(s) { return /^\d{4}-\d{2}-\d{2}$/.test(s || '') && !Number.isNaN(Date.parse(s)); }
function saudacao() {
  const h = new Date().getHours();
  return h < 5 ? 'Boa noite' : h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite';
}
function navegadorData(iso) {
  return `<div class="navegador-data">
    <a class="botao-icone" href="#/dia/${cal.proximo(iso, -1)}" aria-label="Dia anterior">${svg('esq')}</a>
    <label class="data-atual" style="cursor:pointer">
      <span>${esc(NOMES_DIAS[new Date(iso + 'T12:00').getDay()])}, ${esc(dataPorExtenso(iso))}</span>
      <input type="date" value="${iso}" data-ir="dia" aria-label="Escolher data">
    </label>
    <a class="botao-icone" href="#/dia/${cal.proximo(iso, 1)}" aria-label="Dia seguinte">${svg('dir')}</a>
    ${iso !== hojeIso() ? `<a class="botao fino" href="#/dia/${hojeIso()}">${svg('hoje')} Hoje</a>` : ''}
  </div>`;
}
function ligarSeletorData() {
  const inp = $('input[type="date"][data-ir]', app);
  if (!inp) return;
  const lab = inp.closest('label');
  lab.addEventListener('click', (e) => {
    e.preventDefault();
    if (inp.showPicker) { try { inp.showPicker(); return; } catch { /* segue */ } }
    inp.style.pointerEvents = 'auto'; inp.focus(); inp.click();
  });
  inp.addEventListener('change', () => { if (isoValido(inp.value)) location.hash = `#/dia/${inp.value}`; });
}

function cartaoDia(d, cel) {
  const c = cel || d.celebracao;
  const etiquetas = [];
  if (d.semana != null && d.tempo !== 'natal' && d.tempo !== 'triduo') etiquetas.push(d.semana === 0 ? 'Depois das Cinzas' : `${d.semana}ª semana`);
  etiquetas.push(d.diaSemana === 0 ? `Ano ${d.cicloDominical}` : `Ano ${d.cicloDominical} · ${d.cicloFerial}`);
  const outros = [];
  if (c !== d.celebracao && cel) outros.push(`Dia: ${esc(d.celebracao.nome)}`);
  if (d.comemoracoes.length) outros.push('Comemoração: ' + d.comemoracoes.map((x) => esc(x.nome)).join(', '));
  return `<div class="cartao-dia" style="--cor-dia:${corHex(c.cor || d.cor)}">
    <span class="rotulo-tempo"><span class="ponto-cor"></span>${esc(d.nomeTempo)}</span>
    <h2>${esc(c.nome)}</h2>
    <div class="grau">${esc(nomeGrau(c))}${c.transferida ? ' · celebração transferida' : ''}</div>
    <div class="etiquetas">${etiquetas.map((e) => `<span class="etiqueta">${esc(e)}</span>`).join('')}</div>
    ${outros.length ? `<div class="comemoracoes">${outros.join('<br>')}</div>` : ''}
  </div>`;
}

function blocoEscolha(d, opAtual) {
  if (!d.opcoes.length) return '';
  const itens = [{ id: '', nome: d.celebracao.tipo === 'temporal' ? `Dia de semana (${d.nomeTempo})` : d.celebracao.nome }, ...d.opcoes];
  return `<div class="escolha">
    <p>${d.opcoes.length > 1 ? 'Hoje há memórias facultativas' : 'Hoje há memória facultativa'}. Escolha qual celebração deseja acompanhar:</p>
    <div class="chips">${itens.map((o) => `<button class="chip" data-op="${o.id}" aria-pressed="${(opAtual || '') === o.id}">${esc(o.nome)}</button>`).join('')}</div>
  </div>`;
}
function ligarEscolha(iso, aoMudar) {
  app.querySelectorAll('.chip[data-op]').forEach((b) => b.addEventListener('click', () => {
    gravarEscolha(iso, b.dataset.op);
    aoMudar(b.dataset.op);
  }));
}

/** Referências das leituras (só o fato) e o link para lê-las na CNBB. */
function blocoLeituras(res, chaveAtual) {
  const conjuntos = (chaveAtual && LT.conjuntosDe(chaveAtual)) || res.conjuntos;
  const alternativas = res.alternativas.length ? `<div class="escolha"><p>Leituras:</p><div class="chips">${res.alternativas.map((a) => `<button class="chip" data-alt="${esc(a.chave)}" aria-pressed="${a.chave === (chaveAtual || res.chave)}">${esc(a.rotulo)}</button>`).join('')}</div></div>` : '';
  const lista = (g) => `<dl class="lista-leituras">${g.map(([secao, ref]) => `<div><dt>${esc(secao)}</dt><dd>${esc(ref || 'referência não indicada')}</dd></div>`).join('')}</dl>`;
  const corpo = !conjuntos ? `<div class="lacuna">${ICONE_INFO}<span>As referências das leituras deste dia não estão no nosso índice.</span></div>`
    : conjuntos.length === 1 ? lista(conjuntos[0])
      : `<p class="nota-leituras">Há mais de um conjunto de leituras para este dia (por exemplo, missa da vigília e missa do dia, ou leituras à escolha). Confira na CNBB qual se usa em cada missa.</p>
        ${conjuntos.map((g, i) => `<p class="conjunto-titulo">Conjunto ${i + 1}</p>${lista(g)}`).join('')}`;
  return `<section class="bloco-indicacoes" id="leituras">
    <h3 class="secao">Leituras da Missa</h3>
    ${alternativas}
    ${res.notas.map((n) => `<div class="lacuna">${ICONE_INFO}<span>${esc(n)}</span></div>`).join('')}
    ${corpo}
    <p class="link-cnbb">Este site indica só quais são as leituras. Para lê-las, abra a
      <a href="${LT.LINK_CNBB}" target="_blank" rel="noopener noreferrer">Liturgia Diária da CNBB ${svg('externo', 'width="14" height="14" aria-hidden="true"')}</a>.</p>
  </section>`;
}

// ------------------------------------------------------------- homilias dos santos
/** Faixa mostrada só na prévia (endereço com ?previa): nada do que ela revela está publicado. */
const faixaPrevia = () => (HM.emPrevia()
  ? `<div class="faixa-previa" role="note">${ICONE_INFO}<span><strong>Prévia.</strong> Os sermões de Santo Antônio ainda não estão publicados; esta visualização serve só para conferência.</span></div>`
  : '');
const seloPrevia = (h) => (h.estado === 'previa' ? '<span class="selo-previa">prévia · não publicado</span>' : '');
function itemMotivo(m, h) {
  const d = HM.descreverMotivo(m, h);
  return `<li class="motivo-${m.tipo}"><strong>${esc(d.rotulo)}.</strong> ${esc(d.texto)}${d.historia ? `<br><small class="motivo-historia">${esc(d.historia)}</small>` : ''}</li>`;
}
function cartaoHomilia(h, motivos, href) {
  const a = HM.autor(HM.obra(h.obra)?.autor) || {};
  const ob = HM.obra(h.obra) || {};
  const sermao = HM.ehSermaoAntonio(h);
  return `<div class="homilia-cartao">
    <p class="homilia-autor">${esc(a.nome || '')}${a.titulo ? `<span>${esc(a.titulo)}</span>` : ''}${seloPrevia(h)}</p>
    <p class="homilia-titulo">${esc(h.titulo)} · <em>${esc(ob.titulo || '')}</em></p>
    <ul class="homilia-motivos">${motivos.map((m) => itemMotivo(m, h)).join('')}</ul>
    <a class="botao" href="${href}">${svg('livro')} ${sermao ? 'Ler o sermão' : 'Ler a homilia'}</a>
  </div>`;
}

function blocoHomilias(res, iso, op) {
  const q = op ? '?op=' + encodeURIComponent(op) : '';
  const homilias = HM.homiliasDoDia(res);
  return `<section class="bloco-leitura bloco-homilia" id="homilia">
    <h3 class="secao">Homilia dos santos</h3>
    ${homilias.length ? homilias.map(({ homilia: h, motivos }) => cartaoHomilia(h, motivos, `#/dia/${iso}/homilia/${encodeURIComponent(h.id)}${q}`)).join('')
      : `<p class="sem-homilia">Ainda não há homilia de um santo publicada para as leituras deste dia.</p>`}
    <p class="homilia-catalogo-link"><a href="#/homilias">Todas as homilias</a></p>
  </section>`;
}

// ------------------------------------------------------------- telas
/** Um dia (ou o início, que é o dia de hoje com saudação). */
async function telaDia(iso, op, alt, inicio = false) {
  marcarNav(inicio ? 'inicio' : 'dia');
  const d = cal.dia(iso);
  if (op === undefined) op = escolhaDoDia(iso);
  const cel = LT.celebracaoEscolhida(d, op);
  definirCor(cel.cor || d.cor);
  const res = LT.resolver(d, op);
  app.innerHTML = `<div class="pagina leitura">
    ${faixaPrevia()}
    ${inicio ? `<p class="saudacao">${saudacao()} — ${esc(NOMES_DIAS[d.diaSemana].toLowerCase())}, ${esc(dataPorExtenso(iso))}</p>
      <h1 class="titulo-pagina">A Palavra de hoje,<br>comentada pelos santos.</h1>`
    : `<h1 class="titulo-pagina" style="margin-top:22px">Leituras e homilias</h1>${navegadorData(iso)}`}
    ${cartaoDia(d, cel)}
    ${blocoEscolha(d, op)}
    <article class="texto-liturgico">
      ${blocoHomilias(res, iso, op)}
      ${blocoLeituras(res, alt)}
    </article>
    ${inicio ? `<div class="atalhos">
      <a class="atalho" href="#/calendario">
        <span class="icone">${svg('calendario')}</span>
        <span><strong>Calendário litúrgico</strong><span>Consulte outros dias, santos e festas</span></span>
        <span class="seta">${svg('dir', 'width="18" height="18"')}</span>
      </a>
      <a class="atalho" href="#/homilias">
        <span class="icone">${svg('livro')}</span>
        <span><strong>Homilias dos santos</strong><span>Todas as homilias publicadas</span></span>
        <span class="seta">${svg('dir', 'width="18" height="18"')}</span>
      </a>
    </div>` : ''}
  </div>`;
  ligarSeletorData();
  ligarEscolha(iso, (novo) => (inicio ? telaDia(iso, novo || null, null, true) : telaDia(iso, novo || null)));
  app.querySelectorAll('[data-alt]').forEach((b) => b.addEventListener('click', () => telaDia(iso, op, b.dataset.alt, inicio)));
}

let leitorVoz = null;
function pararVoz() { try { window.speechSynthesis?.cancel(); } catch { /* sem voz */ } leitorVoz = null; }
window.addEventListener('hashchange', pararVoz);

/** Uma homilia: ligada a um dia (iso) ou aberta do catálogo geral (iso = null). */
async function telaHomilia(iso, id, op) {
  const h = HM.homilia(decodeURIComponent(id));
  const q = op ? '?op=' + encodeURIComponent(op) : '';
  const voltar = iso ? `#/dia/${iso}${q}` : '#/homilias';
  if (!h) { location.hash = voltar; return; }
  let doDia = null;
  if (iso) {
    marcarNav('dia');
    const d = cal.dia(iso);
    if (op === undefined) op = escolhaDoDia(iso);
    const res = LT.resolver(d, op);
    const cel = LT.celebracaoEscolhida(d, op);
    definirCor(cel.cor || d.cor);
    doDia = HM.homiliasDoDia(res).find((x) => x.homilia.id === h.id);
  } else {
    marcarNav('homilias');
    definirCor('verde');
  }
  carregando();
  const t = await HM.carregarTexto(h);
  if (t && HM.ehSermaoAntonio(h)) return telaSermao(iso, h, t, doDia, voltar);
  const ob = HM.obra(h.obra) || {};
  const a = HM.autor(ob.autor) || {};
  const onde = HM.ondeAparece(h);
  const ondeHTML = onde.length ? `<ul>${onde.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : `Sem data litúrgica: fica só no catálogo geral. ${esc(h.motivo_catalogo || '')}`;
  if (!t) { app.innerHTML = `<div class="pagina"><div class="lacuna" style="margin-top:30px">${ICONE_INFO}<span>O texto desta homilia não foi encontrado.</span></div></div>`; return; }
  const tr = ob.traducao || {};
  const temVoz = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  app.innerHTML = `<div class="pagina leitura">
    <a class="voltar" href="${voltar}">${svg('esq')} ${iso ? `Leituras e homilias · ${esc(dataPorExtenso(iso))}` : 'Homilias dos santos'}</a>
    <header class="cab-oficio cab-homilia">
      <span class="rotulo-tempo" style="display:flex"><span class="ponto-cor"></span>Homilia dos santos</span>
      <h1>${esc(a.nome || '')}</h1>
      <div class="sub">${esc(a.titulo || '')}${a.datas ? ` · ${esc(a.datas)}` : ''}<br><strong>${esc(h.titulo)}</strong> — ${esc(ob.titulo || '')}${h.livro ? `, livro ${esc(h.livro)}` : ''}</div>
    </header>
    <dl class="homilia-meta">
      <div><dt>Passagem comentada</dt><dd>${esc(h.pericope)}</dd></div>
      <div><dt>Ocasião em que foi pregada</dt><dd>${esc(t.ocasiao || '—')}${h.ocasiao_nota ? `<br><small>${esc(h.ocasiao_nota)}</small>` : ''}</dd></div>
      ${!iso ? `<div><dt>Dias em que aparece</dt><dd>${ondeHTML}</dd></div>`
        : doDia ? `<div><dt>Por que está neste dia</dt><dd><ul>${doDia.motivos.map((m) => { const x = HM.descreverMotivo(m); return `<li><strong>${esc(x.rotulo)}.</strong> ${esc(x.texto)}</li>`; }).join('')}</ul></dd></div>`
        : `<div><dt>Este dia</dt><dd>Esta homilia não está associada às leituras de ${esc(dataPorExtenso(iso))}.</dd></div>`}
    </dl>
    ${temVoz ? `<div class="controle-voz" role="group" aria-label="Ouvir a homilia">
      <button class="botao fino" data-voz="ouvir">${svg('som')} Ouvir</button>
      <button class="botao fino" data-voz="pausar" hidden>Pausar</button>
      <button class="botao fino" data-voz="continuar" hidden>Continuar</button>
      <button class="botao fino" data-voz="parar" hidden>Parar</button>
      <small>Leitura pela voz sintetizada do seu aparelho (não é uma gravação).</small>
    </div>` : ''}
    <article class="texto-liturgico texto-homilia">
      ${t.leituraTitulo ? `<h3 class="secao">${esc(t.leituraTitulo)}</h3>` : ''}
      ${t.leitura ? `<p class="homilia-leitura">${esc(t.leitura)}</p>` : ''}
      <h3 class="secao">Homilia</h3>
      ${t.paragrafos.map((p) => `<p>${esc(p)}</p>`).join('')}
    </article>
    <section class="homilia-fonte">
      <h3>Fonte</h3>
      <p><strong>Texto latino de referência:</strong> ${esc(ob.edicao_critica || '')}${h.ccsl ? ` — ${esc(h.ccsl)}` : ''}.</p>
      ${h.rubrica_latina ? `<p><strong>Rubrica latina:</strong> <em>${esc(h.rubrica_latina)}</em></p>` : ''}
      ${ob.edicao_historica ? `<p><strong>Edição antiga:</strong> ${esc(ob.edicao_historica)}</p>` : ''}
      <p><strong>Tradução portuguesa:</strong> tradutor ${esc(tr.tradutor || 'não identificado')}. ${esc(tr.origem || '')}</p>
      <p><strong>Revisão:</strong> ${esc(tr.revisao || '')}</p>
      ${ob.autenticidade ? `<p><strong>Autoria:</strong> ${esc(ob.autenticidade)}</p>` : ''}
      ${(h.notas_editoriais || []).map((n) => `<p><strong>Nota editorial${n.localizacao ? ` (${esc(n.localizacao)})` : ''}:</strong> ${esc(n.texto)}</p>`).join('')}
      <p class="homilia-arquivo">Arquivo do texto publicado: <code>dados/${esc(h.arquivo)}.txt</code></p>
    </section>
    <div class="seguinte">${iso ? `<a href="${voltar}"><small>Voltar para</small><strong>Leituras e homilias</strong></a>` : ''}<a class="dir" href="#/homilias"><small>Ver todas as</small><strong>Homilias</strong></a></div>
  </div>`;
  if (temVoz) ligarVoz([t.leituraTitulo, t.leitura, 'Homilia.', ...t.paragrafos].filter(Boolean));
  window.scrollTo({ top: 0 });
}

/**
 * Um sermão de Santo Antônio. O título é o histórico (nunca o nome atual da
 * celebração); a correspondência com o calendário atual aparece à parte,
 * distinguindo “pregado para esta celebração” de “associado pela leitura”.
 * O texto é o da camada revisada, sem nenhuma mudança; os avisos das
 * traduções próprias e as notas fora do corpo do texto vêm do registro.
 */
function telaSermao(iso, h, t, doDia, voltar) {
  const ob = HM.obra(h.obra) || {};
  const a = HM.autor(ob.autor) || {};
  const tr = ob.traducao || {};
  const onde = HM.ondeAparece(h);
  const doPar = (lista, n) => (lista || []).filter((x) => String(x.paragrafo) === String(n));
  const avisos = (n) => doPar(h.avisos, n).map((x) => `<p class="aviso-traducao">${ICONE_INFO}<span>${esc(x.texto)}${x.localizacao && !/inteiro/.test(x.localizacao) ? ` <small>(${esc(x.localizacao)})</small>` : ''}</span></p>`).join('');
  const notas = (n) => doPar(h.notas, n).map((x) => `<aside class="nota-sermao"><strong>${esc(x.tipo)}.</strong> ${esc(x.texto)}</aside>`).join('');
  const trecho = h.pericope
    ? `${esc(h.pericope)}${h.reducao ? `<br><small>Leitura do dia no missal da época: ${esc(h.leitura_do_dia)}. ${esc(h.reducao)}</small>` : ''}${h.leitura_comentada && h.leitura_comentada !== 'Evangelho' ? `<br><small>O sermão comenta a ${h.leitura_comentada === 'Segunda leitura' ? 'epístola (2ª leitura)' : '1ª leitura'}.</small>` : ''}`
    : (h.sem_trecho ? `Nenhum.<br><small>${esc(h.sem_trecho)}</small>` : '—');
  const ondeHTML = onde.length ? `<ul>${onde.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : `Sem data litúrgica: fica só no catálogo geral. ${esc(h.motivo_catalogo || '')}`;
  const temVoz = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  app.innerHTML = `<div class="pagina leitura">
    ${faixaPrevia()}
    <a class="voltar" href="${voltar}">${svg('esq')} ${iso ? `Leituras e homilias · ${esc(dataPorExtenso(iso))}` : 'Homilias dos santos'}</a>
    <header class="cab-oficio cab-homilia">
      <span class="rotulo-tempo" style="display:flex"><span class="ponto-cor"></span>Sermões dos santos${seloPrevia(h)}</span>
      <h1>${esc(a.nome || '')}</h1>
      <div class="sub">${esc(a.titulo || '')}${a.datas ? ` · ${esc(a.datas)}` : ''}<br><strong>${esc(h.titulo)}</strong> — ${esc(ob.titulo || '')}${h.titulo_latino ? `<br><em>${esc(h.titulo_latino)}</em>` : ''}</div>
    </header>
    <dl class="homilia-meta">
      <div><dt>Ocasião em que foi pregado</dt><dd>${esc(h.ocasiao || 'Sem ocasião litúrgica: texto de abertura ou fecho da coleção.')}</dd></div>
      <div><dt>Trecho comentado</dt><dd>${trecho}</dd></div>
      ${!iso ? `<div><dt>Dias em que aparece no calendário atual</dt><dd>${ondeHTML}</dd></div>`
        : doDia ? `<div><dt>Por que está neste dia</dt><dd><ul>${doDia.motivos.map((m) => itemMotivo(m, h)).join('')}</ul></dd></div>`
        : `<div><dt>Este dia</dt><dd>Este sermão não está associado às leituras de ${esc(dataPorExtenso(iso))}.</dd></div>`}
    </dl>
    ${temVoz ? `<div class="controle-voz" role="group" aria-label="Ouvir o sermão">
      <button class="botao fino" data-voz="ouvir">${svg('som')} Ouvir</button>
      <button class="botao fino" data-voz="pausar" hidden>Pausar</button>
      <button class="botao fino" data-voz="continuar" hidden>Continuar</button>
      <button class="botao fino" data-voz="parar" hidden>Parar</button>
      <small>Leitura pela voz sintetizada do seu aparelho (não é uma gravação).</small>
    </div>` : ''}
    <article class="texto-liturgico texto-homilia texto-sermao">
      ${t.secoes.map((s) => `
        ${s.titulo ? `<h3 class="secao">${esc(s.titulo)}</h3>` : ''}
        ${s.temas.length ? `<ul class="temas-sermao">${s.temas.map((l) => `<li>${esc(l)}</li>`).join('')}</ul>${avisos('temas')}${notas('temas')}` : ''}
        ${s.paragrafos.map((p) => `${p.linhas.map((l) => `<p>${esc(l)}</p>`).join('')}${avisos(p.n)}${notas(p.n)}`).join('')}`).join('')}
    </article>
    <section class="homilia-fonte">
      <h3>Fonte</h3>
      <p><strong>Tradução:</strong> ${esc((tr.credito || '').replace(/^Tradução:\s*/, ''))}</p>
      <p><strong>Texto latino de referência:</strong> ${esc(ob.edicao_critica || '')}</p>
      ${ob.diretriz_latim ? `<p><strong>Sobre o latim:</strong> ${esc(ob.diretriz_latim)}</p>` : ''}
      ${tr.nota_editorial ? `<p><strong>Nota editorial:</strong> ${esc(tr.nota_editorial)}</p>` : ''}
      ${ob.etapa_1 ? `<p><strong>Conferência com o latim:</strong> ${esc(ob.etapa_1)}</p>` : ''}
      <p class="homilia-arquivo">Arquivo do texto: <code>dados/${esc(h.arquivo)}.txt</code></p>
    </section>
    <div class="seguinte">${iso ? `<a href="${voltar}"><small>Voltar para</small><strong>Leituras e homilias</strong></a>` : ''}<a class="dir" href="#/homilias"><small>Ver todas as</small><strong>Homilias</strong></a></div>
  </div>`;
  if (temVoz) ligarVoz([h.titulo, ...t.paragrafos].filter(Boolean));
  window.scrollTo({ top: 0 });
}

/** Catálogo geral: todas as homilias publicadas, com ou sem data litúrgica. */
function telaCatalogoHomilias() {
  marcarNav('homilias');
  definirCor('verde');
  const lista = HM.publicadas();
  const porObra = new Map();
  for (const h of lista) { if (!porObra.has(h.obra)) porObra.set(h.obra, []); porObra.get(h.obra).push(h); }
  const semData = lista.filter((h) => !h.correspondencias?.length).length;
  app.innerHTML = `<div class="pagina leitura catalogo-homilias">
    ${faixaPrevia()}
    <h1 class="titulo-pagina" style="margin-top:22px">Homilias dos santos</h1>
    <p class="catalogo-intro">Todas as homilias publicadas no site. A maior parte aparece também nos dias do calendário em que se lê o Evangelho que comentam ou na celebração para a qual foram pregadas. ${semData ? `Destas, ${semData === 1 ? 'uma não tem' : `${semData} não têm`} correspondência suficiente com o calendário atual e ${semData === 1 ? 'fica' : 'ficam'} só aqui, sem data litúrgica.` : ''}</p>
    ${[...porObra].map(([idObra, hs]) => {
      const ob = HM.obra(idObra) || {};
      const a = HM.autor(ob.autor) || {};
      return `<section class="catalogo-obra">
        <h2>${esc(a.nome || '')}</h2>
        <p class="catalogo-obra-titulo">${esc(ob.titulo || '')}${ob.titulo_latino ? ` · <em>${esc(ob.titulo_latino)}</em>` : ''}</p>
        <ul class="catalogo-lista">${hs.map((h) => {
          const onde = HM.ondeAparece(h);
          return `<li><a href="#/homilias/${encodeURIComponent(h.id)}"><strong>${esc(h.titulo)}</strong><span>${esc(h.pericope || '')}</span></a>
            <p>${onde.length ? `No calendário: ${esc(onde.join('; '))}.` : 'Sem data litúrgica (só no catálogo).'}</p></li>`;
        }).join('')}</ul>
      </section>`;
    }).join('')}
    <section class="catalogo-obra">
      <h2>Em preparação</h2>
      <ul class="catalogo-lista catalogo-preparacao">
        <li><p><strong>Santo Antônio de Pádua</strong> — Sermões dominicais e festivos (tradução do Lírio Católico, conferida com o latim).</p></li>
        <li><p><strong>São João Maria Vianney</strong> — Sermões do Cura d’Ars (edição francesa de 1883; ainda sem tradução).</p></li>
      </ul>
    </section>
  </div>`;
  window.scrollTo({ top: 0 });
}

/** Leitura em voz alta, parágrafo por parágrafo (Web Speech API, sem serviços externos). */
function ligarVoz(partes) {
  const sintese = window.speechSynthesis;
  const bt = (k) => app.querySelector(`[data-voz="${k}"]`);
  const estado = (falando, pausado) => {
    bt('ouvir').hidden = falando;
    bt('pausar').hidden = !falando || pausado;
    bt('continuar').hidden = !falando || !pausado;
    bt('parar').hidden = !falando;
  };
  const vozPt = () => (sintese.getVoices() || []).find((v) => /^pt(-|_)BR/i.test(v.lang)) || (sintese.getVoices() || []).find((v) => /^pt/i.test(v.lang)) || null;
  bt('ouvir').addEventListener('click', () => {
    pararVoz();
    const meu = {};
    leitorVoz = meu;
    let i = 0;
    const proxima = () => {
      if (leitorVoz !== meu) return;
      if (i >= partes.length) { estado(false, false); leitorVoz = null; return; }
      const u = new SpeechSynthesisUtterance(partes[i++]);
      u.lang = 'pt-BR';
      const v = vozPt(); if (v) u.voice = v;
      u.onend = proxima;
      u.onerror = () => { if (leitorVoz === meu) { estado(false, false); leitorVoz = null; } };
      sintese.speak(u);
    };
    estado(true, false);
    proxima();
  });
  bt('pausar').addEventListener('click', () => { sintese.pause(); estado(true, true); });
  bt('continuar').addEventListener('click', () => { sintese.resume(); estado(true, false); });
  bt('parar').addEventListener('click', () => { pararVoz(); estado(false, false); });
}

function telaCalendario(ano, mes, sel) {
  marcarNav('calendario');
  const hoje = hojeIso();
  if (!sel) sel = (ano === +hoje.slice(0, 4) && mes === +hoje.slice(5, 7)) ? hoje : `${ano}-${String(mes).padStart(2, '0')}-01`;
  const dSel = cal.dia(sel);
  definirCor(dSel.cor);
  const ant = mes === 1 ? [ano - 1, 12] : [ano, mes - 1];
  const prox = mes === 12 ? [ano + 1, 1] : [ano, mes + 1];
  const fmt = ([a, m]) => `${a}-${String(m).padStart(2, '0')}`;
  app.innerHTML = `<div class="pagina">
    <div class="cal-cab">
      <h1>${NOMES_MESES[mes - 1]} ${ano}</h1>
      <a class="botao-icone" href="#/calendario/${fmt(ant)}" aria-label="Mês anterior">${svg('esq')}</a>
      <a class="botao-icone" href="#/calendario/${fmt(prox)}" aria-label="Próximo mês">${svg('dir')}</a>
      ${seletorMes(mes)} ${seletorAno(ano)}
      <a class="botao fino" href="#/calendario/${hoje.slice(0, 7)}?dia=${hoje}">${svg('hoje')} Hoje</a>
    </div>
    <div class="cal-layout">
      <div>${desenharMes(cal, ano, mes, sel)}</div>
      <div id="cal-detalhe">${detalheDia(dSel)}</div>
    </div>
  </div>`;
  app.querySelectorAll('.cal-dia[data-dia]').forEach((b) => b.addEventListener('click', () => {
    history.replaceState(null, '', `#/calendario/${fmt([ano, mes])}?dia=${b.dataset.dia}`);
    app.querySelectorAll('.cal-dia.selecionado').forEach((x) => x.classList.remove('selecionado'));
    b.classList.add('selecionado');
    const d = cal.dia(b.dataset.dia);
    definirCor(d.cor);
    $('#cal-detalhe').innerHTML = detalheDia(d);
    if (window.innerWidth < 980) $('#cal-detalhe').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));
  const ir = () => { location.hash = `#/calendario/${$('#cal-ano').value}-${String($('#cal-mes').value).padStart(2, '0')}`; };
  $('#cal-ano').addEventListener('change', ir);
  $('#cal-mes').addEventListener('change', ir);
}

function telaSobre() {
  marcarNav('sobre');
  definirCor('verde');
  app.innerHTML = `<div class="pagina sobre">
    <h1 class="titulo-pagina" style="margin-top:22px">Sobre</h1>
    <p>Um espaço simples para ler as <strong>homilias dos santos</strong> diante das leituras de cada dia. Sem propagandas, sem distrações.</p>
    <h2>Como funciona</h2>
    <p>O site identifica a data, calcula o calendário litúrgico (tempos, semanas, solenidades, festas e memórias, com as particularidades do Brasil) e indica quais são as leituras da Missa do dia. Quando um santo comentou o Evangelho desse dia, ou pregou para essa celebração, a homilia aparece junto. Quando há memória facultativa, você escolhe qual celebração quer acompanhar.</p>
    <p><strong>As leituras não são reproduzidas aqui.</strong> O site indica só a referência de cada leitura (livro, capítulo e versículos). Para ler os textos, abra a <a href="${LT.LINK_CNBB}" target="_blank" rel="noopener noreferrer">Liturgia Diária da CNBB</a>.</p>
    <h2>Créditos e procedência dos textos</h2>
    <p><strong>Homilias de São Gregório Magno</strong><br>A tradução portuguesa das <em>Homilias sobre os Evangelhos</em> foi obtida no portal OpenSaints, que indica como base o texto latino da edição de Migne (<em>Patrologia Latina</em>, vol. 76). O tradutor não é identificado. O projeto conferiu essa tradução, homilia por homilia, com o latim de Migne e com a edição crítica de R. Étaix (<em>Corpus Christianorum, Series Latina</em> 141, Brepols, 1999), e corrigiu os erros encontrados. Dois trechos que faltavam na tradução recebida foram traduzidos do latim pelo projeto. Cada correção e cada trecho traduzido estão registrados com o texto latino e a justificativa; a tradução recebida é conservada, sem alteração, nos arquivos do projeto.</p>
    <p><strong>Sermões de Santo Antônio de Pádua</strong> (em preparação; ainda não publicados)<br>A tradução de base é a do Lírio Católico (liriocatolico.com.br), creditada a ele, conferida com o latim da edição crítica (Centro Studi Antoniani, Pádua, 1979) e revisada pelo projeto. Os trechos traduzidos diretamente do latim pelo projeto são identificados um a um.</p>
    <p><strong>Sermões de São João Maria Vianney</strong> (em preparação)<br>Ainda não há tradução portuguesa. O projeto dispõe da edição francesa em quatro tomos (Paris: Victor Lecoffre; Lyon: Librairie chrétienne, 1883), na cópia digitalizada pela Bibliothèque Saint Libère.</p>
    <p><strong>Calendário e referências das leituras</strong><br>O calendário é calculado pelo próprio site. As referências bíblicas das leituras são só a indicação de qual é cada leitura; nenhum texto litúrgico (leituras, refrões, orações) é reproduzido.</p>
    <p><strong>Uso de inteligência artificial</strong><br>O projeto usa inteligência artificial na organização dos textos, no cálculo do calendário, na conferência das traduções com o latim e nas traduções feitas pelo projeto. Os critérios e as decisões editoriais são do responsável pelo projeto.</p>
    <p><strong>Compromisso editorial</strong><br>Procuramos distinguir com clareza o texto original e sua edição de referência, a tradução recebida de outra fonte, as correções feitas pelo projeto, os trechos traduzidos pelo projeto e as dúvidas, variantes e limitações que permanecem em aberto. Não reivindicamos autoria de textos recebidos de terceiros.</p>
    <h2>Para quem cuida do conteúdo</h2>
    <p>Os textos e os dados estão na pasta <code>dados/</code>. Veja o guia em <code>dados/LEIA-ME.md</code>.</p>
  </div>`;
}

// ------------------------------------------------------------- ajustes
function abrirAjustes() {
  const existente = $('.painel');
  if (existente) { existente.remove(); return; }
  const tema = prefs.ler('tema', 'auto');
  const tam = prefs.ler('tamanho', 1);
  const div = document.createElement('div');
  div.className = 'painel';
  div.setAttribute('role', 'dialog');
  div.setAttribute('aria-label', 'Ajustes de leitura');
  div.innerHTML = `<h4>Ajustes de leitura</h4>
    <div class="linha"><span>Tema</span><div class="segmentado" data-k="tema">
      ${[['auto', 'Auto'], ['claro', 'Claro'], ['escuro', 'Escuro']].map(([v, r]) => `<button data-v="${v}" aria-pressed="${tema === v}">${r}</button>`).join('')}</div></div>
    <div class="linha"><span>Texto</span><div class="segmentado" data-k="tamanho">
      ${['A−', 'A', 'A+', 'A++'].map((r, i) => `<button data-v="${i}" aria-pressed="${tam === i}">${r}</button>`).join('')}</div></div>`;
  document.body.appendChild(div);
  div.querySelectorAll('.segmentado').forEach((g) => g.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    const k = g.dataset.k; const v = k === 'tamanho' ? Number(b.dataset.v) : b.dataset.v;
    prefs.gravar(k, v); aplicarPrefs();
    g.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', x === b));
  }));
  setTimeout(() => document.addEventListener('click', function fora(e) {
    if (!div.contains(e.target) && !e.target.closest('#bt-ajustes')) { div.remove(); document.removeEventListener('click', fora); }
  }), 0);
}

// ------------------------------------------------------------- rotas
async function rotear() {
  const h = location.hash.replace(/^#\/?/, '');
  const [caminho, query = ''] = h.split('?');
  const qs = new URLSearchParams(query);
  const p = caminho.split('/').filter(Boolean);
  $('.painel')?.remove();
  const op = qs.has('op') ? qs.get('op') || null : undefined;
  try {
    if (!p.length) return await telaDia(hojeIso(), undefined, null, true);
    // endereços antigos: a Liturgia Diária com textos e a Liturgia das Horas não fazem parte deste site
    if (p[0] === 'horas') { location.replace('#/'); return; }
    if (p[0] === 'liturgia-diaria') { location.replace('#/' + ['dia', ...p.slice(1)].join('/') + (query ? '?' + query : '')); return; }
    if (p[0] === 'dia') {
      const iso = isoValido(p[1]) ? p[1] : hojeIso();
      if (p[2] === 'homilia' && p[3]) return await telaHomilia(iso, p[3], op);
      return await telaDia(iso, op, qs.get('l') || null);
    }
    if (p[0] === 'calendario') {
      const hoje = hojeIso();
      const m = (p[1] || '').match(/^(\d{4})-(\d{2})$/);
      const ano = m ? +m[1] : +hoje.slice(0, 4), mes = m ? +m[2] : +hoje.slice(5, 7);
      return telaCalendario(ano, Math.min(12, Math.max(1, mes)), isoValido(qs.get('dia')) ? qs.get('dia') : null);
    }
    if (p[0] === 'homilias') {
      if (p[1]) return await telaHomilia(null, p[1]);
      return telaCatalogoHomilias();
    }
    if (p[0] === 'sobre') return telaSobre();
    location.hash = '#/';
  } catch (e) {
    console.error(e);
    app.innerHTML = `<div class="pagina"><div class="lacuna" style="margin-top:30px">${ICONE_INFO}<span>Não foi possível carregar esta página. Verifique se o site está sendo aberto por um servidor (e não diretamente do arquivo). Detalhe: ${esc(e.message)}</span></div></div>`;
  }
}

async function iniciar() {
  aplicarPrefs();
  // prévia (só para conferência): index.html?previa mostra as entradas preparadas e ainda não publicadas
  HM.definirPrevia(new URLSearchParams(location.search).has('previa'));
  const santoral = await dados.json('calendario/santoral.json');
  cal = new CalendarioLiturgico(santoral);
  await Promise.all([LT.iniciar(), HM.iniciar()]);
  $('#bt-ajustes').addEventListener('click', abrirAjustes);
  window.addEventListener('hashchange', rotear);
  const topo = $('.topo');
  window.addEventListener('scroll', () => topo.classList.toggle('rolou', window.scrollY > 4), { passive: true });
  matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', aplicarPrefs);
  await rotear();
}

iniciar();
