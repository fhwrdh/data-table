import React from 'react';
import {render, debugDOM} from '../../testUtils';
import {defaultFilterData, Filter} from '../Filter';

const data = [
  [{value: 0, formatted: 0}, {value: 'Arthur', formatted: 'arthur'}],
  [{value: 1, formatted: 1}, {value: 'Barbara', formatted: 'Barbara'}],
  [{value: 2, formatted: 2}, {value: 'Chris', formatted: 'Chris'}],
];

describe('defaultFilterData', () => {
  it('should return everything if filter is empty', () => {
    const filtered = defaultFilterData('', data);
    expect(filtered).toEqual(data);
  });

  it('should return rows with matching data if filter value', () => {
    const filtered = defaultFilterData('ar', data);
    expect(filtered).toEqual([data[0], data[1]]);
  });
});

describe('<Filter/>', () => {
  it('should render', () => {
    const {container} = render(<Filter />);
    expect(container).not.toBeNull();
  });
});
