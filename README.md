# Gym Rank

App web para rankear tu fuerza en el gym, músculo por músculo. Tocás una parte del cuerpo, cargás tu mejor marca y la app te dice en qué rango estás: Bronce, Plata, Oro o Diamante.

**Probala acá:** [https://sorrowxrist.github.io/gymRank](https://sorrowxrist.github.io/gymRank)

<!-- Cuando tengas una captura, guardala en docs/captura.png y descomentá esta línea:
![Captura de Gym Rank](docs/captura.png)
-->

## Qué hace

- Muestra un cuerpo en SVG con los músculos clickeables (hombros, pecho, abdomen, bíceps, antebrazos, piernas y gemelos)
- Estética oscura estilo VHS: líneas de escaneo, glitch y reloj de cámara
- Pantalla de intro animada que se puede saltar tocando la pantalla
- Calcula tu rango según el peso que cargás y cuánto te falta para el siguiente
- Pinta cada músculo con el color de su mejor rango
- Cada músculo tiene varios ejercicios, cada uno con sus propios rangos
- Muestra el rango en vivo mientras escribís el peso y la tabla de rangos del ejercicio
- Listado "Tus rangos" con el nivel de cada músculo
- Guarda tus marcas en el navegador (localStorage), así no se pierden al recargar
- Se adapta a celular y a compu
- Se puede usar con teclado (Tab para moverte, Enter para elegir un músculo)

## Cómo funcionan los rangos

Cada ejercicio tiene sus umbrales en kg definidos en el objeto `MUSCULOS` de `script.js`. El rango de un músculo es el mejor de sus ejercicios. Por ejemplo, para curl con mancuernas (bíceps):

| Rango    | Desde  |
|----------|--------|
| Bronce   | 0 kg   |
| Plata    | 10 kg  |
| Oro      | 16 kg  |
| Diamante | 23 kg  |

Son valores de ejemplo y se pueden modificar fácilmente.

## Tecnologías

HTML, CSS, Python, JSON, y JavaScript puro (sin frameworks ni librerías)

## Cómo usarla en tu compu

1. Descargá o cloná el repositorio
   ```bash
   git clone https://github.com/sorrowxrist/gymRank.git
   ```
2. Abrí `index.html` en el navegador

## Ideas para seguir mejorándola

- [x] Cuerpo interactivo con rangos por músculo
- [x] Guardado en localStorage
- [x] Intro y estilo VHS
- [ ] Botón para borrar una marca
- [x] Elegir el ejercicio de cada músculo
- [x] Listado de rangos
- [ ] Agregar tus propios ejercicios
- [ ] Contador de músculos rankeados
- [ ] Rangos ajustados por peso corporal y sexo
- [ ] Historial de progreso con gráfico
- [ ] Vista de espalda
- [ ] Convertirla en PWA para instalarla en el celu

## Autor

Alan Gimenez
