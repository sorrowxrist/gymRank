# Gym Rank

App web para rankear tu fuerza en el gym, músculo por músculo. Tocás una parte del cuerpo, cargás tu mejor marca y la app te dice en qué rango estás: Bronce, Plata, Oro o Diamante.

**Probala acá:** [https://sorrowxrist.github.io/gym-rank](https://sorrowxrist.github.io/gym-rank)

<!-- Cuando tengas una captura, guardala en docs/captura.png y descomentá esta línea:
![Captura de Gym Rank](docs/captura.png)
-->

## Qué hace

- Muestra un cuerpo en SVG con los músculos clickeables (hombros, pecho, abdomen, bíceps, antebrazos, piernas y gemelos)
- Cada músculo tiene un ejercicio de referencia, por ejemplo curl con mancuerna para bíceps
- Calcula tu rango según el peso que cargás y cuánto te falta para el siguiente
- Pinta cada músculo con el color de su rango
- Guarda tus marcas en el navegador (localStorage), así no se pierden al recargar
- Se adapta a celular y a compu
- Se puede usar con teclado (Tab para moverte, Enter para elegir un músculo)

## Cómo funcionan los rangos

Cada músculo tiene umbrales en kg definidos en el objeto `MUSCULOS` de `script.js`. Por ejemplo, para bíceps:

| Rango    | Desde  |
|----------|--------|
| Bronce   | 0 kg   |
| Plata    | 10 kg  |
| Oro      | 16 kg  |
| Diamante | 23 kg  |

Son valores de ejemplo y se pueden modificar fácilmente.

## Tecnologías

HTML, CSS y JavaScript puro (sin frameworks ni librerías)

## Cómo usarla en tu compu

1. Descargá o cloná el repositorio
   ```bash
   git clone https://github.com/sorrowxrist/gym-rank.git
   ```
2. Abrí `index.html` en el navegador

## Estructura del proyecto

```
gym-rank/
├── index.html   # estructura y cuerpo en SVG
├── style.css    # estilos y colores de cada rango
├── script.js    # datos, lógica de rangos y eventos
└── README.md
```

## Ideas para seguir mejorándola

- [x] Cuerpo interactivo con rangos por músculo
- [x] Guardado en localStorage
- [ ] Botón para borrar una marca
- [ ] Contador de músculos rankeados
- [ ] Rangos ajustados por peso corporal y sexo
- [ ] Historial de progreso con gráfico
- [ ] Vista de espalda
- [ ] Convertirla en PWA para instalarla en el celu

## Autor

Alan Gimenez
