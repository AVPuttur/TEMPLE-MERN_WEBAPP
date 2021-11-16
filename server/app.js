const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

app.use(cors());
app.use(express.json());

// mongoose.connect('mongodb://localhost:27017/temple_db',function(err) {
//     if (err)
//         return console.error(err);
// });

// Connecting mongoDB
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/temple_db', {
    useNewUrlParser: true
}).then(() => {
        console.log('Database connected')
    },
    error => {
        console.log('Database could not be connected : ' + error)
    }
);

app.listen(5000, () =>{
    console.log("Server listening to port 5000");
});

app.get('/hello', (req, res) => {
    res.send("Helloo");
});

app.post('/api/register', async (req, res) => {
    console.log(req.body);
    try {
        const newPassword = await bcrypt.hash(req.body.password, 10);
        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: newPassword
        });
        res.json({status: 'User created successfully!'});
    }catch (err) {
        console.log(err)
        res.json({status: 'error', error: 'Duplicate email'});
    }
});

app.post('/api/login', async (req, res) => {
    const user = await User.findOne({
        email: req.body.email,
        password: req.body.password
    });

    if(!user) { return res.json({status: 'error', erroe: 'Invalid login!'}); }

    const isPasswordValid = bcrypt.compare(req.body.password, user.password);

    if(isPasswordValid) {
        const token = jwt.sign({
           name: user.name,
           email: user.email
        }, 'avput012');
        return res.json({status: 'ok', accessToken: token});
    }else {
        return res.json({status: 'error', error: false});
    }
});

app.get('/api/users', async (req, res) => {
    const token = req.headers['x-access-token'];
    try {
    const decoded = jwt.decode(token, 'avput012');
    const email = decoded.email;
    const user = await User.findOne({email: decoded.email});
        res.json({status: 'User created successfully!'});
    }catch (err) {
        console.log(err)
        res.json({status: 'error', error: 'Invalid token'});
    }
});





