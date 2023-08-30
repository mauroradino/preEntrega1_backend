import fs from 'fs'
class product {
    constructor(id, title, description, code, price, stock, category, thumbnails){
        this.id = id;
        this.title = title;
        this.description = description;
        this.code = code;
        this.price = price;
        this.status = true;
        this.stock = stock;
        this.category = category;
        this.thumbnails = thumbnails
    }
}

export default class ProductManager {
  static productList = [];

  static addProduct = (id, title, description, code, price, stock, category, thumbnails) => {

    const newProduct = new product(id, title, description, code, price, stock, category, thumbnails);
    ProductManager.productList.push(newProduct);
    fs.readFile("./src/models/products.json", "utf-8", (err, data) =>{
      if(err){
        throw err;
      }
      const dataExistente = JSON.parse(data)
      dataExistente.push(newProduct)

    fs.writeFile("./src/models/products.json", JSON.stringify(dataExistente)  , (err) => {
        if (err) {
          throw err;
        }
    }
    );
})
  };



  static getProducts = () => {
    return new Promise((resolve, reject) => {
        fs.readFile("./src/models/products.json", "utf-8", (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(data));
            }
        });
    });
};



  static getProductById = (id) => {
    return new Promise((resolve, reject) => {
    fs.readFile("./src/models/products.json", "utf-8", (err, data) => {
      if (err){
        reject(err);
      }
      else{
        const filteredData = JSON.parse(data).filter((producto) => producto.id === id)
        resolve(filteredData);
      }
      
    });
});
  };


}