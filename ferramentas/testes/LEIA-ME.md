# Testes do calendário litúrgico e das homilias

```bash
node --test "ferramentas/testes/*.test.mjs"
```

Para conferir mais anos à frente (o padrão vai até 2100):

```bash
CALENDARIO_TESTE_ATE=2200 node --test "ferramentas/testes/*.test.mjs"
```

Precisa do Node.js 22.13 ou mais novo (modelo de permissões, usado para isolar
o cálculo de referência). No GitHub, os testes rodam sozinhos a cada push e a
cada pull request (`.github/workflows/testes.yml`).

## O que é conferido

| Arquivo | Grupo | O que verifica |
|---|---|---|
| `calendario.test.mjs` | Dados de referência | Cada ano de `ferramentas/testes/dados/tabela-temporaria-cnbb.json` confere com o cálculo independente e com os dias da semana obrigatórios (Cinzas = quarta, Pentecostes = domingo…). Pega erros de digitação nos próprios dados. |
| | Tabela Temporária | O site produz, para cada ano, Cinzas, Páscoa, Ascensão no Brasil, Pentecostes, Corpus Christi, fim e reinício do Tempo Comum com o número da semana, 1º domingo do Advento e ciclos A/B/C e I/II. |
| | Divergências documentadas | Os 7 erros do PDF do vol. II (ver `7Erros.md`): o teste exige o valor correto e **falha se o site produzir o valor do PDF**. Eles não são exceções. |
| | Particularidades legítimas | Ascensão no domingo, duas letras no ciclo e no ano bissexto, salto na numeração das semanas, Corpus na quinta, Advento entre 27/11 e 3/12: valem em todos os anos e o site as reproduz. |
| | Anos posteriores | Do ano seguinte ao último da tabela até 2100: site × cálculo independente. |
| | Documentação | `7Erros.md` descreve exatamente as divergências e particularidades registradas nos dados. |
| `regras-brasil.test.mjs` | Regras do Brasil | Epifania, Batismo, Ascensão, Corpus, São Pedro e São Paulo, Assunção, Todos os Santos, Finados, Aparecida, São José, Anunciação, Imaculada…: datas confirmadas em fontes e comparação ano a ano com a referência (ver `REGRAS-DO-BRASIL.md`). |
| `independencia.test.mjs` | Independência | A referência não importa nem lê nada; o processo onde ela roda é bloqueado ao tentar ler o motor ou os dados (teste de controle); o motor não lê os dados dos testes; os dois algoritmos de Páscoa concordam de 1583 a 4099. |
| `homilias.test.mjs` | Integridade | Os 41 arquivos da tradução recebida de São Gregório Magno reproduzem, palavra por palavra, o arquivo enviado. |
| | Nenhuma alteração silenciosa | O texto publicado é exatamente a tradução recebida mais as correções registradas como aplicadas (confiança alta); sugestões, dúvidas e variantes não aplicadas continuam intactas; só há texto publicado para homilias conferidas com o latim. |
| | Correspondências | Só litúrgicas ou bíblicas; a referência declarada é a do índice das leituras do dia (`dados/leituras/indice.json`) e os versículos comentados estão contidos nela e na passagem da homilia. |
| | Dias em que aparecem | De 2025 a 2045, cada uma das 40 homilias aparece exatamente nos dias calculados só com o calendário (lista escrita no teste, independente de `distribuicao.json`), e em nenhum outro; datas conferidas à mão; as 9 homilias publicadas antes da Etapa 2 continuam nos mesmos dias. |
| | Documentos | `AUDITORIA.md`, `INVENTARIO.md` e `inventario.json` correspondem aos dados atuais. |
| | Etapa 2 (distribuição) | `indice.json` e `DISTRIBUICAO.md` correspondem a `distribuicao.json`; toda correspondência bíblica publicada é plena pelos critérios declarados; nenhuma correspondência recusada ou em dúvida está no índice; as novas dizem que a homilia não foi pregada para o dia; só 11 litúrgicas, com a ocasião na rubrica crítica ou no texto; decisões D1–D4 registradas. |
| `antonio.test.mjs` | Santo Antônio | A recebida é igual às 85 páginas do Lírio; a revisada é a recebida mais as entradas aplicadas do registro; a camada `latim/` não tem texto latino; contagens, remissões e ressalvas coerentes. |
| `leituras.test.mjs` | Só referências | Cada entrada de `dados/leituras/indice.json` é só livro, capítulo e versículos (nenhuma palavra de refrão, título ou anúncio); todo conjunto tem Evangelho; as indicações feitas à mão estão no índice. |
| | Cada dia | De 2025 a 2031, todo dia (e toda memória facultativa) tem as referências; exemplos conferidos; o link geral é o da Liturgia Diária da CNBB. |
| `limpeza.test.mjs` | Nada da CNBB nem do iLiturgia | Não há pastas de textos litúrgicos; nenhum arquivo traz texto importado do acervo do iLiturgia; o site não pede arquivos de textos litúrgicos. |
| | Nenhuma edição protegida | Os PDFs da edição crítica do CSA, da Vozes, de Spilsbury e da CCSL não estão no repositório; os únicos PDFs são Migne (São Gregório) e a edição francesa de 1883 (Vianney). |

## Por que a referência é independente

`referencia-calendario.mjs` é escrito sem consultar o motor do site e roda
num processo separado (`referencia-isolada.mjs`) que, pelo modelo de
permissões do Node, só pode ler o próprio arquivo. Se alguém fizer a
referência importar `js/` ou ler `dados/`, os testes param com
`ERR_ACCESS_DENIED`.

## Como acrescentar anos depois de 2023

1. Copie de uma fonte oficial (por exemplo, o Diretório da Liturgia da CNBB) os valores do ano.
2. Acrescente um objeto em `"anos"` de `ferramentas/testes/dados/tabela-temporaria-cnbb.json`, com os mesmos campos
   dos anos existentes (datas em `AAAA-MM-DD`).
3. Rode os testes. Se algum valor tiver sido digitado errado, o grupo “Dados de referência” falha e
   indica o campo.

Se uma fonte trouxer um valor que contradiga o cálculo (como os 7 do PDF), registre-o em
`"divergencias_documentadas"` com `valor_pdf`, `valor_correto`, `origem` e `evidencias`, descreva-o
em `7Erros.md`, e guarde em `"anos"` sempre o valor correto.

Datas do Diretório que confirmem uma regra do Brasil vão em `ferramentas/testes/dados/regras-brasil-cnbb.json`
(`datas_confirmadas`, com a fonte).

Os dois arquivos de `ferramentas/testes/dados/` guardam só fatos do calendário
(datas e regras), com a indicação da fonte em que foram conferidos; nenhum texto
litúrgico.
