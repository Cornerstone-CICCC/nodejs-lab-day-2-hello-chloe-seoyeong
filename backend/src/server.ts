import express, { Request, Response } from "express";
import cookieSession from "cookie-session";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./routes/user.routes";
dotenv.config();

// Create your server
const app = express();

// Middleware
app.use(
  cors({
    origin: `http://localhost:4321`,
    credentials: true,
  })
);

const SIGN_KEY = process.env.COOKIE_SIGN_KEY;
const ENCRYPT_KEY = process.env.COOKIE_ENCRYPT_KEY;
if (!SIGN_KEY || !ENCRYPT_KEY) {
  throw new Error("Missing cookie 🍪 key!");
}
app.use(
  cookieSession({
    name: "session",
    keys: [SIGN_KEY, ENCRYPT_KEY],
    maxAge: 5 * 60 * 1000,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/", userRouter);

// 404 Fallback
app.use((req: Request, res: Response) => {
  res.status(404).send("Page not found!");
});

// Start server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
