/**
 * Limpeza do repositório: nada da CNBB nem do iLiturgia, nenhum PDF protegido.
 *
 * Executar:  node --test "ferramentas/testes/*.test.mjs"
 *
 * Este repositório publica só o trabalho próprio do projeto (homilias
 * conferidas, calendário calculado, referências bíblicas das leituras) e
 * fontes em domínio público ou de uso autorizado. Os testes abaixo impedem
 * que textos litúrgicos ou edições protegidas voltem a entrar por engano.
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

function arquivos(dir = RAIZ, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['.git', 'node_modules'].includes(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) arquivos(p, out); else out.push(path.relative(RAIZ, p).split(path.sep).join('/'));
  }
  return out;
}
const TODOS = arquivos();
const TEXTO = /\.(txt|json|md|js|mjs|py|html|css|yml|webmanifest)$/;

describe('Limpeza: nada da CNBB nem do iLiturgia', () => {
  test('não há pastas de textos litúrgicos (Liturgia Diária, Liturgia das Horas, salmos, cânticos)', () => {
    const proibidas = /^(dados\/(liturgia-diaria|liturgia-das-horas|salmos|canticos)|reservado)\//;
    assert.deepEqual(TODOS.filter((f) => proibidas.test(f)), []);
  });

  test('nenhum arquivo traz texto importado do acervo do iLiturgia', () => {
    const marcas = [/@origem Recursos\/Liturgia das Horas/, /assets\/Resources\/(lecionario|missal)/, /Proclamação do Evangelho de Jesus Cristo/, /Palavra da Salvação/];
    const achados = [];
    for (const f of TODOS.filter((x) => TEXTO.test(x) && x !== 'ferramentas/testes/limpeza.test.mjs')) {
      const t = fs.readFileSync(path.join(RAIZ, f), 'utf8');
      for (const m of marcas) if (m.test(t)) achados.push(`${f}: ${m}`);
    }
    assert.deepEqual(achados, []);
  });

  test('o site não pede arquivos de textos litúrgicos', () => {
    for (const f of TODOS.filter((x) => /^js\/.*\.js$/.test(x))) {
      const t = fs.readFileSync(path.join(RAIZ, f), 'utf8');
      assert.doesNotMatch(t, /['"`]liturgia-(diaria|das-horas)\//, f);
    }
  });
});

describe('Limpeza: nenhuma edição protegida', () => {
  test('os PDFs protegidos (edição crítica do CSA, Vozes, Spilsbury, CCSL) não estão no repositório', () => {
    const protegidos = [/centrostudiantoniani/i, /sermoes-sto\.antonio/i, /Antonius_Patavinus,_Sermones,_EN/i, /para conferencia_homiliae/i];
    assert.deepEqual(TODOS.filter((f) => protegidos.some((r) => r.test(f))), []);
  });

  test('só há PDFs em domínio público: Migne (São Gregório) e a edição francesa de 1883 (Vianney)', () => {
    const pdfs = TODOS.filter((f) => /\.pdf$/i.test(f));
    for (const f of pdfs) assert.match(f, /Texto latino \(Migne, PL 76\)\/|São João Maria Vianney \(1786–1859\)\//, f);
  });
});
