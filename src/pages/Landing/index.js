import React from 'react';
import { FiLogIn, FiLock } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import landingImg from '../../assets/images/landing-background.svg';
import "./styles.css";

function Landing() {
  return (
    <div id="page-landing">
      <div className="container" id="page-landing-content">
        <div className="logo-container">
          <h1>COLETALI</h1>
          <h2>Reuse, Reduza, Doe e Recicle</h2>
          <p>Ajudamos as pessoas a encontrar pontos próximos e eficazes para
          o descarte ou doação de materiais. Colaborando com as pessoas e o meio ambiente :)
          </p>
        </div>

        <img
          src={landingImg}
          alt="Plataforma de Coleta"
          className="background-image"
        />

        <div className="buttons-container">
          <Link to="/app" className="enter-app">
            <FiLogIn size={26} />
            <span>Acessar</span>
          </Link>

          <Link to="/admin/dashboard" className="link-admin">
            <FiLock size={20} />
            <span>Sou administrador</span>
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Landing;