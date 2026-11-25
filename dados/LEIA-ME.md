# Dados do site

| Pasta ou arquivo | O que é | Pode editar à mão? |
|---|---|---|
| `calendario/santoral.json` | Santos e festas de data fixa e móveis do Brasil: data, nome, grau e cor | Sim. `"ativo": false` desliga uma celebração sem apagá-la |
| `leituras/indice.json` | Referências bíblicas das leituras da Missa de cada dia litúrgico (só o fato; nenhum texto) | Sim, com cuidado: os testes conferem que cada entrada é só uma referência |
| `homilias/` | Homilias dos santos: textos, registros editoriais, distribuição no calendário e documentos gerados | Siga `homilias/LEIA-ME.md`; vários arquivos são gerados por ferramentas |
| `versoes/versoes.json` | Versões alternativas de textos (hoje nenhuma) | Sim |

## Leituras do dia

O site não traz o texto das leituras. Ele mostra a referência de cada uma e o
link para a Liturgia Diária da CNBB (`js/leituras.js`, `LINK_CNBB`).

As chaves de `leituras/indice.json` seguem o padrão:

- `TC-24-domingo-A`: 24º domingo do Tempo Comum, Ano A;
- `TC-24-segunda-II`: segunda-feira da 24ª semana, Ano II;
- `ADV-dez17` a `ADV-dez24`, `NAT-jan02`…: dias com leituras próprias pela data;
- `santo:<id>`: celebração do santoral (o `id` de `calendario/santoral.json`).

Cada chave tem uma lista de conjuntos de leituras. Quando há mais de um (missa
da vigília e missa do dia, ou leituras à escolha), o site mostra todos.

## Depois de editar

```bash
node --test "ferramentas/testes/*.test.mjs"
```
