import React, { useContext, useState, useEffect } from "react";
import "../../styles/MovieComponent.css";

/**
 * component for filter form on search page
 */
function SearchFilters(props) {

    const genres = ["Action", "Comedy", "Family", "History", "Mystery", "Sci-Fi", "War", "Adventure",
        "Crime", "Fantasy", "Horror", "Sport", "Western", "Animation", "Documentary", "Music", "Talk-Show",
        "Biography", "Talk-Show", "Musical", "Romance", "Reality-TV", "Thriller", "Drama"]

    function applyFilter(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const formDataObj = {}
        // console.log(formData.values())
        for (const entry of formData) {
            formDataObj[entry[0]] = entry[1]
        }
        props.setFilterValues(formDataObj)
        props.showForm(false)

    }

    return (
        <div>
            <div className="overlay-shade" onClick={() => props.showForm(false)}></div>
            <div id="pop-container" >

                <div id="pop-form" >
                    {/* close button */}
                    <div className="close-window" onClick={() => props.showForm(false)}>close (x)</div>

                    <form id="thread-reply-text-form" onSubmit={(e) => applyFilter(e)}>
                        <div className="title">
                            <h2>Browse all movies using filters</h2>
                        </div>

                        <div>
                            <div>Genre (example: find movies that are listed as comedy *OR* action  )</div>
                            <div id="genre-cont" className="pop-window-container">
                                {
                                    genres.map((val, idx) =>
                                        <div key={idx}>
                                            <input name={val} type="checkbox" id={val} />
                                            <label htmlFor={val}>{val}</label>
                                        </div>
                                    )
                                }
                            </div>
                        </div>

                        <div>
                            <div>Year Released</div>
                            <div className="pop-window-container">
                                <div id="filter-year-released">
                                    <div>
                                        <label htmlFor="year-from" className="form-label">
                                            From
                                        </label>
                                        <input id="year-from" name="yearFrom" className="filter-small-input" type="number" placeholder="e.g., 2007"></input>
                                    </div>
                                    <div>
                                        <label htmlFor="year-to" className="form-label">
                                            To
                                        </label>
                                        <input id="year-to" name="yearTo" className="filter-small-input" type="number" placeholder="e.g., 2022"></input>
                                    </div>
                                </div>

                            </div>
                        </div>


                        <div>
                            <div>Movie Ratings</div>
                            <div className="pop-window-container">
                                <div id="filter-year-released">
                                    <div>
                                        <label htmlFor="rating-from" className="form-label">
                                            From
                                        </label>
                                        <input id="rating-from" name="ratingFrom" className="filter-small-input" type="number" placeholder="e.g., 8"></input>
                                    </div>
                                    <div>
                                        <label htmlFor="rating-to" className="form-label">
                                            To
                                        </label>
                                        <input id="rating-to" name="ratingTo" className="filter-small-input" type="number" placeholder="e.g., 9"></input>
                                    </div>
                                </div>

                            </div>
                        </div>




                        <button type="submit" className="button blue">
                            Apply Filters
                        </button>
                    </form>


                </div>
            </div>
        </div>
    );
}


export default SearchFilters;
