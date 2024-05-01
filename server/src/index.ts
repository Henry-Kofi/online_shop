import express,{Application} from "express"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import "dotenv/config"
import { createServer, Server } from "http";
import authRoute from "./route/user";

const app: Application = express();
const server: Server = createServer(app);

if (!process.env.PORT) {
    throw new Error("PORT environment variable is not set");
  }
  
  if (!process.env.MONGO_URL) {
    throw new Error("MONGO_URL environment variable is not set");
  }

const port  = parseInt(process.env.PORT)
const mongo_url  = String(process.env.MONGO_URL)


app.use(express.json());
app.use(cookieParser())

app.use("/api/user",authRoute)

mongoose.connect(mongo_url)
  .then(() => console.log("Connected to mongoDB"))
  .catch((err) => console.error(`Mongoose error: ${err}`))

const connection = mongoose.connection;

server.listen(port,() => {
    console.log(`Server running on port ${port}`)
})

// for debugging 
// process.on("uncaughtException",(err) => {
//     console.error(`Uncaught exception ${err.stack}`)
// })