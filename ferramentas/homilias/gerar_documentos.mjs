/**
 * Gera, a partir dos dados (nunca à mão):
 *   dados/homilias/inventario.json   inventário das homilias (para máquinas)
 *   dados/homilias/INVENTARIO.md     inventário legível
 *   dados/homilias/AUDITORIA.md      auditoria das traduções (todas as decisões)
 *   dados/homilias/antonio/AUDITORIA.md  auditoria da tradução dos sermões de Santo Antônio
 *
 * Uso:  node ferramentas/homilias/gerar_documentos.mjs
 * O teste ferramentas/testes/homilias.test.mjs confere que estes arquivos
 * estão em dia com os dados (se não estiverem, rode este script).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { versiculos, intersecao } from './referencias.mjs';
import { descreverChave, evangelhosDoLecionario } from './lecionario.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const ler = (p) => JSON.parse(fs.readFileSync(path.join(RAIZ, p), 'utf8'));
const ROM = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX',
  'XXI', 'XXII', 'XXIII', 'XXIV', 'XXV', 'XXVI', 'XXVII', 'XXVIII', 'XXIX', 'XXX', 'XXXI', 'XXXII', 'XXXIII', 'XXXIV', 'XXXV', 'XXXVI', 'XXXVII', 'XXXVIII', 'XXXIX', 'XL'];
const md = (s) => String(s ?? '').replace(/\|/g, '\\|').replace(/\n+/g, ' ');

/** Correspondências bíblicas candidatas de uma perícope (ainda não verificadas). */
function candidatas(pericope, evangelhos, santoral) {
  const P = versiculos(pericope);
  const vistos = new Set(), out = [];
  for (const { chave, ref } of evangelhos) {
    const R = versiculos(ref);
    const O = intersecao(P, R);
    if (O.size < 3 || vistos.has(chave + ref)) continue;
    const doDia = O.size / R.size, daHomilia = O.size / P.size;
    if (doDia < 0.5 && daHomilia < 0.5) continue;
    vistos.add(chave + ref);
    out.push({ chave, dia: descreverChave(chave, santoral), referencia_do_dia: ref, versiculos_em_comum: O.size, cobre_o_evangelho_do_dia: Math.round(doDia * 100), cobre_a_homilia: Math.round(daHomilia * 100) });
  }
  return out.sort((a, b) => (b.cobre_o_evangelho_do_dia + b.cobre_a_homilia) - (a.cobre_o_evangelho_do_dia + a.cobre_a_homilia) || a.dia.localeCompare(b.dia));
}

// ---------------------------------------------------------------- Vianney e Antônio
// Correspondência litúrgica PROVÁVEL pelo título (não verificada): ocasião que existe no calendário atual.
const VIANNEY_OCASIOES = [
  [/JOUR DE NOËL/, 'Natal do Senhor (25/12)'], [/^EPIPHANIE/, 'Epifania do Senhor'], [/MERCREDI DES CENDRES/, 'Quarta-feira de Cinzas'],
  [/PREMIER DIMANCHE DE CARÊME/, '1º Domingo da Quaresma'], [/QUASIMODO/, '2º Domingo da Páscoa (oitava)'],
  [/DIMANCHE DE L'AVENT/, 'Domingo do Advento (numeração tridentina; o Evangelho difere do atual)'],
  [/SAINT JEAN-BAPTISTE/, 'Natividade de São João Batista (24/6)'], [/ASSOMPTION/, 'Assunção de Nossa Senhora'],
  [/NATIVITÉ DE LA STE VIERGE/, 'Natividade de Nossa Senhora (8/9)'], [/SAINT ROSAIRE/, 'Nossa Senhora do Rosário (7/10)'],
  [/ANGES GARDIENS/, 'Santos Anjos da Guarda (2/10)'], [/TOUS LES SAINTS/, 'Todos os Santos'], [/MORTS/, 'Fiéis Defuntos (2/11)'],
  [/DÉDICACE/, 'Dedicação de uma igreja (data local)'],
];
const ocasiaoAtual = (tabela, titulo) => (tabela.find(([re]) => re.test(titulo || '')) || [])[1] || null;

// ---------------------------------------------------------------- geração
export function gerar() {
  const IND = ler('dados/homilias/indice.json');
  const REG = ler('dados/homilias/gregorio-magno/registro-editorial.json');
  const CAT = ler('dados/homilias/gregorio-magno/catalogo.json');
  const VIA = ler('dados/homilias/vianney/sumario.json');
  const ACAT = ler('dados/homilias/antonio/catalogo.json');
  const AREG = ler('dados/homilias/antonio/registro-editorial.json');
  const LDI = ler('dados/leituras/indice.json');
  const SAN = ler('dados/calendario/santoral.json');
  const evangelhos = evangelhosDoLecionario(LDI);
  const publicadas = new Map(IND.homilias.filter((h) => h.obra === 'gregorio-homiliae-in-evangelia' && h.estado === 'publicada').map((h) => [h.numero, h]));
  const colacao = new Set(REG.colacao.map((c) => c.homilia));
  const rubrica = (n) => {
    const t = fs.readFileSync(path.join(RAIZ, 'dados', 'homilias', 'gregorio-magno', 'revisada', `homilia-${String(n).padStart(2, '0')}.txt`), 'utf8');
    const b = t.split('\n\n').map((p) => p.split('\n')).filter((l) => /^@(cabecalho|rubrica)/.test(l[0])).map((l) => l.slice(1).join(' '));
    return b.join(' ').replace(/^(LIVRO (PRIMEIRO|SEGUNDO)\. )?HOMILIA (PRIMEIRA|[IVXL]+)\.\s*/, '').trim() || '(sem rubrica)';
  };
  const gregorio = CAT.homilias.map((c) => {
    const h = publicadas.get(c.numero);
    const cand = candidatas(c.pericope, evangelhos, SAN);
    return {
      numero: c.numero, livro: c.livro, titulo: `Homilia ${ROM[c.numero]}`, titulo_de_trabalho: c.titulo_de_trabalho,
      pericope: c.pericope, pericope_hurst: c.pericope_hurst, ccsl_paginas: c.ccsl_paginas,
      ocasiao_na_traducao: rubrica(c.numero),
      estado: h ? 'publicada' : (colacao.has(c.numero) ? 'conferida, não publicada' : 'aguardando colação com o latim'),
      ...(h?.situacao ? { situacao: h.situacao } : {}),
      ...(h?.motivo_catalogo ? { motivo_catalogo: h.motivo_catalogo } : {}),
      correspondencias_publicadas: h ? h.correspondencias.map((x) => ({ tipo: x.tipo, descricao: x.descricao, ...(x.leituras ? { leituras: x.leituras } : {}), ...(x.celebracao ? { celebracao: x.celebracao } : {}), ...(x.chaves ? { chaves: x.chaves } : {}), dia: x.dia || (x.leituras ? descreverChave(x.leituras, SAN) : null) })) : [],
      correspondencias_biblicas_candidatas: h && h.situacao !== 'catalogo' ? [] : cand,
      estado_final: (REG.colacao.find((x) => x.homilia === c.numero) || {}).estado_final || null,
      observacao: c.numero === 2 ? 'Na tradução recebida faltam o cabeçalho e a rubrica desta homilia; foram traduzidos de Migne na camada revisada (G02-01).' : '',
    };
  });
  const vianney = VIA.sermoes.map((s) => ({ tomo: s.tomo, pagina: s.pagina, ocasiao: s.ocasiao, titulo: s.titulo, ocasiao_atual_provavel: ocasiaoAtual(VIANNEY_OCASIOES, s.ocasiao), estado: 'não publicado' }));
  const antonio = ACAT.itens.map((it) => {
    const c = AREG.colacao.find((x) => x.sermao === it.codigo);
    const e = IND.homilias.find((h) => h.id === `antonio-${it.codigo}`);
    const rs = AREG.registros.filter((r) => r.sermao === it.codigo);
    return {
      codigo: it.codigo, ordem: it.ordem, colecao: it.colecao, tipo: it.tipo, titulo: it.titulo, titulo_latino: it.titulo_latino,
      colacao_com_o_latim: c ? c.nivel : null, paragrafos_conferidos: c ? c.paragrafos_conferidos : null,
      correcoes_aplicadas: rs.filter((r) => r.tipo === 'correcao' && r.estado === 'aplicada').length,
      traducoes_proprias: rs.filter((r) => r.tipo === 'traducao-propria').map((r) => r.id),
      duvidas_e_variantes: rs.filter((r) => r.tipo === 'duvida' || r.tipo === 'variante').map((r) => r.id),
      estado_final: c ? c.estado_final : null,
      estado: e?.estado === 'publicada' ? (e.situacao === 'catalogo' ? 'publicado só no catálogo geral' : 'publicado') : 'não publicado',
      ...(e?.estado === 'publicada' && e.situacao === 'catalogo' ? { motivo_catalogo: e.motivo_catalogo } : {}),
    };
  });
  const inventario = {
    _leia: ['Gerado por ferramentas/homilias/gerar_documentos.mjs — não editar à mão.', 'As correspondências "candidatas" e "prováveis" NÃO estão no site: foram calculadas para orientar o trabalho e precisam de verificação antes de qualquer publicação.', 'A distribuição das homilias de São Gregório no calendário (Etapa 2) está em gregorio-magno/distribuicao.json e DISTRIBUICAO.md.'],
    gregorio_magno: gregorio, joao_maria_vianney: vianney, antonio_de_padua: antonio,
  };
  return { inventario, inventarioMd: inventarioMd(inventario, REG), auditoriaMd: auditoriaMd(REG, IND, gregorio, antonio), auditoriaAntonioMd: auditoriaAntonioMd(AREG, ACAT) };
}

// ---------------------------------------------------------------- INVENTARIO.md
function inventarioMd(inv, REG) {
  const g = inv.gregorio_magno;
  const pub = g.filter((h) => h.estado === 'publicada');
  const noCal = pub.filter((h) => h.situacao !== 'catalogo');
  const soCat = pub.filter((h) => h.situacao === 'catalogo');
  const L = [];
  L.push('# Inventário das homilias dos santos', '', '> Gerado a partir dos dados por `ferramentas/homilias/gerar_documentos.mjs`. Não edite à mão: altere os dados e rode o script.', '');
  L.push('## Resumo', '', '| Santo | Material recebido | Textos | No site | Motivo principal |', '|---|---|---|---|---|');
  L.push(`| São Gregório Magno | tradução portuguesa (40 homilias), texto latino de Migne (PL 76), texto latino crítico (CCSL 141, só consulta, fora deste repositório), planilha de inventário | 40 homilias | ${pub.length} (${noCal.length} no calendário, ${soCat.length} só no catálogo geral) | as 40 estão colacionadas com o latim (Etapa 1) e distribuídas no calendário (Etapa 2, ver DISTRIBUICAO.md) |`);
  L.push(`| São João Maria Vianney | texto francês dos 4 tomos (transcrição em Word) | ${inv.joao_maria_vianney.length} sermões | 0 | não há tradução portuguesa; edição de origem não identificada |`);
  const ant = inv.antonio_de_padua;
  L.push(`| Santo Antônio de Pádua | tradução portuguesa do Lírio Católico (85 itens); edição crítica de 1979 em PDF (só consulta, fora deste repositório); traduções da Vozes e de Spilsbury (só consulta, fora deste repositório) | ${ant.length} itens | 0 | os ${ant.filter((x) => x.colacao_com_o_latim === 'integral').length} estão colacionados com o latim (Etapa 1 concluída em 24/11/2026, com as deliberações do responsável aplicadas); a distribuição no calendário é a Etapa 2 |`, '');
  L.push('## Critérios', '');
  L.push('- **Correspondência litúrgica:** a homilia foi pregada para a mesma celebração que o calendário atual mantém (Natal, Epifania, Páscoa, Ascensão, Pentecostes, festa de um santo, 1º domingo da Quaresma). A ocasião é tirada da rubrica da edição crítica ou do próprio texto, nunca só do título de trabalho.');
  L.push('- **Correspondência bíblica:** a passagem comentada é lida naquele dia no lecionário do site. Os versículos em comum são conferidos automaticamente pelos testes.');
  L.push('- **Correspondência temática:** nunca é usada para pôr uma homilia num dia. Fica registrada aqui para avaliação futura.');
  L.push('- Domingos do calendário antigo (Septuagésima, “domingo depois de Pentecostes” etc.) **não** são convertidos automaticamente em domingos atuais: a numeração e os Evangelhos mudaram.');
  L.push('- A distribuição das homilias de São Gregório (critérios, correspondências usadas e recusadas, datas) está em `DISTRIBUICAO.md`, gerado de `gregorio-magno/distribuicao.json`.', '');

  L.push('## São Gregório Magno — Homiliae in Evangelia', '');
  const lista = (f) => g.filter(f).map((h) => ROM[h.numero]).join(', ') || 'nenhuma';
  L.push('### Situação das 40 homilias', '', '| Camada | Homilias | Quantidade |', '|---|---|---|');
  L.push(`| Recebida: cópia exata da tradução, \`recebida/\` | prefácio e I a XL | ${g.length} + prefácio |`);
  L.push(`| Revisada: conferida com Migne (PL 76) e a CCSL 141, \`revisada/\` | ${lista((h) => REG.colacao.some((c) => c.homilia === h.numero))} | ${REG.colacao.length} |`);
  L.push(`| Publicada no calendário (nos dias das suas correspondências) | ${lista((h) => h.estado === 'publicada' && h.situacao !== 'catalogo')} | ${noCal.length} |`);
  L.push(`| Publicada só no catálogo geral (sem data litúrgica) | ${lista((h) => h.situacao === 'catalogo')} | ${soCat.length} |`);
  L.push(`| Aguardando colação com o latim | ${lista((h) => !REG.colacao.some((c) => c.homilia === h.numero))} | ${g.length - REG.colacao.length} |`);
  const propria = fs.readdirSync(path.join(RAIZ, 'dados', 'homilias', 'gregorio-magno', 'traducao-propria')).map((f) => f.match(/^homilia-(\d\d)\.txt$/)).filter(Boolean).map((m) => +m[1]);
  L.push(`| Tradução própria do latim, \`traducao-propria/\` (não publicada) | ${lista((h) => propria.includes(h.numero))} (piloto) | ${propria.length} |`, '');
  L.push('### Estado final de cada homilia (Etapa 1)', '', 'Estados: **finalizada**: texto colacionado, correções aplicadas, nenhuma dúvida em aberto (pode haver sugestões de redação para sua decisão); **finalizada com ressalvas**: texto utilizável, com dúvida em aberto ou trecho que merece atenção (ver ressalvas).', '');
  L.push('| Nº | Estado final | Correções aplicadas | Sugestões | Dúvidas | Variantes e problemas da fonte | Ressalvas |', '|---|---|---|---|---|---|---|');
  for (const c of [...REG.colacao].sort((a, b) => a.homilia - b.homilia)) {
    const rs = REG.registros.filter((r) => r.homilia === c.homilia);
    const ids = (f) => rs.filter(f).map((r) => r.id).join(', ') || '—';
    L.push(`| ${ROM[c.homilia]} | ${c.estado_final === 'finalizada-com-ressalvas' ? 'finalizada com ressalvas' : c.estado_final} | ${rs.filter((r) => r.estado === 'aplicada').length} | ${ids((r) => r.tipo === 'sugestao')} | ${ids((r) => r.tipo === 'duvida')} | ${rs.filter((r) => r.tipo === 'variante' || r.tipo === 'problema-fonte').length} | ${md(c.ressalvas.join(' ')) || '—'} |`);
  }
  L.push('');
  L.push(`Procedência da tradução recebida: ${REG.procedencia.fonte_de_obtencao_da_traducao}; fonte textual declarada: ${REG.procedencia.fonte_textual_declarada}. Tradutor: ${REG.procedencia.tradutor}`, '');
  L.push('### Homilias no calendário', '', '| Nº | Passagem | Ocasião (rubrica da tradução revisada) | Dias em que aparece |', '|---|---|---|---|');
  for (const h of noCal) {
    L.push(`| ${h.titulo} | ${h.pericope} | ${md(h.ocasiao_na_traducao)} | ${h.correspondencias_publicadas.map((c) => `**${c.tipo === 'liturgica' ? 'litúrgica' : 'bíblica'}:** ${md(c.dia || c.descricao)}`).join('<br>')} |`);
  }
  L.push('', '### Homilias só no catálogo geral (sem data litúrgica)', '');
  L.push('Publicadas no catálogo geral do site (#/homilias), sem dia no calendário: não têm correspondência litúrgica nem bíblica plena. As candidatas abaixo, todas parciais, foram examinadas e recusadas (ver DISTRIBUICAO.md; porcentagens: quanto do Evangelho do dia a homilia comenta / quanto da passagem comentada é lido no dia).', '');
  L.push('| Nº | Passagem | Ocasião histórica (rubrica da tradução revisada) | Por que fica sem data | Candidatas parciais |', '|---|---|---|---|---|');
  for (const h of soCat) {
    const c = h.correspondencias_biblicas_candidatas.slice(0, 6).map((x) => `${md(x.dia)} — ${x.referencia_do_dia} (${x.cobre_o_evangelho_do_dia}% / ${x.cobre_a_homilia}%)`).join('<br>') || '— nenhuma no lecionário do site';
    L.push(`| ${h.titulo} | ${h.pericope} | ${md(h.ocasiao_na_traducao)} | ${md(h.motivo_catalogo)} | ${c} |`);
  }
  L.push('', '## São João Maria Vianney — Sermons', '');
  L.push('Nenhum sermão foi inserido. Motivos: (1) não foi enviada tradução portuguesa, e traduzir 75 sermões seria produzir um texto novo, que precisa da sua decisão e revisão; (2) os PDFs são transcrições em Word, sem folha de rosto, editor ou data, de modo que a edição de origem não pode ser identificada a partir do material; (3) o tomo 4 inclui uma seção de “sermões inéditos”, cuja procedência precisa ser verificada; (4) a dependência destes sermões de coletâneas de outros pregadores do século XVIII é questão a investigar antes de apresentá-los como textos do Cura d’Ars (ver a auditoria).', '');
  L.push('| Tomo, p. | Ocasião (como no texto) | Título | Ocasião atual provável (não verificada) |', '|---|---|---|---|');
  for (const s of inv.joao_maria_vianney) L.push(`| ${s.tomo}, ${s.pagina} | ${md(s.ocasiao)} | ${md(s.titulo)} | ${md(s.ocasiao_atual_provavel || '— (domingo do calendário antigo ou tema; sem correspondência definida)')} |`);
  L.push('', '## Santo Antônio de Pádua — Sermones dominicales et festivi', '');
  const antPub = ant.filter((s) => s.estado.startsWith('publicado'));
  L.push(`${antPub.length ? `${antPub.length === ant.length ? 'Todos os' : antPub.length} sermões publicados (${antPub.filter((s) => s.estado === 'publicado').length} nos dias do calendário, ${antPub.filter((s) => s.estado !== 'publicado').length} só no catálogo geral; distribuição em \`antonio/DISTRIBUICAO.md\`).` : 'Nenhum sermão está publicado.'} Os 85 itens (72 dominicais, com 7 prólogos e o epílogo; 7 marianos, com o prólogo; 6 festivos) foram colacionados por inteiro com o latim da edição crítica (Centro Studi Antoniani, Pádua, 1979). O texto de base é a tradução do Lírio Católico, creditada a ele; as decisões de cada passagem estão em \`antonio/AUDITORIA.md\` e o modo de trabalhar em \`antonio/LEIA-ME.md\`. A distribuição no calendário é a Etapa 2.`, '');
  L.push('| Nº | Código | Título | Coleção | Colação | Correções aplicadas | Tradução própria | Dúvidas e variantes | Estado final |', '|---|---|---|---|---|---|---|---|---|');
  for (const s of ant) L.push(`| ${s.ordem} | ${s.codigo} | ${md(s.titulo)} | ${s.colecao.replace('Sermões ', '')}${s.tipo !== 'sermao' ? ` (${s.tipo === 'prologo' ? 'prólogo' : 'epílogo'})` : ''} | ${s.colacao_com_o_latim === 'integral' ? `integral${s.paragrafos_conferidos ? `, ${s.paragrafos_conferidos} §§` : ''}` : '—'} | ${s.correcoes_aplicadas} | ${s.traducoes_proprias.join(', ') || '—'} | ${s.duvidas_e_variantes.join(', ') || '—'} | ${s.estado_final === 'finalizada-com-ressalvas' ? 'finalizada com ressalvas' : s.estado_final || '—'} |`);
  L.push('');
  return L.join('\n');
}

// ---------------------------------------------------------------- AUDITORIA.md
const ESTADO = { aplicada: 'aplicada', 'nao-aplicada': 'não aplicada' };
function entrada(r) {
  const L = [`#### ${r.id} · Homilia ${ROM[r.homilia]} · ${r.localizacao}`, ''];
  L.push(`- **Santo e homilia:** São Gregório Magno, Homiliae in Evangelia, Homilia ${ROM[r.homilia]}`);
  L.push(`- **Referência bibliográfica:** CCSL 141 (Étaix, 1999), ${r.ccsl}`);
  L.push(`- **Localização no texto:** ${r.localizacao} — \`dados/homilias/gregorio-magno/recebida/homilia-${String(r.homilia).padStart(2, '0')}.txt\`, bloco ${r.bloco}`);
  L.push(`- **Texto latino:** ${r.latim}`);
  L.push(`- **Tradução recebida:** “${r.antes.replace(/\n/g, ' ¶ ')}”`);
  if (r.depois !== undefined) L.push(`- **Tradução ${r.estado === 'aplicada' ? 'aplicada' : 'proposta'}:** “${r.depois.replace(/\n\n/g, ' ¶ ')}”${r.une_ao_seguinte ? ' (e o bloco é unido ao seguinte)' : ''}`);
  L.push(`- **Justificativa linguística:** ${r.justificativa_linguistica}`);
  if (r.justificativa_teologica) L.push(`- **Justificativa teológica ou contextual:** ${r.justificativa_teologica}`);
  L.push(`- **Motivo:** ${r.motivo}`);
  if (r.decisao) L.push(`- **Decisão do responsável (${r.decisao.data.split('-').reverse().join('/')}):** ${r.decisao.escolha}${r.decisao.pendente ? ' (provisória)' : ''}. ${r.decisao.texto}`);
  if (r.avaliacao_c4) L.push(`- **Critério C4:** ${r.avaliacao_c4}`);
  L.push(`- **Grau de segurança:** ${r.confianca} · **estado:** ${ESTADO[r.estado]}`, '');
  return L.join('\n');
}
function auditoriaMd(REG, IND, gregorio, antonio) {
  const R = REG.registros;
  const grupo = (f) => R.filter(f).sort((a, b) => a.homilia - b.homilia || a.bloco - b.bloco || a.id.localeCompare(b.id));
  const aplic = grupo((r) => r.estado === 'aplicada');
  const fonteAplic = aplic.filter((r) => /fonte|editorial|Graciano|referência/i.test(r.motivo));
  const tradAplic = aplic.filter((r) => !fonteAplic.includes(r));
  const sug = grupo((r) => r.tipo === 'sugestao');
  const duv = grupo((r) => r.tipo === 'duvida');
  const varia = grupo((r) => r.tipo === 'variante');
  const L = [];
  L.push('# Auditoria das traduções — Homilias dos santos', '', '> Gerado a partir de `dados/homilias/gregorio-magno/registro-editorial.json` por `ferramentas/homilias/gerar_documentos.mjs`. Não edite à mão.', '');
  if (REG.etapas) {
    L.push('## Etapas', '', '| Etapa | Estado | Data |', '|---|---|---|');
    for (const e of Object.values(REG.etapas)) L.push(`| ${e.nome} | ${e.estado} | ${(e.data_de_conclusao || e.entregue_em || e.autorizada_em || '').split('-').reverse().join('/')} |`);
    L.push('');
  }
  L.push('## Método', '');
  L.push('- **Texto latino de base:** J.-P. Migne, *Patrologia Latina* 76 (Paris, 1849), na transcrição do Corpus Corporum (Universidade de Zurique) publicada na Wikisource latina, enviada em PDF e separada por homilia em `dados/homilias/gregorio-magno/latim/`. Os números de coluna citados no registro (1434-1661) são os que essa transcrição traz entre colchetes; podem não coincidir com os de outras tiragens da PL 76, que não foram conferidas. É a base declarada da tradução recebida.');
  L.push('- **Texto latino de conferência:** R. Étaix (ed.), *Gregorius Magnus, Homiliae in Evangelia*, CCSL 141, Turnhout: Brepols, 1999 — o PDF enviado. Edição crítica, com aparato de manuscritos e de fontes; usada para resolver passos duvidosos, identificar erros da transcrição de Migne e registrar variantes.');
  const P = REG.procedencia;
  L.push(`- **Tradução conferida:** o arquivo enviado “Texto Traduzido, as 40 homilias.txt”, obtido no portal OpenSaints (${P.fonte_de_obtencao_da_traducao.replace(/^Portal OpenSaints: /, '')}). Fonte textual declarada pela OpenSaints: ${P.fonte_textual_declarada}. Tradutor: ${P.tradutor}`);
  L.push('- **Procedimento:** as 40 homilias foram lidas em paralelo com o latim, parágrafo por parágrafo (Etapa 1: as 9 publicadas primeiro com a CCSL 141 e depois revistas com Migne; as outras 31 com Migne e a CCSL). Em todo ponto em que o português diverge do latim, a CCSL e o seu aparato foram consultados. Verificações automáticas completaram a leitura: números de coluna e de seção, referências desfiguradas, notas editoriais, resíduos de ferramentas, falsos cognatos recorrentes.');
  L.push('- **Regra decisiva:** quando o português segue uma leitura que o aparato atribui a manuscritos, isso é diferença de tradição textual (provavelmente a da edição de Migne), não erro de tradução: o texto fica como recebido e a diferença é registrada como *variante*.');
  L.push('- **Só correções de confiança alta foram aplicadas.** Confiança moderada ou baixa = sugestão ou dúvida, nunca aplicada.');
  L.push('- Escolhas de estilo que não mudam o sentido (artigos, pontuação, tempos verbais harmonizados, ordem das palavras) não foram alteradas nem itemizadas.');
  L.push('- **Reversível:** a tradução recebida está intacta em `dados/homilias/gregorio-magno/recebida/`; o texto publicado (`revisada/`) é gerado a partir dela e do registro. Para desfazer uma correção, mude seu estado para `nao-aplicada` e rode `python3 ferramentas/homilias/aplicar_alteracoes.py`.', '');
  L.push('## Números', '', '| Tipo | Quantidade |', '|---|---|');
  L.push(`| Correções de tradução aplicadas | ${tradAplic.length} |`, `| Correções de problemas da fonte aplicadas (artefatos, notas editoriais, referências) | ${fonteAplic.length} |`, `| Sugestões não aplicadas | ${sug.length} |`, `| Dúvidas (${duv.filter((r) => !r.decisao || r.decisao.pendente).length} ainda em aberto) | ${duv.length} |`, `| Variantes textuais registradas (texto mantido) | ${varia.length} |`, `| Homilias conferidas | ${REG.colacao.length} de 40 |`, '');
  L.push('Graus de segurança: **alta** — a correção é sustentada pelo original e pelo contexto; **moderada** — solução plausível, com alguma ambiguidade; **baixa** — não há elementos para uma solução definitiva.', '');
  L.push('## 1. Alterações efetivamente aplicadas', '', '### 1.1 Correções de tradução', '');
  for (const r of tradAplic) L.push(entrada(r));
  L.push('### 1.2 Correções de problemas da fonte', '', 'Não mudam palavras de Gregório: retiram números, notas e artefatos que vieram junto com a tradução, ou corrigem referências bíblicas acrescentadas pela edição.', '');
  for (const r of fonteAplic) L.push(entrada(r));
  L.push('## 2. Alterações sugeridas, mas não aplicadas', '', 'Cada uma traz a decisão do responsável (relatório final da Etapa 1, 06/11/2026).', '');
  for (const r of sug) L.push(entrada(r));
  L.push('## 3. Dúvidas', '', 'Dúvidas de sentido que as fontes não resolvem, com a decisão tomada. Uma decisão marcada como provisória mantém a dúvida em aberto.', '');
  for (const r of duv) L.push(entrada(r));
  L.push('## 4. Variantes textuais (diferenças de edição; texto mantido)', '', 'Em cada caso abaixo, o português não segue o texto crítico, mas segue uma leitura atestada nos manuscritos ou na edição impressa. Nada foi alterado.', '');
  L.push('| Registro | Homilia | Tradução recebida | Latim crítico e aparato |', '|---|---|---|---|');
  for (const r of varia) L.push(`| ${r.id} | ${ROM[r.homilia]} | ${md(r.antes)} | ${md(r.latim)} |`);
  L.push('', '## 5. Problemas encontrados nas fontes', '');
  const PR = REG.procedencia.politica_de_reutilizacao_declarada;
  L.push(`- **Tradução portuguesa sem tradutor identificado:** o arquivo não traz tradutor, edição nem licença. Foi obtido no portal OpenSaints, que declara na ${PR.onde}: “${PR.texto}” Também declara que ${PR.tambem_declarado}. Alcance: ${PR.alcance}. Verificação: ${PR.verificacao}.`);
  for (const h of REG.historico) L.push(`- **Decisão editorial (${h.data.split('-').reverse().join('/')}):** ${h.decisao}`);
  L.push('- **Marcas do processo de tradução:** linhas “Trecho N” e “PT” entre os parágrafos. Não fazem parte do texto; foram retiradas só na divisão por homilia (a camada recebida as registra em `@trechos`).');
  L.push('- **Homilia II sem cabeçalho nem rubrica:** o texto começa direto no Evangelho, dentro do bloco da Homilia I.');
  L.push('- **Artefatos numéricos** (números de coluna de Migne, como “1468”, “1573”) e numeração de parágrafos colada ao texto, juntando parágrafos — corrigidos nas 40 homilias (ver 1.2).');
  L.push('- **Remissões ao Decreto de Graciano** — notas marginais da edição impressa, como “(11, q. 3, c. 88)”, dentro do texto — retiradas onde a tradução as conservava.');
  L.push('- **Referências bíblicas desfiguradas** (“Sl 67 Sl 19”, “Hb 12 Hb 29”), “ibid.” e abreviaturas latinas — corrigidas e uniformizadas nas 40 homilias.');
  L.push('- **Blocos com etiqueta errada** (título ou texto da leitura marcado como parágrafo, leitura colada ao § 1, parágrafos partidos no meio de uma frase) — corrigidos.');
  L.push('- **Rubricas com dados ausentes do texto crítico:** a indicação do domingo nas Homilias VII, XVI e XXVI vem da edição impressa (ver variantes G07-03, G16-06, G26-09). Por isso a VII e a XXVI entram no calendário só pela correspondência bíblica, e a XVI pela ocasião confirmada no próprio texto (§ 5).');
  L.push('- **Lacuna na Homilia XL, § 3:** duas frases faltam na tradução recebida e, no lugar delas, há anotações de trabalho de uma ferramenta automática (“exprim glria? Wait correct typo. Need final clean.”). É a única ocorrência nas 40 homilias. Na camada revisada, as anotações saíram e as frases foram traduzidas do latim, como tradução própria identificada (G40-05).');
  L.push('- **Erros da edição de Migne nas referências bíblicas**, copiados pela tradução (ex.: Ct 1,1 dada como “I, 7”; Sl 101,8 como “CI, 1”; Mt 19,8 no lugar de Ex 22,1) — corrigidos com o aparato de fontes da CCSL.');
  L.push('- **Livros dos Reis e de Samuel:** a tradução recebida converteu “I/II Reg.” da Vulgata em “1Rs/2Rs”, que hoje designam outros livros — corrigidos para 1Sm/2Sm.');
  L.push('- **Erros da transcrição latina de base** (Corpus Corporum), identificados pela CCSL, sem efeito na tradução (ex.: “non” por “nos”, “concidit” por “condidit”) — registrados como problemas da fonte.');
  L.push('- **Grafia anterior ao Acordo Ortográfico:** “ungüentos” (Homilia XXIX), atualizada na Etapa 1 (G29-11).');
  L.push('- **Texto latino (CCSL 141):** a digitalização traz aviso de direitos reservados (Brepols). Foi usada só para conferência; nenhum texto latino é publicado no site, apenas citações curtas nesta auditoria.');
  L.push('- **Santo Antônio:** a tradução de base é a do Lírio Católico, conferida com a edição crítica de 1979; as traduções da Vozes (Frei Ary E. Pintarelli, 2019) e de Paul Spilsbury foram só consultadas. Os problemas das fontes e todas as decisões estão em `antonio/AUDITORIA.md`.');
  L.push('- **São João Maria Vianney:** os PDFs são documentos do Word convertidos, sem folha de rosto; há erros de reconhecimento de ligaduras (“SancLfication”, “ChréLen”).', '');
  L.push('## 6. Textos cuja autenticidade ou atribuição precisa de investigação', '');
  L.push('- **Homilia XXVI, § 2** — a frase “Isto é: assim como o Pai, Deus, enviou a mim, Deus, também eu vos envio, homem, a vós, homens” está em Migne (PL 76, col. 1553-1554), base da tradução, mas não no texto crítico nem no seu aparato (registro G26-08). Por decisão do responsável (C2), continua no texto, com nota editorial na página da homilia.');
  L.push('- **São João Maria Vianney** — os 4 tomos são a coleção tradicional dos sermões escritos pelo Cura d’Ars. A dependência destes textos de coletâneas de sermões de outros autores, e a extensão dos retoques dos editores, precisam ser investigadas antes de apresentá-los como palavras do santo. Os “sermões inéditos” do tomo 4 exigem identificação da fonte. Esta auditoria não afirma nem nega a autoria: registra que o material enviado não permite verificá-la.');
  L.push('- **Santo Antônio de Pádua** — a autoria dos *Sermones dominicales et festivi* é sólida (edição crítica de 1979). Os 85 itens foram conferidos com o latim (Etapa 1); trechos ausentes do texto crítico estão registrados como variantes em `antonio/AUDITORIA.md`.', '');
  L.push('## 7. Homilias examinadas e não inseridas no calendário', '');
  L.push('| Santo | Texto | Motivo |', '|---|---|---|');
  for (const h of gregorio.filter((x) => x.estado !== 'publicada')) L.push(`| São Gregório Magno | ${h.titulo} (${h.pericope}) | colacionada (estado: ${h.estado_final === 'finalizada-com-ressalvas' ? 'finalizada com ressalvas' : h.estado_final}); não publicada |`);
  for (const h of gregorio.filter((x) => x.situacao === 'catalogo')) L.push(`| São Gregório Magno | ${h.titulo} (${h.pericope}) | publicada só no catálogo geral, sem data litúrgica: ${md(h.motivo_catalogo)} |`);
  L.push('| São João Maria Vianney | todos os sermões | sem tradução portuguesa; edição de origem e autoria a investigar |');
  const antNaoPub = antonio.filter((x) => !x.estado.startsWith('publicado'));
  if (antNaoPub.length) L.push(`| Santo Antônio de Pádua | ${antNaoPub.length === antonio.length ? 'todos os sermões' : antNaoPub.map((x) => x.codigo).join(', ')} | colacionados com o latim (Etapa 1 concluída); não publicados |`);
  for (const x of antonio.filter((y) => y.estado === 'publicado só no catálogo geral')) L.push(`| Santo Antônio de Pádua | ${x.titulo} (${x.codigo}) | publicado só no catálogo geral, sem data litúrgica: ${md(x.motivo_catalogo)} |`);
  L.push('');
  return L.join('\n');
}

// ---------------------------------------------------------------- antonio/AUDITORIA.md
const TIPO_ANT = { correcao: 'correção', sugestao: 'sugestão', duvida: 'dúvida', variante: 'variante textual', 'problema-fonte': 'problema da fonte', 'traducao-propria': 'tradução própria', estrutura: 'estrutura' };
const linha = (t) => String(t ?? '').replace(/\n+/g, ' ¶ ');
/** atualização editorial rastreável: o campo mudado, o motivo e o texto anterior (que continua registrado) */
const atualizacaoMd = (u) => `- **Atualização (${u.data.split('-').reverse().join('/')}, campo \`${u.campo}\`):** ${linha(u.motivo)}${u.depois !== undefined ? ` Antes: “${linha(u.antes)}”; depois: “${linha(u.depois)}”.` : ` Texto anterior: “${linha(u.antes)}”`}`;
function entradaAntonio(r, item) {
  const L = [`#### ${r.id} · ${r.sermao} (${item ? item.titulo : '?'}) · ${r.localizacao || (r.paragrafo != null ? `§ ${r.paragrafo}` : 'temas')}`, ''];
  L.push(`- **Tipo:** ${TIPO_ANT[r.tipo] || r.tipo} · **confiança:** ${r.confianca || '—'} · **estado:** ${r.estado === 'aplicada' ? 'aplicada' : 'não aplicada'}`);
  L.push(`- **Lugar no arquivo:** \`dados/homilias/antonio/recebida/${r.sermao}.txt\`, bloco ${r.bloco}${r.paragrafo != null ? ` (§ ${r.paragrafo})` : ''}`);
  if (r.latim) L.push(`- **Latim (edição crítica, citação curta):** ${linha(r.latim)}`);
  if (r.antes !== undefined && r.antes !== null) L.push(`- **Tradução recebida (Lírio Católico):** “${linha(r.antes)}”`);
  if (r.depois !== undefined && r.depois !== null) L.push(`- **${r.tipo === 'traducao-propria' ? 'Tradução própria do projeto' : r.estado === 'aplicada' ? 'Texto aplicado' : 'Texto proposto'}:** ${r.depois === '' ? '(trecho retirado)' : `“${linha(r.depois)}”`}`);
  if (r.mover_para_depois_do_bloco !== undefined) L.push(`- **Movimento:** o bloco passa para depois do bloco ${r.mover_para_depois_do_bloco}`);
  if (r.mover_para_antes_do_bloco !== undefined) L.push(`- **Movimento:** o bloco passa para antes do bloco ${r.mover_para_antes_do_bloco}`);
  if (r.repete_bloco !== undefined) L.push(`- **Na página:** este parágrafo repete o bloco ${r.repete_bloco}`);
  if (r.inserir_secao_antes) L.push(`- **Seção inserida antes do bloco:** “${r.inserir_secao_antes.titulo}”`);
  if (r.titulo_secao !== undefined) L.push(`- **Título dado à seção:** “${r.titulo_secao}”`);
  if (r.substituida_por) L.push(`- **Substituída por:** ${r.substituida_por} (deixou de ser aplicada)`);
  L.push(`- **Justificativa:** ${linha(r.justificativa)}`);
  if (r.motivo) L.push(`- **Motivo:** ${r.motivo}`);
  if (r.aviso) L.push(`- **Aviso ao leitor:** “${r.aviso}”`);
  if (r.nota_do_tradutor) L.push(`- **Nota do tradutor (Lírio), fora do corpo do texto:** “${linha(r.nota_do_tradutor)}”`);
  if (r.nota_editorial) L.push(`- **Nota editorial:** ${linha(r.nota_editorial)}`);
  if (r.nota) L.push(`- **Nota (${r.nota.aviso}):** ${r.nota.procedencia} Texto: “${linha(r.nota.texto)}”`);
  if (r.decisao) L.push(`- **Decisão do responsável (${r.decisao.data.split('-').reverse().join('/')}, ${r.decisao.questao}):** ${r.decisao.escolha}. ${r.decisao.texto}${r.decisao.aplicada_em ? ` Aplicada em ${r.decisao.aplicada_em.join(', ')}.` : ''}`);
  if (r.origem_da_aplicacao) L.push(`- **Origem da aplicação:** ${r.origem_da_aplicacao}`);
  if (r.retraducao) L.push(`- **Retradução às cegas (${r.retraducao.data.split('-').reverse().join('/')}):** ${r.retraducao.medida}: texto anterior ${r.retraducao.antes}; primeira versão às cegas ${r.retraducao.primeira_versao}; texto final ${r.retraducao.depois}.${r.retraducao.observacao ? ` ${r.retraducao.observacao}` : ''}`);
  if (r.revisao_corretiva) {
    const rc = r.revisao_corretiva;
    L.push(`- **Revisão corretiva (${rc.data.split('-').reverse().join('/')}):** critério: ${rc.criterio}. Resultado: ${rc.resultado}.${rc.origem_verificada ? ` ${rc.origem_verificada}` : ''}`);
    for (const a of rc.alteracoes) L.push(`  - “${linha(a.antes)}” → “${linha(a.depois)}”${a.ocorrencias ? ` (${a.ocorrencias} ocorrências)` : ''}. Latim: ${linha(a.latim)}. Origem: ${a.origem}; decisão: ${a.decisao}. ${linha(a.justificativa)}`);
  }
  for (const u of r.atualizacoes || []) L.push(atualizacaoMd(u));
  L.push(`- **Fonte consultada:** ${r.fonte_consultada || '—'}`, '');
  return L.join('\n');
}
function auditoriaAntonioMd(REG, CAT) {
  const itens = new Map(CAT.itens.map((it) => [it.codigo, it]));
  const ordem = new Map(CAT.itens.map((it) => [it.codigo, it.ordem]));
  const R = [...REG.registros].sort((a, b) => ordem.get(a.sermao) - ordem.get(b.sermao) || a.bloco - b.bloco || a.id.localeCompare(b.id));
  const grupo = (f) => R.filter(f);
  const n = (f) => R.filter(f).length;
  const L = [];
  L.push('# Auditoria da tradução — Sermões de Santo Antônio de Pádua', '', '> Gerado a partir de `dados/homilias/antonio/registro-editorial.json` por `ferramentas/homilias/gerar_documentos.mjs`. Não edite à mão.', '');
  L.push('## Etapas', '', '| Etapa | Estado | Data |', '|---|---|---|');
  for (const e of Object.values(REG.etapas)) L.push(`| ${e.nome} | ${e.estado}${e.pendente ? ` (pendente: ${e.pendente})` : ''}${e.validacao_final ? ` (validação final em ${e.validacao_final.data.split('-').reverse().join('/')}, com ressalva)` : ''} | ${(e.data_de_conclusao || e.entregue_em || e.autorizada_em || '').split('-').reverse().join('/')} |`);
  for (const e of Object.values(REG.etapas)) {
    if (e.ressalva) L.push('', `**Ressalva (${e.nome}):** ${e.ressalva}`);
    for (const u of e.atualizacoes || []) L.push('', atualizacaoMd(u));
  }
  L.push('', '## Obra e fontes', '');
  L.push(`- **Obra:** ${REG.obra.autor}, *${REG.obra.titulo}*. ${REG.obra.divisao}`);
  const P = REG.procedencia;
  L.push(`- **Tradução recebida:** ${P.traducao_recebida.fonte}. ${P.traducao_recebida.metodo_declarado}`);
  L.push(`- **Política de uso do Lírio:** ${P.traducao_recebida.politica_de_uso}`);
  L.push(`- **Crédito:** ${P.traducao_recebida.credito}`);
  if (P.traducao_recebida.nota_editorial) L.push(`- **Nota editorial para a publicação:** ${P.traducao_recebida.nota_editorial}`);
  if (P.traducao_recebida.aviso_traducao_propria) L.push(`- **Aviso nos trechos traduzidos pelo projeto:** “${P.traducao_recebida.aviso_traducao_propria}”`);
  for (const u of P.traducao_recebida.atualizacoes || []) L.push(atualizacaoMd(u));
  L.push(`- **Latim:**${P.latim.edicao.replace(/\.$/, '')}. ${P.latim.consulta}`);
  L.push(`- **Diretriz sobre o latim:** ${P.latim.diretriz}`, '');
  L.push('## Critérios', '');
  const ROTULO = { ...TIPO_ANT, principio: 'princípio', estado_final: 'estado final' };
  for (const [k, v] of Object.entries(REG.criterios)) L.push(`- **${ROTULO[k] || k}:** ${v}`);
  L.push('', '## Números', '', '| Tipo | Aplicadas | Não aplicadas |', '|---|---|---|');
  for (const t of ['correcao', 'traducao-propria', 'estrutura', 'problema-fonte', 'sugestao', 'duvida', 'variante']) L.push(`| ${TIPO_ANT[t]} | ${n((r) => r.tipo === t && r.estado === 'aplicada')} | ${n((r) => r.tipo === t && r.estado !== 'aplicada')} |`);
  L.push(`| **Total** | **${n((r) => r.estado === 'aplicada')}** | **${n((r) => r.estado !== 'aplicada')}** |`, '');
  const est = (e) => REG.colacao.filter((c) => c.estado_final === e).length;
  L.push(`Itens colacionados por inteiro com o latim: ${REG.colacao.filter((c) => c.nivel === 'integral').length} de ${CAT.itens.length}. Estado final: ${est('finalizada')} finalizados, ${est('finalizada-com-ressalvas')} finalizados com ressalvas.`, '');
  L.push('## Estado final de cada item', '', '| Código | Título | Parágrafos conferidos | Estado final | Resultado da colação | Ressalvas |', '|---|---|---|---|---|---|');
  for (const it of CAT.itens) {
    const c = REG.colacao.find((x) => x.sermao === it.codigo);
    L.push(`| ${it.codigo} | ${md(it.titulo)} | ${c ? c.paragrafos_conferidos || 'bloco único' : '—'} | ${c ? (c.estado_final === 'finalizada-com-ressalvas' ? 'finalizada com ressalvas' : c.estado_final) : '—'} | ${md(c ? c.resultado : '')} | ${md(c ? c.ressalvas.join(' ') : '') || '—'} |`);
  }
  L.push('', '## 1. Alterações aplicadas na camada revisada', '');
  L.push('### 1.1 Correções de tradução', '');
  for (const r of grupo((r) => r.tipo === 'correcao' && r.estado === 'aplicada')) L.push(entradaAntonio(r, itens.get(r.sermao)));
  L.push('### 1.2 Traduções próprias (trechos ausentes da tradução recebida)', '', 'Traduzidas do latim da edição crítica pelo projeto. Não são texto do Lírio Católico.', '');
  for (const r of grupo((r) => r.tipo === 'traducao-propria')) L.push(entradaAntonio(r, itens.get(r.sermao)));
  L.push('### 1.3 Estrutura', '');
  for (const r of grupo((r) => r.tipo === 'estrutura' && r.estado === 'aplicada')) L.push(entradaAntonio(r, itens.get(r.sermao)));
  L.push('### 1.4 Problemas da fonte corrigidos', '');
  for (const r of grupo((r) => r.tipo === 'problema-fonte' && r.estado === 'aplicada')) L.push(entradaAntonio(r, itens.get(r.sermao)));
  L.push('## 2. Registrado sem alterar o texto', '');
  for (const [t, titulo, nota] of [
    ['sugestao', '2.1 Sugestões', 'Alternativas que podem melhorar a fidelidade, sem erro inequívoco. Aguardam decisão do responsável.'],
    ['duvida', '2.2 Dúvidas', 'Passagens sem solução segura ou com escolha editorial em aberto.'],
    ['variante', '2.3 Variantes textuais', 'Texto da tradução que não está no latim do PDF consultado, mantido até decisão.'],
    ['estrutura', '2.4 Estrutura não aplicada', ''],
  ]) {
    L.push(`### ${titulo}`, '');
    if (nota) L.push(nota, '');
    for (const r of grupo((r) => r.tipo === t && r.estado !== 'aplicada')) L.push(entradaAntonio(r, itens.get(r.sermao)));
  }
  L.push('## 3. Problemas da fonte sem alteração do texto', '', 'Em geral, referências erradas no PDF da edição em pontos em que a tradução do Lírio já acerta.', '');
  L.push('| Registro | Lugar | Latim e nota do PDF | Situação |', '|---|---|---|---|');
  for (const r of grupo((r) => r.tipo === 'problema-fonte' && r.estado !== 'aplicada')) L.push(`| ${r.id} | ${r.sermao}, ${md(r.localizacao)} | ${md(r.latim)} | ${md(r.justificativa)} |`);
  L.push('', '## 4. Observações gerais', '');
  for (const o of REG.observacoes_gerais) {
    L.push(`### ${o.id} · ${o.tema || ''}`.trimEnd(), '', o.descricao, '');
    if (o.decisao) L.push(`Decisão do responsável (${o.decisao.data.split('-').reverse().join('/')}, ${o.decisao.questao}): ${o.decisao.texto}`, '');
    if (o.ocorrencias?.length) { L.push('Ocorrências:', ''); for (const t of o.ocorrencias) L.push(`- ${t}`); L.push(''); }
    if (o.atualizacoes?.length) { L.push('Atualizações desta observação:', ''); for (const u of o.atualizacoes) L.push(atualizacaoMd(u)); L.push(''); }
  }
  L.push('## 5. Histórico', '');
  for (const h of REG.historico) L.push(`- **${h.data.split('-').reverse().join('/')} · ${h.origem}:** ${h.decisao}${h.alteracoes ? ` ${h.alteracoes}` : ''}`);
  L.push('');
  return L.join('\n');
}

// ---------------------------------------------------------------- CLI
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const r = gerar();
  const D = path.join(RAIZ, 'dados', 'homilias');
  fs.writeFileSync(path.join(D, 'inventario.json'), JSON.stringify(r.inventario, null, 1) + '\n');
  fs.writeFileSync(path.join(D, 'INVENTARIO.md'), r.inventarioMd);
  fs.writeFileSync(path.join(D, 'AUDITORIA.md'), r.auditoriaMd);
  fs.writeFileSync(path.join(D, 'antonio', 'AUDITORIA.md'), r.auditoriaAntonioMd);
  console.log('gerados: inventario.json, INVENTARIO.md, AUDITORIA.md, antonio/AUDITORIA.md');
}
