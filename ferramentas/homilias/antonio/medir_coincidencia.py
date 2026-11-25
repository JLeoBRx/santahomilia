#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Mede quanto um texto português dos sermões de Santo Antônio coincide, palavra
por palavra, com a tradução da Editora Vozes (2019). Serve ao programa de
retradução independente (ver dados/homilias/antonio/LEIA-ME.md).

Medida: parte do COMENTÁRIO (sem citações entre aspas, parênteses e colchetes)
que aparece na Vozes em sequências de 8 palavras idênticas, e a maior dessas
sequências. A Vozes é só lida para comparar: nenhum texto dela é gravado.

Uso:
  python3 medir_coincidencia.py --vozes CAMINHO.pdf|.txt --paragrafos [--camada revisada] [--min 50]
  python3 medir_coincidencia.py --vozes CAMINHO --entradas SD19-02 SM04-05 ...
  python3 medir_coincidencia.py --vozes CAMINHO --arquivo nova_traducao.txt
"""
import argparse
import json
import os
import re
import subprocess
import sys

RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
BASE = os.path.join(RAIZ, "dados", "homilias", "antonio")
PALAVRA = r"[\wáéíóúâêôãõàçüÁÉÍÓÚÂÊÔÃÕÀÇ]+"
N = 8


def texto_vozes(caminho):
    if caminho.lower().endswith(".pdf"):
        return subprocess.run(["pdftotext", caminho, "-"], capture_output=True, text=True, check=True).stdout
    return open(caminho, encoding="utf-8").read()


def sequencias(texto):
    w = [p.lower() for p in re.findall(PALAVRA, texto)]
    return {" ".join(w[i:i + N]) for i in range(len(w) - N + 1)}


def medir(texto, V):
    """-> (palavras do comentário, palavras cobertas, maior sequência)"""
    t = re.sub(r"“[^”]*”|\([^)]*\)|‘[^’]*’|\[[^\]]*\]", " ¦ ", texto)
    total = cobertas = maior = 0
    for seg in t.split("¦"):
        w = [p.lower() for p in re.findall(PALAVRA, seg)]
        c = [False] * len(w)
        for i in range(len(w) - N + 1):
            if " ".join(w[i:i + N]) in V:
                for j in range(i, i + N):
                    c[j] = True
        total += len(w)
        cobertas += sum(c)
        i = 0
        while i < len(w):
            if c[i]:
                j = i
                while j < len(w) and c[j]:
                    j += 1
                maior = max(maior, j - i)
                i = j
            else:
                i += 1
    return total, cobertas, maior


def linha(rotulo, r):
    total, cob, maior = r
    return f"{rotulo}: {100 * cob / max(total, 1):.0f}% de {total} palavras de comentário; maior sequência {maior}"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--vozes", required=True, help="PDF ou texto da tradução da Vozes (não versionado)")
    ap.add_argument("--paragrafos", action="store_true", help="mede cada parágrafo de uma camada")
    ap.add_argument("--camada", default="revisada")
    ap.add_argument("--min", type=float, default=0, help="só mostra parágrafos com pelo menos esta porcentagem")
    ap.add_argument("--entradas", nargs="*", help="ids do registro (mede o campo 'depois')")
    ap.add_argument("--arquivo", help="arquivo de texto a medir")
    a = ap.parse_args()
    V = sequencias(texto_vozes(a.vozes))
    if a.arquivo:
        print(linha(a.arquivo, medir(open(a.arquivo, encoding="utf-8").read(), V)))
    if a.entradas:
        reg = {r["id"]: r for r in json.load(open(os.path.join(BASE, "registro-editorial.json"), encoding="utf-8"))["registros"]}
        for i in a.entradas:
            print(linha(i, medir(reg[i].get("depois") or "", V)))
    if a.paragrafos:
        d = os.path.join(BASE, a.camada)
        for f in sorted(os.listdir(d)):
            for bloco in open(os.path.join(d, f), encoding="utf-8").read().split("\n\n")[1:]:
                m = re.match(r"@(paragrafo \d+|temas)\n", bloco)
                if not m:
                    continue
                r = medir(bloco.partition("\n")[2], V)
                if r[0] >= 60 and 100 * r[1] / r[0] >= a.min:
                    print(linha(f"{f[:-4]} {m.group(1)}", r))
    if not (a.arquivo or a.entradas or a.paragrafos):
        ap.print_help()
        sys.exit(1)


if __name__ == "__main__":
    main()
