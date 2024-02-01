import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
import { errorHandler } from "./core/middlewares/errorHandler";
import { userRoutes } from "./routes/users.routes";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use(errorHandler);

app.get("/", (req, res) => {
    res.json({
        timestamp: new Date(),
    });
});

app.use("/users", userRoutes);

export default app;

