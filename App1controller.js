const express = require('express')
const cors = require('cors')
const app = express()
const PORT = 5454

app.use(cors())
app.use(express.json())

app.get('/test', (req, res) => {
    res.send('Connecté')
})

app.post('/sum', (req, res) => {
    const {a, b} = req.body
    const result = Number(a) + Number(b)
    res.json({ result })
})

app.listen(PORT, () => {
    console.log('API active sur localhost:%d', PORT)
})