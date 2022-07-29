/**
 * This file holds the valiadtion functions used by authController.js
 * The functions validate user username, email, and password
 * 
 * @author Muaad Alrawhani, B00538563
 */


/**
 * validates user's password
 * requirements: 
 * min 8 characters
 * least: 1 upper-case, 1 lower-case letters, and 1 number
 */
export function isPasswordValid(password) {
    if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9!@#$%^&*();{}+*"\-'\/,.<>=?\[\]|_`~]{8,}$/)) {
        return ({
            success: false,
            message: "Error: Password doesn’t meet min requirements: \n- min 8 characters" +
                " \n- at least 1 upper-case, 1 lower-case letters, and 1 number"
        })
    }
    return ({ success: true, message: "password - ok" })
}

/**
 * validate user's email
 */
export function isEmailValid(email) {
    //check for simple email pattern, based on online search, it is very complicated to find a correct regex
    //for emails. so the purpose of the regex is only to check for common typos in an email address
    //as suggested by a comment by – Bob Barker in the follwing URL
    //regex refrence: https://stackoverflow.com/questions/742451/what-is-a-good-regular-expression-for-catching-typos-in-an-email-address
    //the regex was based on answer by the user Blackbam from above url
    if (email.length < 8 ||
        !email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
        return ({ success: false, message: "invalid email pattern" })
    }
    return ({ success: true, message: "email - ok" })
}

/**
 * validate username
 * username must be at least 3 characters and containts only letters and/or numbers
 */
export function isUsernameValid(username) {

    if (username.match(/^[A-Za-z0-9]{3,}$/)) {
        return ({ success: true, message: "username - ok" })
    }
    return ({ success: false, message: "username must be at least 3 characters and containts only letters and/or numbers" })
}

/**
 * validates sign up inputs
 */
export function validateSignUp(email, username, password) {
    //check if all fields exist
    if (!email || !username || !password) {
        return ({ success: false, message: "All field are required" })
    }

    //validate username
    let usernameValidation = isUsernameValid(username)
    if (!usernameValidation.success) {
        return ({ success: false, message: usernameValidation.message })
    }

    //validate email
    let emailValidation = isEmailValid(email)
    if (!emailValidation.success) {
        return ({ success: false, message: emailValidation.message })
    }

    //check for password pattern
    //refrence :https://stackoverflow.com/questions/19605150/regex-for-password-must-contain-at-least-eight-characters-at-least-one-number-a
    //anser by Wiktor Stribiżew
    let passwordValidation = isPasswordValid(password)
    if (!passwordValidation.success) {
        return ({ success: false, message: passwordValidation.message })
    }

    return { success: true, message: "OK" }
}