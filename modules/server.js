const express = require('express');
const path = require('path');
const UserModel = require('../src/database/models/user.model');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, '../src/views')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../src/views', 'index.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../src/views', 'cadastro.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../src/views', 'login.html'));
});

app.post('/register', async (req, res) => {
    try {
        const { email } = req.body
        const userExist = await UserModel.findOne({ email: email });
        if (userExist) {
            res.redirect('/register');
        } else {
            const user = await UserModel.create(req.body);
            res.redirect('/login');
        }
    } catch (error) {
        res.send(error.message);
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email: email });
        if (user) {
            const passwordMatch = user.password == password;
            if (passwordMatch) {
                res.redirect('/');
            } else {
                res.redirect('/login');
            }

        } else {
            res.redirect('/login');
        }
    } catch (error) {
        res.send(error.message);
    }
});

const port = 3000;

app.listen(port, () => console.log(`Listening on port ${port}`));