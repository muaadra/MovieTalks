
import "../../styles/MovieComponent.css";
import "../../styles/lists.css";
import starFilled from "../../images/star-fill.svg"
import deleteB from "../../images/delete.svg"
import React, { useState, useContext, useEffect } from 'react';
import MovieListItem from "../other-or-common/MovieListItem";

import { UserContext } from "../authentication/UserContext";
import NoListItemsMessage from "../other-or-common/NoListItemsMessage";


/**
 * This component for displaying the user's watch list, and calling the functions to add and remove from it
@author Muaad Alrawhani, B00538563 (original prototype version) and Corey Horsburgh, B00776091 (modified for final version)
 */
function WatchList(props) {
    const { user, setUser } = useContext(UserContext)
    const [watchlist, setWatchlist] = useState([]);

    useEffect(() => {
        fetchWatchListItems()
    }, []);


    //This function gets the user's watch list to it can be displayed by making a request to the backend
    function fetchWatchListItems() {
        const requestOptions = {
            method: 'GET',
            headers: { "Content-Type": "application/json" }
        };
        fetch("/getWatchList/", requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.success) { //If response was sucessful
                    setWatchlist(data.body); //Set the wacth list data
                }
                else { //Error
                    console.log(data)
                }
            })
    }

    //This function deletes an entry from the user's watch list by making a request to the backend
    function deleteFromList(movieId) {
        if (window.confirm(`Delete from watchlist?`)) { //Confirmation
            const requestOptions = {
                method: 'DELETE',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ movieId }) //Movie to be deleted from list
            };

            fetch("/deleteFromWatchList/" + movieId, requestOptions)
                .then(response => response.json())
                .then(data => {
                    if (data.success) { //If response was sucessful
                        setWatchlist(data.body); //Set the wacth list data
                    }
                    else { //Error
                        console.log(data)
                    }
                });
        }
    }

    return ( //What is displayed on screen to the user
        <div className="main-component-container">
            <div className="title">Watchlist</div>
            {
                watchlist.map((item, idx) =>
                    <div className="movie-listing-container" key={idx}>
                        <MovieListItem index={idx} movieId={item} />
                        <div className="delete-button-cont">
                            <img src={deleteB} className="delete-button" onClick={() => deleteFromList(item)}></img>
                        </div>
                    </div>

                )
            }

            {watchlist.length == 0 ? //Empty watch list and user not signed in
                <NoListItemsMessage header={`No items on the watch list`}
                    message={`You can add movies to your watch list from any movie page.`} />
                : null}
            {!user ? <h2>You must be signed in to use the watchlist</h2> : null}

        </div>
    );
}

//This function adds a movie to the user's watch list by making a request to the backend
export function addToWatchList(movieId, user) {
    if (!user) {
        alert("you must be signed in to add to watchlist")
        return
    }

    const requestOptions = {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId }) //Movie to be added to the list
    };

    fetch("/addToWatchList/", requestOptions)
        .then(response => response.json())
        .then(data => {
            if (data.success) { //Movie added
                alert("Movie was added to the Watch List")
            } else if (data.onList) { //Movie already on list
                alert("Movie already on Watch List")
            } else { //Error
                console.log(data)
            }
        });
}

export default WatchList;
