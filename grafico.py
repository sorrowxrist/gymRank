"""Genera un PNG con la evolución del nivel de cada músculo.

Uso:
    python grafico.py
    python grafico.py --archivo datos/ejemplo.json --salida salida/progreso.png
"""
import argparse
from pathlib import Path

import matplotlib

matplotlib.use("Agg")  # sin ventana: solo guarda la imagen
import matplotlib.pyplot as plt

from gymrank import CARPETA, RANGOS, cargar_datos, nivel, parsear_fecha

COLORES_RANGO = ["#cd7f32", "#c9ced6", "#ffc83d", "#4de3ff"]


def calcular_series(datos):
    """Devuelve { clave_musculo: {"nombre": ..., "puntos": [(fecha, nivel), ...]} }."""
    umbrales = {}
    for m in datos["musculos"]:
        for ej in m["ejercicios"]:
            umbrales[(m["clave"], ej["id"])] = ej["umbrales"]
    nombres = {m["clave"]: m["nombre"] for m in datos["musculos"]}

    historial = sorted(datos.get("historial", []), key=lambda h: parsear_fecha(h["fecha"]))

    ultimo_peso = {}  # (músculo, ejercicio) -> último peso cargado hasta ese momento
    series = {}
    for h in historial:
        clave = (h["musculo"], h["ejercicio"])
        if clave not in umbrales:
            continue  # ejercicio que ya no existe en la app
        ultimo_peso[clave] = h["kg"]

        # Nivel del músculo en ese momento = el mejor de sus ejercicios
        niveles = [
            nivel(kg, umbrales[c]) for c, kg in ultimo_peso.items() if c[0] == h["musculo"]
        ]
        punto = (parsear_fecha(h["fecha"]), max(niveles))
        series.setdefault(h["musculo"], []).append(punto)

    return {c: {"nombre": nombres[c], "puntos": p} for c, p in series.items()}


def dibujar(series, salida):
    plt.style.use("dark_background")
    fig, ax = plt.subplots(figsize=(10, 5.5))

    # Una línea punteada por cada rango, con el color del metal
    for i, color in enumerate(COLORES_RANGO):
        ax.axhline(i, color=color, linewidth=0.8, linestyle="--", alpha=0.5)

    for serie in series.values():
        fechas = [f for f, _ in serie["puntos"]]
        niveles = [n for _, n in serie["puntos"]]
        ax.plot(fechas, niveles, marker="o", linewidth=2, label=serie["nombre"])

    ax.set_yticks(range(len(RANGOS)))
    ax.set_yticklabels(RANGOS)
    ax.set_ylim(-0.1, 3.2)
    ax.set_ylabel("Rango")
    ax.set_title("GYM RANK · evolución por músculo")
    ax.legend(loc="upper left", ncol=2, frameon=False)
    fig.autofmt_xdate()
    fig.tight_layout()

    salida.parent.mkdir(parents=True, exist_ok=True)
    fig.savefig(salida, dpi=150)
    plt.close(fig)


def main():
    parser = argparse.ArgumentParser(description="Gráfico de evolución de Gym Rank")
    parser.add_argument("--archivo", type=Path, default=CARPETA / "datos" / "gym-rank-marcas.json",
                        help="JSON exportado desde la app")
    parser.add_argument("--salida", type=Path, default=CARPETA / "salida" / "progreso.png",
                        help="dónde guardar la imagen")
    args = parser.parse_args()

    datos = cargar_datos(args.archivo)
    series = calcular_series(datos)
    if not series:
        raise SystemExit("El archivo no tiene historial todavía. Guardá marcas en la app y exportá de nuevo.")

    dibujar(series, args.salida)
    print(f"Listo: {args.salida}")


if __name__ == "__main__":
    main()
