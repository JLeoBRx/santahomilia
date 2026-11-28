/**
 * Etapa 2: distribuição das homilias de São Gregório Magno no calendário.
 *
 * Lê dados/homilias/gregorio-magno/distribuicao.json (decisões editadas à mão) e:
 *   - confere cada correspondência bíblica com o arquivo de leituras do dia:
 *     referência, versículos em comum e força. Uma correspondência que não
 *     seja "plena" pelos critérios do próprio arquivo é RECUSADA (erro), e nada
 *     é gravado;
 *   - confere as correspondências litúrgicas com o santoral e o lecionário;
 *   - gera as entradas das 40 homilias em dados/homilias/indice.json (as de
 *     outras obras ficam como estão; notas editoriais são preservadas);
 *   - gera dados/homilias/DISTRIBUICAO.md: tabela das 40, classificação,
 *     datas em três anos litúrgicos (A, B, C), justificativas, correspondências
 *     recusadas e dúvidas.
 *
 * Uso:  node ferramentas/homilias/aplicar_distribuicao.mjs
 * O teste ferramentas/testes/homilias.test.mjs confere que o índice e o
 * relatório estão em dia com distribuicao.json.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { versiculos, intersecao, formatar } from './referencias.mjs';
import { descreverChave, evangelhosDaChave } from './lecionario.mjs';
import * as dados from '../../js/dados.js';
import { CalendarioLiturgico, datasDoAno, isoDeNumero } from '../../js/liturgical-calendar.js';
import * as LD from '../../js/leituras.js';
import * as HM from '../../js/homilias.js';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const ler = (p) => JSON.parse(fs.readFileSync(path.join(RAIZ, p), 'utf8'));
const ROM = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX',
  'XXI', 'XXII', 'XXIII', 'XXIV', 'XXV', 'XXVI', 'XXVII', 'XXVIII', 'XXIX', 'XXX', 'XXXI', 'XXXII', 'XXXIII', 'XXXIV', 'XXXV', 'XXXVI', 'XXXVII', 'XXXVIII', 'XXXIX', 'XL'];
const OBRA = 'gregorio-homiliae-in-evangelia';
const id = (n) => `gregorio-hom-${String(n).padStart(2, '0')}`;
const md = (s) => String(s ?? '').replace(/\|/g, '\\|').replace(/\n+/g, ' ');
const pct = (x) => `${Math.round(x * 100)}%`;
const NAO_FOI_PREGADA = 'A homilia não foi pregada para este dia: a ligação é a leitura do Evangelho.';

/** Força de uma correspondência bíblica, pelos limiares de distribuicao.json. */
export function medir(pericope, referencia, lim) {
  const P = versiculos(pericope), R = versiculos(referencia);
  const O = intersecao(P, R);
  const daHomilia = P.size ? O.size / P.size : 0;
  const doDia = R.size ? O.size / R.size : 0;
  const plena = daHomilia >= lim.cobre_a_homilia
    || (doDia >= lim.cobre_o_dia && (R.size >= lim.minimo_de_versiculos_do_dia || daHomilia >= lim.minimo_da_homilia_se_curto));
  return { P, R, O, daHomilia, doDia, forca: plena ? 'plena' : O.size >= 2 ? 'parcial' : 'nenhuma' };
}

/**
 * Nota sobre a ocasião mostrada na página da homilia (a rubrica da tradução
 * segue Migne): diz quando o lugar ou o dia vêm só do título de Migne.
 */
export function notaOcasiao(ccsl, migne) {
  const lugarCcsl = /\bin (basilica|cimiterio|fontes)\s+\w/.test(ccsl);
  const diaMigne = /(Dominica|Sabbato|Feria|feria|in crastino|in octavis|die natalis|die sancto|in die|Ascensione)/.test(migne);
  const diaCcsl = /\bdie\b/.test(ccsl);
  if (!lugarCcsl && diaMigne) return 'O lugar e o dia indicados no título constam só da edição de Migne; a edição crítica (CCSL 141) não os especifica.';
  if (diaMigne && !diaCcsl) return 'O dia indicado no título consta só da edição de Migne; a edição crítica (CCSL 141) indica apenas o lugar.';
  return null;
}

/** Texto mostrado no site para uma correspondência bíblica sem descrição própria. */
function descreverBiblica(pericope, ref, m) {
  let s;
  if (m.O.size === m.P.size && m.O.size === m.R.size) s = pericope === ref ? `Comenta o Evangelho deste dia: ${ref}.` : `Comenta ${pericope}, que corresponde ao Evangelho deste dia (${ref}).`;
  else if (m.O.size === m.R.size) s = `Comenta ${pericope}, passagem que inclui todo o Evangelho deste dia (${ref}).`;
  else if (m.O.size === m.P.size) s = `Comenta ${pericope}, parte do Evangelho deste dia (${ref}).`;
  else s = `Comenta ${pericope}; o Evangelho deste dia (${ref}) coincide com essa passagem em ${formatar(m.O)}.`;
  return `${s} ${NAO_FOI_PREGADA}`;
}

function nomeCelebracao(idc, SAN) {
  const f = SAN.fixas.find((x) => x.id === idc);
  if (f) return `${f.nome} (${f.data.split('-').reverse().join('/')})`;
  const m = SAN.moveis[idc];
  return m ? (m.nome || idc) : null;
}

// ---------------------------------------------------------------- geração
export async function gerarDistribuicao() {
  const DIST = ler('dados/homilias/gregorio-magno/distribuicao.json');
  const CAT = ler('dados/homilias/gregorio-magno/catalogo.json');
  const REG = ler('dados/homilias/gregorio-magno/registro-editorial.json');
  const IND = ler('dados/homilias/indice.json');
  const LDI = ler('dados/leituras/indice.json');
  const SAN = ler('dados/calendario/santoral.json');
  const lim = DIST.criterios.biblica_plena.limiares;
  const erros = [];
  const anteriores = new Map(IND.homilias.filter((h) => h.obra === OBRA).map((h) => [h.numero, h]));
  const colacao = new Map(REG.colacao.map((c) => [c.homilia, c]));
  const decisoes = new Map(DIST.homilias.map((d) => [d.numero, d]));
  const calculo = new Map(); // numero -> [{leituras, ref, medida}]

  const entradas = CAT.homilias.map((c) => {
    const n = c.numero;
    const d = decisoes.get(n);
    if (!d) { erros.push(`Homilia ${ROM[n]}: falta em distribuicao.json`); return null; }
    const ant = anteriores.get(n);
    const corr = [];
    for (const l of d.liturgicas || []) {
      if (l.celebracao) {
        const nome = nomeCelebracao(l.celebracao, SAN);
        if (!nome) erros.push(`Homilia ${ROM[n]}: celebração ${l.celebracao} não está no santoral`);
        corr.push({ tipo: 'liturgica', celebracao: l.celebracao, dia: nome, descricao: l.descricao });
      } else {
        for (const k of l.chaves || []) if (!LDI.conjuntos[k]) erros.push(`Homilia ${ROM[n]}: chave ${k} não existe no lecionário`);
        corr.push({ tipo: 'liturgica', chaves: l.chaves, dia: (l.chaves || []).map((k) => descreverChave(k, SAN)).join('; '), descricao: l.descricao });
      }
      if (!l.descricao || !l.fundamento) erros.push(`Homilia ${ROM[n]}: correspondência litúrgica sem descrição ou fundamento`);
    }
    const calc = [];
    for (const b of d.biblicas || []) {
      if (!LDI.conjuntos[b.leituras]) { erros.push(`Homilia ${ROM[n]}: leituras ${b.leituras} não existem`); continue; }
      // a seção "Evangelho" do arquivo que mais coincide com a passagem comentada
      const opcoes = evangelhosDaChave(LDI, b.leituras).map((ref) => ({ ref, m: medir(c.pericope, ref, lim) }))
        .sort((x, y) => y.m.O.size - x.m.O.size);
      const melhor = opcoes[0];
      if (!melhor || melhor.m.forca !== 'plena') {
        erros.push(`Homilia ${ROM[n]}: ${b.leituras} (${melhor ? melhor.ref : 'sem Evangelho'}) não é correspondência plena (${melhor ? `${pct(melhor.m.doDia)} do dia, ${pct(melhor.m.daHomilia)} da homilia` : '—'})`);
        continue;
      }
      calc.push({ leituras: b.leituras, ref: melhor.ref, m: melhor.m, outros: opcoes.length - 1 });
      corr.push({
        tipo: 'biblica', leituras: b.leituras, leitura: 'Evangelho', referencia_do_dia: melhor.ref, versiculos_comentados: formatar(melhor.m.O),
        dia: descreverChave(b.leituras, SAN), descricao: b.descricao || descreverBiblica(c.pericope, melhor.ref, melhor.m),
      });
    }
    calculo.set(n, calc);
    if (d.situacao === 'catalogo' ? corr.length || !d.motivo_catalogo : !corr.length) erros.push(`Homilia ${ROM[n]}: situação '${d.situacao}' incoerente com as correspondências`);
    if (ant && ant.rubrica_latina !== d.rubrica_ccsl) erros.push(`Homilia ${ROM[n]}: rubrica latina diverge da já publicada`);
    const ccsl = ant?.ccsl || `CCSL 141, p. ${(colacao.get(n)?.ccsl_paginas || c.ccsl_paginas).replace('-', '–')}`;
    return {
      id: id(n), obra: OBRA, numero: n, livro: c.livro, titulo: `Homilia ${ROM[n]}`, pericope: c.pericope,
      rubrica_latina: d.rubrica_ccsl, ccsl, arquivo: `homilias/gregorio-magno/revisada/homilia-${String(n).padStart(2, '0')}`,
      ...(notaOcasiao(d.rubrica_ccsl, d.rubrica_migne) ? { ocasiao_nota: notaOcasiao(d.rubrica_ccsl, d.rubrica_migne) } : {}),
      estado: d.estado || 'publicada', situacao: d.situacao,
      ...(d.situacao === 'catalogo' ? { motivo_catalogo: d.motivo_catalogo } : {}),
      ...(ant?.notas_editoriais ? { notas_editoriais: ant.notas_editoriais } : {}),
      correspondencias: corr,
    };
  });
  for (const d of DIST.homilias) if (!CAT.homilias.some((c) => c.numero === d.numero)) erros.push(`distribuicao.json: homilia ${d.numero} fora do catálogo`);
  if (erros.length) throw new Error('distribuição recusada:\n  - ' + erros.join('\n  - '));

  const outras = IND.homilias.filter((h) => h.obra !== OBRA);
  const indice = { ...IND, _leia: LEIA_INDICE, homilias: [...entradas, ...outras] };
  const datas = await datasNosAnos(indice, SAN);
  return { indice, md: relatorio(DIST, CAT, indice, calculo, datas, SAN) };
}

const LEIA_INDICE = [
  'Homilias dos santos no site. As entradas de São Gregório Magno e de Santo Antônio de Pádua são GERADAS por ferramentas/homilias/aplicar_distribuicao.mjs a partir de dados/homilias/gregorio-magno/distribuicao.json e dados/homilias/antonio/distribuicao.json (decisões e justificativas); não as edite aqui.',
  "estado: 'publicada' aparece no site; qualquer outro valor (ex.: 'suspensa') esconde a homilia sem apagar nada. 'previa' = preparada e não publicada: só aparece com a prévia ligada (endereço do site com ?previa), para conferência do responsável.",
  'ocasiao_nota: quando o lugar ou o dia da pregação (que a página mostra a partir do título da tradução, que segue Migne) não constam da edição crítica.',
  "situacao: 'calendario' (aparece na página do dia, nos dias das suas correspondências) ou 'catalogo' (só no catálogo geral, #/homilias, sem data litúrgica; motivo_catalogo diz por quê).",
  "correspondencias: 'liturgica' (pregada para esta celebração: 'celebracao' = id da celebração do dia, ou 'chaves' = chaves de leituras do dia do tempo) e 'biblica' (comenta a leitura proclamada: 'leituras' = chave de dados/liturgia-diaria/indice.json, 'leitura' = seção, 'referencia_do_dia' = referência exatamente como no arquivo de leituras, 'versiculos_comentados' = trecho comentado pela homilia que também é lido no dia). 'dia' = nome legível do dia ou da celebração. Correspondência só temática NUNCA entra aqui.",
  'arquivo: camada revisada (texto publicado), gerada a partir da tradução recebida e do registro editorial. Ver dados/homilias/LEIA-ME.md.',
  'Os testes (ferramentas/testes/homilias.test.mjs) conferem a integridade dos textos, as referências bíblicas e os dias em que cada homilia aparece.',
  'notas_editoriais: observações do editor sobre o texto (ex.: frase presente só em Migne), mostradas na página da homilia; o texto em si não muda.',
];

// ---------------------------------------------------------------- datas (pelo próprio mecanismo do site)
const ANOS_LITURGICOS = [2026, 2027, 2028]; // começam no 1º domingo do Advento destes anos: A, B, C
async function datasNosAnos(indice, SAN) {
  dados.definirCarregador(async (c) => { try { return fs.readFileSync(path.join(RAIZ, c), 'utf8'); } catch { return null; } });
  await LD.iniciar();
  const cal = new CalendarioLiturgico(SAN);
  const out = new Map(); // id -> [{ano, iso, op}]
  for (const a of ANOS_LITURGICOS) {
    const ini = datasDoAno(a).advento1, fim = datasDoAno(a + 1).advento1 - 1;
    for (let n = ini; n <= fim; n++) {
      const iso = isoDeNumero(n);
      const d = cal.dia(iso);
      for (const op of [null, ...d.opcoes.map((o) => o.id)]) {
        for (const { homilia: h } of HM.homiliasDoDia(LD.resolver(d, op), indice)) {
          if (!out.has(h.id)) out.set(h.id, []);
          const l = out.get(h.id);
          if (!l.some((x) => x.iso === iso)) l.push({ ano: a, iso, op: op ? d.opcoes.find((o) => o.id === op).nome : null, ciclo: cal.dia(isoDeNumero(datasDoAno(a).advento1)).cicloDominical });
        }
      }
    }
  }
  return out;
}
const dataCurta = (iso) => iso.split('-').reverse().join('/');

// ---------------------------------------------------------------- DISTRIBUICAO.md
function relatorio(DIST, CAT, indice, calculo, datas, SAN) {
  const H = indice.homilias.filter((h) => h.obra === OBRA);
  const dec = new Map(DIST.homilias.map((d) => [d.numero, d]));
  const L = [];
  const lit = H.filter((h) => h.correspondencias.some((c) => c.tipo === 'liturgica'));
  const noCal = H.filter((h) => h.situacao === 'calendario');
  const cat = H.filter((h) => h.situacao === 'catalogo');
  const nBib = H.reduce((s, h) => s + h.correspondencias.filter((c) => c.tipo === 'biblica').length, 0);
  const naoUsadas = DIST.homilias.flatMap((d) => (d.nao_usadas || []).map((x) => ({ ...x, numero: d.numero })));
  const duvidas = DIST.homilias.flatMap((d) => (d.duvidas || []).map((x) => ({ ...x, numero: d.numero })));
  const rotulos = (h) => HM.ondeAparece(h);
  const ciclos = (h) => {
    if (!h.correspondencias.length) return '—';
    const porCorr = h.correspondencias.map((c) => [...new Set([c.leituras, ...(c.chaves || [])].filter(Boolean).map((k) => (k.match(/-([ABC])$/) || [])[1]))]);
    const todoAno = porCorr.some((l) => !l.length || l.includes(undefined));
    const abc = [...new Set(porCorr.flat().filter(Boolean))].sort();
    if (abc.length === 3) return 'todo ano';
    return todoAno ? (abc.length ? `todo ano; mais no Ano ${abc.join(', ')}` : 'todo ano') : `Ano ${abc.join(', ')}`;
  };

  L.push('# Distribuição das homilias de São Gregório Magno no calendário (Etapa 2)', '');
  L.push('> Gerado por `ferramentas/homilias/aplicar_distribuicao.mjs` a partir de `dados/homilias/gregorio-magno/distribuicao.json`. Não edite à mão: altere as decisões no arquivo de distribuição e rode o script.', '');
  L.push('## Critérios', '');
  const C = DIST.criterios;
  L.push(`- **Correspondência litúrgica.** ${C.liturgica}`);
  L.push(`- **Correspondência bíblica plena.** ${C.biblica_plena.regra} ${C.biblica_plena.contagem}`);
  L.push(`- **Parcial.** ${C.parcial}`, `- **Paralela.** ${C.paralela}`, `- **Temática.** ${C.tematica}`, `- **Catálogo geral.** ${C.catalogo}`);
  L.push('- Toda correspondência bíblica aparece no site com o rótulo “Correspondência bíblica”, e as novas dizem expressamente que a homilia não foi pregada para aquele dia.', '');
  L.push('## Resumo', '', '| | Quantidade |', '|---|---|');
  L.push(`| Homilias no calendário (página do dia) | ${noCal.length} |`, `| Homilias só no catálogo geral | ${cat.length} (${cat.map((h) => ROM[h.numero]).join(', ')}) |`);
  L.push(`| Com correspondência litúrgica | ${lit.length} (${lit.map((h) => ROM[h.numero]).join(', ')}) |`);
  L.push(`| Correspondências bíblicas plenas publicadas | ${nBib} |`, `| Correspondências examinadas e não usadas | ${naoUsadas.length} |`, `| Dúvidas decididas pelo responsável | ${duvidas.filter((x) => x.decisao).length} |`, `| Dúvidas em aberto | ${duvidas.filter((x) => !x.decisao).length} |`, '');

  L.push('## As 40 homilias', '', 'Ocasião: rubrica da edição crítica (CCSL 141); entre parênteses, o dia que só o título de Migne indica. Anos: “todo ano” quando ao menos uma correspondência vale em todos os anos (festas, solenidades, dias de semana: o Evangelho dos dias de semana é o mesmo nos anos I e II); “Ano A/B/C” quando depende do ciclo dominical.', '');
  L.push('| Nº | Passagem | Ocasião | Classificação | Dias | Anos | Situação |', '|---|---|---|---|---|---|---|');
  for (const h of H) {
    const d = dec.get(h.numero);
    const tem = (t) => h.correspondencias.some((c) => c.tipo === t);
    const classe = tem('liturgica') && tem('biblica') ? 'litúrgica + bíblica' : tem('liturgica') ? 'litúrgica' : tem('biblica') ? 'bíblica' : 'sem correspondência suficiente';
    L.push(`| ${ROM[h.numero]} | ${h.pericope} | ${md(ocasiao(d))} | ${classe} | ${md(rotulos(h).join('; ') || '—')} | ${ciclos(h)} | ${h.situacao === 'catalogo' ? 'catálogo geral' : 'calendário'} |`);
  }
  L.push('');

  L.push('## Homilias ligadas a mais de uma celebração ou ciclo', '');
  for (const h of H.filter((x) => rotulos(x).length > 1)) L.push(`- **${ROM[h.numero]}** (${h.pericope}): ${rotulos(h).join('; ')}.`);
  L.push('');
  L.push('## Homilias sem correspondência adequada (só no catálogo geral)', '');
  for (const h of cat) L.push(`- **${ROM[h.numero]}** (${h.pericope}): ${h.motivo_catalogo}`);
  L.push('');

  L.push('## As 8 candidatas fortes da Etapa 1', '', '| Nº | Resultado da verificação |', '|---|---|');
  for (const d of DIST.homilias.filter((x) => x.candidata_forte_etapa_1)) L.push(`| ${ROM[d.numero]} | ${md(d.justificativa)} |`);
  L.push('');

  L.push('## Ocasiões antigas não convertidas em celebrações atuais', '', 'Datas que constam só nos títulos de Migne, ou celebrações do século VI que mudaram ou deixaram de existir. Nenhuma foi usada.', '');
  for (const x of naoUsadas.filter((y) => y.classe === 'ocasiao-antiga' || y.classe === 'fora-do-calendario')) L.push(`- **${ROM[x.numero]}** — ${md(x.alvo)}: ${x.motivo}`);
  L.push('');

  L.push('## Dúvidas em aberto', '');
  const abertas = duvidas.filter((x) => !x.decisao);
  if (!abertas.length) L.push('Nenhuma.');
  for (const x of abertas) L.push(`- **Homilia ${ROM[x.numero]}.** ${x.questao} *Opção adotada por ora:* ${x.opcao_adotada}`);
  L.push('');
  const decididas = duvidas.filter((x) => x.decisao);
  if (decididas.length) {
    L.push('## Decisões do responsável', '');
    for (const x of decididas) L.push(`- **Homilia ${ROM[x.numero]}** (${x.decisao.data.split('-').reverse().join('/')}, alternativa ${x.decisao.escolha}). ${x.questao} **Decisão:** ${x.decisao.texto}`);
    L.push('');
  }

  if (DIST.lecionario?.length) {
    L.push('## Problemas encontrados nos dados das leituras', '');
    for (const x of DIST.lecionario) L.push(`- **${x.estado}.** ${x.descricao}`);
    L.push('');
  }

  L.push('## Detalhe por homilia', '');
  const cicloDe = new Map([...datas.values()].flat().map((x) => [x.ano, x.ciclo]));
  const anos = ANOS_LITURGICOS.map((a) => `${a}–${a + 1}${cicloDe.has(a) ? ` (Ano ${cicloDe.get(a)})` : ''}`).join(', ');
  for (const h of H) {
    const d = dec.get(h.numero);
    L.push(`### Homilia ${ROM[h.numero]} — ${h.pericope}`, '');
    L.push(`- **Rubrica (CCSL 141):** *${d.rubrica_ccsl}*`, `- **Título em Migne:** *${d.rubrica_migne}*`);
    if (d.ocasiao_no_texto) L.push(`- **No texto:** ${d.ocasiao_no_texto}`);
    L.push(`- **Situação:** ${h.situacao === 'catalogo' ? 'só no catálogo geral' : 'no calendário'}. ${d.justificativa}`);
    if (h.situacao === 'catalogo') L.push(`- **Por que fica sem data:** ${h.motivo_catalogo}`);
    for (const c of h.correspondencias.filter((x) => x.tipo === 'liturgica')) L.push(`- **Litúrgica — ${c.dia}:** ${c.descricao} *(fundamento: ${(d.liturgicas.find((l) => (l.celebracao && l.celebracao === c.celebracao) || (l.chaves && l.chaves.join() === (c.chaves || []).join())) || {}).fundamento})*`);
    const calc = calculo.get(h.numero) || [];
    if (calc.length) {
      L.push('', '| Correspondência bíblica | Evangelho do dia | Em comum | Do dia | Da homilia |', '|---|---|---|---|---|');
      for (const x of calc) L.push(`| ${md(descreverChave(x.leituras, SAN))} | ${x.ref}${x.outros ? ` (o arquivo traz mais ${x.outros} Evangelho${x.outros > 1 ? 's' : ''})` : ''} | ${formatar(x.m.O)} | ${pct(x.m.doDia)} | ${pct(x.m.daHomilia)} |`);
      L.push('');
    }
    const nu = d.nao_usadas || [];
    if (nu.length) { L.push('Examinadas e não usadas:', ''); for (const x of nu) L.push(`- *${x.classe}* — ${md(x.alvo)}: ${x.motivo}`); L.push(''); }
    for (const x of d.duvidas || []) L.push(x.decisao ? `**Decisão do responsável (${x.decisao.data.split('-').reverse().join('/')}):** ${x.decisao.texto}` : `**Dúvida:** ${x.questao} *Por ora:* ${x.opcao_adotada}`, '');
    const ds = datas.get(h.id) || [];
    L.push(`**Datas nos anos litúrgicos ${anos}:** ${ds.length ? ANOS_LITURGICOS.map((a) => { const l = ds.filter((x) => x.ano === a); return l.length ? `${a}–${a + 1}: ${l.map((x) => `${dataCurta(x.iso)}${x.op ? ` (se escolhida a memória de ${x.op})` : ''}`).join(', ')}` : null; }).filter(Boolean).join('; ') : 'nenhuma (catálogo geral).'}`, '');
  }
  return L.join('\n');
}

function ocasiao(d) {
  const lugar = d.rubrica_ccsl.replace(/^Homilia lectionis eiusdem\s+/, '').replace(/\.$/, '');
  const extra = d.rubrica_migne.match(/(Dominica.+|Sabbato.+|Feria.+|feria.+|in crastino.+|in octavis.+)$/);
  return `${lugar}${extra ? ` (Migne: ${extra[1].replace(/\.$/, '')})` : ''}`;
}

// ================================================================ Santo Antônio de Pádua
// dados/homilias/antonio/distribuicao.json -> entradas 'antonio-*' do índice e antonio/DISTRIBUICAO.md.
// Mesmos critérios de São Gregório (D1), aplicados ao trecho que o sermão comenta; a seção
// comparada é a leitura que o sermão comenta (Evangelho, ou 1ª/2ª leitura: D3).
export const OBRA_ANTONIO = 'antonio-sermones';
const AUTOR_ANTONIO = 'antonio-de-padua';
const idAntonio = (cod) => `antonio-${cod}`;
const NAO_FOI_PREGADO = 'O sermão não foi pregado para este dia: a ligação é a leitura.';
const NOME_SECAO = { Evangelho: 'o Evangelho', 'Primeira leitura': 'a 1ª leitura', 'Segunda leitura': 'a 2ª leitura' };

/** Leituras de uma seção ("Evangelho", "Primeira leitura"…) num conjunto de leituras. */
export function leiturasDaSecao(LDI, chave, secao) {
  return (LDI.conjuntos[chave] || []).flat().filter(([s, ref]) => s === secao && ref).map(([, ref]) => ref);
}
/** Qual regra da correspondência plena foi satisfeita: (a) ou (b). */
export function criterioPleno(m, lim) {
  if (m.daHomilia >= lim.cobre_a_homilia) return '(a) ao menos 90% do trecho comentado é lido no dia';
  if (m.doDia >= lim.cobre_o_dia && m.R.size >= lim.minimo_de_versiculos_do_dia) return '(b) ao menos 90% da leitura do dia está no trecho comentado, e ela tem 5 versículos ou mais';
  return '(b) ao menos 90% da leitura do dia está no trecho comentado, e ela cobre ao menos metade do trecho';
}
function descreverBiblicaAntonio(trecho, ref, m, secao) {
  const l = NOME_SECAO[secao] || 'a leitura';
  let s;
  if (m.O.size === m.P.size && m.O.size === m.R.size) s = trecho === ref ? `Comenta ${l} deste dia: ${ref}.` : `Comenta ${trecho}, que corresponde a ${l} deste dia (${ref}).`;
  else if (m.O.size === m.R.size) s = `Comenta ${trecho}, trecho que inclui ${l} deste dia por inteiro (${ref}).`;
  else if (m.O.size === m.P.size) s = `Comenta ${trecho}, parte d${l.slice(0, 1) === 'o' ? 'o' : 'a'} ${l.slice(2)} deste dia (${ref}).`;
  else s = `Comenta ${trecho}; ${l} deste dia (${ref}) coincide com esse trecho em ${formatar(m.O)}.`;
  return `${s} ${NAO_FOI_PREGADO}`;
}
/** Marca de cada bloco da camada recebida (índice contado de 0, sem o cabeçalho): '@paragrafo 7' -> 7, '@temas' -> 'temas'. */
function marcasDosBlocos(cod) {
  const t = fs.readFileSync(path.join(RAIZ, 'dados', 'homilias', 'antonio', 'recebida', `${cod}.txt`), 'utf8').replace(/\n+$/, '');
  const partes = t.split('\n\n');
  let i = 0;
  while (i < partes.length && /^@/.test(partes[i]) && !/^@(titulo|titulo-latino|secao|temas|paragrafo|lacuna)\b/.test(partes[i])) i++;
  return partes.slice(i).map((p) => {
    const m = p.match(/^@(paragrafo|lacuna) (\d+)/);
    if (m) return +m[2];
    return /^@temas/.test(p) ? 'temas' : null;
  });
}
/** Avisos (traduções próprias) e notas (fora do corpo do texto) do registro editorial, para a página do sermão. */
function avisosENotas(REG, cod) {
  const marcas = marcasDosBlocos(cod);
  const onde = (r) => (r.paragrafo != null ? r.paragrafo : marcas[r.bloco] ?? null);
  const avisos = [], notas = [];
  for (const r of REG.registros.filter((x) => x.sermao === cod && x.estado === 'aplicada')) {
    if (r.aviso) avisos.push({ paragrafo: onde(r), registro: r.id, localizacao: r.localizacao, texto: r.aviso });
    if (r.nota_do_tradutor) notas.push({ paragrafo: onde(r), registro: r.id, tipo: 'Nota do tradutor (Lírio Católico)', texto: r.nota_do_tradutor });
    if (r.nota_editorial) notas.push({ paragrafo: onde(r), registro: r.id, tipo: 'Nota editorial', texto: r.nota_editorial });
    if (r.nota) notas.push({ paragrafo: onde(r), registro: r.id, tipo: r.nota.aviso, texto: `${r.nota.texto} (${r.nota.procedencia})` });
  }
  return { avisos, notas };
}

/**
 * Rótulo do dia de uma correspondência bíblica de Santo Antônio, para o catálogo.
 * Usa o nome da celebração no santoral (o mesmo das litúrgicas, para que o catálogo
 * junte "Domingo de Pentecostes" litúrgico e bíblico numa só menção) e indica o ano
 * quando a chave tem ciclo ("santo:transfiguracao-A" -> "…, Ano A"). A variante
 * "-domingo" (festa que cai no domingo, com 2ª leitura) é o mesmo dia da festa.
 * Só para Santo Antônio: os rótulos de Gregório continuam os de descreverChave.
 */
function descreverChaveAntonio(k, SAN) {
  const m = k.match(/^(santo:)?([A-Za-z]+?)(?:-([ABC]))?(-domingo)?$/);
  if (m) {
    const ehCelebracao = m[1] ? SAN.fixas.some((x) => x.id === m[2]) || !!SAN.moveis[m[2]] : !!SAN.moveis[m[2]];
    const nome = ehCelebracao ? nomeCelebracao(m[2], SAN) : null;
    if (nome) return m[3] ? `${nome}, Ano ${m[3]}` : nome;
  }
  return descreverChave(k, SAN);
}

export async function gerarDistribuicaoAntonio(indiceBase) {
  const DIST = ler('dados/homilias/antonio/distribuicao.json');
  const CAT = ler('dados/homilias/antonio/catalogo.json');
  const REG = ler('dados/homilias/antonio/registro-editorial.json');
  const LDI = ler('dados/leituras/indice.json');
  const SAN = ler('dados/calendario/santoral.json');
  const lim = DIST.criterios.biblica_plena.limiares;
  const erros = [];
  const decisoes = new Map(DIST.sermoes.map((s) => [s.codigo, s]));
  const calculo = new Map(); // codigo -> [{leituras, secao, ref, m, criterio}]
  const estado = DIST.estado_da_publicacao === 'publicada' ? 'publicada' : 'previa';

  const entradas = CAT.itens.map((it) => {
    const cod = it.codigo;
    const s = decisoes.get(cod);
    if (!s) { erros.push(`${cod}: falta em distribuicao.json`); return null; }
    if (s.titulo_historico !== it.titulo) erros.push(`${cod}: o título histórico (“${s.titulo_historico}”) não é o do catálogo (“${it.titulo}”)`);
    const corr = [];
    for (const l of s.liturgicas || []) {
      const nome = nomeCelebracao(l.celebracao, SAN);
      if (!nome) erros.push(`${cod}: celebração ${l.celebracao} não está no santoral`);
      if (!l.descricao || !l.fundamento) erros.push(`${cod}: correspondência litúrgica sem descrição ou fundamento`);
      corr.push({ tipo: 'liturgica', celebracao: l.celebracao, dia: nome, descricao: l.descricao, ...(l.observacao_historica ? { observacao_historica: l.observacao_historica } : {}) });
    }
    const calc = [];
    const secao = s.leitura_comentada || 'Evangelho';
    if ((s.biblicas || []).length && !s.trecho_comentado) erros.push(`${cod}: correspondência bíblica sem trecho comentado (D2)`);
    for (const b of s.biblicas || []) {
      if (!LDI.conjuntos[b.leituras]) { erros.push(`${cod}: leituras ${b.leituras} não existem`); continue; }
      const sec = b.leitura || secao;
      const opcoes = leiturasDaSecao(LDI, b.leituras, sec).map((ref) => ({ ref, m: medir(s.trecho_comentado, ref, lim) })).sort((x, y) => y.m.O.size - x.m.O.size);
      const melhor = opcoes[0];
      if (!melhor || melhor.m.forca !== 'plena') {
        erros.push(`${cod}: ${b.leituras} (${melhor ? melhor.ref : `sem ${sec}`}) não é correspondência plena (${melhor ? `${pct(melhor.m.doDia)} do dia, ${pct(melhor.m.daHomilia)} do trecho` : '—'})`);
        continue;
      }
      const criterio = criterioPleno(melhor.m, lim);
      calc.push({ leituras: b.leituras, secao: sec, ref: melhor.ref, m: melhor.m, criterio, outros: opcoes.length - 1 });
      corr.push({
        tipo: 'biblica', leituras: b.leituras, leitura: sec, referencia_do_dia: melhor.ref, versiculos_comentados: formatar(melhor.m.O),
        versiculos_em_comum: melhor.m.O.size, cobertura_do_trecho: Math.round(melhor.m.daHomilia * 100), cobertura_do_dia: Math.round(melhor.m.doDia * 100), criterio,
        dia: descreverChaveAntonio(b.leituras, SAN), descricao: b.descricao || descreverBiblicaAntonio(s.trecho_comentado, melhor.ref, melhor.m, sec),
      });
    }
    calculo.set(cod, calc);
    if (s.situacao === 'catalogo' ? corr.length || !s.motivo_catalogo : !corr.length) erros.push(`${cod}: situação '${s.situacao}' incoerente com as correspondências`);
    const { avisos, notas } = avisosENotas(REG, cod);
    return {
      id: idAntonio(cod), obra: OBRA_ANTONIO, numero: it.ordem, codigo: cod,
      titulo: s.titulo_historico, titulo_latino: s.titulo_latino, colecao: it.colecao,
      ...(it.lirio?.rotulo ? { rotulo: it.lirio.rotulo } : {}),
      pericope: s.trecho_comentado || null, leitura_do_dia: s.leitura_do_dia || null, leitura_comentada: s.tipo === 'sermao' ? secao : null,
      ...(s.reducao ? { reducao: s.reducao } : {}), ...(s.sem_trecho ? { sem_trecho: s.sem_trecho } : {}),
      ocasiao: s.ocasiao || null,
      arquivo: `homilias/antonio/revisada/${cod}`,
      estado: s.estado || estado, situacao: s.situacao,
      ...(s.situacao === 'catalogo' ? { motivo_catalogo: s.motivo_catalogo } : {}),
      avisos, notas,
      correspondencias: corr,
    };
  });
  for (const s of DIST.sermoes) if (!CAT.itens.some((it) => it.codigo === s.codigo)) erros.push(`distribuicao.json: ${s.codigo} fora do catálogo`);
  if (erros.length) throw new Error('distribuição de Santo Antônio recusada:\n  - ' + erros.join('\n  - '));

  // autor e obra (dados vindos do registro editorial, para não divergirem dele)
  const P = REG.procedencia;
  const autores = { ...indiceBase.autores, [AUTOR_ANTONIO]: { nome: 'Santo Antônio de Pádua', titulo: 'Presbítero e Doutor da Igreja', datas: '1195–1231', memoria: '13 de junho' } };
  const obras = {
    ...indiceBase.obras,
    [OBRA_ANTONIO]: {
      autor: AUTOR_ANTONIO, titulo: 'Sermões dominicais e festivos', titulo_latino: 'Sermones dominicales et festivi',
      // para a página pública, sem os caminhos de pastas internas do projeto (que ficam no registro)
      edicao_critica: `${P.latim.edicao.replace(/\.$/, '')}. ${P.latim.consulta.replace(/\s*Cópia enviada pelo responsável:.*$/s, '')}`,
      diretriz_latim: P.latim.diretriz.replace(/\s*\(Homilia dos Santos\/[^)]*\)/, ''),
      traducao: { credito: P.traducao_recebida.credito, fonte: P.traducao_recebida.fonte, metodo_declarado: P.traducao_recebida.metodo_declarado, nota_editorial: P.traducao_recebida.nota_editorial },
      etapa_1: REG.etapas.etapa_1.ressalva,
    },
  };
  const homilias = [...indiceBase.homilias.filter((h) => h.obra !== OBRA_ANTONIO), ...entradas];
  const indice = { ...indiceBase, autores, obras, homilias };
  HM.definirPrevia(true);
  const datas = await datasNosAnos(indice, SAN);
  HM.definirPrevia(false);
  return { indice, md: relatorioAntonio(DIST, CAT, indice, calculo, datas, SAN) };
}

function relatorioAntonio(DIST, CAT, indice, calculo, datas, SAN) {
  const H = indice.homilias.filter((h) => h.obra === OBRA_ANTONIO);
  const dec = new Map(DIST.sermoes.map((s) => [s.codigo, s]));
  const L = [];
  const noCal = H.filter((h) => h.situacao === 'calendario'), cat = H.filter((h) => h.situacao === 'catalogo');
  const lits = H.flatMap((h) => h.correspondencias.filter((c) => c.tipo === 'liturgica').map((c) => ({ h, c })));
  const bibs = H.flatMap((h) => h.correspondencias.filter((c) => c.tipo === 'biblica').map((c) => ({ h, c })));
  const domingos = bibs.filter(({ c }) => /-domingo-[ABC]$/.test(c.leituras) && !c.leituras.startsWith('santo:'));
  const festasNoDomingo = bibs.filter(({ c }) => c.leituras.startsWith('santo:') && /-domingo/.test(c.leituras));
  const naoUsadas = DIST.sermoes.flatMap((s) => (s.nao_usadas || []).map((x) => ({ ...x, codigo: s.codigo })));
  const porClasse = (k) => naoUsadas.filter((x) => x.classe === k).length;
  const rot = (h) => HM.ondeAparece(h);
  const ciclos = (h) => {
    if (!h.correspondencias.length) return '—';
    const porCorr = h.correspondencias.map((c) => [...new Set([c.leituras].filter(Boolean).map((k) => (k.match(/-([ABC])(-domingo)?$/) || [])[1]))]);
    const todoAno = h.correspondencias.some((c) => c.tipo === 'liturgica') || porCorr.some((l) => !l.length || l.includes(undefined));
    const abc = [...new Set(porCorr.flat().filter(Boolean))].sort();
    if (abc.length === 3) return 'todo ano';
    return todoAno ? (abc.length ? `todo ano; mais no Ano ${abc.join(', ')}` : 'todo ano') : `Ano ${abc.join(', ')}`;
  };
  L.push('# Distribuição dos sermões de Santo Antônio no calendário (Etapa 2)', '');
  L.push('> Gerado por `ferramentas/homilias/aplicar_distribuicao.mjs` a partir de `dados/homilias/antonio/distribuicao.json`. Não edite à mão: altere as decisões no arquivo de distribuição e rode o script.', '');
  L.push(`> **Estado: ${DIST.estado_da_publicacao === 'publicada' ? `publicado em ${DIST.publicacao.data.split('-').reverse().join('/')}.` : 'PRÉVIA, não publicado.'}** ${DIST.estado_da_publicacao === 'publicada' ? `${DIST.publicacao.aprovacao} ${DIST.publicacao.fora_da_publicacao}` : 'As entradas do índice têm estado “previa”: o site não as mostra; só aparecem com a prévia ligada (endereço com ?previa), para a conferência do responsável. A publicação depende da sua aprovação expressa.'}`, '');
  L.push(`Auditoria que fundamenta esta distribuição: ${DIST.auditoria}`, '');
  L.push('## Critérios', '');
  const C = DIST.criterios;
  L.push(`- **Correspondência litúrgica.** ${C.liturgica}`, `- **Correspondência bíblica plena.** ${C.biblica_plena.regra} ${C.biblica_plena.contagem}`, `- **Trecho comentado.** ${C.trecho_comentado}`);
  L.push(`- **Parcial.** ${C.parcial}`, `- **Paralela.** ${C.paralela}`, `- **Temática.** ${C.tematica}`, `- **Catálogo geral.** ${C.catalogo}`, `- **Vários sermões no mesmo dia.** ${C.varios_no_mesmo_dia}`, '');
  L.push('## Decisões do responsável (D1–D8)', '');
  for (const d of DIST.decisoes) L.push(`- **${d.id}** (${d.data.split('-').reverse().join('/')}) — ${d.questao} ${d.decisao} *Aplicação:* ${d.aplicacao}`);
  L.push('');
  L.push('## Resumo', '', '| | Quantidade |', '|---|---|');
  L.push(`| Itens no calendário (página do dia) | ${noCal.length} |`, `| Itens só no catálogo geral | ${cat.length} (${cat.map((h) => h.codigo).join(', ')}) |`);
  L.push(`| Correspondências litúrgicas registradas | ${lits.length} (em ${new Set(lits.map((x) => x.h.codigo)).size} sermões) |`);
  L.push(`| Correspondências bíblicas plenas registradas | ${bibs.length} (em ${new Set(bibs.map((x) => x.h.codigo)).size} sermões); ${domingos.length} em domingos do Tempo (ciclos A, B ou C) e ${festasNoDomingo.length} em festas quando caem no domingo |`);
  L.push(`| Correspondências examinadas e recusadas | ${naoUsadas.length} (ocasião antiga ${porClasse('ocasiao-antiga')}, parcial ${porClasse('parcial')}, paralela ${porClasse('paralela')}, fora do calendário ${porClasse('fora-do-calendario')}) |`, '');
  L.push('## Os 85 itens', '', 'Título: o histórico, como na tradição (nunca o nome atual da celebração). Anos: “todo ano” quando ao menos uma correspondência vale em todos os anos (celebrações e dias de semana: o Evangelho dos dias de semana é o mesmo nos anos I e II); “Ano A/B/C” quando depende do ciclo dominical.', '');
  L.push('| Código | Título histórico | Trecho comentado | Classificação | Dias | Anos | Situação |', '|---|---|---|---|---|---|---|');
  for (const h of H) {
    const tem = (t) => h.correspondencias.some((c) => c.tipo === t);
    const classe = tem('liturgica') && tem('biblica') ? 'litúrgica + bíblica' : tem('liturgica') ? 'litúrgica' : tem('biblica') ? 'bíblica' : '—';
    L.push(`| ${h.codigo} | ${md(h.titulo)} | ${h.pericope || '—'}${h.reducao ? ' (reduzido)' : ''} | ${classe} | ${md(rot(h).join('; ') || '—')} | ${ciclos(h)} | ${h.situacao === 'catalogo' ? 'catálogo geral' : 'calendário'} |`);
  }
  L.push('');
  L.push('## Auditoria individual das correspondências litúrgicas', '', '| Sermão | Celebração atual | Fundamento | Texto mostrado no site | Observação histórica |', '|---|---|---|---|---|');
  for (const { h, c } of lits) {
    const l = (dec.get(h.codigo).liturgicas || []).find((x) => x.celebracao === c.celebracao) || {};
    L.push(`| ${h.codigo} · ${md(h.titulo)} | ${md(c.dia)} | ${md(l.fundamento)} | ${md(c.descricao)} | ${md(c.observacao_historica || '—')} |`);
  }
  L.push('');
  L.push('## Auditoria individual das correspondências bíblicas', '', 'Cada linha foi recalculada pelo script a partir do índice das leituras; uma correspondência que não satisfizesse a regra seria recusada e nada seria gravado.', '');
  L.push('| Sermão | Trecho comentado | Dia | Leitura do dia | Versículos em comum | Do trecho | Do dia | Critério | Resultado |', '|---|---|---|---|---|---|---|---|---|');
  for (const h of H) {
    for (const x of calculo.get(h.codigo) || []) {
      L.push(`| ${h.codigo} | ${h.pericope} | ${md(descreverChave(x.leituras, SAN))} (\`${x.leituras}\`) | ${x.secao}: ${x.ref}${x.outros ? ` (o arquivo traz mais ${x.outros})` : ''} | ${formatar(x.m.O)} (${x.m.O.size}) | ${pct(x.m.daHomilia)} | ${pct(x.m.doDia)} | ${x.criterio} | plena: aceita |`);
    }
  }
  L.push('');
  L.push('## Trechos reduzidos e sermões sem trecho comentado (D2)', '');
  for (const h of H.filter((x) => x.reducao)) L.push(`- **${h.codigo}** (leitura do dia: ${h.leitura_do_dia}; trecho usado: ${h.pericope}): ${h.reducao}`);
  for (const h of H.filter((x) => x.sem_trecho)) L.push(`- **${h.codigo}** (leitura do dia: ${h.leitura_do_dia}): ${h.sem_trecho}`);
  L.push('');
  L.push('## Só no catálogo geral (D7)', '');
  for (const h of cat) L.push(`- **${h.codigo} · ${h.titulo}**: ${h.motivo_catalogo}`);
  L.push('');
  // dias com mais de um sermão (nos três anos calculados)
  const porDia = new Map();
  for (const h of H) for (const d of datas.get(h.id) || []) { if (!porDia.has(d.iso)) porDia.set(d.iso, []); porDia.get(d.iso).push(h.codigo); }
  const multi = [...porDia].filter(([, l]) => l.length > 1).sort();
  L.push('## Dias com mais de um sermão (D5)', '', 'Nos três anos litúrgicos calculados. A página do dia mostra todos: primeiro os pregados para a celebração, depois os associados pela leitura.', '');
  for (const [iso, l] of multi) L.push(`- ${dataCurta(iso)}: ${l.join(', ')}`);
  L.push('');
  L.push('## Correspondências examinadas e recusadas', '');
  for (const s of DIST.sermoes.filter((x) => (x.nao_usadas || []).length)) L.push(`- **${s.codigo}**: ${s.nao_usadas.map((x) => `*${x.classe}* — ${md(x.alvo)}: ${x.motivo}`).join(' · ')}`);
  L.push('');
  if (DIST.lecionario?.length) {
    L.push('## Problemas encontrados nos dados das leituras', '');
    for (const x of DIST.lecionario) L.push(`- **${x.estado}.** ${x.descricao}`);
    L.push('');
  }
  const cicloDe = new Map([...datas.values()].flat().map((x) => [x.ano, x.ciclo]));
  const anos = ANOS_LITURGICOS.map((a) => `${a}–${a + 1}${cicloDe.has(a) ? ` (Ano ${cicloDe.get(a)})` : ''}`).join(', ');
  L.push(`## Datas nos anos litúrgicos ${anos}`, '', DIST.estado_da_publicacao === 'publicada' ? 'Calculadas pelo próprio mecanismo do site.' : 'Calculadas pelo próprio mecanismo do site, com a prévia ligada.', '');
  for (const h of H) {
    const ds = datas.get(h.id) || [];
    L.push(`- **${h.codigo} · ${h.titulo}:** ${ds.length ? ANOS_LITURGICOS.map((a) => { const l = ds.filter((x) => x.ano === a); return l.length ? `${a}–${a + 1}: ${l.map((x) => `${dataCurta(x.iso)}${x.op ? ` (se escolhida a memória de ${x.op})` : ''}`).join(', ')}` : null; }).filter(Boolean).join('; ') : 'nenhuma (catálogo geral).'}`);
  }
  L.push('');
  return L.join('\n');
}

// ---------------------------------------------------------------- CLI
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const r = await gerarDistribuicao();
  const ra = await gerarDistribuicaoAntonio(r.indice);
  fs.writeFileSync(path.join(RAIZ, 'dados', 'homilias', 'indice.json'), JSON.stringify(ra.indice, null, 2));
  fs.writeFileSync(path.join(RAIZ, 'dados', 'homilias', 'DISTRIBUICAO.md'), r.md);
  fs.writeFileSync(path.join(RAIZ, 'dados', 'homilias', 'antonio', 'DISTRIBUICAO.md'), ra.md);
  const H = ra.indice.homilias.filter((h) => h.obra === OBRA);
  console.log(`gerados: indice.json (${H.length} homilias; ${H.filter((h) => h.situacao === 'calendario').length} no calendário, ${H.filter((h) => h.situacao === 'catalogo').length} só no catálogo) e DISTRIBUICAO.md`);
  const A = ra.indice.homilias.filter((h) => h.obra === OBRA_ANTONIO);
  console.log(`Santo Antônio: ${A.length} itens (${A.filter((h) => h.situacao === 'calendario').length} no calendário, ${A.filter((h) => h.situacao === 'catalogo').length} só no catálogo), estado ${[...new Set(A.map((h) => h.estado))].join('/')}; antonio/DISTRIBUICAO.md`);
}
