import React from 'react';
import * as R from 'ramda';
import './App.css';
import {DataTable} from './DataTable';
import {
  now,
  getMonthName,
  SecondLetterBold,
  LastLetterBold,
  Money,
  reverse,
  reverseInt,
} from './utils';

const columns = [
  {label: 'First Name'},
  {label: 'Last Name'},
  {label: 'Rank', type: 'number'},
  {
    label: 'Balance',
    type: 'money',
  },
  {
    label: 'Date',
    type: 'date',
  },
];

const customRenderSortColumns = [
  {
    label: 'First Name (second letter)',
    sort: i => d => d[i][1],
    format: d => <SecondLetterBold data={d} />,
  },
  {
    label: 'Last Name (last letter)',
    sort: i => d => R.last(d[i]),
    format: d => <LastLetterBold data={d} />,
  },
  {
    label: 'Rank (reversed)',
    type: 'number',
    sort: i => d => reverseInt(d[i]),
    format: d => `${d} (${reverse(d)})`,
  },
  {
    label: 'Balance (cents)',
    type: 'money',
    sort: i => data => (data[i] % 1).toFixed(2),
    format: d => <Money data={d} />,
  },
  {
    label: 'Date (month)',
    type: 'date',
    sort: i => data => getMonthName(data[i]),
    format: getMonthName,
  },
];

const data = [
  ['Arthur', 'Ashe', 12, 12.34, now()],
  ['Barbara', 'Bosell', 34, -56.78, now()],
  ['Chris', 'Canoza', 56, 901.23, now()],
  ['Doug', 'Dangger', 78, 45.67, now()],
  ['Elliot', 'Erwitt', 90, -89.01, now()],
  ['Fanny', 'Flagg', 1, 234.56, now()],
];

export default () => (
  <div className="App">
    <div className="example">
      <DataTable
        caption="Simple: no sorting, filtering, paging"
        columns={columns}
        data={data}
      />
    </div>
    <div className="example">
      <DataTable
        caption="Default Sorting"
        sortable
        columns={columns}
        data={data}
      />
    </div>
    <div className="example">
      <DataTable
        caption="Custom Sorting, Custom Rendering"
        sortable
        columns={customRenderSortColumns}
        data={data}
      />
    </div>
    <div className="example">
      <div className="title">Default Filtering</div>
    </div>
    <div className="example">
      <div className="title">Custom Filtering</div>
    </div>
    <div className="example">
      <div className="title">With Paging</div>
    </div>
  </div>
);
