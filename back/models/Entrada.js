import { Model } from 'objection';

import Empresa from './Empresa.js';
import Evento from './Evento.js';
import Ventas from './Ventas.js';
import Cliente from './Cliente.js';

export default class Entrada extends Model {

    // Nombre de la tabla
    static tableName = 'Entrada';

    // Clave primaria
    static idColumn = 'id';

    // Esquema de datos
    static jsonSchema = {
        type: 'object',
        properties: {
            id: {
                type: 'number'
            },
            empresa: {
                type: 'string',
                maxLength: 50
            },
            evento: {
                type: 'number'
            },
            descripcion: {
                type: 'string',
                maxLength: 500
            },
            precio: {
                type: 'number'
            },
            entradasdisponibles: {
                type: 'number'
            }
        }
    }

    // Relaciones
    static relationMappings = () => ({
        ventas: {
            relation: Model.ManyToManyRelation,
            modelClass: Cliente,
            join: {
                from: 'Entrada.id',
                through: {
                    modelClass: Ventas,
                    from: 'Ventas.entrada',
                    to: 'Ventas.cliente'
                },
                to: 'Cliente.email'
            }
        },
        vender: {
            relation: Model.HasManyRelation,
            modelClass: Ventas,
            join: {
                from: 'Entrada.id',
                to: 'Ventas.entrada'
            }
        },
        establecer: {
            relation: Model.HasOneRelation,
            modelClass: Evento,
            join: {
                from: 'Entrada.evento',
                to: 'Evento.id'
            }
        },
        relempresa: {
            relation: Model.HasOneRelation,
            modelClass: Empresa,
            join: {
                from: 'Entrada.empresa',
                to: 'Empresa.email'
            }
        }
    })
}