import React from 'react';
import Flickity from 'react-flickity-component';
import MainSlide from './MainSlide';
import ExampleSlide from './ExampleSlide';
import FeedbackSlide from './FeedbackSlide';
import carouselConstants from '../../carouselConstants';
import styles from './SlideBar.module.sass';
import './flickity.css';

const carouselStyles = {
  [carouselConstants.MAIN_SLIDER]: styles.mainCarousel,
  [carouselConstants.EXAMPLE_SLIDER]: styles.exampleCarousel,
  [carouselConstants.FEEDBACK_SLIDER]: styles.feedbackCarousel,
};

const carouselRenders = {
  [carouselConstants.MAIN_SLIDER]: ([key, value]) => (
    <MainSlide key={key} src={value} className={styles['carousel-cell']} />
  ),
  [carouselConstants.EXAMPLE_SLIDER]: ([key, value], index) => (
    <ExampleSlide
      key={key}
      className={styles['example-cell']}
      src={value}
      text={carouselConstants.EXAMPLE_SLIDER_TEXT[index]}
    />
  ),
  [carouselConstants.FEEDBACK_SLIDER]: (_, index) => (
    <FeedbackSlide
      key={index}
      className={styles['feedback-cell']}
      src={carouselConstants.feedbackSliderImages[index]}
      feedback={carouselConstants.FEEDBACK_SLIDER_TEXT[index].feedback}
      name={carouselConstants.FEEDBACK_SLIDER_TEXT[index].name}
    />
  ),
};

const SliderBar = props => {
  const { carouselType, images } = props;

  const options = {
    draggable: true,
    wrapAround: true,
    pageDots: false,
    prevNextButtons: true,
    autoPlay: true,
    groupCells: true,
    lazyLoad: true,
  };

  const renderSlides = () =>
    Object.entries(images).map(carouselRenders[carouselType]);

  return (
    <Flickity
      className={carouselStyles[carouselType]}
      elementType='div'
      options={options}
    >
      {renderSlides()}
    </Flickity>
  );
};

export default SliderBar;
