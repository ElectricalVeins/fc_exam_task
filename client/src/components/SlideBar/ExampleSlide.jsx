import React from 'react';

export default function ExampleSlide (props) {
  const { src, text, className } = props;
  return (
    <div className={className}>
      <img src={src} alt='slide' />
      <p>{text}</p>
    </div>
  );
}
