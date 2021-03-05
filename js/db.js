import { brand } from "../db/brand.js";
import { categories } from "../db/categories.js";

let products, discounts, zeroStock, contagramDB;

export async function fectchDB() {
  const urlBase = "https://sarganar.github.io/appDLR/db/";
  const urlProducts = "products.json";
  const urlDiscounts = "discounts.json";
  const urlZeroStock = "zero_stock.json";
  const urlContagramDB = "contagramDB.json";

  try {
    let response = await fetch(`${urlBase}${urlProducts}`);
    products = await response.json();
    products = keyBy(products, "iddlr");
    console.log("products:", products);

    response = await fetch(`${urlBase}${urlDiscounts}`);
    discounts = await response.json();
    //discounts = keyBy(discounts, "iddlr");
    console.log("discounts:", discounts);

    response = await fetch(`${urlBase}${urlZeroStock}`);
    zeroStock = await response.json();
    zeroStock = keyBy(zeroStock, "iddlr");
    console.log("zeroStock:", zeroStock);

    response = await fetch(`${urlBase}${urlContagramDB}`);
    contagramDB = await response.json();
    contagramDB = keyBy(contagramDB, "cdigo");
    console.log("contagramDB", contagramDB);
  } catch (error) {
    console.log("error:", error);
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
    let brandID = products[key].brand;
    if (typeof brand[brandID] !== "undefined") {
      products[key].brand = brand[brandID];
    }

    // CATEGORIES
    let categoryID = products[key].category;
    if (typeof categories[categoryID] !== "undefined") {
      products[key].category = categories[categoryID];
    }

    // DISCOUNT AND STOCK : BY DEFAULT VALUES
    products[key].hasDiscount = false;
    products[key].hasStock = true;

    // TAGS
    populateTags(products[key]);
  }

  discounts.forEach((element) => {
    console.log(element.text);
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
