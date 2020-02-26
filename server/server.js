const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');

const app = express();

mongoose.connect('mongodb://localhost:27017/AuthApp', {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

mongoose.set('useCreateIndex', true);

// MIDDLEWARE
app.use(bodyParser.json());
app.use(cookieParser());
const { authenticate } = require('./middleware/authenticate');

// MODEL
const { User } = require('./models/user');

// ROUTES
app.post('/api/user', (req, res) => {
	const user = new User({
		email: req.body.email,
		password: req.body.password
	});

	user.save((err, doc) => {
		if(err) res.status(400).send(err);
		res.status(200).send(doc);
	})
});

// 1- find if user exists > move
// 2- compare string password with hash password > move
// 3- send response

app.post('/api/user/login', (req, res) => {
	User.findOne({'email': req.body.email}, (err, user) => {
		if(!user) res.json({message: 'User not found.'});

		user.comparePassword(req.body.password, function(err, isMatch) {
			if(err) throw err;

			if(!isMatch) return res.status(400).json({
				message: 'Wrong password.'
			})

			user.generateToken((err, user) => {
				if(err) return res.status(400).send(err);
				res.cookie('auth', user.token).send('ok');
			})
		})
	});
});

app.get('/api/books', authenticate, (req, res) => {
	res.send(req.user);
});

app.get('/api/user/logout', authenticate, (req, res) => {
	req.user.deleteToken(req.token, (err, user) => {
		if(err) return res.status(400).send(err);
		res.status(200).send('ok');
	})
});

const hostname = '127.0.0.1';
const port = process.env.PORT || 3001;
app.listen(port, () => {
	console.log(`Server is listening on port http://${hostname}:${port}`)
});