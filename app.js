const API_URL =
"https://script.google.com/macros/s/AKfycbyf1xUufckqtI02C2KKPa4rwaybXdndZ7aidClVIUOfL4dgjDZJWWlJH6y3S2EyoxkF-w/exec";

let radios = []; 

/****************************************
 * CARGAR RADIOS
 ****************************************/
async function loadRadios() {

  try {

    const response =
      await fetch(API_URL);

    const data =
      await response.json();

    console.log(
      "Datos recibidos:",
      data
    );

    radios =
      data.radios || [];

    renderCards();

  } catch (error) {

    console.error(
      "Error cargando radios:",
      error
    );

  }

}

/****************************************
 * RENDERIZAR
 ****************************************/
function renderCards() {

  const pendientesContainer =
    document.getElementById(
      "pendientesContainer"
    );

  const aprobadasContainer =
    document.getElementById(
      "aprobadasContainer"
    );

  if (
    !pendientesContainer ||
    !aprobadasContainer
  ) {
    return;
  }

  pendientesContainer.innerHTML = "";
  aprobadasContainer.innerHTML = "";

  const pendientes =
    radios.filter(
      r =>
        !String(
          r.pageId || ""
        ).trim()
    );

  const aprobadas =
    radios.filter(
      r =>
        String(
          r.pageId || ""
        ).trim()
    );

  document
    .getElementById(
      "total"
    )
    .textContent =
    radios.length;

  document
    .getElementById(
      "pendientes"
    )
    .textContent =
    pendientes.length;

  document
    .getElementById(
      "publicadas"
    )
    .textContent =
    aprobadas.length;

  pendientes.forEach(
    radio => {

      pendientesContainer.appendChild(
        crearCard(
          radio,
          false
        )
      );

    }
  );

  let numero = 1;

aprobadas.forEach(radio => {

  const item = document.createElement("div");

  item.className = "radio-aprobada";

  item.innerHTML = `
    <div class="radio-numero">${numero}</div>

    <img
      class="radio-mini-logo"
      src="${radio.logo || 'https://via.placeholder.com/50'}"
      alt="${radio.nombre || ''}"
      onerror="this.src='https://via.placeholder.com/50'">

    <div class="radio-datos">
      <strong>${radio.nombre || 'Sin nombre'}</strong>
    </div>

    <a
      href="${radio.url || '#'}"
      target="_blank"
      class="btn-mini view">
      Ver Blog
    </a>

    <button
      class="btn-mini edit"
      onclick="editar(${radio.fila})">
      Editar
    </button>
  `;

  aprobadasContainer.appendChild(item);

  numero++;

});

   
}
/****************************************
 * CREAR TARJETA
 ****************************************/
function crearCard(
  radio,
  publicada
) {

  const card =
    document.createElement(
      "div"
    );

  card.className =
    "card";

  let botones = "";

  if (!publicada) {

    botones = `

      <button
      class="btn approve"
      onclick="aprobar(${radio.fila})">

        ✅ Aprobar

      </button>

      <button
      class="btn delete"
      onclick="eliminarRadio(${radio.fila})">

        🗑 Eliminar

      </button>

    `;

  } else {

    botones = `

      <a
      href="${radio.url || '#'}"
      target="_blank"
      class="btn view">

        🔗 Ver Blog

      </a>

      <button
      class="btn edit"
      onclick="editar(${radio.fila})">

        ✏️ Editar

      </button>

    `;

  }

  card.innerHTML = `

    <img
    src="${radio.logo || 'https://via.placeholder.com/500x300?text=Radio'}"
    alt="${radio.nombre}"
    onerror="this.src='https://via.placeholder.com/500x300?text=Radio'">

    <div class="content">

      <h3>
        ${radio.nombre || "Sin nombre"}
      </h3>

      <p>
        📍 ${radio.ciudad || ""}
        ${radio.pais ? ", " + radio.pais : ""}
      </p>

      <audio
      controls
      class="player">

        <source
        src="${radio.stream || ''}">

      </audio>

      <div class="actions">

        ${botones}

      </div>

    </div>

  `;

  return card;

}

/****************************************
 * APROBAR
 ****************************************/
async function aprobar(
  fila
) {

  if (
    !confirm(
      "¿Publicar esta emisora?"
    )
  ) {
    return;
  }

  try {

    await fetch(
      API_URL,
      {
        method: "POST",
        body: JSON.stringify({
          action: "aprobar",
          fila
        })
      }
    );

    await loadRadios();

  } catch (error) {

    console.error(error);

  }

}
/****************************************
 * ELIMINAR
 ****************************************/
async function eliminarRadio(
  fila
) {

  if (
    !confirm(
      "¿Eliminar esta emisora?"
    )
  ) {
    return;
  }

  try {

    await fetch(
      API_URL,
      {
        method: "POST",
        body: JSON.stringify({
          action: "eliminar",
          fila
        })
      }
    );

    await loadRadios();

  } catch (error) {

    console.error(error);

  }

}

/****************************************
 * EDITAR
 ****************************************/
function editar(fila){

const radio =
radios.find(
r => r.fila == fila
);

if(!radio) return;

document
.getElementById(
"editFila"
).value = fila;

document
.getElementById(
"editNombre"
).value =
radio.nombre || "";

document
.getElementById(
"editCiudad"
).value =
radio.ciudad || "";

document
.getElementById(
"editPais"
).value =
radio.pais || "";

document
.getElementById(
"editStream"
).value =
radio.stream || "";

document
.getElementById(
"editLogo"
).value =
radio.logo || "";

document
.getElementById(
"editWeb"
).value =
radio.web || "";

document
.getElementById(
"editWhatsapp"
).value =
radio.whatsapp || "";

document
.getElementById(
"editFacebook"
).value =
radio.facebook || "";

document
.getElementById(
"editInstagram"
).value =
radio.instagram || "";

document
.getElementById(
"editDescripcion"
).value =
radio.descripcion || "";

document
.getElementById(
"editModal"
).style.display =
"flex";

}
function cerrarModal(){

document
.getElementById(
"editModal"
).style.display =
"none";

}

/****************************************
 * BUSCADOR
 ****************************************/
document.addEventListener(
  "DOMContentLoaded",
  () => {

    const searchInput =
      document.getElementById(
        "search"
      );

    if (searchInput) {

      searchInput.addEventListener(
        "input",
        function () {

          const texto =
            this.value
            .toLowerCase();

          document
            .querySelectorAll(
              ".card"
            )
            .forEach(card => {

              card.style.display =
                card.innerText
                  .toLowerCase()
                  .includes(texto)
                  ? ""
                  : "none";

            });

        }
      );

    }

    loadRadios();

  }
);
async function guardarEdicion() {

  const fila =
  document.getElementById("editFila").value;

  const radio = {

    nombre:
    document.getElementById("editNombre").value,

    ciudad:
    document.getElementById("editCiudad").value,

    pais:
    document.getElementById("editPais").value,

    stream:
    document.getElementById("editStream").value,

    logo:
    document.getElementById("editLogo").value,

    web:
    document.getElementById("editWeb").value,

    whatsapp:
    document.getElementById("editWhatsapp").value,

    facebook:
    document.getElementById("editFacebook").value,

    instagram:
    document.getElementById("editInstagram").value,

    descripcion:
    document.getElementById("editDescripcion").value

  };

  try {

    const response =
    await fetch(API_URL, {

      method: "POST",

      body: JSON.stringify({

        action: "editar",

        fila,

        radio

      })

    });

    const result =
    await response.json();

    if(result.success){

      alert(
        "✅ Emisora actualizada"
      );

      cerrarModal();

      loadRadios();

    } else {

      alert(
        "❌ " + result.error
      );

    }

  } catch(error){

    console.error(error);

    alert(
      "Error al guardar"
    );

  }

}
function showTab(tab, btn){

document
.querySelectorAll(".tab-content")
.forEach(el => {

el.classList.remove("active");

});

document
.querySelectorAll(".nav-btn")
.forEach(el => {

el.classList.remove("active");

});

if(tab === "pendientes"){

document
.getElementById("tabPendientes")
.classList.add("active");

}

if(tab === "aprobadas"){

document
.getElementById("tabAprobadas")
.classList.add("active");

}

if(tab === "config"){

document
.getElementById("tabConfig")
.classList.add("active");

}

btn.classList.add("active");

}
