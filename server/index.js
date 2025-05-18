import express from "express";
import Connection from "./database/db.js";
import router from "./routes/api.js";
import router1 from "./routes/api1.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 9000;

const allowedOrigins = [
  "http://localhost:5173",
  "http://file-sharing-server-nccmpe1na-sinankambrans-projects.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
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
