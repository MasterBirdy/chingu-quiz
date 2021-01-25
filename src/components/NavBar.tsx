import * as React from "react";
import { NavLink } from "react-router-dom";
import "./NavBar.scss";

export interface NavBarProps {}

const NavBar: React.FC<NavBarProps> = () => {
    return (
        <div className="navbar">
            <NavLink to="/" exact activeClassName="is-active" className="link">
                Home
            </NavLink>
            <NavLink to="/settings" exact activeClassName="is-active" className="link">
                Settings
            </NavLink>
        </div>
    );
};

export default NavBar;
