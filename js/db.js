

export async function fectchDB(){
    const urlBase = "https://sarganar.github.io/appDLR/db/";
    const urlProducts='products.json';
    const urlDiscounts='discounts.json';
    const urlZeroStock='zero_stock.json';
    const urlContagramDB='contagramDB.json';
    

    try {
      let response = await fetch(`${urlBase}${urlProducts}`);
      const products = await response.json();
      console.log(products);

      response = await fetch(`${urlBase}${urlDiscounts}`);
      const discounts = await response.json();
      console.log(discounts);



    } catch (error) {
      console.log(error);
    }    
}