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


//User
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



//Daily Challenge

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
    if (getChallengeById) {
        res.send(getChallengeById)
    } else {
        res.status(404).send({ error: "Challenge not found" })
    }
})


//Affrimation

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
    if (getAffrimationById) {
        res.send(getAffrimationById)
    } else {
        // @ts-ignore
        res.status(400).send({ error: error.message })
    }
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
    if (getEachAffrimationsById) {
        res.send(getEachAffrimationsById)
    } else {
        res.status(400).send({ error: "Affrimation not found" })
    }
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
    if (getEachAffrimationsSectionById) {
        res.send(getEachAffrimationsSectionById)
    } else {
        res.status(400).send({ error: "Affrimation not found" })
    }
})


//Meditation

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

app.get('/meditation/:id', async (req, res) => {
    const getMeditationById = await prisma.meditation.findUnique({
        where: { id: Number(req.params.id) },
        include: {
            User: true,
            eachmeditationsection: true
        }
    })
    if (getMeditationById) {
        res.send(getMeditationById)
    } else {
        res.status(400).send({ error: "Meditation not found" })
    }
})

app.get('/eachmedatition', async (req, res) => {
    try {
        const getEachMedatition = await prisma.eachMeditationSection.findMany({
            include: {
                Meditation: true,
                oneseactionOfmeditations: true
            }
        })
        res.send(getEachMedatition)
    } catch (error) {
        // @ts-ignore
        res.status(400).send({ error: error.message })
    }
})

app.get('/eachmedatition/:id', async (req, res) => {
    const getEachMedatition = await prisma.eachMeditationSection.findUnique({
        where: { id: Number(req.params.id) },
        include: {
            Meditation: true,
            oneseactionOfmeditations: true
        }
    })
    if (getEachMedatition) {
        res.send(getEachMedatition)
    } else {
        res.status(400).send({ error: "Meditation not found" })
    }
})

//Journal

app.get('/journal', async (req, res) => {
    try {
        const getJournal = await prisma.journal.findMany({
            include: {
                User: true
            }
        })
        res.send(getJournal)
    } catch (error) {
        // @ts-ignore
        res.status(400).send({ error: error.message })
    }
})

app.get('/journal/:id', async (req, res) => {
    const getJournalById = await prisma.journal.findUnique({
        where: { id: Number(req.params.id) },
        include: {
            User: true
        }
    })
    if (getJournalById) {
        res.send(getJournalById)
    } else {
        res.status(400).send({ error: "Journal not found" })
    }
})

app.post('/journal', async (req, res) => {
    const newJournal = await prisma.journal.create({
        data: req.body,
        include: {
            User: true
        }
    })
    res.send(newJournal)
})

app.patch('/journal/:id', async (req, res) => {
    const id = Number(req.params.id)
    const updateJournal = await prisma.journal.update({
        data: req.body,
        where: { id },
        include: {
            User: true
        }
    })
    res.send(updateJournal)
})

app.delete('/journal/:id', async (req, res) => {
    const id = Number(req.params.id)
    const deleteJournal = await prisma.journal.delete({
        where: { id }
    })
    res.send(deleteJournal)
})

//Vision Board

app.get('/visionBoard', async (req, res) => {
    try {
        const getVisionBoard = await prisma.visionBoard.findMany({
            include: {
                User: true
            }
        })
        res.send(getVisionBoard)
    } catch (error) {
        // @ts-ignore
        res.status(400).send({ error: error.message })
    }
})

app.get('/visionboard/:id', async (req, res) => {
    const getVisionBoardById = await prisma.visionBoard.findUnique({
        where: { id: Number(req.params.id) },
        include: {
            User: true
        }
    })
    if (getVisionBoardById) {
        res.send(getVisionBoardById)
    } else {
        res.status(400).send({ error: "Vision Board not found" })
    }
})

app.post('/visionboard', async (req, res) => {
    const newVisionBoard = await prisma.visionBoard.create({
        data: req.body,
        include: {
            User: true
        }
    })
    res.send(newVisionBoard)
})

app.patch('/visionboard/:id', async (req, res) => {
    const id = Number(req.params.id)
    const updateVisionBoard = await prisma.visionBoard.update({
        data: req.body,
        where: { id },
        include: {
            User: true
        }
    })
    res.send(updateVisionBoard)
})

app.delete('/visionboard/:id', async (req, res) => {
    const id = Number(req.params.id)
    const deleteVisionBoard = await prisma.visionBoard.delete({
        where: { id },
        include: {
            User: true
        }
    })
    res.send(deleteVisionBoard)
})


app.listen(port, () => {
    console.log(`App is running in http://localhost:${port}`)
})