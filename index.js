import express from"express"
const app = express()

const porta = 3000;

fetch("http://localhost:4000/produto",{
    method: "POST",
    headers: {'Content-Type': 'application/json'},
    body: {id:1,nome:"teclado"}
})

app.listen (porta)

