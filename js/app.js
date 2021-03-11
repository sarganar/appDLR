import { fetchDB, buildPostProducts } from "./db.js";

let fullProducts = [];
export let keyedFullProducts = [];
export let categoriesTable;
export let categorizedProducts = [];

document.addEventListener("DOMContentLoaded", initApp);

async function initApp() {
  await fetchDB();

  buildPostProducts();
}
