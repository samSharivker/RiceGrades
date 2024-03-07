export default function SupportForm() {
    return (
        <div>
            <div id="support-form">
                <form className="support-form">
                    <div className="container">
                        <div className="sp-input-wrapper">
                            <label for="sf-name">Name:</label>
                            <input type="text" id="sf-name" name="sf-name" placeholder="John Doe" required/>
                        </div>
                        <div className="sp-input-wrapper">
                            <label for="sf-email">Email:</label>
                            <input type="email" id="sf-email" name="sf-email" placeholder="jdoe131@gmail.com" required/>
                        </div>
                        <div className="sp-input-wrapper">
                            <label for="sf-subject">Subject:</label>
                            <textarea name="sf-subject" id="sf-subject" rows="10" required></textarea>
                        </div>
                        <button type="submit">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
