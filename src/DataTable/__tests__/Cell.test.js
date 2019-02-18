import React from 'react';
import {render, debugDOM} from '../../testUtils';
import {Cell} from '../Cell';

describe('<Cell />', () => {
  const containsClass = (node, klass) => {
    return node
      .getAttribute('class')
      .split(' ')
      .includes(klass);
  };

  // simple wrapper to provide the table, etc around a cell
  const CellRenderer = ({children: cell}) => {
    return (
      <table>
        <tbody>
          <tr>{cell}</tr>
        </tbody>
      </table>
    );
  };

  it('should render formatted text based on cellData', () => {
    const cellData = {
      formatted: 'FORMATTED_CELL_DATA',
    };
    const {getByText} = render(
      <CellRenderer>
        <Cell columnData={{}} cellData={cellData} />
      </CellRenderer>,
    );
    const cellText = getByText(cellData.formatted);
    expect(cellText).toBeInTheDocument();
  });

  it('should add string type class by default', () => {
    const colData = {
      /* no 'type' defined */
    };
    const cellData = {
      formatted: 'FORMATTED_CELL_DATA',
    };
    const {getByTestId} = render(
      <CellRenderer>
        <Cell columnData={colData} cellData={cellData} />
      </CellRenderer>,
    );

    const cell = getByTestId('cell');
    expect(containsClass(cell, 'cell-string')).toBeTruthy();
  });

  it('should add type class when defined', () => {
    const colData = {
      type: 'money',
    };
    const cellData = {
      formatted: 'FORMATTED_CELL_DATA',
    };
    const {getByTestId} = render(
      <CellRenderer>
        <Cell columnData={colData} cellData={cellData} />
      </CellRenderer>,
    );

    const cell = getByTestId('cell');
    expect(containsClass(cell, 'cell-money')).toBeTruthy();
  });

  it('should add align class when defined', () => {
    const colData = {
      align: 'center',
    };
    const cellData = {
      formatted: 'FORMATTED_CELL_DATA',
    };
    const {getByTestId} = render(
      <CellRenderer>
        <Cell columnData={colData} cellData={cellData} />
      </CellRenderer>,
    );

    const cell = getByTestId('cell');
    expect(containsClass(cell, 'cell-align-center')).toBeTruthy();
  });

  it('should add ellipsis class when defined', () => {
    const colData = {
      ellipsis: true,
    };
    const cellData = {
      formatted: 'FORMATTED_CELL_DATA',
    };
    const {getByTestId} = render(
      <CellRenderer>
        <Cell columnData={colData} cellData={cellData} />
      </CellRenderer>,
    );

    const cell = getByTestId('cell');
    expect(containsClass(cell, 'cell-ellipsis')).toBeTruthy();
  });

  it('should add nowrap class when defined', () => {
    const colData = {
      noWrap: true,
    };
    const cellData = {
      formatted: 'FORMATTED_CELL_DATA',
    };
    const {getByTestId} = render(
      <CellRenderer>
        <Cell columnData={colData} cellData={cellData} />
      </CellRenderer>,
    );

    const cell = getByTestId('cell');
    expect(containsClass(cell, 'cell-nowrap')).toBeTruthy();
  });
});
