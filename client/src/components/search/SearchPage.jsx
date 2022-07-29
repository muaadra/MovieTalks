import React, { useContext, useState, useEffect } from "react";
import "../../styles/MovieComponent.css";
import "../../styles/searchPage.css";
import SearchFilters from "./SearchFilters";
import MovieListItem from "../other-or-common/MovieListItem";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import NoListItemsMessage from "../other-or-common/NoListItemsMessage";

function SearchPage(props) {
    const [filtersWindow, showFiltersWindow] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);
    const [filterValues, setFilterValues] = useState(null);
    const { searchQuery } = useParams();
    const path = useLocation().pathname.split("/");
    const resultLimit = 10
    let skipResults = pageNumber * (resultLimit)
    let curentPage = Math.ceil(searchResults.length / resultLimit)
    const [searchDescription, setSearchDescription] = useState(searchQuery);
    const location = useLocation();

    useEffect(() => {
        //show filters
        if (path[1] == "searchAllByFilters") {
            showFiltersWindow(true)
        };
    }, []);


    //if search button is clicked, clear filter and reset page to 0
    useEffect(() => {
        setPageNumber(0)
        setFilterValues(null)

        window.scrollTo(0, 0)
    }, [location.state]);

    //perform title search
    useEffect(() => {
        if (filterValues) {
            return
        }

        skipResults = pageNumber * (resultLimit)
        curentPage = Math.ceil(searchResults.length / resultLimit)
        console.log(searchQuery)

        fetchResults()
        window.scrollTo(0, 0)
    }, [searchQuery, pageNumber, filterValues]);



    //browse based on filters
    useEffect(() => {
        skipResults = pageNumber * (resultLimit)
        curentPage = Math.ceil(searchResults.length / resultLimit)

        if (filterValues) { //send request to the filter API
            fetchFilterData()
        }

        window.scrollTo(0, 0)
    }, [pageNumber]);




    useEffect(() => {
        if (filterValues) {
            fetchFilterData()
        }
    }, [filterValues]);

    function fetchResults() {
        fetch(`/search/${pageNumber}/${resultLimit}/${searchQuery}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setFilterValues(null)
                    setSearchResults(data.body)
                    setSearchDescription(searchQuery)
                }
            });
    }

    //called from searchFilters.js (the filter window) by calling setFilterValues
    function fetchFilterData() {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(filterValues)
        };
        fetch(`/movieFilters/${pageNumber}/${resultLimit}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setSearchResults(data.body)
                    setSearchDescription("All movies using filters")
                    const searchBar = document.getElementById("search-bar")
                    if (searchBar) {
                        searchBar.value = null
                    }
                }
            });

    }

    return (
        <div>
            {filtersWindow ? <SearchFilters showForm={showFiltersWindow}
                setSearchResults={setSearchResults} setFilterValues={setFilterValues} /> : null}

            <div id="search-page-header">
                <div>
                    <h2>Searching for: </h2> {searchDescription}
                    <div className="padding-small">* Please note that there are only 270 movies listed on this website</div>
                </div>
                <div id="find-by-filter" className=" button yellow no-margin" onClick={() => showFiltersWindow(true)}>
                    Browse all movies using filters
                </div>
            </div>

            <div className="search-demo-container">
                <div className="title"><h2>Search Results</h2></div>
                {
                    searchResults.length == 0 ?
                        <NoListItemsMessage header={"No search results"}
                            message={`You can use the search bar or find movies using filters by clicking on the
                                    Browse all movies "using filters" button`} />
                        : null
                }
                {searchResults.map((item, idx) =>
                (idx >= skipResults &&
                    idx < resultLimit * (pageNumber + 1) ? <MovieListItem index={idx} key={idx} item={item} /> : null)
                )}
            </div>
            <div id="pageNav">
                {(pageNumber > 0 ?
                    <div className=" button shade"
                        onClick={() => setPageNumber(prev => prev - 1)}>
                        Previous Page
                    </div> : null)
                }

                {(pageNumber + 1 < curentPage ?
                    <div id="nextPage" className="button shade"
                        onClick={() => setPageNumber(prev => prev + 1)}>
                        Next Page
                    </div> : null)
                }

            </div>

            {searchResults.length == 0 ? null :
                <div id="pageNumber" >
                    <div >
                        Page {(pageNumber + 1) + " (out of " + curentPage + " pages)"}
                    </div>
                </div>
            }

        </div>

    )
}

export default SearchPage