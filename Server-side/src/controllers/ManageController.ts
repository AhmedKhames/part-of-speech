import fs from "fs";
import { NextFunction, Request, Response } from "express";
import path from "path";

// Fisher-Yates algorithm
function shuffle(array:[]) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}


// git random words then shuffle them
const getRandomElements = (arr: [], numOfElement: number): [] => {
  let result: [] = [];
  let idx: number = 0,
    delIndex: number = 0;


  // the word type  
  let pos: string[] = ["adverb", "verb", "adjective", "noun"];

  // to insure that the returned list contain 1 adverb ,1 verb, 1 adjective and 1 noun by : 
  // create array with one part of speech and select one randomly and repeat that to the four types  
  for (const currentWord of pos) {
    // filter by one word type
    let word = arr.filter((ad) => ad["pos"] === currentWord);
    // get index of a random word with that type
    idx = Math.floor(Math.random() * word.length);
    // push that word to result array
    result.push(word[idx]);
    // delete that word from the main array to prevent duplicates
    delIndex = arr.map((id) => id["id"]).indexOf(word[idx]["id"]);
    arr.splice(delIndex, 1);
  }

  // randomize the remaining words 
  for (let i = 0; i < numOfElement - 4; i++) {
    let idx: number = Math.floor(Math.random() * arr.length);
    result.push(arr[idx]);
    arr.splice(idx, 1);
  }
  shuffle(result)
  return result;
};

// read json file and retuen the data parsed from the file 
const readData = async (path: string, next: NextFunction): Promise<any> => {
  try {
    let data = await fs.promises.readFile(path, "utf-8");
    const jsonData = JSON.parse(data);
    return jsonData;
  } catch (error) {
    next(error);
  }
};


// callback controller for get /words route to return response to the user with the random words tho be categorized 
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
// callback controller for /rank route to post the score from the client and return the rank in the response
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

  //save the score to the json data file 
  await fs.promises.writeFile(p,data)
  res.json({ rank: rank });
  
};

export { getWords, calculateRank };
