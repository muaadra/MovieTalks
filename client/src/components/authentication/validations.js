/**
 * This file holds the valiadtion functions for the signing in/up functionality 
 * in AuthForm.jsx
 * the functions validate user username, email, and password
 * 
 * @author Muaad Alrawhani, B00538563
 */

/**
 * validates username
 * username must be at least 3 characters and containts only letters and/or numbers
 */
export const usernameError = "username must be at least 3 characters and containts only letters and/or numbers"
export function isUsernameValid(username) {
    if (username.match(/^[A-Za-z0-9]{3,}$/)) {
        return true
    }
    return false
}

/**
 * validates email
 */
export const emailError = "invalid email pattern"
export function isEmailValid(email) {
    //check for simple email pattern, based on online search, it is very complicated to find a correct regex
    //for emails. so the purpose of the regex is only to check for common typos in an email address
    //as suggested by a comment by – Bob Barker in the follwing URL
    //regex refrence: https://stackoverflow.com/questions/742451/what-is-a-good-regular-expression-for-catching-typos-in-an-email-address
    //the regex was based on answer by the user Blackbam from above url
    if (email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
        return true
    }
    return false
}

/**
 * validates user's password
 * requirements: 
 * min 8 characters
 * least: 1 upper-case, 1 lower-case letters, and 1 number
 */
export const passwordError = "Error: Password doesn’t meet min requirements: \n- min 8 characters \n- at least 1 upper-case, and 1 lower-case letters, and 1 number"
export function isPasswordValid(password) {
    if (password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9!@#$%^&*();{}+*"\-'\/,.<>=?\[\]|_`~]{8,}$/)) {
        return true
    }
    return false
}


/**
* this function validates sign up form fields
*/
export function isSignUpInputsValid(userName, email, password, confirmPassword, setSignError) {
    setSignError("") //reseting error field to provide better feedback for the user

    //check if all fields exist
    if (!email || !password || !userName) {
        setSignError("All field are required")
        return false
    }

    //check if user name is valid
    if (userName && !isUsernameValid(userName)) {
        setSignError(usernameError)
        return false
    }

    //check if email is valid
    if (email && !isEmailValid(email)) {
        setSignError(emailError)
        return false
    }

    //check if password is valid
    if (password && !isPasswordValid(password)) {
        setSignError(passwordError)
        return false
    }

    //check if confirm-password and password match
    if (!isPasswordMatch(password, confirmPassword, setSignError)) {
        return false
    }
    return true
}


/**
* this function validates sign in fields
*/
export function validateSignInInputs(email, password, setSignError) {
    setSignError("") //reseting error field to provide better feedback for the user

    if (!email || !password) {
        setSignError("All field are required")
        return false
    }

    return true
}

/**
 * to check if two passwords match each other
 */
export function isPasswordMatch(password, confirmPassword, setSignError) {
    //check if confirm-password and password match
    if (password !== confirmPassword) {
        setSignError("Password does not match the confirmed password")
        return false
    }
    return true
}
