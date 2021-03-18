import React from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import recycleImg from '../../assets/images/recycle.png';

import './styles.css';

export default function Menubar() {

  return (
    <div id="menubar">
      <header>
        <Link to="/">
          <img src={recycleImg} alt="Logo Coleta" />
          <p>COLETALI</p>
        </Link>
        <Link to='/app'>
          <FiArrowLeft />
          Página inicial
        </Link>
      </header>
    </div>
  );
}