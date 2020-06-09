import React,{useEffect} from 'react';
import PropTypes from 'prop-types';
import SpinnerLoader from "../Spinner/Spinner";
import TryAgain from "../TryAgain/TryAgain";

const ModeratorOfferContainer = props => {
  const{loadMore, isFetching, error}=props;

  useEffect(()=>{
    window.addEventListener('scroll', scrollHandler);
    return () => {
      window.removeEventListener('scroll', scrollHandler);
    }
  })

  const scrollHandler = () => {
    if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight) {
      if (!isFetching) {
        loadMore(props.children.length);
      }
    }
  };

  if (!isFetching && props.children.length === 0) return <div style={{margin: '0 auto'}}>There are no unmoderated offers</div>;
  if (error) return <TryAgain getData={props.getOffers}/>

  return <>
    {props.children}
    {isFetching && <SpinnerLoader/>}
  </>
};

ModeratorOfferContainer.propTypes = {
  loadMore:PropTypes.func.isRequired,
  isFetching:PropTypes.bool.isRequired,
  error: PropTypes.object,
};

export default ModeratorOfferContainer;