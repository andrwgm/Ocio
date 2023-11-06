import { Model } from 'objection';
import Empresa from './Empresa.js';
import Evento from './Evento.js';
import Entrada from './Entrada.js';
import Cliente from './Cliente.js';

export default class Ventas extends Model {

    // Nombre de la tabla
    static tableName = 'Ventas';

    // Clave primaria
    static idColumn = 'id';

    // Esquema de datos
    static jsonSchema = {
        type: 'object',
        properties: {
            id: {
                type: 'string'
            },
            entrada: {
                type: 'number'
            },
            empresa: {
                type: 'string',
                maxLength: 50
            },
            evento: {
                type: 'number'
            },
            cliente: {
                type: 'string',
                maxLength: 50
            },
            cantidad: {
                type: 'number'
            },
            precio: {
                type: 'number'
            },
            descripcion: {
                type: 'string'
            }
        }
    }

    // Relaciones
    static relationMappings = () => ({
        establecerEntrada: {
            relation: Model.HasOneRelation,
            modelClass: Entrada,
            join: {
                from: 'Ventas.entrada',
                to: 'Entrada.id'
            }
        },
        establecerEvento: {
            relation: Model.HasOneRelation,
            modelClass: Evento,
            join: {
                from: 'Ventas.evento',
                to: 'Evento.id'
            }
        },
        establecerEmpresa: {
            relation: Model.HasOneRelation,
            modelClass: Empresa,
            join: {
                from: 'Ventas.empresa',
                to: 'Empresa.email'
            }
        },
        establecerCliente: {
            relation: Model.HasOneRelation,
            modelClass: Cliente,
            join: {
                from: 'Ventas.cliente',
                to: 'Cliente.email'
            }
        }
    })
}