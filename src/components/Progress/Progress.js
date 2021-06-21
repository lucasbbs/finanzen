import React from 'react';
import PropTypes from 'prop-types';
import { Progress } from 'reactstrap';

const Progressbar = ({ percentage }) => {
  return <Progress striped color='green' value={`${percentage}`}></Progress>;
};

Progress.propTypes = {
  percentage: PropTypes.number.isRequired,
};

export default Progressbar;
