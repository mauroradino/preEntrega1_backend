import express from 'express'
import fs from "fs";

const products = [];
const Routes = express.Router();

Routes.get('/', (req, res) => {
    res.send("HOLAAA");
});

Routes.get('/GET', (req, res) => {
    fs.readFile('./src/models/products.json', 'utf-8', (err, data) => {
        if (err) {
            res.status(404).send("Error al leer el archivo");
            return;
        }
        const parsedData = JSON.parse(data);
        res.send(parsedData);
    });
});

Routes.get('/GET/:Pid', (req, res) =>{
    fs.readFile('./src/models/products.json', 'utf-8', (err, data)=>{
        if(err) res.status(404).send("Error al leer el archivo");
        const { Pid } = req.params;
        const dataStr = JSON.parse(data)
        dataStr.map((newData)=>{
            newData.id === Pid ? res.send(newData) : null
        })
    })
})

Routes.get('/GET/LIM/:lim', (req, res) =>{
    const { lim } = req.params;
    fs.readFile('./src/models/products.json', 'utf-8', (err, data)=>{
        if(err) res.status(404).send("Error al leer el archivo");
        const { Pid } = req.params;
        const dataStr = JSON.parse(data)
        const dataAMostrar = dataStr.splice(0, lim);
        res.send(dataAMostrar);
    })
})

Routes.delete('/DELETE/:Pid', (req, res) =>{
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

Routes.put('/PUT/:Pid/:title/:description/:code/:price/:stock/:category/:thumbnails', (req, res) => {
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


Routes.post('/POST/:id/:title/:description/:code/:price/:stock/:category/:thumbnails', (req, res) =>{
    const { id } = req.params;
    const { title } = req.params;
    const { description } = req.params;
    const { code } = req.params;
    const { price } = req.params;
    const { stock } = req.params;
    const { category } = req.params;
    const { thumbnails } = req.params;
    
    const product = {
        id: id,
        title: title,
        description: description,
        code: code,
        price: price,
        status: true,
        stock: stock,
        category: category,
        thumbnails: thumbnails
    }
    
    res.send(`Producto Creado ${product}`)
    products.push(product)
    
    fs.writeFile("./src/models/products.json", JSON.stringify(products), (err) => {
        if (err) {
            res.status(404).send("Error al crear el producto");
        }
      })
    
    })
 
export default Routes;