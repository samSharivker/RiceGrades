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
                        <a href="https://samuelsharivker.com"><h>Samuel Sharivker</h></a>
                        <p className="dev-title">Lead Developer</p>
                        <p className="dev-bio">{samBio}</p>
                    </div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#79AC78" fill-opacity="1" d="M0,192L80,202.7C160,213,320,235,480,224C640,213,800,171,960,154.7C1120,139,1280,149,1360,154.7L1440,160L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path></svg>
            </section>
            <section>
                <div className="developers">
                    <div className="container" id="yu-dev-card">
                        <img src="https://github.com/zixuany7791.png" height="150" width="150" alt="Developer" />
                        <a href="https://github.com/zixuany7791"><h>Zi Xuan Yu</h></a>
                        <p className="dev-title">Chief Firebase Developer</p>
                        <p className="dev-bio">{yuBio}</p>
                    </div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#618264" fill-opacity="1" d="M0,192L80,202.7C160,213,320,235,480,224C640,213,800,171,960,154.7C1120,139,1280,149,1360,154.7L1440,160L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path></svg>
            </section>
            <section>
                <div className="developers">
                    <div className="container" id="ben-dev-card">
                        <img src="https://github.com/benjaminc8190.png" height="150" width="150" alt="Developer" />
                        <a href="https://github.com/benjaminc8190"><h>Benjamin The Chau</h></a>
                        <p className="dev-title">Chief React Developer</p>
                        <p className="dev-bio">{benBio}</p>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    )
}
