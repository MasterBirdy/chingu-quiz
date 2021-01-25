import * as React from "react";
import "./Card.scss";

export interface CardProps {}

const Card: React.FC<CardProps> = ({ children }) => {
    return <div className="card">{children}</div>;
};

export default Card;
