import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Popover, PopoverBody } from 'reactstrap';

function MyPopover({ target, id, handleDelete }) {
  const [popoverOpen, setPopoverOpen] = useState(false);

  return (
    <>
      <div style={{ position: 'absolute', backgroundColor: 'transparent' }}>
        <Popover
          style={{ backgroundColor: 'black', borderRadius: '10px' }}
          placement='top'
          isOpen={popoverOpen}
          target={target}
          toggle={() => {
            // handleScrolling(!popoverOpen);
            setPopoverOpen(!popoverOpen);
          }}
        >
          <PopoverBody style={{ backgroundColor: 'transparent' }}>
            <Link
              to='#'
              onClick={(e) => {
                e.preventDefault();
                setPopoverOpen(!popoverOpen);
                // handleScrolling(!popoverOpen);
                if (
                  window.confirm(
                    'Você tem certeza de que deseja apagar esse investimento?'
                  )
                ) {
                  handleDelete(id);
                }
              }}
            >
              <strong
                style={{
                  fontSize: '16px',
                  lineHeight: '16px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'baseline',
                }}
              >
                <i className='tim-icons icon-trash-simple' />{' '}
                <span> Deletar</span>
              </strong>
            </Link>
          </PopoverBody>
        </Popover>
      </div>
    </>
  );
}

export default MyPopover;
