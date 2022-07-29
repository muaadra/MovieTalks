import "../../styles/lists.css"

/**
 * This component to show a message that a list is empty
 */

function NoListItemsMessage(props) {

    return (
        <div>
            <div className="list-item">
                <h2>{props.header}</h2>
                <p> &#x1F6C8; &nbsp;
                    {props.message}
                </p>
            </div>

        </div>
    )

}

export default NoListItemsMessage