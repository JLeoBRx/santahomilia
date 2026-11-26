# Sermões de Santo Antônio de Pádua

*Sermones dominicales et festivi*: 85 itens. São 72 dominicais (com 7 prólogos
e o epílogo), 7 marianos (com o prólogo) e 6 festivos, na ordem e com os códigos
da edição crítica do Centro Studi Antoniani (sd01–sd72, sm01–sm07, sf01–sf06).

**Situação:** Etapa 1 (colação com o latim) concluída em 24/11/2026, com as
deliberações finais do responsável aplicadas; os 85 itens foram conferidos por
inteiro. Nenhum sermão está publicado no site. A distribuição no calendário é a
Etapa 2.

A validação final das dez retraduções do programa de retradução independente
está pendente: elas passaram pela auditoria complementar e pela revisão
corretiva de 26/11/2026 (abaixo) e aguardam revisão independente. A Etapa 1
não foi declarada aprovada depois disso, e a Etapa 2 não começou.

## Fontes e crédito

- **Tradução de base:** Lírio Católico (liriocatolico.com.br), seção “Sermões
  de Santo Antônio”. O site permite o uso com referência à fonte. Crédito
  obrigatório em qualquer publicação: “Tradução: Lírio Católico
  (liriocatolico.com.br), conferida com o latim e revisada pelo projeto
  Santa Homilia.” O projeto não é autor da tradução recebida.
- **Latim:** edição crítica, Centro Studi Antoniani, Pádua, 1979, consultada
  nos PDFs “Fonti dei Sermones”. O texto é protegido: serve só para conferir.
  Ele **não** é reproduzido aqui; a camada `latim/` guarda só a estrutura
  (seções, parágrafos, páginas).
- **Vozes (2019) e Spilsbury:** só consulta, para achar coincidências e
  conferir passagens que o PDF parece ter perdido. Nenhum texto delas entra na
  revisada.
- Os trechos que o Lírio não traduziu foram traduzidos do latim pelo projeto e
  estão identificados (tipo `traducao-propria` no registro).

## Arquivos

| Arquivo | O que é |
|---|---|
| `catalogo.json` | Os 85 itens: código, título, coleção, página do Lírio, PDF latino e estrutura. Gerado por `ferramentas/homilias/antonio/catalogo.py` |
| `recebida/<código>.txt` | Texto exato da página do Lírio. **Nunca é editado.** |
| `latim/<código>.json` | Estrutura da edição crítica, sem texto |
| `registro-editorial.json` | Todas as decisões: entradas (correções, sugestões, dúvidas…), a colação de cada item e as observações gerais |
| `revisada/<código>.txt` | Gerada: recebida + entradas aplicadas do registro. **Não edite à mão.** |
| `revisao-corretiva-2026-11-26.json` | Histórico da revisão corretiva: texto anterior e texto corrigido de cada um dos dez trechos. Só histórico; não é lido pelo site nem pelos scripts |
| `verificacao-estrutural.json` | Conferência automática da estrutura (seções, parágrafos, lacunas) |
| `AUDITORIA.md` | Gerado do registro: cada decisão, com o latim e a justificativa |
| `sumario.json` | Títulos da edição da Vozes, usados só no catálogo |

## Formato dos arquivos de texto

Cabeçalho (linhas `@origem`, `@camada`, `@sermao`…) e depois blocos separados
por uma linha em branco. Cada bloco começa por uma marca:

- `@titulo`, `@titulo-latino`;
- `@secao N` (a linha seguinte é o título da seção);
- `@temas`;
- `@paragrafo N`;
- `@lacuna N`, um parágrafo que a página do Lírio deixou sem tradução.

## Corrigir uma passagem

1. Acrescente uma entrada em `registro-editorial.json` (`registros`) com:
   - `id` (por exemplo, `SD03-09`), `sermao`, `bloco` (índice do bloco na
     recebida, contado de 0 sem o cabeçalho) e `paragrafo`;
   - `tipo`, `confianca`, `localizacao`;
   - `antes` (copiado exatamente, aparecendo uma só vez no bloco) e `depois`;
   - `latim` (só uma citação curta), `justificativa`, `motivo`, `estado`,
     `fonte_consultada` e `data`.
2. Rode `python3 ferramentas/homilias/antonio/aplicar_alteracoes.py`. Se a
   entrada não puder ser aplicada exatamente, o script para e nada é gravado.
3. Atualize a `colacao` do item, se o resumo mudar, e rode
   `node ferramentas/homilias/gerar_documentos.mjs`.
4. Rode `node --test ferramentas/testes/antonio.test.mjs ferramentas/testes/homilias.test.mjs`.

Só uma correção de confiança **alta** muda o texto. Uma diferença de estilo,
ou uma passagem com mais de uma leitura legítima, não se altera: no máximo,
registre uma sugestão ou dúvida.

Tipos que mudam a revisada quando `estado` é `aplicada`:
- `correcao` (só com confiança alta);
- `estrutura` (mover um parágrafo com `mover_para_depois_do_bloco` ou
  `mover_para_antes_do_bloco`, ou retirar uma linha);
- `problema-fonte` com `depois`;
- `traducao-propria`, que preenche uma `@lacuna`, substitui um parágrafo que a
  página repetiu (`repete_bloco`) ou completa um parágrafo cortado
  (`completa_truncado`) ou, só por decisão registrada do responsável
  (`decisao`), substitui um bloco inteiro do Lírio (`substitui_bloco`).

Outros campos usados nas decisões do responsável:
- `decisao`: data, questão, escolha e texto da decisão; `ressalva: false`
  quando a dúvida ou variante ficou resolvida;
- `aviso`: o aviso que acompanha um trecho traduzido pelo projeto;
- `nota_do_tradutor`, `nota_editorial` e `nota`: notas que saíram do corpo do
  texto e serão mostradas como notas na publicação;
- `titulo_secao` e `inserir_secao_antes`: títulos de seção que a página não
  trazia;
- `substituida_por`: correção que deixou de valer porque o trecho foi
  substituído;
- `retraducao`: data e medições (texto anterior, primeira versão às cegas e
  texto final) das traduções do programa de retradução independente; as
  medições são anteriores à revisão corretiva (`observacao`);
- `revisao_corretiva`: data, critério, resultado e cada alteração da revisão
  corretiva de 26/11/2026 (antes, depois, latim, origem, decisão e
  justificativa);
- `origem_da_aplicacao`: entradas aplicadas depois da colação, por
  deliberação do responsável. Elas não entram nas contagens do resumo da
  colação.

## Desfazer uma correção

Mude o `estado` da entrada para `nao-aplicada` e rode de novo o script e os
testes. A recebida está intacta, então nada se perde.

## O que os testes garantem (`ferramentas/testes/antonio.test.mjs`)

- A recebida é igual ao texto das 85 páginas do Lírio enviadas.
- A revisada é exatamente a recebida mais as entradas aplicadas: nenhuma
  alteração silenciosa.
- A camada `latim/` não tem texto latino, e nenhum PDF foi copiado para
  `dados/`.
- As contagens declaradas no resumo de cada colação batem com o registro.
- As remissões entre entradas (SD00-00) apontam para entradas que existem.
- Um item com dúvida, variante ou tradução própria fica “finalizado com
  ressalvas”, e a ressalva cita a entrada.

## Programa de retradução independente (executado em 25/11/2026)

Decidido em 24/11/2026 e executado em 25/11/2026. O porquê e o protocolo estão
no documento “Programa de retradução independente — Santo Antônio”:
https://claude.ai/artifact/13X1ub34DmHYPCvCV86RDV

Todas as traduções foram feitas às cegas, só a partir do latim, sem o Lírio nem
a Vozes à vista. A régua é a parte do comentário (sem citações) que aparece na
Vozes em sequências de 8 palavras iguais; entre parênteses, a maior sequência.
O campo `retraducao` de cada entrada guarda as três medições.

**Traduções próprias refeitas** (feitas na Etapa 1 com a Vozes aberta para
conferência):

| Entrada | Trecho | Antes | Primeira versão às cegas | Final |
|---|---|---|---|---|
| SD19-02 | sd19 § 7 | 26% (17) | 23% (24) | 14% (10) |
| SM04-05 | fim do sm04 § 5 | 26% (11) | 6% (8) | 6% (8) |
| SD33-03 | sd33 § 1 | 24% (19) | 17% (18) | 12% (12) |
| SD50-01 | sd50 § 1 | 22% (27) | 25% (26) | 3% (9) |
| SD59-02 | sd59 § 3 | 21% (14) | 15% (12) | 15% (12) |
| SM03-06 | sm03 § 10 | 20% (13) | 24% (12) | 4% (8) |

Quando a primeira versão às cegas passou do limite (20% ou sequência acima de
16 palavras), os trechos coincidentes, quase sempre traduções literais de uma
frase formular, foram refeitos a partir do latim. Essa segunda passada foi
revista em 26/11/2026: as mudanças feitas só para diminuir a coincidência
foram revertidas (ver a revisão corretiva, abaixo). As medições das tabelas
são anteriores à revisão.

**Parágrafos do Lírio** (acima de 50% e com sequência de 20 palavras ou mais):
a primeira versão às cegas decidiu.

| Trecho | Lírio | Às cegas | Resultado |
|---|---|---|---|
| sd40 § 2 | 51% (30) | 11% (10) | tradução própria (SD40-20) |
| sd02 § 2 | 51% (27) | 14% (10) | tradução própria (SD02-13) |
| sd61 § 6 | 56% (24) | 20% (17); final 18% (14) | tradução própria (SD61-09) |
| sd54 § 15 | 67% (21) | 16% (12) | tradução própria (SD54-08) |
| sd03 § 1 | 51% (52) | 42% (42) | fica o Lírio: a proximidade vem da fórmula |
| sd13 § 4 | 51% (25) | 33% (24) | fica o Lírio: a proximidade vem da fórmula |

O prólogo sm01 já tinha passado a tradução própria pela questão 4 das
deliberações finais (SM01-05). Os quatro parágrafos substituídos levam o aviso
“Traduzido do latim pelo projeto, em lugar do texto do Lírio (decisão do
responsável).”; a correção SD61-02, que estava no parágrafo substituído, deixou
de ser aplicada.

Medição (para conferir ou medir uma nova tradução):

```
python3 ferramentas/homilias/antonio/medir_coincidencia.py --vozes <PDF ou texto da Vozes> --entradas SD19-02 …
python3 ferramentas/homilias/antonio/medir_coincidencia.py --vozes <…> --paragrafos --min 50
python3 ferramentas/homilias/antonio/medir_coincidencia.py --vozes <…> --arquivo nova_traducao.txt
```

O texto da Vozes é só lido para comparar e não deve ser versionado. A medição
é só informativa: desde 26/11/2026 ela não decide nenhuma tradução.

## Revisão corretiva das dez retraduções (26/11/2026)

Critério fixado pelo responsável: **a fidelidade ao original latino decide a
tradução**. A tradução não se muda para diminuir a coincidência com a Vozes ou
com outra tradução moderna; a semelhança que resulta de uma tradução fiel e
independente não é problema editorial.

O que foi feito, só nos dez trechos do programa:

- as mudanças da segunda passada sem justificativa filológica foram
  revertidas, no todo ou em parte (20); as que melhoravam a fidelidade
  ficaram, com o motivo registrado;
- foram corrigidas as perdas de fidelidade apontadas pela auditoria
  complementar ou achadas na releitura integral (33: 32 da tradução às cegas
  e uma de um ajuste posterior cujo motivo não ficou registrado), entre elas
  “homini regi” (“a um homem rei”), omitido nas duas ocorrências do SD50-01;
- seis marcações de referência foram acertadas pela edição (uso de “cf.” e
  aspas);
- os dez trechos foram relidos por inteiro com o latim (artigos, número,
  sujeito e objeto, posse, referências cristológicas, termos técnicos,
  expressões, omissões e acréscimos, sequência do argumento, referências
  bíblicas). O SD40-20 não precisou de alteração.

| Entrada | Trecho | Alterações | Reversões da segunda passada |
|---|---|---|---|
| SD19-02 | sd19 § 7 | 7 | 4 |
| SM04-05 | fim do sm04 § 5 | 7 | 0 |
| SD33-03 | sd33 § 1 | 4 | 1 |
| SD50-01 | sd50 § 1 | 24 | 13 |
| SD59-02 | sd59 § 3 | 2 | 0 |
| SM03-06 | sm03 § 10 | 6 | 1 |
| SD02-13 | sd02 § 2 | 1 | 0 |
| SD40-20 | sd40 § 2 | 0 | 0 |
| SD54-08 | sd54 § 15 | 3 | 0 |
| SD61-09 | sd61 § 6 | 5 | 1 |

Cada alteração está no campo `revisao_corretiva` da entrada (e na
`AUDITORIA.md`); o texto anterior e o corrigido de cada trecho estão em
`revisao-corretiva-2026-11-26.json`. A origem de cada mudança foi conferida
comparando a primeira versão às cegas com o texto anterior à revisão. A
recebida não foi alterada, e nenhum
texto fora dos dez trechos mudou. O relatório da revisão:
https://claude.ai/artifact/CViJLdg9b3io7VLgn2Wuqi

## Não fazer

- Não editar `recebida/` nem `revisada/` à mão.
- Não copiar texto da edição crítica, da Vozes ou de Spilsbury para o
  repositório; no registro, só citações curtas do latim.
- Não publicar nenhum sermão sem a decisão do responsável (Etapa 2).
