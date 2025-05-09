import express from "express";
import Connection from "./database/db.js";
import router from "./routes/api.js";
import router1 from "./routes/api1.js";
import cors from 'cors';


const app = express();


const PORT = process.env.PORT||9000
app.use(cors());
app.use(express.json());

app.use('/',router);
app.use('/auth',router1)



app.listen(PORT,()=>
    console.log(`server is running on port: ${PORT}`)
);
Connection();