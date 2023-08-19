import express from "express";
const port = 8080;
const app = express();

import Routes from './routes/products.routes.js'

app.use(express.json())
app.use('/products', Routes);
app.use('/products/POST/:id/:title/:description/:code/:price/:stock/:category/:thumbnails', Routes)
app.use('/products/GET', Routes);
app.use('/products/DELETE/:Pid', Routes);
app.use('/products/GET/:Pid', Routes);
app.use('/products/GET/LIM/:lim', Routes);
app.use('/products/PUT/:Pid/:title/:description/:code/:price/:stock/:category/:thumbnails', Routes);

app.listen(port, ()=>{
    console.log("servidor listo!")
})



