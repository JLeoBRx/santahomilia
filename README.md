# Santa Homilia

Homilias dos santos diante das leituras de cada dia, com o calendário litúrgico
do Brasil.

O site calcula o dia litúrgico, indica quais são as leituras da Missa (só a
referência: livro, capítulo e versículos) e mostra a homilia de um santo quando
ele comentou o Evangelho desse dia ou pregou para essa celebração. **As
leituras não são reproduzidas aqui**: para lê-las, o site indica a
[Liturgia Diária da CNBB](https://www.cnbb.org.br/liturgia-diaria/).

## O que há neste repositório

| Parte | Onde | Situação |
|---|---|---|
| Homilias de São Gregório Magno (*Homilias sobre os Evangelhos*) | `dados/homilias/gregorio-magno/` | 40 homilias conferidas com o latim; 37 no calendário, 3 só no catálogo |
| Sermões de Santo Antônio de Pádua | `dados/homilias/antonio/` | 85 itens conferidos com o latim (Etapa 1 encerrada em 27/11/2026, com ressalva: as dez traduções próprias não passaram por revisor humano independente); ainda não publicados no site |
| Sermões de São João Maria Vianney | `dados/homilias/vianney/` e os PDFs da edição francesa | em preparação; sem tradução portuguesa |
| Calendário litúrgico do Brasil | `js/liturgical-calendar.js`, `dados/calendario/santoral.json` | calculado pelo próprio site |
| Referências das leituras da Missa | `dados/leituras/indice.json` | só a indicação bíblica de cada leitura |
| Fontes recebidas | `Homilia dos Santos/` | só as de domínio público ou de uso autorizado (ver abaixo) |

### O que **não** está aqui

- Nenhum texto da CNBB nem do iLiturgia: nem leituras, nem orações, nem a
  Liturgia das Horas.
- Nenhuma edição protegida: a edição crítica dos *Sermones* de Santo Antônio
  (Centro Studi Antoniani), as traduções da Vozes e de Spilsbury e a edição
  crítica de São Gregório (CCSL 141, Brepols) foram usadas só para conferência
  e ficam fora deste repositório.

O teste `ferramentas/testes/limpeza.test.mjs` impede que algo disso entre por
engano.

## Fontes que estão no repositório

- **São Gregório Magno:** a tradução portuguesa recebida (portal OpenSaints,
  que declara reutilização livre; tradutor não identificado), o texto latino
  de Migne (*Patrologia Latina* 76, domínio público) e a planilha de inventário.
- **Santo Antônio de Pádua:** as páginas da tradução do Lírio Católico
  (liriocatolico.com.br), que permite o uso com referência à fonte, e o texto
  das políticas de uso recebidas.
- **São João Maria Vianney:** os quatro tomos dos *Sermons du curé d’Ars*
  (edição francesa de 1883, domínio público).

## Como ver o site no computador

O site é estático (HTML, CSS e JavaScript, sem compilação). Abra-o por um
servidor local, por exemplo:

```bash
python3 -m http.server 8000
```

e acesse `http://localhost:8000`.

## Testes

```bash
node --test "ferramentas/testes/*.test.mjs"
```

Precisa do Node.js 22.13 ou mais novo. No GitHub, rodam a cada push e a cada
pull request. Veja `ferramentas/testes/LEIA-ME.md`.

## Origem

Este repositório nasceu em 25/11/2026 do projeto anterior do responsável,
levando só o trabalho próprio (homilias conferidas, calendário, referências)
e as fontes livres, sem o histórico anterior. As decisões editoriais estão
registradas em cada `registro-editorial.json` e nos documentos de
`dados/homilias/`.

## Uso de inteligência artificial

O projeto usa inteligência artificial na organização dos textos, no cálculo do
calendário, na conferência das traduções com o latim e nas traduções feitas
pelo projeto. Os critérios e as decisões editoriais são do responsável pelo
projeto.
