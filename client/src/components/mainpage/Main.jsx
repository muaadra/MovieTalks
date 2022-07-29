
import "../../styles/main.css";
import FeaturedMovies from "../featuredMovies/FeaturedMovies";
import SearchBar from "../search/SearchBar";
import React, { useEffect, useState } from 'react';
import MovieListItem from "../other-or-common/MovieListItem";
import info from "../../images/info-circle-fill.svg"
import Message from "../other-or-common/Message";
import topRated from "./TopRatedMovies";
import movieLists from "../other-or-common/MovieLists.js"
import TopRated from "./TopRated";

/**
 * This component represents main content of the website (the middle section between the header
 *  and the footer)
 */
function Main(props) {
    const message = {
        title: "Hello",
        message: <div className="ref-list">
            <div>This is the final project submission for CSCI4177 - Group-1</div>
            <p>Please note that any signed in user is treated as admin and will have
                access to the admin page. This is done to avoid any confusion, so we decided
                to keep the "Admin" the feature accessible for any account, for testing purposes only.
            </p>
            <p>You could sign up for a new account or use the following credentials</p>
            <ul>
                <li><strong>Email:</strong> Admin@testing.com</li>
                <li><strong>Password:</strong>: Admin123</li>
            </ul>
            <p>
                Please refer to the report document and project README file for references
            </p>
            <p>
                Thank you, and we hope you like our project.
            </p>
        </div>
    }


    const [showMessage, setShowMessage] = useState(null);

    useEffect(() => {
        //show welcome message once
        if (props.welcomeMessage == false) {
            setShowMessage(message)
            props.setWelcomeMessage(true)
        }

        props.showNavSearchBar(false)
        return () => {
            props.showNavSearchBar(true)
        };
    }, []);

    return (
        <div id="main-content-parent">
            {showMessage ? <Message showMessage={showMessage} showForm={setShowMessage} /> : null}

            <div id="main-content">
                <img id="prototype-info" src={info} onClick={() => setShowMessage(message)} ></img>
                <div id="main-search">
                    <SearchBar />
                </div>

                <FeaturedMovies setFeatured={props.setFeatured} />
                <div className="search-demo-container">
                    <div className="title"><h2>Top 10 Rated Movies</h2></div>

                    <div className="scrollabl">
                        <TopRated />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Main;
