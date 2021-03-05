import { brand } from "../db/brand.js";
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
    discounts = keyBy(discounts, "iddlr");
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
    if (typeof contagramDB[key] !== "undefined") {
      products[key].price = contagramDB[key].precioDeVenta;
      // console.log(key);
    } else {
      console.log("no se encontro para:", key, products[key].name);
    }

    if (typeof discounts[key] !== "undefined") {
      products[key].discounts = key;
      // console.log(key);
    } else {
      products[key].discounts = "no-discounts";
    }

    let brandID = products[key].brand;
    if (typeof brand[brandID] !== "undefined") {
      products[key].brand = brand[brandID];
    }
  }

  console.log(products);
}
