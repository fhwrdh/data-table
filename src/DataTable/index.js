import React, {useState} from 'react';
import * as R from 'ramda';
import './data-table.css';
import * as Icons from './icons';

const mapIndex = R.addIndex(R.map);

const Sorter = ({onAscClick, onDescClick}) => {
  return (
    <div className="sorter">
      <span className="sorter-asc" onClick={onAscClick}>
        <Icons.Asc />
      </span>
      <span className="sorter-desc" onClick={onDescClick}>
        <Icons.Desc />
      </span>
    </div>
  );
};

const Row = ({rowData, columnData}) => {
  return (
    <tr>
      {mapIndex((cellData, i) => (
        <Cell key={i} cellData={cellData} columnData={columnData[i]} />
      ))(rowData)}
    </tr>
  );
};

const defaultFormatters = {
  money: d => d,
  number: d => d,
  date: data => data.toLocaleString('en-US'),
  string: data => data.toString(),
};

const HeaderCell = ({columnData, sortable, onAsc, onDesc}) => {
  const type = columnData.type || 'string';
  return (
    <th className={`cell-${type}`}>
      <div className={`header-cell-wrapper cell-${type}`}>
        <span className="header-cell-label">{columnData.label}</span>
        {sortable && <Sorter onAscClick={onAsc} onDescClick={onDesc} />}
      </div>
    </th>
  );
};

const Cell = ({cellData, columnData}) => {
  const type = columnData.type || 'string';
  const formatter = columnData.format || defaultFormatters[type];
  return <td className={`cell-${type}`}>{formatter(cellData)}</td>;
};

const handleSort = direction => setter => (columnIndex, data, columnData) => {
  const comparator = columnData.sort
    ? columnData.sort(columnIndex)
    : R.prop(columnIndex);
  const newDataView = R.sort(direction(comparator), data);
  setter(newDataView);
};

export const DataTable = ({
  caption = 'table caption required',
  columns,
  data,
  sortable = false,
}) => {
  const [dataView, setDataView] = useState(data);
  const handleAscSort = handleSort(R.ascend)(setDataView);
  const handleDescSort = handleSort(R.descend)(setDataView);
  return (
    <table className="debugOFF">
      <caption>{caption}</caption>
      <thead>
        <tr>
          {mapIndex((c, i) => (
            <HeaderCell
              key={i}
              sortable={sortable}
              onAsc={() => handleAscSort(i, data, columns[i])}
              onDesc={() => handleDescSort(i, data, columns[i])}
              columnData={columns[i]}
            />
          ))(columns)}
        </tr>
      </thead>
      <tbody>
        {mapIndex((r, i) => <Row key={i} rowData={r} columnData={columns} />)(
          dataView,
        )}
      </tbody>
    </table>
  );
};
