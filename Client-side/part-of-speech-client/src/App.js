import "./App.css";
import { useEffect, useState } from "react";

import { Result } from "./Components/Result";
import { Quiz } from "./Components/Quiz";

function App() {
  const [currentWord, setCurrentWord] = useState(0);
  const [finished, setFinished] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [haveAnswered, setHaveAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [rank, setRank] = useState(0);

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [questions, setQuestions] = useState([]);

  const [again, setAgain] = useState(false);

  let server = process.env.REACT_APP_API_SERVER;

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
  }, [again ? true : null]);

  let pos = ["adverb", "verb", "adjective", "noun"];

  function next() {
    setCurrentWord(currentWord + 1);
    if (currentWord + 1 >= questions.length) {
      setFinished(true);
    }

    setHaveAnswered(false);
  }

  function tryAgain() {
    setFinished(false);
    setCurrentWord(0);
    setScore(0);
    setIsLoaded(false);
    setAgain(true);
  }

  function selectedAnswer(e) {
    setHaveAnswered(true);
    setSelectedIdx(pos.indexOf(e.currentTarget.getAttribute("value")));
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
