const grid = document.querySelector("[data-grid]");
const searchInput = document.querySelector("[data-search]");
const viewSelect = document.querySelector("[data-view]");
const countOutput = document.querySelector("[data-count]");

const categoryRules = [
  { key: "coatings", words: ["CAPA", "PU-", "LATEX", "DIAMONDS", "INDEKO", "DUPA", "PF ", "BOTAMENT"] },
  { key: "tools", words: ["VALJAK", "CETK", "SPAKLA", "MISTRIJA", "GLETARICA", "TELESKOP", "PISTOLJ", "MJESAC"] },
  { key: "materials", words: ["TRAKA", "KVARC", "GLASPERLEN", "FOLIJA", "MREZICA", "KANTA", "KADICA"] },
  { key: "services", words: ["USLUGA", "UGRADNJA", "INJEKTIRANJE"] },
];

function getCategory(product) {
  const name = product.name.toUpperCase();
  return categoryRules.find((rule) => rule.words.some((word) => name.includes(word)))?.key || "construction";
}

function placeholderContent(product) {
  return `
    <span class="placeholder-mark" aria-hidden="true">${product.code}</span>
    <span class="placeholder-caption">Slika nije dostupna</span>
  `;
}

function imageContent(product) {
  if (!product.image) {
    return placeholderContent(product);
  }

  return `<img src="${product.image}" alt="${product.name}" loading="lazy" decoding="async" />`;
}

function showPlaceholder(imageBox, product) {
  imageBox.classList.remove("product-image--filled");
  imageBox.classList.add("product-image--empty");
  imageBox.setAttribute("aria-label", "Slika nije dostupna");
  imageBox.innerHTML = placeholderContent(product);
}

function getOrderNumber(product) {
  const orderNumber = Number(product.orderNumber);
  return Number.isFinite(orderNumber) ? orderNumber : Number.MAX_SAFE_INTEGER;
}

function sortByOrderNumber(products) {
  return products
    .map((product, index) => ({ product, index }))
    .sort((a, b) => getOrderNumber(a.product) - getOrderNumber(b.product) || a.index - b.index)
    .map(({ product }) => product);
}

function productCard(product) {
  const category = getCategory(product);
  const article = document.createElement("article");
  article.className = `product-card product-card--${category}`;
  article.innerHTML = `
    <div class="product-image ${product.image ? "product-image--filled" : "product-image--empty"}" aria-label="${product.image ? `Slika artikla ${product.name}` : "Slika nije dostupna"}">
      ${imageContent(product)}
    </div>
    <div class="product-copy">
      <h2>${product.name}</h2>
      <p class="description">${product.description || ""}</p>
      <div class="meta-line">
        <strong>Sifra: ${product.code}</strong>
        <span>JM: ${product.unit}</span>
      </div>
    </div>
  `;

  const imageBox = article.querySelector(".product-image");
  const image = imageBox.querySelector("img");
  image?.addEventListener("error", () => showPlaceholder(imageBox, product), { once: true });

  return article;
}

function render() {
  const query = searchInput.value.trim().toUpperCase();
  const selectedCodes = grid.dataset.codes?.split(",").map((code) => code.trim()).filter(Boolean);
  const codeOrder = selectedCodes ? new Map(selectedCodes.map((code, index) => [code, index])) : null;
  const filteredProducts = window.PRODUCTS.filter((product) => {
    const haystack = `${product.code} ${product.name} ${product.unit}`.toUpperCase();
    return (!codeOrder || codeOrder.has(String(product.code))) && haystack.includes(query);
  });
  const products = codeOrder
    ? filteredProducts.sort((a, b) => codeOrder.get(String(a.code)) - codeOrder.get(String(b.code)))
    : sortByOrderNumber(filteredProducts);

  grid.dataset.view = viewSelect.value;
  grid.replaceChildren(...products.map(productCard));
  countOutput.value = `${products.length} artikala`;
}

searchInput.addEventListener("input", render);
viewSelect.addEventListener("change", render);

render();
