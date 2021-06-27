import React from 'react';
import {
  Button,
  FormGroup,
  Input,
  Label,
  UncontrolledTooltip,
} from 'reactstrap';

const RowSalary = ({ salary }) => {
  return (
    <tr className='rows'>
      <td>
        <FormGroup check>
          <Label check>
            <Input defaultValue='' type='checkbox' />
            <span className='form-check-sign'>
              <span className='check' />
            </span>
          </Label>
        </FormGroup>
      </td>
      <td>
        <p className='title py-0 my-0'>Salary from june/2021</p>
        {/* <p className='text-muted'>
    The GDPR is a regulation that requires
    businesses to protect the personal data and
    privacy of Europe citizens for transactions that
    occur within EU member states.
  </p> */}
      </td>
      <td className='td-actions text-right'>
        <Button color='link' id='tooltip155151810' title='' type='button'>
          <i className='tim-icons icon-pencil' />
        </Button>
        <UncontrolledTooltip
          delay={0}
          placement='left'
          target='tooltip155151810'
        >
          Edit Task
        </UncontrolledTooltip>
      </td>
    </tr>
  );
};

export default RowSalary;
