import { Link } from 'react-router-dom';

function Nav() {

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const isActiveLink = (pathname) => {
        return window.location.pathname === pathname ? 'active' : '';
    };

    return (
        <div class="container-fluid sticky-top" id="navbar-wrapper">
            <nav class="navbar navbar-expand-sm">
                <div class="container-fluid">
                    <Link className={`navbar-brand ${isActiveLink('/')}`} to="/" onClick={scrollToTop}><span id="brand_span">RiceGrades</span></Link>
                    <button class="navbar-toggler navbar-toggler-icon" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    </button>
                    <div class="collapse navbar-collapse position-absolute bottom-0 end-0" id="navbarNav">
                        <ul class="navbar-nav">
                            <li class="nav-item">
                                <Link className={`nav-link ${isActiveLink('/login')}`} to="/login" onClick={scrollToTop}><i class="bi bi-box-arrow-in-right"></i><span> Login</span></Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Nav;