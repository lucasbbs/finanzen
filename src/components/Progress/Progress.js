import React from 'react';
import { Progress } from 'reactstrap';

const Progressbar = ({ percentage }) => {
  return (
    <div className='progress-container' style={{ height: '20px' }}>
      <Progress
        striped
        color='green'
        style={{ height: '20px' }}
        value={`${percentage}`}
      >
        <span style={{ fontSize: '16px' }}>{`${percentage}%`}</span>
      </Progress>
    </div>
  );
};

// Progress.propTypes = {
//   percentage: PropTypes.number.isRequired,
// };

export default Progressbar;
