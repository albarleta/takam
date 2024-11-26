import express from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";

import "dotenv/config";
import "./configs/db.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import foodRoutes from "./routes/foodRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";

const app = express();
const PORT = process.env.PORT ?? 8080;
const BASE_URL = "/api/v1";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);

app.use(helmet());

app.use(`${BASE_URL}/auth`, authRoutes);
app.use(`${BASE_URL}/users`, userRoutes);
app.use(`${BASE_URL}/foods`, foodRoutes);
app.use(`${BASE_URL}`, commentRoutes);
app.use(`${BASE_URL}/orders`, orderRoutes);
app.use(`${BASE_URL}/cart`, cartRoutes);

app.listen(PORT, () => console.log(`Server running at ${PORT}`));
