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
    yourAnswers: Array<keyof typeof Answer>;
    errorMessage: string;
    checkTopic: (t: Topic) => void;
    startGame: () => void;
    answerQuestion: (a: keyof typeof Answer) => void;
    nextQuestion: () => void;
}

interface Selection {
    name: string;
    topic: Topic;
    checked: boolean;
}

const selections: Selection[] = [
    { name: "HTML", topic: Topic.html, checked: true },
    { name: "CSS", topic: Topic.css, checked: true },
    { name: "JavaScript", topic: Topic.javascript, checked: true },
];

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
    const [questionsLength, setQuestionsLength] = useState(5);

    useEffect(() => {
        axios
            .get<Question[]>(API_URL)
            .then((res) => {
                setQuestions(res.data);
            })
            .catch((err) => console.log(err))
            .finally(() => {
                setNotLoading(true);
            });
    }, []);

    const checkTopic = (topic: Topic) => {
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

    const startGame = () => {
        setGameStarted(true);
        setYourQuestions(fillQuestions());
    };

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

    const answerQuestion = (answer: keyof typeof Answer) => {
        if (yourAnswers.length === questionCounter) {
            setYourAnswers((prev) => [...prev, answer]);
        }
    };

    const nextQuestion = () => {
        setQuestionCounter((prev) => prev + 1);
    };

    return (
        <QuizContext.Provider value={{ notLoading, nextQuestion, errorMessage, yourQuestions, yourAnswers, answerQuestion, questionCounter, startGame, gameStarted, questions, topics, checkTopic }}>
            {children}
        </QuizContext.Provider>
    );
};
