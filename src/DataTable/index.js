import React, {useState} from 'react';
import * as R from 'ramda';
import './data-table.css';
import {Filter} from './Filter';
import {Sorter} from './Sorter';

const mapIndex = R.addIndex(R.map);

const HeaderCell = ({columnData, sortable, onAsc, onDesc}) => {
  const type = columnData.type || 'string';
  const alignment = columnData.align ? ` cell-align-${columnData.align}` : '';
  return (
    <th className={`cell-${type}`}>
      <div className={`header-cell-wrapper cell-${type} ${alignment}`}>
        <span className="header-cell-label">{columnData.label}</span>
        {sortable && <Sorter onAscClick={onAsc} onDescClick={onDesc} />}
      </div>
    </th>
  );
};

const Row = ({rowData, columnData}) => (
  <tr>
    {mapIndex((cellData, i) => (
      <Cell key={i} cellData={cellData} columnData={columnData[i]} />
    ))(rowData)}
  </tr>
);

const Cell = ({cellData, columnData}) => {
  const type = columnData.type || 'string';
  const alignment = columnData.align ? ` cell-align-${columnData.align}` : '';
  return <td className={`cell-${type}${alignment}`}>{cellData.formatted}</td>;
};

const defaultFormatters = {
  money: d => d,
  number: d => d,
  date: data => data.toLocaleString('en-US'),
  string: data => data.toString(),
};

const handleSort = direction => setter => (columnIndex, data, columnData) => {
  const comparator = columnData.sort
    ? columnData.sort(columnIndex)
    : R.path([columnIndex, 'value']);
  const newDataView = R.sort(direction(comparator), data);
  setter(newDataView);
};

const formatData = (columns, data) => {
  const formatters = R.map(
    c => c.format || defaultFormatters[c.type || 'string'],
  )(columns);
  return mapIndex(
    mapIndex((value, i) => ({
      value,
      formatted: formatters[i](value),
    })),
  )(data);
};

const filterData = (filterVal, dv) =>
  R.filter(row =>
    R.gt(
      R.length(
        R.filter(
          val =>
            R.toLower(val.formatted.toString()).includes(R.toLower(filterVal)),
          row,
        ),
      ),
      0,
    ),
  )(dv);

export const DataTable = ({
  caption = 'table caption required',
  columns,
  data,
  sortable = false,
  filterable = false,
  filterFunc = filterData,
  pageable = false,
}) => {
  // sort based on the raw data, sorting function
  // filter based on the formatted data
  const formattedData = formatData(columns, data);
  const [dataView, setDataView] = useState(formattedData);
  const [filterValue, setFilterValue] = useState('');

  const handleAscSort = handleSort(R.ascend)(setDataView);
  const handleDescSort = handleSort(R.descend)(setDataView);

  const filterRow = filterable ? (
    <tr className="filter-row">
      <th>
        <Filter
          onChange={filterVal => {
            setFilterValue(filterVal);
            setDataView(filterFunc(filterVal, formattedData));
          }}
          value={filterValue}
        />
      </th>
    </tr>
  ) : null;

  return (
    <table className="">
      <caption>{caption}</caption>
      <thead>
        {filterRow}
        <tr className="header-row">
          {mapIndex((c, i) => (
            <HeaderCell
              key={i}
              sortable={sortable}
              onAsc={() => handleAscSort(i, dataView, columns[i])}
              onDesc={() => handleDescSort(i, dataView, columns[i])}
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
