
import "../../styles/searchBar.css";
import "../../styles/colors.css";
import search from "../../images/search.svg"
import { useNavigate } from "react-router-dom";

/**
 * This component represents search bar
 */
function SearchBar(props) {
    const navigate = useNavigate();

    function handleSearch(e) {
        if (!e) {
            navigate("/searchAllByFilters")
            return
        }
        e.preventDefault();

        navigate(`/searchResults/${document.getElementById("search-bar").value}`,
            { state: (Math.random() + Math.random()) })
    }

    return (
        // sample content
        <div id={!props.mobile ? "search-bar-main-container" : "search-bar-main-container-mobile"}>
            {!props.inHeader ? <h1>Find a Movie</h1> : null}
            <form action="" onSubmit={(e) => handleSearch(e)}>
                <div id="search-bar-container" >
                    <input id="search-bar" defaultValue={props.searchQuery ? props.searchQuery : null}></input>
                    <div id="search-button" onClick={(e) => handleSearch(e)}>
                        <img type="submit" src={search} ></img>
                    </div>
                </div>
            </form>

            {!props.inHeader ?
                <div id="movies-using-filters" className="link-style" onClick={() => handleSearch()}>Browse Movies Using Filters</div>
                : null}

            {/* <div id="find-by-filter" className="link-style" onClick={() => navigate("/searchResults/filter")}>
                Find movies by filters
            </div> */}
        </div>
    );
}

export default SearchBar;
