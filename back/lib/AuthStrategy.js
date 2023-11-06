import { Strategy as LocalStrategy } from 'passport-local';
import Admin from '../models/Admin.js';
import Cliente from '../models/Cliente.js';
import Empresa from '../models/Empresa.js';
import bcrypt from 'bcrypt';
import passport from 'passport';

export const strategyInit = passport => {

    // Configuración de la estrategia "admin" para Passport
    passport.use('admin', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    },
        (username, password, done) => {
            // Buscar el admin por su email en la base de datos
            Admin.query().findOne({ email: username }).then(user => {
                if (!user) {
                    return done(null, false, { err: 'Usuario desconocido' });
                }
                // Verificar la contraseña proporcionada con la contraseña almacenada en la base de datos
                user.verifyPassword(String(password), (err, passwordIsCorrect) => {
                    if (err) {
                        return done(err);
                    }
                    if (!passwordIsCorrect) {
                        return done(null, false);
                    }
                    // Si la contraseña es correcta, se pasa el usuario al siguiente middleware
                    return done(null, user);
                });
            }).catch(err => {
                done(err);
            });
        }
    ));

    // Configuración de la estrategia "cliente" para Passport
    passport.use('cliente', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    },
        (username, password, done) => {
            // Buscar el cliente por su email en la base de datos
            Cliente.query().findOne({ email: username }).then(user => {
                if (!user) {
                    return done(null, false, { err: 'Usuario desconocido' });
                }
                // Verificar la contraseña proporcionada con la contraseña almacenada en la base de datos
                user.verifyPassword(String(password), (err, passwordIsCorrect) => {
                    if (err) {
                        return done(err);
                    }
                    if (!passwordIsCorrect) {
                        return done(null, false);
                    }
                    // Si la contraseña es correcta, se pasa el usuario al siguiente middleware
                    return done(null, user);
                });
            }).catch(err => {
                done(err);
            });
        }
    ));

    // Configuración de la estrategia "empresa" para Passport
    passport.use('empresa', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
    },
        (username, password, done) => {
            // Buscar la empresa por su email en la base de datos
            Empresa.query().findOne({ email: username }).then(user => {
                if (!user) {
                    return done(null, false, { err: 'Usuario desconocido' });
                }
                // Verificar la contraseña proporcionada con la contraseña almacenada en la base de datos
                user.verifyPassword(String(password), (err, passwordIsCorrect) => {
                    if (err) {
                        return done(err);
                    }
                    if (!passwordIsCorrect) {
                        return done(null, false);
                    }
                    // Si la contraseña es correcta, se pasa el usuario al siguiente middleware
                    return done(null, user);
                });
            }).catch(err => {
                done(err);
            });
        }
    ));

    // Serializar usuarios
    passport.serializeUser((user, done) => {
        const userType = user instanceof Cliente ? 'cliente' : user instanceof Empresa ? 'empresa' : user instanceof Admin ? 'admin' : undefined // <-- obj instanceof Modelo devuelve true si obj es una instancia de ese model
        done(null, {
            email: user.email, // <-- Serializar el identificador de un usuario
            userType
        })
    })

    // Deserializar usuarios
    passport.deserializeUser((user, done) => {
        const dbQuery = user.userType === 'cliente'
            ? Cliente.query().findById(user.email)
            : user.userType === 'empresa'
                ? Empresa.query().findById(user.email)
                : user.userType === 'admin'
                    ? Admin.query().findById(user.email)
                    : null;
        if (!!dbQuery) {
            dbQuery.then(res => done(null, res))
        } else done(null, null);
    })
}

export default strategyInit;
