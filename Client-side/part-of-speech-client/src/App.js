import "./App.css";
import { useEffect, useState } from "react";
import styled from "styled-components";

const ProgressBar = ({ currentQuestionIndex, totalQuestionsCount }) => {
  const progressPercentage = (currentQuestionIndex / totalQuestionsCount) * 100;

  return (
    <div className="progressBar">
      <div className="text">
        {currentQuestionIndex} answered (
        {totalQuestionsCount - currentQuestionIndex} remaining)
      </div>
      <div className="inner" style={{ width: `${progressPercentage}%` }} />
    </div>
  );
};


function App() {
  const [currentWord, setCurrentWord] = useState(0);

  const [finished, setFinished] = useState(false);

  const [resultFlag, setResultFlag] = useState(false);

  const [viewResult, setViewResult] = useState(false);

  const [haveAnswered, setHaveAnswered] = useState(false);

  const [score, setScore] = useState(0);

  
  
  // let questions = [
  //   {
  //     id: 1,
  //     word: "slowly",
  //     pos: "adverb",
  //   },
  //   {
  //     id: 2,
  //     word: "ride",
  //     pos: "verb",
  //   },
  //   {
  //     id: 3,
  //     word: "bus",
  //     pos: "noun",
  //   },
  //   {
  //     id: 4,
  //     word: "commute",
  //     pos: "verb",
  //   },
  //   {
  //     id: 5,
  //     word: "emissions",
  //     pos: "noun",
  //   },
  //   {
  //     id: 6,
  //     word: "walk",
  //     pos: "verb",
  //   },
  //   {
  //     id: 7,
  //     word: "fast",
  //     pos: "adjective",
  //   },
  //   {
  //     id: 8,
  //     word: "car",
  //     pos: "noun",
  //   },
  //   {
  //     id: 9,
  //     word: "crowded",
  //     pos: "adjective",
  //   },
  //   {
  //     id: 10,
  //     word: "arrival",
  //     pos: "noun",
  //   },
  // ];


  const [rank, setRank] = useState(0);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [again,setAgain] = useState(false);

  useEffect(() => {
    if (finished) {
      let totalScore = (score / questions.length) * 100;

      fetch("http://localhost:8080/rank/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score: totalScore }),
      })
        .then((res) => res.json())
        .then((response) => {
          setRank(response.rank);
        });
    }
  }, [finished?true:null]);

  useEffect(() => {
    fetch("http://localhost:8080/words/")
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setQuestions(result);
          setAgain(false)
        },

        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, [again?true:null]);
  
  let pos = ["adverb", "verb", "adjective", "noun"];

  function next() {
    setCurrentWord(currentWord + 1);
    if (currentWord + 1 >= questions.length) {
      setFinished(true);
    }
    setViewResult(false);
    setHaveAnswered(false);
  }

  function tryAgain() {
    setFinished(false);
    setCurrentWord(0);
    setScore(0);
    setIsLoaded(false)
    setAgain(true);
  }

  function selectedAnswer(e) {
    setHaveAnswered(true);
    if (e.currentTarget.getAttribute("value") === questions[currentWord].pos) {
      setResultFlag(true);
      setScore(score + 1);
    } else {
      setResultFlag(false);
    }
    setViewResult(true);
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    
    return (
      <div className="App">
        {finished ? (
          <div>
            <h1>The student rank is {rank}</h1>
            <button onClick={() => tryAgain()}>Try again</button>
          </div>
        ) : (
          <div>
            <h1>Point of Speech</h1>
            <h2>Categorize the words according to their part of speech</h2>

            <div>The word {questions[currentWord].word} is </div>

            <div className="answers">
              {pos.map((btn, index) => {
                return (
                  <div
                    key={index}
                    value={btn}
                    onClick={(e) =>
                      haveAnswered ? e.preventDefault : selectedAnswer(e)
                    }
                    className={`answer ${
                      haveAnswered
                        ? resultFlag
                          ? `correct`
                          : `incorrect`
                        : `answer`
                    }`}
                  >
                    {btn}
                  </div>
                );
              })}
            </div>

            {viewResult ? (
              resultFlag ? (
                <div>correct</div>
              ) : (
                <div>Wrong</div>
              )
            ) : (
              <div></div>
            )}

            <button onClick={() => next()}>Next word</button>
            <br />
            <ProgressBar
              currentQuestionIndex={currentWord}
              totalQuestionsCount={questions.length}
            ></ProgressBar>          
          </div>
        )}
      </div>
    );
 
  }

  
}

export default App;
