const config = {
	production: {
		SECRET: process.env.SECRET,
		DATABASE: process.env.MONGODB_URI
	},
	default: {
		SECRET: '60588670944802510722',
		DATABASE: 'mongodb://localhost:27017/AuthApp'
	}
}

exports.get = function get(env) {
	return config[env] || config.default
}