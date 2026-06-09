import type { ReverseProxyText } from '../types';

export const en: ReverseProxyText = {
	title: 'Reverse proxy',
	intro: [
		'A site is rarely just one server. Usually one server holds the web pages, another runs the app, and another serves files like images. Three different addresses, and it gets messy if every visitor has to know all of them.',
		'So we put one front door in front: a <b>reverse proxy</b>. Every request comes in through it. It looks at where the request is headed, then forwards it to the right server behind.',
		'Think of it as a receptionist. Every guest is greeted at the front desk, then walked to the correct room. Guests never see the back offices, and they only know one address: the receptionist.',
		'Try sending a few requests with different paths. Watch the proxy walk each one to the right server, while the real server addresses stay hidden behind it.'
	],
	reactions: {
		web: 'The request to <b>/</b> is walked to the web server. Visitors only know one address, the proxy handles the rest. Try another path.',
		api: 'The request to <b>/api</b> is forwarded to the app server. Different server, same front door.',
		static:
			'The request to <b>/images</b> goes to the file server. Three different destinations, one shared front door.'
	},
	proxyLabel: 'Reverse proxy',
	proxySub: 'public front door',
	publicAddr: 'mysite.com',
	hiddenLabel: 'hidden address',
	send: 'Send',
	routes: [
		{ path: '/', label: 'Web server', backend: 'web' },
		{ path: '/api', label: 'App server', backend: 'api' },
		{ path: '/images', label: 'File server', backend: 'static' }
	],
	backends: { web: 'Web server', api: 'App server', static: 'File server' },
	routedNote: 'Routed to {n} different servers'
};
