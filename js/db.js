export async function fectchDB() {
  const urlBase = "https://sarganar.github.io/appDLR/db/";
  const urlProducts = "products.json";
  const urlDiscounts = "discounts.json";
  const urlZeroStock = "zero_stock.json";
  const urlContagramDB = "contagramDB.json";

  try {
    let response = await fetch(`${urlBase}${urlProducts}`);
    const products = await response.json();
    console.log("products:", products);

    response = await fetch(`${urlBase}${urlDiscounts}`);
    const discounts = await response.json();
    console.log("discounts:", discounts);

    response = await fetch(`${urlBase}${urlZeroStock}`);
    const zeroStock = await response.json();
    console.log("zeroStock:", zeroStock);

    response = await fetch(`${urlBase}${urlContagramDB}`);
    const contagramDB = await response.json();
    console.log("contagramDB", contagramDB);
  } catch (error) {
    console.log('error:',error);
  }
}
