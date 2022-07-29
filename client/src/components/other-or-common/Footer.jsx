import "../../styles/footer.css"
import Message from "./Message";
import { useState } from "react"

/**
 * This is the footer component 
 */

function Footer() {
    const [showMessage, setShowMessage] = useState(null);
    const refrencesMessage = {
        title: "Refrences",
        message: <div className="ref-list"><ul>
            <li>Images used in real movie pages are from IMDB.com</li>
            <li>Poster used fro Demo Movies:
                <ul>
                    <li> URL: https://unsplash.com/photos/wMkaMXTJjlQ</li>
                    <li> Date accessed: June 11, 2022</li>
                    <li> Author: Samuel Regan-Asante</li>
                </ul>
            </li>
            <li>Trailers are self-referenced. Click on the trailer title to get more details about the video source
            </li>
            <li>All icons are from bootstrap Icon library (note: bootstrap was not used, just the icons):
                <ul>
                    <li> URL: https://icons.getbootstrap.com/</li>
                    <li> Date accessed: June 10, 2022</li>
                    <li> Author: Bootstrap</li>
                </ul>
            </li>
        </ul>
            <p>
                Please refer to the Proposal document of Group-1 for more detailed refrences
            </p>
        </div>
    }

    return (
        <div id="footer">
            {showMessage ? <Message showMessage={showMessage} showForm={setShowMessage} /> : null}

            <div id="footer-refrences" className="link-style white"
                onClick={() => (setShowMessage(refrencesMessage))}>References</div>

            <div>
                &copy; MovieTalks {(new Date()).getFullYear()}
            </div>
        </div>
    )

}

export default Footer