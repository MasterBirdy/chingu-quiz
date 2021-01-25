import React, { useState, useEffect, createContext } from "react";
import axios from "axios";

interface QuizProviderInterface {
    children: React.ReactNode;
}

export enum Topic {
    html = "html",
    css = "css",
    javascript = "javascript",
}

export enum Answer {
    "a",
    "b",
    "c",
    "d",
}

/**
 * Allows objects to have dynamic keys.
 */

export interface LooseObject {
    [key: string]: any;
}

export interface Question {
    question: string;
    id: number;
    topic: Topic;
    choices: {
        a: string;
        b: string;
        c?: string;
        d?: string;
    };
    answer: keyof typeof Answer;
}

export interface QuizContextInterface {
    notLoading: boolean;
    gameStarted: boolean;
    questions: Question[];
    topics: Selection[];
    questionCounter: number;
    yourQuestions: number[];
    answersCorrect: number;
    yourAnswers: Array<keyof typeof Answer>;
    errorMessage: string;
    questionsLength: number;
    checkTopic: (t: Topic) => void;
    startGame: () => void;
    answerQuestion: (a: keyof typeof Answer) => void;
    nextQuestion: () => void;
    resetGame: () => void;
    changeQuestionRange: (n: number) => void;
    QUESTION_MIN: number;
    QUESTION_MAX: number;
}

interface Selection {
    name: string;
    topic: Topic;
    checked: boolean;
}

/**
 * Statically creates possible selection options for quiz.
 */

const selections: Selection[] = [
    { name: "HTML", topic: Topic.html, checked: true },
    { name: "CSS", topic: Topic.css, checked: true },
    { name: "JavaScript", topic: Topic.javascript, checked: true },
];

const QUESTION_MIN = 3;
const QUESTION_START = 5;
const QUESTION_MAX = 10;

export const QuizContext = createContext<QuizContextInterface | null>(null);

const API_URL = "https://johnmeade-webdev.github.io/chingu_quiz_api/trial.json";

export const QuizProvider = ({ children }: QuizProviderInterface) => {
    const [notLoading, setNotLoading] = useState(false);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [topics, setTopics] = useState<Selection[]>(selections);
    const [gameStarted, setGameStarted] = useState(false);
    const [questionCounter, setQuestionCounter] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");
    const [yourQuestions, setYourQuestions] = useState<number[]>([]);
    const [yourAnswers, setYourAnswers] = useState<Array<keyof typeof Answer>>([]);
    const [questionsLength, setQuestionsLength] = useState(QUESTION_START);
    const [answersCorrect, setAnswersCorrect] = useState(0);

    /**
     * Loads initial question data from json file.
     */

    useEffect(() => {
        axios
            .get<Question[]>(API_URL)
            .then((res) => {
                setQuestions(res.data);
            })
            .catch((err) => setErrorMessage(err))
            .finally(() => {
                setNotLoading(true);
            });
    }, []);

    /**
     * Finds topic that matches checked event, and then checks/unchecks topic accordingly.
     */

    const checkTopic = (topic: Topic) => {
        setErrorMessage("");
        setTopics((prevTopics) => {
            const copy = [...prevTopics];
            for (let i = 0; i < copy.length; i++) {
                if (copy[i].topic === topic) {
                    copy[i] = { ...copy[i], checked: !copy[i].checked };
                    break;
                }
            }
            return copy;
        });
    };

    /**
     * Starts game and selects questions to be asked based on filter and question length.
     */

    const startGame = () => {
        const error = validate();
        if (!error) {
            setGameStarted(true);
            setYourQuestions(fillQuestions());
            setErrorMessage("");
        } else {
            setErrorMessage(error);
        }
    };

    /**
     * Filters questions based on topic, then randomly selects from a set until either question length has been filled
     * or all possible filtered questions have been used.
     */

    const fillQuestions = () => {
        const filteredQuestions = questions
            .map((question, index) => ({ question, index }))
            .filter((question) => {
                return topics.some((topic) => {
                    return topic.topic === question.question.topic && topic.checked;
                });
            });
        let dict: LooseObject = {};
        let currentQuestions: number[] = [];
        while (Object.keys(dict).length < questionsLength && Object.keys(dict).length < filteredQuestions.length) {
            let random = Math.floor(Math.random() * filteredQuestions.length);
            if (!(random in dict)) {
                dict[random] = true;
                currentQuestions.push(filteredQuestions[random].index);
            }
        }
        return currentQuestions;
    };

    /**
     * Adds question to answers if current question has no answer yet.
     * @param answer Selection of a, b, c, or d
     */

    const answerQuestion = (answer: keyof typeof Answer) => {
        if (yourAnswers.length === questionCounter) {
            if (answer === questions[yourQuestions[questionCounter]].answer) {
                setAnswersCorrect((prev) => ++prev);
            }
            setYourAnswers((prev) => [...prev, answer]);
        }
    };

    /**
     * Increases question counter by one to go to next question.
     */

    const nextQuestion = () => {
        setQuestionCounter((prev) => ++prev);
    };

    /**
     * Resets all variables used to keep track of game and questions.
     */

    const resetGame = () => {
        setGameStarted(false);
        setQuestionCounter(0);
        setYourQuestions([]);
        setYourAnswers([]);
        setAnswersCorrect(0);
    };

    /**
     *  Checks to make sure there are no validation errors.
     */
    const validate = () => {
        if (!topics.some((topic) => topic.checked)) {
            return "There must be at least one chosen topic!";
        }
        if (!(QUESTION_MIN <= questionsLength && questionsLength <= QUESTION_MAX)) {
            return `Number of questions must be above ${QUESTION_MIN} and below ${QUESTION_MAX}!`;
        }
        return null;
    };

    /**
     * Changes questions length.
     * @param n Number to set Questions Length to.
     */

    const changeQuestionRange = (n: number) => {
        setErrorMessage("");
        setQuestionsLength(n);
    };

    return (
        <QuizContext.Provider
            value={{
                notLoading,
                resetGame,
                answersCorrect,
                nextQuestion,
                errorMessage,
                yourQuestions,
                yourAnswers,
                answerQuestion,
                questionCounter,
                startGame,
                gameStarted,
                questions,
                topics,
                checkTopic,
                QUESTION_MAX,
                QUESTION_MIN,
                changeQuestionRange,
                questionsLength,
            }}
        >
            {children}
        </QuizContext.Provider>
    );
};
