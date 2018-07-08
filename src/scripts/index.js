const ready = require('domready');

import style from '../styles/main.css';
import App from './App';

ready(() => {
	window.app = new App();
});
