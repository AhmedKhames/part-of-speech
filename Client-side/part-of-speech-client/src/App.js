import "./App.css";
import { useEffect, useState } from "react";

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

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/words/")
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setQuestions(result);
        },

        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, []);

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
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
      window.location.reload(false);
    }
    function selectedAnswer(e) {
      setHaveAnswered(true);
      if (
        e.currentTarget.getAttribute("value") === questions[currentWord].pos
      ) {
        setResultFlag(true);
        setScore(score + 1);
      } else {
        setResultFlag(false);
      }
      setViewResult(true);
    }

    return (
      <div className="App">
        <h1>Point of Speech</h1>
        <h2>Categorize the words according to their part of speech</h2>
        {finished ? (
          <div>
            <h1>The student rank is {score}</h1>
            <button onClick={() => tryAgain()}>Try again</button>
          </div>
        ) : (
          <div>
            {/* ${resultFlag ? `correct` : `incorrect`} */}
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

            <div>
              <label>
                You solve {currentWord + 1} question out of {questions.length}
              </label>
              <br />

              <meter id="disk_d" value={currentWord / questions.length}></meter>
            </div>
          </div>
        )}
      </div>
    );
    // return (
    //   <ul>
    //     {questions.map((item) => (
    //       <li key={item.id}>{item.word}</li>
    //     ))}
    //   </ul>
    // );
  }

  // let pos = ["adverb", "verb", "adjective", "noun"];

  // function next() {
  //   setCurrentWord(currentWord + 1);
  //   if (currentWord + 1 >= questions.length) {
  //     setFinished(true);
  //   }
  //   setViewResult(false);
  //   setHaveAnswered(false);
  // }

  // function tryAgain() {
  //   setFinished(false);
  //   setCurrentWord(0);
  // }
  // function selectedAnswer(e) {
  //   setHaveAnswered(true);
  //   if (e.currentTarget.getAttribute("value") === questions[currentWord].pos) {
  //     setResultFlag(true);
  //   } else {
  //     setResultFlag(false);
  //   }
  //   setViewResult(true);
  // }

  // return (
  //   <div className="App">
  //     <h1>Point of Speech</h1>
  //     <h2>Categorize the words according to their part of speech</h2>
  //     {finished ? (
  //       <div>
  //         <h1>The student rank is 56.67</h1>
  //         <button onClick={() => tryAgain()}>Try again</button>
  //       </div>
  //     ) : (
  //       <div>
  //         {/* ${resultFlag ? `correct` : `incorrect`} */}
  //         <div>The word {questions[currentWord].word} is </div>
  //         <div className="answers">
  //           {pos.map((btn, index) => {
  //             return (
  //               <div
  //                 key={index}
  //                 value={btn}
  //                 onClick={(e) =>
  //                   haveAnswered ? e.preventDefault : selectedAnswer(e)
  //                 }
  //                 className={`answer ${
  //                   haveAnswered
  //                     ? resultFlag
  //                       ? `correct`
  //                       : `incorrect`
  //                     : `answer`
  //                 }`}
  //               >
  //                 {btn}
  //               </div>
  //             );
  //           })}
  //         </div>

  //         {viewResult ? (
  //           resultFlag ? (
  //             <div>correct</div>
  //           ) : (
  //             <div>Wrong</div>
  //           )
  //         ) : (
  //           <div></div>
  //         )}

  //         <button onClick={() => next()}>Next word</button>
  //         <br />

  //         <div>
  //           <label>
  //             You solve {currentWord + 1} question out of {questions.length}
  //           </label>
  //           <br />

  //           <meter id="disk_d" value={currentWord / questions.length}></meter>
  //         </div>
  //       </div>
  //     )}
  //   </div>
  // );
}

export default App;
