// ============================================================
// 1) DATOS: qué ejercicio mide cada músculo y desde cuántos kg
//    empieza cada rango. Son valores de ejemplo: cambialos a tu gusto.
//    umbrales = [bronce, plata, oro, diamante] (kg mínimos)
// ============================================================
const RANGOS = ["bronce", "plata", "oro", "diamante"];

const MUSCULOS = {
  hombros:    { nombre: "Hombros",    ejercicio: "Press militar con mancuernas (por mano)", umbrales: [0, 8, 14, 22] },
  pecho:      { nombre: "Pecho",      ejercicio: "Press de banca con barra",                umbrales: [0, 40, 70, 100] },
  abdomen:    { nombre: "Abdomen",    ejercicio: "Crunch en polea alta",                    umbrales: [0, 20, 35, 50] },
  biceps:     { nombre: "Bíceps",     ejercicio: "Curl con mancuerna (por mano)",           umbrales: [0, 10, 16, 23] },
  antebrazos: { nombre: "Antebrazos", ejercicio: "Curl de muñeca con barra",                umbrales: [0, 15, 25, 35] },
  piernas:    { nombre: "Piernas",    ejercicio: "Sentadilla con barra",                    umbrales: [0, 50, 90, 130] },
  gemelos:    { nombre: "Gemelos",    ejercicio: "Elevación de talones en máquina",         umbrales: [0, 40, 80, 120] },
};

const CLAVE_STORAGE = "gym-rank:marcas";

// ============================================================
// 2) ESTADO: las marcas guardadas, por ejemplo { biceps: 12 }
// ============================================================
let marcas = cargarMarcas();
let musculoActual = null;

function cargarMarcas() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_STORAGE)) || {};
  } catch {
    return {}; // si el JSON está roto, arrancamos de cero
  }
}

function guardarMarcas() {
  localStorage.setItem(CLAVE_STORAGE, JSON.stringify(marcas));
}

// ============================================================
// 3) LÓGICA: dado un peso, devuelve en qué rango cae
// ============================================================
function calcularRango(kg, umbrales) {
  // Recorremos de atrás para adelante: el primer umbral que alcanzamos es el rango
  for (let i = umbrales.length - 1; i >= 0; i--) {
    if (kg >= umbrales[i]) return i;
  }
  return 0;
}

// ============================================================
// 4) DOM: referencias a los elementos del HTML
// ============================================================
const formulario = document.getElementById("formulario");
const vacio = document.getElementById("vacio");
const titulo = document.getElementById("nombre-musculo");
const ejercicio = document.getElementById("ejercicio");
const inputKg = document.getElementById("kg");
const resultado = document.getElementById("resultado");
const cuerpo = document.querySelector(".cuerpo");

// Pinta cada músculo con el color de su rango
function pintarCuerpo() {
  document.querySelectorAll(".musculo").forEach((forma) => {
    const clave = forma.dataset.musculo;
    if (marcas[clave]) {
      const i = calcularRango(marcas[clave], MUSCULOS[clave].umbrales);
      forma.dataset.rango = RANGOS[i];
    } else {
      delete forma.dataset.rango;
    }
  });
}

// Muestra el texto del rango en el panel
function mostrarResultado(clave) {
  const { umbrales } = MUSCULOS[clave];
  const kg = marcas[clave];
  if (!kg) { resultado.innerHTML = ""; return; }

  const i = calcularRango(kg, umbrales);
  const nombre = RANGOS[i][0].toUpperCase() + RANGOS[i].slice(1);
  let texto = `<strong class="${RANGOS[i]}">${nombre}</strong> con ${kg} kg.`;

  if (i < RANGOS.length - 1) {
    const falta = umbrales[i + 1] - kg;
    const siguiente = RANGOS[i + 1];
    texto += ` Te faltan ${falta} kg para ${siguiente}.`;
  } else {
    texto += " Llegaste al rango máximo.";
  }
  resultado.innerHTML = texto;
}

// Selecciona un músculo y llena el panel
function seleccionar(clave) {
  musculoActual = clave;

  document.querySelectorAll(".musculo").forEach((forma) => {
    forma.classList.toggle("activo", forma.dataset.musculo === clave);
  });

  titulo.textContent = MUSCULOS[clave].nombre;
  ejercicio.textContent = MUSCULOS[clave].ejercicio;
  inputKg.value = marcas[clave] ?? "";
  vacio.hidden = true;
  formulario.hidden = false;
  mostrarResultado(clave);
}

// ============================================================
// 5) EVENTOS
// ============================================================
// Un solo listener en el SVG (delegación): detecta el músculo clickeado
cuerpo.addEventListener("click", (e) => {
  const forma = e.target.closest(".musculo");
  if (forma) seleccionar(forma.dataset.musculo);
});

// Lo mismo con teclado (Enter o espacio) para accesibilidad
cuerpo.addEventListener("keydown", (e) => {
  const forma = e.target.closest(".musculo");
  if (forma && (e.key === "Enter" || e.key === " ")) {
    e.preventDefault();
    seleccionar(forma.dataset.musculo);
  }
});

formulario.addEventListener("submit", (e) => {
  e.preventDefault(); // evita que la página se recargue
  const kg = parseFloat(inputKg.value);
  if (!musculoActual || !(kg > 0)) return;

  marcas[musculoActual] = kg;
  guardarMarcas();
  pintarCuerpo();
  mostrarResultado(musculoActual);
});

// Al cargar la página, pintamos lo que haya guardado
pintarCuerpo();
