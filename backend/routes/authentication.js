const express = require('express');
const bcrypt = require('bcryptjs');
const {PrismaClient} = require('../../node_modules/@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

router.post('/register', async (req, res) => {
    const {email, password, name, type, licencePlate} = req.body;

    const hashedPassword = await bcrypt.hash(password, 8);

    try {
        const user = await prisma.user.create({
            data: {
                type,
                email,
                password: hashedPassword,
                name,
                licencePlate
            },
        });

        res.status(201).send({message: 'User created successfully', user});
    } catch (error) {
        console.log(error)
        if (error.code === 'P2002') {
            return res.status(400).send({message: 'Email already exists.'});
        }
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

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).send({message: 'Invalid credentials.'});
        }

        res.send({message: 'Login successful', user});
    } catch (error) {
        res.status(500).send({message: 'Internal server error.'});
    }
});

module.exports = router;