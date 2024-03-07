import Nav from '../components/Nav';
import Footer from '../components/Footer';

export default function Developers() {
    const samBio = '"I love getting my whole class extra credit just to get a 55% on my AP Calc Quiz."';
    const yuBio = '"I love getting 70% on my AP Calc test."';
    const benBio = '"I like math."';
    return (
        <div id="developers-page">
            <Nav />
            <section>
                <div className="developers">
                    <div className="container" id="sam-dev-card">
                        <img src="https://github.com/samuels0052.png" height="150" width="150" alt="Developer" />
                        <h>Samuel Sharivker</h>
                        <p className="dev-title">Lead Developer</p>
                        <p className="dev-bio">{samBio}</p>
                    </div>
                </div>
            </section>
            <section>
                <div className="developers">
                    <div className="container" id="yu-dev-card">
                        <img src="https://github.com/zixuany7791.png" height="150" width="150" alt="Developer" />
                        <h>Zi Xuan Yu</h>
                        <p className="dev-title">Chief Firebase Developer</p>
                        <p className="dev-bio">{yuBio}</p>
                    </div>
                </div>
            </section>
            <section>
                <div className="developers">
                    <div className="container" id="ben-dev-card">
                        <img src="https://github.com/benjaminc8190.png" height="150" width="150" alt="Developer" />
                        <h>Benjamin The Chau</h>
                        <p className="dev-title">Chief React Developer</p>
                        <p className="dev-bio">{benBio}</p>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    )
}
