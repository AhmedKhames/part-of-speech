function Result(props) {
  return (
    <div className="result_box">
      <div className="complete_text">You've completed the Quiz!</div>
      <div className="score_text">
        <span>
          Your rank is <p>{props.rank}</p>{" "}
        </span>
      </div>
      <div className="buttons">
        <button className="restart" onClick={props.tryAgain}>
          Try Again
        </button>
      </div>
    </div>
  );
}

export { Result };
