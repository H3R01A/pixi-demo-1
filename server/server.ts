import express from "express";
const app = express();
import { Request, Response } from "express";
import path from "path";
import cors from "cors";

let port: number | string | undefined = process.env.PORT;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

if (port === undefined) {
  port = 3000;
}

//console log to see path for - learning purposes
// console.log(path.join(__dirname,'../public'));
app.use(express.static(path.join(__dirname, '../dist')));


app.get("/", (req: Request, res: Response) => {
  return res.status(200).sendFile(path.join(__dirname, "../dist/index.html"));
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
