import express from "express";
import cors from 'cors'
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const app = express()
app.use(express.json())
app.use(cors())
const port = 5000
const SECRET = 'Psssst'

const prisma = new PrismaClient({ log: ['warn', 'error', 'info', 'query'] })

function getToken(id: number) {
    return jwt.sign({ id: id }, SECRET, { expiresIn: '1 day' })
}

async function keepUser(token: string) {
    const dataInCode = jwt.verify(token, SECRET)
    //@ts-ignore
    const userON = await prisma.user.findUnique({ where: { id: dataInCode.id } })

    return userON
}


app.get('/users', async (req, res) => {
    const getUser = await prisma.user.findMany({
        include: {
            dailychallenges: true,
            journal: true,
            visionboard: true,
            affrimations: true,
            meditation: true
        }
    })
    res.send(getUser)
})

app.post('/sign-up', async (req, res) => {

    try {
        const match = await prisma.user.findUnique({
            where: { email: req.body.email }
        })
        if (match) {
            res.status(400).send({ error: "This Email is already in use" })
        } else {
            const newUser = await prisma.user.create({
                data: {
                    email: req.body.email,
                    password: bcrypt.hashSync(req.body.password)
                }
            })
            res.send({ newUser: newUser, token: getToken(newUser.id) })
        }
    } catch (error) {
        res.status(404).send(error)
    }

})

app.post('/log-in', async (req, res) => {
    const user = await prisma.user.findUnique({
        where: { email: req.body.email }
    })
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
        res.send({ user: user, token: getToken(user.id) })
    } else {
        res.status(400).send({ error: "Incorrect Email or password. Try again!" })
    }
})

app.get('/validation', async (req, res) => {
    try {
        if (req.headers.authorization) {
            const user = await keepUser(req.headers.authorization)
            // @ts-ignore
            res.send({ user, token: getToken(user?.id) })
        }

    } catch (error) {
        // @ts-ignore
        res.status(400).send({ error: error.message })
    }

})

app.get('/dailychallenges', async (req, res) => {
    try {
        const getChallenges = await prisma.dailyChallenges.findMany({ include: { User: true } })
        res.send(getChallenges)
    } catch (error) {
        // @ts-ignore
        res.status(400).send({ error: error.message })
    }
})

app.get('/dailychallenges/:id', async (req, res) => {
    const getChallengeById = await prisma.dailyChallenges.findUnique({
        where: { id: Number(req.params.id) },
        include: { User: true }
    })
    res.send(getChallengeById)
})

app.get('/affrimations', async (req, res) => {
    try {
        const getAffrimations = await prisma.affrimations.findMany({
            include: {
                User: true,
                eachaffrimation: true
            }
        })
        res.send(getAffrimations)
    } catch (error) {
        // @ts-ignore
        res.status(400).send({ error: error.message })
    }
})

app.get('/affrimations/:id', async (req, res) => {
    const getAffrimationById = await prisma.affrimations.findUnique({
        where: { id: Number(req.params.id) },
        include: {
            User: true,
            eachaffrimation: true
        }
    })
    res.send(getAffrimationById)
})

app.get('/eachaffrimation', async (req, res) => {
    try {
        const getEachAffrimations = await prisma.eachAffrimation.findMany({
            include: {
                Affrimations: true
            }
        })
        res.send(getEachAffrimations)
    } catch (error) {
        // @ts-ignore
        res.status(400).send({ error: error.message })
    }
})

app.get('/eachaffrimation/:id', async (req, res) => {
    const getEachAffrimationsById = await prisma.eachAffrimation.findUnique({
        where: { id: Number(req.params.id) },
        include: {
            Affrimations: true
        }
    })
    res.send(getEachAffrimationsById)
})


app.get('/eachaffrimationsection', async (req, res) => {
    try {
        const getEachAffrimationsSection = await prisma.eachAffrimationSection.findMany({
            include: {
                EachAffrimation: true
            }
        })
        res.send(getEachAffrimationsSection)
    } catch (error) {
        // @ts-ignore
        res.status(400).send({ error: error.message })
    }
})

app.get('/eachaffrimationsection/:id', async (req, res) => {
    const getEachAffrimationsSectionById = await prisma.eachAffrimationSection.findUnique({
        where: { id: Number(req.params.id) },
        include: {
            EachAffrimation: true
        }
    })
    res.send(getEachAffrimationsSectionById)
})

app.get('/meditation', async (req, res) => {
    try {
        const getMeditation = await prisma.meditation.findMany({
            include: {
                User: true,
                eachmeditationsection: true
            }
        })
        res.send(getMeditation)
    } catch (error) {
        // @ts-ignore
        res.status(400).send({ error: error.message })
    }
})

app.listen(port, () => {
    console.log(`App is running in http://localhost:${port}`)
})