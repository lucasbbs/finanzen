import React from 'react';
import { useParams } from 'react-router-dom';
import { Nav, Pagination, PaginationItem, PaginationLink } from 'reactstrap';

const PaginationUI = ({
  incomesPerPage,
  totalIncomes,
  paginate,
  currentPageNumber,
}) => {
  const { id } = useParams();

  const incomeNumbers = [];

  for (let i = 1; i <= Math.ceil(totalIncomes / incomesPerPage); i++) {
    incomeNumbers.push(i);
  }
  return (
    <Nav>
      <Pagination
        className='pagination '
        // listClassName='pagination-warning'
        // size='lg'
        aria-label='Page navigation example'
      >
        <PaginationItem>
          <PaginationLink
            first
            to='#'
            onClick={() => paginate(1)}
          ></PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            previous
            to='#'
            onClick={() => paginate(Math.max(currentPageNumber - 1, 1))}
          />
        </PaginationItem>
        {currentPageNumber >= 3 ? (
          <PaginationItem>
            <PaginationLink style={{ cursor: 'inherit' }}>
              <i className='fas fa-ellipsis-h'></i>
            </PaginationLink>
          </PaginationItem>
        ) : (
          ''
        )}

        {incomeNumbers
          .filter((number) => Math.abs(number - currentPageNumber) <= 1)
          .map((number) => (
            <PaginationItem
              key={number}
              className='page-item'
              active={currentPageNumber === number ? true : false}
            >
              <PaginationLink
                // className='page-link'
                onClick={() => paginate(number)}
                to={`/app/investment/${id}/${number}#`}
              >
                {number}
              </PaginationLink>
            </PaginationItem>
          ))}
        {Math.ceil(totalIncomes / incomesPerPage) - currentPageNumber >= 2 ? (
          <PaginationItem>
            <PaginationLink style={{ cursor: 'inherit' }}>
              <i className='fas fa-ellipsis-h'></i>
            </PaginationLink>
          </PaginationItem>
        ) : (
          ''
        )}
        <PaginationItem>
          <PaginationLink
            next
            to='#'
            onClick={() =>
              paginate(
                Math.min(
                  currentPageNumber + 1,
                  incomeNumbers[incomeNumbers.length - 1]
                )
              )
            }
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            last
            to='#'
            onClick={() => paginate(incomeNumbers[incomeNumbers.length - 1])}
          />
        </PaginationItem>
      </Pagination>
    </Nav>
  );
};

export default PaginationUI;
