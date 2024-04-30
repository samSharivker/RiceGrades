import React from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import {
  signOut
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js'
import { auth } from '../firebase'
const grading=[
    "Math: 50%",
    "History:75%",
    "SEP: 50%"
];

const Grades = (props) => {
    return (
    <div>
        <h3>Your grades: {props.grade.join(', ')}</h3>
    </div>
    );
};

Grades.defaultProps = {}

export default class Student extends React.Component {
    render() {
      const handleSignOut = () => {
        signOut(auth)
          .then(() => console.log("Sign Out"))
          .catch((error) => console.log(error));
      };
      return (
        <div>
            <Nav />
            <Grades grade={grading} />
            <button onClick={handleSignOut}>Sign Out</button>
            <Footer />
        </div>
      );
    }
  };

