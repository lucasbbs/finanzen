import { percentageFormat } from 'helpers/functions';
import React from 'react';
import styles from '../../assets/scss/black-dashboard-pro-react/MyCustomCSS/loading.module.scss';

const Spinner = ({ percentage }) => {
  return (
    <>
      <main>
        <div
          className='dank-ass-loader'
          style={{
            position: 'fixed',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            top: '50%',
            right: '50%',
            left: '50%',
            zIndex: '99999',
            bottom: '50%',
          }}
        >
          <section style={{ whiteSpace: 'nowrap' }}>
            <div
              className={[styles.loading, styles.loading01].join(' ')}
              style={{
                fontWeight: '400',
                textAlign: 'center',
                margin: '0',
                color: 'var(--primary)',
                fontSize: '64px',
                fontFamily: 'Poppins',
              }}
            >
              <span>C</span>
              <span>A</span>
              <span>R</span>
              <span>R</span>
              <span>E</span>
              <span>G</span>
              <span>A</span>
              <span>N</span>
              <span>D</span>
              <span>O</span>
            </div>
          </section>
          <div className='row' style={{ flexWrap: 'nowrap' }}>
            <div
              className={[
                styles.arrow,
                styles.up,
                styles.outer,
                styles.outer18,
              ].join(' ')}
            ></div>
            <div
              className={[
                styles.arrow,
                styles.down,
                styles.outer,
                styles.outer17,
              ].join(' ')}
            ></div>
            <div
              className={[
                styles.arrow,
                styles.up,
                styles.outer,
                styles.outer16,
              ].join(' ')}
            ></div>
            <div
              className={[
                styles.arrow,
                styles.down,
                styles.outer,
                styles.outer15,
              ].join(' ')}
            ></div>
            <div
              className={[
                styles.arrow,
                styles.up,
                styles.outer,
                styles.outer14,
              ].join(' ')}
            ></div>
          </div>
          <div className='row' style={{ flexWrap: 'nowrap' }}>
            <div
              className={[
                styles.arrow,
                styles.up,
                styles.outer,
                styles.outer1,
              ].join(' ')}
            ></div>
            <div
              className={[
                styles.arrow,
                styles.down,
                styles.outer,
                styles.outer2,
              ].join(' ')}
            ></div>
            <div
              className={[
                styles.arrow,
                styles.up,
                styles.inner,
                styles.inner6,
              ].join(' ')}
            ></div>
            <div
              className={[
                styles.arrow,
                styles.down,
                styles.inner,
                styles.inner5,
              ].join(' ')}
            ></div>
            <div
              className={[
                styles.arrow,
                styles.up,
                styles.inner,
                styles.inner4,
              ].join(' ')}
            ></div>
            <div
              className={[
                styles.arrow,
                styles.down,
                styles.outer,
                styles.outer13,
              ].join(' ')}
            ></div>
            <div
              className={[
                styles.arrow,
                styles.up,
                styles.outer,
                styles.outer12,
              ].join(' ')}
            ></div>
          </div>
          <div className='row' style={{ flexWrap: 'nowrap' }}>
            <div
              className={[
                styles.arrow,
                styles.down,
                styles.outer,
                styles.outer3,
              ].join(' ')}
            ></div>
            <div
              className={[
                styles.arrow,
                styles.up,
                styles.outer,
                styles.outer4,
              ].join(' ')}
            ></div>
            <div
              className={[
                styles.arrow,
                styles.down,
                styles.inner,
                styles.inner1,
              ].join(' ')}
            ></div>
            <div
              className={[
                styles.arrow,
                styles.up,
                styles.inner,
                styles.inner2,
              ].join(' ')}
            ></div>
            <div
              className={[
                styles.arrow,
                styles.down,
                styles.inner,
                styles.inner3,
              ].join(' ')}
            ></div>
            <div
              className={[
                styles.arrow,
                styles.up,
                styles.outer,
                styles.outer11,
              ].join(' ')}
            ></div>
            <div
              className={[
                styles.arrow,
                styles.down,
                styles.outer,
                styles.outer10,
              ].join(' ')}
            ></div>
          </div>
          <div className='row' style={{ flexWrap: 'nowrap' }}>
            <div
              className={[
                styles.arrow,
                styles.down,
                styles.outer,
                styles.outer5,
              ].join(' ')}
            ></div>
            <div
              className={[
                styles.arrow,
                styles.up,
                styles.outer,
                styles.outer6,
              ].join(' ')}
            ></div>
            <div
              className={[
                styles.arrow,
                styles.down,
                styles.outer,
                styles.outer7,
              ].join(' ')}
            ></div>
            <div
              className={[
                styles.arrow,
                styles.up,
                styles.outer,
                styles.outer8,
              ].join(' ')}
            ></div>
            <div
              className={[
                styles.arrow,
                styles.down,
                styles.outer,
                styles.outer9,
              ].join(' ')}
            ></div>
          </div>
          {percentage && (
            <h1 className='mt-3' style={{ color: 'var(--primary)' }}>
              {percentageFormat(percentage, 2)}
            </h1>
          )}
        </div>
      </main>
    </>
  );
};

export default Spinner;

Spinner.defaultProps = {
  percentage: undefined,
};
