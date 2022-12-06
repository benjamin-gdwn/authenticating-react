import { useRef, useState, useContext } from "react";
import AuthContext from "../../store/AuthContext";

import classes from "./AuthForm.module.css";

const AuthForm = () => {
  const [showError, setShowError] = useState('');
  const [isError, setIsError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  // bringing in the context from the state wide management of logged in or out
  const authCtx = useContext(AuthContext);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };
  let errorMessage;

  // function to extract user data
  const submitHandler = (e) => {
    e.preventDefault();
    // capturing current value for the submitted form
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    setIsLoading(true);
    // helper variable to store the variable depending on the action
    let url;
    if (isLogin) {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCA15bS1q3SfjVfyLy8apxxREWIkpap8y0";
    } else {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCA15bS1q3SfjVfyLy8apxxREWIkpap8y0";
    }
    // creating post request with an object as defined by the firebase docs
    fetch(
      url,
      {
        method: "POST",
        body: JSON.stringify({
          // this is the object of data firebase needs
          email: enteredEmail,
          password: enteredPassword,
          returnSecureToken: true,
        }),
        // this header lets the server know to expect json data
        headers: {
          "Content-Type": "application/json",
        },
      }
      // Once the promise has been received check if the result is ok
    )
      .then(async (res) => {
        setIsLoading(false);
        // if the data returned is ok then
        if (res.ok) {
          return res.json();
        } else {
          // If the data is not ok then looking into error data
          return res.json().then((data) => {
            // returning error feedback to user
            if (data && data.error && data.error.message) {
              // throw a new error with info received
              errorMessage = data.error.message;
            }
            
            throw new Error(errorMessage);
          });
        }
        
      }
      )
      .then((data) => {
        authCtx.login(data.idToken);
      })
      .catch((err) => {
        // err is the argument which stores error message so set it as state
        setIsError(true);
        setShowError(err.message);
      });
  };
  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      {isError && <div className={classes.alert}><h3 className={classes.loading}>{showError}</h3></div>}
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input ref={emailInputRef} type="email" id="email" required />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            ref={passwordInputRef}
            type="password"
            id="password"
            required
          />
        </div>
        <div className={classes.actions}>
          {!isLoading && (
            <button>{isLogin ? "Login" : "Create Account"}</button>
          )}
          {isLoading && <p className={classes.loading}>Loading.....</p>}

          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
