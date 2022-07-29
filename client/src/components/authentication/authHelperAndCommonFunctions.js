/**
 * This contains authentication helper function that may be used by other scripts
 * @author Muaad Alrawhani, B00538563
 */

/**
 * signs the user out
 * @param {*} setUser a callback function to set the user status
 */
export function signOut(setUser) {
    //prepare and send API request
    const requestOptions = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
    };

    fetch("/auth/logout/", requestOptions)
        .then(response => response.json())
        .then(data => {
            //refresh page and navigate to main
            window.location.href = "/"
            console.log(data)
        });
    setUser(null)

}

/**
 * Gets the user profile image
 * @param {*} user the user info
 * @param {*} setUser a callback function to update the user info with the
 * profile image
 */
export function fetchProfileImage(user, setUser) {
    //send API request
    fetch("/assets/userImages/")
        .then(response => response.blob())
        .then(image => {
            if (image.size > 0) {
                //include profile image into the user state
                let updateUser = JSON.parse(JSON.stringify(user));
                updateUser.profileImage = URL.createObjectURL(image)
                setUser(updateUser)
            }

        });
}

/**
 * checks if user is signed in and sets the user status
 * to signed-in or not
 * @param {*} setUser a callback to set user status
 */
export function isSignedIn(setUser) {
    fetch("/auth/isAuth")
        .then(response => response.json())
        .then(data => {
            if (data.user && setUser) {
                //set user state
                setUser(data.user)
                //fetch image
                fetchProfileImage(data.user, setUser)
            }
        });
}