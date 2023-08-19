import express from "express";
const port = 8080;
const app = express();

import Routes from './routes/products.routes.js'

app.use(express.json())
app.use('/', Routes);
app.use('/POST/:id/:title/:description/:code/:price/:stock/:category/:thumbnails', Routes)
app.use('/GET', Routes);
app.use('/DELETE/:Pid', Routes);
app.use('/GET/:Pid', Routes);
app.use('/GET/LIM/:lim', Routes);
app.use('/PUT/:Pid/:title/:description/:code/:price/:stock/:category/:thumbnails', Routes);

app.listen(port, ()=>{
    console.log("servidor listo!")
})



