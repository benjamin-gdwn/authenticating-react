import { useRef, useContext } from 'react';
import AuthContext from '../../store/AuthContext';
import classes from './ProfileForm.module.css';
import { useHistory } from 'react-router-dom';
const ProfileForm = () => {
  const newPasswordInputRef = useRef();
  const authCtx = useContext(AuthContext);
  const history = useHistory();
  const submitHandler = (event) => {
    event.preventDefault();
    
    const enteredNewPassword = newPasswordInputRef.current.value;

    // add validation

    fetch('https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyCA15bS1q3SfjVfyLy8apxxREWIkpap8y0', {
      method: 'POST',
      body: JSON.stringify({
        idToken: authCtx.token,
        password: enteredNewPassword,
        returnSecureToken: false
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(async(res) => {
      // assumption: Always succeeds!
      history.replace('/')
console.log(res.json());
    });
  };

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input type='password' id='new-password' minLength="7" ref={newPasswordInputRef} />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
};

export default ProfileForm;