import AsyncPreloader from 'async-preloader';

import AppView from './view/AppView';

export default class App {

	constructor() {
		this.initLoader();
	}

	initLoader() {
		AsyncPreloader.loadManifest('data/manifest.json')
		.then(items => {
			this.init();
		})
		.catch(err => {
			console.log('AsyncPreloader error', err);
		});
	}

	init() {
		this.view = new AppView();
	}
}
