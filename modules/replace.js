module.exports = (temp, product) => {
  let output = temp
    .replace(/{%ID%}/g, product.id)
    .replace(/{%PRICE%}/g, product.price)
    .replace(/{%DESCRIPTION%}/g, product.description)
    .replace(/{%LINK%}/g, product.image)
    .replace(/{%NAME%}/g,product.productName);
    
    return output;
};