import React from 'react';

export default function FeedbackSlide (props) {
  const { src, feedback, name, className } = props;

  return (
    <div className={className}>
      <img src={src} alt='slide' />
      <p>{feedback}</p>
      <span>{name}</span>
    </div>
  );
}
