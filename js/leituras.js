/**
 * Leituras da Missa do dia: SÓ as referências bíblicas (qual é a leitura).
 *
 * O site não traz o texto das leituras. Para lê-las, indica a Liturgia
 * Diária da CNBB (LINK_CNBB). As referências ficam em
 * dados/leituras/indice.json, por chave do dia litúrgico; este módulo
 * decide a chave de cada dia (tempo, santoral, alternativas) e devolve os
 * conjuntos de referências.
 */
import { DIAS_CHAVE } from './liturgical-calendar.js';
import * as dados from './dados.js';

export const LINK_CNBB = 'https://www.cnbb.org.br/liturgia-diaria/';

let indice = null;

export async function iniciar() {
  if (indice) return;
  indice = (await dados.json('leituras/indice.json')) || { conjuntos: {} };
}

/** para os testes, que leem o JSON direto do disco */
export function definirIndice(j) { indice = j; }

const dd = (n) => String(n).padStart(2, '0');

/** chave do dia "do tempo" (sem santos) */
export function chaveTemporal(dia) {
  const d = DIAS_CHAVE[dia.diaSemana];
  const w = dia.semana;
  const c = dia.cicloDominical;
  switch (dia.tempo) {
    case 'comum': return dia.diaSemana === 0 ? `TC-${w}-domingo-${c}` : `TC-${w}-${d}-${dia.cicloFerial}`;
    case 'advento':
      if (dia.diaSemana === 0) return `ADV-${w}-domingo-${c}`;
      if (dia.mes === 12 && dia.dia >= 17) return `ADV-dez${dd(dia.dia)}`;
      return `ADV-${w}-${d}`;
    case 'natal':
      if (dia.mes === 12) return `NAT-dez${dd(dia.dia)}`;
      if (dia.subtipo === 'antes-epifania') return `NAT-jan${dd(dia.dia)}`;
      return `NAT-apos-epifania-${d}`;
    case 'quaresma':
      if (w === 0) return `QUA-0-${d}`;
      if (w === 6) return `SS-${d}`;
      return dia.diaSemana === 0 ? `QUA-${w}-domingo-${c}` : `QUA-${w}-${d}`;
    case 'pascoa': return dia.diaSemana === 0 ? `PAS-${w}-domingo-${c}` : `PAS-${w}-${d}`;
    default: return null;
  }
}

/** celebração que o usuário está seguindo neste dia (memória facultativa escolhida, se houver) */
export function celebracaoEscolhida(dia, opcaoId) {
  if (opcaoId && dia.opcoes) {
    const o = dia.opcoes.find((x) => x.id === opcaoId);
    if (o) return { ...o, tipo: 'santo', escolhida: true };
  }
  return dia.celebracao;
}

const primeiraChave = (tabela, lista) => lista.find((k) => k && tabela[k]);

/**
 * Decide quais referências mostrar. Retorna:
 * { chave, conjuntos, alternativas: [{rotulo, chave}], notas, substitutas, celebracao }
 * substitutas = true quando a celebração tem leituras próprias que não estão
 * no índice e o site mostra as do dia de semana.
 */
export function resolver(dia, opcaoId) {
  const cel = celebracaoEscolhida(dia, opcaoId);
  const L = indice.conjuntos;
  const c = dia.cicloDominical, dom = dia.diaSemana === 0;
  const notas = [];
  const alternativas = [];
  const tk = chaveTemporal(dia);
  let chave = null;
  let substitutas = false;

  const id = cel && cel.id;
  if (id === 'natal') {
    chave = primeiraChave(L, ['natal-dia', 'natal-noite', 'natal-aurora']);
    for (const [k, r] of [['natal-vigilia', 'Missa da vigília'], ['natal-noite', 'Missa da noite'], ['natal-aurora', 'Missa da aurora'], ['natal-dia', 'Missa do dia']]) {
      if (L[k]) alternativas.push({ rotulo: r, chave: k });
    }
  } else if (id === 'sabadosanto') {
    chave = primeiraChave(L, [`vigilia-pascal-${c}`]);
    if (chave) notas.push('Durante o dia não se celebra a Missa. As leituras indicadas são as da Vigília Pascal, celebrada na noite santa.');
  } else if (cel && cel.tipo === 'santo') {
    const proprias = [dom ? `santo:${id}-${c}-domingo` : null, `santo:${id}-${c}`, dom ? `santo:${id}-domingo` : null, `santo:${id}`];
    const kp = primeiraChave(L, proprias);
    const memoria = cel.grau === 'memoria' || cel.grau === 'memoria-facultativa';
    if (memoria) {
      // memória: leituras do dia de semana; as próprias do santo, se houver, ficam como opção
      chave = L[tk] ? tk : kp;
      if (kp && kp !== chave) alternativas.push({ rotulo: 'Leituras próprias da memória', chave: kp });
      if (L[tk]) alternativas.unshift({ rotulo: 'Leituras do dia de semana', chave: tk });
    } else {
      chave = kp;
      if (!chave) {
        chave = L[tk] ? tk : null;
        substitutas = !!chave;
        notas.push('As leituras próprias desta celebração não estão no nosso índice; indicamos as do dia de semana. Confira na Liturgia Diária da CNBB.');
      }
    }
  } else if (cel && cel.id) {
    // solenidades e festas móveis (Epifania, Páscoa, Pentecostes...)
    chave = primeiraChave(L, [`${id}-${c}`, id]);
    if (id === 'pascoa' && L[`vigilia-pascal-${c}`]) alternativas.push({ rotulo: 'Vigília Pascal', chave: `vigilia-pascal-${c}` }, { rotulo: 'Missa do dia', chave: 'pascoa' });
  } else {
    chave = L[tk] ? tk : null;
  }
  return {
    chave,
    conjuntos: chave ? L[chave] : null,
    alternativas: alternativas.length > 1 ? alternativas : [],
    substitutas,
    notas,
    celebracao: cel,
  };
}

/** conjuntos de referências de uma chave: [[ [seção, referência], … ], …] */
export const conjuntosDe = (chave) => (indice && indice.conjuntos[chave]) || null;
