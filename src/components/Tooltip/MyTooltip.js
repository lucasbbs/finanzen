import { useState } from 'react';
import { Tooltip } from 'reactstrap';

function MyTooltip({ placement, target, children }) {
  const [tooltipOpen, setTooltipOpen] = useState(false);

  return (
    <Tooltip
      className='in'
      placement={placement}
      isOpen={tooltipOpen}
      target={target}
      toggle={() => setTooltipOpen(!tooltipOpen)}
    >
      {children}
    </Tooltip>
  );
}

export default MyTooltip;
