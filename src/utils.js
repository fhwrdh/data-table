import React from 'react';

export const now = () => {
  return new Date(Date.now() - Math.round(Math.random() * Date.now()));
};

export const getMonthName = date =>
  date.toLocaleString('en-US', {month: 'long'});

export const Money = ({data}) => (
  <span style={{color: data < 0 ? 'red' : 'inherit'}}>${Math.abs(data)}</span>
);

export const SecondLetterBold = ({data}) => {
  const [_, first, second, rest] = data.match(/^(.)(.)(.*)/);
  return (
    <div>
      {first}
      <span style={{fontWeight: 600, borderBottom: '1px solid black'}}>
        {second}
      </span>
      {rest}
    </div>
  );
};

export const LastLetterBold = ({data}) => {
  const [_, rest, last] = data.match(/(.+)(.)$/);
  return (
    <div>
      {rest}
      <span style={{fontWeight: 600, borderBottom: '1px solid black'}}>
        {last}
      </span>
    </div>
  );
};

export const reverse = val =>
  val
    .toString()
    .split('')
    .reverse()
    .join('');

export const reverseInt = val => parseInt(reverse(val));
