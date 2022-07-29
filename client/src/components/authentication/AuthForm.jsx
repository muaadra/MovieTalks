import "../../styles/signIn.css";
import React, { useState, useEffect } from "react";
import * as validate from "./validations.js"
/**
 * This component represents sign-in/up form. the form shows when the user clicks on
 * the "sign in/up" button on the website header
 * 
 * The component facilitates:
 * Signing in, signing up, and resetting password
 * 
 * please note that Signing out and Deleting an account is done through the 
 * profile page, found in: src/profile/SettingsWindow.jsx
 * 
 * @author Muaad Alrawhani, B00538563
 */


function AuthForm(props) {

  //to give user errors feedback
  const [signError, setSignError] = useState("")

  //to toggle forms between siging in and up
  const [signInVisible, setSignInVisible] = useState(true)

  //to change the state of the form when user clicks of forgot password
  const [forgotPassword, setForgotPassword] = useState(0)
  const [resetCode, setResetCode] = useState(0)

  //to show the label of the field when in focus
  const [fieldLabel, setFieldLabel] = useState(null)

  /**
   * check if the path of the page is for reseting the password 
   * (i.e., after user clicked on reset link in an email)
   */
  useEffect(() => {
    if (window.location.pathname == "/auth/resetByEmail/") {
      const query = window.location.search
      const params = new URLSearchParams(query);
      setResetCode(params.get('code'))
      setForgotPassword(2)
    }
  }, []);

  /**
   * toggle between sign-in or sign-up view
   */
  function toggle(e) {
    e.preventDefault();
    setSignInVisible(e.target.name == "sign-in" ? true : false)
    setSignError("")
    setForgotPassword(0)
  }

  /**
   * when submit button is clicked
   */
  function handleSignInUp(event) {
    if (signInVisible) {
      handleSignIn(event);
    } else {
      handleSignUp(event);
    }
  }

  /**
  * helper method to handleSignInUp: when signup is clicked
  */
  function handleSignUp(event) {
    event.preventDefault();

    //get userName, email, and password
    let userName = event.target.userName.value;
    let email = event.target.email.value;
    let password = event.target.password.value;
    let confirmPassword = event.target.confirmPassword.value;

    //validate input
    if (!validate.isSignUpInputsValid(userName, email, password, confirmPassword, setSignError)) {
      return
    }

    //prepare and send API request
    let userData = {
      username: userName, email, password
    };

    const requestOptions = {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData)
    };

    fetch("/auth/signup/", requestOptions)
      .then(response => response.json())
      .then(data => {
        if (data.success && data.user) {
          props.setUser(data.user) //set user state
          props.showForm(false) //close window
        } else {
          setSignError(data.message) //show error message
        }

      });
  }


  /**
  * helper method to handleSignInUp: when signin is clicked
  */
  function handleSignIn(event) {
    event.preventDefault();

    //get email and password
    let email = event.target.email.value;
    let password = event.target.password.value;

    //validate sign in inputs
    if ((validate.validateSignInInputs(email, password, setSignError) == false)) {
      return
    }

    //prepare and send API request
    const requestOptions = {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    };

    fetch("/auth/login/", requestOptions)
      .then(response =>
        response.json())
      .then(data => {
        if (!data.success) {
          setSignError(data.message) //show error message
          props.setUser(null)
        } else {
          props.setUser(data.user) //set user state
          props.showForm(false) //close window
        }
      });

  }

  /**
  * when the forgot button is clicked
  * there are 2 stages: 
  * 1) the user provides a an email address so the password instructions are sent 
  * 2) the user recieves an email with an embeded reset code in a URL,
  * the user clicks on it to provide the new password
  */
  function handleForgotPassword(e) {
    e.preventDefault();

    //reseting error field to provide better feedback for the user
    setSignError("")

    //check the stage of resetting a password
    if (forgotPassword == 1) {
      firstStageInPasswordReset()
    } else {
      secondStageInPasswordReset();
    }
  }

  /**
   * the first stage in resetting a password
   * the user provides a an email address so the password instructions are sent
   */
  function firstStageInPasswordReset() {

    //get email address
    let email = document.getElementById("forgot-email").value;
    if (email == "") {
      setSignError("Please provide your email address");
      return;
    }

    //prepare and send API request
    const requestOptions = {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    };

    fetch("/auth/reset/", requestOptions)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setSignError("")
          alert(data.message);
          props.showForm(false) //close window
        } else {
          setSignError(data.message) //set error message
        }
      });
  }

  /**
   * the second stage in resetting a password
   * the user recieves an email with an embeded reset code in a URL,
   * the user clicks on it to provide the new password
   */
  function secondStageInPasswordReset() {
    const newPassword = document.getElementById("newPassword").value
    const confirmedPassword = document.getElementById("confirmNewPassword").value

    if (!validate.isPasswordMatch(newPassword, confirmedPassword, setSignError)) {
      return
    }

    //prepare and send API request
    const requestOptions = {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        password: newPassword,
        code: resetCode
      })
    };

    fetch("/auth/resetByEmail", requestOptions).then(response => response.json())
      .then(data => {
        if (data.success) {
          alert(data.message);
          setForgotPassword(0); //reset form state
          window.history.pushState({}, "", "/"); //go to main
        } else {
          setSignError(data.message);
        }

      });
  }

  /**
   * when the reset button is clicked
   */
  function resetPassWordButton() {
    setSignError("")
    setForgotPassword(1)
  }

  return (
    <div>
      {/* the form background shade */}
      <div className="overlay-shade" onClick={() => props.showForm(false)}></div>

      {/* the main auth form */}
      <div id="sign-in-container" >
        <div id="sign-in-form">

          {/* close button */}
          <div className="close-window" onClick={() => props.showForm(false)}>close (x)</div>

          {/* Sign In/Up button */}
          <div id="sign-in-up-buttons">
            {/* the sign in button */}
            <button name="sign-in" onClick={(e) => toggle(e)} className={!signInVisible ||
              forgotPassword == 1 || forgotPassword == 2 ?
              "button grey" : "button yellow"} >
              Sign In
            </button>

            {/* the sign up button */}
            <button name="sign-up" onClick={(e) => toggle(e)} className={signInVisible ||
              forgotPassword == 1 ?
              "button grey" : "button yellow"}>
              Sign Up
            </button>
          </div>

          {forgotPassword == 0 ?
            <form onSubmit={(e) => handleSignInUp(e)}>
              {/* sign in/up heading */}
              <h2>{!signInVisible ? "Sign Up" : "Sign In"}</h2>

              {/* the username field - to be toggled */}
              {!signInVisible ? (
                <div>
                  {/* show label when focused */}
                  {fieldLabel == "userName" ?
                    <label htmlFor="userName" className="form-label">User name</label> : null
                  }
                  <input id="userName" type="text" placeholder="User name"
                    onFocus={(e) => setFieldLabel(e.target.id)}
                    onBlur={() => setFieldLabel(null)}></input>
                </div>
              ) : null}

              {/* email field */}
              <div>
                {/* show label when focused */}
                {fieldLabel == "email" ?
                  <label htmlFor="email" className="form-label"> Email address</label> : null
                }
                <input id="email" type="email" onFocus={(e) => setFieldLabel(e.target.id)}
                  onBlur={() => setFieldLabel(null)} placeholder="Email address"></input>
              </div>

              {/* password field */}
              <div className="mb-3">
                {/* show label when focused */}
                {fieldLabel == "password" ?
                  <label htmlFor="password" className="form-label">Password</label> : null
                }
                <input id="password" type="password" placeholder="Password"
                  onFocus={(e) => setFieldLabel(e.target.id)}
                  onBlur={() => setFieldLabel(null)}></input>
              </div>

              {/*confirm password field */}
              {!signInVisible ? (
                <div className="mb-3">
                  {/* show label when focused */}
                  {fieldLabel == "confirmPassword" ?
                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label> : null
                  }
                  <input id="confirmPassword" type="password" placeholder="Confirm password"
                    onFocus={(e) => setFieldLabel(e.target.id)}
                    onBlur={() => setFieldLabel(null)}></input>
                </div>
              ) : null}

              {/* form error feedback */}
              {signError != "" ? (<div className="alert">{signError}</div>) : null}

              <button type="submit" className="button blue">Submit</button>
            </form> : null}

          {/* Forgot Password */}
          {forgotPassword != 0 ?
            <form onSubmit={(e) => handleForgotPassword(e)}>
              <h2>{forgotPassword == 2 ? "Enter New Password" : "Reset Password"}</h2>

              {/* show label when focused */}
              {fieldLabel == "forgot-email" ?
                <label htmlFor="forgot-email" className="form-label">Email address</label> : null
              }
              {/* the username field - to be toggled when forgot password is clicked */}
              {forgotPassword == 2 ? null :
                <input id="forgot-email" type="email" placeholder="Email address"
                  onFocus={(e) => setFieldLabel(e.target.id)}
                  onBlur={() => setFieldLabel(null)}></input>
              }

              {/* 2nd stage of reseting a password */}
              {forgotPassword == 2 ?
                <label>
                  Reset Code
                  <input id="passCode" type="text" value={resetCode} disabled></input>
                </label> : null}


              {/* New password field */}
              {forgotPassword == 2 ?
                <div>
                  {fieldLabel == "newPassword" ?
                    <label htmlFor="newPassword" className="form-label">New Password</label> : null}
                  <input id="newPassword" type="password" placeholder="New Password"
                    onFocus={(e) => setFieldLabel(e.target.id)}
                    onBlur={() => setFieldLabel(null)}></input>
                </div> : null}

              {/* Confirm New password field */}
              {forgotPassword == 2 ?
                <div>
                  {fieldLabel == "confirmNewPassword" ?
                    <label htmlFor="confirmNewPassword" className="form-label">Confirm Password</label> : null}
                  <input id="confirmNewPassword" type="password" placeholder="Confirm Password"
                    onFocus={(e) => setFieldLabel(e.target.id)}
                    onBlur={() => setFieldLabel(null)}></input>
                </div> : null}

              {/* instruction for 1st stage of resetting a password */}
              {forgotPassword == 1 ?
                <div><p className="sign-in-instructions">
                  Please enter your email address and
                  instructions on how to reset your
                  password will be emailed to you</p>
                </div> : null}

              {signError != "" ? (<div className="alert">{signError}</div>) : null}

              {/* reset password submit button */}
              <button type="submit" className="button blue">
                {forgotPassword == 1 ? "Send Verification Code" : "Reset Password"}
              </button>
            </form> : null}

          {/* reset password hyperlink style button, at the bottom of the form */}
          <button id="forgot-password" onClick={() => resetPassWordButton()}>
            Reset Password
          </button>
        </div>
      </div>
    </div>
  );

}


export default AuthForm;
