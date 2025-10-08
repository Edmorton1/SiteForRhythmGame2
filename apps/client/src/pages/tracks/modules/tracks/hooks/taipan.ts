// const params = new URLSearchParams();
// params.append('lang', 'RU');
// params.append('lang', 'UA');

// console.log(params.toString());

const baseUrl = 'http://localhost:3000';

const url = new URL('/api/tracks', baseUrl);

console.log(url);

const url_params = {
	cursor: '20',
	sort: 'bpm',
	difficulty: 'hard',
};

const params = new URLSearchParams(url_params);
params.append('lang', 'UA');
params.append('lang', 'RU');
params.delete('lang', 'UA');
url.search = params.toString();
console.log(url);
