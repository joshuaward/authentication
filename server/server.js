const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const app = express();

const hostname = '127.0.0.1';
const port = process.env.PORT || 3001;

mongoose.connect('mongodb://localhost:27017/AuthApp', {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

mongoose.set('useCreateIndex', true);

// MIDDLEWARE
app.use(bodyParser.json());

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
			res.status(200).send(isMatch);
		})
	});
});

app.listen(port, () => {
	console.log(`Server is listening on port http://${hostname}:${port}`)
});