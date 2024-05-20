import Footer from '../components/Footer';
import { app, auth, db } from '../firebase';
import {
   createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth'

import { useState } from 'react';
import { Navigate } from "react-router-dom";
import { getDatabase, ref, set, child, get } from "firebase/database";
import Nav from "../components/Nav";

export default function Login({ user }) {
    const [redirect, setRedirect] = useState("");
    const [role, setRole] = useState(3);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [isSignUpActive, setIsSignUpActive] = useState(true);

    const handleEmailChange = (event) => setEmail(event.target.value);
    const handlePasswordChange = (event) => setPassword(event.target.value);
    const handleFirstNameChange = (event) => setFirstName(event.target.value);
    const handleLastNameChange = (event) => setLastName(event.target.value);

    //first name, last name, email, role, uid
    function writeData(a, b, c, d, e) {
        const reference = ref(db, 'users/' + e);
        set(reference, {
            "firstName": a,
            "lastName": b,
            "email": c,
            "role": d,
            "uid": e
        })
    }

    //uid
    function getUserRole(a) {
        return new Promise((resolve, reject) => {
            const dbRef = ref(db);
            get(child(dbRef, 'users/' + a)).then((snapshot) => {
                if(snapshot.exists()) {
                    const result = snapshot.val().role;
                    resolve(result);
                } else {
                    resolve(null); // Resolve with null if no data is available
                }
            }).catch((error) => {
                console.log(error);
                reject(error); // Reject with error if any error occurs
            })
        });
    }

    // function to change register to login or other way around
    const handleMethodChange = () =>  {
        setIsSignUpActive(!isSignUpActive)
    }
    // function to sign up user
    const handleSignUp = (event) => {
        event.preventDefault();
        if(roles[role] == undefined) {
            alert("Must Pick a Role!")
            return
        }
        if(!email || !password || !firstName || !lastName) {
            if(!firstName) {
                document.querySelector('#firstName').reportValidity();
            }
            if(!lastName) {
                document.querySelector('#lastName').reportValidity();
            }
            if(!email) {
                document.querySelector('#email').reportValidity();
            }
            if(!password) {
                document.querySelector('#password').reportValidity();
            }
        } else {
            createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed up
                const user = userCredential.user;
                writeData(firstName, lastName, email, roles[role], user.uid)
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                alert(errorMessage);
            });
        }
    }
    // function for user to login
    const handleSignIn = (event) => {
        event.preventDefault();  // prevent reloading
        if(!email || !password) return;
            signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed up
                const user = userCredential.user;
                console.log(user)
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                alert(errorMessage)
            });
    }


    const roles = ["student", "teacher"]
    const lsb = document.querySelector("#lsb");
    const ltb = document.querySelector("#ltb");
    function studentRole(){
        setRole(0)
        if(lsb) {
            lsb.style.backgroundColor = "#618264";
        }
        if(ltb) {
            ltb.style.backgroundColor = "#D0E7D2";
        }
    }
    function teacherRole(){
        setRole(1)
        if(lsb) {
            lsb.style.backgroundColor = "#D0E7D2";
        }
        if(ltb) {
            ltb.style.backgroundColor = "#618264";
        }
    }

    if (user) {
        getUserRole(user.uid)
        .then((userRole) => {
            setRedirect(userRole);
        })
        .catch((error) => {
            console.error("Error fetching user role:", error);
            // Handle error accordingly
        });
    }

    if (redirect) {
        return <Navigate to={`/${redirect}`}></Navigate>;
    }

    return (
        <div id="login-page">
            <Nav />
            <div className="form-wrapper">
                <form>
                    {isSignUpActive && <legend>Sign In Page</legend>}
                    {!isSignUpActive && <legend>Sign Up Page</legend>}
                    <fieldset>
                        <ul>
                            {!isSignUpActive && (
                                <>
                                    <li>
                                        <label htmlFor="firstName">First Name:</label>
                                        <input type="text" value={firstName} onChange={handleFirstNameChange} id="firstName" required />
                                    </li>
                                    <li>
                                        <label htmlFor="lastName">Last Name:</label>
                                        <input type="text" value={lastName} onChange={handleLastNameChange} id="lastName" required />
                                    </li>
                                </>
                            )}
                            <li>
                                <label htmlFor="email">Email:</label>
                                <input type="text" id="email" value={email} onChange={handleEmailChange} required />
                            </li>
                            <li>
                                <label htmlFor="password">Password:</label>
                                <input type="password" id="password" value={password} onChange={handlePasswordChange} required />
                            </li>
                        </ul>
                        {!isSignUpActive && (
                            <>
                                <form>
                                    <label>Role:</label>
                                    <div className="role-wrapper">
                                        <button id="lsb" type="button" onClick={studentRole}>student</button>
                                        <button id="ltb" type="button" onClick={teacherRole}>teacher</button>
                                    </div>
                                </form>
                            </>
                        )}
                        {isSignUpActive && <button type="submit" onClick={handleSignIn}>Sign In</button>}
                        {!isSignUpActive && <button type="submit" onClick={handleSignUp}>Sign Up</button>}
                    </fieldset>
                    {isSignUpActive && <a class="lbb" onClick={handleMethodChange}>Create an account!</a>}
                    {!isSignUpActive && <a class="lbb" onClick={handleMethodChange}>Login!</a>}
                </form>
            </div>
            <Footer />
        </div>
    )
     // redirect user to student page after login
}


