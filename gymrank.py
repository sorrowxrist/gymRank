"""Funciones compartidas por grafico.py y rutina.py."""
import json
from datetime import datetime
from pathlib import Path

# Carpeta donde vive este archivo: así las rutas funcionan sin importar desde dónde ejecutes
CARPETA = Path(__file__).parent

RANGOS = ["Bronce", "Plata", "Oro", "Diamante"]


def cargar_datos(ruta):
    """Lee el JSON exportado por la app y devuelve un diccionario."""
    ruta = Path(ruta)
    if not ruta.exists():
        raise SystemExit(
            f"No encuentro el archivo: {ruta}\n"
            "Exportalo desde la app (botón EXPORTAR MARCAS) y guardalo en python/datos/."
        )
    with open(ruta, encoding="utf-8") as f:
        return json.load(f)


def calcular_rango(kg, umbrales):
    """Índice del rango (0 = Bronce ... 3 = Diamante). Misma lógica que en script.js."""
    for i in range(len(umbrales) - 1, -1, -1):
        if kg >= umbrales[i]:
            return i
    return 0


def nivel(kg, umbrales):
    """Rango + avance hacia el siguiente, como número entre 0.0 y 3.0.

    Ejemplo con umbrales [0, 10, 16, 23]: 13 kg está a mitad de camino
    entre Plata (10) y Oro (16), así que el nivel es 1.5.
    """
    i = calcular_rango(kg, umbrales)
    if i == len(umbrales) - 1:
        return float(i)  # ya está en el rango máximo
    tramo = umbrales[i + 1] - umbrales[i]
    return i + (kg - umbrales[i]) / tramo


def nivel_musculo(musculo):
    """Mejor nivel entre los ejercicios con marca. Devuelve None si no hay ninguna."""
    niveles = [
        nivel(ej["marca"], ej["umbrales"])
        for ej in musculo["ejercicios"]
        if ej["marca"] is not None
    ]
    return max(niveles) if niveles else None


def parsear_fecha(texto):
    """Convierte '2026-11-04T22:50:00.000Z' en datetime (hora local, sin zona)."""
    # fromisoformat no entiende la 'Z' final en versiones viejas de Python
    return datetime.fromisoformat(texto.replace("Z", "+00:00")).astimezone().replace(tzinfo=None)
