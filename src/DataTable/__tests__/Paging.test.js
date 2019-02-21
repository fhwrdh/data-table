import React from 'react';
import {fireEvent, render, debugDOM, waitForElement} from '../../testUtils';
import {Paging} from '../Paging';

describe('<Paging />', () => {
  it('should render all page size options', async () => {
    const props = {
      pageData: {
        pageSize: 5,
        currentPage: 1,
        totalPages: 10,
        pageSizeOptions: [1, 5, 10, 25],
      },
      onPageSizeChange: jest.fn(),
      onSetCurrentPage: jest.fn(),
      filteredCount: 1,
      totalCount: 2,
    };
    const {container, getByText} = render(<Paging {...props} />);
    // debugDOM(container);
    await waitForElement(() =>
      getByText(`${props.pageData.pageSize} per page`),
    );

    fireEvent.focus(container.querySelector('.paging-select input'));
    fireEvent.mouseDown(container.querySelector('.paging-select__control'));
    await waitForElement(() => getByText('1 per page'));
    await waitForElement(() => getByText('5 per page'));
    await waitForElement(() => getByText('10 per page'));
    await waitForElement(() => getByText('25 per page'));
  });

  it('should call onPageSizeChange when page size changed', async () => {
    const props = {
      pageData: {
        pageSize: 5,
        currentPage: 1,
        totalPages: 10,
        pageSizeOptions: [1, 5, 10, 25],
      },
      onPageSizeChange: jest.fn(),
      onSetCurrentPage: jest.fn(),
      filteredCount: 1,
      totalCount: 2,
    };
    const {container, getByText} = render(<Paging {...props} />);
    // debugDOM(container);
    await waitForElement(() =>
      getByText(`${props.pageData.pageSize} per page`),
    );

    fireEvent.focus(container.querySelector('.paging-select input'));
    fireEvent.mouseDown(container.querySelector('.paging-select__control'));
    await waitForElement(() => getByText('1 per page'));
    fireEvent.click(getByText('1 per page'));
    expect(props.onPageSizeChange).toHaveBeenCalled();
  });

  it('should render current page number and total pages', () => {
    const props = {
      pageData: {
        pageSize: 5,
        currentPage: 1,
        totalPages: 10,
        pageSizeOptions: [1, 5, 10, 25],
      },
      onPageSizeChange: jest.fn(),
      onSetCurrentPage: jest.fn(),
      filteredCount: 1,
      totalCount: 2,
    };
    const {getByTestId} = render(<Paging {...props} />);
    expect(getByTestId('paging-page')).toHaveTextContent(/^1 \/ 10$/);
  });

  it('should disble previous when on page 1', () => {
    const props = {
      pageData: {
        pageSize: 5,
        currentPage: 1,
        totalPages: 10,
        pageSizeOptions: [1, 5, 10, 25],
      },
      onPageSizeChange: jest.fn(),
      onSetCurrentPage: jest.fn(),
      filteredCount: 1,
      totalCount: 2,
    };
    const {getByTestId} = render(<Paging {...props} />);
    expect(getByTestId('paging-prev-button')).toHaveAttribute('disabled');
  });

  it('should disable next when on last page', () => {
    const props = {
      pageData: {
        pageSize: 5,
        currentPage: 10,
        totalPages: 10,
        pageSizeOptions: [1, 5, 10, 25],
      },
      onPageSizeChange: jest.fn(),
      onSetCurrentPage: jest.fn(),
      filteredCount: 1,
      totalCount: 2,
    };
    const {getByTestId} = render(<Paging {...props} />);
    expect(getByTestId('paging-next-button')).toHaveAttribute('disabled');
  });

  it('should call setCurrentPage when previous button clicked', () => {
    const props = {
      pageData: {
        pageSize: 5,
        currentPage: 2,
        totalPages: 10,
        pageSizeOptions: [1, 5, 10, 25],
      },
      onPageSizeChange: jest.fn(),
      onSetCurrentPage: jest.fn(),
      filteredCount: 1,
      totalCount: 2,
    };
    const {getByTestId} = render(<Paging {...props} />);
    fireEvent.click(getByTestId('paging-prev-button'));
    expect(props.onSetCurrentPage).toHaveBeenCalledWith(
      props.pageData.currentPage - 1,
    );
  });

  it('should call setCurrentPage when next button clicked', () => {
    const props = {
      pageData: {
        pageSize: 5,
        currentPage: 2,
        totalPages: 10,
        pageSizeOptions: [1, 5, 10, 25],
      },
      onPageSizeChange: jest.fn(),
      onSetCurrentPage: jest.fn(),
      filteredCount: 1,
      totalCount: 2,
    };
    const {getByTestId} = render(<Paging {...props} />);
    fireEvent.click(getByTestId('paging-next-button'));
    expect(props.onSetCurrentPage).toHaveBeenCalledWith(
      props.pageData.currentPage + 1,
    );
  });
});
