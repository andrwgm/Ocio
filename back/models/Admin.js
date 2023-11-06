import { Model } from 'objection';
import bcrypt from 'bcrypt';

export default class Admin extends Model {

    // Nombre de la tabla
    static tableName = 'Admin';

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
            }
        }
    }

    // Cifrado de contraseña
    set unsecurePassword(unsecurePassword) {
        this.contrasena = bcrypt.hashSync(unsecurePassword, bcrypt.genSaltSync(10))
    };

    // Validación de contraseña
    verifyPassword(unsecurePassword, callback) {
        return bcrypt.compare(String(unsecurePassword), String(this.contrasena), callback)
    };
}