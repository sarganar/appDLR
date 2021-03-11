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
    test.sort((a, b) => (a.name > b.name ? 1 : -1));
    console.log("test:", test);

    buildLayoutScheme(products);

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

const getAllCategories = (products) => {
  const categoriesSet = new Set();
  products.forEach((product) => categoriesSet.add(product.category));

  // console.log("*categoriesSet", categoriesSet);
  return [...categoriesSet].sort();
  // console.log("*categoriesArray", categoriesArray);
};

function buildLayoutScheme(products) {
  // const categoriesSet = new Set();

  // products.forEach((product) => categoriesSet.add(product.category));

  // // console.log("*categoriesSet", categoriesSet);
  // const categoriesArray=[...categoriesSet].sort();

  const categoriesArray = getAllCategories(products);
  console.log("*categoriesArray", categoriesArray);

  let categoryObj = [];

  categoriesArray.forEach((category) => {
    let brandObj = [];
    const filteredByCategory = products.filter(
      (product) => product.category === category
    );
    // console.log(" category:", category);
    const brandSet = new Set();
    filteredByCategory.forEach((product) => brandSet.add(product.brand));

    // console.log(" brandSet", brandSet);
    brandSet.forEach((brand) => {
      const filteredByBrand = filteredByCategory.filter(
        (product) => product.brand === brand
      );
      //   console.log("  filteredByBrand", filteredByBrand);
      const listId = [];
      filteredByBrand.forEach((product) => {
        listId.push(product.id);
      });
      brandObj[brand] = [...listId];
    });
    // console.log("  brandObj", brandObj);
    categoryObj[category] = { ...brandObj };
  });
  console.log("categorizedProducts:", categoryObj);
  return categoryObj;
}
