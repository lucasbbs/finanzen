import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import Config from '../../config.json';

const ModalIconPicker = ({ modalIcons, setModalIcons, setIcon, setIconId }) => {
  const [icons, setIcons] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const getIcons = async () => {
      const iconsFromAPI = await axios.get(
        `${Config.SERVER_ADDRESS}/api/icons`
      );
      setIcons(iconsFromAPI.data);
      setCategories([
        ...new Set([
          ...iconsFromAPI.data.map((icon) => icon.iconcategories.name),
        ]),
      ]);
    };
    getIcons();
  }, []);
  const toggleModalIcons = () => setModalIcons(!modalIcons);
  const closeBtn = (
    <button color='danger' className='close' onClick={toggleModalIcons}>
      <span style={{ color: 'white' }}>×</span>
    </button>
  );
  return (
    <Modal
      scrollable={true}
      modalClassName='modal-black'
      style={{
        position: 'fixed',
        left: '50%',
        top: '40%',
        maxHeight: '600px',
        minWidth: '700px',
        background: 'linear-gradient(180deg,#222a42 0,#1d253b)!important',
        transform: 'translate(-50%, -50%)',
      }}
      isOpen={modalIcons}
      toggle={toggleModalIcons}
      className='modal-lg'
    >
      <ModalHeader
        style={{ color: 'hsla(0,0%,100%,.8)' }}
        toggle={toggleModalIcons}
        close={closeBtn}
      >
        Pick an Icon
      </ModalHeader>
      <ModalBody>
        {categories.map((category) => (
          <div key={category}>
            <h6>{category}</h6>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(8, 1fr)',
                gridRowGap: '6px',
              }}
            >
              {icons
                .filter((icon) => icon.iconcategories.name === category)
                .map((icon) => (
                  <Button
                    key={icon.Number}
                    id={icon.Number}
                    className={'btn-icon btn-link anotherClassNameForButtons'}
                    style={{
                      width: 'fit-content',
                      padding: '10px',
                      minHeight: '60px',
                      minWidth: '60px',
                      background: 'black',
                    }}
                    onClick={(e) => {
                      setIcon(Number(e.target.id));
                      setIconId(
                        icons.find(
                          (icon) => icon.Number === Number(e.target.id)
                        )._id
                      );
                      toggleModalIcons();
                    }}
                  >
                    <span
                      className='mx-auto'
                      style={{
                        height: '40px',
                        lineHeight: 'auto',
                        fontSize: '40px',
                        width: 'fit-content',
                      }}
                    >
                      <div className='row align-items-center'>
                        <i
                          id={icon.Number}
                          // style={{ display: 'inline-block' }}
                          className={`icomoon-${icon.Number}`}
                        />
                      </div>
                    </span>
                  </Button>
                ))}
            </div>
          </div>
        ))}
      </ModalBody>
      <ModalFooter></ModalFooter>
    </Modal>
  );
};

export default ModalIconPicker;
