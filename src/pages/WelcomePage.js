import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import '../utils/WelcomePage.css';

function WelcomePage() {
    useEffect(() => {
        document.title = 'NestNet';
    }, []);

    const [descriptionIndex, setDescriptionIndex] = useState(0);
    const [fade, setFade] = useState(true);

    const descriptions = [
        "Find your perfect home with the power of ML at the best price.",
        "Harness the power of data-driven decision-making in your property dealings.",
        "Experience a new era of digital real estate with intelligent price estimations.",
        "Join us and navigate your property journey with ease and confidence."
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setFade(false); 
            setTimeout(() => {
                setDescriptionIndex((prevIndex) => (prevIndex + 1) % descriptions.length); 
                setFade(true); 
            }, 500); 
        }, 10000); 
        return () => clearInterval(timer); 
    }, []);

    return (
        <div className="landing-page">
            <div className="overlay">
                <h1 className="title">
                    <span>N</span>
                    <span>e</span>
                    <span>s</span>
                    <span>t</span>
                    <span>N</span>
                    <span>e</span>
                    <span>t</span>
                </h1>
                <p className={`description ${fade ? "fade-in" : "fade-out"}`}>
                    {descriptions[descriptionIndex]}
                </p>
                <div className="buttons">
                    <Link to="/register" className="btn register-btn">Register</Link>
                    <Link to="/login" className="btn login-btn">Login</Link>
                </div>
            </div>
        </div>
    );
}

export default WelcomePage;
