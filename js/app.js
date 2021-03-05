import { fectchDB } from "./db.js";

let fullProducts = [];
export let keyedFullProducts = [];
export let categoriesTable;
export let categorizedProducts = [];

document.addEventListener("DOMContentLoaded", initApp);

async function initApp() {
  fectchDB();
}


