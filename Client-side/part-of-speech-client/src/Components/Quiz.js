import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";

// The activity panal which has the questions and answers

function Quiz(props) {
  // calculate the progress of answering auestions to show it in progress bar 
  const progressPercentage = (props.currentWord / props.questions.length) * 100;
  // add fontawesome correct and wrong sympols 
  library.add(faCheck, faTimes);

  return (
    <div className="quiz_box activeQuiz">
      <header>
        <div className="title">Part of Speech</div>
        <div className="progress">
          <div className="questions_left_txt">Correct answers</div>
          <div className="progress_left">{props.score}</div>
        </div>
        {/* show the propgress bar */}
        <div
          className="progress_bar"
          style={{ width: `${progressPercentage}%` }}
        ></div>

      </header>

      <section>
        <div className="que_text">
          <span>
            {props.currentWord + 1}. The word{" "}
            {props.questions[props.currentWord].word} is
          </span>
        </div>
        {/** Show answers' options the callback function for the onClick check if the question answerd to prevent user from click again */}
        {/** inside the className check if the question is answerd to mark the selected answer correct or wrong */}
        <div className="option_list">
          {props.pos.map((answer, index) => {
            return (
              <div
                key={index}
                value={answer}
                onClick={(e) =>
                  props.haveAnswered ? e.preventDefault : props.selectedAnswer(e)
                }
                
                className={`option ${
                  props.haveAnswered
                    ? index === props.selectedIdx
                      ? props.isCorrect
                        ? `correct disabled`
                        : `incorrect disabled`
                      : `disabled`
                    : ``
                }`}
              >
                {/** view the answers and add to the selected one ✓ to it if it is correct or X if it is wrong */}
                {props.haveAnswered ? (
                  index === props.selectedIdx ? (
                    props.isCorrect ? (
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
            {/** view the current question and total questions numbers */}
            <p> {props.currentWord + 1} </p> of <p> {props.questions.length}</p>{" "}
            Questions
          </span>
        </div>
          {/** Next button to move to the next question and submit at the final question */}
        <button
          onClick={props.next}
          className={
            props.currentWord === props.questions.length - 1 ? `submit` : ""
          }
        >
          {props.currentWord + 1 < props.questions.length
            ? `Next Word`
            : "Submit"}
        </button>
      </footer>
    </div>
  );
}

export { Quiz };
