import "./App.css";
import { useEffect, useState } from "react";

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
  const [isCorrect, setIsCorrect] = useState(false);
  const [haveAnswered, setHaveAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [rank, setRank] = useState(0);

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [questions, setQuestions] = useState([]);

  const [again, setAgain] = useState(false);

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
  }, [finished ? true : null]);

  useEffect(() => {
    fetch("http://localhost:8080/words/")
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
    return <div>Loading...</div>;
  } else {
    return (
      <div className="App">

        <div className="">
          <h1>Point of Speech</h1>
          <p>Categorize the words according to their part of speech</p>
        </div>

        {finished ? (

          <div className="card">
             <div className="container">
            <h1>The student rank is {rank}</h1>
            <button onClick={() => tryAgain()}>Try again</button>
          </div>
          </div>

        ) : (
          <div>

            <div className="card">
              <div className="container">
                <h3>The word {questions[currentWord].word} is </h3>

                <div className="answers">
                  {pos.map((answer, index) => {
                    return (
                      <div
                        key={index}
                        value={answer}
                        onClick={(e) =>
                          haveAnswered ? e.preventDefault : selectedAnswer(e)
                        }
                        className={`answer ${
                          haveAnswered
                            ? index === selectedIdx
                              ? isCorrect
                                ? `correct noHover`
                                : `incorrect noHover`
                              : `answer noHover`
                            : `answer`
                        }`}
                      >
                        {answer}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
                  
            {/* {haveAnswered ? (
              isCorrect ? (
                <div>correct</div>
              ) : (
                <div>Wrong</div>
              )
            ) : (
              <div></div>
            )} */}
          
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
