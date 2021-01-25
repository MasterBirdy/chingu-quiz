import React, { useContext } from "react";
import { QuizContext, Answer } from "../context/QuizContext";
import Card from "../components/Card";
import Button from "../components/Button";
import "./Page.scss";

export interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
    const { notLoading, gameStarted, startGame, resetGame, errorMessage, questionCounter, questions, yourQuestions, yourAnswers, answerQuestion, nextQuestion, answersCorrect } =
        useContext(QuizContext) || {};
    if (!notLoading) {
        return (
            <div className="page center">
                <p>Loading...</p>
            </div>
        );
    }
    return (
        <div className="page center">
            {gameStarted ? (
                questionCounter! >= yourQuestions!.length ? (
                    <Card>
                        <h2 className="card-header">Quiz Completed!</h2>
                        <p className="card-line">
                            You got {answersCorrect} out of {yourAnswers!.length} correct!{" "}
                            {answersCorrect! / yourAnswers!.length === 1 ? "Perfect!" : answersCorrect! / yourAnswers!.length >= 0.5 ? "Not bad!" : "Try again!"}
                        </p>
                        <Button clickHandler={resetGame}>End</Button>
                    </Card>
                ) : (
                    <Card>
                        <h2 className="card-header">Question {questionCounter! + 1}</h2>
                        <p className="card-line">{questions![yourQuestions![questionCounter!]].question}</p>
                        <div className="answers">
                            {(Object.keys(questions![yourQuestions![questionCounter!]].choices) as Array<keyof typeof Answer>).map((choice) => {
                                return (
                                    <div
                                        key={choice}
                                        className={[
                                            "answer",
                                            yourAnswers!.length === questionCounter ? "not-answered" : "answered",
                                            yourAnswers!.length > questionCounter!
                                                ? questions![yourQuestions![questionCounter!]].answer === choice
                                                    ? "right"
                                                    : yourAnswers![questionCounter!] === choice
                                                    ? "wrong"
                                                    : ""
                                                : "",
                                        ].join(" ")}
                                        onClick={(e) => answerQuestion!(choice)}
                                    >
                                        {questions![yourQuestions![questionCounter!]].choices[choice]}
                                    </div>
                                );
                            })}
                        </div>
                        {yourAnswers!.length > questionCounter! && (
                            <>
                                <p className="card-line">{yourAnswers![questionCounter!] === questions![yourQuestions![questionCounter!]].answer ? "Good job!" : "Wrong answer!"}</p>
                                <Button clickHandler={nextQuestion}>Next</Button>
                            </>
                        )}
                    </Card>
                )
            ) : (
                <Card>
                    <h2 className="card-header">Welcome!</h2>
                    <p className="card-line">To get started, press the button below.</p>
                    <Button clickHandler={startGame}>Start</Button>
                </Card>
            )}
            {errorMessage && <p className="error">{errorMessage}</p>}
        </div>
    );
};

export default Home;
