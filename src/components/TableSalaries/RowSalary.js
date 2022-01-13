import React from 'react';
import {
  Button,
  FormGroup,
  Input,
  Label,
  UncontrolledTooltip,
} from 'reactstrap';
import moment from 'moment';
import { currencyFormat } from 'helpers/functions';

const RowSalary = ({
  salary,
  setUpdatedSalaries,
  currency,
  toggleModal,
  setSalaryFromRow,
  setId,
}) => {
  return (
    <tr className='rows'>
      <td>
        <FormGroup check>
          <Label check>
            <Input
              id={salary._id}
              defaultValue=''
              type='checkbox'
              onChange={(e) => {
                setUpdatedSalaries(salary, e.target.id);
              }}
            />
            <span className='form-check-sign'>
              <span className='check' />
            </span>
          </Label>
        </FormGroup>
      </td>
      <td>
        <p className='title py-0 my-0'>{`Salary of ${currencyFormat(
          salary.salary,
          currency
        )} from ${moment(salary.month, 'YYYY-MM').format('MMMM/yyyy')}`}</p>
      </td>
      <td className='td-actions text-right'>
        <Button
          color='link'
          id='tooltip155151810'
          title=''
          type='button'
          onClick={(e) => {
            setSalaryFromRow(salary);
            toggleModal();
          }}
        >
          <i className='tim-icons icon-pencil' />
        </Button>
        <UncontrolledTooltip
          delay={0}
          placement='left'
          target='tooltip155151810'
        >
          Edit Salary
        </UncontrolledTooltip>
      </td>
    </tr>
  );
};

export default RowSalary;
