const grid = document.querySelector("[data-grid]");
const searchInput = document.querySelector("[data-search]");
const viewSelect = document.querySelector("[data-view]");
const countOutput = document.querySelector("[data-count]");
const printButton = document.querySelector("[data-print]");

const placeholderText = "Kratki opis artikla - placeholder za buduce specifikacije, dimenzije i napomene.";

const categoryRules = [
  { key: "coatings", label: "Premazi", words: ["CAPA", "PU-", "LATEX", "DIAMONDS", "INDEKO", "DUPA", "PF ", "BOTAMENT"] },
  { key: "tools", label: "Alat", words: ["VALJAK", "CETK", "SPAKLA", "MISTRIJA", "GLETARICA", "TELESKOP", "PISTOLJ", "MJESAC"] },
  { key: "materials", label: "Materijal", words: ["TRAKA", "KVARC", "GLASPERLEN", "FOLIJA", "MREZICA", "KANTA", "KADICA"] },
  { key: "services", label: "Usluga", words: ["USLUGA", "UGRADNJA", "INJEKTIRANJE"] },
];

function getCategory(product) {
  const name = product.name.toUpperCase();
  return categoryRules.find((rule) => rule.words.some((word) => name.includes(word))) || {
    key: "construction",
    label: "Gradjevinski program",
  };
}

function initials(name) {
  return name
    .replace(/[()+.,]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function productCard(product) {
  const category = getCategory(product);
  const article = document.createElement("article");
  article.className = `product-card product-card--${category.key}`;
  article.innerHTML = `
    <div class="product-image" aria-label="Placeholder slika artikla">
      <span class="placeholder-mark">${initials(product.name)}</span>
      <span class="placeholder-caption">Slika artikla</span>
    </div>
    <div class="product-copy">
      <p class="category">${category.label}</p>
      <h2>${product.name}</h2>
      <p class="description">${placeholderText}</p>
      <div class="meta-line">
        <strong>Sifra: ${product.code}</strong>
        <span>JM: ${product.unit}</span>
      </div>
    </div>
  `;
  return article;
}

function render() {
  const query = searchInput.value.trim().toUpperCase();
  const products = window.PRODUCTS.filter((product) => {
    const haystack = `${product.code} ${product.name} ${product.unit}`.toUpperCase();
    return haystack.includes(query);
  });

  grid.dataset.view = viewSelect.value;
  grid.replaceChildren(...products.map(productCard));
  countOutput.value = `${products.length} artikala`;
}

searchInput.addEventListener("input", render);
viewSelect.addEventListener("change", render);
printButton.addEventListener("click", () => window.print());

render();
