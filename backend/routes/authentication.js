const express = require('express');
const bcrypt = require('bcryptjs');
const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient()
const router = express.Router();
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
    const {email, password, name, licencePlate} = req.body;

    const hashedPassword = await bcrypt.hash(password, 8);

    try {
        const user = await prisma.user.create({
            data: {
                type: 'user',
                email,
                licencePlate,
                password: hashedPassword,
                name,
            },
        });

        res.status(201).send({message: 'User created successfully', user});
    } catch (error) {
        console.log(error)
        if (error.code === 'P2002') {
            return res.status(400).send({message: 'Email already exists.'});
        }
        console.log(error)
        res.status(500).send({message: 'Internal server error.'});
    }
});

router.post('/login', async (req, res) => {
    console.log(req.body)

    const {email, password} = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: {email},
        });
        console.log(user)

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).send({message: 'Invalid credentials.'});
        }
        
                const token = jwt.sign({ email, role: user.type }, global.config.HASH_KEY);
        return res.status(200).json({ error: false, token, user });

    } catch (error) {
        console.log(error)
        res.status(500).send({error: true, message: 'Internal server error.'});
    }
});

module.exports = router;