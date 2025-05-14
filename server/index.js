import express from "express";
import Connection from "./database/db.js";
import router from "./routes/api.js";
import router1 from "./routes/api1.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 9000;

// ✅ CORS setup: allow your frontend domain
app.use(
  cors({
    origin: "http://file-sharing-server-nccmpe1na-sinankambrans-projects.vercel.app", // allow only your frontend
    credentials: true, // enable cookies/session if needed
  })
);

app.use(express.json());

// Routes
app.use("/", router);
app.use("/auth", router1);

// Start server
app.listen(PORT, () => console.log(`server is running on port: ${PORT}`));

// Connect to DB
Connection();
