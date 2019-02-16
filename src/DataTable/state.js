import * as R from 'ramda';
import {createActions, handleActions} from 'redux-actions';
const mapIndex = R.addIndex(R.map);

export const resetFilterData = filterFunc => ({
  filter: '',
  filterFunc,
});

export const resetSortData = () => ({
  direction: '',
  colIndex: undefined,
  column: undefined,
  sortMap: {
    asc: R.ascend,
    desc: R.descend,
  },
});

export const resetPageData = (
  currentPage,
  pageSize,
  pageSizeOptions,
  data = [],
) => ({
  currentPage,
  pageSize,
  totalPages: Math.ceil(data.length / pageSize),
  pageSizeOptions,
});

const defaultFormatters = {
  money: d => d,
  number: d => d,
  date: data => data.toLocaleString('en-US'),
  string: data => data.toString(),
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

const sortView = (direction, columnData, colIndex, view) => {
  if (!columnData) return view;
  const comparator = columnData.sort
    ? columnData.sort(colIndex)
    : R.path([colIndex, 'value']);
  return R.sort(direction(comparator), view);
};

const filterWith = filterData => data => {
  return filterData.filterFunc(filterData.filter, data);
};

const sortWith = sortData => data =>
  sortView(
    sortData.sortMap[sortData.direction],
    sortData.column,
    sortData.colIndex,
    data,
  );

const pageWith = pageData => data => {
  const begin = (pageData.currentPage - 1) * pageData.pageSize;
  const end = begin + pageData.pageSize;
  return R.slice(begin, end)(data);
};

const calcDataView = (filteredData, sortData, pageData) =>
  R.pipe(
    sortWith(sortData),
    pageWith(pageData),
  )(filteredData);

export const actions = createActions({
  data: {
    set: undefined,
  },
  sort: (direction, colIndex) => ({direction, colIndex}),
  filter: {
    set: undefined,
  },
  paging: {
    pageSize: {
      set: undefined,
    },
    currentPage: {
      set: undefined,
    },
  },
});

const DEBUG = false;
const debug = f => (...args) => {
  DEBUG && console.log('DEBUG: ', args[1]);
  return f.apply(null, args);
};

export const reducer = handleActions(
  {
    //
    // page based on the filtered data
    //
    [actions.paging.pageSize.set]: debug((state, {payload}) => {
      const newTotalPages = Math.ceil(state.filteredData.length / payload);
      const newPageData = {
        ...state.pageData,
        pageSize: Number(payload),
        totalPages: newTotalPages,
        currentPage: 1,
      };
      return {
        ...state,
        pageData: newPageData,
        dataView: calcDataView(state.filteredData, state.sortData, newPageData),
      };
    }),
    [actions.paging.currentPage.set]: debug((state, {payload}) => ({
      ...state,
      pageData: {
        ...state.pageData,
        currentPage: payload,
      },
      dataView: calcDataView(state.filteredData, state.sortData, {
        ...state.pageData,
        currentPage: payload,
      }),
    })),
    //
    // filter the whole (formatted) data set
    // filtering resets the currentPage to 1 and recalcs the total pages
    //
    [actions.filter.set]: debug((state, {payload}) => {
      const filtered = filterWith({...state.filterData, filter: payload})(
        state.formattedData,
      );

      const freshPageData = state.resetPageData(
        1, // back to the first page
        state.pageData.pageSize,
        state.pageData.pageSizeOptions,
        filtered,
      );
      return {
        ...state,
        filterData: {
          ...state.filterData,
          filter: payload,
        },
        pageData: freshPageData,
        filteredData: filtered,
        filteredCount: filtered.length,
        dataView: calcDataView(filtered, state.sortData, freshPageData),
      };
    }),
    //
    // sort the filtered data
    //
    [actions.sort]: debug((state, {payload}) => {
      const {colIndex} = payload;
      const newSortData = {
        ...state.sortData,
        ...payload,
        column: state.columns[colIndex],
      };
      return {
        ...state,
        sortData: newSortData,
        dataView: calcDataView(state.filteredData, newSortData, state.pageData),
      };
    }),
    //
    // reset filter, sort, paging when new data shows up
    //
    [actions.data.set]: debug((state, {payload: data}) => {
      const formatted = formatData(state.columns, data);
      const freshFilterData = state.resetFilterData(
        state.filterData.filterFunc,
      );
      const freshPageData = state.resetPageData(
        1,
        state.pageData.pageSize,
        state.pageData.pageSizeOptions,
        formatted,
      );
      const freshSortData = state.resetSortData();

      return {
        ...state,
        rawData: data,

        formattedData: formatted,
        totalCount: formatted.length,

        filteredData: formatted,
        filteredCount: formatted.length,

        filterData: freshFilterData,
        sortData: freshSortData,
        pageData: freshPageData,
        dataView: calcDataView(formatted, freshSortData, freshPageData),
      };
    }),
  },
  {},
);
