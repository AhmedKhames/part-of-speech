import "./App.css";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";


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

  library.add(faCheck, faTimes);

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
  const progressPercentage = (currentWord / questions.length) * 100;

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div className="spinner"></div>;
  } else {
    return (
      <div className="App">
        {finished ? (
          <div className="result_box">        
            <div className="complete_text">You've completed the Quiz!</div>
            <div className="score_text">
              <span>Your rank is <p>{rank}</p> </span>
            </div>
            <div className="buttons">
              <button className="restart" onClick={() => tryAgain()}>
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <div className="quiz_box activeQuiz">
            <header>
              <div className="title">Point of Speech</div>
              <div class="timer">
                <div class="time_left_txt">Correct answers</div>
                <div class="timer_sec">
                  {score}
                </div>
              </div>
              <div
                className="time_line"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </header>
            <section>
              <div className="que_text">
                <span>
                  {currentWord + 1}. The word {questions[currentWord].word} is
                </span>
              </div>
              <div className="option_list">
                {pos.map((answer, index) => {
                  return (
                    <div
                      key={index}
                      value={answer}
                      onClick={(e) =>
                        haveAnswered ? e.preventDefault : selectedAnswer(e)
                      }
                      className={`option ${
                        haveAnswered
                          ? index === selectedIdx
                            ? isCorrect
                              ? `correct disabled`
                              : `incorrect disabled`
                            : `disabled`
                          : ``
                      }`}
                    >
                      {haveAnswered ? (
                        index === selectedIdx ? (
                          isCorrect ? (
                            <div>
                              <FontAwesomeIcon icon="fa-solid fa-check" />
                              {" " + answer}
                            </div>
                          ) : (
                            <div>
                              <FontAwesomeIcon icon="fa-solid fa-times" />
                              {" " + answer}
                            </div>
                          )
                        ) : (
                          answer
                        )
                      ) : (
                        answer
                      )}
                      
                    </div>
                  );
                })}
              </div>
            </section>
            <footer>
              <div className="total_que">
                <span>
                  <p> {currentWord + 1} </p> of <p> {questions.length}</p>{" "}
                  Questions
                </span>
              </div>

             
              <button onClick={() => next()} className={currentWord  === questions.length -1?`submit`:''}>
              {currentWord + 1 < questions.length?`Next Word`:'Submit'}
              </button>
            </footer>

            {/* {haveAnswered ? (
              isCorrect ? (
                <div>correct</div>
              ) : (
                <div>Wrong</div>
              )
            ) : (
              <div></div>
            )} */}
            {/* 
            <button onClick={() => next()}>Next word</button>
            <br />
            <ProgressBar
              currentQuestionIndex={currentWord}
              totalQuestionsCount={questions.length}
            ></ProgressBar> */}
          </div>
        )}
      </div>
    );
  }
}

export default App;
