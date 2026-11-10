 
const IDS = {
  form: "form",
  cne: "cne",
  nom: "nom",
  formation: "formation",
  sexe: "sexe",
  cards: "cards",
  message: "message"
};

 
function Etudiant(cne, nom, formation, sexe) {
  this.cne = cne;
  this.nom = nom;
  this.formation = formation;
  this.sexe = sexe;
}

 
function estFemme(sexe) {
  return ["f", "femme", "fille", "female"].includes(String(sexe).toLowerCase());
}

function avatar(sexe) {
  const femme = estFemme(sexe);
  const bg = femme ? "#f7dfe9" : "#dbe7f7";
  const fg = femme ? "#c06c9a" : "#5b7db1";
  const cheveux = femme
    ? '<path d="M28 46 C28 20 40 14 50 14 C60 14 72 20 72 46 L78 74 C66 66 34 66 22 74 Z"/>'
    : "";

  return `
    <div style="width:110px;height:110px;border-radius:50%;overflow:hidden;margin:0 auto 10px">
      <svg width="110" height="110" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" fill="${bg}"/>
        <g fill="${fg}">
          ${cheveux}
          <circle cx="50" cy="40" r="16"/>
          <path d="M14 100 C14 74 30 68 50 68 C70 68 86 74 86 100 Z"/>
        </g>
      </svg>
    </div>`;
}
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

Etudiant.prototype.affiche = function () {
  return `
    <div style="display:inline-block;vertical-align:top;width:200px;margin:10px;padding:14px;
                background:#fff;border:1px solid #ddd;border-radius:10px;text-align:center;
                font-family:Arial,sans-serif;box-shadow:0 2px 6px rgba(0,0,0,0.12)">
      ${avatar(this.sexe)}
      <h3 style="margin:6px 0">${escapeHtml(this.nom)}</h3>
      <p style="margin:4px 0">CNE : ${escapeHtml(this.cne)}</p>
      <p style="margin:4px 0">Formation : ${escapeHtml(this.formation)}</p>
    </div>`;
};

const form = document.getElementById(IDS.form);

let cards = document.getElementById(IDS.cards);
if (!cards) {
  cards = document.createElement("div");
  cards.id = IDS.cards;
  document.body.appendChild(cards);
}

const cnes = [];

function showError(text) {
  const message = document.getElementById(IDS.message);
  if (message) message.textContent = text;
  else if (text) alert(text);
}

function getSexe() {
  const select = document.getElementById(IDS.sexe);
  if (select) return select.value;
  const radio = document.querySelector('input[name="sexe"]:checked');
  return radio ? radio.value : "";
}

if (!form) {
  console.error("Form introuvable: verifie IDS.form f index.html");
} else {
  form.addEventListener("submit", function (e) {
    e.preventDefault(); 

    const cne = document.getElementById(IDS.cne).value.trim();
    const nom = document.getElementById(IDS.nom).value.trim();
    const formation = document.getElementById(IDS.formation).value.trim();
    const sexe = getSexe();

    if (!cne || !nom || !formation || !sexe) {
      showError("Remplis tous les champs.");
      return;
    }
    if (cnes.includes(cne)) {
      showError("Ce CNE existe deja.");
      return;
    }

    cnes.push(cne);
    showError("");
    const etu = new Etudiant(cne, nom, formation, sexe);
    cards.insertAdjacentHTML("beforeend", etu.affiche());
    form.reset();
  });
}