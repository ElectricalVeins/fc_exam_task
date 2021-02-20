import React from 'react';

export default function MainSlide (props) {
  const { src, className } = props;
  return <img src={src} alt='slide' className={className} />;
}
