import React from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import {
  signOut
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js'
import { auth } from '../firebase'

export default class Teacher extends React.Component {
    render() {
      const handleSignOut = () => {
        signOut(auth)
          .then(() => console.log("Sign Out"))
          .catch((error) => console.log(error));
      };
      return (
        <div>
             <p>teacher page</p>
            <button onClick={handleSignOut}>Sign Out</button>
            <Footer />
        </div>
      );
    }
  };

