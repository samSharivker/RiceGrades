import Nav from '../components/Nav';
import Footer from '../components/Footer';
import Logo from '../img/logo.png';
import Rice1 from '../img/sample-rice-1.png';
import Rice2 from '../img/sample-rice-2.png';
import Rice3 from '../img/sample-rice-3.png';
import John from '../img/john.png';

export default function Home() {
    return (
        <div>
            <Nav />
            <section id="header">
                <div className="header">
                    <div className="container">
                        <p>"Cook your Grades like your Rice" - Jiaming Lin</p>
                        <img id="rice-img" src={John} alt="temp" />
                    </div>
                </div>
            </section>
            <main>
                <section id="about">
                    <div className="about">
                        <div className="container">
                            <img src={Logo} alt="App Logo" />
                            <p>Professional Grading App for Students by Students</p>
                        </div>
                    </div>
                </section>
            </main>
            <div id="gallery">
                <div className="gallery">
                    <div className="container">
                        <h>Gallery View</h> <br /><br /><br />
                        <div className="slider-wrapper">
                            <div className="slider">
                                <img id="slide-1" src={Rice1} alt="temp" />
                                <img id="slide-2" src={Rice2} alt="temp" />
                                <img id="slide-3" src={Rice3} alt="temp" />
                            </div>
                            <div className="slider-nav">
                                <a href="#slide-1">.</a>
                                <a href="#slide-2">.</a>
                                <a href="#slide-3">.</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}
