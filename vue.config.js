module.exports = {
	css: {
		loaderOptions: {
			sass: {
				prependData: `@import "@/styles/global_variables.scss";`,
			},
		},
	},
	pwa: {
		themeColor: '#f3a57e',
		name: 'Notatniku',
		short_name: 'Notatniku',
		msTileColor: '#ece3db',
		manifestOptions: {
			background_color: '#ece3db',
			icons: [
				{
					src: './img/icons/icon-192x192.png',
					sizes: '192x192',
					type: 'image/png',
				},
				{
					src: './img/icons/icon-512x512.png',
					sizes: '512x512',
					type: 'image/png',
				},
				{
					src: './img/icons/icon-192x192.png',
					sizes: '192x192',
					type: 'image/png',
					purpose: 'maskable',
				},
				{
					src: './img/icons/icon-512x512.png',
					sizes: '512x512',
					type: 'image/png',
					purpose: 'maskable',
				},
			],
		},
	},
};
