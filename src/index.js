import express from "express";
const port = 8080;
const app = express();

import { productRoutes, cartRoutes } from './routes/products.routes.js'

app.use(express.json())
app.use('/products', productRoutes);
app.use('/cart', cartRoutes);

app.listen(port, ()=>{
    console.log("servidor listo!")
})


