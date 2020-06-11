import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { getContestsForCreative, clearContestList, } from '../../actions/actionCreator';
import ContestsContainer from '../../components/ContestsContainer/ContestsContainer';
import ContestBox from "../ContestBox/ContestBox";
import styles from './CreatorDashboard.module.sass';
import TryAgain from '../../components/TryAgain/TryAgain';
import CreatorFilter from "../CreatorFilter/CreatorFilter";

class CreatorDashboard extends Component {

    componentWillUnmount() {
        this.props.clearContestsList();
    }

    getPredicateOfRequest = () => {
        const obj = {};
        const {creatorFilter} = this.props;
        Object.keys(creatorFilter).forEach((el) => {
            if (creatorFilter[el]) {
                obj[el] = creatorFilter[el];
            }
        });
        obj.ownEntries = creatorFilter.ownEntries;
        return obj;
    };

    loadMore = (startFrom) => {
        this.props.getContests(Object.assign({}, {
            limit: 8,
            offset: startFrom
        }, this.getPredicateOfRequest()));
    };

    setContestList = () => {
        const contestList = [];
        const {contests} = this.props;
        for (let i = 0; i < contests.length; i++) {
            contestList.push(<ContestBox data={contests[i]}
                                         key={contests[i].id}
                                         goToExtended={this.goToExtended}/>)
        }
        return contestList;
    };

    goToExtended = (contestId) => {
        this.props.history.push('/contest/' + contestId);
    };

    tryLoadAgain = () => {
        this.props.clearContestsList();
        this.props.getContests({limit: 8, offset: 0, ...this.getPredicateOfRequest()});
    };

    render() {
        const {error, haveMore, history} = this.props;
        return (
            <div className={styles.mainContainer}>
                <div className={styles.filterContainer}>
                    <span className={styles.headerFilter}>Filter Results</span>
                    <CreatorFilter search={history.location.search} history={history}/>
                </div>
                {
                    error ?
                        <div className={styles.messageContainer}>
                            <TryAgain getData={this.tryLoadAgain}/>
                        </div>
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
        )
    }
}

const mapStateToProps = (state) => {
    const {contestsList, dataForContest} = state;
    return {...contestsList, dataForContest};
};

const mapDispatchToProps = (dispatch) => {
    return {
        getContests: (data) => dispatch(getContestsForCreative(data)),
        clearContestsList: () => dispatch(clearContestList()),
    }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreatorDashboard));