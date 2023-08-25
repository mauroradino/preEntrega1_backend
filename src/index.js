import express from "express";
const port = 8080;
const app = express();

import { productRoutes, cartRoutes } from './routes/products.routes.js'

app.use(express.json())
app.use('/', productRoutes);
app.use('/api', cartRoutes);

app.listen(port, ()=>{
    console.log(`Servidor Listo en el puerto ${port}`)
})


