import { brand } from "../db/brand.js";
import { categories } from "../db/categories.js";

let products, discounts, zeroStock, contagramDB;

export async function fetchDB() {
  const urlBase = "https://sarganar.github.io/appDLR/db/";
  const urlProducts = "products.json";
  const urlDiscounts = "discounts.json";
  const urlZeroStock = "zero_stock.json";
  const urlContagramDB = "contagramDB.json";

  try {
    let response;

    // BASE PRODUCTS
    response = await fetch(`${urlBase}${urlProducts}`);
    products = await response.json();

    console.log("products:", products);
    const test = [...products];
    test.sort((a, b) => {
      a.name > b.name ? 1 : -1;
    });
    console.log("test:", test);

    products = keyBy(products, "iddlr");
    console.log("fetchDB: products:", products);

    // DISCOUNTS
    response = await fetch(`${urlBase}${urlDiscounts}`);
    discounts = await response.json();
    console.log("fetchDB: discounts:", discounts);

    // STOCK
    response = await fetch(`${urlBase}${urlZeroStock}`);
    zeroStock = await response.json();
    zeroStock = keyBy(zeroStock, "iddlr");
    console.log("fetchDB: zeroStock:", zeroStock);

    // CONTAGRAM DB
    response = await fetch(`${urlBase}${urlContagramDB}`);
    contagramDB = await response.json();
    contagramDB = keyBy(contagramDB, "cdigo");
    console.log("fetchDB: contagramDB", contagramDB);
  } catch (error) {
    console.log("fetchDB: error:", error);
  }
}

const keyBy = (arr, key) =>
  arr.reduce((acc, el) => {
    const index = el[key] || Date.now();
    acc[index] = el;
    return acc;
  }, {});

export function buildPostProducts() {
  for (let key in products) {
    // PRICE
    if (typeof contagramDB[key] !== "undefined") {
      products[key].price = contagramDB[key].precioDeVenta;
      // console.log(key);
    } else {
      console.log("No se encontro precio para:", key, products[key].name);
    }

    // BRAND
    const brandID = products[key].brand;
    if (typeof brand[brandID] !== "undefined") {
      products[key].brand = brand[brandID];
    }

    // CATEGORIES
    const categoryID = products[key].category;
    if (typeof categories[categoryID] !== "undefined") {
      products[key].category = categories[categoryID];
    }

    // DISCOUNT : DEFAULT VALUE
    products[key].hasDiscount = false;

    // STOCK
    products[key].hasStock = true;
    if (typeof zeroStock[key] !== "undefined") {
      products[key].hasStock = false;
    }

    // TAGS
    populateTags(products[key]);
  }

  // REAL DISCOUNT
  discounts.forEach((element) => {
    const id = element.iddlr;
    if (typeof products[id] !== "undefined") {
      products[id].hasDiscount = true;
    }
  });

  console.log(products);
}

function populateTags(product) {
  let nameSplitted = product.name.trim().toLowerCase().split(" ");
  nameSplitted = removeShortWords(nameSplitted);
  product.tags = [...nameSplitted];
  if (product.brand !== "NO-BRAND") {
    product.tags = product.tags.concat(product.brand.toLowerCase());
  }
}
const removeShortWords = (array) => array.filter((word) => word.length > 2);
