import React from 'react';
import * as R from 'ramda';
import {Cell} from './Cell';
const mapIndex = R.addIndex(R.map);

export const Row = ({rowData, columnData}) => (
  <tr>
    {mapIndex((cellData, i) => (
      <Cell key={i} cellData={cellData} columnData={columnData[i]} />
    ))(rowData)}
  </tr>
);
