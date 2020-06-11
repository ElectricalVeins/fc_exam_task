import React,{Component} from 'react';
import {connect} from 'react-redux';
import { Link } from 'react-router-dom'
import {getContestsForCustomer, clearContestList, setNewCustomerFilter} from '../../actions/actionCreator';
import CONSTANTS from '../../constants';
import ContestsContainer from '../../components/ContestsContainer/ContestsContainer';
import ContestBox from "../ContestBox/ContestBox";
import styles from './CustomerDashboard.module.sass';
import TryAgain from '../../components/TryAgain/TryAgain';
import CustomerFilterItem from "../CustomerFilterItem/CustomerFilterItem";


class CustomerDashboard extends Component {

    loadMore = (startFrom) => {
        this.props.getContests({
            limit: 8,
            offset: startFrom,
            contestStatus: this.props.customerFilter
        });
    };

    componentDidMount() {
        this.getContests();
    }

    getContests = () => {
        this.props.getContests({limit: 8, contestStatus: this.props.customerFilter});
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.customerFilter !== prevProps.customerFilter) {
            this.getContests();
        }
    }

    goToExtended = (contest_id) => {
        this.props.history.push('/contest/' + contest_id);
    };

    setContestList = () => {
        const contestList = [];
        const {contests} = this.props;
        for (let i = 0; i < contests.length; i++) {
            contestList.push(<ContestBox data={contests[i]} key={contests[i].id}
                                   goToExtended={this.goToExtended}/>)
        }
        return contestList;
    };

    componentWillUnmount() {
        this.props.clearContestsList();
    }

    tryToGetContest = () => {
        this.props.clearContestsList();
        this.getContests();
    };

    render() {
        const {error, haveMore, customerFilter} = this.props;
        const filterStyles={
            activeFilter: styles.activeFilter,
            filter: styles.filter
        }
        return (
            <div className={styles.mainContainer}>
                <div className={styles.filterContainer}>
                    <CustomerFilterItem newFilter={this.props.newFilter}
                                        status={CONSTANTS.CONTEST_STATUS_ACTIVE}
                                        customerFilter={customerFilter}
                                        classes={filterStyles}>
                        Active Contests
                    </CustomerFilterItem>
                    <CustomerFilterItem newFilter={this.props.newFilter}
                                        status={CONSTANTS.CONTEST_STATUS_FINISHED}
                                        customerFilter={customerFilter}
                                        classes={filterStyles}>
                        Completed contests
                    </CustomerFilterItem>
                    <CustomerFilterItem newFilter={this.props.newFilter}
                                        status={CONSTANTS.CONTEST_STATUS_PENDING}
                                        customerFilter={customerFilter}
                                        classes={filterStyles}>
                        Inactive contests
                    </CustomerFilterItem>
                    <Link to='/events' className={styles.filter}>Events</Link>
                </div>
                <div className={styles.contestsContainer}>
                    {
                        error ?
                            <TryAgain getData={this.tryToGetContest}/>
                            :
                            <ContestsContainer isFetching={this.props.isFetching}
                                               loadMore={this.loadMore}
                                               history={this.props.history}
                                               haveMore={haveMore}>
                                {
                                    this.setContestList()
                                }
                            </ContestsContainer>
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return state.contestsList;
};

const mapDispatchToProps = (dispatch) => {
    return {
        getContests: (data) => dispatch(getContestsForCustomer(data)),
        clearContestsList: () => dispatch(clearContestList()),
        newFilter: (filter) => dispatch(setNewCustomerFilter(filter))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomerDashboard);