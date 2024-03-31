import React from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';

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

export default class Student extends React.Component {
    render() {
      return (
        <div>
            <Nav />
            <Grades grade={grading} />
            <Footer />
        </div>
      );
    }
  };

