import React from 'react';
import './App.css';
import {DataTable} from './DataTable';

const columns = [
  {label: 'First Name'},
  {label: 'Last Name'},
  {label: 'Rank', type: 'number'},
  {label: 'Balance', type: 'money'},
];
const data = [
  ['Arthur', 'Ashe', 12, 12.34],
  ['Billy', 'Button', 34, 56.78],
  ['Cathy', 'Crazy', 56, 901.23],
];

export default () => (
  <div className="App">
    <div className="example">
      <DataTable caption="Simple" columns={columns} data={data} />
    </div>
    <div>
      <div className="example">
        <DataTable caption="Default Sorting" columns={columns} data={data} />
      </div>
    </div>
    <div>
      <div className="example">
        <DataTable caption="Default Fitering" columns={columns} data={data} />
      </div>
    </div>
    <div>
      <div className="example">
        <div className="title">Custom Sorting</div>
      </div>
    </div>
    <div>
      <div className="example">
        <div className="title">Filtering</div>
      </div>
    </div>
  </div>
);
