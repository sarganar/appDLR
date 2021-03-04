
let fullProducts = [];
export let keyedFullProducts = [];
export let categoriesTable;
export let categorizedProducts = [];

document.addEventListener("DOMContentLoaded", initApp);

async function initApp() {

  const url ='https://sarganar.github.io/appDLR/db/products.json'  ;
  const data = await fetch(url);

  const obj = JSON.parse(data);

  console.log(obj);

}

const keyBy = (arr, key) =>
  arr.reduce((acc, el) => {
    acc[el[key]] = el;
    return acc;
  }, {});

