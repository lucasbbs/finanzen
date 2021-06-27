import React from 'react';
import { useEffect } from 'react';
import { Table } from 'reactstrap';
import RowSalary from './RowSalary';

const TableSalaries = () => {
  useEffect(() => {}, []);
  return (
    <Table>
      <tbody>
        <RowSalary />
      </tbody>
    </Table>
  );
};

export default TableSalaries;
