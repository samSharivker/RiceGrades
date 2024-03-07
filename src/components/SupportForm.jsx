export default function SupportForm() {
    function handleSubmit(event) {
        event.preventDefault();
        let rawName = document.querySelector('#sf-name').value;
        let rawEmail = document.querySelector('#sf-email').value;
        let rawSubject = document.querySelector('#sf-subject').value;
        let rawMessage = document.querySelector('#sf-message').value;

        if(rawMessage.length < 4096) {
            const url = "https://discord.com/api/webhooks/1215141206003027978/6pu2MvscIk5id8CD89VF-Hu0D49GCDNaCr-S7fbESc-mbNdFDJoyV3P8UGeajX8WDGce"

            const data = {
                "content": "<@503673006766161930> <@539558544618291210> <@471429445329354764>",
                "embeds": [{
                    "title": "New Ticket!",
                    "description": rawMessage,
                    "color": 11590065,
                    "fields": [
                        {
                            "name": "Name:",
                            "value": rawName,
                            "inline": false
                        },
                        {
                            "name": "Email:",
                            "value": rawEmail,
                            "inline": false
                        },
                        {
                            "name": "Subject:",
                            "value": rawSubject,
                            "inline": false
                        }
                    ],
                }]
            }

            const options = {
                "method": 'POST',
                "headers": {
                    'Content-Type': 'application/json'
                },
                "body": JSON.stringify(data)
            }

            fetch(url, options)
            alert("Your message has been sent!")
        } else {
            alert("Your message is too long! Must be under 4096 characters!")
        }
        document.querySelector('form').reset();
    }

    return (
        <div>
            <div id="support-form">
                <form onSubmit={handleSubmit} className="support-form">
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
                            <input type="text" id="sf-subject" name="sf-subject" required/>
                        </div>
                        <div className="sp-input-wrapper">
                            <label for="sf-message">Message:</label>
                            <textarea name="sf-message" id="sf-message" rows="10" required></textarea>
                        </div>
                        <button type="submit">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
