const jwt = require("jsonwebtoken");

// ========================
//  Verificar Token
//=========================
let verificarToken = (req, res, next) => {
    let token = req.get('token');
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            res.status(401).json({
                ok: false,
                err
            })
        }
        req.usuario = decoded.usuario
        console.log(req.usuario);
        next()
    })
}

let verificaAdmin_Role = (req, res, next) => {
    let usuario = req.usuario;
    if (usuario.role === "ADMIN_ROLE") {
        next()
    } else {
        res.json({
            ok: false,
            err: {
                message: "El Usuario no es administrador"
            }
        })
    }
}

module.exports = {
    verificarToken,
    verificaAdmin_Role
}