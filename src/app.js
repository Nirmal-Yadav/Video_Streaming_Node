import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: "true",
  })
);

app.use(express.json({ limit: "20kb" }));

app.use(
  express.urlencoded({
    extended: true,
    limit: "20kb",
  })
);

app.use(cookieParser());

app.get("/test-cookies", (req, res) => {
  console.log("Cookies:", req.cookies);
  res.json({ cookies: req.cookies });
});

app.use(express.static("public")); // static files like HTML, CSS, JavaScript, images, videos, fonts, etc.

// import routes
import userRouter from "./routes/user.routes.js";

// routes declaration

app.use("/api/v1/users", userRouter); //http://localhost:8000/api/v1/users/login

export { app };
