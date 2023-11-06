import Admin from './models/Admin.js';
import Cliente from './models/Cliente.js';
import Empresa from './models/Empresa.js';
import Entrada from './models/Entrada.js';
import Evento from './models/Evento.js';
import Ventas from './models/Ventas.js';
import express from 'express';
import cors from 'cors';
import Knex from 'knex';
import axios from 'axios';
import { development } from './knexfile.js';
import session from 'express-session';
import * as moment from 'moment';
import passport from 'passport';
import { strategyInit } from './lib/AuthStrategy.js';


// Instanciamos Express y el middleware de JSON y CORS
const app = express();
app.use(express.urlencoded({ extended: false }))
app.use(express.json());
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

// Inicialización del sistema de sesiones (adelantando temario del siguiente lab)
app.use(session({
    secret: 'ocio-session-cookie-key', // Secreto de la sesión (puede ser cualquier identificador unívoco de la app, esto no es público al usuario)
    name: 'SessionCookie.SID', // Nombre de la sesión
    resave: true,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 3600000, // Expiración de la sesión
    },
}));
app.use(passport.initialize()); // passport.initialize() inicializa Passport
app.use(passport.session()); // passport.session() indica a Passport que usará sesiones
strategyInit(passport);

// Conexiones a la base de datos
const dbConnection = Knex(development);
Admin.knex(dbConnection);
Cliente.knex(dbConnection);
Empresa.knex(dbConnection);
Entrada.knex(dbConnection);
Evento.knex(dbConnection);
Ventas.knex(dbConnection);

/**
 * ENDPOINT: POST /login --> Inicia sesión
 * 
 * Si os dais cuenta, declaramos el endpoint metiendo passport.authenticate('local') como middleware 
 * y después ya la lógica (que ocurrirá después del authenticate)
 * 
 * Para más info del authenticate ver el archivo LocalStrategy.js
 * 
 * localStorage.setItem(type, "tipo de usuario")
 * localStorage.getItem(type)
 * siempre tienen que ser strings, si es un json haces json stringify
 */

// Endpoint: GET /user --> Devuelve info del usuario en la sesión actual (y un 401 si no se ha iniciado sesión)
app.get("/admin", (req, res) => !!req.isAuthenticated() ? res.status(200).send(req.session) : res.status(401).send('Sesión no iniciada!'));
app.get("/cliente", (req, res) => !!req.isAuthenticated() ? res.status(200).send(req.session) : res.status(401).send('Sesión no iniciada!'));
app.get("/empresa", (req, res) => !!req.isAuthenticated() ? res.status(200).send(req.session) : res.status(401).send('Sesión no iniciada!'));


app.post('/login/admin', passport.authenticate('admin'), (req, res) => {
    if (!!req.user) {
        req.user.userType = "admin";
        res.status(200).json({ status: 'OK' })

    }
    else res.status(500).json({ status: "Sesión no iniciada" });
});

app.post('/login/cliente', passport.authenticate('cliente'), (req, res) => {
    if (!!req.user) {
        req.user.userType = "cliente";
        res.status(200).json({ status: 'OK' })
    }
    else res.status(500).json({ status: "Sesión no iniciada" });
});

app.post('/login/empresa', passport.authenticate('empresa'), (req, res) => {
    if (!!req.user) {
        req.user.userType = "empresa";
        res.status(200).json({ status: 'OK' })
    }
    else res.status(500).json({ status: "Sesión no iniciada" });
});

app.post('/logout', (req, res) => {
    req.logout(err => {
        if (err) { return next(err); }
        req.session.destroy(); // Destruir la sesión
        res.status(200).clearCookie('SessionCookie.SID', { path: '/' }).json({ status: 'logout' })/*.redirect('http://localhost:3000/')*/; // Limpiamos la cookie y redirigimos
    });
});

/**
 * ENDPOINT: POST /register --> Registra un usuario
 * 
 * Para registrar un usuario bastará con comprobar si existe y, si no existe, insertarlo en la base de datos.
 * Para ello, podemos reciclar la query inicial añadiendo el método "insert"
 * 
 * El método findOne de objection es el equivalente a .where('columna', '=', valor).first(), pero simplificado
 * Nota: Para poder llamar a findOne de este modo (recibiendo un JSON como parámetro), es preciso haber definido el JSONSchema en el modelo del Usuario
 */
app.post("/register/cliente", (req, res) => {
    const dbQuery = Cliente.query();

    // Si buscamos por la clave primaria (en este caso el email) es más óptimo usar findById
    dbQuery.findById(req.body.username).then(async result => {
        if (!!result) res.status(500).json({ error: "El usuario ya existe" });
        else {
            dbQuery.insert({
                email: req.body.username,
                unsecurePassword: String(req.body.password),
                nombre: req.body.nombre,
                apellidos: req.body.apellidos,
                dni: req.body.dni,
                fechanacimiento: req.body.fechanacimiento
            }).then(insertResult => {

                res.status(200).json({ status: "OK" })
            }).catch(error => {

                res.status(500).json({ status: "Fallo al crear un usuario" })
            })
        }

    })
});

app.post("/register/empresa", (req, res) => {
    const dbQuery = Empresa.query();
    dbQuery.findById(req.body.username).then(async result => { // <-- En empresa lo mismo
        if (!!result) res.status(500).json({ error: "La empresa ya existe" });
        else {
            dbQuery.insert({
                email: req.body.username, // <-- ¿Van a llegar bodies distintos? ¿En Cliente llega username y en Empresa email siendo los dos emails?
                unsecurePassword: String(req.body.password),
                nombre: req.body.nombre,
                telefono: req.body.telefono,
                cif: req.body.cif,
                domicilio: req.body.domicilio,
                responsable: req.body.responsable,
                capital: req.body.capital
            }).then(insertResult => {

                res.status(200).json({ status: "OK" })
            }).catch(error => {

                res.status(500).json({ status: "Fallo al crear una empresa" })
            })
        }


    })
});

app.post("/register/admin", (req, res) => {
    //res.status(200).json({ username: req.body.username, pass: req.body.password });
    const dbQuery = Admin.query();
    dbQuery.findById({ email: req.body.username }).then(async result => {
        if (!!result) res.status(500).json({ error: "El usuario ya existe" });
        else {
            dbQuery.insert({
                email: req.body.username,
                unsecurePassword: String(req.body.password)
            }).then(insertResult => {

                res.status(200).json({ status: "OK" })
            }).catch(error => {

                res.status(500).json({ status: "Fallo al crear un usuario" })
            })
        }


    })
});

app.post("/delete/cliente", async (req, res) => {
    const dbQuery = Cliente.query();
    

    dbQuery.findById(req.body.username).then(async result => { // <-- En empresa lo mismo
        if (!!result) {
            Ventas.query().delete().where({ cliente: req.body.username }).then(deleteResult =>
                dbQuery.deleteById(req.body.username).then(insertResult => {

                    res.status(200).json({ status: "OK" })
                }).catch(error => {

                    res.status(500).json({ status: "Fallo al eliminar el cliente" })
                })
            ).catch(err => {
                res.status(500).json({ error: err, status: "Fallo al eliminar las ventas del cliente" })
            })
        }
        else {
            res.status(500).json({ error: "El cliente no existe" });
        }
    })
});


app.post("/delete/empresa", async (req, res) => {
    const dbQuery = Empresa.query();
    

    dbQuery.findById(req.body.username).then(async result => { // <-- En empresa lo mismo
        if (!!result) {
            Ventas.query().delete().where({ empresa: req.body.username }).then(deleteResult => {
                Evento.query().delete().where({ empresa: req.body.username }).then(deleteEvResult => {
                    dbQuery.deleteById(req.body.username).then(insertResult => {

                        res.status(200).json({ status: "OK" })
                    }).catch(error => {

                        res.status(500).json({ status: "Fallo al eliminar la empresa" })
                    });
                }).catch(err => {
                    res.status(500).json({ error: err, status: "Fallo al eliminar los eventos de la empresa" })
                });
            }).catch(err => {
                res.status(500).json({ error: err, status: "Fallo al eliminar las ventas de la empresa" })
            });

        }
        else {
            res.status(500).json({ error: "La empresa no existe" });
        }


    })
});

// Endpoint: POST /entradas --> Devuelve todos los entradas
// ! Corregida la lógica asíncrona (tutoría) --> repetir en el resto
app.post('/empresa/show', (req, res) => {
    const consulta = Empresa.query().throwIfNotFound();
    if (!!req.body && req.body !== {}) {

        //Filtrado por verificado
        if (!!req.body.verificada) {
            consulta.where('Empresa.verificado', '=', req.body.verificada);
        }

    }
    consulta.then(results => res.status(200).json(results)).catch(err => res.status(500).json({ "error": err }));
});

app.post('/empresa/verif', (req, res) => {
    if (!!req.body && req.body !== {}) {
        //Filtrado por verificado
        if (!!req.body.empresa) {
            const consulta = Empresa.query().throwIfNotFound();
            consulta.update({ verificado: true }).where('Empresa.email', '=', req.body.empresa);
            consulta.then(results =>
                res.status(200)
                    .json({ status: 'empresa verificada' }))
                .catch(err => res.status(500)
                    .json({ "error": err }));
        } else {
            res.status(401).json({ status: 'no se ha especificado la empresa' });
        }
    }
});

// Endpoint: POST /eventos --> Devuelve todos los eventos
app.post('/eventos', async (req, res) => {
    
    const consulta = Evento.query().throwIfNotFound();
    if (!!req.body && req.body !== {}) {
        // Filtrado por empresa
        if (!!req.body.empresa) {
            const isVerifiedResult = await isVerified(req.body.empresa);
            if (isVerifiedResult) {
                if (!!req.body.id) consulta.findById(req.body.id);

                // Filtrado por fechas
                if (!!req.body.after) {
                    consulta.where('Evento.fecha', '>=', req.body.after);
                }
                consulta
                    .where('Evento.empresa', '=', req.body.empresa)
                    .then(results => { res.status(200).json(results); }).catch(error => { res.status(500).json({ error: error, verif: isVerifiedResult }) });
            } else {
                res.status(401).json({ err: "No tienes acceso, no estás verificado" });
            }
        } else {
            // Filtrado por id
            if (!!req.body.id) consulta.findById(req.body.id);

            // Filtrado por fechas
            if (!!req.body.after) {
                consulta.where('Evento.fecha', '>=', req.body.after);
            }
            consulta
                .then(results => res.status(200).json(results))
                .catch(err => res.status(500).json({ error: err }));
        }
    } else {
        res.status(500).json({ error: "Body vacío" });
    }
});

// Endpoint: GET /eventos --> Devuelve el evento por id
app.get('/eventos/:id', (req, res) => {
    const eventId = req.params.id;
    const consulta = Evento.query().throwIfNotFound();
    consulta.findById(eventId);
    consulta.then(results => res.status(200).json(results)).catch(err => res.status(500).json({ "error": err }));
});

// Endpoint: POST /eventos
app.post("/eventos/new", async (req, res) => {

    if (await isVerified(req.body.empresa)) {
        //meter count con un max()
        Evento.query().findOne({ empresa: req.body.empresa, nombre: req.body.nombre }).then(async result => {
            if (!!result) res.status(500).json({ error: "El evento ya existe" });
            else {
                const newId = (await Evento.query().max('id'))[0].max;
                Evento.query().insert({
                    id: newId + 1,
                    empresa: req.body.empresa,
                    nombre: req.body.nombre,
                    descripcion: req.body.descripcion,
                    fecha: req.body.fecha,
                    ubicacion: req.body.ubicacion,
                    precio: Number(req.body.precio),
                    artista: req.body.artista,
                    aforo: Number(req.body.aforo),
                    activo: Boolean(req.body.activo)
                }).then(insertResult => {

                    res.status(200).json({ status: "OK" })
                }).catch(error => {

                    res.status(500).json({
                        status: "Fallo al crear un evento", err: error
                    })
                })
            }
        })
    } else {
        res.status(401).json({ err: "No tienes acceso, no estas verificado" })
    }
});

app.post("/eventos/delete", (req, res) => {

    if (isVerified(req.body.username)) {
        const dbQuery = Evento.query();
        dbQuery.findById(req.body.id).then(async result => { // <-- En empresa lo mismo
            if (!!result) {
                dbQuery.deleteById(req.body.id).then(insertResult => {
                    res.status(200).json({ status: "OK" })
                }).catch(error => {
                    res.status(500).json({ status: "Fallo al eliminar el evento" })
                })
            } else {
                res.status(500).json({ error: "El evento no existe" });
            }
        })
    } else {
        res.status(401).json({ err: "No tienes acceso, no estas verificado" })
    }
});

app.post('/eventos/active', (req, res) => {

    if (isVerified(req.body.empresa)) {

        if (!!req.body && req.body !== {}) {
            //Filtrado por verificado
            if (!!req.body.id) {
                if (!!req.body.activo === false) {

                    const consulta = Evento.query().throwIfNotFound();
                    consulta.update({ activo: true }).where('Evento.id', '=', req.body.id);
                    consulta.then(results =>
                        res.status(200)
                            .json({ status: 'Evento activo' }))
                        .catch(err => res.status(500)
                            .json({ "error": err }));

                } else if (!!req.body.activo === true) {

                    const consulta = Evento.query().throwIfNotFound();
                    consulta.update({ activo: false }).where('Evento.id', '=', req.body.id);
                    consulta.then(results =>
                        res.status(200)
                            .json({ status: 'Evento no activo' }))
                        .catch(err => res.status(500)
                            .json({ "error": err }));
                }
            } else {
                res.status(401).json({ status: 'no se ha especificado el evento' });
            }
        }
    } else {
        res.status(401).json({ err: "No tienes acceso, no estas verificado" })
    }
});

// Endpoint: POST /ventas --> Devuelve todas las ventas
app.post('/ventas', async (req, res) => {

    let palante = false;
    //const palante = await ();
    const consulta = await Ventas.query().throwIfNotFound().catch(errorNF => { palante = false });
    if(!!consulta){
        palante = true;
    }else{
        palante = false
    }
    if (palante) {
        if (!!req.body && req.body !== {}) {

            if (!!req.body.empresa) {
                const isVerifiedResult = await isVerified(req.body.empresa);
                if (isVerifiedResult) {
                    Ventas.query().where('Ventas.empresa', '=', req.body.empresa).then(results => res.status(200).json(results))
                } else {
                    res.status(401).json({ err: "No tienes acceso, no estás verificado" });
                }
            } else if (!!req.body.cliente) {
                Ventas.query().where('Ventas.cliente', '=', req.body.cliente).then(results => { res.status(200).json(results)});
            } else {
                // Filtrado por ID
                if (!!req.body.id) {
                    Ventas.query().findById(req.body.id).then(results => res.status(200).json(results));
                } else {
                    Ventas.query().then(results => res.status(200).json(results));
                }
            }
        } else res.status(500).json({ "error": err });
    } else {
        
        res.status(500).json({ "error": "palante no", palante: palante });
    }


});

// Endpoint: POST /entradas --> Devuelve todos los entradas
app.post('/entradas', async (req, res) => {
    

    const consulta = Entrada.query().throwIfNotFound();
    if (!!req.body && req.body !== {}) {

        // Filtrado por ID
        if (!!req.body.id) consulta.findById(req.body.id);

        //Filtrado por eventos
        if (!!req.body.evento) {
            consulta.where({ evento: Number(req.body.evento) });
        }
    }
    consulta.then(results => res.status(200).json(results)).catch(err => res.status(500).json({ "error": err }));
});

// Endpoint: POST /entradas --> Devuelve todos los entradas
app.post('/entradas/new', async (req, res) => {
    

    if (await isVerified(req.body.empresa)) {
        Entrada.query().findOne({ empresa: req.body.empresa, evento: Number(req.body.evento), descripcion: req.body.descripcion }).then(async result => {
            if (!!result) res.status(500).json({ error: "Esa entrada ya existe para ese evento" });
            else {
                const newId = (await Entrada.query().max('id'))[0].max;
                Entrada.query().insert({
                    id: newId + 1,
                    empresa: req.body.empresa,
                    evento: Number(req.body.evento),
                    descripcion: req.body.descripcion,
                    precio: Number(req.body.precio),
                    entradasdisponibles: Number(req.body.entradas),
                }).then(insertResult => {

                    res.status(200).json({ status: "OK" })
                }).catch(error => {

                    res.status(500).json({
                        status: "Fallo al crear la entrada", err: error
                    })
                })
            }
        })
    } else {
        res.status(401).json({ err: "No tienes acceso, no estas verificado" })
    }

});


app.post('/profile', async (req, res) => {

    //Esto se inicializa undefined
    let consulta;
    

    //if (!!req.isAuthenticated()) {
    if (!!req.body && req.body !== {}) {
        //Filtrado por tipo de usuario
        if (!!req.body.typeUserProfile) {
            if (req.body.typeUserProfile == 'cliente') {
                consulta = Cliente.query().throwIfNotFound();
                // Filtrado por email
                if (!!req.body.email) consulta.findById(req.body.email);

                consulta.then(results => res.status(200).json(results)).catch(err => res.status(500).json({ "error": err }));
            }
            if (req.body.typeUserProfile == 'empresa') {
                consulta = Empresa.query().throwIfNotFound();
                // Filtrado por email
                if (!!req.body.email) consulta.findById(req.body.email);

                consulta.then(results => res.status(200).json(results)).catch(err => res.status(500).json({ "error": err }));
            }
        }
    } else {
        res.status(500).json({ error: "Body vacío" });
    }
    //} else res.status(401).json({ error: "Sesión no iniciada" });
});

app.post('/profile/edit', async (req, res) => {

    //Esto se inicializa undefined
    let consulta;
    


    if (!!req.body && req.body !== {}) {
        //Filtrado por tipo de usuario
        if (!!req.body.typeUserProfile) {
            if (req.body.typeUserProfile == 'cliente') {
                consulta = Cliente.query().throwIfNotFound();
                // Filtrado por email
                if (!!req.body.username) {
                    consulta.findById(req.body.username).then(async result => { // <-- En empresa lo mismo
                        if (!!result) {
                            consulta.update({
                                email: req.body.username,
                                unsecurePassword: String(req.body.password),
                                nombre: req.body.nombre,
                                apellidos: req.body.apellidos,
                                dni: req.body.dni,
                                fechanacimiento: req.body.fechanacimiento
                            }).where('Cliente.email', '=', req.body.username).then(insertResult => {

                                res.status(200).json({ status: "OK" })
                            }).catch(error => {
                                
                                res.status(500).json({ error: "Fallo al editar el usuario" })
                            })
                        }
                        else {
                            res.status(500).json({ error: "El usuario no existe" });
                        }
                    })
                }
                else {
                    res.status(500).json({ error: "no se ha especificado un username" })
                }
            } else if (req.body.typeUserProfile == 'empresa') {
                consulta = Empresa.query().throwIfNotFound();
                // Filtrado por email
                if (!!req.body.username) {
                    consulta.findById(req.body.username).then(async result => { // <-- En empresa lo mismo
                        if (!!result) {
                            consulta.update({
                                email: req.body.username,
                                unsecurePassword: String(req.body.password),
                                nombre: req.body.nombre,
                                telefono: req.body.telefono,
                                cif: req.body.cif,
                                domicilio: req.body.domicilio,
                                responsable: req.body.responsable,
                                capital: req.body.capital
                            }).where('Empresa.email', '=', req.body.username).then(insertResult => {

                                res.status(200).json({ status: "OK" })
                            }).catch(error => {

                                res.status(500).json({ status: "Fallo al editar la empresa" })
                            })
                        }
                        else {
                            res.status(500).json({ error: "La empresa no existe" });
                        }
                    })
                }
                else {
                    res.status(500).json({ error: "no se ha especificado un username" })
                }
            }
            else {
                
                res.status(500).json({ error: "no se ha especificado user type válido dentro de las categorias que hay" })
            }
        }
        else {
            res.status(500).json({ error: "no se ha especificado user type" })
        }
    } else {
        res.status(500).json({ error: "Body vacío" });
    }
});


// Endpoint: GET /eventos --> Devuelve el evento por id
app.get('/payment/:id/:num', (req, res) => {
    const entradaId = req.params.id;
    const entradaCantidad = req.params.num;
    const consulta = Entrada.query().throwIfNotFound();
    consulta.findById(entradaId);
    consulta.then(results => {
        const coste = results.precio * entradaCantidad;
        res.status(200).json({ entrada: entradaId, info: results.descripcion, cantidad: entradaCantidad, precio: coste });
    }).catch(err => res.status(500).json({ "error": err }));
});

// Endpoint: 
app.post('/payment', (req, res) => {

    let precio;
    let precioTotal;
    let entradasPrevias;

    const consulta = Entrada.query().throwIfNotFound();

    if (!!req.body && req.body !== {}) {
        // Filtrado por ID para calcular precio
        if (!!req.body.entrada || !!req.body.cantidad) {
            consulta.findById(req.body.entrada).then(response => {
                precio = response.precio;
                precioTotal = precio * req.body.cantidad;
                entradasPrevias = response.entradasdisponibles;


                axios({
                    url: 'https://pse-payments-api.ecodium.dev/payment',
                    method: 'POST',
                    data: {
                        clientId: 4,
                        paymentDetails: {
                            creditCard: {
                                cardNumber: req.body.tarjeta,
                                cvv: req.body.cvv,
                                expiresOn: String(req.body.caducidad)
                            },
                            totalAmount: String(precioTotal)
                        }
                    }
                }).then(result => {
                    if (result.data.success === true) {
                        const venta = Ventas.query();
                        venta.insert({
                            id: result.data._id,
                            entrada: Number(req.body.entrada),
                            empresa: response.empresa,
                            evento: response.evento,
                            cliente: req.body.email,
                            cantidad: Number(req.body.cantidad),
                            precio: precioTotal,
                            descripcion: response.descripcion
                        }).then(insercion => {
                            //Entrada.query().update({ entradasdisponibles: Number(entradasPrevias - Number(req.body.cantidad)) }).where('Entrada.id', '=', Number(req.body.entrada));
                            res.status(200).json({ status: "Compra realizada", success: result.data.success, id: result.data._id });
                        }).catch(errorInser => {
                            
                            res.status(500).json({ status: "Fallo al insertar", success: result.data.success, id: result.data._id, errors: result.data.errors });
                        });
                    } else {
                        res.status(500).json({ status: "Fallo al realizar el pago", success: result.data.success, id: result.data._id, errors: result.data.errors });
                    }
                }).catch(er => {
                    res.status(500).json({ error: er, hola: 'soy concha', success: false })

                })
            })

        }
        else res.status(500).json({ status: "No se ha especificado el id de entrada o la cantidad" })

    } else res.status(401).json({ status: "No hay body bro" })


});

// Endpoint: 
/*app.post('/isLogged', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ logged: "OK" })
    }
    else {
        res.json({ auth: req.isAuthenticated(), logged: "NO" })
    }
});*/

// Endpoint: 
app.post('/isVerif', async (req, res) => {
    if (await isVerified(req.body.empresa)) {
        res.status(200).json({ verif: true });
    } else {
        res.status(200).json({ verif: false });
    }
});

async function isVerified(email) {
    try {
        const result = await Empresa.query().findById(email);
        if (result.verificado === true) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        return false;
    }
}

// Definimos el puerto 3000 como puerto de escucha y un mensaje de confirmación cuando el servidor esté levantado
app.listen(8080, () => {
    console.log(`Servidor escuchando en el puerto 8080`);
});