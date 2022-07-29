
import "../../styles/MovieComponent.css";
import "../../styles/lists.css";
import MoviePageThreadItem from "./MoviePageThreadItem";
import NoListItemsMessage from "../other-or-common/NoListItemsMessage";

/**
 * This component for listing threads in a movie
 */
function ThreadLists(props) {
    const movieThreads = props.threads
    let threadCount = 0


    function getListItem(item, idx) {
        if (item.threadType == props.threadType) {
            threadCount++
            return (
                <MoviePageThreadItem key={idx} item={item} idx={idx} movieId={props.movieId} admin={props.admin} />
            )
        }
        return null
    }

    return (


        <div id="threads-component" className={!props.demo ? "main-component-container" : null}>
            {movieThreads ? movieThreads.map((item, idx) => getListItem(item, idx)) : null}

            {threadCount > 0 ? null :
                <NoListItemsMessage header={`There are no ${props.threadType}s for this movie yet. `}
                    message={`You can start a new thread by clicking on the "Start A Thread" button`} />
            }
        </div>
    );
}

export default ThreadLists;
