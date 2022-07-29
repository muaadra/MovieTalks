import "../../styles/profile.css"
import "../../styles/index.css"
import { useState } from "react"
import ProfileEdit from "./ProfileStatsAndEdit";
import SettingsWindow from "./SettingsWindow";
import { useNavigate } from "react-router-dom";
import { signOut } from "../authentication/authHelperAndCommonFunctions.js"


/**
 * This is the profile page component. It will have all user's setting and stats.
 */


function Profile(props) {

    const [settingsWindow, showSettingsWindow] = useState(null);
    const navigate = useNavigate();


    return (
        <div id="profile-content-parent">
            {settingsWindow ? <SettingsWindow setUser={props.setUser} showForm={showSettingsWindow} /> : null}

            <div id="profile-content" >

                {/* profile nav (buttons on top) */}
                {props.user ? // only show if user is signed in

                    <div id="profile-nav">

                        <h1 className="userprofile-title">Profile Page</h1>

                        <div id="profile-page-right-buttons">
                            <div className="button yellow" onClick={() => navigate("/submitMovie")}>Submit a Movie</div>

                            <div className="button yellow" onClick={() => showSettingsWindow(true)}>Settings</div>

                            {/* the sign out button */}
                            <div className="button warning" onClick={() => signOut(props.setUser)}>Sign out</div>

                            <div className="button dark-blue" onClick={() => navigate("/profile/admin")}>Admin</div>

                        </div>

                    </div>

                    : null}

                {props.user ? <ProfileEdit user={props.user} setUser={props.setUser} /> : <h1 className="warning">User is Not Signed In</h1>}

            </div>

        </div>

    )
}

export default Profile