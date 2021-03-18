import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { transitions, positions, Provider as AlertProvider } from 'react-alert'

const AlertTemplate = ({ options, message }) => (
  <div className="container-alert">
    {options.type === 'info' && 'Atenção! '}
    {options.type === 'success' && ''}
    {options.type === 'error' && 'Erro! '}
    {message}
  </div>
)

const options = {
  position: positions.BOTTOM_CENTER,
  timeout: 3000,
  offset: '30px',
  transition: transitions.SCALE
}

const Root = () => (
  <AlertProvider template={AlertTemplate} {...options}>
    <App />
  </AlertProvider>
)

ReactDOM.render(
  <Root />,
  document.getElementById('root')
);
