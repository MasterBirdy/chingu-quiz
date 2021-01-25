import React, { useContext } from "react";
import { QuizContext, Answer } from "../context/QuizContext";
import Card from "../components/Card";
import Button from "../components/Button";
import "./Page.scss";

export interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
    const { notLoading, gameStarted, startGame, questionCounter, questions, yourQuestions, yourAnswers, answerQuestion, nextQuestion } = useContext(QuizContext) || {};
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
                    </Card>
                ) : (
                    <Card>
                        <h2 className="card-header">Question {questionCounter! + 1}</h2>
                        <p className="card-line">{questions![yourQuestions![questionCounter!]].question}</p>
                        <div className="answers">
                            {(Object.keys(questions![yourQuestions![questionCounter!]].choices) as Array<keyof typeof Answer>).map((choice) => {
                                console.log(yourAnswers!.length > questionCounter!, questions![yourQuestions![questionCounter!]].answer === choice);
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
        </div>
    );
};

export default Home;
