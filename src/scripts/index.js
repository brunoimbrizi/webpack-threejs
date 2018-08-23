import ready from 'domready';
import AsyncPreloader from 'async-preloader';

// import App from './App';
import { fetchJSON } from './utils/fetch.utils';

let manifest;

const preload = () => {
	const items = manifest.items;

	const pItems = items.map(item => AsyncPreloader.loadItem(item));
	const pApp = import(/* webpackChunkName: 'app' */ './App');
	const pProgress = [pApp, ...pItems];

	let loadedCount = 0;
	let progress = 0;

	Promise.all(
		pProgress.map(p => {
			p.then(() => {
				loadedCount++;
				progress = loadedCount / pProgress.length;
				// console.log(progress);
			});
			return p;
		})
	)
	.then(([app]) => {
		window.app = new app.default();
		window.app.init();
	})
	.catch((e) => {
		console.log('preload', e);
	});
}

ready(() => {
	// fetch manifest
	fetchJSON('data/manifest.json')
	// assets and main module
	.then((response) => {
		manifest = response;
		return preload();
	})
	.catch((e) => {
		console.log('ready', e);
	});
});
