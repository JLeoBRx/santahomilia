/**
 * Utilidades de HTML comuns às telas.
 * (Os textos litúrgicos não são reproduzidos neste site: não há marcação de
 * leituras, salmos ou orações aqui.)
 */
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const ICONE_INFO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>';

export { esc };
