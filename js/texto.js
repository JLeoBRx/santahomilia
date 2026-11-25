/**
 * Leitura do formato de texto por blocos usado em dados/ (ver dados/LEIA-ME.md).
 * Este módulo só interpreta o texto; não gera HTML.
 */

const METADADOS = new Set(['origem', 'documento', 'usos', 'fonte', 'nota-edicao']);

/** Documento de ofício/leitura -> { meta, blocos: [{tipo, arg, texto}] } */
export function lerDocumento(txt) {
  const meta = {};
  const blocos = [];
  let atual = null;
  const linhas = (txt || '').replace(/\r\n?/g, '\n').split('\n');
  for (const linha of linhas) {
    const m = linha.match(/^@([a-z][a-z0-9-]*)(?:\s+(.*))?$/i);
    if (m) {
      const tipo = m[1].toLowerCase();
      const arg = (m[2] || '').trim();
      if (METADADOS.has(tipo) && !atual) { meta[tipo] = arg; continue; }
      if (METADADOS.has(tipo)) { meta[tipo] = arg; continue; }
      atual = { tipo, arg, linhas: [] };
      blocos.push(atual);
      continue;
    }
    if (atual) atual.linhas.push(linha);
  }
  for (const b of blocos) {
    while (b.linhas.length && !b.linhas[b.linhas.length - 1].trim()) b.linhas.pop();
    while (b.linhas.length && !b.linhas[0].trim()) b.linhas.shift();
    b.texto = b.linhas.join('\n');
    delete b.linhas;
  }
  return { meta, blocos };
}
