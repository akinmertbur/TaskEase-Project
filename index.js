"use strict";
import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = 3000;

// Establish a connection to the database.
const db = new pg.Client({
  user: process.env.user,
  host: process.env.host,
  database: process.env.database,
  password: process.env.password,
  port: process.env.port,
});
// Connect to the database.
db.connect();

// Middleware for parsing URL-encoded bodies and extended options.
app.use(bodyParser.urlencoded({ extended: true }));
// Middleware to serve static files from the "public" directory.
app.use(express.static("public"));

// Initialize an empty array to store to-do list items.
let items = [];

// Set the default period name to "Today".
let period_name = "Today";

// Retrieve to-do list items associated with the current period from the database.
async function getItems() {
  try {
    const result = await db.query(
      "SELECT items.id, items.periods_id, items.title FROM items INNER JOIN periods ON items.periods_id = periods.id WHERE periods.period_name = ($1) ORDER BY items.id ASC",
      [period_name]
    );
    return result.rows;
  } catch (error) {
    console.error("Error fetching items from database:", error);
    // Optionally, handle the error by retrying the operation or returning a default value.
    return [];
  }
}

// Retrieve all periods from the database.
async function getPeriods() {
  try {
    const result = await db.query("SELECT * FROM periods");
    return result.rows;
  } catch (error) {
    console.error("Error fetching periods from database:", error);
    // Optionally, handle the error by retrying the operation or returning a default value.
    return [];
  }
}

// Retrieve the ID of the current period from the database.
async function getPeriodId() {
  try {
    const result = await db.query(
      "SELECT id FROM periods WHERE period_name = ($1)",
      [period_name]
    );
    return result.rows[0].id;
  } catch (error) {
    console.error("Error fetching period id from database:", error);
    // Optionally, handle the error by retrying the operation or notifying the user.
    return null;
  }
}

// Insert the new item into the database, associating it with the current period.
async function insertNewItem(title, periodId) {
  try {
    const result = await db.query(
      "INSERT INTO items (title, periods_id) VALUES ($1, $2) RETURNING *",
      [title, periodId]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error adding item to database:", error);
    // Optionally, handle the error by retrying the operation or notifying the user.
    return null;
  }
}

// Update the title of the item in the database based on its ID.
async function updateItem(item_id, item_title) {
  try {
    const result = await db.query(
      "UPDATE items SET title = ($1) WHERE id = ($2) RETURNING *;",
      [item_title, item_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error updating item in database:", error);
    // Optionally, handle the error by retrying the operation or notifying the user.
    return null;
  }
}

// Delete the item from the database based on its ID.
async function deleteItem(item_id) {
  try {
    const result = await db.query(
      "DELETE FROM items WHERE id = $1 RETURNING *;",
      [item_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error deleting item from database:", error);
    // Optionally, handle the error by retrying the operation or notifying the user
    return null;
  }
}

// Route for the homepage.
app.get("/", async (req, res) => {
  // Retrieve to-do list items associated with the current period from the database.
  items = await getItems();
  // Retrieve all periods from the database.
  const periods = await getPeriods();

  // Render the homepage with the fetched data.
  res.render("index.ejs", {
    listTitle: period_name,
    listItems: items,
    listPeriods: periods,
  });
});

// Route to handle switching periods.
app.post("/switch", async (req, res) => {
  // Update the current period name based on the submitted form data.
  period_name = req.body.switchPeriod;

  // Redirect to the homepage after switching periods.
  res.redirect("/");
});

// Route to handle adding new items to the to-do list.
app.post("/add", async (req, res) => {
  // Extract the new item title from the submitted form data.
  const title = req.body.newItem;

  // Retrieve the ID of the current period.
  const periodId = await getPeriodId();
  // Insert the new item into the database, associating it with the current period.
  const newItem = await insertNewItem(title, periodId);

  // Redirect to the homepage after adding the new item.
  res.redirect("/");
});

// Route to handle editing existing items in the to-do list.
app.post("/edit", async (req, res) => {
  // Extract the ID and updated title of the item from the submitted form data.
  const updatedItemId = req.body.updatedItemId;
  const updatedItemTitle = req.body.updatedItemTitle;

  // Update the title of the item based on its ID.
  const updatedItem = await updateItem(updatedItemId, updatedItemTitle);

  // Redirect to the homepage after editing the item.
  res.redirect("/");
});

// Route to handle deleting items from the to-do list.
app.post("/delete", async (req, res) => {
  // Extract the ID of the item to be deleted from the submitted form data.
  const deletedItemId = req.body.deleteItemId;

  // Delete the item based on its ID.
  const deleted_item = await deleteItem(deletedItemId);

  // Redirect to the homepage after deleting the item.
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
