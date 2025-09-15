import React from "react";
import Header from "@/Components/Header";
import "../../css/app.css";
// import Footer from "@/Components/Footer";

const Landing = () => {
    return (
        <>
        <Header />
            <div class="slogan">
                <h1 class="sloganTop">Experience Community Commerce at its Finest</h1>
                <h3 class="sloganBottom">Your gateway to local treasures in Barangay Gen T. De Leon</h3>
            </div>

            <div className="authButtons">
                <a href="/register" className="registerBtn">Register</a>
                <a href="/login" className="loginBtn">Login</a>
            </div>

         {/* <Footer /> */}
        </>
    );
};

export default Landing;
