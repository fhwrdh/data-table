import React from 'react';
import * as R from 'ramda';
import './data-table.css';
const mapIndex = R.addIndex(R.map);

const Column = ({columnData}) => {
  return <th>{columnData.label}</th>;
};

const Row = ({rowData}) => {
  return (
    <tr>
      {mapIndex((cellData, i) => <Cell key={i} cellData={cellData} />)(rowData)}
    </tr>
  );
};

const Cell = ({cellData}) => {
  return <td>{cellData}</td>;
};

export const DataTable = ({
  columns,
  data,
  caption = 'table caption required',
}) => {
  return (
    <div>
      <table>
        <caption>{caption}</caption>
        <thead>
          <tr>
            {mapIndex((c, i) => <Column key={i} columnData={c} />)(columns)}
          </tr>
        </thead>
        <tbody>
          {mapIndex((r, i) => (
            <Row key={i} rowData={r} columnData={columns[i]} />
          ))(data)}
        </tbody>
      </table>
    </div>
  );
};
