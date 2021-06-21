/*!

=========================================================
* Black Dashboard PRO React - v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-pro-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
// used for making the prop types of this component
import PropTypes from 'prop-types';

import { Button } from 'reactstrap';

import defaultImage from 'assets/img/image_placeholder.jpg';
import defaultAvatar from 'assets/img/placeholder.jpg';

const ImageUpload = (
  {
    avatar,
    addBtnColor,
    addBtnClasses,
    changeBtnColor,
    changeBtnClasses,
    removeBtnColor,
    removeBtnClasses,
  },
  ref
) => {
  const handleSubmit = () => file;
  useImperativeHandle(ref, () => ({
    handleSubmit,
  }));
  const [file, setFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(
    avatar ? defaultAvatar : defaultImage
  );
  const fileInput = useRef(null);
  const handleImageChange = (e) => {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    reader.onloadend = () => {
      setFile(file);
      setImagePreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };
  // eslint-disable-next-line

  const handleClick = () => {
    fileInput.current.click();
  };
  const handleRemove = () => {
    setFile(null);
    setImagePreviewUrl(avatar ? defaultAvatar : defaultImage);
    fileInput.current.value = null;
  };
  return (
    <div className='fileinput text-center'>
      <input type='file' onChange={handleImageChange} ref={fileInput} />
      <div className={'thumbnail' + (avatar ? ' img-circle' : '')}>
        <img src={imagePreviewUrl} alt='...' />
      </div>
      <div>
        {file === null ? (
          <Button
            color={addBtnColor}
            className={addBtnClasses}
            onClick={() => handleClick()}
          >
            {avatar ? 'Add Photo' : 'Select image'}
          </Button>
        ) : (
          <>
            <span>
              <Button
                color={changeBtnColor}
                className={changeBtnClasses}
                onClick={() => handleClick()}
              >
                Change
              </Button>
              {avatar ? <br /> : null}
              <Button
                color={removeBtnColor}
                className={removeBtnClasses}
                onClick={() => handleRemove()}
              >
                <i className='fa fa-times' /> Remove
              </Button>
            </span>
          </>
        )}
      </div>
    </div>
  );
};

ImageUpload.defaultProps = {
  avatar: false,
  removeBtnClasses: 'btn-round',
  removeBtnColor: 'danger',
  addBtnClasses: 'btn-round',
  addBtnColor: 'primary',
  changeBtnClasses: 'btn-round',
  changeBtnColor: 'primary',
};

ImageUpload.propTypes = {
  avatar: PropTypes.bool,
  removeBtnClasses: PropTypes.string,
  removeBtnColor: PropTypes.oneOf([
    'default',
    'primary',
    'secondary',
    'success',
    'info',
    'warning',
    'danger',
    'link',
  ]),
  addBtnClasses: PropTypes.string,
  addBtnColor: PropTypes.oneOf([
    'default',
    'primary',
    'secondary',
    'success',
    'info',
    'warning',
    'danger',
    'link',
  ]),
  changeBtnClasses: PropTypes.string,
  changeBtnColor: PropTypes.oneOf([
    'default',
    'primary',
    'secondary',
    'success',
    'info',
    'warning',
    'danger',
    'link',
  ]),
};

export default forwardRef(ImageUpload);
