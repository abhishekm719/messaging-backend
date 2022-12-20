import express from "express";
import bluebird from "bluebird";
import { createConnection } from "mysql";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const connectionUri = {
  host: "localhost",
  user: "root",
  password: "root",
  database: "cdac1",
};

/* http://localhost:3000/ */
app.get("/", (req, res) => res.send("Hello, NodeJS!"));

/* http://localhost:3001/list_all_products */
app.get("/list_all_products", async (req, res) => {
  let list = [];
  let connection = createConnection(connectionUri);
  bluebird.promisifyAll(connection);

  await connection.connectAsync();

  let sql = `SELECT * FROM product `;
  list = await connection.queryAsync(sql);

  await connection.endAsync();

  res.json(list);
});

/* http://localhost:3001/products */
app.post("/products", async (req, res) => {
  let connection = createConnection(connectionUri);
  bluebird.promisifyAll(connection);

  await connection.connectAsync();

  let prodName = req.body.prodName;
  let prodQuantity = req.body.prodQuantity;
  let prodPrice = req.body.prodPrice;

  // let sql = `INSERT INTO message (message, reply) VALUES ('${message}', ${reply})`;
  let sql = `INSERT INTO product (prodName, prodQuantity, prodPrice) VALUES (?, ?, ?)`;
  await connection.queryAsync(sql, [prodName, prodQuantity, prodPrice]);

  await connection.endAsync();

  let output = { msg: "Record Created Successfully" };
  res.json(output);
});

app.listen(3001);
