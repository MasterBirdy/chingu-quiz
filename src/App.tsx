import React from "react";
import "./App.scss";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import NavBar from "./components/NavBar";
import { QuizProvider } from "./context/QuizContext";

function App() {
    return (
        <div className="container">
            <Router>
                <QuizProvider>
                    <NavBar />
                    <h1 className="header">Chingu Quiz</h1>
                    <Switch>
                        <Route path="/" exact component={Home} />
                        <Route path="/settings" exact component={Settings} />
                    </Switch>
                </QuizProvider>
            </Router>
        </div>
    );
}

export default App;
