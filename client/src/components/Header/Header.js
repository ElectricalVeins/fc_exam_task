import React from 'react';
import styles from './Header.module.sass';
import {connect} from 'react-redux';
import {Link, withRouter} from 'react-router-dom';
import CONSTANTS from '../../constants';
import {clearUserStore, headerRequest} from '../../actions/actionCreator';


class Header extends React.Component {
    componentDidMount() {
        if (!this.props.data) {
            this.props.getUser();
        }
    }

    logOut = () => {
        localStorage.clear();
        this.props.clearUserStore();
        this.props.history.replace('/login');
    };

    startContests = () => {
        this.props.history.push('/startContest');
    };
    renderLoginButtons = () => {
        const {data}=this.props
        if (data) {
            return (
                <>
                    <div className={styles.userInfo}>
                        <img
                            src={data.avatar  ? `${CONSTANTS.publicURL}${data.avatar}` : CONSTANTS.ANONYM_IMAGE_PATH}
                            alt='user'/>
                        <span>{`Hi, ${data.displayName}`}</span>
                        <img src={`${CONSTANTS.STATIC_IMAGES_PATH}menu-down.png`} alt='menu'/>
                        <ul>
                            <li><Link to='/dashboard'><span>View Dashboard</span></Link></li>
                            <li><Link to='/account' ><span>My Account</span></Link></li>
                            <li><Link to='http:/www.google.com'><span>Messages</span></Link></li>
                            <li><Link to='http:/www.google.com'><span>Affiliate Dashboard</span></Link>
                            </li>
                            <li onClick={this.logOut}><span>Logout</span></li>
                        </ul>
                    </div>
                    <img src={`${CONSTANTS.STATIC_IMAGES_PATH}email.png`} className={styles.emailIcon} alt='email'/>
                </>
            )
        } else {
            return (
                <>
                    <Link to='/login'><span>LOGIN</span></Link>
                    <Link to='/registration'><span>SIGN UP</span></Link>
                </>
            )
        }
    };

    render() {
        if (this.props.isFetching) {
            return null;
        }
        return (
            <div className={styles.headerContainer} id={this.props.id}>
                <div className={styles.fixedHeader}>
                    <span className={styles.info}>Squadhelp recognized as one of the Most Innovative Companies by Inc Magazine.</span>
                    <a href="http://www.google.com">Read Announcement</a>
                </div>
                <div className={ styles.loginSignnUpHeadersWrapper }>
                    <div className={styles.loginSignnUpHeadersContainer}>
                        <div className={ styles.numberContainer }>
                            <img src={ `${ CONSTANTS.STATIC_IMAGES_PATH }phone.png` } alt='phone'/>
                            <a href="tel:8773553585"><span>(877)&nbsp;355-3585</span></a>
                        </div>
                        <div className={ styles.userButtonsContainer }>
                            { this.renderLoginButtons() }
                        </div>
                    </div>
                </div>
                <div className={styles.navContainer}>
                    <Link to='/'><img src={`${CONSTANTS.STATIC_IMAGES_PATH}blue-logo.png`} className={styles.logo} alt='blue_logo'/></Link>
                    <div className={styles.leftNav}>
                        <div className={styles.nav}>
                            <ul>
                                <li>
                                    <span>NAME IDEAS</span><img src={`${CONSTANTS.STATIC_IMAGES_PATH}menu-down.png`}
                                                                alt='menu'/>
                                    <ul>
                                        <li><Link to="http://www.google.com">Beauty</Link></li>
                                        <li><Link to="http://www.google.com">Consulting</Link></li>
                                        <li><Link to="http://www.google.com">E-Commerce</Link></li>
                                        <li><Link to="http://www.google.com">Fashion & Clothing</Link></li>
                                        <li><Link to="http://www.google.com">Finance</Link></li>
                                        <li><Link to="http://www.google.com">Real Estate</Link></li>
                                        <li><Link to="http://www.google.com">Tech</Link></li>
                                        <li className={styles.last}><Link to="http://www.google.com">More Categories</Link>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <span>CONTESTS</span><img src={`${CONSTANTS.STATIC_IMAGES_PATH}menu-down.png`}
                                                              alt='menu'/>
                                    <ul>
                                        <li><Link to='/howItWorks'>HOW IT WORKS</Link></li>
                                        <li><Link to="http://www.google.com">PRICING</Link></li>
                                        <li><Link to="http://www.google.com">AGENCY SERVICE</Link></li>
                                        <li><Link to="http://www.google.com">ACTIVE CONTESTS</Link></li>
                                        <li><Link to="http://www.google.com">WINNERS</Link></li>
                                        <li><Link to="http://www.google.com">LEADERBOARD</Link></li>
                                        <li className={styles.last}><Link to="http://www.google.com">BECOME A
                                            CREATIVE</Link></li>
                                    </ul>
                                </li>
                                <li>
                                    <span>Our Work</span><img src={`${CONSTANTS.STATIC_IMAGES_PATH}menu-down.png`}
                                                              alt='menu'/>
                                    <ul>
                                        <li><Link to="http://www.google.com">NAMES</Link></li>
                                        <li><Link to="http://www.google.com">TAGLINES</Link></li>
                                        <li><Link to="http://www.google.com">LOGOS</Link></li>
                                        <li className={styles.last}><Link to="http://www.google.com">TESTIMONIALS</Link>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <span>Names For Sale</span>
                                    <img src={`${CONSTANTS.STATIC_IMAGES_PATH}menu-down.png`} alt='menu'/>
                                    <ul>
                                        <li><Link to="http://www.google.com">POPULAR NAMES</Link></li>
                                        <li><Link to="http://www.google.com">SHORT NAMES</Link></li>
                                        <li><Link to="http://www.google.com">INTRIGUING NAMES</Link></li>
                                        <li><Link to="http://www.google.com">NAMES BY CATEGORY</Link></li>
                                        <li><Link to="http://www.google.com">VISUAL NAME SEARCH</Link></li>
                                        <li className={styles.last}><Link to="http://www.google.com">SELL YOUR
                                            DOMAINS</Link></li>
                                    </ul>
                                </li>
                                <li>
                                    <span>Blog</span><img src={`${CONSTANTS.STATIC_IMAGES_PATH}menu-down.png`}
                                                          alt='menu'/>
                                    <ul>
                                        <li><Link to="http://www.google.com">ULTIMATE NAMING GUIDE</Link></li>
                                        <li><Link to="http://www.google.com">POETIC DEVICES IN BUSINESS NAMING</Link></li>
                                        <li><Link to="http://www.google.com">CROWDED BAR THEORY</Link></li>
                                        <li className={styles.last}><Link to="http://www.google.com">ALL ARTICLES</Link>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                        {this.props.data && this.props.data.role === CONSTANTS.CUSTOMER &&
                        <div className={styles.startContestBtn} onClick={this.startContests}>START CONTEST</div>}
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return state.userStore;
};
const mapDispatchToProps = (dispatch) => {
    return {
        getUser: () => dispatch(headerRequest()),
        clearUserStore: () => dispatch(clearUserStore())
    }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));