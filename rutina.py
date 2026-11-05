"""Arma una rutina semanal en Markdown según tus rangos.

Uso:
    python rutina.py
    python rutina.py --dias 5 --archivo datos/ejemplo.json
"""
import argparse
from datetime import date
from pathlib import Path

from gymrank import CARPETA, RANGOS, calcular_rango, cargar_datos, nivel, nivel_musculo

DIAS_SEMANA = {
    3: ["Lunes", "Miércoles", "Viernes"],
    4: ["Lunes", "Martes", "Jueves", "Viernes"],
    5: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"],
    6: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
}
ORDEN = ["piernas", "pecho", "hombros", "biceps", "abdomen", "gemelos", "antebrazos"]  # grandes primero
CANT_PRIORIDADES = 2
SERIES_PRIORIDAD = "4 series de 8 a 12 repeticiones"
SERIES_NORMAL = "3 series de 10 a 12 repeticiones"


def elegir_ejercicios(musculo, cantidad=2):
    """Primero los ejercicios que ya hacés (del más fuerte al más flojo), después los que no."""
    con_marca = [e for e in musculo["ejercicios"] if e["marca"] is not None]
    con_marca.sort(key=lambda e: nivel(e["marca"], e["umbrales"]), reverse=True)
    sin_marca = [e for e in musculo["ejercicios"] if e["marca"] is None]
    return (con_marca + sin_marca)[:cantidad]


def repartir(claves, prioridades, dias):
    """Reparte los músculos en los días. Los prioritarios aparecen dos veces por semana."""
    pedidos = [c for c in ORDEN if c in claves] + [c for c in ORDEN if c in prioridades]
    semana = [[] for _ in range(dias)]
    for clave in pedidos:
        candidatos = [d for d in semana if clave not in d]  # nunca el mismo músculo dos veces el mismo día
        min(candidatos, key=len).append(clave)               # el día más liviano
    for d in semana:
        d.sort(key=ORDEN.index)
    return semana


def describir_meta(ejercicio):
    """Texto con la marca actual y lo que falta para el siguiente rango."""
    kg, umbrales = ejercicio["marca"], ejercicio["umbrales"]
    if kg is None:
        return "Sin marca todavía: empezá liviano y cargá tu primera marca en la app."
    i = calcular_rango(kg, umbrales)
    if i == len(umbrales) - 1:
        return f"{kg} kg ({RANGOS[i]}): ya estás en el rango máximo."
    return f"{kg} kg ({RANGOS[i]}) → meta: {RANGOS[i + 1]} con {umbrales[i + 1]} kg."


def armar_markdown(datos, dias):
    musculos = {m["clave"]: m for m in datos["musculos"]}
    niveles = {c: nivel_musculo(m) for c, m in musculos.items()}

    # Prioridad = los músculos con nivel más bajo (entre los que tienen datos)
    con_datos = sorted((c for c, n in niveles.items() if n is not None), key=lambda c: niveles[c])
    prioridades = con_datos[:CANT_PRIORIDADES]

    semana = repartir(list(musculos), prioridades, dias)
    ejercicios = {c: elegir_ejercicios(m) for c, m in musculos.items()}
    veces = {c: 0 for c in musculos}  # cuántas veces apareció cada músculo (para alternar ejercicios)

    lineas = ["# Rutina semanal sugerida", "", f"Generada el {date.today().isoformat()} a partir de tus marcas.", ""]

    lineas += ["## Tus músculos", "", "| Músculo | Rango | Prioridad |", "|---|---|---|"]
    for c in sorted(musculos, key=lambda c: (niveles[c] is None, niveles[c] or 0)):
        n = niveles[c]
        rango = "Sin marca" if n is None else RANGOS[min(int(n), len(RANGOS) - 1)]
        lineas.append(f"| {musculos[c]['nombre']} | {rango} | {'sí' if c in prioridades else ''} |")
    lineas.append("")

    for nombre_dia, musculos_del_dia in zip(DIAS_SEMANA[dias], semana):
        lineas += [f"## {nombre_dia}", ""]
        for c in musculos_del_dia:
            lista = ejercicios[c]
            ejercicio = lista[veces[c] % len(lista)]
            veces[c] += 1
            es_prioridad = c in prioridades
            series = SERIES_PRIORIDAD if es_prioridad else SERIES_NORMAL
            etiqueta = " (prioridad)" if es_prioridad else ""
            lineas.append(f"- **{musculos[c]['nombre']}**{etiqueta}: {ejercicio['nombre']}, {series}.")
            lineas.append(f"  - {describir_meta(ejercicio)}")
        lineas.append("")

    lineas += ["---", "",
               "Sugerencia general generada automáticamente. Ajustala a tu cuerpo y tu experiencia, "
               "y consultá con un profesor si tenés dudas o alguna lesión."]
    return "\n".join(lineas) + "\n"


def main():
    parser = argparse.ArgumentParser(description="Sugeridor de rutina de Gym Rank")
    parser.add_argument("--archivo", type=Path, default=CARPETA / "datos" / "gym-rank-marcas.json",
                        help="JSON exportado desde la app")
    parser.add_argument("--salida", type=Path, default=CARPETA / "salida" / "rutina-semanal.md",
                        help="dónde guardar la rutina")
    parser.add_argument("--dias", type=int, choices=sorted(DIAS_SEMANA), default=4,
                        help="días de entrenamiento por semana (3 a 6)")
    args = parser.parse_args()

    datos = cargar_datos(args.archivo)
    texto = armar_markdown(datos, args.dias)

    args.salida.parent.mkdir(parents=True, exist_ok=True)
    args.salida.write_text(texto, encoding="utf-8")  # utf-8 explícito: en Windows el default puede romper las tildes
    print(f"Listo: {args.salida}")


if __name__ == "__main__":
    main()
