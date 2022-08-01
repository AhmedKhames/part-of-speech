import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";

function Quiz(props) {
  const progressPercentage = (props.currentWord / props.questions.length) * 100;
  library.add(faCheck, faTimes);
  return (
    <div className="quiz_box activeQuiz">
      <header>
        <div className="title">Part of Speech</div>
        <div className="progress">
          <div className="questions_left_txt">Correct answers</div>
          <div className="progress_left">{props.score}</div>
        </div>
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
            <p> {props.currentWord + 1} </p> of <p> {props.questions.length}</p>{" "}
            Questions
          </span>
        </div>

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
