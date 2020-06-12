import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import styles from './CreatorFilter.module.sass';
import classNames from 'classnames';
import queryString from 'query-string';
import CONSTANTS from '../../constants';
import {
  clearContestList,
  getContestsForCreative,
  getDataForContest,
  setNewCreatorFilter
} from "../../actions/actionCreator";
import CreatorFilterItem from "../CreatorFilterItem/CreatorFilterItem";

const CreatorFilter = props => {
  const {search, dataForContest: {isFetching, data}, creatorFilter, dataForContest, creatorFilter: {types}} = props;

  useEffect(() => {
    props.getDataForContest();
  }, []);

  useEffect(() => {
    parseUrlForParams(search);
  }, [search]);

  const changePredicate = ({name, value}) => {
    if (name === 'types') {
      const contestsTypes = new Set(types)
      contestsTypes.has(value) ? contestsTypes.delete(value) : contestsTypes.add(value)
      const newTypes = [...contestsTypes]
      parseParamsToUrl({...creatorFilter, types: newTypes});
    } else {
      parseParamsToUrl({...creatorFilter, ...{[name]: value === 'All industries' ? '' : value}});
    }
  };

  const parseParamsToUrl = (creatorFilter) => {
    const obj = {};
    Object.keys(creatorFilter).forEach(el => {
      if (creatorFilter[el])
        obj[el] = creatorFilter[el];
    });
    props.history.push('/Dashboard?' + queryString.stringify(obj, {arrayFormat: 'index'}));
  };

  const parseUrlForParams = (search) => {
    const parsedParams = queryString.parse(search, {arrayFormat: 'index'});
    const filter = {
      types: parsedParams.types && parsedParams.types.length > 0 ? parsedParams.types : CONSTANTS.CONTEST_TYPES,
      contestId: parsedParams.contestId || '',
      industry: parsedParams.industry || '',
      awardSort: parsedParams.awardSort || 'desc',
      ownEntries: parsedParams.ownEntries || false,
      status: parsedParams.status === 'all' ? '' : 'active'
    };
    props.newFilter(filter);
    props.clearContestsList();
    fetchContests(filter);
  };

  const fetchContests = (filter) => {
    props.getContests(Object.assign({}, {
      limit: 8,
      offset: 0
    }, filter));
  };

  const renderContestTypesFilter = () => {
    return (<div className={styles.badgeContainer}>
      {
        types.length > 0 &&
        types.map((badge) => (
          <button className={styles.badge}
                  key={badge}
                  value={badge}
                  onClick={(e) => {
                    e.preventDefault()
                    changePredicate({name: 'types', value: e.currentTarget.value})
                  }}>
            {
              badge
            }
            <i className="fa fa-times" aria-hidden="true"/>
          </button>))
      }
    </div>)
  };

  const entriesHandler = () => changePredicate({
    name: 'ownEntries',
    value: !creatorFilter.ownEntries
  })

  const entriesStyles = classNames(styles.myEntries,
    {[styles.activeMyEntries]: creatorFilter.ownEntries})

  return (
    <div className={styles.inputsContainer}>
      <div onClick={entriesHandler} className={entriesStyles}>
        My Entries
      </div>
      <div className={styles.inputContainer}>
        <span>By contest type</span>
        {
          renderContestTypesFilter()
        }
      </div>

      <CreatorFilterItem containerStyles={styles.inputContainer}
                         description={'By contest ID'}
                         name='contestId'
                         value={creatorFilter.contestId}
                         type='text'
                         inputStyles={styles.input}
                         handler={changePredicate}/>
      {
        !isFetching &&
        <CreatorFilterItem containerStyles={styles.inputContainer}
                           description={'By industry'}
                           name='industry'
                           value={creatorFilter.industry}
                           inputStyles={styles.input}
                           handler={changePredicate}>
          <option key={0} value={null}>All industries</option>
          {
            data.industry && data.industry.length > 0 &&
            data.industry.map(indstr => (<option key={indstr} value={indstr}>{indstr}</option>))
          }
        </CreatorFilterItem>
      }
      <CreatorFilterItem containerStyles={styles.inputContainer}
                         description={'By amount award'}
                         name='awardSort'
                         value={creatorFilter.awardSort}
                         inputStyles={styles.input}
                         handler={changePredicate}>
        <option value='desc'>Descending</option>
        <option value='asc'>Ascending</option>
      </CreatorFilterItem>
      <CreatorFilterItem containerStyles={styles.inputContainer}
                         description={'By status'}
                         name='status'
                         value={creatorFilter.status}
                         inputStyles={styles.input}
                         handler={changePredicate}>
        <option value='all'>All</option>
        <option value='active'>Active</option>
      </CreatorFilterItem>
    </div>
  );
};

const mapStateToProps = (state) => {
  const {contestsList, dataForContest} = state;
  return {...contestsList, dataForContest};
};

const mapDispatchToProps = (dispatch) => {
  return {
    getContests: (data) => dispatch(getContestsForCreative(data)),
    clearContestsList: () => dispatch(clearContestList()),
    newFilter: (filter) => dispatch(setNewCreatorFilter(filter)),
    getDataForContest: () => dispatch(getDataForContest())
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(CreatorFilter);