import express from 'express'
import fs from "fs";

const products = [];
const productRoutes = express.Router();
const cartRoutes = express.Router();
let contCart = 0;
const arrayCarrito = [];

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


productRoutes.get('/GET', (req, res) => {
    fs.readFile('./src/models/products.json', 'utf-8', (err, data) => {
        if (err) {
            res.status(404).send("Error al leer el archivo");
            return;
        }
        const parsedData = JSON.parse(data);
        res.send(parsedData);
    });
});

productRoutes.get('/GET/:Pid', (req, res) =>{
    fs.readFile('./src/models/products.json', 'utf-8', (err, data)=>{
        if(err) res.status(404).send("Error al leer el archivo");
        const { Pid } = req.params;
        const dataStr = JSON.parse(data)
        dataStr.map((newData)=>{
            newData.id === Pid ? res.send(newData) : null
        })
    })
})

productRoutes.get('/GET/LIM/:lim', (req, res) =>{
    const { lim } = req.params;
    fs.readFile('./src/models/products.json', 'utf-8', (err, data)=>{
        if(err) res.status(404).send("Error al leer el archivo");
        const { Pid } = req.params;
        const dataStr = JSON.parse(data)
        const dataAMostrar = dataStr.splice(0, lim);
        res.send(dataAMostrar);
    })
})

productRoutes.delete('/DELETE/:Pid', (req, res) =>{
    const { Pid } = req.params;
    const posicion = products.findIndex(product => product.id === Pid);
    console.log("POSICION", posicion)
    console.log("PRODUCTS", products)

    if (posicion !== -1) {
        products.splice(posicion, 1);
        fs.writeFile("./src/models/products.json", JSON.stringify(products), (err) => {
            if (err) {
                res.status(404).send("Error al crear el producto");
            }
          })
        res.send("Producto eliminado exitosamente.");
    } else {
        res.status(404).send("Producto no encontrado.");
    }
})

productRoutes.put('/PUT/:Pid/:title/:description/:code/:price/:stock/:category/:thumbnails', (req, res) => {
    const { Pid } = req.params;
    const { title } = req.params;
    const { description } = req.params;
    const { code } = req.params;
    const { price } = req.params;
    const { stock } = req.params;
    const { category } = req.params;
    const { thumbnails } = req.params;
    
    fs.readFile('./src/models/products.json', 'utf-8', (err, data) => {
        console.log("TODO OK")
        if (err) {
            res.status(404).send("Error al leer el archivo");
            return;
        }
        console.log("data put: ", data);
    
        const parsedData = JSON.parse(data);
        let productoEncontrado = false;
    
        parsedData.forEach(producto => {
            if (producto.id === Pid) {
                producto.title = title;
                producto.description = description;
                producto.code = code;
                producto.price = price;
                producto.stock = stock;
                producto.category = category;
                producto.thumbnails = thumbnails;
                productoEncontrado = true;
            }
        });
    
        if (productoEncontrado) {
            fs.writeFile("./src/models/products.json", JSON.stringify(parsedData), err => {
                if (err) {
                    res.status(500).send("Error al escribir en el archivo");
                } else {
                    res.send("Producto actualizado exitosamente.");
                }
            });
        } else {
            res.status(404).send("Producto no encontrado.");
        }
    });
});


productRoutes.post('/POST/:id/:title/:description/:code/:price/:stock/:category/:thumbnails', (req, res) =>{
    const { id } = req.params;
    const { title } = req.params;
    const { description } = req.params;
    const { code } = req.params;
    const { price } = req.params;
    const { stock } = req.params;
    const { category } = req.params;
    const { thumbnails } = req.params;
    
    const producto = new product(id,title,description,code,price,stock,category,thumbnails)
    res.send(`Producto Creado ${producto}`)
    products.push(producto)
    
    fs.writeFile("./src/models/products.json", JSON.stringify(products), (err) => {
        if (err) {
            res.status(404).send("Error al crear el producto");
        }
      })
    
    })


cartRoutes.post('/POST/:Cid/:products', (req, res) =>{
    const { Cid } = req.params;
    contCart ++;
   
    const carrito = {
        id: Cid,
        products: [] 
    }
    arrayCarrito.push(carrito)
    res.send(arrayCarrito)
})

cartRoutes.get('/GET/:Cid', (req, res) =>{
    const { Cid } = req.params;

    const selectedCart = arrayCarrito.find((carrito) => carrito.id === Cid);
    res.send(selectedCart)
})

cartRoutes.post('/POST/:Cid/product/:Pid', (req, res) => {
    const { Cid, Pid } = req.params;

    const selectedCart = arrayCarrito.find((carrito) => carrito.id === Cid);

    if (!selectedCart) {
        res.status(404).send("Carrito no encontrado.");
        return;
    }

    const cartProduct = selectedCart.products.find((producto) => producto.id === Pid);

    if (!cartProduct) {
        selectedCart.products.push({
            id: Pid,
            quantity: 1
        });
    } else {
        cartProduct.quantity++;
    }
    res.send(selectedCart);
});

export { cartRoutes, productRoutes };