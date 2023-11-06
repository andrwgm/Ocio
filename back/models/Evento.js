import { Model } from 'objection';
import Empresa from './Empresa.js';
import Entrada from './Entrada.js';

export default class Evento extends Model {

    // Nombre de la tabla
    static tableName = 'Evento';

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
            nombre: {
                type: 'string',
                maxLength: 50
            },
            descripcion: {
                type: 'string',
                maxLength: 500
            },
            fecha: {
                type: 'string'
            },
            ubicacion: {
                type: 'string',
                maxLength: 100
            },
            precio: {
                type: 'number'
            },
            artista: {
                type: 'string',
                maxLength: 50
            },
            aforo: {
                type: 'number'
            },
            activo: {
                type: 'boolean'
            }
        }
    }

    // Relaciones
    static relationMappings = () => ({
        publicar: {
            relation: Model.HasOneRelation,
            modelClass: Empresa,
            join: {
                from: 'Evento.empresa',
                to: 'Empresa.email'
            }
        },
        establecer: {
            relation: Model.HasManyRelation,
            modelClass: Entrada,
            join: {
                from: 'Evento.id',
                to: 'Entrada.evento'
            }
        }
    })
}