import "./App.css";
import { useEffect, useState } from "react";

import { Result } from "./Components/Result";
import { Quiz } from "./Components/Quiz";

function App() {
  // state for set the cuurent word
  const [currentWord, setCurrentWord] = useState(0);
  // state for checking if the activity finishied or not
  const [finished, setFinished] = useState(false);
  // state for checking if the answer is correct or wrong
  const [isCorrect, setIsCorrect] = useState(false);
  // state for checking if the questions is answered or not
  const [haveAnswered, setHaveAnswered] = useState(false);
  // state to calculate the score
  const [score, setScore] = useState(0);
  // state to know which answer is selected 
  const [selectedIdx, setSelectedIdx] = useState(null);
  // state to calculate the rank
  const [rank, setRank] = useState(0);

  // to check if there error on fetching data
  const [error, setError] = useState(null);
  // state to know if the data is fetched completely or still loading 
  const [isLoaded, setIsLoaded] = useState(false);
  // list to save the fetched data
  const [questions, setQuestions] = useState([]);
  // state to flag if try again is pressed to fetch new data 
  const [again, setAgain] = useState(false);

  // environment variable to save the backend host
  let server = process.env.REACT_APP_API_SERVER;

  // fetching words from the server
  useEffect(() => {
    fetch(`${server}/words/`)
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setQuestions(result);
          setAgain(false);
          setSelectedIdx(null);
        },

        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, [again ? true : null]/* to fetch if the try again is pressed */);


  // make a post request to the server withe the score in the body and retuen the rank in response
  useEffect(() => {
    if (finished) {
      let totalScore = (score / questions.length) * 100;
      
      fetch(`${server}/rank/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score: totalScore }),
      })
        .then((res) => res.json())
        .then((response) => {
          setRank(response.rank);
        });
    }
  }, [finished ? true : null]);


  // word types list
  let pos = ["adverb", "verb", "adjective", "noun"];

  // function to go to the next question
  function next() {
    setCurrentWord(currentWord + 1);
    if (currentWord + 1 >= questions.length) {
      setFinished(true);
    }
    // make haveAnswered false to activate the ui for the next question
    setHaveAnswered(false);
  }

  // after the final question the student can press try again to retry the activivty
  function tryAgain() {
    setFinished(false);
    setCurrentWord(0);
    setScore(0);
    setIsLoaded(false);
    setAgain(true);
  }

  // set the selected answer an check if it correct or wrong 
  function selectedAnswer(e) {
    setHaveAnswered(true);
    // set the selected answer index 
    setSelectedIdx(pos.indexOf(e.currentTarget.getAttribute("value")));
    // check if answer is correct or wrong 
    if (e.currentTarget.getAttribute("value") === questions[currentWord].pos) {
      setIsCorrect(true);
      setScore(score + 1);
    } else {
      setIsCorrect(false);
    }
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div className="spinner"></div>;
  } else {
    return (
      <div className="App">
        {finished ? (
          <Result rank={rank} tryAgain={tryAgain} />
        ) : (
          <Quiz
            currentWord={currentWord}
            questions={questions}
            score={score}
            haveAnswered={haveAnswered}
            selectedAnswer={selectedAnswer}
            selectedIdx={selectedIdx}
            isCorrect={isCorrect}
            next={next}
            pos={pos}
          />
        )}
      </div>
    );
  }
}

export default App;
