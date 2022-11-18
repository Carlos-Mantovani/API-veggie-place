require('dotenv').config();
const cors = require('cors');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const UserModel = require('../src/database/models/user.model');

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//app.use(express.static(path.join(__dirname, '../src/views')));

const checkToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        if (token) {
            try {
                const secret = process.env.SECRET;
                jwt.verify(token, secret);
            } catch (error) {
                res.status(400).send('Token inválido!');
            }
            next();
        } else {
            return res.status(401).json('Acesso negado!');
        }
    } else {
        res.status(401).send('Acesso negado!');
    }
}

app.get('/', (req, res) => {
    res.status(200).send('API de autenticação');
});

/*
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../src/views', 'cadastro.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../src/views', 'login.html'));
});
*/

app.get('/users', async (req, res) => {
    try {
        const users = await UserModel.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).send('Não foi possível listar os usuários!');
    }
});

app.get('/users/:id', checkToken, async (req, res) => {
    const id = req.params.id;
    const user = await UserModel.findById(id, '-password');
    if (user) {
        return res.status(200).json(user);
    }
    res.status(404).send('Usuário não encontrado!');
});

app.post('/register', async (req, res) => {

    const { username, email, password } = req.body
    const userExist = await UserModel.findOne({ email: email });
    if (userExist) {
        return res.status(422).send('Usuário com esse e-mail já está cadastrado');
    }
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);
    const user = new UserModel({
        username,
        email,
        password: passwordHash,
        photo: 'https://isobarscience.com/wp-content/uploads/2020/09/default-profile-picture1.jpg',
        cart: []
    });
    try {
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        return res.status(500).json(error.message);
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email: email });
    if (user) {
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
            try {
                const secret = process.env.SECRET;
                const token = jwt.sign({
                    id: user._id
                }, secret);
                return res.status(200).json({ message: `Bem vindo, ${user.username}!`, token });
            } catch (error) {
                res.status(500).send(error.message);
            }
        }
        return res.status(422).send('Senha inválida');
    }
    res.status(404).send("Usuário não existe!");
});

//arrumar a senha
app.patch('/users/:id', checkToken, async (req, res) => {
    try {
        const id = req.params.id;
        const password = req.body.password;
        if (password) {
            const salt = await bcrypt.genSalt(12);
            const passwordHash = await bcrypt.hash(password, salt);
            req.body.password = passwordHash;
        }
        const user = await UserModel.findByIdAndUpdate(id, req.body, { new: true });
        
        res.status(200).json(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

const port = 3000;

app.listen(port, () => console.log(`Listening on port ${port}`));
