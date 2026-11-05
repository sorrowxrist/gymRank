// ============================================================
// 1) DATOS: cada músculo tiene varios ejercicios, y cada ejercicio
//    tiene SUS PROPIOS umbrales en kg: [bronce, plata, oro, diamante].
//    Son valores de ejemplo: cambialos a tu gusto.
// ============================================================
const RANGOS = ["bronce", "plata", "oro", "diamante"];

const MUSCULOS = {
  hombros: { nombre: "Hombros", ejercicios: {
    "press-mancuernas":   { nombre: "Press militar con mancuernas", nota: "Peso por mancuerna", umbrales: [0, 8, 14, 22] },
    "press-barra":        { nombre: "Press militar con barra",      umbrales: [0, 25, 40, 60] },
    "elevaciones":        { nombre: "Elevaciones laterales",        nota: "Peso por mancuerna", umbrales: [0, 4, 8, 12] },
  }},
  pecho: { nombre: "Pectorales", ejercicios: {
    "press-mancuernas":   { nombre: "Press plano con mancuernas",     nota: "Peso por mancuerna", umbrales: [0, 16, 28, 40] },
    "press-inclinado":    { nombre: "Press inclinado con mancuernas", nota: "Peso por mancuerna", umbrales: [0, 14, 24, 36] },
    "press-barra":        { nombre: "Press plano con barra",          umbrales: [0, 40, 70, 100] },
    "pec-deck":           { nombre: "Aperturas en máquina (pec deck)", umbrales: [0, 20, 35, 50] },
  }},
  abdomen: { nombre: "Abdomen", ejercicios: {
    "crunch-polea":       { nombre: "Crunch en polea alta",  umbrales: [0, 20, 35, 50] },
    "crunch-maquina":     { nombre: "Crunch en máquina",     umbrales: [0, 25, 45, 65] },
  }},
  biceps: { nombre: "Bíceps", ejercicios: {
    "curl-mancuernas":    { nombre: "Curl con mancuernas", nota: "Peso por mancuerna", umbrales: [0, 10, 16, 23] },
    "curl-martillo":      { nombre: "Curl martillo",       nota: "Peso por mancuerna", umbrales: [0, 10, 16, 22] },
    "curl-barra":         { nombre: "Curl con barra",      umbrales: [0, 20, 30, 40] },
  }},
  antebrazos: { nombre: "Antebrazos", ejercicios: {
    "muneca-barra":       { nombre: "Curl de muñeca con barra",      umbrales: [0, 15, 25, 35] },
    "muneca-mancuerna":   { nombre: "Curl de muñeca con mancuerna",  nota: "Peso por mancuerna", umbrales: [0, 6, 12, 18] },
    "curl-inverso":       { nombre: "Curl inverso con barra",        umbrales: [0, 10, 20, 30] },
  }},
  piernas: { nombre: "Piernas", ejercicios: {
    "sentadilla":         { nombre: "Sentadilla con barra",           umbrales: [0, 50, 90, 130] },
    "prensa":             { nombre: "Prensa 45°",                     umbrales: [0, 100, 180, 260] },
    "extension":          { nombre: "Extensión de cuádriceps",        umbrales: [0, 30, 55, 80] },
    "zancadas":           { nombre: "Zancadas con mancuernas",        nota: "Peso por mancuerna", umbrales: [0, 10, 18, 28] },
  }},
  gemelos: { nombre: "Gemelos", ejercicios: {
    "talones-maquina":    { nombre: "Elevación de talones en máquina", umbrales: [0, 40, 80, 120] },
    "talones-prensa":     { nombre: "Elevación de talones en prensa",  umbrales: [0, 60, 110, 160] },
    "talones-mancuernas": { nombre: "Elevación de talones con mancuernas", nota: "Peso por mancuerna", umbrales: [0, 10, 20, 30] },
  }},
};

// Cambiamos la clave (v2) porque la forma de guardar los datos cambió
const CLAVE_STORAGE = "gym-rank:marcas-v2";

// ============================================================
// 2) ESTADO: marcas = { biceps: { "curl-mancuernas": 12, "curl-barra": 25 } }
// ============================================================
let marcas = cargarMarcas();
let musculoActual = null;

function cargarMarcas() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_STORAGE)) || {};
  } catch {
    return {};
  }
}

function guardarMarcas() {
  localStorage.setItem(CLAVE_STORAGE, JSON.stringify(marcas));
}

// ============================================================
// 3) LÓGICA
// ============================================================
function calcularRango(kg, umbrales) {
  for (let i = umbrales.length - 1; i >= 0; i--) {
    if (kg >= umbrales[i]) return i;
  }
  return 0;
}

// El rango de un músculo es el MEJOR de todos sus ejercicios (-1 = sin marcas)
function mejorRango(clave) {
  let mejor = -1;
  for (const [id, kg] of Object.entries(marcas[clave] || {})) {
    const ej = MUSCULOS[clave].ejercicios[id];
    if (!ej || !(kg > 0)) continue;
    mejor = Math.max(mejor, calcularRango(kg, ej.umbrales));
  }
  return mejor;
}

// ============================================================
// 4) DOM
// ============================================================
const formulario = document.getElementById("formulario");
const vacio = document.getElementById("vacio");
const titulo = document.getElementById("nombre-musculo");
const selectEjercicio = document.getElementById("ejercicio");
const nota = document.getElementById("nota");
const inputKg = document.getElementById("kg");
const resultado = document.getElementById("resultado");
const tablaRangos = document.getElementById("tabla-rangos");
const listaResumen = document.getElementById("resumen");
const cuerpo = document.querySelector(".cuerpo");

function pintarCuerpo() {
  document.querySelectorAll(".musculo").forEach((forma) => {
    const i = mejorRango(forma.dataset.musculo);
    if (i >= 0) forma.dataset.rango = RANGOS[i];
    else delete forma.dataset.rango;
  });
}

// Listado "TUS RANGOS": una fila por músculo
function pintarResumen() {
  listaResumen.innerHTML = "";
  for (const [clave, m] of Object.entries(MUSCULOS)) {
    const i = mejorRango(clave);
    const li = document.createElement("li");
    li.innerHTML = `<span>${m.nombre}</span>
      <span class="insignia" data-rango="${i >= 0 ? RANGOS[i] : "ninguno"}">${i >= 0 ? RANGOS[i].toUpperCase() : "SIN MARCA"}</span>`;
    listaResumen.appendChild(li);
  }
}

function ejercicioActual() {
  return MUSCULOS[musculoActual].ejercicios[selectEjercicio.value];
}

// Actualiza nota, tabla de rangos y resultado para un peso dado (guardado o escrito)
function actualizarVista(kg) {
  const ej = ejercicioActual();
  nota.textContent = ej.nota || "";

  const i = kg > 0 ? calcularRango(kg, ej.umbrales) : -1;

  tablaRangos.innerHTML = ej.umbrales.map((desde, n) =>
    `<li class="${n === i ? "actual" : ""}">
       <span class="${RANGOS[n]}">${RANGOS[n].toUpperCase()}</span><span>desde ${desde} kg</span>
     </li>`).join("");

  if (i < 0) { resultado.innerHTML = ""; return; }

  let texto = `<strong class="${RANGOS[i]}">${RANGOS[i].toUpperCase()}</strong><br>${kg} kg.`;
  if (i < RANGOS.length - 1) {
    texto += ` Te faltan ${ej.umbrales[i + 1] - kg} kg para ${RANGOS[i + 1]}.`;
  } else {
    texto += " Llegaste al rango máximo.";
  }
  resultado.innerHTML = texto;
}

// Carga en el formulario la marca guardada del ejercicio elegido
function cargarEjercicio() {
  const guardado = (marcas[musculoActual] || {})[selectEjercicio.value];
  inputKg.value = guardado ?? "";
  actualizarVista(guardado);
}

function seleccionar(clave) {
  musculoActual = clave;

  document.querySelectorAll(".musculo").forEach((forma) => {
    forma.classList.toggle("activo", forma.dataset.musculo === clave);
  });

  titulo.textContent = MUSCULOS[clave].nombre;

  // Llenamos el <select> con los ejercicios de este músculo
  selectEjercicio.innerHTML = "";
  for (const [id, ej] of Object.entries(MUSCULOS[clave].ejercicios)) {
    const opcion = document.createElement("option");
    opcion.value = id;
    opcion.textContent = ej.nombre;
    selectEjercicio.appendChild(opcion);
  }

  vacio.hidden = true;
  formulario.hidden = false;
  cargarEjercicio();
}

// ============================================================
// 5) EVENTOS
// ============================================================
cuerpo.addEventListener("click", (e) => {
  const forma = e.target.closest(".musculo");
  if (forma) seleccionar(forma.dataset.musculo);
});

cuerpo.addEventListener("keydown", (e) => {
  const forma = e.target.closest(".musculo");
  if (forma && (e.key === "Enter" || e.key === " ")) {
    e.preventDefault();
    seleccionar(forma.dataset.musculo);
  }
});

// Al cambiar de ejercicio: mostramos su marca guardada y su rango
selectEjercicio.addEventListener("change", cargarEjercicio);

// Mientras escribís el peso: vista previa del rango, sin guardar todavía
inputKg.addEventListener("input", () => actualizarVista(parseFloat(inputKg.value)));

formulario.addEventListener("submit", (e) => {
  e.preventDefault();
  const kg = parseFloat(inputKg.value);
  if (!musculoActual || !(kg > 0)) return;

  marcas[musculoActual] = marcas[musculoActual] || {};
  marcas[musculoActual][selectEjercicio.value] = kg;
  guardarMarcas();
  pintarCuerpo();
  pintarResumen();
  actualizarVista(kg);
});

// ============================================================
// 6) INTRO VHS, RELOJ y AÑO DEL FOOTER
// ============================================================
const intro = document.getElementById("intro");

function cerrarIntro() {
  if (!intro || intro.classList.contains("saliendo")) return;
  intro.classList.add("saliendo");
  setTimeout(() => intro.remove(), 700);
  document.removeEventListener("keydown", cerrarIntro);
}

intro.addEventListener("click", cerrarIntro);
document.addEventListener("keydown", cerrarIntro);
setTimeout(cerrarIntro, 7000);

function actualizarReloj() {
  const t = new Date().toLocaleString("es-AR", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
  }).toUpperCase();
  document.querySelectorAll(".reloj").forEach((el) => { el.textContent = t; });
}
actualizarReloj();
setInterval(actualizarReloj, 1000);

document.getElementById("anio").textContent = new Date().getFullYear();

pintarCuerpo();
pintarResumen();
