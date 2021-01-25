import React, { useContext } from "react";
import "./Page.scss";
import Card from "../components/Card";
import { QuizContext } from "../context/QuizContext";
import "./Settings.scss";

export interface SettingsProps {}

const Settings: React.FC<SettingsProps> = () => {
    const { topics, checkTopic } = useContext(QuizContext) || {};
    return (
        <div className="page">
            <Card>
                <h2 className="card-header">Settings</h2>
                <h3 className="subheading">Quiz Topics</h3>
                {topics && checkTopic && (
                    <ul className="list">
                        {topics.map((topic) => (
                            <li key={topic.topic}>
                                <label className="label" htmlFor={topic.topic}>
                                    {topic.name}
                                    <input
                                        type="checkbox"
                                        name={topic.topic}
                                        id={topic.topic}
                                        checked={topic.checked}
                                        onChange={() => {
                                            checkTopic(topic.topic);
                                        }}
                                    />
                                </label>
                            </li>
                        ))}
                    </ul>
                )}
            </Card>
        </div>
    );
};

export default Settings;
