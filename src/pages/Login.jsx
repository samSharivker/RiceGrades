// import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { app } from '../firebase';
import {
    GoogleAuthProvider, getAuth, signInWithPopup, signOut, onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js'
import { useEffect } from 'react';


const auth = getAuth()
auth.useDeviceLanguage();
const provider = new GoogleAuthProvider();



export default function Login() {
    useEffect(() => {
        // This runs after the component mounts
        const element = document.querySelector("#Student");
        element.addEventListener("click", function(event){
            signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                // IdP data available using getAdditionalUserInfo(result)
                // ...
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                // ...
            });
        })
      }, []); // Empty dependency array ensures this runs only once after mounting


    return (
        <div>
            <nav>
                <div className="logo">
                    <a href="/#">Rice Grades</a>
                </div>
            </nav>
            <button id="Student">Student</button>
            <button id="Teacher">Teacher</button>
            <Footer />
        </div>
    )
}


