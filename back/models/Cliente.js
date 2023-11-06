import { Model } from 'objection';
import bcrypt from 'bcrypt';

import Entrada from './Entrada.js';
import Ventas from './Ventas.js';

export default class Cliente extends Model {

    // Nombre de la tabla
    static tableName = 'Cliente';

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
            apellidos: {
                type: 'string',
                maxLength: 50
            },
            dni: {
                type: 'string',
                maxLength: 15
            },
            fechanacimiento: {
                type: 'string'
            }
        }
    }

    // Relaciones
    static relationMappings = () => ({
        ventas: {
            relation: Model.ManyToManyRelation,
            modelClass: Entrada,
            join: {
                from: 'Cliente.email',
                through: {
                    modelClass: Ventas,
                    from: 'Ventas.cliente',
                    to: 'Ventas.entrada'
                },
                to: 'Entrada.id'
            }
        },
        comprar: {
            relation: Model.HasManyRelation,
            modelClass: Ventas,
            join: {
                from: 'Cliente.email',
                to: 'Ventas.cliente'
            }
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