import express from 'express'; 
import session from 'express-session';
import fs from 'fs';
import verificarAutenticacao from "./seguranca/autenticacao.js";

const host = "0.0.0.0";
const porta = 3000;
const app = express(); 

app.use(session({
    secret: "M1nH4Ch4v3S3cR3t4",
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 15,
        httpOnly: true
    }
}));

app.use(express.urlencoded({ extended: true })); 
app.use(express.static("publico")); 

function carregarUsuarios() {
    try {
        const dados = fs.readFileSync("./db/datadb.json", "utf-8");
        const json = JSON.parse(dados);
        return json.usuario || [];
    } catch (erro) {
        console.error("Erro ao ler datadb.json:", erro);
        return [];
    }
}

app.post("/login", (req, res) => {
    const { usuario, senha } = req.body;

    if (usuario === "admin" && senha === "admin") {
        req.session.autenticado = true;
        req.session.usuario = "admin";
        return res.redirect("/menu.html");
    }

    const usuarios = carregarUsuarios();
    const usuarioEncontrado = usuarios.find(u => u.usuario === usuario && u.senha === senha);

    if (usuarioEncontrado) {
        req.session.autenticado = true;
        req.session.usuario = usuarioEncontrado.usuario;
        return res.redirect("/menu.html");
    }

    const conteudo = `
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <title>Login</title>
            <link rel="stylesheet" href="css/bootstrap.min.css">
            <link rel="stylesheet" href="css/login.css">
        </head>
        <body>
            <div class="container">
                <div class="row">
                    <div class="col-md-6 offset-md-3">
                        <h2 class="text-center text-dark mt-5">Bem-vindo</h2>
                        <div class="text-center mb-5 text-dark">Faça o login</div>
                        <div class="card my-5">
                            <form class="card-body cardbody-color p-lg-5" action="/login" method="post">
                                <div class="text-center">
                                    <img src="/imagem/login-avatar.webp"
                                         class="img-fluid profile-image-pic img-thumbnail rounded-circle my-3"
                                         width="200px" alt="profile">
                                </div>
                                <div class="mb-3">
                                    <input type="text" class="form-control" id="usuario" value="${usuario}" name="usuario" placeholder="Usuário">
                                </div>
                                <div class="mb-3">
                                    <input type="password" class="form-control" id="senha" name="senha" placeholder="Senha">
                                </div>
                                <div class="text-center">
                                    <button type="submit" class="btn btn-color px-5 mb-5 w-100">Login</button>
                                </div>
                                <div class="alert alert-danger">Usuário ou senha incorretos!</div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `;
    res.send(conteudo);
    res.end();
});

app.post("/cadastro", (req, res) => {
    const { usuario, senha } = req.body;

    const dados = JSON.parse(fs.readFileSync("./db/datadb.json", "utf-8"));
    const usuarios = dados.usuario || [];

    const usuarioExistente = usuarios.find(u => u.usuario === usuario);
    if (usuarioExistente) {
        return res.send("Usuário já existe!");
    }

    usuarios.push({ usuario, senha });
    dados.usuario = usuarios;

    fs.writeFileSync("./db/datadb.json", JSON.stringify(dados, null, 2));
    res.redirect("/login.html");
});

app.use(verificarAutenticacao, express.static("privado"));

app.get("/logout", (req, res) => {
    req.session.destroy(); 
    res.redirect("/login.html"); 
    res.end();
});

app.listen(porta, host, () => {
    console.log(`Servidor em execução em http://${host}:${porta}`);
});
