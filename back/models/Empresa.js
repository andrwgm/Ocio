import { Model } from 'objection';
import bcrypt from 'bcrypt';

import Evento from './Evento.js';

export default class Empresa extends Model {

    // Nombre de la tabla
    static tableName = 'Empresa';

    // Clave primaria
    static idColumn = 'email';

    // Esquema de datos
    static jsonSchema = {
        type: 'object',
        properties: {
            email: {
                type: 'string',
                maxLength: 50
            },
            contrasena: {
                type: 'string',
                maxLength: 60
            },
            nombre: {
                type: 'string',
                maxLength: 30
            },
            telefono: {
                type: 'string',
                maxLength: 15
            },
            cif: {
                type: 'string',
                maxLength: 15
            },
            domicilio: {
                type: 'string',
                maxLength: 100
            },
            responsable: {
                type: 'string',
                maxLength: 50
            },
            capital: {
                type: 'string',
                maxLength: 30
            },
            verificado: {
                type: 'boolean'
            }
        }
    }

    // Relaciones
    static relationMappings = () => ({
        publicar: {
            relation: Model.HasManyRelation,
            modelClass: Evento,
            join: {
                from: 'Empresa.email',
                to: 'Evento.empresa'
            },

        }
    })

    // Cifrado de contraseña
    set unsecurePassword(unsecurePassword) {
        this.contrasena = bcrypt.hashSync(unsecurePassword, bcrypt.genSaltSync(10))
    };

    // Validación de contraseña
    verifyPassword(unsecurePassword, callback) {
        return bcrypt.compare(String(unsecurePassword), String(this.contrasena), callback)
    };
}