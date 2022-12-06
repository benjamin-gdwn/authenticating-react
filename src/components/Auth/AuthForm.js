import { useRef, useState } from "react";

import classes from "./AuthForm.module.css";

const AuthForm = () => {
  const [isError, setIsError] = useState();
  const [errorMessage, setErrorMessage] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  // function to extract user data
  const submitHandler = (e) => {
    e.preventDefault();
    // capturing current value for the submitted form
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    console.log(passwordInputRef.current.value);
    if (isLogin) {
    } else {
      // creating post request with an object as defined by the firebase docs
      fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCA15bS1q3SfjVfyLy8apxxREWIkpap8y0",
        { method: "POST",
      body: JSON.stringify({
        // this is the object of data firebase needs
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true
      }),
      // this header lets the server know to expect json data
    headers: {
      'Content-Type' : 'application/json'
    }
    }
    // Once the promise has been received check if the result is ok
      ).then(res => {
        // if the data returned is ok then
        if(res.ok){

        } else{
          // If the data is not ok then looking into error data
          return res.json().then(data => {
            console.log(data.error.message)
            setErrorMessage(data.error.message)
            setIsError(true);
          });
        }
      });
    }
  };
  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input ref={emailInputRef} type="email" id="email" required />
        </div>
        <div className={classes.control}>
          <label  htmlFor="password">
            Your Password
          </label>
          <input ref={passwordInputRef} type="password" id="password" required />
        </div>
        <div className={classes.actions}>
          <button>{isLogin ? "Login" : "Create Account"}</button>
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isError && <h4>{errorMessage}</h4>}
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
