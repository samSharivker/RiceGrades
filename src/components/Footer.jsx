import { Link } from 'react-router-dom';

function Footer() {

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <div>
            <footer className="container-fluid text-center">
                <div className="container">
                    <h6>
                    <Link className="footer-link" to="/contact" onClick={scrollToTop}><span> Contact</span></Link>
                    <Link className="footer-link" to="/developers" onClick={scrollToTop}><span> Developers</span></Link>
                    <Link className="footer-link" to="/changelog" onClick={scrollToTop}><span> Changelog</span></Link>
                    </h6>
                    <h6>Copyright © 2023 RiceGrades. All Rights Reserved</h6>
                </div>
            </footer>
        </div>
    );
}

export default Footer;