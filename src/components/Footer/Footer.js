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
/*eslint-disable*/
import React, { useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardText,
  Container,
  Modal,
  ModalBody,
  ModalFooter,
  Row,
} from 'reactstrap';
// used for making the prop types of this component
import PropTypes from 'prop-types';
import { Link, useHistory } from 'react-router-dom';
const Footer = (props) => {
  const [modal, setModal] = useState(false);

  const toggle = () => {
    setModal(!modal);
  };
  let history = useHistory();
  window.addEventListener('storage', () => {
    if (!JSON.parse(window.localStorage.getItem('userInfo'))) {
      history.push('/app/dashboard');
    }
  });
  return (
    <>
      <footer className={'footer' + (props.default ? ' footer-default' : '')}>
        <Container fluid={props.fluid ? true : false}>
          {/* <ul className='nav'>
          <li className='nav-item'>
            <a className='nav-link' href='https://www.creative-tim.com'>
              Creative Tim
            </a>
          </li>
          <li className='nav-item'>
            <a
              className='nav-link'
              href='https://www.creative-tim.com/presentation'
            >
              About us
            </a>
          </li>
          <li className='nav-item'>
            <a className='nav-link' href='https://blog.creative-tim.com'>
              Blog
            </a>
          </li> */}
          {/* </ul> */}
          <div className='copyright'>
            © {new Date().getFullYear()} made with{' '}
            <i className='tim-icons icon-heart-2' /> by{' '}
            <Link
              to='#'
              onClick={(e) => {
                e.preventDefault();
                toggle();
              }}
            >
              lucasbbs
            </Link>{' '}
            for your financial freedom.
          </div>
        </Container>
      </footer>
      <Modal
        isOpen={modal}
        modalClassName='modal-long modal-black '
        toggle={toggle}
      >
        <Card className='card-user mb-0'>
          <CardBody>
            <CardText />
            <div className='author'>
              <div className='block block-one' />
              <div className='block block-two' />
              <div className='block block-three' />
              <div className='block block-four' />
              <a href='#' onClick={(e) => e.preventDefault()}>
                <img
                  alt='...'
                  className='avatar'
                  src={require('assets/img/lucasbbs.jpg').default}
                />
                <h5 className='title'>Lucas Noronha Braga</h5>
              </a>
              <p className='description'>Ceo/Founder of Finanzen ©</p>
            </div>
            <div className='card-description'>
              Full Stack Mern Developer living in Brasília, Brazil <br />
              ReactJS, NodeJS, MongoDB, Express, PHP with Laravel.
              <br /> Feel free to contact me...
            </div>
          </CardBody>

          <CardFooter>
            {/* <ModalFooter> */}
            <div className='button-container'>
              <a
                href='https://wa.me/556183499994?text=Hello+From+Finanzen'
                target='_blank'
              >
                <Button className='btn-icon btn-round btn-whatsapp'>
                  <i className='fab fa-whatsapp' />
                </Button>
              </a>
              <a
                href='mailto:lucasbbs@live.fr?subject=Hello%20from%20Finanzen&body=Hello%20there,%0D%0A'
                target='_blank'
              >
                <Button className='btn-icon btn-round' color='pinterest'>
                  <i className='far fa-envelope' />
                </Button>
              </a>
              <a href='https://github.com/lucasbbs' target='_blank'>
                <Button className='btn-icon btn-round' color='github'>
                  <i className='fab fa-github' />
                </Button>
              </a>
              <a
                href='https://www.linkedin.com/in/lucas-breno-noronha-braga/'
                target='_blank'
              >
                <Button className='btn-icon btn-round' color='linkedin'>
                  <i className='fab fa-linkedin' />
                </Button>
              </a>
              <a href='https://vk.com/lucasbbs' target='_blank'>
                <Button className='btn-icon btn-round' color='secondary'>
                  <i className='fab fa-vk' />
                </Button>
              </a>
            </div>
            {/* </ModalFooter> */}
          </CardFooter>
        </Card>
      </Modal>
    </>
  );
};

Footer.propTypes = {
  default: PropTypes.bool,
  fluid: PropTypes.bool,
};

export default Footer;
