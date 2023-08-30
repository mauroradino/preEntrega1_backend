import express from 'express'
import fs from "fs";
import ProductManager from '../productManager.js'; 
const productRoutes = express.Router();
const cartRoutes = express.Router();
let contCart = 0;
const arrayCarrito = [];
let contProd = 0;


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

fs.readFile('./src/models/counter.json', 'utf-8', (err, data) => {
    if (err) {
        return;
    }
    try {
        contProd = JSON.parse(data).contador;
    } catch (err) {
    }
});


productRoutes.get('/products/LIM', (req, res) => {
    const  lim  = req.query.lim;
    fs.readFile('./src/models/products.json', 'utf-8', (err, data)=>{
        if(err) res.status(404).send("Error al leer el archivo");
        const dataStr = JSON.parse(data)
        const dataAMostrar = dataStr.splice(0, lim);
        res.send(dataAMostrar);
    })
});

productRoutes.delete('/products', (req, res) =>{
    const id = req.query.id;
    fs.readFile('./src/models/products.json', 'utf-8', (err, data)=>{
    const newData = JSON.parse(data)
    const posicion = newData.findIndex(product => product.id === parseInt(id));

     newData.map((product)=>{
        product.id !== 0 ? product.id-- : product.id = 0
    }) 
     
    if (posicion !== -1) {
        newData.splice(posicion, 1);
        fs.writeFile("./src/models/products.json", JSON.stringify(newData), (err) => {
            if (err) {
                res.status(404).send("Error al crear el producto");
            }
          })
        res.status(200).send("Producto eliminado exitosamente")
    } else {
        res.status(404).send("Producto no encontrado.");
    }
})
})

productRoutes.put('/products', (req, res) => {
    const id = req.query.id
    const {title, description, code, price, stock, category, thumbnails } = req.body;

    
    fs.readFile('./src/models/products.json', 'utf-8', (err, data) => {
        if (err) {
            res.status(404).send("Error al leer el archivo");
            return;
        }
    
        const parsedData = JSON.parse(data);
        let productoEncontrado = false;
    
        parsedData.forEach(producto => {
            if (producto.id === parseInt(id)) {
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


productRoutes.get('/products', async (req, res) => {
    const id = req.query.id;
    if(id === undefined){
     try {
        const productosPromise = ProductManager.getProducts();
        const productos = await productosPromise; // Espera a que la promesa se resuelva
        res.send(productos);
    } catch (error) {
        res.status(500).send("Error al obtener los productos");
    }
}
    if(id !== undefined){
        try{
            const productosPromise = ProductManager.getProductById(parseInt(id));
            const productoBuscado = await productosPromise;    
        res.send(productoBuscado)
        }
        catch{
          res.status(400).send("Producto no encontrado")
        }
    }
});


productRoutes.post('/products', async (req, res) => {
    const { title, description, code, price, stock, category, thumbnails } = req.body;
    try {
        await ProductManager.addProduct(contProd, title, description, code, price, stock, category, thumbnails);
        res.status(200).send("Producto creado correctamente")
        fs.readFile('./src/models/counter.json', 'utf-8', (err, data) => {
            if (!err){
                contProd++;
            }

        fs.writeFile('./src/models/counter.json', JSON.stringify({ contador: contProd }) , err => {
            if(err){
                res.status(400)
            }
            else{
                res.status(200)
            }
        } )
        });

    } catch (error) {
        res.status(400).send("Error al crear el producto");
    }
});



cartRoutes.post('/cart', (req, res) =>{
    const Cid  = req.query.Cid;
    contCart ++;
   
    const carrito = {
        id: Cid,
        products: [] 
    }
    arrayCarrito.push(carrito)
    res.send(arrayCarrito)
})

cartRoutes.get('/cart/:Cid', (req, res) =>{
    const Cid = req.query.Cid;

    const selectedCart = arrayCarrito.find((carrito) => carrito.id === Cid);
    res.send(selectedCart)
})

cartRoutes.post('/cart', (req, res) => {
    const { Cid, Pid } = req.query;

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