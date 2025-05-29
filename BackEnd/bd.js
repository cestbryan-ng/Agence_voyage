const express = require('express')
const cors = require('cors')
const app = express()
const db = require('./mysqlbd.js');
const PORT = 5454

app.use(cors())
app.use(express.json())

app.get('/test', (req, res) => {
res.send('Connecté')
})

app.post('/connexion', (req, res) => {
    const {numero, mdp} = req.body
    const sql = 'select * from user where numero_adresse = ? and mot_de_passe = ?;';
    db.query(sql, [parseInt(numero), mdp], (err, results) => {
        if (err) {
            console.error('Erreur requête :', err);
            res.json({ result: false })
        } else {
            console.log('1 requête reussie')
            if (results.length > 0) {
            res.json({ result: true });
            } else {
            res.json({ result: false });
            }
        }
    })
})


app.post('/inscrire', (req, res) => {
    const { numero, mdp } = req.body
    const sql = 'insert into user (numero_adresse, mot_de_passe) values (?, ?);'
        db.query(sql, [parseInt(numero), mdp], (err, results) => {
        if (err) {
            console.error('Erreur requête :', err);
            res.json({ result: false })
        } else {
            console.log('1 requête reussie')
            res.json({ result : true })
        }
    })
})

app.listen(PORT, () => {
console.log('API active sur localhost:%d', PORT)
})