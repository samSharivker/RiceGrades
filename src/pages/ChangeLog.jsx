var whatChanged = "";
const changing = false;
if (changing === false){
    whatChanged = "nothing changed";
} else {
    whatChanged = "Something changed";
};

function ChangeLog() {
    return (
        <div>
            <h1>ChangeLog</h1>
            <p>{whatChanged}</p>
        </div>
    )
}

export default ChangeLog;