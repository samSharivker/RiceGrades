import {useState} from 'react';


export default function Teacher() {
    var grades = []//needs to be local 
    var gradeSystem = ""
    const [val, setVal] = useState("Enter Grade")
    const click = () => {
        alert(val)//Grade submitted
        grades.push(val)
        console.log(grades.join("|"))
        gradeSystem = grades.join("|")
    }
    const change = event => {
       setVal(event.target.value)
    }

    return (
        <div>
            <input onChange={change} value = {val}/>
            <button onClick = {click}>Submit grade</button>
            <p>These are your students' grades: {gradeSystem}</p>
        </div>
    )
}
