# Distribuição dos sermões de Santo Antônio no calendário (Etapa 2)

> Gerado por `ferramentas/homilias/aplicar_distribuicao.mjs` a partir de `dados/homilias/antonio/distribuicao.json`. Não edite à mão: altere as decisões no arquivo de distribuição e rode o script.

> **Estado: PRÉVIA, não publicado.** As entradas do índice têm estado “previa”: o site não as mostra; só aparecem com a prévia ligada (endereço com ?previa), para a conferência do responsável. A publicação depende da sua aprovação expressa.

Auditoria que fundamenta esta distribuição: https://claude.ai/artifact/8Ne4wL99JBNg4GN2kNMHfS

## Critérios

- **Correspondência litúrgica.** O sermão foi pregado para uma celebração, segundo o título da edição crítica (Centro Studi Antoniani, 1979), e a mesma celebração existe hoje no calendário do site: a mesma festa ou solenidade. Celebrações antigas não são convertidas em atuais: os domingos que não existem mais (Septuagésima, depois de Pentecostes, depois da Epifania, depois da Páscoa) e os domingos numerados do Advento e da Quaresma entram só pela leitura (D1, D6). Quando a celebração mudou de título, de acento ou de data, a observação histórica é registrada e mostrada (D4).
- **Correspondência bíblica plena.** O dia proclama a leitura que o sermão comenta, e a coincidência é forte: (a) pelo menos 90% do trecho comentado é lido no dia; ou (b) pelo menos 90% da leitura do dia está no trecho comentado, e essa leitura tem pelo menos 5 versículos ou cobre pelo menos metade do trecho comentado. Os mesmos critérios de São Gregório (D1). Versículos contados por ferramentas/homilias/referencias.mjs; meio versículo (16a) conta como versículo inteiro. Compara-se só a seção da leitura que o sermão comenta: o Evangelho; ou a 1ª ou 2ª leitura nos sermões construídos sobre a epístola (sd25, sd59: D3).
- **Trecho comentado.** Santo Antônio divide a leitura do dia em cláusulas e comenta cada uma. O trecho comentado é, em regra, a leitura anunciada no início do sermão, conferida com os versículos citados nas notas da edição; é reduzido quando o sermão não comenta parte da leitura, e não existe quando o sermão não comenta a sua leitura (D1, D2).
- **Parcial.** Coincidência de pelo menos 2 versículos que não atinge a regra da correspondência plena. Documentada; não usada.
- **Paralela.** O mesmo episódio narrado por outro evangelista. O sermão não comenta a leitura proclamada; não usada (D6).
- **Temática.** Ligação só de assunto, de lugar ou de devoção. Nunca usada.
- **Catálogo geral.** Sem correspondência litúrgica nem bíblica plena, o item fica só no catálogo geral do site, sem data litúrgica (D7).
- **Vários sermões no mesmo dia.** Quando mais de um sermão corresponde ao dia, todos aparecem: primeiro os pregados para a celebração (correspondência litúrgica), depois os ligados pela leitura (correspondência bíblica), e a página distingue as duas modalidades (D5).

## Decisões do responsável (D1–D8)

- **D1** (28/11/2026) — Critérios de correspondência. Aprovado. Adotar os critérios já utilizados no projeto de São Gregório, aplicados ao trecho que Santo Antônio efetivamente comenta, e não automaticamente ao Evangelho inteiro indicado no título do sermão. *Aplicação:* criterios; trecho_comentado de cada sermão; verificação automática no script.
- **D2** (28/11/2026) — Trechos reduzidos e sermões sem Evangelho comentado. Aprovado. Aceitar os oito trechos reduzidos e os cinco sermões sem Evangelho comentado, conforme a seção 7 da auditoria. Não criar correspondências bíblicas artificiais para esses cinco sermões. *Aplicação:* reducao em sd07, sd14, sd25, sd48, sd57, sd65, sf03, sf05; sem_trecho em sd02, sd16, sd26, sm02, sm05 (sem correspondência bíblica).
- **D3** (28/11/2026) — sd59 e o 3º Domingo do Advento. Aprovado. Associar SD59, baseado em Filipenses 4,4-7, exclusivamente ao terceiro Domingo do Advento do Ano C, pela segunda leitura. *Aplicação:* sd59: biblicas = [ADV-3-domingo-C, leitura = Segunda leitura].
- **D4a** (28/11/2026) — Purificação e Apresentação do Senhor. Aprovado, com ajuste de redação. SM04 e SM06 podem ser apresentados na atual festa da Apresentação do Senhor, em 2 de fevereiro, preservando os títulos históricos e explicando: “Este sermão foi originalmente intitulado ‘Na Purificação da Bem-aventurada Virgem Maria’ e corresponde à atual festa da Apresentação do Senhor, celebrada em 2 de fevereiro.” Não afirmar que houve apenas uma troca de nome. *Aplicação:* sm04, sm06: liturgica apresentacao, com a descrição pedida e a observação histórica.
- **D4b** (28/11/2026) — Circuncisão do Senhor e 1º de janeiro. Aprovado. SD66 não é classificado como sermão pregado para a atual Solenidade de Santa Maria, Mãe de Deus; pode aparecer em 1º de janeiro por correspondência bíblica com Lc 2,21, com a informação de que o título e o contexto originais dizem respeito à Circuncisão do Senhor. *Aplicação:* sd66: sem liturgica; biblica santamaria com descrição própria; a litúrgica recusada em nao_usadas.
- **D4c** (28/11/2026) — São Filipe e São Tiago. Aprovado, com correção histórica. SF03 pode ser associado à atual festa de 3 de maio; a sequência histórica é 1º de maio, depois 11 de maio, e finalmente 3 de maio, após as respectivas reformas. *Aplicação:* sf03: liturgica saofilipeetiago, com a observação histórica 1º/5 → 11/5 (1955) → 3/5 (1969).
- **D5** (28/11/2026) — Mais de um sermão no mesmo dia. Aprovado. Mostrar todos; primeiro os sermões originalmente destinados à celebração (litúrgica), depois os associados pela leitura (bíblica); a interface distingue as duas modalidades. *Aplicação:* js/homilias.js (ordem) e js/app.js (rótulos “Pregado para esta celebração” e “Associado pela leitura bíblica”).
- **D6** (28/11/2026) — Domingos do Advento e da Quaresma. Aprovado. Restringir as associações ao ciclo litúrgico e à leitura efetivamente proclamada; um sermão que comenta Mateus não é associado aos anos em que o lecionário traz a narrativa segundo Marcos ou Lucas. *Aplicação:* Nenhuma correspondência por domingo de mesmo nome; paralelas registradas como recusadas (sd06, sd07, sd08, sd13).
- **D7** (28/11/2026) — Itens exclusivamente no catálogo. Aprovado. Manter os 11 itens da seção 7 da auditoria só no catálogo geral, sem datas litúrgicas. *Aplicação:* situacao catalogo: sd01, sd02, sd27, sd36, sd41, sd46, sd48, sd51, sd56, sd72, sm01.
- **D8** (28/11/2026) — Correção do índice das leituras (30ª semana do Tempo Comum, ano I). Aprovado como alteração independente, condicionada à conferência numa fonte litúrgica confiável e nos arquivos atuais. *Aplicação:* INTERROMPIDA em 28/11/2026: a inversão foi confirmada nos arquivos atuais e a causa identificada, mas nenhuma fonte litúrgica externa pôde ser consultada neste ambiente. O índice não foi alterado; ver lecionario. Não afeta a distribuição: o sd47 corresponde à sexta e ao sábado da 30ª semana nos dois anos.

## Resumo

| | Quantidade |
|---|---|
| Itens no calendário (página do dia) | 74 |
| Itens só no catálogo geral | 11 (sd01, sd02, sd27, sd36, sd41, sd46, sd48, sd51, sd56, sd72, sm01) |
| Correspondências litúrgicas registradas | 25 (em 25 sermões) |
| Correspondências bíblicas plenas registradas | 150 (em 67 sermões); 31 em domingos do Tempo (ciclos A, B ou C) e 4 em festas quando caem no domingo |
| Correspondências examinadas e recusadas | 100 (ocasião antiga 49, parcial 41, paralela 8, fora do calendário 2) |

## Os 85 itens

Título: o histórico, como na tradição (nunca o nome atual da celebração). Anos: “todo ano” quando ao menos uma correspondência vale em todos os anos (celebrações e dias de semana: o Evangelho dos dias de semana é o mesmo nos anos I e II); “Ano A/B/C” quando depende do ciclo dominical.

| Código | Título histórico | Trecho comentado | Classificação | Dias | Anos | Situação |
|---|---|---|---|---|---|---|
| sd01 | Prólogo | — | — | — | — | catálogo geral |
| sd02 | Domingo da Septuagésima | — | — | — | — | catálogo geral |
| sd03 | Domingo da Sexagésima | Lc 8,4-15 | bíblica | Sábado da 24ª semana do Tempo Comum (anos I e II) | todo ano | calendário |
| sd04 | Domingo da Quinquagésima | Lc 18,31-43 | bíblica | Segunda-feira da 33ª semana do Tempo Comum (anos I e II) | todo ano | calendário |
| sd05 | Início do Jejum | Mt 6,16-21 | litúrgica | Quarta-feira de Cinzas | todo ano | calendário |
| sd06 | Domingo I da Quaresma (I) | Mt 4,1-11 | bíblica | 1º Domingo da Quaresma, Ano A | Ano A | calendário |
| sd07 | Domingo I da Quaresma (II) da Penitência | Mt 4,1-2 (reduzido) | bíblica | 1º Domingo da Quaresma, Ano A | Ano A | calendário |
| sd08 | Domingo II da Quaresma (I) | Mt 17,1-9 | bíblica | 2º Domingo da Quaresma, Ano A; Transfiguração do Senhor (06/08), Ano A | Ano A | calendário |
| sd09 | Domingo II da Quaresma (II) | Mt 15,21-28 | bíblica | Quarta-feira da 18ª semana do Tempo Comum (anos I e II); 20º Domingo do Tempo Comum, Ano A | todo ano; mais no Ano A | calendário |
| sd10 | Domingo III da Quaresma | Lc 11,14-28 | bíblica | Quinta-feira da 3ª semana da Quaresma; Sexta-feira da 27ª semana do Tempo Comum (anos I e II) | todo ano | calendário |
| sd11 | Domingo IV da Quaresma | Jo 6,1-15 | bíblica | Sexta-feira da 2ª semana da Páscoa; 17º Domingo do Tempo Comum, Ano B | todo ano; mais no Ano B | calendário |
| sd12 | Domingo V da Quaresma | Jo 8,46-59 | bíblica | Quinta-feira da 5ª semana da Quaresma | todo ano | calendário |
| sd13 | Domingo de Ramos | Mt 21,1-9 | litúrgica + bíblica | Domingo de Ramos da Paixão do Senhor | todo ano; mais no Ano A | calendário |
| sd14 | Ceia do Senhor (Quinta-feira Santa) | Jo 13,4-8 (reduzido) | litúrgica + bíblica | Quinta-feira Santa — Ceia do Senhor | todo ano | calendário |
| sd15 | Na Páscoa do Senhor | Mc 16,1-7 | litúrgica + bíblica | Domingo da Páscoa na Ressurreição do Senhor; Vigília Pascal, Ano B | todo ano; mais no Ano B | calendário |
| sd16 | Na Ressurreição do Senhor | — | litúrgica | Domingo da Páscoa na Ressurreição do Senhor | todo ano | calendário |
| sd17 | Domingo da Oitava da Páscoa | Jo 20,19-31 | litúrgica + bíblica | 2º Domingo da Páscoa (da Divina Misericórdia); Domingo de Pentecostes; São Tomé, Apóstolo (03/07) | todo ano | calendário |
| sd18 | Domingo II depois da Páscoa | Jo 10,11-16 | bíblica | 4º Domingo da Páscoa, Ano B; Segunda-feira da 4ª semana da Páscoa | todo ano; mais no Ano B | calendário |
| sd19 | Domingo III depois da Páscoa | Jo 16,16-22 | bíblica | Quinta-feira da 6ª semana da Páscoa | todo ano | calendário |
| sd20 | Domingo IV depois da Páscoa | Jo 16,5-14 | bíblica | Terça-feira da 6ª semana da Páscoa | todo ano | calendário |
| sd21 | Domingo V depois da Páscoa | Jo 16,23-30 | bíblica | Sábado da 6ª semana da Páscoa | todo ano | calendário |
| sd22 | Domingo VI depois da Páscoa | Jo 15,26–16,4 | bíblica | Segunda-feira da 6ª semana da Páscoa | todo ano | calendário |
| sd23 | Nas Ladainhas | Lc 11,5-13 | bíblica | 17º Domingo do Tempo Comum, Ano C; Quinta-feira da 27ª semana do Tempo Comum (anos I e II) | todo ano; mais no Ano C | calendário |
| sd24 | Na Ascensão do Senhor | Mc 16,14-20 | litúrgica + bíblica | Ascensão do Senhor; Conversão de São Paulo, Apóstolo (25/01); São Marcos Evangelista (25/04) | todo ano; mais no Ano B | calendário |
| sd25 | Domingo de Pentecostes (I) | At 2,1-4 (reduzido) | litúrgica + bíblica | Domingo de Pentecostes | todo ano | calendário |
| sd26 | Na Festa de Pentecostes (II) | — | litúrgica | Domingo de Pentecostes | todo ano | calendário |
| sd27 | Prólogo | — | — | — | — | catálogo geral |
| sd28 | Domingo I depois de Pentecostes | Lc 16,19-31 | bíblica | Quinta-feira da 2ª semana da Quaresma; 26º Domingo do Tempo Comum, Ano C | todo ano; mais no Ano C | calendário |
| sd29 | Domingo II depois de Pentecostes | Lc 14,16-24 | bíblica | Terça-feira da 31ª semana do Tempo Comum (anos I e II) | todo ano | calendário |
| sd30 | Domingo III depois de Pentecostes | Lc 15,1-10 | bíblica | 24º Domingo do Tempo Comum, Ano C; Quinta-feira da 31ª semana do Tempo Comum (anos I e II); Sagrado Coração de Jesus, Ano C | todo ano; mais no Ano C | calendário |
| sd31 | Domingo IV depois de Pentecostes | Lc 6,36-42 | bíblica | Sexta-feira da 23ª semana do Tempo Comum (anos I e II) | todo ano | calendário |
| sd32 | Domingo V depois de Pentecostes | Lc 5,1-11 | bíblica | Quinta-feira da 22ª semana do Tempo Comum (anos I e II); 5º Domingo do Tempo Comum, Ano C | todo ano; mais no Ano C | calendário |
| sd33 | Domingo VI depois de Pentecostes | Mt 5,20-24 | bíblica | Sexta-feira da 1ª semana da Quaresma; Quinta-feira da 10ª semana do Tempo Comum (anos I e II); 6º Domingo do Tempo Comum, Ano A | todo ano; mais no Ano A | calendário |
| sd34 | Domingo VII depois de Pentecostes | Mc 8,1-9 | bíblica | Sábado da 5ª semana do Tempo Comum (anos I e II) | todo ano | calendário |
| sd35 | Domingo VIII depois de Pentecostes | Mt 7,15-21 | bíblica | Quarta-feira da 12ª semana do Tempo Comum (anos I e II) | todo ano | calendário |
| sd36 | Prólogo | — | — | — | — | catálogo geral |
| sd37 | Domingo IX depois de Pentecostes | Lc 16,1-9 | bíblica | 25º Domingo do Tempo Comum, Ano C; Sexta-feira da 31ª semana do Tempo Comum (anos I e II) | todo ano; mais no Ano C | calendário |
| sd38 | Domingo X depois de Pentecostes | Lc 19,41-47 | bíblica | Quinta-feira da 33ª semana do Tempo Comum (anos I e II) | todo ano | calendário |
| sd39 | Domingo XI depois de Pentecostes | Lc 18,9-14 | bíblica | Sábado da 3ª semana da Quaresma; 30º Domingo do Tempo Comum, Ano C | todo ano; mais no Ano C | calendário |
| sd40 | Domingo XII depois de Pentecostes | Mc 7,31-37 | bíblica | 23º Domingo do Tempo Comum, Ano B; Sexta-feira da 5ª semana do Tempo Comum (anos I e II) | todo ano; mais no Ano B | calendário |
| sd41 | Prólogo | — | — | — | — | catálogo geral |
| sd42 | Domingo XIII depois de Pentecostes | Lc 10,23-37 | bíblica | 15º Domingo do Tempo Comum, Ano C; Segunda-feira da 27ª semana do Tempo Comum (anos I e II) | todo ano; mais no Ano C | calendário |
| sd43 | Domingo XIV depois de Pentecostes | Lc 17,11-19 | bíblica | 28º Domingo do Tempo Comum, Ano C; Quarta-feira da 32ª semana do Tempo Comum (anos I e II) | todo ano; mais no Ano C | calendário |
| sd44 | Domingo XV depois de Pentecostes | Mt 6,24-33 | bíblica | Sábado da 11ª semana do Tempo Comum (anos I e II); 8º Domingo do Tempo Comum, Ano A | todo ano; mais no Ano A | calendário |
| sd45 | Domingo XVI depois de Pentecostes | Lc 7,11-16 | bíblica | 10º Domingo do Tempo Comum, Ano C; Terça-feira da 24ª semana do Tempo Comum (anos I e II) | todo ano; mais no Ano C | calendário |
| sd46 | Prólogo | — | — | — | — | catálogo geral |
| sd47 | Domingo XVII depois de Pentecostes | Lc 14,1-11 | bíblica | Sábado da 30ª semana do Tempo Comum (anos I e II); Sexta-feira da 30ª semana do Tempo Comum (anos I e II) | todo ano | calendário |
| sd48 | Domingo XVIII depois de Pentecostes | Mt 22,41-46 (reduzido) | — | — | — | catálogo geral |
| sd49 | Domingo XIX depois de Pentecostes | Mt 9,1-8 | bíblica | Quinta-feira da 13ª semana do Tempo Comum (anos I e II) | todo ano | calendário |
| sd50 | Domingo XX depois de Pentecostes | Mt 22,1-14 | bíblica | Quinta-feira da 20ª semana do Tempo Comum (anos I e II); 28º Domingo do Tempo Comum, Ano A | todo ano; mais no Ano A | calendário |
| sd51 | Prólogo | — | — | — | — | catálogo geral |
| sd52 | Domingo XXI depois de Pentecostes | Jo 4,46-53 | bíblica | Segunda-feira da 4ª semana da Quaresma | todo ano | calendário |
| sd53 | Domingo XXII depois de Pentecostes | Mt 18,23-35 | bíblica | Terça-feira da 3ª semana da Quaresma; Quinta-feira da 19ª semana do Tempo Comum (anos I e II); 24º Domingo do Tempo Comum, Ano A | todo ano; mais no Ano A | calendário |
| sd54 | Domingo XXIII depois de Pentecostes | Mt 22,15-21 | bíblica | 29º Domingo do Tempo Comum, Ano A | Ano A | calendário |
| sd55 | Domingo XXIV depois de Pentecostes | Mt 9,18-26 | bíblica | Segunda-feira da 14ª semana do Tempo Comum (anos I e II) | todo ano | calendário |
| sd56 | Prólogo | — | — | — | — | catálogo geral |
| sd57 | Domingo I do Advento | Lc 21,25-27 (reduzido) | bíblica | 1º Domingo do Advento, Ano C; Quinta-feira da 34ª semana do Tempo Comum (anos I e II) | todo ano; mais no Ano C | calendário |
| sd58 | Domingo II do Advento | Mt 11,2-10 | bíblica | 3º Domingo do Advento, Ano A | Ano A | calendário |
| sd59 | Domingo III do Advento | Fl 4,4-7 | bíblica | 3º Domingo do Advento, Ano C | Ano C | calendário |
| sd60 | Domingo IV do Advento | Lc 3,1-6 | bíblica | 2º Domingo do Advento, Ano C | Ano C | calendário |
| sd61 | Natal do Senhor | Lc 2,1-14 | litúrgica + bíblica | Natal do Senhor; Natal — Missa da noite | todo ano | calendário |
| sd62 | Festa de Santo Estêvão Protomártir | Mt 23,34-39 | litúrgica | Santo Estêvão, Protomártir (26/12) | todo ano | calendário |
| sd63 | Festa de São João Evangelista | Jo 21,19-24 | litúrgica | São João, Apóstolo e Evangelista (27/12) | todo ano | calendário |
| sd64 | Festa dos Santos Inocentes | Mt 2,13-18 | litúrgica + bíblica | Os Santos Inocentes, Mártires (28/12) | todo ano | calendário |
| sd65 | Domingo I depois do Natal do Senhor | Lc 2,33-38 (reduzido) | bíblica | Apresentação do Senhor (02/02) | todo ano | calendário |
| sd66 | Circuncisão do Senhor | Lc 2,21 | bíblica | Santa Maria, Mãe de Deus | todo ano | calendário |
| sd67 | Domingo II depois do Natal do Senhor | Lc 2,42-52 | bíblica | Sagrada Família, Jesus, Maria e José, Ano C | Ano C | calendário |
| sd68 | Epifania do Senhor | Mt 2,1-12 | litúrgica + bíblica | Epifania do Senhor | todo ano | calendário |
| sd69 | Domingo I depois da Oitava da Epifania | Jo 2,1-11 | bíblica | 7 de janeiro (tempo do Natal); 2º Domingo do Tempo Comum, Ano C; Bem-aventurada Virgem Maria da Conceição Aparecida (12/10) | todo ano; mais no Ano C | calendário |
| sd70 | Domingo II depois da Oitava da Epifania | Mt 8,1-13 | bíblica | Segunda-feira da 1ª semana do Advento | todo ano | calendário |
| sd71 | Domingo III depois da Oitava da Epifania | Mt 8,23-27 | bíblica | Terça-feira da 13ª semana do Tempo Comum (anos I e II) | todo ano | calendário |
| sd72 | Epílogo | — | — | — | — | catálogo geral |
| sm01 | Prólogo aos Quatro Sermões para as Festas da Bem-aventurada Virgem Maria | — | — | — | — | catálogo geral |
| sm02 | Na Natividade da Bem-aventurada Virgem Maria | — | litúrgica | Natividade da Bem-aventurada Virgem Maria (08/09) | todo ano | calendário |
| sm03 | Na Anunciação da Bem-aventurada Virgem Maria (I) | Lc 1,26-38 | litúrgica + bíblica | Anunciação do Senhor (25/03); 4º Domingo do Advento, Ano B; 20 de dezembro (Advento); Imaculada Conceição da Bem-aventurada Virgem Maria (08/12) | todo ano; mais no Ano B | calendário |
| sm04 | Na Purificação da Bem-aventurada Virgem Maria (I) | Lc 2,22-32 | litúrgica + bíblica | Apresentação do Senhor (02/02); 29 de dezembro (oitava do Natal); Sagrada Família, Jesus, Maria e José, Ano B | todo ano; mais no Ano B | calendário |
| sm05 | Na Assunção da Bem-aventurada Virgem Maria | — | litúrgica | Assunção da Bem-aventurada Virgem Maria (15/08) | todo ano | calendário |
| sm06 | Na Festa da Purificação da Bem-aventurada Virgem Maria (II) | Lc 2,22-32 | litúrgica + bíblica | Apresentação do Senhor (02/02); 29 de dezembro (oitava do Natal); Sagrada Família, Jesus, Maria e José, Ano B | todo ano; mais no Ano B | calendário |
| sm07 | Na Anunciação de Santa Maria (II) | Lc 1,26-38 | litúrgica + bíblica | Anunciação do Senhor (25/03); 4º Domingo do Advento, Ano B; 20 de dezembro (Advento); Imaculada Conceição da Bem-aventurada Virgem Maria (08/12) | todo ano; mais no Ano B | calendário |
| sf01 | Na Conversão de São Paulo | Mt 19,27-29 | litúrgica + bíblica | Conversão de São Paulo, Apóstolo (25/01); Terça-feira da 20ª semana do Tempo Comum (anos I e II) | todo ano | calendário |
| sf02 | Cátedra de São Pedro | Mt 16,13-19 | litúrgica + bíblica | Cátedra de São Pedro, Apóstolo (22/02); Quinta-feira da 18ª semana do Tempo Comum (anos I e II); 21º Domingo do Tempo Comum, Ano A; São Pedro e São Paulo, Apóstolos (29/06) | todo ano; mais no Ano A | calendário |
| sf03 | Festa dos Santos Apóstolos Filipe e Tiago | Jo 14,1-10 (reduzido) | litúrgica + bíblica | São Filipe e São Tiago, Apóstolos (03/05); Sexta-feira da 4ª semana da Páscoa; 5º Domingo da Páscoa, Ano A | todo ano; mais no Ano A | calendário |
| sf04 | Invenção da Santa Cruz | Jo 3,1-15 | bíblica | Segunda-feira da 2ª semana da Páscoa; Terça-feira da 2ª semana da Páscoa | todo ano | calendário |
| sf05 | Natividade de São João Batista | Lc 1,57-63 (reduzido) | litúrgica + bíblica | Nascimento de São João Batista (24/06); 23 de dezembro (Advento) | todo ano | calendário |
| sf06 | Festa dos Santos Apóstolos Pedro e Paulo | Jo 21,15-19 | litúrgica + bíblica | São Pedro e São Paulo, Apóstolos (29/06); 3º Domingo da Páscoa, Ano C; Sexta-feira da 7ª semana da Páscoa | todo ano; mais no Ano C | calendário |

## Auditoria individual das correspondências litúrgicas

| Sermão | Celebração atual | Fundamento | Texto mostrado no site | Observação histórica |
|---|---|---|---|---|
| sd05 · Início do Jejum | Quarta-feira de Cinzas | Título na edição crítica: «IN CAPITE IEIUNII». O início do jejum quaresmal (caput ieiunii) é a Quarta-feira de Cinzas. | Pregado para o início do jejum, a Quarta-feira de Cinzas. | — |
| sd13 · Domingo de Ramos | Domingo de Ramos da Paixão do Senhor | Título na edição crítica: «DOMINICA IN RAMIS PALMARUM». | Pregado para o Domingo de Ramos. | — |
| sd14 · Ceia do Senhor (Quinta-feira Santa) | Quinta-feira Santa — Ceia do Senhor | Título na edição crítica: «IN CENA DOMINI». | Pregado para a Ceia do Senhor, na Quinta-feira Santa. | — |
| sd15 · Na Páscoa do Senhor | Domingo da Páscoa na Ressurreição do Senhor | Título na edição crítica: «IN PASCHA DOMINI». | Pregado para a Páscoa do Senhor. | — |
| sd16 · Na Ressurreição do Senhor | Domingo da Páscoa na Ressurreição do Senhor | Título na edição crítica: «IN RESURRECTIONE DOMINI». | Pregado para a Ressurreição do Senhor, na Páscoa. | — |
| sd17 · Domingo da Oitava da Páscoa | 2º Domingo da Páscoa (da Divina Misericórdia) | Título na edição crítica: «DOMINICA IN OCTAVA PASCHAE». O domingo da oitava da Páscoa é o atual 2º Domingo da Páscoa. | Pregado para o domingo da oitava da Páscoa, que é o atual 2º Domingo da Páscoa. | — |
| sd24 · Na Ascensão do Senhor | Ascensão do Senhor | Título na edição crítica: «IN ASCENSIONE DOMINI». | Pregado para a Ascensão do Senhor. | No Brasil, a solenidade é celebrada no domingo seguinte à quinta-feira da Ascensão. |
| sd25 · Domingo de Pentecostes (I) | Domingo de Pentecostes | Título na edição crítica: «DOMINICA PENTECOSTES». | Pregado para o domingo de Pentecostes. | — |
| sd26 · Na Festa de Pentecostes (II) | Domingo de Pentecostes | Título na edição crítica: «IN FESTO PENTECOSTES». | Pregado para a festa de Pentecostes. | — |
| sd61 · Natal do Senhor | Natal do Senhor | Título na edição crítica: «IN NATIVITATE DOMINI». | Pregado para o Natal do Senhor. | — |
| sd62 · Festa de Santo Estêvão Protomártir | Santo Estêvão, Protomártir (26/12) | Título na edição crítica: «IN FESTO S. STEPHANI PROTOMARTYRIS». | Pregado para a festa de Santo Estêvão. | — |
| sd63 · Festa de São João Evangelista | São João, Apóstolo e Evangelista (27/12) | Título na edição crítica: «IN FESTO S. IOANNIS EVANGELISTAE». | Pregado para a festa de São João Evangelista. | — |
| sd64 · Festa dos Santos Inocentes | Os Santos Inocentes, Mártires (28/12) | Título na edição crítica: «IN FESTO SANCTORUM INNOCENTIUM». | Pregado para a festa dos Santos Inocentes. | — |
| sd68 · Epifania do Senhor | Epifania do Senhor | Título na edição crítica: «IN EPIPHANIA DOMINI». | Pregado para a Epifania do Senhor. | No Brasil, a solenidade é celebrada no domingo entre 2 e 8 de janeiro. |
| sm02 · Na Natividade da Bem-aventurada Virgem Maria | Natividade da Bem-aventurada Virgem Maria (08/09) | Título na edição crítica: «IN NATIVITATE BEATAE MARIAE VIRGINIS». | Pregado para a festa da Natividade de Nossa Senhora. | — |
| sm03 · Na Anunciação da Bem-aventurada Virgem Maria (I) | Anunciação do Senhor (25/03) | Título na edição crítica: «IN ANNUNTIATIONE BEATAE MARIAE VIRGINIS». | Este sermão foi originalmente intitulado “Na Anunciação da Bem-aventurada Virgem Maria” e corresponde à atual solenidade da Anunciação do Senhor, celebrada em 25 de março. | No tempo de Santo Antônio, a festa de 25 de março era celebrada como Anunciação da Bem-aventurada Virgem Maria; o calendário reformado em 1969 a celebra como solenidade do Senhor, com o título de Anunciação do Senhor. O Evangelho é o mesmo (Lc 1,26-38). |
| sm04 · Na Purificação da Bem-aventurada Virgem Maria (I) | Apresentação do Senhor (02/02) | Título na edição crítica: «IN PURIFICATIONE BEATAE MARIAE VIRGINIS». Decisão D4a (28/11/2026). | Este sermão foi originalmente intitulado “Na Purificação da Bem-aventurada Virgem Maria” e corresponde à atual festa da Apresentação do Senhor, celebrada em 2 de fevereiro. | No tempo de Santo Antônio, a festa de 2 de fevereiro era celebrada no Ocidente como Purificação da Bem-aventurada Virgem Maria, com acento mariano; o calendário reformado em 1969 a celebra como festa do Senhor, com o título de Apresentação do Senhor. O Evangelho é o mesmo (Lc 2,22-40). A correspondência não significa que o sermão tenha sido pregado para a festa com o sentido e o título atuais. |
| sm05 · Na Assunção da Bem-aventurada Virgem Maria | Assunção da Bem-aventurada Virgem Maria (15/08) | Título na edição crítica: «IN ASSUMPTIONE BEATAE MARIAE VIRGINIS». | Pregado para a festa da Assunção de Nossa Senhora. | No Brasil, a solenidade é celebrada no domingo, quando 15 de agosto cai em dia de semana. |
| sm06 · Na Festa da Purificação da Bem-aventurada Virgem Maria (II) | Apresentação do Senhor (02/02) | Título na edição crítica: «IN FESTO PURIFICATIONIS B. MARIAE VIRGINIS». Decisão D4a (28/11/2026). | Este sermão foi originalmente intitulado “Na Festa da Purificação da Bem-aventurada Virgem Maria” e corresponde à atual festa da Apresentação do Senhor, celebrada em 2 de fevereiro. | No tempo de Santo Antônio, a festa de 2 de fevereiro era celebrada no Ocidente como Purificação da Bem-aventurada Virgem Maria, com acento mariano; o calendário reformado em 1969 a celebra como festa do Senhor, com o título de Apresentação do Senhor. O Evangelho é o mesmo (Lc 2,22-40). A correspondência não significa que o sermão tenha sido pregado para a festa com o sentido e o título atuais. |
| sm07 · Na Anunciação de Santa Maria (II) | Anunciação do Senhor (25/03) | Título na edição crítica: «IN ANNUNTIATIONE SANCTAE MARIAE». | Este sermão foi originalmente intitulado “Na Anunciação de Santa Maria” e corresponde à atual solenidade da Anunciação do Senhor, celebrada em 25 de março. | No tempo de Santo Antônio, a festa de 25 de março era celebrada como Anunciação da Bem-aventurada Virgem Maria; o calendário reformado em 1969 a celebra como solenidade do Senhor, com o título de Anunciação do Senhor. O Evangelho é o mesmo (Lc 1,26-38). |
| sf01 · Na Conversão de São Paulo | Conversão de São Paulo, Apóstolo (25/01) | Título na edição crítica: «IN CONVERSIONE BEATI PAULI». | Pregado para a festa da Conversão de São Paulo. | — |
| sf02 · Cátedra de São Pedro | Cátedra de São Pedro, Apóstolo (22/02) | Título na edição crítica: «IN CATHEDRA SANCTI PETRI». | Pregado para a festa da Cátedra de São Pedro. | — |
| sf03 · Festa dos Santos Apóstolos Filipe e Tiago | São Filipe e São Tiago, Apóstolos (03/05) | Título na edição crítica: «IN FESTIVITATE APOSTOLORUM PHILIPPI ET IACOBI». Decisão D4c (28/11/2026). | Pregado para a festa dos Santos Apóstolos Filipe e Tiago, que o calendário atual celebra em 3 de maio. | No tempo de Santo Antônio, a festa dos Apóstolos Filipe e Tiago era celebrada em 1º de maio. Em 1955, com a instituição de São José Operário em 1º de maio, passou a 11 de maio; na reforma do calendário de 1969, passou a 3 de maio. |
| sf05 · Natividade de São João Batista | Nascimento de São João Batista (24/06) | Título na edição crítica: «IN NATIVITATE SANCTI IOANNIS BAPTISTAE». | Pregado para a solenidade do Nascimento de São João Batista. | — |
| sf06 · Festa dos Santos Apóstolos Pedro e Paulo | São Pedro e São Paulo, Apóstolos (29/06) | Título na edição crítica: «DE SANCTIS APOSTOLIS PETRO ET PAULO». | Pregado para a solenidade dos Apóstolos São Pedro e São Paulo. | No Brasil, a solenidade é celebrada no domingo, quando 29 de junho cai em dia de semana. |

## Auditoria individual das correspondências bíblicas

Cada linha foi recalculada pelo script a partir do índice das leituras; uma correspondência que não satisfizesse a regra seria recusada e nada seria gravado.

| Sermão | Trecho comentado | Dia | Leitura do dia | Versículos em comum | Do trecho | Do dia | Critério | Resultado |
|---|---|---|---|---|---|---|---|---|
| sd03 | Lc 8,4-15 | Sábado da 24ª semana do Tempo Comum, Ano I (`TC-24-sabado-I`) | Evangelho: Lc 8,4-15 | Lc 8,4-15 (12) | 100% | 100% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd03 | Lc 8,4-15 | Sábado da 24ª semana do Tempo Comum, Ano II (`TC-24-sabado-II`) | Evangelho: Lc 8,4-15 | Lc 8,4-15 (12) | 100% | 100% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd04 | Lc 18,31-43 | Segunda-feira da 33ª semana do Tempo Comum, Ano I (`TC-33-segunda-I`) | Evangelho: Lc 18,35-43 | Lc 18,35-43 (9) | 69% | 100% | (b) ao menos 90% da leitura do dia está no trecho comentado, e ela tem 5 versículos ou mais | plena: aceita |
| sd04 | Lc 18,31-43 | Segunda-feira da 33ª semana do Tempo Comum, Ano II (`TC-33-segunda-II`) | Evangelho: Lc 18,35-43 | Lc 18,35-43 (9) | 69% | 100% | (b) ao menos 90% da leitura do dia está no trecho comentado, e ela tem 5 versículos ou mais | plena: aceita |
| sd06 | Mt 4,1-11 | 1º Domingo da Quaresma, Ano A (`QUA-1-domingo-A`) | Evangelho: Mt 4,1-11 | Mt 4,1-11 (11) | 100% | 100% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd07 | Mt 4,1-2 | 1º Domingo da Quaresma, Ano A (`QUA-1-domingo-A`) | Evangelho: Mt 4,1-11 | Mt 4,1-2 (2) | 100% | 18% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd08 | Mt 17,1-9 | 2º Domingo da Quaresma, Ano A (`QUA-2-domingo-A`) | Evangelho: Mt 17,1-9 | Mt 17,1-9 (9) | 100% | 100% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd08 | Mt 17,1-9 | Transfiguração do Senhor (06/08) (`santo:transfiguracao-A`) | Evangelho: Mt 17,1-9 | Mt 17,1-9 (9) | 100% | 100% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd08 | Mt 17,1-9 | celebração transfiguracao-A-domingo (`santo:transfiguracao-A-domingo`) | Evangelho: Mt 17,1-9 | Mt 17,1-9 (9) | 100% | 100% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd09 | Mt 15,21-28 | Quarta-feira da 18ª semana do Tempo Comum, Ano I (`TC-18-quarta-I`) | Evangelho: Mt 15,21-28 | Mt 15,21-28 (8) | 100% | 100% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd09 | Mt 15,21-28 | Quarta-feira da 18ª semana do Tempo Comum, Ano II (`TC-18-quarta-II`) | Evangelho: Mt 15,21-28 | Mt 15,21-28 (8) | 100% | 100% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd09 | Mt 15,21-28 | 20º Domingo do Tempo Comum, Ano A (`TC-20-domingo-A`) | Evangelho: Mt 15,21-28 | Mt 15,21-28 (8) | 100% | 100% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd10 | Lc 11,14-28 | Quinta-feira da 3ª semana da Quaresma (`QUA-3-quinta`) | Evangelho: Lc 11,14-23 | Lc 11,14-23 (10) | 67% | 100% | (b) ao menos 90% da leitura do dia está no trecho comentado, e ela tem 5 versículos ou mais | plena: aceita |
| sd10 | Lc 11,14-28 | Sexta-feira da 27ª semana do Tempo Comum, Ano I (`TC-27-sexta-I`) | Evangelho: Lc 11,15-26 | Lc 11,15-26 (12) | 80% | 100% | (b) ao menos 90% da leitura do dia está no trecho comentado, e ela tem 5 versículos ou mais | plena: aceita |
| sd10 | Lc 11,14-28 | Sexta-feira da 27ª semana do Tempo Comum, Ano II (`TC-27-sexta-II`) | Evangelho: Lc 11,15-26 | Lc 11,15-26 (12) | 80% | 100% | (b) ao menos 90% da leitura do dia está no trecho comentado, e ela tem 5 versículos ou mais | plena: aceita |
| sd11 | Jo 6,1-15 | Sexta-feira da 2ª semana da Páscoa (`PAS-2-sexta`) | Evangelho: Jo 6,1-15 | Jo 6,1-15 (15) | 100% | 100% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd11 | Jo 6,1-15 | 17º Domingo do Tempo Comum, Ano B (`TC-17-domingo-B`) | Evangelho: Jo 6,1-15 | Jo 6,1-15 (15) | 100% | 100% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd12 | Jo 8,46-59 | Quinta-feira da 5ª semana da Quaresma (`QUA-5-quinta`) | Evangelho: Jo 8,51-59 | Jo 8,51-59 (9) | 64% | 100% | (b) ao menos 90% da leitura do dia está no trecho comentado, e ela tem 5 versículos ou mais | plena: aceita |
| sd13 | Mt 21,1-9 | ramos-A (`ramos-A`) | Evangelho: Mt 21,1-11 | Mt 21,1-9 (9) | 100% | 82% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd14 | Jo 13,4-8 | ceiadosenhor (`ceiadosenhor`) | Evangelho: Jo 13,1-15 (o arquivo traz mais 1) | Jo 13,4-8 (5) | 100% | 33% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd15 | Mc 16,1-7 | Vigília Pascal, Ano B (`vigilia-pascal-B`) | Evangelho: Mc 16,1-7 | Mc 16,1-7 (7) | 100% | 100% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd17 | Jo 20,19-31 | 2º Domingo da Páscoa, Ano A (`divinamisericordia-A`) | Evangelho: Jo 20,19-31 | Jo 20,19-31 (13) | 100% | 100% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd17 | Jo 20,19-31 | 2º Domingo da Páscoa, Ano B (`divinamisericordia-B`) | Evangelho: Jo 20,19-31 | Jo 20,19-31 (13) | 100% | 100% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd17 | Jo 20,19-31 | 2º Domingo da Páscoa, Ano C (`divinamisericordia-C`) | Evangelho: Jo 20,19-31 | Jo 20,19-31 (13) | 100% | 100% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd17 | Jo 20,19-31 | Pentecostes (`pentecostes`) | Evangelho: Jo 20,19-23 (o arquivo traz mais 2) | Jo 20,19-23 (5) | 38% | 100% | (b) ao menos 90% da leitura do dia está no trecho comentado, e ela tem 5 versículos ou mais | plena: aceita |
| sd17 | Jo 20,19-31 | São Tomé, Apóstolo (03/07) (`santo:saotome`) | Evangelho: Jo 20,24-29 | Jo 20,24-29 (6) | 46% | 100% | (b) ao menos 90% da leitura do dia está no trecho comentado, e ela tem 5 versículos ou mais | plena: aceita |
| sd18 | Jo 10,11-16 | 4º Domingo da Páscoa, Ano B (`PAS-4-domingo-B`) | Evangelho: Jo 10,11-18 | Jo 10,11-16 (6) | 100% | 75% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd18 | Jo 10,11-16 | Segunda-feira da 4ª semana da Páscoa (`PAS-4-segunda`) | Evangelho: Jo 10,11-18 | Jo 10,11-16 (6) | 100% | 75% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd19 | Jo 16,16-22 | Quinta-feira da 6ª semana da Páscoa (`PAS-6-quinta`) | Evangelho: Jo 16,16-20 | Jo 16,16-20 (5) | 71% | 100% | (b) ao menos 90% da leitura do dia está no trecho comentado, e ela tem 5 versículos ou mais | plena: aceita |
| sd20 | Jo 16,5-14 | Terça-feira da 6ª semana da Páscoa (`PAS-6-terca`) | Evangelho: Jo 16,5-11 | Jo 16,5-11 (7) | 70% | 100% | (b) ao menos 90% da leitura do dia está no trecho comentado, e ela tem 5 versículos ou mais | plena: aceita |
| sd21 | Jo 16,23-30 | Sábado da 6ª semana da Páscoa (`PAS-6-sabado`) | Evangelho: Jo 16,23b-28 | Jo 16,23-28 (6) | 75% | 100% | (b) ao menos 90% da leitura do dia está no trecho comentado, e ela tem 5 versículos ou mais | plena: aceita |
| sd22 | Jo 15,26–16,4 | Segunda-feira da 6ª semana da Páscoa (`PAS-6-segunda`) | Evangelho: Jo 15,26-16,4a | Jo 15,26-27; 16,1-4 (6) | 100% | 100% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd23 | Lc 11,5-13 | 17º Domingo do Tempo Comum, Ano C (`TC-17-domingo-C`) | Evangelho: Lc 11,1-13 | Lc 11,5-13 (9) | 100% | 69% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd23 | Lc 11,5-13 | Quinta-feira da 27ª semana do Tempo Comum, Ano I (`TC-27-quinta-I`) | Evangelho: Lc 11,5-13 | Lc 11,5-13 (9) | 100% | 100% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd23 | Lc 11,5-13 | Quinta-feira da 27ª semana do Tempo Comum, Ano II (`TC-27-quinta-II`) | Evangelho: Lc 11,5-13 | Lc 11,5-13 (9) | 100% | 100% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd24 | Mc 16,14-20 | Ascensão do Senhor, Ano B (`ascensaodosenhor-B`) | Evangelho: Mc 16,15-20 (o arquivo traz mais 1) | Mc 16,15-20 (6) | 86% | 100% | (b) ao menos 90% da leitura do dia está no trecho comentado, e ela tem 5 versículos ou mais | plena: aceita |
| sd24 | Mc 16,14-20 | Conversão de São Paulo, Apóstolo (25/01) (`santo:conversaosaopaulo`) | Evangelho: Mc 16,15-18 | Mc 16,15-18 (4) | 57% | 100% | (b) ao menos 90% da leitura do dia está no trecho comentado, e ela cobre ao menos metade do trecho | plena: aceita |
| sd24 | Mc 16,14-20 | São Marcos Evangelista (25/04) (`santo:saomarcos`) | Evangelho: Mc 16,15-20 | Mc 16,15-20 (6) | 86% | 100% | (b) ao menos 90% da leitura do dia está no trecho comentado, e ela tem 5 versículos ou mais | plena: aceita |
| sd25 | At 2,1-4 | Pentecostes (`pentecostes`) | Primeira leitura: At 2,1-11 (o arquivo traz mais 2) | At 2,1-4 (4) | 100% | 36% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd28 | Lc 16,19-31 | Quinta-feira da 2ª semana da Quaresma (`QUA-2-quinta`) | Evangelho: Lc 16,19-31 | Lc 16,19-31 (13) | 100% | 100% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd28 | Lc 16,19-31 | 26º Domingo do Tempo Comum, Ano C (`TC-26-domingo-C`) | Evangelho: Lc 16,19-31 | Lc 16,19-31 (13) | 100% | 100% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd29 | Lc 14,16-24 | Terça-feira da 31ª semana do Tempo Comum, Ano I (`TC-31-terca-I`) | Evangelho: Lc 14,15-24 | Lc 14,16-24 (9) | 100% | 90% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd29 | Lc 14,16-24 | Terça-feira da 31ª semana do Tempo Comum, Ano II (`TC-31-terca-II`) | Evangelho: Lc 14,15-24 | Lc 14,16-24 (9) | 100% | 90% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd30 | Lc 15,1-10 | 24º Domingo do Tempo Comum, Ano C (`TC-24-domingo-C`) | Evangelho: Lc 15,1-32 | Lc 15,1-10 (10) | 100% | 31% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd30 | Lc 15,1-10 | Quinta-feira da 31ª semana do Tempo Comum, Ano I (`TC-31-quinta-I`) | Evangelho: Lc 15,1-10 | Lc 15,1-10 (10) | 100% | 100% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd30 | Lc 15,1-10 | Quinta-feira da 31ª semana do Tempo Comum, Ano II (`TC-31-quinta-II`) | Evangelho: Lc 15,1-10 | Lc 15,1-10 (10) | 100% | 100% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd30 | Lc 15,1-10 | Sagrado Coração de Jesus, Ano C (`scj-C`) | Evangelho: Lc 15,3-7 | Lc 15,3-7 (5) | 50% | 100% | (b) ao menos 90% da leitura do dia está no trecho comentado, e ela tem 5 versículos ou mais | plena: aceita |
| sd31 | Lc 6,36-42 | Sexta-feira da 23ª semana do Tempo Comum, Ano I (`TC-23-sexta-I`) | Evangelho: Lc 6,39-42 | Lc 6,39-42 (4) | 57% | 100% | (b) ao menos 90% da leitura do dia está no trecho comentado, e ela cobre ao menos metade do trecho | plena: aceita |
| sd31 | Lc 6,36-42 | Sexta-feira da 23ª semana do Tempo Comum, Ano II (`TC-23-sexta-II`) | Evangelho: Lc 6,39-42 | Lc 6,39-42 (4) | 57% | 100% | (b) ao menos 90% da leitura do dia está no trecho comentado, e ela cobre ao menos metade do trecho | plena: aceita |
| sd32 | Lc 5,1-11 | Quinta-feira da 22ª semana do Tempo Comum, Ano I (`TC-22-quinta-I`) | Evangelho: Lc 5,1-11 | Lc 5,1-11 (11) | 100% | 100% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd32 | Lc 5,1-11 | Quinta-feira da 22ª semana do Tempo Comum, Ano II (`TC-22-quinta-II`) | Evangelho: Lc 5,1-11 | Lc 5,1-11 (11) | 100% | 100% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd32 | Lc 5,1-11 | 5º Domingo do Tempo Comum, Ano C (`TC-5-domingo-C`) | Evangelho: Lc 5,1-11 | Lc 5,1-11 (11) | 100% | 100% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd33 | Mt 5,20-24 | Sexta-feira da 1ª semana da Quaresma (`QUA-1-sexta`) | Evangelho: Mt 5,20-26 | Mt 5,20-24 (5) | 100% | 71% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd33 | Mt 5,20-24 | Quinta-feira da 10ª semana do Tempo Comum, Ano I (`TC-10-quinta-I`) | Evangelho: Mt 5,20-26 | Mt 5,20-24 (5) | 100% | 71% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd33 | Mt 5,20-24 | Quinta-feira da 10ª semana do Tempo Comum, Ano II (`TC-10-quinta-II`) | Evangelho: Mt 5,20-26 | Mt 5,20-24 (5) | 100% | 71% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd33 | Mt 5,20-24 | 6º Domingo do Tempo Comum, Ano A (`TC-6-domingo-A`) | Evangelho: Mt 5,17-37 | Mt 5,20-24 (5) | 100% | 24% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd34 | Mc 8,1-9 | Sábado da 5ª semana do Tempo Comum, Ano I (`TC-5-sabado-I`) | Evangelho: Mc 8,1-10 | Mc 8,1-9 (9) | 100% | 90% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd34 | Mc 8,1-9 | Sábado da 5ª semana do Tempo Comum, Ano II (`TC-5-sabado-II`) | Evangelho: Mc 8,1-10 | Mc 8,1-9 (9) | 100% | 90% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd35 | Mt 7,15-21 | Quarta-feira da 12ª semana do Tempo Comum, Ano I (`TC-12-quarta-I`) | Evangelho: Mt 7,15-20 | Mt 7,15-20 (6) | 86% | 100% | (b) ao menos 90% da leitura do dia está no trecho comentado, e ela tem 5 versículos ou mais | plena: aceita |
| sd35 | Mt 7,15-21 | Quarta-feira da 12ª semana do Tempo Comum, Ano II (`TC-12-quarta-II`) | Evangelho: Mt 7,15-20 | Mt 7,15-20 (6) | 86% | 100% | (b) ao menos 90% da leitura do dia está no trecho comentado, e ela tem 5 versículos ou mais | plena: aceita |
| sd37 | Lc 16,1-9 | 25º Domingo do Tempo Comum, Ano C (`TC-25-domingo-C`) | Evangelho: Lc 16,1-13 | Lc 16,1-9 (9) | 100% | 69% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd37 | Lc 16,1-9 | Sexta-feira da 31ª semana do Tempo Comum, Ano I (`TC-31-sexta-I`) | Evangelho: Lc 16,1-8 | Lc 16,1-8 (8) | 89% | 100% | (b) ao menos 90% da leitura do dia está no trecho comentado, e ela tem 5 versículos ou mais | plena: aceita |
| sd37 | Lc 16,1-9 | Sexta-feira da 31ª semana do Tempo Comum, Ano II (`TC-31-sexta-II`) | Evangelho: Lc 16,1-8 | Lc 16,1-8 (8) | 89% | 100% | (b) ao menos 90% da leitura do dia está no trecho comentado, e ela tem 5 versículos ou mais | plena: aceita |
| sd38 | Lc 19,41-47 | Quinta-feira da 33ª semana do Tempo Comum, Ano I (`TC-33-quinta-I`) | Evangelho: Lc 19,41-44 | Lc 19,41-44 (4) | 57% | 100% | (b) ao menos 90% da leitura do dia está no trecho comentado, e ela cobre ao menos metade do trecho | plena: aceita |
| sd38 | Lc 19,41-47 | Quinta-feira da 33ª semana do Tempo Comum, Ano II (`TC-33-quinta-II`) | Evangelho: Lc 19,41-44 | Lc 19,41-44 (4) | 57% | 100% | (b) ao menos 90% da leitura do dia está no trecho comentado, e ela cobre ao menos metade do trecho | plena: aceita |
| sd39 | Lc 18,9-14 | Sábado da 3ª semana da Quaresma (`QUA-3-sabado`) | Evangelho: Lc 18,9-14 | Lc 18,9-14 (6) | 100% | 100% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd39 | Lc 18,9-14 | 30º Domingo do Tempo Comum, Ano C (`TC-30-domingo-C`) | Evangelho: Lc 18,9-14 | Lc 18,9-14 (6) | 100% | 100% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd40 | Mc 7,31-37 | 23º Domingo do Tempo Comum, Ano B (`TC-23-domingo-B`) | Evangelho: Mc 7,31-37 | Mc 7,31-37 (7) | 100% | 100% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd40 | Mc 7,31-37 | Sexta-feira da 5ª semana do Tempo Comum, Ano I (`TC-5-sexta-I`) | Evangelho: Mc 7,31-37 | Mc 7,31-37 (7) | 100% | 100% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd40 | Mc 7,31-37 | Sexta-feira da 5ª semana do Tempo Comum, Ano II (`TC-5-sexta-II`) | Evangelho: Mc 7,31-37 | Mc 7,31-37 (7) | 100% | 100% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd42 | Lc 10,23-37 | 15º Domingo do Tempo Comum, Ano C (`TC-15-domingo-C`) | Evangelho: Lc 10,25-37 | Lc 10,25-37 (13) | 87% | 100% | (b) ao menos 90% da leitura do dia está no trecho comentado, e ela tem 5 versículos ou mais | plena: aceita |
| sd42 | Lc 10,23-37 | Segunda-feira da 27ª semana do Tempo Comum, Ano I (`TC-27-segunda-I`) | Evangelho: Lc 10,25-37 | Lc 10,25-37 (13) | 87% | 100% | (b) ao menos 90% da leitura do dia está no trecho comentado, e ela tem 5 versículos ou mais | plena: aceita |
| sd42 | Lc 10,23-37 | Segunda-feira da 27ª semana do Tempo Comum, Ano II (`TC-27-segunda-II`) | Evangelho: Lc 10,25-37 | Lc 10,25-37 (13) | 87% | 100% | (b) ao menos 90% da leitura do dia está no trecho comentado, e ela tem 5 versículos ou mais | plena: aceita |
| sd43 | Lc 17,11-19 | 28º Domingo do Tempo Comum, Ano C (`TC-28-domingo-C`) | Evangelho: Lc 17,11-19 | Lc 17,11-19 (9) | 100% | 100% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd43 | Lc 17,11-19 | Quarta-feira da 32ª semana do Tempo Comum, Ano I (`TC-32-quarta-I`) | Evangelho: Lc 17,11-19 | Lc 17,11-19 (9) | 100% | 100% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd43 | Lc 17,11-19 | Quarta-feira da 32ª semana do Tempo Comum, Ano II (`TC-32-quarta-II`) | Evangelho: Lc 17,11-19 | Lc 17,11-19 (9) | 100% | 100% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd44 | Mt 6,24-33 | Sábado da 11ª semana do Tempo Comum, Ano I (`TC-11-sabado-I`) | Evangelho: Mt 6,24-34 | Mt 6,24-33 (10) | 100% | 91% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd44 | Mt 6,24-33 | Sábado da 11ª semana do Tempo Comum, Ano II (`TC-11-sabado-II`) | Evangelho: Mt 6,24-34 | Mt 6,24-33 (10) | 100% | 91% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd44 | Mt 6,24-33 | 8º Domingo do Tempo Comum, Ano A (`TC-8-domingo-A`) | Evangelho: Mt 6,24-34 | Mt 6,24-33 (10) | 100% | 91% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd45 | Lc 7,11-16 | 10º Domingo do Tempo Comum, Ano C (`TC-10-domingo-C`) | Evangelho: Lc 7,11-17 | Lc 7,11-16 (6) | 100% | 86% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd45 | Lc 7,11-16 | Terça-feira da 24ª semana do Tempo Comum, Ano I (`TC-24-terca-I`) | Evangelho: Lc 7,11-17 | Lc 7,11-16 (6) | 100% | 86% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd45 | Lc 7,11-16 | Terça-feira da 24ª semana do Tempo Comum, Ano II (`TC-24-terca-II`) | Evangelho: Lc 7,11-17 | Lc 7,11-16 (6) | 100% | 86% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd47 | Lc 14,1-11 | Sábado da 30ª semana do Tempo Comum, Ano I (`TC-30-sabado-I`) | Evangelho: Lc 14,1-6 | Lc 14,1-6 (6) | 55% | 100% | (b) ao menos 90% da leitura do dia está no trecho comentado, e ela tem 5 versículos ou mais | plena: aceita |
| sd47 | Lc 14,1-11 | Sábado da 30ª semana do Tempo Comum, Ano II (`TC-30-sabado-II`) | Evangelho: Lc 14,1.7-11 | Lc 14,1.7-11 (6) | 55% | 100% | (b) ao menos 90% da leitura do dia está no trecho comentado, e ela tem 5 versículos ou mais | plena: aceita |
| sd47 | Lc 14,1-11 | Sexta-feira da 30ª semana do Tempo Comum, Ano I (`TC-30-sexta-I`) | Evangelho: Lc 14,1.7-11 | Lc 14,1.7-11 (6) | 55% | 100% | (b) ao menos 90% da leitura do dia está no trecho comentado, e ela tem 5 versículos ou mais | plena: aceita |
| sd47 | Lc 14,1-11 | Sexta-feira da 30ª semana do Tempo Comum, Ano II (`TC-30-sexta-II`) | Evangelho: Lc 14,1-6 | Lc 14,1-6 (6) | 55% | 100% | (b) ao menos 90% da leitura do dia está no trecho comentado, e ela tem 5 versículos ou mais | plena: aceita |
| sd49 | Mt 9,1-8 | Quinta-feira da 13ª semana do Tempo Comum, Ano I (`TC-13-quinta-I`) | Evangelho: Mt 9,1-8 | Mt 9,1-8 (8) | 100% | 100% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd49 | Mt 9,1-8 | Quinta-feira da 13ª semana do Tempo Comum, Ano II (`TC-13-quinta-II`) | Evangelho: Mt 9,1-8 | Mt 9,1-8 (8) | 100% | 100% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd50 | Mt 22,1-14 | Quinta-feira da 20ª semana do Tempo Comum, Ano I (`TC-20-quinta-I`) | Evangelho: Mt 22,1-14 | Mt 22,1-14 (14) | 100% | 100% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd50 | Mt 22,1-14 | Quinta-feira da 20ª semana do Tempo Comum, Ano II (`TC-20-quinta-II`) | Evangelho: Mt 22,1-14 | Mt 22,1-14 (14) | 100% | 100% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd50 | Mt 22,1-14 | 28º Domingo do Tempo Comum, Ano A (`TC-28-domingo-A`) | Evangelho: Mt 22,1-14 | Mt 22,1-14 (14) | 100% | 100% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd52 | Jo 4,46-53 | Segunda-feira da 4ª semana da Quaresma (`QUA-4-segunda`) | Evangelho: Jo 4,43-54 | Jo 4,46-53 (8) | 100% | 67% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd53 | Mt 18,23-35 | Terça-feira da 3ª semana da Quaresma (`QUA-3-terca`) | Evangelho: Mt 18,21-35 | Mt 18,23-35 (13) | 100% | 87% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd53 | Mt 18,23-35 | Quinta-feira da 19ª semana do Tempo Comum, Ano I (`TC-19-quinta-I`) | Evangelho: Mt 18,21-19,1 | Mt 18,23-35 (13) | 100% | 81% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd53 | Mt 18,23-35 | Quinta-feira da 19ª semana do Tempo Comum, Ano II (`TC-19-quinta-II`) | Evangelho: Mt 18,21-19,1 | Mt 18,23-35 (13) | 100% | 81% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd53 | Mt 18,23-35 | 24º Domingo do Tempo Comum, Ano A (`TC-24-domingo-A`) | Evangelho: Mt 18,21-35 | Mt 18,23-35 (13) | 100% | 87% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd54 | Mt 22,15-21 | 29º Domingo do Tempo Comum, Ano A (`TC-29-domingo-A`) | Evangelho: Mt 22,15-21 | Mt 22,15-21 (7) | 100% | 100% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd55 | Mt 9,18-26 | Segunda-feira da 14ª semana do Tempo Comum, Ano I (`TC-14-segunda-I`) | Evangelho: Mt 9,18-26 | Mt 9,18-26 (9) | 100% | 100% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd55 | Mt 9,18-26 | Segunda-feira da 14ª semana do Tempo Comum, Ano II (`TC-14-segunda-II`) | Evangelho: Mt 9,18-26 | Mt 9,18-26 (9) | 100% | 100% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd57 | Lc 21,25-27 | 1º Domingo do Advento, Ano C (`ADV-1-domingo-C`) | Evangelho: Lc 21,25-28.34-36 | Lc 21,25-27 (3) | 100% | 43% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd57 | Lc 21,25-27 | Quinta-feira da 34ª semana do Tempo Comum, Ano I (`TC-34-quinta-I`) | Evangelho: Lc 21,20-28 | Lc 21,25-27 (3) | 100% | 33% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd57 | Lc 21,25-27 | Quinta-feira da 34ª semana do Tempo Comum, Ano II (`TC-34-quinta-II`) | Evangelho: Lc 21,20-28 | Lc 21,25-27 (3) | 100% | 33% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd58 | Mt 11,2-10 | 3º Domingo do Advento, Ano A (`ADV-3-domingo-A`) | Evangelho: Mt 11,2-11 | Mt 11,2-10 (9) | 100% | 90% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd59 | Fl 4,4-7 | 3º Domingo do Advento, Ano C (`ADV-3-domingo-C`) | Segunda leitura: Fl 4,4-7 | Fl 4,4-7 (4) | 100% | 100% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd60 | Lc 3,1-6 | 2º Domingo do Advento, Ano C (`ADV-2-domingo-C`) | Evangelho: Lc 3,1-6 | Lc 3,1-6 (6) | 100% | 100% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd61 | Lc 2,1-14 | Natal — Missa da noite (`natal-noite`) | Evangelho: Lc 2,1-14 | Lc 2,1-14 (14) | 100% | 100% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd64 | Mt 2,13-18 | Os Santos Inocentes, Mártires (28/12) (`santo:santosinocentes`) | Evangelho: Mt 2,13-18 | Mt 2,13-18 (6) | 100% | 100% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd65 | Lc 2,33-38 | Apresentação do Senhor (02/02) (`santo:apresentacao`) | Evangelho: Lc 2,22-40 | Lc 2,33-38 (6) | 100% | 32% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd65 | Lc 2,33-38 | celebração apresentacao-domingo (`santo:apresentacao-domingo`) | Evangelho: Lc 2,22-40 | Lc 2,33-38 (6) | 100% | 32% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd66 | Lc 2,21 | santamaria (`santamaria`) | Evangelho: Lc 2,16-21 | Lc 2,21 (1) | 100% | 17% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd67 | Lc 2,42-52 | Sagrada Família, Ano C (`sagradafamilia-C`) | Evangelho: Lc 2,41-52 (o arquivo traz mais 1) | Lc 2,42-52 (11) | 100% | 92% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd68 | Mt 2,1-12 | Epifania do Senhor (`epifania`) | Evangelho: Mt 2,1-12 | Mt 2,1-12 (12) | 100% | 100% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd69 | Jo 2,1-11 | 7 de janeiro (tempo do Natal) (`NAT-jan07`) | Evangelho: Jo 2,1-11 | Jo 2,1-11 (11) | 100% | 100% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd69 | Jo 2,1-11 | 2º Domingo do Tempo Comum, Ano C (`TC-2-domingo-C`) | Evangelho: Jo 2,1-11 | Jo 2,1-11 (11) | 100% | 100% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd69 | Jo 2,1-11 | Bem-aventurada Virgem Maria da Conceição Aparecida (12/10) (`santo:NSAparecida`) | Evangelho: Jo 2,1-11 | Jo 2,1-11 (11) | 100% | 100% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd70 | Mt 8,1-13 | Segunda-feira da 1ª semana do Advento (`ADV-1-segunda`) | Evangelho: Mt 8,5-11 | Mt 8,5-11 (7) | 54% | 100% | (b) ao menos 90% da leitura do dia está no trecho comentado, e ela tem 5 versículos ou mais | plena: aceita |
| sd71 | Mt 8,23-27 | Terça-feira da 13ª semana do Tempo Comum, Ano I (`TC-13-terca-I`) | Evangelho: Mt 8,23-27 | Mt 8,23-27 (5) | 100% | 100% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sd71 | Mt 8,23-27 | Terça-feira da 13ª semana do Tempo Comum, Ano II (`TC-13-terca-II`) | Evangelho: Mt 8,23-27 | Mt 8,23-27 (5) | 100% | 100% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sm03 | Lc 1,26-38 | 4º Domingo do Advento, Ano B (`ADV-4-domingo-B`) | Evangelho: Lc 1,26-38 | Lc 1,26-38 (13) | 100% | 100% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sm03 | Lc 1,26-38 | 20 de dezembro (Advento) (`ADV-dez20`) | Evangelho: Lc 1,26-38 | Lc 1,26-38 (13) | 100% | 100% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sm03 | Lc 1,26-38 | Anunciação do Senhor (25/03) (`santo:anunciacao`) | Evangelho: Lc 1,26-38 | Lc 1,26-38 (13) | 100% | 100% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sm03 | Lc 1,26-38 | Imaculada Conceição da Bem-aventurada Virgem Maria (08/12) (`santo:imaculada`) | Evangelho: Lc 1,26-38 | Lc 1,26-38 (13) | 100% | 100% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sm04 | Lc 2,22-32 | 29 de dezembro (oitava do Natal) (`NAT-dez29`) | Evangelho: Lc 2,22-35 | Lc 2,22-32 (11) | 100% | 79% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sm04 | Lc 2,22-32 | Sagrada Família, Ano B (`sagradafamilia-B`) | Evangelho: Lc 2,22-35 | Lc 2,22-32 (11) | 100% | 79% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sm04 | Lc 2,22-32 | Apresentação do Senhor (02/02) (`santo:apresentacao`) | Evangelho: Lc 2,22-40 | Lc 2,22-32 (11) | 100% | 58% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sm04 | Lc 2,22-32 | celebração apresentacao-domingo (`santo:apresentacao-domingo`) | Evangelho: Lc 2,22-40 | Lc 2,22-32 (11) | 100% | 58% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sm06 | Lc 2,22-32 | 29 de dezembro (oitava do Natal) (`NAT-dez29`) | Evangelho: Lc 2,22-35 | Lc 2,22-32 (11) | 100% | 79% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sm06 | Lc 2,22-32 | Sagrada Família, Ano B (`sagradafamilia-B`) | Evangelho: Lc 2,22-35 | Lc 2,22-32 (11) | 100% | 79% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sm06 | Lc 2,22-32 | Apresentação do Senhor (02/02) (`santo:apresentacao`) | Evangelho: Lc 2,22-40 | Lc 2,22-32 (11) | 100% | 58% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sm06 | Lc 2,22-32 | celebração apresentacao-domingo (`santo:apresentacao-domingo`) | Evangelho: Lc 2,22-40 | Lc 2,22-32 (11) | 100% | 58% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sm07 | Lc 1,26-38 | 4º Domingo do Advento, Ano B (`ADV-4-domingo-B`) | Evangelho: Lc 1,26-38 | Lc 1,26-38 (13) | 100% | 100% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sm07 | Lc 1,26-38 | 20 de dezembro (Advento) (`ADV-dez20`) | Evangelho: Lc 1,26-38 | Lc 1,26-38 (13) | 100% | 100% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sm07 | Lc 1,26-38 | Anunciação do Senhor (25/03) (`santo:anunciacao`) | Evangelho: Lc 1,26-38 | Lc 1,26-38 (13) | 100% | 100% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sm07 | Lc 1,26-38 | Imaculada Conceição da Bem-aventurada Virgem Maria (08/12) (`santo:imaculada`) | Evangelho: Lc 1,26-38 | Lc 1,26-38 (13) | 100% | 100% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sf01 | Mt 19,27-29 | Terça-feira da 20ª semana do Tempo Comum, Ano I (`TC-20-terca-I`) | Evangelho: Mt 19,23-30 | Mt 19,27-29 (3) | 100% | 38% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sf01 | Mt 19,27-29 | Terça-feira da 20ª semana do Tempo Comum, Ano II (`TC-20-terca-II`) | Evangelho: Mt 19,23-30 | Mt 19,27-29 (3) | 100% | 38% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sf02 | Mt 16,13-19 | Quinta-feira da 18ª semana do Tempo Comum, Ano I (`TC-18-quinta-I`) | Evangelho: Mt 16,13-23 | Mt 16,13-19 (7) | 100% | 64% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sf02 | Mt 16,13-19 | Quinta-feira da 18ª semana do Tempo Comum, Ano II (`TC-18-quinta-II`) | Evangelho: Mt 16,13-23 | Mt 16,13-19 (7) | 100% | 64% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sf02 | Mt 16,13-19 | 21º Domingo do Tempo Comum, Ano A (`TC-21-domingo-A`) | Evangelho: Mt 16,13-20 | Mt 16,13-19 (7) | 100% | 88% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sf02 | Mt 16,13-19 | Cátedra de São Pedro, Apóstolo (22/02) (`santo:catedra`) | Evangelho: Mt 16,13-19 | Mt 16,13-19 (7) | 100% | 100% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sf02 | Mt 16,13-19 | São Pedro e São Paulo, Apóstolos (29/06) (`santo:pedroepaulo`) | Evangelho: Mt 16,13-19 (o arquivo traz mais 1) | Mt 16,13-19 (7) | 100% | 100% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sf03 | Jo 14,1-10 | Sexta-feira da 4ª semana da Páscoa (`PAS-4-sexta`) | Evangelho: Jo 14,1-6 | Jo 14,1-6 (6) | 60% | 100% | (b) ao menos 90% da leitura do dia está no trecho comentado, e ela tem 5 versículos ou mais | plena: aceita |
| sf03 | Jo 14,1-10 | 5º Domingo da Páscoa, Ano A (`PAS-5-domingo-A`) | Evangelho: Jo 14,1-12 | Jo 14,1-10 (10) | 100% | 83% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sf04 | Jo 3,1-15 | Segunda-feira da 2ª semana da Páscoa (`PAS-2-segunda`) | Evangelho: Jo 3,1-8 | Jo 3,1-8 (8) | 53% | 100% | (b) ao menos 90% da leitura do dia está no trecho comentado, e ela tem 5 versículos ou mais | plena: aceita |
| sf04 | Jo 3,1-15 | Terça-feira da 2ª semana da Páscoa (`PAS-2-terca`) | Evangelho: Jo 3,7b-15 | Jo 3,7-15 (9) | 60% | 100% | (b) ao menos 90% da leitura do dia está no trecho comentado, e ela tem 5 versículos ou mais | plena: aceita |
| sf05 | Lc 1,57-63 | 23 de dezembro (Advento) (`ADV-dez23`) | Evangelho: Lc 1,57-66 | Lc 1,57-63 (7) | 100% | 70% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sf05 | Lc 1,57-63 | Nascimento de São João Batista (24/06) (`santo:saojoao`) | Evangelho: Lc 1,57-66 (o arquivo traz mais 1) | Lc 1,57-63 (7) | 100% | 70% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sf06 | Jo 21,15-19 | 3º Domingo da Páscoa, Ano C (`PAS-3-domingo-C`) | Evangelho: Jo 21,1-19 | Jo 21,15-19 (5) | 100% | 26% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sf06 | Jo 21,15-19 | Sexta-feira da 7ª semana da Páscoa (`PAS-7-sexta`) | Evangelho: Jo 21,15-19 | Jo 21,15-19 (5) | 100% | 100% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |
| sf06 | Jo 21,15-19 | São Pedro e São Paulo, Apóstolos (29/06) (`santo:pedroepaulo`) | Evangelho: Jo 21,15-19 (o arquivo traz mais 1) | Jo 21,15-19 (5) | 100% | 100% | (a) ao menos 90% do trecho comentado é lido no dia | plena: aceita |

## Trechos reduzidos e sermões sem trecho comentado (D2)

- **sd07** (leitura do dia: Mt 4,1-11; trecho usado: Mt 4,1-2): Sermão sobre a penitência, construído sobre o jejum de Jesus no deserto; das notas da edição, só Mt 4,1-2 é citado, e o sermão não trata das três tentações. (decisão D2)
- **sd14** (leitura do dia: Jo 13,1-15; trecho usado: Jo 13,4-8): Comenta o lava-pés (Jo 13,4-8, versículos citados nas notas); não trata do v. 1 nem do “dei-vos o exemplo” (v. 12-15). (decisão D2)
- **sd25** (leitura do dia: At 2,1-11; trecho usado: At 2,1-4): O sermão é sobre a epístola (At 2): comenta a descida do Espírito Santo e as línguas (At 2,1-4); não trata da lista dos povos (v. 5-11). (decisão D2)
- **sd48** (leitura do dia: Mt 22,34-46; trecho usado: Mt 22,41-46): O lema do sermão começa em “Congregatis pharisaeis” (Mt 22,41); a pergunta sobre o grande mandamento (v. 34-40) não é comentada. (decisão D2)
- **sd57** (leitura do dia: Lc 21,25-33; trecho usado: Lc 21,25-27): Os quatro adventos são comentados sobre os sinais e a vinda do Filho do Homem (Lc 21,25-27); a parábola da figueira (v. 29-33) não é comentada. (decisão D2)
- **sd65** (leitura do dia: Lc 2,33-40; trecho usado: Lc 2,33-38): Comenta Simeão e Ana (Lc 2,33-38); o v. 40 não é comentado. (decisão D2)
- **sf03** (leitura do dia: Jo 14,1-13; trecho usado: Jo 14,1-10): Comenta Jo 14,1-10, até a igualdade do Pai e do Filho (v. 9-10); os v. 11-13 não são comentados. (decisão D2)
- **sf05** (leitura do dia: Lc 1,57-68; trecho usado: Lc 1,57-63): Comenta o nascimento, a circuncisão e o nome de João (Lc 1,57-63); o “Benedictus” (v. 67-68) não é comentado. (decisão D2)
- **sd02** (leitura do dia: Mt 20,1-16): O sermão comenta o Gênesis (os dias da criação). Da parábola dos trabalhadores, Evangelho da Septuagésima, usa só o primeiro versículo (Mt 20,1), como moldura; não a comenta. Nenhuma correspondência bíblica é criada para ele (decisão D2).
- **sd16** (leitura do dia: null): Sermão sobre a Ressurreição, construído sobre Ecl 12,5 e outros textos; não comenta um Evangelho. Nenhuma correspondência bíblica é criada para ele (decisão D2).
- **sd26** (leitura do dia: Jo 14,23-31): Do Evangelho da festa cita só Jo 14,26 (e Jo 15,26); não o comenta por cláusulas. Nenhuma correspondência bíblica é criada para ele (decisão D2).
- **sm02** (leitura do dia: Mt 1,1-16): Construído sobre Eclo 50 (“Quasi stella matutina”); a genealogia, Evangelho da festa, só é mencionada. Nenhuma correspondência bíblica é criada para ele (decisão D2).
- **sm05** (leitura do dia: Lc 10,38-42): Construído sobre Eclo 50 (“Quasi vas auri”); o Evangelho antigo da festa (Lc 10,38-42) só é aludido. Nenhuma correspondência bíblica é criada para ele (decisão D2).

## Só no catálogo geral (D7)

- **sd01 · Prólogo**: Prólogo da coleção: não foi pregado para um dia do calendário (decisão D7).
- **sd02 · Domingo da Septuagésima**: O sermão comenta o Gênesis; a Septuagésima não existe mais e a parábola do seu Evangelho só serve de moldura (decisão D7).
- **sd27 · Prólogo**: Prólogo da coleção: não foi pregado para um dia do calendário (decisão D7).
- **sd36 · Prólogo**: Prólogo da coleção: não foi pregado para um dia do calendário (decisão D7).
- **sd41 · Prólogo**: Prólogo da coleção: não foi pregado para um dia do calendário (decisão D7).
- **sd46 · Prólogo**: Prólogo da coleção: não foi pregado para um dia do calendário (decisão D7).
- **sd48 · Domingo XVIII depois de Pentecostes**: O trecho comentado (Mt 22,41-46) não é lido no lecionário atual; o grande mandamento (Mt 22,34-40), lido em outros dias, não é comentado (decisão D7).
- **sd51 · Prólogo**: Prólogo da coleção: não foi pregado para um dia do calendário (decisão D7).
- **sd56 · Prólogo**: Prólogo da coleção: não foi pregado para um dia do calendário (decisão D7).
- **sd72 · Epílogo**: Epílogo da coleção: não foi pregado para um dia do calendário (decisão D7).
- **sm01 · Prólogo aos Quatro Sermões para as Festas da Bem-aventurada Virgem Maria**: Prólogo da coleção: não foi pregado para um dia do calendário (decisão D7).

## Dias com mais de um sermão (D5)

Nos três anos litúrgicos calculados. A página do dia mostra todos: primeiro os pregados para a celebração, depois os associados pela leitura.

- 08/12/2026: sm03, sm07
- 20/12/2026: sm03, sm07
- 27/12/2026: sm04, sm06
- 29/12/2026: sm04, sm06
- 25/01/2027: sd24, sf01
- 02/02/2027: sd65, sm04, sm06
- 28/03/2027: sd15, sd16
- 05/04/2027: sm03, sm07
- 16/05/2027: sd17, sd25, sd26
- 04/07/2027: sf02, sf06
- 08/12/2027: sm03, sm07
- 20/12/2027: sm03, sm07
- 29/12/2027: sm04, sm06
- 25/01/2028: sd24, sf01
- 02/02/2028: sd65, sm04, sm06
- 25/03/2028: sm03, sm07
- 16/04/2028: sd15, sd16
- 04/06/2028: sd17, sd25, sd26
- 02/07/2028: sf02, sf06
- 08/12/2028: sm03, sm07
- 20/12/2028: sm03, sm07
- 29/12/2028: sm04, sm06
- 25/01/2029: sd24, sf01
- 02/02/2029: sd65, sm04, sm06
- 18/02/2029: sd06, sd07
- 01/04/2029: sd15, sd16
- 09/04/2029: sm03, sm07
- 20/05/2029: sd17, sd25, sd26
- 01/07/2029: sf02, sf06

## Correspondências examinadas e recusadas

- **sd02**: *ocasiao-antiga* — Domingo da Septuagésima (ocasião antiga): O domingo do calendário do tempo de Santo Antônio não é convertido num domingo atual (decisões D1 e D6). O sermão entra só pelos dias em que se proclama a leitura que ele comenta.
- **sd03**: *ocasiao-antiga* — Domingo da Sexagésima (ocasião antiga): O domingo do calendário do tempo de Santo Antônio não é convertido num domingo atual (decisões D1 e D6). O sermão entra só pelos dias em que se proclama a leitura que ele comenta.
- **sd04**: *ocasiao-antiga* — Domingo da Quinquagésima (ocasião antiga): O domingo do calendário do tempo de Santo Antônio não é convertido num domingo atual (decisões D1 e D6). O sermão entra só pelos dias em que se proclama a leitura que ele comenta.
- **sd05**: *parcial* — TC-11-quarta-I: Evangelho do dia: Mt 6,1-6.16-18. Em comum com o trecho comentado: Mt 6,16-18 (50% do trecho, 33% da leitura do dia); não atinge a regra da correspondência plena. · *parcial* — TC-11-quarta-II: Evangelho do dia: Mt 6,1-6.16-18. Em comum com o trecho comentado: Mt 6,16-18 (50% do trecho, 33% da leitura do dia); não atinge a regra da correspondência plena. · *parcial* — TC-11-sexta-I: Evangelho do dia: Mt 6,19-23. Em comum com o trecho comentado: Mt 6,19-21 (50% do trecho, 60% da leitura do dia); não atinge a regra da correspondência plena. · *parcial* — TC-11-sexta-II: Evangelho do dia: Mt 6,19-23. Em comum com o trecho comentado: Mt 6,19-21 (50% do trecho, 60% da leitura do dia); não atinge a regra da correspondência plena. · *parcial* — cinzas: Evangelho do dia: Mt 6,1-6.16-18. Em comum com o trecho comentado: Mt 6,16-18 (50% do trecho, 33% da leitura do dia); não atinge a regra da correspondência plena.
- **sd06**: *ocasiao-antiga* — Domingo I da Quaresma (I) (ocasião antiga): O domingo do calendário do tempo de Santo Antônio não é convertido num domingo atual (decisões D1 e D6). O sermão entra só pelos dias em que se proclama a leitura que ele comenta. · *paralela* — QUA-1-domingo-B: Este dia lê Mc 1,12-15, o mesmo episódio em outro evangelista; o sermão comenta Mt 4,1-11 (decisão D6). · *paralela* — QUA-1-domingo-C: Este dia lê Lc 4,1-13, o mesmo episódio em outro evangelista; o sermão comenta Mt 4,1-11 (decisão D6).
- **sd07**: *ocasiao-antiga* — Domingo I da Quaresma (II) da Penitência (ocasião antiga): O domingo do calendário do tempo de Santo Antônio não é convertido num domingo atual (decisões D1 e D6). O sermão entra só pelos dias em que se proclama a leitura que ele comenta. · *paralela* — QUA-1-domingo-B: Este dia lê Mc 1,12-15, o mesmo episódio em outro evangelista; o sermão comenta Mt 4,1-2 (decisão D6). · *paralela* — QUA-1-domingo-C: Este dia lê Lc 4,1-13, o mesmo episódio em outro evangelista; o sermão comenta Mt 4,1-2 (decisão D6).
- **sd08**: *ocasiao-antiga* — Domingo II da Quaresma (I) (ocasião antiga): O domingo do calendário do tempo de Santo Antônio não é convertido num domingo atual (decisões D1 e D6). O sermão entra só pelos dias em que se proclama a leitura que ele comenta. · *paralela* — QUA-2-domingo-B: Este dia lê Mc 9,2-10, o mesmo episódio em outro evangelista; o sermão comenta Mt 17,1-9 (decisão D6). · *paralela* — QUA-2-domingo-C: Este dia lê Lc 9,28b-36, o mesmo episódio em outro evangelista; o sermão comenta Mt 17,1-9 (decisão D6).
- **sd09**: *ocasiao-antiga* — Domingo II da Quaresma (II) (ocasião antiga): O domingo do calendário do tempo de Santo Antônio não é convertido num domingo atual (decisões D1 e D6). O sermão entra só pelos dias em que se proclama a leitura que ele comenta.
- **sd10**: *ocasiao-antiga* — Domingo III da Quaresma (ocasião antiga): O domingo do calendário do tempo de Santo Antônio não é convertido num domingo atual (decisões D1 e D6). O sermão entra só pelos dias em que se proclama a leitura que ele comenta. · *parcial* — TC-27-sabado-I: Evangelho do dia: Lc 11,27-28. Em comum com o trecho comentado: Lc 11,27-28 (13% do trecho, 100% da leitura do dia); não atinge a regra da correspondência plena. · *parcial* — TC-27-sabado-II: Evangelho do dia: Lc 11,27-28. Em comum com o trecho comentado: Lc 11,27-28 (13% do trecho, 100% da leitura do dia); não atinge a regra da correspondência plena. · *parcial* — santo:assuncao: Evangelho do dia: Lc 11,27-28. Em comum com o trecho comentado: Lc 11,27-28 (13% do trecho, 100% da leitura do dia); não atinge a regra da correspondência plena.
- **sd11**: *ocasiao-antiga* — Domingo IV da Quaresma (ocasião antiga): O domingo do calendário do tempo de Santo Antônio não é convertido num domingo atual (decisões D1 e D6). O sermão entra só pelos dias em que se proclama a leitura que ele comenta.
- **sd12**: *ocasiao-antiga* — Domingo V da Quaresma (ocasião antiga): O domingo do calendário do tempo de Santo Antônio não é convertido num domingo atual (decisões D1 e D6). O sermão entra só pelos dias em que se proclama a leitura que ele comenta.
- **sd13**: *paralela* — ramos-B: Este dia lê Mc 11,1-10, o mesmo episódio em outro evangelista; o sermão comenta Mt 21,1-9 (decisão D6). · *paralela* — ramos-C: Este dia lê Lc 19,28-40, o mesmo episódio em outro evangelista; o sermão comenta Mt 21,1-9 (decisão D6).
- **sd18**: *ocasiao-antiga* — Domingo II depois da Páscoa (ocasião antiga): O domingo do calendário do tempo de Santo Antônio não é convertido num domingo atual (decisões D1 e D6). O sermão entra só pelos dias em que se proclama a leitura que ele comenta.
- **sd19**: *ocasiao-antiga* — Domingo III depois da Páscoa (ocasião antiga): O domingo do calendário do tempo de Santo Antônio não é convertido num domingo atual (decisões D1 e D6). O sermão entra só pelos dias em que se proclama a leitura que ele comenta. · *parcial* — PAS-6-sexta: Evangelho do dia: Jo 16,20-23a. Em comum com o trecho comentado: Jo 16,20-22 (43% do trecho, 75% da leitura do dia); não atinge a regra da correspondência plena.
- **sd20**: *ocasiao-antiga* — Domingo IV depois da Páscoa (ocasião antiga): O domingo do calendário do tempo de Santo Antônio não é convertido num domingo atual (decisões D1 e D6). O sermão entra só pelos dias em que se proclama a leitura que ele comenta. · *parcial* — PAS-6-quarta: Evangelho do dia: Jo 16,12-15. Em comum com o trecho comentado: Jo 16,12-14 (30% do trecho, 75% da leitura do dia); não atinge a regra da correspondência plena. · *parcial* — santissimatrindade-C: Evangelho do dia: Jo 16,12-15. Em comum com o trecho comentado: Jo 16,12-14 (30% do trecho, 75% da leitura do dia); não atinge a regra da correspondência plena.
- **sd21**: *ocasiao-antiga* — Domingo V depois da Páscoa (ocasião antiga): O domingo do calendário do tempo de Santo Antônio não é convertido num domingo atual (decisões D1 e D6). O sermão entra só pelos dias em que se proclama a leitura que ele comenta. · *parcial* — PAS-7-segunda: Evangelho do dia: Jo 16,29-33. Em comum com o trecho comentado: Jo 16,29-30 (25% do trecho, 40% da leitura do dia); não atinge a regra da correspondência plena.
- **sd22**: *ocasiao-antiga* — Domingo VI depois da Páscoa (ocasião antiga): O domingo do calendário do tempo de Santo Antônio não é convertido num domingo atual (decisões D1 e D6). O sermão entra só pelos dias em que se proclama a leitura que ele comenta.
- **sd23**: *fora-do-calendario* — Ladainhas (rogações): As Ladainhas (rogações) não estão no calendário atual do Brasil.
- **sd24**: *parcial* — PAS-1-sabado: Evangelho do dia: Mc 16,9-15. Em comum com o trecho comentado: Mc 16,14-15 (29% do trecho, 29% da leitura do dia); não atinge a regra da correspondência plena.
- **sd28**: *ocasiao-antiga* — Domingo I depois de Pentecostes (ocasião antiga): O domingo do calendário do tempo de Santo Antônio não é convertido num domingo atual (decisões D1 e D6). O sermão entra só pelos dias em que se proclama a leitura que ele comenta.
- **sd29**: *ocasiao-antiga* — Domingo II depois de Pentecostes (ocasião antiga): O domingo do calendário do tempo de Santo Antônio não é convertido num domingo atual (decisões D1 e D6). O sermão entra só pelos dias em que se proclama a leitura que ele comenta.
- **sd30**: *ocasiao-antiga* — Domingo III depois de Pentecostes (ocasião antiga): O domingo do calendário do tempo de Santo Antônio não é convertido num domingo atual (decisões D1 e D6). O sermão entra só pelos dias em que se proclama a leitura que ele comenta. · *parcial* — QUA-2-sabado: Evangelho do dia: Lc 15,1-3.11-32. Em comum com o trecho comentado: Lc 15,1-3 (30% do trecho, 12% da leitura do dia); não atinge a regra da correspondência plena. · *parcial* — QUA-4-domingo-C: Evangelho do dia: Lc 15,1-3.11-32. Em comum com o trecho comentado: Lc 15,1-3 (30% do trecho, 12% da leitura do dia); não atinge a regra da correspondência plena.
- **sd31**: *ocasiao-antiga* — Domingo IV depois de Pentecostes (ocasião antiga): O domingo do calendário do tempo de Santo Antônio não é convertido num domingo atual (decisões D1 e D6). O sermão entra só pelos dias em que se proclama a leitura que ele comenta. · *parcial* — QUA-2-segunda: Evangelho do dia: Lc 6,36-38. Em comum com o trecho comentado: Lc 6,36-38 (43% do trecho, 100% da leitura do dia); não atinge a regra da correspondência plena. · *parcial* — TC-23-quinta-I: Evangelho do dia: Lc 6,27-38. Em comum com o trecho comentado: Lc 6,36-38 (43% do trecho, 25% da leitura do dia); não atinge a regra da correspondência plena. · *parcial* — TC-23-quinta-II: Evangelho do dia: Lc 6,27-38. Em comum com o trecho comentado: Lc 6,36-38 (43% do trecho, 25% da leitura do dia); não atinge a regra da correspondência plena. · *parcial* — TC-7-domingo-C: Evangelho do dia: Lc 6,27-38. Em comum com o trecho comentado: Lc 6,36-38 (43% do trecho, 25% da leitura do dia); não atinge a regra da correspondência plena. · *parcial* — TC-8-domingo-C: Evangelho do dia: Lc 6,39-45. Em comum com o trecho comentado: Lc 6,39-42 (57% do trecho, 57% da leitura do dia); não atinge a regra da correspondência plena.
- **sd32**: *ocasiao-antiga* — Domingo V depois de Pentecostes (ocasião antiga): O domingo do calendário do tempo de Santo Antônio não é convertido num domingo atual (decisões D1 e D6). O sermão entra só pelos dias em que se proclama a leitura que ele comenta.
- **sd33**: *ocasiao-antiga* — Domingo VI depois de Pentecostes (ocasião antiga): O domingo do calendário do tempo de Santo Antônio não é convertido num domingo atual (decisões D1 e D6). O sermão entra só pelos dias em que se proclama a leitura que ele comenta.
- **sd34**: *ocasiao-antiga* — Domingo VII depois de Pentecostes (ocasião antiga): O domingo do calendário do tempo de Santo Antônio não é convertido num domingo atual (decisões D1 e D6). O sermão entra só pelos dias em que se proclama a leitura que ele comenta.
- **sd35**: *ocasiao-antiga* — Domingo VIII depois de Pentecostes (ocasião antiga): O domingo do calendário do tempo de Santo Antônio não é convertido num domingo atual (decisões D1 e D6). O sermão entra só pelos dias em que se proclama a leitura que ele comenta.
- **sd37**: *ocasiao-antiga* — Domingo IX depois de Pentecostes (ocasião antiga): O domingo do calendário do tempo de Santo Antônio não é convertido num domingo atual (decisões D1 e D6). O sermão entra só pelos dias em que se proclama a leitura que ele comenta.
- **sd38**: *ocasiao-antiga* — Domingo X depois de Pentecostes (ocasião antiga): O domingo do calendário do tempo de Santo Antônio não é convertido num domingo atual (decisões D1 e D6). O sermão entra só pelos dias em que se proclama a leitura que ele comenta. · *parcial* — TC-33-sexta-I: Evangelho do dia: Lc 19,45-48. Em comum com o trecho comentado: Lc 19,45-47 (43% do trecho, 75% da leitura do dia); não atinge a regra da correspondência plena. · *parcial* — TC-33-sexta-II: Evangelho do dia: Lc 19,45-48. Em comum com o trecho comentado: Lc 19,45-47 (43% do trecho, 75% da leitura do dia); não atinge a regra da correspondência plena.
- **sd39**: *ocasiao-antiga* — Domingo XI depois de Pentecostes (ocasião antiga): O domingo do calendário do tempo de Santo Antônio não é convertido num domingo atual (decisões D1 e D6). O sermão entra só pelos dias em que se proclama a leitura que ele comenta.
- **sd40**: *ocasiao-antiga* — Domingo XII depois de Pentecostes (ocasião antiga): O domingo do calendário do tempo de Santo Antônio não é convertido num domingo atual (decisões D1 e D6). O sermão entra só pelos dias em que se proclama a leitura que ele comenta.
- **sd42**: *ocasiao-antiga* — Domingo XIII depois de Pentecostes (ocasião antiga): O domingo do calendário do tempo de Santo Antônio não é convertido num domingo atual (decisões D1 e D6). O sermão entra só pelos dias em que se proclama a leitura que ele comenta. · *parcial* — ADV-1-terca: Evangelho do dia: Lc 10,21-24. Em comum com o trecho comentado: Lc 10,23-24 (13% do trecho, 50% da leitura do dia); não atinge a regra da correspondência plena. · *parcial* — TC-26-sabado-I: Evangelho do dia: Lc 10,17-24. Em comum com o trecho comentado: Lc 10,23-24 (13% do trecho, 25% da leitura do dia); não atinge a regra da correspondência plena. · *parcial* — TC-26-sabado-II: Evangelho do dia: Lc 10,17-24. Em comum com o trecho comentado: Lc 10,23-24 (13% do trecho, 25% da leitura do dia); não atinge a regra da correspondência plena.
- **sd43**: *ocasiao-antiga* — Domingo XIV depois de Pentecostes (ocasião antiga): O domingo do calendário do tempo de Santo Antônio não é convertido num domingo atual (decisões D1 e D6). O sermão entra só pelos dias em que se proclama a leitura que ele comenta.
- **sd44**: *ocasiao-antiga* — Domingo XV depois de Pentecostes (ocasião antiga): O domingo do calendário do tempo de Santo Antônio não é convertido num domingo atual (decisões D1 e D6). O sermão entra só pelos dias em que se proclama a leitura que ele comenta.
- **sd45**: *ocasiao-antiga* — Domingo XVI depois de Pentecostes (ocasião antiga): O domingo do calendário do tempo de Santo Antônio não é convertido num domingo atual (decisões D1 e D6). O sermão entra só pelos dias em que se proclama a leitura que ele comenta.
- **sd47**: *ocasiao-antiga* — Domingo XVII depois de Pentecostes (ocasião antiga): O domingo do calendário do tempo de Santo Antônio não é convertido num domingo atual (decisões D1 e D6). O sermão entra só pelos dias em que se proclama a leitura que ele comenta. · *parcial* — TC-22-domingo-C: Evangelho do dia: Lc 14,1.7-14. Em comum com o trecho comentado: Lc 14,1.7-11 (55% do trecho, 67% da leitura do dia); não atinge a regra da correspondência plena.
- **sd48**: *ocasiao-antiga* — Domingo XVIII depois de Pentecostes (ocasião antiga): O domingo do calendário do tempo de Santo Antônio não é convertido num domingo atual (decisões D1 e D6). O sermão entra só pelos dias em que se proclama a leitura que ele comenta.
- **sd49**: *ocasiao-antiga* — Domingo XIX depois de Pentecostes (ocasião antiga): O domingo do calendário do tempo de Santo Antônio não é convertido num domingo atual (decisões D1 e D6). O sermão entra só pelos dias em que se proclama a leitura que ele comenta.
- **sd50**: *ocasiao-antiga* — Domingo XX depois de Pentecostes (ocasião antiga): O domingo do calendário do tempo de Santo Antônio não é convertido num domingo atual (decisões D1 e D6). O sermão entra só pelos dias em que se proclama a leitura que ele comenta.
- **sd52**: *ocasiao-antiga* — Domingo XXI depois de Pentecostes (ocasião antiga): O domingo do calendário do tempo de Santo Antônio não é convertido num domingo atual (decisões D1 e D6). O sermão entra só pelos dias em que se proclama a leitura que ele comenta.
- **sd53**: *ocasiao-antiga* — Domingo XXII depois de Pentecostes (ocasião antiga): O domingo do calendário do tempo de Santo Antônio não é convertido num domingo atual (decisões D1 e D6). O sermão entra só pelos dias em que se proclama a leitura que ele comenta.
- **sd54**: *ocasiao-antiga* — Domingo XXIII depois de Pentecostes (ocasião antiga): O domingo do calendário do tempo de Santo Antônio não é convertido num domingo atual (decisões D1 e D6). O sermão entra só pelos dias em que se proclama a leitura que ele comenta.
- **sd55**: *ocasiao-antiga* — Domingo XXIV depois de Pentecostes (ocasião antiga): O domingo do calendário do tempo de Santo Antônio não é convertido num domingo atual (decisões D1 e D6). O sermão entra só pelos dias em que se proclama a leitura que ele comenta.
- **sd57**: *ocasiao-antiga* — Domingo I do Advento (ocasião antiga): O domingo do calendário do tempo de Santo Antônio não é convertido num domingo atual (decisões D1 e D6). O sermão entra só pelos dias em que se proclama a leitura que ele comenta.
- **sd58**: *ocasiao-antiga* — Domingo II do Advento (ocasião antiga): O domingo do calendário do tempo de Santo Antônio não é convertido num domingo atual (decisões D1 e D6). O sermão entra só pelos dias em que se proclama a leitura que ele comenta.
- **sd59**: *ocasiao-antiga* — Domingo III do Advento (ocasião antiga): O domingo do calendário do tempo de Santo Antônio não é convertido num domingo atual (decisões D1 e D6). O sermão entra só pelos dias em que se proclama a leitura que ele comenta. · *parcial* — TC-27-domingo-A: Segunda leitura do dia: Fl 4,6-9. Em comum com o trecho comentado: Fl 4,6-7 (50% do trecho, 50% da leitura do dia); não atinge a regra da correspondência plena.
- **sd60**: *ocasiao-antiga* — Domingo IV do Advento (ocasião antiga): O domingo do calendário do tempo de Santo Antônio não é convertido num domingo atual (decisões D1 e D6). O sermão entra só pelos dias em que se proclama a leitura que ele comenta.
- **sd63**: *parcial* — PAS-7-sabado: Evangelho do dia: Jo 21,20-25. Em comum com o trecho comentado: Jo 21,20-24 (83% do trecho, 83% da leitura do dia); não atinge a regra da correspondência plena.
- **sd64**: *parcial* — sagradafamilia-A: Evangelho do dia: Mt 2,13-15.19-23. Em comum com o trecho comentado: Mt 2,13-15 (50% do trecho, 38% da leitura do dia); não atinge a regra da correspondência plena.
- **sd65**: *ocasiao-antiga* — Domingo I depois do Natal do Senhor (ocasião antiga): O domingo do calendário do tempo de Santo Antônio não é convertido num domingo atual (decisões D1 e D6). O sermão entra só pelos dias em que se proclama a leitura que ele comenta. · *parcial* — NAT-dez29: Evangelho do dia: Lc 2,22-35. Em comum com o trecho comentado: Lc 2,33-35 (50% do trecho, 21% da leitura do dia); não atinge a regra da correspondência plena. · *parcial* — NAT-dez30: Evangelho do dia: Lc 2,36-40. Em comum com o trecho comentado: Lc 2,36-38 (50% do trecho, 60% da leitura do dia); não atinge a regra da correspondência plena. · *parcial* — sagradafamilia-B: Evangelho do dia: Lc 2,22-35. Em comum com o trecho comentado: Lc 2,33-35 (50% do trecho, 21% da leitura do dia); não atinge a regra da correspondência plena.
- **sd66**: *ocasiao-antiga* — Santa Maria, Mãe de Deus (1º/1), como correspondência litúrgica: Decisão D4b (28/11/2026): o sermão foi pregado para a Circuncisão do Senhor, título que o dia 1º de janeiro tinha no calendário do tempo de Santo Antônio; não foi pregado para a atual solenidade de Santa Maria, Mãe de Deus. Aparece em 1º de janeiro só pela leitura (Lc 2,21 está no Evangelho do dia).
- **sd67**: *ocasiao-antiga* — Domingo II depois do Natal do Senhor (ocasião antiga): O domingo do calendário do tempo de Santo Antônio não é convertido num domingo atual (decisões D1 e D6). O sermão entra só pelos dias em que se proclama a leitura que ele comenta.
- **sd69**: *ocasiao-antiga* — Domingo I depois da Oitava da Epifania (ocasião antiga): O domingo do calendário do tempo de Santo Antônio não é convertido num domingo atual (decisões D1 e D6). O sermão entra só pelos dias em que se proclama a leitura que ele comenta.
- **sd70**: *ocasiao-antiga* — Domingo II depois da Oitava da Epifania (ocasião antiga): O domingo do calendário do tempo de Santo Antônio não é convertido num domingo atual (decisões D1 e D6). O sermão entra só pelos dias em que se proclama a leitura que ele comenta. · *parcial* — TC-12-sabado-I: Evangelho do dia: Mt 8,5-17. Em comum com o trecho comentado: Mt 8,5-13 (69% do trecho, 69% da leitura do dia); não atinge a regra da correspondência plena. · *parcial* — TC-12-sabado-II: Evangelho do dia: Mt 8,5-17. Em comum com o trecho comentado: Mt 8,5-13 (69% do trecho, 69% da leitura do dia); não atinge a regra da correspondência plena. · *parcial* — TC-12-sexta-I: Evangelho do dia: Mt 8,1-4. Em comum com o trecho comentado: Mt 8,1-4 (31% do trecho, 100% da leitura do dia); não atinge a regra da correspondência plena. · *parcial* — TC-12-sexta-II: Evangelho do dia: Mt 8,1-4. Em comum com o trecho comentado: Mt 8,1-4 (31% do trecho, 100% da leitura do dia); não atinge a regra da correspondência plena.
- **sd71**: *ocasiao-antiga* — Domingo III depois da Oitava da Epifania (ocasião antiga): O domingo do calendário do tempo de Santo Antônio não é convertido num domingo atual (decisões D1 e D6). O sermão entra só pelos dias em que se proclama a leitura que ele comenta.
- **sf03**: *parcial* — PAS-4-sabado: Evangelho do dia: Jo 14,7-14. Em comum com o trecho comentado: Jo 14,7-10 (40% do trecho, 50% da leitura do dia); não atinge a regra da correspondência plena. · *parcial* — santo:saofilipeetiago: Evangelho do dia: Jo 14,6-14. Em comum com o trecho comentado: Jo 14,6-10 (50% do trecho, 56% da leitura do dia); não atinge a regra da correspondência plena.
- **sf04**: *fora-do-calendario* — Invenção da Santa Cruz (3/5): A festa da Invenção da Santa Cruz foi suprimida do calendário romano em 1960; não se converte na Exaltação da Santa Cruz (14/9), que é outra celebração. · *parcial* — QUA-4-domingo-B: Evangelho do dia: Jo 3,14-21. Em comum com o trecho comentado: Jo 3,14-15 (13% do trecho, 25% da leitura do dia); não atinge a regra da correspondência plena. · *parcial* — santo:exaltacao: Evangelho do dia: Jo 3,13-17. Em comum com o trecho comentado: Jo 3,13-15 (20% do trecho, 60% da leitura do dia); não atinge a regra da correspondência plena. · *parcial* — santo:exaltacao-domingo: Evangelho do dia: Jo 3,13-17. Em comum com o trecho comentado: Jo 3,13-15 (20% do trecho, 60% da leitura do dia); não atinge a regra da correspondência plena.

## Problemas encontrados nos dados das leituras

- **identificado, não corrigido (D8 aguarda conferência numa fonte litúrgica).** Em dados/leituras/indice.json, os conjuntos TC-30-sexta-I e TC-30-sabado-I estão trocados por inteiro: a sexta traz Rm 11,1-2a.11-12.25-29, Sl 93 e Lc 14,1.7-11, e o sábado traz Rm 9,1-5, Sl 147(147B),12-13.14-15.19-20 e Lc 14,1-6. O ano II está na ordem do lecionário (sexta Lc 14,1-6; sábado Lc 14,1.7-11). Causa: o gerador do índice anterior (LiturgiadasHoras, ferramentas/gerar_indice_liturgia_diaria.py) escolhia o arquivo de cada dia pelo primeiro versículo do Evangelho, e sexta e sábado começam ambos em Lc 14,1; no ano I, a escolha caiu trocada. Evidência interna da ordem correta: os Evangelhos dos dias de semana do Tempo Comum são os mesmos nos anos I e II; a leitura semicontínua de Romanos no ano I segue Rm 8,31b-39 (quinta), Rm 9,1-5, Rm 11,1-2a.11-12.25-29 e Rm 11,29-36 (segunda da 31ª semana, que começa onde a do sábado termina); a de Lucas segue Lc 13,31-35, Lc 14,1-6, Lc 14,1.7-11 e Lc 14,12-14. A correção (trocar os dois conjuntos do ano I, sem tocar no ano II) fica preparada para quando a ordem for confirmada no Lecionário ou na Liturgia Diária da CNBB (por exemplo, sexta 29/10/2027 e sábado 30/10/2027).

## Datas nos anos litúrgicos 2026–2027 (Ano B), 2027–2028 (Ano C), 2028–2029 (Ano A)

Calculadas pelo próprio mecanismo do site, com a prévia ligada.

- **sd01 · Prólogo:** nenhuma (catálogo geral).
- **sd02 · Domingo da Septuagésima:** nenhuma (catálogo geral).
- **sd03 · Domingo da Sexagésima:** 2026–2027: 18/09/2027; 2027–2028: 23/09/2028; 2028–2029: 22/09/2029
- **sd04 · Domingo da Quinquagésima:** 2026–2027: 15/11/2027; 2027–2028: 20/11/2028; 2028–2029: 19/11/2029
- **sd05 · Início do Jejum:** 2026–2027: 10/02/2027; 2027–2028: 01/03/2028; 2028–2029: 14/02/2029
- **sd06 · Domingo I da Quaresma (I):** 2028–2029: 18/02/2029
- **sd07 · Domingo I da Quaresma (II) da Penitência:** 2028–2029: 18/02/2029
- **sd08 · Domingo II da Quaresma (I):** 2028–2029: 25/02/2029, 06/08/2029
- **sd09 · Domingo II da Quaresma (II):** 2026–2027: 04/08/2027; 2027–2028: 09/08/2028; 2028–2029: 08/08/2029
- **sd10 · Domingo III da Quaresma:** 2026–2027: 04/03/2027, 08/10/2027; 2027–2028: 23/03/2028, 13/10/2028; 2028–2029: 08/03/2029
- **sd11 · Domingo IV da Quaresma:** 2026–2027: 09/04/2027, 25/07/2027; 2027–2028: 28/04/2028; 2028–2029: 13/04/2029
- **sd12 · Domingo V da Quaresma:** 2026–2027: 18/03/2027; 2027–2028: 06/04/2028; 2028–2029: 22/03/2029
- **sd13 · Domingo de Ramos:** 2026–2027: 21/03/2027; 2027–2028: 09/04/2028; 2028–2029: 25/03/2029
- **sd14 · Ceia do Senhor (Quinta-feira Santa):** 2026–2027: 25/03/2027; 2027–2028: 13/04/2028; 2028–2029: 29/03/2029
- **sd15 · Na Páscoa do Senhor:** 2026–2027: 27/03/2027, 28/03/2027; 2027–2028: 16/04/2028; 2028–2029: 01/04/2029
- **sd16 · Na Ressurreição do Senhor:** 2026–2027: 28/03/2027; 2027–2028: 16/04/2028; 2028–2029: 01/04/2029
- **sd17 · Domingo da Oitava da Páscoa:** 2026–2027: 04/04/2027, 16/05/2027, 03/07/2027; 2027–2028: 23/04/2028, 04/06/2028, 03/07/2028; 2028–2029: 08/04/2029, 20/05/2029, 03/07/2029
- **sd18 · Domingo II depois da Páscoa:** 2026–2027: 18/04/2027, 19/04/2027; 2027–2028: 08/05/2028; 2028–2029: 23/04/2029
- **sd19 · Domingo III depois da Páscoa:** 2026–2027: 06/05/2027; 2027–2028: 25/05/2028; 2028–2029: 10/05/2029
- **sd20 · Domingo IV depois da Páscoa:** 2026–2027: 04/05/2027; 2027–2028: 23/05/2028; 2028–2029: 08/05/2029
- **sd21 · Domingo V depois da Páscoa:** 2026–2027: 08/05/2027; 2027–2028: 27/05/2028; 2028–2029: 12/05/2029
- **sd22 · Domingo VI depois da Páscoa:** 2027–2028: 22/05/2028; 2028–2029: 07/05/2029
- **sd23 · Nas Ladainhas:** 2026–2027: 07/10/2027; 2027–2028: 30/07/2028; 2028–2029: 11/10/2029
- **sd24 · Na Ascensão do Senhor:** 2026–2027: 25/01/2027, 09/05/2027; 2027–2028: 25/01/2028, 25/04/2028, 28/05/2028; 2028–2029: 25/01/2029, 25/04/2029, 13/05/2029
- **sd25 · Domingo de Pentecostes (I):** 2026–2027: 16/05/2027; 2027–2028: 04/06/2028; 2028–2029: 20/05/2029
- **sd26 · Na Festa de Pentecostes (II):** 2026–2027: 16/05/2027; 2027–2028: 04/06/2028; 2028–2029: 20/05/2029
- **sd27 · Prólogo:** nenhuma (catálogo geral).
- **sd28 · Domingo I depois de Pentecostes:** 2026–2027: 25/02/2027; 2027–2028: 16/03/2028, 01/10/2028; 2028–2029: 01/03/2029
- **sd29 · Domingo II depois de Pentecostes:** 2027–2028: 07/11/2028; 2028–2029: 06/11/2029
- **sd30 · Domingo III depois de Pentecostes:** 2026–2027: 04/11/2027; 2027–2028: 23/06/2028, 17/09/2028; 2028–2029: 08/11/2029
- **sd31 · Domingo IV depois de Pentecostes:** 2026–2027: 10/09/2027; 2027–2028: 15/09/2028
- **sd32 · Domingo V depois de Pentecostes:** 2026–2027: 02/09/2027; 2027–2028: 06/02/2028, 07/09/2028; 2028–2029: 06/09/2029
- **sd33 · Domingo VI depois de Pentecostes:** 2026–2027: 19/02/2027, 10/06/2027; 2027–2028: 10/03/2028; 2028–2029: 11/02/2029, 23/02/2029, 14/06/2029
- **sd34 · Domingo VII depois de Pentecostes:** 2027–2028: 12/02/2028; 2028–2029: 10/02/2029
- **sd35 · Domingo VIII depois de Pentecostes:** 2026–2027: 23/06/2027; 2027–2028: 28/06/2028; 2028–2029: 27/06/2029
- **sd36 · Prólogo:** nenhuma (catálogo geral).
- **sd37 · Domingo IX depois de Pentecostes:** 2026–2027: 05/11/2027; 2027–2028: 24/09/2028, 10/11/2028
- **sd38 · Domingo X depois de Pentecostes:** 2026–2027: 18/11/2027; 2027–2028: 23/11/2028; 2028–2029: 22/11/2029
- **sd39 · Domingo XI depois de Pentecostes:** 2026–2027: 06/03/2027; 2027–2028: 29/10/2028; 2028–2029: 10/03/2029
- **sd40 · Domingo XII depois de Pentecostes:** 2026–2027: 05/09/2027; 2027–2028: 11/02/2028; 2028–2029: 09/02/2029
- **sd41 · Prólogo:** nenhuma (catálogo geral).
- **sd42 · Domingo XIII depois de Pentecostes:** 2026–2027: 04/10/2027; 2027–2028: 16/07/2028, 09/10/2028; 2028–2029: 08/10/2029
- **sd43 · Domingo XIV depois de Pentecostes:** 2026–2027: 10/11/2027; 2027–2028: 15/10/2028, 15/11/2028; 2028–2029: 14/11/2029
- **sd44 · Domingo XV depois de Pentecostes:** 2026–2027: 19/06/2027; 2028–2029: 23/06/2029
- **sd45 · Domingo XVI depois de Pentecostes:** 2027–2028: 19/09/2028; 2028–2029: 18/09/2029
- **sd46 · Prólogo:** nenhuma (catálogo geral).
- **sd47 · Domingo XVII depois de Pentecostes:** 2026–2027: 29/10/2027, 30/10/2027; 2027–2028: 03/11/2028, 04/11/2028; 2028–2029: 03/11/2029
- **sd48 · Domingo XVIII depois de Pentecostes:** nenhuma (catálogo geral).
- **sd49 · Domingo XIX depois de Pentecostes:** 2026–2027: 01/07/2027; 2027–2028: 06/07/2028; 2028–2029: 05/07/2029
- **sd50 · Domingo XX depois de Pentecostes:** 2026–2027: 19/08/2027; 2028–2029: 14/10/2029
- **sd51 · Prólogo:** nenhuma (catálogo geral).
- **sd52 · Domingo XXI depois de Pentecostes:** 2026–2027: 08/03/2027; 2027–2028: 27/03/2028; 2028–2029: 12/03/2029
- **sd53 · Domingo XXII depois de Pentecostes:** 2026–2027: 02/03/2027, 12/08/2027; 2027–2028: 21/03/2028, 17/08/2028; 2028–2029: 06/03/2029, 16/08/2029, 16/09/2029
- **sd54 · Domingo XXIII depois de Pentecostes:** 2028–2029: 21/10/2029
- **sd55 · Domingo XXIV depois de Pentecostes:** 2026–2027: 05/07/2027; 2027–2028: 10/07/2028; 2028–2029: 09/07/2029
- **sd56 · Prólogo:** nenhuma (catálogo geral).
- **sd57 · Domingo I do Advento:** 2026–2027: 25/11/2027; 2027–2028: 28/11/2027; 2028–2029: 29/11/2029
- **sd58 · Domingo II do Advento:** 2028–2029: 17/12/2028
- **sd59 · Domingo III do Advento:** 2027–2028: 12/12/2027
- **sd60 · Domingo IV do Advento:** 2027–2028: 05/12/2027
- **sd61 · Natal do Senhor:** 2026–2027: 25/12/2026; 2027–2028: 25/12/2027; 2028–2029: 25/12/2028
- **sd62 · Festa de Santo Estêvão Protomártir:** 2026–2027: 26/12/2026; 2028–2029: 26/12/2028
- **sd63 · Festa de São João Evangelista:** 2027–2028: 27/12/2027; 2028–2029: 27/12/2028
- **sd64 · Festa dos Santos Inocentes:** 2026–2027: 28/12/2026; 2027–2028: 28/12/2027; 2028–2029: 28/12/2028
- **sd65 · Domingo I depois do Natal do Senhor:** 2026–2027: 02/02/2027; 2027–2028: 02/02/2028; 2028–2029: 02/02/2029
- **sd66 · Circuncisão do Senhor:** 2026–2027: 01/01/2027; 2027–2028: 01/01/2028; 2028–2029: 01/01/2029
- **sd67 · Domingo II depois do Natal do Senhor:** 2027–2028: 26/12/2027
- **sd68 · Epifania do Senhor:** 2026–2027: 03/01/2027; 2027–2028: 02/01/2028; 2028–2029: 07/01/2029
- **sd69 · Domingo I depois da Oitava da Epifania:** 2026–2027: 12/10/2027; 2027–2028: 16/01/2028, 12/10/2028; 2028–2029: 12/10/2029
- **sd70 · Domingo II depois da Oitava da Epifania:** 2027–2028: 29/11/2027; 2028–2029: 04/12/2028
- **sd71 · Domingo III depois da Oitava da Epifania:** 2026–2027: 29/06/2027; 2027–2028: 04/07/2028
- **sd72 · Epílogo:** nenhuma (catálogo geral).
- **sm01 · Prólogo aos Quatro Sermões para as Festas da Bem-aventurada Virgem Maria:** nenhuma (catálogo geral).
- **sm02 · Na Natividade da Bem-aventurada Virgem Maria:** 2026–2027: 08/09/2027; 2027–2028: 08/09/2028; 2028–2029: 08/09/2029
- **sm03 · Na Anunciação da Bem-aventurada Virgem Maria (I):** 2026–2027: 08/12/2026, 20/12/2026, 05/04/2027; 2027–2028: 08/12/2027, 20/12/2027, 25/03/2028; 2028–2029: 08/12/2028, 20/12/2028, 09/04/2029
- **sm04 · Na Purificação da Bem-aventurada Virgem Maria (I):** 2026–2027: 27/12/2026, 29/12/2026, 02/02/2027; 2027–2028: 29/12/2027, 02/02/2028; 2028–2029: 29/12/2028, 02/02/2029
- **sm05 · Na Assunção da Bem-aventurada Virgem Maria:** 2026–2027: 15/08/2027; 2027–2028: 20/08/2028; 2028–2029: 19/08/2029
- **sm06 · Na Festa da Purificação da Bem-aventurada Virgem Maria (II):** 2026–2027: 27/12/2026, 29/12/2026, 02/02/2027; 2027–2028: 29/12/2027, 02/02/2028; 2028–2029: 29/12/2028, 02/02/2029
- **sm07 · Na Anunciação de Santa Maria (II):** 2026–2027: 08/12/2026, 20/12/2026, 05/04/2027; 2027–2028: 08/12/2027, 20/12/2027, 25/03/2028; 2028–2029: 08/12/2028, 20/12/2028, 09/04/2029
- **sf01 · Na Conversão de São Paulo:** 2026–2027: 25/01/2027, 17/08/2027; 2027–2028: 25/01/2028, 22/08/2028; 2028–2029: 25/01/2029, 21/08/2029
- **sf02 · Cátedra de São Pedro:** 2026–2027: 22/02/2027, 04/07/2027, 05/08/2027; 2027–2028: 22/02/2028, 02/07/2028; 2028–2029: 22/02/2029, 01/07/2029, 09/08/2029, 26/08/2029
- **sf03 · Festa dos Santos Apóstolos Filipe e Tiago:** 2026–2027: 23/04/2027, 03/05/2027; 2027–2028: 03/05/2028, 12/05/2028; 2028–2029: 27/04/2029, 29/04/2029, 03/05/2029
- **sf04 · Invenção da Santa Cruz:** 2026–2027: 06/04/2027; 2027–2028: 24/04/2028; 2028–2029: 10/04/2029
- **sf05 · Natividade de São João Batista:** 2026–2027: 23/12/2026, 24/06/2027; 2027–2028: 23/12/2027, 24/06/2028; 2028–2029: 23/12/2028, 24/06/2029
- **sf06 · Festa dos Santos Apóstolos Pedro e Paulo:** 2026–2027: 04/07/2027; 2027–2028: 30/04/2028, 02/06/2028, 02/07/2028; 2028–2029: 18/05/2029, 01/07/2029
