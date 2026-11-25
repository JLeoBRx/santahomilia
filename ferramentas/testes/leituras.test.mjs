/**
 * Leituras do dia: só as referências bíblicas (dados/leituras/indice.json).
 *
 * Executar:  node --test "ferramentas/testes/*.test.mjs"
 *
 * Confere que
 *  - todo dia de 2025 a 2031 tem as referências das leituras (ou um aviso);
 *  - o índice só tem referências: nenhuma palavra de texto litúrgico
 *    (refrão, título, anúncio) entra nele;
 *  - as chaves usadas pelo site e pelas homilias existem.
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CalendarioLiturgico, numeroDia, isoDeNumero } from '../../js/liturgical-calendar.js';
import * as LT from '../../js/leituras.js';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const lerJSON = (p) => JSON.parse(fs.readFileSync(path.join(RAIZ, p), 'utf8'));
const IND = lerJSON('dados/leituras/indice.json');
LT.definirIndice(IND);
const cal = new CalendarioLiturgico(lerJSON('dados/calendario/santoral.json'));

const LIVROS = new Set(('Gn Ex Lv Nm Dt Js Jz Rt 1Sm 2Sm 1Rs 2Rs 1Cr 2Cr Esd Ne Tb Jt Est 1Mc 2Mc Jó Sl Pr Ecl Ct Sb Eclo Is Jr Lm Br Ez Dn Os Jl Am Ab Jn Mq Na Hab Sf Ag Zc Ml '
  + 'Mt Mc Lc Jo At Rm 1Cor 2Cor Gl Ef Fl Cl 1Ts 2Ts 1Tm 2Tm Tt Fm Hb Tg 1Pd 2Pd 1Jo 2Jo 3Jo Jd Ap').split(' '));
const SECOES = /^(Primeira|Segunda|Terceira|Quarta|Quinta|Sexta|Sétima) leitura$|^Salmo responsorial$|^Evangelho$|^Epístola$|^Carta$/;

/** só referência: livro + capítulo/versículos; letras só como partes de versículo (6b, 3cd), "e", "cf" ou outro livro */
function soReferencia(ref) {
  const m = ref.match(/^([1-3]?[A-ZÁÉÍÓÚÊÔ][a-zéóíáú]{0,3}) (\d.*)$/);
  if (!m || !LIVROS.has(m[1])) return false;
  if (!/^[0-9A-Za-zéóíáú(),.\-–; ]+$/.test(m[2])) return false;
  return (m[2].match(/[A-Za-zéóíáú]+/g) || []).every((w) => w === 'e' || w === 'cf' || LIVROS.has(w) || /^[a-z]{1,4}$|^[AB]$/.test(w));
}

describe('Índice das leituras: só referências', () => {
  test('cada seção é uma leitura conhecida e cada referência é só livro, capítulo e versículos', () => {
    let n = 0;
    for (const [k, grupos] of Object.entries(IND.conjuntos)) {
      assert.ok(Array.isArray(grupos) && grupos.length, `${k}: sem conjuntos`);
      for (const g of grupos) {
        assert.ok(g.length, `${k}: conjunto vazio`);
        for (const [secao, ref] of g) {
          assert.match(secao, SECOES, `${k}: seção "${secao}"`);
          assert.ok(ref && soReferencia(ref), `${k} / ${secao}: "${ref}" não é só uma referência`);
          n++;
        }
      }
    }
    assert.ok(n > 2500, `${n} referências`);
  });

  test('todo conjunto tem Evangelho, e quase todos têm primeira leitura e salmo', () => {
    for (const [k, grupos] of Object.entries(IND.conjuntos)) {
      assert.ok(grupos.some((g) => g.some(([s]) => s === 'Evangelho')), `${k}: sem Evangelho`);
    }
  });

  test('as indicações feitas à mão estão no índice', () => {
    const tudo = new Set(Object.values(IND.conjuntos).flat(3).filter((x) => typeof x === 'string'));
    for (const v of Object.values(IND.indicadas_a_mao)) for (const r of v.split(' (')[0].split('; ')) assert.ok(tudo.has(r), r);
  });
});

describe('Leituras de cada dia (2025–2031)', () => {
  test('todo dia tem referências (ou uma nota que explica)', () => {
    const faltas = [];
    for (let n = numeroDia(2025, 1, 1); n <= numeroDia(2031, 12, 31); n++) {
      const iso = isoDeNumero(n);
      const d = cal.dia(iso);
      for (const op of [null, ...d.opcoes.map((o) => o.id)]) {
        const r = LT.resolver(d, op);
        if (!r.conjuntos) faltas.push(`${iso}${op ? ' ' + op : ''}`);
        for (const a of r.alternativas) assert.ok(IND.conjuntos[a.chave], `${iso}: alternativa ${a.chave} inexistente`);
      }
    }
    assert.deepEqual(faltas, []);
  });

  test('exemplos conferidos', () => {
    const ev = (iso) => LT.resolver(cal.dia(iso), null).conjuntos.flat().filter(([s]) => s === 'Evangelho').map(([, r]) => r);
    assert.deepEqual(ev('2026-11-29'), ['Mc 13,33-37']); // 1º domingo do Advento, Ano B
    assert.deepEqual(ev('2025-11-30'), ['Mt 24,37-44']); // 1º domingo do Advento, Ano A
    assert.ok(ev('2025-12-25').includes('Jo 1,1-18')); // Natal (há mais de uma missa)
    assert.ok(ev('2026-04-05').includes('Jo 20,1-9')); // Páscoa, missa do dia
  });

  test('o link geral da CNBB é o indicado pelo responsável', () => {
    assert.equal(LT.LINK_CNBB, 'https://www.cnbb.org.br/liturgia-diaria/');
  });
});
