import React from 'react';
import * as R from 'ramda';
import './App.css';
import {DataTable} from './DataTable';
import {makeRandomData} from './data';
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
  {label: 'Row', type: 'string', align: 'center'},
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
  {label: 'Row', type: 'number', align: 'center'},
  {
    label: 'First Name (second letter)',
    sort: i => d => d[i].value[1],
    format: d => <SecondLetterBold data={d} />,
  },
  {
    label: 'Last Name (last letter)',
    sort: i => d => R.last(d[i].value),
    format: d => <LastLetterBold data={d} />,
  },
  {
    label: 'Rank (reversed)',
    type: 'number',
    sort: i => d => reverseInt(d[i].value),
    format: d => `${d} (${reverse(d)})`,
  },
  {
    label: 'Balance (cents)',
    type: 'money',
    sort: i => data => (data[i].value % 1).toFixed(2),
    format: d => <Money data={d} />,
  },
  {
    label: 'Date (month)',
    type: 'date',
    sort: i => data => getMonthName(data[i].value),
    format: getMonthName,
  },
];

const data = [
  [0, 'Arthur', 'Ashe', 12, 12.34, now()],
  [1, 'Barbara', 'Bosell', 34, -56.78, now()],
  [2, 'Chris', 'Canoza', 56, 901.23, now()],
  [3, 'Doug', 'Dangger', 78, 45.67, now()],
  [4, 'Elliot', 'Erwitt', 90, -89.01, now()],
  [5, 'Fanny', 'Flagg', 1, 234.56, now()],
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
      <p>TODO</p>
      <ul>
        <li>active sort indicator</li>
      </ul>
    </div>
    <div className="example">
      <DataTable
        caption="Custom Sorting, Custom Rendering"
        columns={customRenderSortColumns}
        data={data}
        sortable
      />
    </div>
    <div className="example">
      <DataTable
        caption="Basic Global Filtering"
        columns={columns}
        data={data}
        filterable
      />
      <p>TODO</p>
      <ul>
        <li>initial filter value</li>
        <li>filter per column</li>
        <li>regex option (toggleable)</li>
        <li>highlight match (toggle-able?)</li>
        <li>column-level opt-out from global filtering (row num)</li>
      </ul>
    </div>
    <div className="example">
      <DataTable
        caption="Basic Paging"
        columns={columns}
        data={makeRandomData(54)}
        pageable
      />
    </div>
    <div className="example">
      <DataTable
        caption="Kitchen Sink: filtering, sorting, paging"
        columns={columns}
        data={makeRandomData(154)}
        pageable
        filterable
        sortable
      />
    </div>
  </div>
);
