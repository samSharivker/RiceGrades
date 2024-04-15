// import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { app, auth } from '../firebase';
import {
   createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js'
import { useState } from 'react';
import { Navigate } from "react-router-dom";








export default function Login({ user }) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isSignUpActive, setIsSignUpActive] = useState(true)

    // function to
    const handleMethodChange = () =>  {
        setIsSignUpActive(!isSignUpActive)
    }
    // function to sign up user
    const handleSignUp = () => {
        if(!email || !password) return;
            createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed up
                const user = userCredential.user;
                console.log(user)
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage)
                // ..
            });
        }
    // function for user to login
    const handleSignIn = () => {
        if(!email || !password) return;
            signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed up
                const user = userCredential.user;
                console.log(user)
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage)
                // ..
            });
    }

    const handleEmailChange = (event) => setEmail(event.target.value)
    const handlePasswordChange = (event) => setPassword(event.target.value)
    if (user) {
        return <Navigate to="/student"></Navigate>;
      }
    return (
        <div>
            <nav>
                <div className="logo">
                    <a href="/#">Rice Grades</a>
                </div>
            </nav>
                <form>
                    {!isSignUpActive && <legend>Sign In</legend>}
                    {isSignUpActive && <legend>Sign Up</legend>}
                    <fieldset>
                        <ul>
                            <li>
                                <label htmlFor="email">Email</label>
                                <input type="text" id="email" onChange={handleEmailChange} />
                            </li>
                            <li>
                                <label htmlFor="password">Password</label>
                                <input type="password" id="password" onChange={handlePasswordChange}/>
                            </li>
                        </ul>
                        {!isSignUpActive && <button type="button" onClick={handleSignIn}>Sign In</button>}
                        {isSignUpActive && <button type="button" onClick={handleSignUp}>Sign Up</button>}
                    </fieldset>
                    {!isSignUpActive && <a onClick={handleMethodChange}>Create an account</a>}
                    {isSignUpActive && <a onClick={handleMethodChange}>Login</a>}
                </form>
            <Footer />
        </div>
    )
}


