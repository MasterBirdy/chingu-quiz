import * as React from "react";
import "./Button.scss";

export interface ButtonProps {
    clickHandler?: Function;
}

const Button: React.FC<ButtonProps> = ({ children, clickHandler }) => {
    return (
        <button className="button" onClick={(e) => (clickHandler ? clickHandler(e) : null)}>
            {children}
        </button>
    );
};

export default Button;
