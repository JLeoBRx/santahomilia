/**
 * Santo Antônio — Etapa 2 (distribuição no calendário), preparada em PRÉVIA.
 *
 * Executar:  node --test "ferramentas/testes/*.test.mjs"
 *
 * 1. Dados e decisões: o índice e antonio/DISTRIBUICAO.md estão em dia com
 *    antonio/distribuicao.json; os títulos históricos são preservados; as
 *    decisões D1–D8 estão registradas.
 * 2. Correspondências: litúrgicas só para celebrações do calendário atual, com
 *    fundamento e as observações históricas exigidas (D4a, D4b, D4c);
 *    bíblicas todas plenas pelos critérios declarados (D1), na leitura que o
 *    sermão comenta (D3), nunca para os sermões sem trecho comentado (D2) nem
 *    por passagem paralela (D6).
 * 3. Prévia: nenhum sermão aparece no site sem a prévia (nada publicado).
 *    Com a prévia, de 2025 a 2045, cada sermão aparece exatamente nos dias
 *    calculados SÓ com o calendário a partir da lista ESPERADO (escrita à
 *    mão, independente de distribuicao.json), e a ordem do dia põe primeiro
 *    os pregados para a celebração (D5).
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as dados from '../../js/dados.js';
import { CalendarioLiturgico, isoDeNumero, numeroDia } from '../../js/liturgical-calendar.js';
import * as LD from '../../js/leituras.js';
import * as HM from '../../js/homilias.js';
import { versiculos, intersecao, contido } from '../homilias/referencias.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const ler = (p) => JSON.parse(fs.readFileSync(path.join(RAIZ, p), 'utf8'));
dados.definirCarregador(async (c) => { try { return fs.readFileSync(path.join(RAIZ, c), 'utf8'); } catch { return null; } });
await LD.iniciar();
await HM.iniciar();
const SAN = ler('dados/calendario/santoral.json');
const cal = new CalendarioLiturgico(SAN);
const INDICE = ler('dados/homilias/indice.json');
const DIST = ler('dados/homilias/antonio/distribuicao.json');
const CAT = ler('dados/homilias/antonio/catalogo.json');
const REG = ler('dados/homilias/antonio/registro-editorial.json');
const LDI = ler('dados/leituras/indice.json');
const ANT = INDICE.homilias.filter((h) => h.obra === 'antonio-sermones');
const porCod = new Map(ANT.map((h) => [h.codigo, h]));
const DEC = new Map(DIST.sermoes.map((s) => [s.codigo, s]));

const CATALOGO = ['sd01', 'sd02', 'sd27', 'sd36', 'sd41', 'sd46', 'sd48', 'sd51', 'sd56', 'sd72', 'sm01'];
const REDUZIDOS = ['sd07', 'sd14', 'sd25', 'sd48', 'sd57', 'sd65', 'sf03', 'sf05'];
const SEM_TRECHO = ['sd02', 'sd16', 'sd26', 'sm02', 'sm05'];
// correspondências litúrgicas aprovadas: sermão -> celebração atual
const LITURGICAS = {
  sd05: 'cinzas', sd13: 'ramos', sd14: 'ceiadosenhor', sd15: 'pascoa', sd16: 'pascoa', sd17: 'divinamisericordia', sd24: 'ascensaodosenhor',
  sd25: 'pentecostes', sd26: 'pentecostes', sd61: 'natal', sd62: 'santoestevao', sd63: 'joaoevangelista', sd64: 'santosinocentes', sd68: 'epifania',
  sm02: 'natividade', sm03: 'anunciacao', sm04: 'apresentacao', sm05: 'assuncao', sm06: 'apresentacao', sm07: 'anunciacao',
  sf01: 'conversaosaopaulo', sf02: 'catedra', sf03: 'saofilipeetiago', sf05: 'saojoao', sf06: 'pedroepaulo',
};

describe('Santo Antônio, Etapa 2: dados e decisões', () => {
  test('índice e antonio/DISTRIBUICAO.md estão em dia com antonio/distribuicao.json', async () => {
    const { gerarDistribuicao, gerarDistribuicaoAntonio } = await import('../homilias/aplicar_distribuicao.mjs');
    const r = await gerarDistribuicao();
    const ra = await gerarDistribuicaoAntonio(r.indice);
    const msg = 'rode: node ferramentas/homilias/aplicar_distribuicao.mjs';
    assert.equal(fs.readFileSync(path.join(RAIZ, 'dados/homilias/indice.json'), 'utf8'), JSON.stringify(ra.indice, null, 2), msg);
    assert.equal(fs.readFileSync(path.join(RAIZ, 'dados/homilias/antonio/DISTRIBUICAO.md'), 'utf8'), ra.md, msg);
  });

  test('os 85 itens, na ordem do catálogo, com o título histórico preservado e o texto da camada revisada', () => {
    assert.deepEqual(ANT.map((h) => h.codigo), CAT.itens.map((it) => it.codigo));
    assert.deepEqual(DIST.sermoes.map((s) => s.codigo), CAT.itens.map((it) => it.codigo));
    for (const it of CAT.itens) {
      const h = porCod.get(it.codigo);
      assert.equal(h.titulo, it.titulo, `${it.codigo}: título histórico trocado`);
      assert.equal(h.titulo_latino, it.titulo_latino, `${it.codigo}: título latino trocado`);
      assert.equal(h.arquivo, `homilias/antonio/revisada/${it.codigo}`);
      assert.ok(fs.existsSync(path.join(RAIZ, 'dados', h.arquivo + '.txt')), `${it.codigo}: arquivo ausente`);
      assert.ok(DEC.get(it.codigo).justificativa, `${it.codigo}: sem justificativa`);
    }
  });

  test('decisões D1–D8 registradas na distribuição e no registro editorial', () => {
    assert.deepEqual(DIST.decisoes.map((d) => d.id), ['D1', 'D2', 'D3', 'D4a', 'D4b', 'D4c', 'D5', 'D6', 'D7', 'D8']);
    for (const d of DIST.decisoes) assert.ok(d.data === '2026-11-28' && d.questao && d.decisao && d.aplicacao, `${d.id} incompleta`);
    assert.match(DIST.decisoes.find((d) => d.id === 'D8').aplicacao, /INTERROMPIDA/);
    assert.match(REG.etapas.etapa_2.estado, /prévia/);
    assert.match(REG.etapas.etapa_2.pendente, /aprovação expressa/);
    const h = REG.historico.find((x) => x.data === '2026-11-28' && /D1–D8/.test(x.origem));
    assert.ok(h && /previa/.test(h.alteracoes) && /D8 interrompida/.test(h.alteracoes), 'histórico da Etapa 2');
    // as decisões da Etapa 1 continuam as mesmas
    assert.equal(REG.etapas.etapa_1.estado, 'concluída');
    assert.ok(REG.etapas.etapa_1.ressalva && REG.etapas.etapa_1.validacao_final);
  });

  test('só no catálogo (D7): os 11 itens, sem nenhuma correspondência e com o motivo', () => {
    assert.deepEqual(ANT.filter((h) => h.situacao === 'catalogo').map((h) => h.codigo), CATALOGO);
    for (const c of CATALOGO) {
      assert.equal(porCod.get(c).correspondencias.length, 0, c);
      assert.ok(porCod.get(c).motivo_catalogo, c);
    }
    assert.equal(ANT.filter((h) => h.situacao === 'calendario').length, 74);
  });
});

describe('Santo Antônio, Etapa 2: correspondências', () => {
  test('litúrgicas: exatamente as aprovadas, para celebrações do calendário atual, com fundamento na edição crítica', () => {
    const celebracoes = new Set([...SAN.fixas.map((c) => c.id), ...Object.keys(SAN.moveis)]);
    const obs = {};
    for (const h of ANT) for (const c of h.correspondencias.filter((x) => x.tipo === 'liturgica')) {
      assert.ok(!obs[h.codigo], `${h.codigo}: mais de uma litúrgica`);
      obs[h.codigo] = c.celebracao;
      assert.ok(celebracoes.has(c.celebracao), `${h.codigo}: ${c.celebracao} não está no calendário`);
      assert.ok(c.descricao && c.dia, `${h.codigo}: sem descrição`);
      const l = DEC.get(h.codigo).liturgicas.find((x) => x.celebracao === c.celebracao);
      const it = CAT.itens.find((x) => x.codigo === h.codigo);
      assert.ok(l.fundamento.startsWith(`Título na edição crítica: «${it.latim.titulo_no_pdf}»`), `${h.codigo}: fundamento ${l.fundamento}`);
    }
    assert.deepEqual(obs, LITURGICAS);
  });

  test('D4a: Purificação e Apresentação do Senhor, com a redação aprovada e a evolução histórica', () => {
    for (const [cod, titulo] of [['sm04', 'Na Purificação da Bem-aventurada Virgem Maria'], ['sm06', 'Na Festa da Purificação da Bem-aventurada Virgem Maria']]) {
      const c = porCod.get(cod).correspondencias.find((x) => x.tipo === 'liturgica');
      assert.equal(c.descricao, `Este sermão foi originalmente intitulado “${titulo}” e corresponde à atual festa da Apresentação do Senhor, celebrada em 2 de fevereiro.`);
      assert.match(c.observacao_historica, /Purificação/);
      assert.match(c.observacao_historica, /1969/);
      assert.match(c.observacao_historica, /festa do Senhor/);
      assert.ok(!/só (mudou|trocou) o nome|apenas uma troca/i.test(c.observacao_historica), `${cod}: não pode dizer que foi só troca de nome`);
      assert.match(porCod.get(cod).titulo, /Purificação/, `${cod}: título histórico perdido`);
    }
  });

  test('D4b: sd66 (Circuncisão) só por correspondência bíblica em 1º de janeiro, com o título original', () => {
    const h = porCod.get('sd66');
    assert.equal(h.titulo, 'Circuncisão do Senhor');
    assert.deepEqual(h.correspondencias.map((c) => [c.tipo, c.leituras]), [['biblica', 'santamaria']]);
    assert.match(h.correspondencias[0].descricao, /Circuncisão do Senhor/);
    assert.match(h.correspondencias[0].descricao, /não foi pregado para a atual solenidade de Santa Maria, Mãe de Deus/);
    assert.ok(DEC.get('sd66').nao_usadas.some((x) => /Santa Maria, Mãe de Deus/.test(x.alvo) && /D4b/.test(x.motivo)));
  });

  test('D4c: São Filipe e São Tiago, com a sequência 1º de maio, 11 de maio e 3 de maio', () => {
    const c = porCod.get('sf03').correspondencias.find((x) => x.tipo === 'liturgica');
    assert.equal(c.celebracao, 'saofilipeetiago');
    const o = c.observacao_historica;
    for (const s of ['1º de maio', '11 de maio', '3 de maio', '1955', '1969']) assert.ok(o.includes(s), `falta “${s}”`);
    assert.ok(o.indexOf('1º de maio') < o.indexOf('11 de maio') && o.indexOf('11 de maio') < o.indexOf('3 de maio'), 'sequência fora de ordem');
  });

  test('bíblicas: todas plenas pelos critérios declarados, na leitura que o sermão comenta, e verificáveis no índice das leituras', () => {
    const lim = DIST.criterios.biblica_plena.limiares;
    let n = 0;
    for (const h of ANT) {
      const P = versiculos(h.pericope || '');
      for (const c of h.correspondencias.filter((x) => x.tipo === 'biblica')) {
        n++;
        assert.ok(P.size, `${h.codigo}: correspondência bíblica sem trecho comentado`);
        assert.equal(c.leitura, h.codigo === 'sd59' ? 'Segunda leitura' : h.codigo === 'sd25' ? 'Primeira leitura' : 'Evangelho', `${h.codigo}: seção`);
        const refs = (LDI.conjuntos[c.leituras] || []).flat().filter(([s, r]) => s === c.leitura && r).map(([, r]) => r);
        assert.ok(refs.includes(c.referencia_do_dia), `${h.codigo} × ${c.leituras}: ${c.referencia_do_dia} não está no índice`);
        const R = versiculos(c.referencia_do_dia), O = intersecao(P, R);
        const daH = O.size / P.size, doD = O.size / R.size;
        const plena = daH >= lim.cobre_a_homilia || (doD >= lim.cobre_o_dia && (R.size >= lim.minimo_de_versiculos_do_dia || daH >= lim.minimo_da_homilia_se_curto));
        assert.ok(plena, `${h.codigo} × ${c.leituras}: ${O.size} em comum (${Math.round(doD * 100)}% do dia, ${Math.round(daH * 100)}% do trecho)`);
        assert.equal(c.versiculos_em_comum, O.size);
        assert.equal(c.cobertura_do_trecho, Math.round(daH * 100));
        assert.equal(c.cobertura_do_dia, Math.round(doD * 100));
        assert.ok(contido(versiculos(c.versiculos_comentados), P) && contido(versiculos(c.versiculos_comentados), R));
        assert.match(c.criterio, /^\((a|b)\)/);
        assert.match(c.descricao, /não foi pregado para este dia|não foi pregado para a atual solenidade/, `${h.codigo} × ${c.leituras}`);
      }
    }
    assert.equal(n, 150);
  });

  test('D3: o sd59 está só no 3º Domingo do Advento, Ano C, pela 2ª leitura', () => {
    assert.deepEqual(porCod.get('sd59').correspondencias.map((c) => [c.tipo, c.leituras, c.leitura, c.referencia_do_dia]), [['biblica', 'ADV-3-domingo-C', 'Segunda leitura', 'Fl 4,4-7']]);
  });

  test('D2: trechos reduzidos e sermões sem trecho comentado', () => {
    assert.deepEqual(ANT.filter((h) => h.reducao).map((h) => h.codigo), REDUZIDOS);
    for (const c of REDUZIDOS) {
      const h = porCod.get(c);
      assert.notEqual(h.pericope, h.leitura_do_dia, c);
      assert.ok(contido(versiculos(h.pericope), versiculos(h.leitura_do_dia)), `${c}: o trecho reduzido sai da leitura do dia`);
    }
    assert.deepEqual(ANT.filter((h) => h.sem_trecho).map((h) => h.codigo), SEM_TRECHO);
    for (const c of SEM_TRECHO) {
      assert.equal(porCod.get(c).pericope, null, c);
      assert.ok(!porCod.get(c).correspondencias.some((x) => x.tipo === 'biblica'), `${c}: correspondência bíblica artificial`);
    }
  });

  test('D6 e recusas: paralelas, parciais e ocasiões antigas registradas e nunca usadas', () => {
    let n = 0;
    for (const s of DIST.sermoes) {
      // parcial e paralela recusam uma correspondência BÍBLICA (chave de leituras);
      // ocasiao-antiga e fora-do-calendario recusam uma LITÚRGICA. (O sd05, por exemplo, é litúrgico
      // para as Cinzas, mas a leitura das Cinzas cobre só parte do trecho: a bíblica é recusada.)
      const cs = porCod.get(s.codigo).correspondencias;
      const bib = new Set(cs.filter((c) => c.tipo === 'biblica').map((c) => c.leituras));
      const lit = new Set(cs.filter((c) => c.tipo === 'liturgica').map((c) => c.celebracao));
      for (const x of s.nao_usadas) {
        assert.ok(['parcial', 'paralela', 'ocasiao-antiga', 'fora-do-calendario'].includes(x.classe) && x.motivo, `${s.codigo}: recusa sem classe ou motivo`);
        if (!/^[\w:-]+$/.test(x.alvo)) continue;
        n++;
        const usadas = ['parcial', 'paralela'].includes(x.classe) ? bib : lit;
        assert.ok(!usadas.has(x.alvo), `${s.codigo}: ${x.alvo} recusada (${x.classe}), mas usada`);
      }
    }
    assert.ok(n >= 40, `poucas recusas por chave (${n})`);
    for (const [c, ks] of Object.entries({ sd06: ['QUA-1-domingo-B', 'QUA-1-domingo-C'], sd07: ['QUA-1-domingo-B', 'QUA-1-domingo-C'], sd08: ['QUA-2-domingo-B', 'QUA-2-domingo-C'], sd13: ['ramos-B', 'ramos-C'] })) {
      for (const k of ks) {
        assert.ok(!porCod.get(c).correspondencias.some((x) => x.leituras === k), `${c} associado a ${k} (paralela)`);
        assert.ok(DEC.get(c).nao_usadas.some((x) => x.alvo === k && x.classe === 'paralela'), `${c}: a paralela ${k} não está registrada`);
      }
    }
  });

  test('a página do sermão lê a camada revisada sem mudar o texto, com os avisos das traduções próprias no lugar certo', async () => {
    for (const cod of ['sd50', 'sm04', 'sd02', 'sd01']) {
      const h = porCod.get(cod);
      const t = await HM.carregarTexto(h);
      assert.equal(t.formato, 'antonio');
      assert.ok(t.titulo && t.paragrafos.length > 0, cod);
      const bruto = fs.readFileSync(path.join(RAIZ, 'dados', h.arquivo + '.txt'), 'utf8');
      for (const l of t.paragrafos) assert.ok(bruto.includes(l), `${cod}: linha que não está na revisada`);
      const nums = new Set(t.secoes.flatMap((s) => s.paragrafos.map((p) => String(p.n))));
      for (const a of h.avisos) assert.ok(a.paragrafo === 'temas' || nums.has(String(a.paragrafo)), `${cod}: aviso fora de parágrafo existente`);
    }
    // os 22 avisos e as 5 notas do registro chegam ao índice
    assert.equal(ANT.reduce((s, h) => s + h.avisos.length, 0), 22);
    assert.equal(ANT.reduce((s, h) => s + h.notas.length, 0), 5);
  });
});

describe('Santo Antônio, Etapa 2: prévia (nada publicado) e dias no calendário (2025–2045)', () => {
  const DE = 2025, ATE = 2045;

  test('nada publicado: estado “previa” em todos, e o site não mostra nenhum sermão sem a prévia', () => {
    assert.equal(DIST.estado_da_publicacao, 'previa');
    assert.deepEqual([...new Set(ANT.map((h) => h.estado))], ['previa']);
    HM.definirPrevia(false);
    assert.equal(HM.homilia('antonio-sd50'), null);
    assert.ok(!HM.publicadas().some((h) => h.obra === 'antonio-sermones'));
    for (let n = numeroDia(DE, 1, 1); n <= numeroDia(ATE, 12, 31); n++) {
      const d = cal.dia(isoDeNumero(n));
      for (const op of [null, ...d.opcoes.map((o) => o.id)]) {
        assert.ok(!HM.homiliasDoDia(LD.resolver(d, op)).some((x) => x.homilia.obra === 'antonio-sermones'), `${isoDeNumero(n)}: sermão visível sem a prévia`);
      }
    }
  });

  // Dias esperados, escritos à mão a partir das decisões (independentes de distribuicao.json):
  //   'cel:ID'  a celebração do dia (ou uma memória à escolha) é ID; 'cel:ID-B' idem, no Ano B;
  //   'TC-28-domingo-A', 'TC-20-quinta' (anos I e II), 'QUA-3-quinta', 'PAS-6-segunda', 'ADV-dez20', 'NAT-dez29', 'NAT-jan07'.
  // As leituras do tempo valem nos dias sem celebração própria e nas memórias.
  const ESPERADO = {
    sd02: [], sd03: ['TC-24-sabado'], sd04: ['TC-33-segunda'], sd05: ['cel:cinzas'], sd06: ['QUA-1-domingo-A'], sd07: ['QUA-1-domingo-A'],
    sd08: ['cel:transfiguracao-A', 'QUA-2-domingo-A'], sd09: ['TC-20-domingo-A', 'TC-18-quarta'], sd10: ['QUA-3-quinta', 'TC-27-sexta'],
    sd11: ['TC-17-domingo-B', 'PAS-2-sexta'], sd12: ['QUA-5-quinta'], sd13: ['cel:ramos'], sd14: ['cel:ceiadosenhor'],
    sd15: ['cel:pascoa', 'cel:sabadosanto-B'], sd16: ['cel:pascoa'], sd17: ['cel:divinamisericordia', 'cel:pentecostes', 'cel:saotome'],
    sd18: ['PAS-4-domingo-B', 'PAS-4-segunda'], sd19: ['PAS-6-quinta'], sd20: ['PAS-6-terca'], sd21: ['PAS-6-sabado'], sd22: ['PAS-6-segunda'],
    sd23: ['TC-17-domingo-C', 'TC-27-quinta'], sd24: ['cel:ascensaodosenhor', 'cel:conversaosaopaulo', 'cel:saomarcos'],
    sd25: ['cel:pentecostes'], sd26: ['cel:pentecostes'], sd28: ['TC-26-domingo-C', 'QUA-2-quinta'], sd29: ['TC-31-terca'],
    sd30: ['TC-24-domingo-C', 'TC-31-quinta', 'cel:scj-C'], sd31: ['TC-23-sexta'], sd32: ['TC-5-domingo-C', 'TC-22-quinta'],
    sd33: ['TC-6-domingo-A', 'QUA-1-sexta', 'TC-10-quinta'], sd34: ['TC-5-sabado'], sd35: ['TC-12-quarta'], sd37: ['TC-25-domingo-C', 'TC-31-sexta'],
    sd38: ['TC-33-quinta'], sd39: ['TC-30-domingo-C', 'QUA-3-sabado'], sd40: ['TC-23-domingo-B', 'TC-5-sexta'], sd42: ['TC-15-domingo-C', 'TC-27-segunda'],
    sd43: ['TC-28-domingo-C', 'TC-32-quarta'], sd44: ['TC-8-domingo-A', 'TC-11-sabado'], sd45: ['TC-10-domingo-C', 'TC-24-terca'],
    sd47: ['TC-30-sexta', 'TC-30-sabado'], sd48: [], sd49: ['TC-13-quinta'], sd50: ['TC-28-domingo-A', 'TC-20-quinta'], sd52: ['QUA-4-segunda'],
    sd53: ['TC-24-domingo-A', 'QUA-3-terca', 'TC-19-quinta'], sd54: ['TC-29-domingo-A'], sd55: ['TC-14-segunda'],
    sd57: ['ADV-1-domingo-C', 'TC-34-quinta'], sd58: ['ADV-3-domingo-A'], sd59: ['ADV-3-domingo-C'], sd60: ['ADV-2-domingo-C'],
    sd61: ['cel:natal'], sd62: ['cel:santoestevao'], sd63: ['cel:joaoevangelista'], sd64: ['cel:santosinocentes'], sd65: ['cel:apresentacao'],
    sd66: ['cel:santamaria'], sd67: ['cel:sagradafamilia-C'], sd68: ['cel:epifania'], sd69: ['TC-2-domingo-C', 'cel:NSAparecida', 'NAT-jan07'],
    sd70: ['ADV-1-segunda'], sd71: ['TC-13-terca'],
    sm02: ['cel:natividade'], sm03: ['cel:anunciacao', 'cel:imaculada', 'ADV-4-domingo-B', 'ADV-dez20'],
    sm04: ['cel:apresentacao', 'cel:sagradafamilia-B', 'NAT-dez29'], sm05: ['cel:assuncao'], sm06: ['cel:apresentacao', 'cel:sagradafamilia-B', 'NAT-dez29'],
    sm07: ['cel:anunciacao', 'cel:imaculada', 'ADV-4-domingo-B', 'ADV-dez20'],
    sf01: ['cel:conversaosaopaulo', 'TC-20-terca'], sf02: ['cel:catedra', 'cel:pedroepaulo', 'TC-21-domingo-A', 'TC-18-quinta'],
    sf03: ['cel:saofilipeetiago', 'PAS-5-domingo-A', 'PAS-4-sexta'], sf04: ['PAS-2-segunda', 'PAS-2-terca'], sf05: ['cel:saojoao', 'ADV-dez23'],
    sf06: ['cel:pedroepaulo', 'PAS-3-domingo-C', 'PAS-7-sexta'],
    sd01: [], sd27: [], sd36: [], sd41: [], sd46: [], sd51: [], sd56: [], sd72: [], sm01: [],
  };
  const SEMANA = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
  const PREFIXO = { comum: 'TC', advento: 'ADV', quaresma: 'QUA', pascoa: 'PAS' };
  const dd = (n) => String(n).padStart(2, '0');
  const doTempo = (d) => {
    if (d.tempo === 'natal' && d.mes === 1 && d.subtipo === 'antes-epifania') return `NAT-jan${dd(d.dia)}`;
    if (d.tempo === 'natal' && d.mes === 12 && d.dia >= 29) return `NAT-dez${dd(d.dia)}`;
    if (d.tempo === 'advento' && d.mes === 12 && d.dia >= 17 && d.diaSemana !== 0) return `ADV-dez${dd(d.dia)}`;
    if (!PREFIXO[d.tempo] || d.semana == null) return null;
    return d.diaSemana === 0 ? `${PREFIXO[d.tempo]}-${d.semana}-domingo-${d.cicloDominical}` : `${PREFIXO[d.tempo]}-${d.semana}-${SEMANA[d.diaSemana]}`;
  };
  const leiturasDoTempo = (d) => (d.celebracao.tipo === 'temporal' ? !d.celebracao.id : ['memoria', 'memoria-facultativa'].includes(d.celebracao.grau));
  function diasDe(itens) {
    const out = [];
    for (let n = numeroDia(DE, 1, 1); n <= numeroDia(ATE, 12, 31); n++) {
      const iso = isoDeNumero(n);
      const d = cal.dia(iso);
      const vale = itens.some((it) => {
        const c = it.match(/^cel:([^-]+)(?:-([ABC]))?$/);
        if (c) return (d.celebracao.id === c[1] || d.opcoes.some((o) => o.id === c[1])) && (!c[2] || d.cicloDominical === c[2]);
        const k = doTempo(d);
        return !!k && leiturasDoTempo(d) && (k === it || k.startsWith(it + '-'));
      });
      if (vale) out.push(iso);
    }
    return out;
  }
  // aparições com a prévia ligada
  HM.definirPrevia(true);
  const aparicoes = new Map(ANT.map((h) => [h.id, new Set()]));
  const ordemDoDia = new Map();
  for (let n = numeroDia(DE, 1, 1); n <= numeroDia(ATE, 12, 31); n++) {
    const iso = isoDeNumero(n);
    const d = cal.dia(iso);
    for (const op of [null, ...d.opcoes.map((o) => o.id)]) {
      const lista = HM.homiliasDoDia(LD.resolver(d, op));
      if (!op) ordemDoDia.set(iso, lista.map(({ homilia: h, motivos }) => ({ id: h.id, lit: motivos.some((m) => m.tipo === 'liturgica') })));
      for (const { homilia: h } of lista) if (h.obra === 'antonio-sermones') aparicoes.get(h.id).add(iso);
    }
  }
  HM.definirPrevia(false);

  for (const it of CAT.itens) {
    test(`${it.codigo}: com a prévia, exatamente nos dias calculados pelo calendário`, () => {
      assert.ok(ESPERADO[it.codigo], `defina os dias esperados de ${it.codigo}`);
      const esp = diasDe(ESPERADO[it.codigo]);
      const obs = [...aparicoes.get(`antonio-${it.codigo}`)].sort();
      const falta = esp.filter((x) => !obs.includes(x)), sobra = obs.filter((x) => !esp.includes(x));
      assert.deepEqual({ falta, sobra }, { falta: [], sobra: [] }, `${it.codigo}: dias divergentes`);
      assert.equal(esp.length > 0, porCod.get(it.codigo).situacao === 'calendario', `${it.codigo}: situação incoerente com os dias`);
    });
  }

  test('D5: num dia com vários sermões, primeiro os pregados para a celebração, depois os associados pela leitura', () => {
    let dias = 0;
    for (const [iso, l] of ordemDoDia) {
      if (l.filter((x) => x.id.startsWith('antonio-')).length < 2) continue;
      dias++;
      const primeiraBiblica = l.findIndex((x) => !x.lit);
      if (primeiraBiblica >= 0) assert.ok(l.slice(primeiraBiblica).every((x) => !x.lit), `${iso}: litúrgica depois de bíblica`);
    }
    assert.ok(dias > 100, `poucos dias com vários sermões (${dias})`);
    // 2/2/2027 (terça): a Purificação (sm04, sm06) antes do sermão ligado pela leitura (sd65)
    assert.deepEqual(ordemDoDia.get('2027-02-02').filter((x) => x.id.startsWith('antonio-')).map((x) => [x.id, x.lit]), [['antonio-sm04', true], ['antonio-sm06', true], ['antonio-sd65', false]]);
    // Pentecostes de 2027: sd25 e sd26 (litúrgicas) antes do sd17 (bíblica)
    assert.deepEqual(ordemDoDia.get('2027-05-16').filter((x) => x.id.startsWith('antonio-')).map((x) => x.id), ['antonio-sd25', 'antonio-sd26', 'antonio-sd17']);
    // os rótulos distinguem as duas modalidades
    const h = porCod.get('sm04');
    assert.equal(HM.descreverMotivo(h.correspondencias.find((c) => c.tipo === 'liturgica'), h).rotulo, 'Pregado originalmente para esta celebração');
    assert.equal(HM.descreverMotivo(h.correspondencias.find((c) => c.tipo === 'biblica'), h).rotulo, 'Associado a este dia pela leitura bíblica');
  });

  test('ciclos A, B e C: só no ano em que a leitura é proclamada', () => {
    const em = (iso, cod) => aparicoes.get(`antonio-${cod}`).has(iso);
    // sd50 (Mt 22,1-14): 28º domingo do Tempo Comum só no Ano A
    assert.equal(cal.dia('2026-10-11').cicloDominical, 'A'); assert.ok(em('2026-10-11', 'sd50'));
    assert.equal(cal.dia('2027-10-10').cicloDominical, 'B'); assert.ok(!em('2027-10-10', 'sd50'));
    assert.equal(cal.dia('2028-10-15').cicloDominical, 'C'); assert.ok(!em('2028-10-15', 'sd50'));
    // sd57 (Lc 21,25-27): 1º domingo do Advento só no Ano C (Advento de 2027)
    assert.ok(em('2027-11-28', 'sd57')); assert.ok(!em('2026-11-29', 'sd57')); assert.ok(!em('2028-12-03', 'sd57'));
    // sd59 (Fl 4,4-7): 3º domingo do Advento só no Ano C
    assert.ok(em('2027-12-12', 'sd59')); assert.ok(!em('2026-12-13', 'sd59')); assert.ok(!em('2025-12-14', 'sd59'));
    // sd06 (tentações em Mateus): 1º domingo da Quaresma só no Ano A (D6)
    assert.ok(em('2026-02-22', 'sd06')); assert.ok(!em('2027-02-14', 'sd06')); assert.ok(!em('2028-03-05', 'sd06'));
  });

  test('D8 interrompida: o índice das leituras não foi alterado, e o sd47 está na sexta e no sábado da 30ª semana nos dois anos', () => {
    const ev = (k) => LDI.conjuntos[k][0].find(([s]) => s === 'Evangelho')[1];
    assert.equal(ev('TC-30-sexta-II'), 'Lc 14,1-6');
    assert.equal(ev('TC-30-sabado-II'), 'Lc 14,1.7-11');
    assert.ok(DIST.lecionario.some((x) => /não corrigido/.test(x.estado) && /TC-30-sexta-I/.test(x.descricao)));
    for (const iso of ['2027-10-29', '2027-10-30', '2026-10-30', '2026-10-31']) assert.ok(aparicoes.get('antonio-sd47').has(iso), iso);
  });

  test('D8, depois de conferida numa fonte litúrgica: sexta Lc 14,1-6 e sábado Lc 14,1.7-11 também no ano I', { skip: 'D8 interrompida: aguarda a conferência numa fonte litúrgica (ver distribuicao.json, lecionario)' }, () => {
    const conj = (k) => LDI.conjuntos[k][0];
    assert.deepEqual(conj('TC-30-sexta-I'), [['Primeira leitura', 'Rm 9,1-5'], ['Salmo responsorial', 'Sl 147(147B),12-13.14-15.19-20'], ['Evangelho', 'Lc 14,1-6']]);
    assert.deepEqual(conj('TC-30-sabado-I'), [['Primeira leitura', 'Rm 11,1-2a.11-12.25-29'], ['Salmo responsorial', 'Sl 93'], ['Evangelho', 'Lc 14,1.7-11']]);
    assert.deepEqual(conj('TC-30-sexta-II').map(([s]) => s), ['Primeira leitura', 'Salmo responsorial', 'Evangelho']);
  });
});
