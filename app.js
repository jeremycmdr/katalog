const grid = document.querySelector("[data-grid]");
const searchInput = document.querySelector("[data-search]");
const viewSelect = document.querySelector("[data-view]");
const countOutput = document.querySelector("[data-count]");

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

function imageContent(product) {
  if (!product.image) {
    return "";
  }

  return `<img src="${product.image}" alt="${product.name}" />`;
}

function productCard(product) {
  const category = getCategory(product);
  const article = document.createElement("article");
  article.className = `product-card product-card--${category.key}`;
  article.innerHTML = `
    <div class="product-image ${product.image ? "product-image--filled" : "product-image--empty"}" aria-label="${product.image ? `Slika artikla ${product.name}` : "Slika nije dostupna"}">
      ${imageContent(product)}
    </div>
    <div class="product-copy">
      <p class="category">${category.label}</p>
      <h2>${product.name}</h2>
      <p class="description">${product.description || ""}</p>
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

render();
