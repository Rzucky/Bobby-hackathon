const prisma = require("../index");

const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

router.post('/register', async (req, res) => {
    const {email, password, name, type} = req.body;

    const hashedPassword = await bcrypt.hash(password, 8);

    try {
        const user = await prisma.user.create({
            data: {
                type,
                email,
                password: hashedPassword,
                name
            },
        });

        res.status(201).send({message: 'User created successfully', user});
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(400).send({message: 'Email already exists.'});
        }
        res.status(500).send({message: 'Internal server error.'});
    }
});

router.post('/login', async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: {email},
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).send({message: 'Invalid credentials.'});
        }

        res.send({message: 'Login successful', user});
    } catch (error) {
        res.status(500).send({message: 'Internal server error.'});
    }
});

module.exports = router;