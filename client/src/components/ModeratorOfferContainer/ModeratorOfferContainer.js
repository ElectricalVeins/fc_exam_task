import React,{useEffect} from 'react';
import PropTypes from 'prop-types';
import SpinnerLoader from "../Spinner/Spinner";
import TryAgain from "../TryAgain/TryAgain";
import CONSTANTS from '../../constants';

const ModeratorOfferContainer = props => {
  const{loadMore, isFetching, error}=props;

  useEffect(()=>{
    window.addEventListener('scroll', scrollHandler);
    return () => {
      window.removeEventListener('scroll', scrollHandler);
    }
  })

  const scrollHandler = () => {
    if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight - CONSTANTS.SCROLL_DELTA) {
      if (!isFetching) {
        fetchAgain();
      }
    }
  };

  const fetchAgain = () => {
    loadMore(props.children.length);
  }

  if (error) return <TryAgain getData={fetchAgain}/>

  return <>
    {props.children}
    {isFetching && <SpinnerLoader/>}
    <TryAgain getData={fetchAgain} text={'Load Offers'}/>
  </>
};

ModeratorOfferContainer.propTypes = {
  loadMore:PropTypes.func.isRequired,
  isFetching:PropTypes.bool.isRequired,
  error: PropTypes.object,
};

export default ModeratorOfferContainer;