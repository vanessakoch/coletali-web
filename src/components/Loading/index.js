import React from 'react';
import ReactLoading from 'react-loading';
import Menubar from '../Menubar';

import './styles.css';

export default function Loading() {
  return (
    <div id="page-create-point">
      <Menubar />
      <div className="loading">
        <p>Carregando</p>
        <ReactLoading type={'bubbles'} color={'#01446B'} height={'40%'} width={'40%'} />
      </div>
    </div>
  )
}
