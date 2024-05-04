"use strict";
import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = 3000;

// Database connection.
const db = new pg.Client({
  user: process.env.user,
  host: process.env.host,
  database: process.env.database,
  password: process.env.password,
  port: process.env.port,
});
db.connect();

// Middlewares.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// To-do list items are kept in items array.
let items = [];

// Period name is Today as default.
let period_name = "Today";

// Homepage.
app.get("/", async (req, res) => {
  const result = await db.query(
    "SELECT items.id, items.periods_id, items.title FROM items INNER JOIN periods ON items.periods_id = periods.id WHERE periods.period_name = ($1) ORDER BY items.id ASC",
    [period_name]
  );
  items = result.rows;
  res.render("index.ejs", {
    listTitle: period_name,
    listItems: items,
  });
});

app.post("/edit", async (req, res) => {
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
