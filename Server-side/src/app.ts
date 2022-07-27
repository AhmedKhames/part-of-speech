import express, { Express, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import { getWords, calculateRank } from "./controllers/ManageController";
import bodyParser from "body-parser";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.get("/words", getWords);
app.post("/rank", calculateRank);

// error handling middleware
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({
    message: message,
  });
});

app.listen(port, () => {
    
  console.log(`Server is running at https://localhost:${port}`);
});
