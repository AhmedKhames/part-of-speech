import fs from "fs";
import { NextFunction, Request, Response } from "express";
import path from "path";

const getRandomElements = (arr: [], numOfElement: number): [] => {
  let result: [] = [];
  let idx: number = 0,
    delIndex: number = 0;

  let pos: string[] = ["adverb", "verb", "adjective", "noun"];

  
  for (const currentWord of pos) {
    let word = arr.filter((ad) => ad["pos"] === currentWord);
    idx = Math.floor(Math.random() * word.length);
    result.push(word[idx]);
    delIndex = arr.map((id) => id["id"]).indexOf(word[idx]["id"]);
    arr.splice(delIndex, 1);
  }

  for (let i = 0; i < numOfElement - 4; i++) {
    let idx: number = Math.floor(Math.random() * arr.length);
    result.push(arr[idx]);
    arr.splice(idx, 1);
  }

  return result;
};

const readData = async (path: string, next: NextFunction): Promise<any> => {
  try {
    let data = await fs.promises.readFile(path, "utf-8");
    const jsonData = JSON.parse(data);
    return jsonData;
  } catch (error) {
    next(error);
  }
};

const getWords = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  let p = path.join(__dirname, "..", "data/TestData.json");
  const jsonData = await readData(p, next);
  let wordList: [] = jsonData.wordList;
  if (wordList) {
    let result = getRandomElements(wordList, 10);
    res.json(result);
  }else{
    res.status(404).json('Not Found')
  }
 
};

const calculateRank = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  let score: number = req.body.score;
  let rank: number = 0;

  let p = path.join(__dirname, "..", "data/TestData.json");
  const jsonData = await readData(p, next);
  let scoresList: [] = jsonData.scoresList;
  rank = +(
    (scoresList.filter((s) => s < score).length / scoresList.length) *
    100
  ).toFixed(2);
  jsonData.scoresList.push(score)
  let data = JSON.stringify(jsonData)

  await fs.promises.writeFile(p,data)
  res.json({ rank: rank });
  
};

export { getWords, calculateRank };
