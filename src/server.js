import dotenv from "dotenv";
dotenv.config();

const { MONGODB_URI, SECRET, NODE_ENV } = process.env;

import express from "express";
const app = express();

// Session
import session from "express-session";
import MongoSession from "connect-mongodb-session";
const MongoStore = MongoSession(session);

const store = new MongoStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

app.use(
  session({
    store,
    resave: true,
    saveUninitialized: true,
    secret: SECRET,
    cookie: {
      maxAge: 300 * 10000,
      sameSite: NODE_ENV == "development" ? "lax" : "strict",
    },
    rolling: true,
  })
);

// Midllewares de Express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));


// Passport
import passport from "./utils/passport.util.js";
app.use(passport.initialize());
app.use(passport.session());

// Routers
import apiRouter from "./routers/apis/api.router.js";
import viewsRouter from "./routers/views/views.router.js";
app.use("/api", apiRouter).use("/", viewsRouter);




import cors from "cors";
app.use(cors());

app.set(express.static("public"));

app.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("/products");
  } else {
    res.redirect("/login");
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (!error) {
      res.sendFile("logout.html", {
        root: "./public",
      });
    } else {
      res.send({ error });
    }
  });
});


/*const server = app.listen(PORT, () => {
  console.log(
    `Servidor express corriendo en el puerto http://localhost:${PORT}`
  );
});
server.on("error", (error) => console.log(`Error en servidor ${error}`));*/

export default app;