import express from "express";
import { Request, Response } from "express";
import path from "path";
import cors from "cors";

const app = express();

const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());


app.use(express.static(path.join(__dirname, '../dist')));


app.get("/", (req: Request, res: Response) => {
  return res.status(200).sendFile(path.join(__dirname, "../dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
