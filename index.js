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
  database: "cdac",
};

/* http://localhost:3000/ */
app.get("/", (req, res) => res.send("Hello, NodeJS!"));

/* http://localhost:3000/messages */
app.get("/messages", async (req, res) => {
  let list = [];
  let connection = createConnection(connectionUri);
  bluebird.promisifyAll(connection);

  await connection.connectAsync();

  let sql = `SELECT * FROM message `;
  list = await connection.queryAsync(sql);

  await connection.endAsync();

  res.json(list);
});

/* http://localhost:3000/message */
app.post("/message", async (req, res) => {
  let connection = createConnection(connectionUri);
  bluebird.promisifyAll(connection);

  await connection.connectAsync();

  let message = req.body.message;
  let reply = req.body.reply;
  // let sql = `INSERT INTO message (message, reply) VALUES ('${message}', ${reply})`;
  let sql = `INSERT INTO message (message, reply) VALUES (?, ?)`;
  await connection.queryAsync(sql, [message, reply]);

  await connection.endAsync();

  let output = { msg: "Record Created Successfully" };
  res.json(output);
});

app.listen(3000);
