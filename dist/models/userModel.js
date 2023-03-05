"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = require("mysql2/promise");
class UserModel {
    constructor() {
        this.config(); //aplicamos la conexion con la BD.
    }
    config() {
        return __awaiter(this, void 0, void 0, function* () {
            this.db = yield promise_1.createPool({
                host: 'blto8v3zcreb9b7rgewp-mysql.services.clever-cloud.com',
                user: 'utjng23uz82553tn',
                password: 'IWsnwR20lAPraZ0aAicI',
                database: 'blto8v3zcreb9b7rgewp',
                connectionLimit: 10
            });
        });
    }
    listar() {
        return __awaiter(this, void 0, void 0, function* () {
            //const db=this.connection;
            const usuarios = yield this.db.query('SELECT * FROM usuario');
            //console.log(usuarios[0]);
            //devuelve tabla mas propiedades. Solo debemos devolver tabla. Posicion 0 del array devuelto.
            return usuarios[0];
        });
    }
    listarAnimales() {
        return __awaiter(this, void 0, void 0, function* () {
            //const db=this.connection;
            const animales = yield this.db.query('SELECT * FROM animal');
            //console.log(usuarios[0]);
            //devuelve tabla mas propiedades. Solo debemos devolver tabla. Posicion 0 del array devuelto.
            return animales[0];
        });
    }
    listarAnimalesAdoptados() {
        return __awaiter(this, void 0, void 0, function* () {
            const animales = yield this.db.query('SELECT * FROM animal where estado = 3');
            return animales[0];
        });
    }
    listarAnimalesSinAdoptar() {
        return __awaiter(this, void 0, void 0, function* () {
            const animales = yield this.db.query('SELECT * FROM animal where estado = 1 or estado = 2');
            return animales[0];
        });
    }
    fechaAdoptados() {
        return __awaiter(this, void 0, void 0, function* () {
            const fechaAdoptado = yield this.db.query('SELECT * FROM proceso_adopcion');
            return fechaAdoptado[0];
        });
    }
    //Notificaciones
    notificacionesListar(id) {
        return __awaiter(this, void 0, void 0, function* () {
            //const db=this.connection;
            const notificaciones = yield this.db.query('SELECT * FROM ( SELECT  0 as est,u.nombre as nombreI, u.apellido as apellidoI, ai.idInteresado as interesado, ai.idAnimal as animal, ai.fecha_interes as fecha FROM animal_interesado as ai inner join animal as a ON a.id = ai.idAnimal inner join usuario as u on u.id=ai.idInteresado WHERE a.idDador = ? UNION SELECT 1 as est, u.nombre as nombreI, u.apellido as apellidoI, a.idDador as interesado, pa.id_animal as animal, pa.fecha_inicio as fecha FROM animal as a inner join proceso_adopcion as pa ON a.id = pa.id_animal inner join usuario as u on u.id=a.idDador WHERE pa.id_usuario= ? UNION SELECT 2 as est, u.nombre as nombreI, u.apellido as apellidoI, pa.id_usuario as interesado, pa.id_animal as animal, pa.fecha_fin as fecha FROM proceso_adopcion as pa inner join animal as a ON a.id = pa.id_animal inner join usuario as u on u.id=pa.id_usuario WHERE a.idDador = ? and pa.fecha_fin is not null ) as notificaciones order by fecha desc', [id, id, id]);
            /*El sql q  esta en una sola linea pero separado para q se entienda
            SELECT * FROM (
            SELECT  0 as est,u.nombre as nombreI, u.apellido as apellidoI, ai.idInteresado as interesado, ai.idAnimal as animal, ai.fecha_interes as fecha
            FROM animal_interesado as ai
            inner join animal as a ON a.id = ai.idAnimal
            inner join usuario as u on u.id=ai.idInteresado
            WHERE a.idDador = ?
            UNION
            SELECT 1 as est, u.nombre as nombreI, u.apellido as apellidoI, a.idDador as interesado, pa.id_animal as animal, pa.fecha_inicio as fecha
            FROM animal as a
            inner join proceso_adopcion as pa ON a.id = pa.id_animal
            inner join usuario as u on u.id=a.idDador
            WHERE pa.id_usuario= ?
            UNION
            SELECT 2 as est, u.nombre as nombreI, u.apellido as apellidoI, pa.id_usuario as interesado, pa.id_animal as animal, pa.fecha_fin as fecha
            FROM proceso_adopcion as pa
            inner join animal as a ON a.id = pa.id_animal
            inner join usuario as u on u.id=pa.id_usuario
            WHERE a.idDador = ? and pa.fecha_fin is not null
            ) as notificaciones order by fecha desc
            */
            //console.log(usuarios[0]);
            //devuelve tabla mas propiedades. Solo debemos devolver tabla. Posicion 0 del array devuelto.
            return notificaciones[0];
        });
    }
    //Notificaciones
    notificacionesConteo(id) {
        return __awaiter(this, void 0, void 0, function* () {
            //const db=this.connection;
            const conteo = yield this.db.query('SELECT (SELECT COUNT(*) as cuenta FROM animal_interesado as ai INNER JOIN animal as a ON ai.idAnimal=a.id WHERE ai.visto=0 AND a.idDador=? ) + (SELECT COUNT(*)  as cuenta FROM  proceso_adopcion as pa INNER JOIN animal as a ON pa.id_animal=a.id WHERE pa.vistoFinalizado=0 AND a.idDador=? AND pa.fecha_fin is not null ) + (SELECT COUNT(*)  as cuenta FROM  proceso_adopcion as pa INNER JOIN animal as a ON pa.id_animal=a.id WHERE pa.vistoPendiente=0 AND pa.id_usuario=? AND pa.fecha_fin is null ) AS SumCount', [id, id, id]);
            /*
            SELECT (SELECT COUNT(*) as cuenta FROM animal_interesado as ai
            INNER JOIN animal as a ON ai.idAnimal=a.id
            WHERE ai.visto=0 AND a.idDador=? )
            +
            (SELECT COUNT(*)  as cuenta FROM  proceso_adopcion as pa
            INNER JOIN animal as a ON pa.id_animal=a.id
            WHERE pa.vistoFinalizado=0 AND a.idDador=? AND pa.fecha_fin is not null )
            +
            (SELECT COUNT(*)  as cuenta FROM  proceso_adopcion as pa
            INNER JOIN animal as a ON pa.id_animal=a.id
            WHERE pa.vistoPendiente=0 AND pa.id_usuario=? AND pa.fecha_fin is null )
            AS SumCount
            */
            return conteo[0][0];
        });
    }
    notificacionesVistas(id) {
        return __awaiter(this, void 0, void 0, function* () {
            //const db=this.connection;
            const result1 = yield this.db.query('UPDATE animal_interesado as ai INNER JOIN animal as a ON ai.idAnimal=a.id SET ai.visto=1 WHERE ai.visto=0 AND a.idDador=?', [id]);
            const result2 = yield this.db.query('UPDATE proceso_adopcion as pa INNER JOIN animal as a ON pa.id_animal=a.id SET pa.vistoFinalizado=1 WHERE pa.vistoFinalizado=0 AND a.idDador=? AND pa.fecha_fin is not null', [id]);
            const result3 = yield this.db.query('UPDATE proceso_adopcion as pa INNER JOIN animal as a ON pa.id_animal=a.id SET pa.vistoPendiente=1 WHERE pa.vistoPendiente=0 AND pa.id_usuario=? AND pa.fecha_fin is null', [id]);
            /*
            UPDATE animal_interesado as ai
            INNER JOIN animal as a ON ai.idAnimal=a.id
            SET ai.visto=1
            WHERE ai.visto=0 AND a.idDador=?
    
            UPDATE proceso_adopcion as pa
            INNER JOIN animal as a ON pa.id_animal=a.id
            SET pa.vistoFinalizado=1
            WHERE (pa.vistoFinalizado=0 AND pa.id_usuario=? AND pa.fecha_fin is null)
    
            UPDATE proceso_adopcion as pa
            INNER JOIN animal as a ON pa.id_animal=a.id
            SET pa.vistoPendiente=1
            WHERE pa.vistoPendiente=0 AND a.idDador=? AND pa.fecha_fin is not null
            */
            return result1[0];
        });
    }
    listAnimalsFiltrado(incluye, excluye) {
        return __awaiter(this, void 0, void 0, function* () {
            //Devuelve todas las filas de la tabla usuario
            //const db=this.connection;
            var animales = [];
            console.log("modal");
            console.log("incluye", incluye);
            console.log("excluye", excluye);
            var keysIncluye = Object.keys(incluye);
            var keysExcluye = Object.keys(excluye);
            var incluyeIN = "";
            var excluyeIN = "";
            var excluyeNOTIN = "";
            var inORexWHERE = "";
            var inANDex = "";
            var sqlQuery = "";
            var noAdoptados = "";
            var queryKeyInlcuye = "";
            var queryKeyExcluye = "";
            var and = "";
            var or = "";
            if (keysIncluye.length > 0) {
                //inORexWHERE="WHERE"
                noAdoptados = " AND estado = 1 or estado = 2";
                incluyeIN = " IN (?)";
                for (var i = 0; i < keysIncluye.length; i++) {
                    if (i > 0) {
                        and = " AND ";
                        queryKeyInlcuye = `${queryKeyInlcuye}${and}${keysIncluye[i]}${incluyeIN}`;
                    }
                    else {
                        queryKeyInlcuye = `${keysIncluye[i]}${incluyeIN}`;
                    }
                }
            }
            if (keysExcluye.length > 0) {
                //inORexWHERE=" WHERE "
                noAdoptados = " AND estado = 1 or estado = 2";
                excluyeNOTIN = "id NOT IN (SELECT id FROM animal WHERE ";
                excluyeIN = " IN (?)";
                for (var y = 0; y < keysExcluye.length; y++) {
                    if (y > 0) {
                        or = " OR ";
                        queryKeyExcluye = `${queryKeyExcluye}${or}${keysExcluye[y]}${excluyeIN}`;
                    }
                    else {
                        queryKeyExcluye = `${keysExcluye[y]}${excluyeIN}`;
                    }
                }
                queryKeyExcluye = `${excluyeNOTIN}${queryKeyExcluye})`;
            }
            if (keysIncluye.length > 0 && keysExcluye.length > 0) {
                inANDex = " AND ";
            }
            if (keysIncluye.length == 0 && keysExcluye.length == 0) {
                noAdoptados = " estado = 1 or estado = 2";
            }
            //where estado = 1 or estado = 2
            inORexWHERE = " WHERE ";
            sqlQuery = `SELECT * FROM animal ${inORexWHERE}${queryKeyInlcuye}${inANDex}${queryKeyExcluye}${noAdoptados}`;
            console.log(sqlQuery);
            var incluyeItera = keysIncluye.length;
            var excluyeItera = keysExcluye.length;
            var sumaKeys = incluyeItera + excluyeItera;
            var arrayDB = [];
            for (var i = 0; i < sumaKeys; i++) {
                if (incluyeItera > 0) {
                    arrayDB.push(incluye[`${keysIncluye[i]}`]);
                    incluyeItera--;
                }
                if (incluyeItera == 0 && excluyeItera > 0) {
                    arrayDB.push(excluye[`${keysExcluye[i]}`]);
                    excluyeItera--;
                }
            }
            console.log("arrayDB", arrayDB);
            console.log(`${sqlQuery}`, arrayDB);
            animales = yield this.db.query(`${sqlQuery}`, arrayDB);
            return animales[0];
            /*
            animales = await this.db.query('SELECT * FROM animal WHERE tipo IN (?) AND tamano IN (?) AND id NOT IN (SELECT id FROM animal WHERE tipo IN (?) OR tamano IN (?))', [incluyeTipo, incluyeTamano, excluyeTipo, excluyeTamano]);
                        
    
            /*
    
            console.log("Tipo i",incluyeTipo);
            console.log("Tipo e",excluyeTipo);
            console.log("Tamano i",incluyeTamano);
            console.log("Tamano e",excluyeTamano);
            
    
            if(incluyeTipo.length==0){
                console.log("incluyeTipo null");
                if(excluyeTipo.length==0){
                    console.log("excluyeTipo null");
                    if(incluyeTamano.length==0){
                        console.log("incluyeTamano null");
                        if(excluyeTamano.length==0){
                            console.log("Todas null");
                            animales = await this.db.query('SELECT * FROM animal');
                        } else {
                            console.log("excluyeTamano tiene");
                            animales = await this.db.query('SELECT * FROM animal WHERE tamano NOT IN (?)', [excluyeTamano]);
                        }
                    } else {
                        console.log("incluyeTamano tiene");
                        if(excluyeTamano.length==0){
                            console.log("excluyeTamano null");
                            animales = await this.db.query('SELECT * FROM animal WHERE tamano IN (?)', [incluyeTamano]);
                        } else {
                            console.log("excluyeTamano tiene");
                            animales = await this.db.query('SELECT * FROM animal WHERE tamano IN (?) AND id NOT IN (SELECT id FROM animal WHERE tamano IN (?))', [incluyeTamano, excluyeTamano]);
                        }
                    }
                } else {
                    console.log("excluyeTipo tiene")
                    if(incluyeTamano.length==0){
                        console.log("incluyeTamano null");
                        if(excluyeTamano.length==0){
                            console.log("excluyeTamano null");
                            animales = await this.db.query('SELECT * FROM animal WHERE tipo NOT IN (?)', [excluyeTipo]);
                        } else {
                            console.log("excluyeTamano tiene");
                            animales = await this.db.query('SELECT * FROM animal WHERE tipo NOT IN (?) AND tamano NOT IN (?)', [excluyeTipo, excluyeTamano]);
                        }
                    } else {
                        console.log("incluyeTamano tiene");
                        if(excluyeTamano.length==0){
                            console.log("excluyeTamano null");
                            animales = await this.db.query('SELECT * FROM animal WHERE tipo NOT IN (?) AND tamano IN (?)', [excluyeTipo, incluyeTamano]);
                        } else {
                            console.log("excluyeTamano tiene");
                            animales = await this.db.query('SELECT * FROM animal WHERE tipo NOT IN (?) AND tamano IN (?) AND id NOT IN (SELECT id FROM animal WHERE tamano IN (?))', [excluyeTipo, incluyeTamano, excluyeTamano]);
                        }
                    }
                }
            } else {
                console.log("IncluyeTipo tiene");
                if(excluyeTipo.length==0){
                    console.log("excluyeTipo null");
                    if(incluyeTamano.length==0){
                        console.log("incluyeTamano null");
                        if(excluyeTamano.length==0){
                            console.log("excluyeTamano null");
                            animales = await this.db.query('SELECT * FROM animal WHERE tipo IN (?)', [incluyeTipo]);
                        } else {
                            console.log("excluyeTamano tiene");
                            animales = await this.db.query('SELECT * FROM animal WHERE tipo IN (?) AND tamano NOT IN (?)', [incluyeTipo, excluyeTamano]);
                        }
                    } else {
                        console.log("incluyeTamano tiene");
                        if(excluyeTamano.length==0){
                            console.log("excluyeTamano null");
                            animales = await this.db.query('SELECT * FROM animal WHERE tipo IN (?) AND tamano IN (?)', [incluyeTipo, incluyeTamano]);
                        } else {
                            console.log("excluyeTamano tiene");
                            animales = await this.db.query('SELECT * FROM animal WHERE tipo IN (?) AND tamano IN (?) AND id NOT IN (SELECT id FROM animal WHERE tamano IN (?))', [incluyeTipo, incluyeTamano, excluyeTamano]);
                        }
                    }
                } else {
                    console.log("excluyeTipo tiene");
                    if(incluyeTamano.length==0){
                        console.log("incluyeTamano null");
                        if(excluyeTamano.length==0){
                            console.log("excluyeTamano null");
                            animales = await this.db.query('SELECT * FROM animal WHERE tipo IN (?) AND id NOT IN (SELECT id FROM animal WHERE tipo IN (?))', [incluyeTipo, excluyeTipo]);
                        } else {
                            animales = await this.db.query('SELECT * FROM animal WHERE tipo IN (?) AND id NOT IN (SELECT id FROM animal WHERE tipo IN (?)) AND tamano NOT IN (?)', [incluyeTipo, excluyeTipo, excluyeTamano]);
                        }
                    } else {
                        console.log("incluyeTamano tiene");
                        if(excluyeTamano.length==0){
                            console.log("excluyeTamano null");
                            animales = await this.db.query('SELECT * FROM animal WHERE tipo IN (?) AND id NOT IN (SELECT id FROM animal WHERE tipo IN (?)) AND tamano IN (?)', [incluyeTipo, excluyeTipo, incluyeTamano]);
    
                        } else {
                            console.log("todas tienen");
                            animales = await this.db.query('SELECT * FROM animal WHERE tipo IN (?) AND tamano IN (?) AND id NOT IN (SELECT id FROM animal WHERE tipo IN (?) OR tamano IN (?))', [incluyeTipo, incluyeTamano, excluyeTipo, excluyeTamano]);
                        }
                    }
                }
            }
            /*
    
            console.log(animales[0]);
            //
            //console.log(usuarios[0]);
            //devuelve tabla mas propiedades. Solo debemos devolver tabla. Posicion 0 del array devuelto.
            return animales[0];
            /**/
        });
    }
    listarAnimalesUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            //const db=this.connection;
            const animales = yield this.db.query('SELECT id, nombre FROM animal WHERE idDador = ?', [id]);
            //console.log(usuarios[0]);
            //devuelve tabla mas propiedades. Solo debemos devolver tabla. Posicion 0 del array devuelto.
            return animales[0];
        });
    }
    listarAnimalesUserAdoptados(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const animales = yield this.db.query('SELECT id, nombre FROM animal WHERE idDador = ? and estado = 3', [id]);
            return animales[0];
        });
    }
    listarAnimalesUserEnAdopcion(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const animales = yield this.db.query('SELECT id, nombre FROM animal WHERE idDador = ? and estado = 1 or estado = 2', [id]);
            return animales[0];
        });
    }
    //Devuelve un objeto cuya fila en la tabla usuarios coincide con id.
    //Si no la encuentra devuelve null
    buscarId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const encontrado = yield this.db.query('SELECT * FROM usuario WHERE id = ?', [id]);
            //Ojo la consulta devuelve una tabla de una fila. (Array de array) Hay que desempaquetar y obtener la unica fila al enviar
            if (encontrado.length > 1)
                return encontrado[0][0];
            return null;
        });
    }
    buscarIdAnimal(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const encontrado = yield this.db.query('SELECT id, idDador, nombre, sexo, tipo, DATE_FORMAT(fNac, "%Y-%m-%d") as fNac, tamano, peso, estado FROM animal WHERE id = ?', [id]);
            //Ojo la consulta devuelve una tabla de una fila. (Array de array) Hay que desempaquetar y obtener la unica fila al enviar
            if (encontrado.length > 1)
                return encontrado[0][0];
            return null;
        });
    }
    //Devuelve un objeto cuya fila en la tabla usuarios coincide con nombre.
    //Si no la encuentra devuelve null
    buscarNombre(nombre) {
        return __awaiter(this, void 0, void 0, function* () {
            const encontrado = yield this.db.query('SELECT * FROM usuario WHERE nombre = ?', [nombre]);
            //Ojo la consulta devuelve una tabla de una fila. (Array de array) Hay que desempaquetar y obtener la unica fila al enviar
            if (encontrado.length > 1)
                return encontrado[0][0];
            return null;
        });
    }
    //Devuelve un objeto cuya fila en la tabla usuarios coincide con nombre.
    //Si no la encuentra devuelve null
    buscarEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const encontrado = yield this.db.query('SELECT * FROM usuario WHERE email = ?', [email]);
            //Ojo la consulta devuelve una tabla de una fila. (Array de array) Hay que desempaquetar y obtener la unica fila al enviar
            if (encontrado.length > 1)
                return encontrado[0][0];
            return null;
        });
    }
    //Devuelve 1 si logro crear un nuevo usuario de la tabla usuarios
    crear(usuario) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = (yield this.db.query('INSERT INTO usuario SET ?', [usuario]))[0].affectedRows;
            console.log(result);
            return result;
        });
    }
    confirmarUsuario(confirmado, id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('confirmado => ', confirmado, 'id => ', id);
            const result = (yield this.db.query('UPDATE usuario SET confirmado = ? Where Id = ?', [confirmado, id]))[0].affectedRows;
            console.log('Confirmar usuario result =>', result);
            return result;
        });
    }
    crearAnimal(animal) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = (yield this.db.query('INSERT INTO animal SET ?', [animal]))[0].affectedRows;
            const result2 = (yield this.db.query('SELECT id FROM animal order by id desc limit 1'))[0][0];
            const { id } = result2;
            console.log("El result ", result2);
            console.log("El id", id);
            const result3 = (yield this.db.query('INSERT INTO animal_vacunas SET idAnimal = ?, 	Moquillo = 0, Primovacunacion= 0, Polivalente= 0, Rabia= 0, Castrado= 0  ', [id]))[0].affectedRows;
            return id;
        });
    }
    buscarAnimal(nombre, dador) {
        return __awaiter(this, void 0, void 0, function* () {
            const encontrado = yield this.db.query('SELECT * FROM animal WHERE nombre = ? and idDador = ?', [nombre, dador]);
            //Ojo la consulta devuelve una tabla de una fila. (Array de array) Hay que desempaquetar y obtener la unica fila al enviar
            if (encontrado.length > 1)
                return encontrado[0][0];
            return null;
        });
    }
    //Devuelve 1 si logro actualizar el usuario indicado por id
    actualizar(usuario, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = (yield this.db.query('UPDATE usuario SET ? WHERE id = ?', [usuario, id]))[0].affectedRows;
            console.log(result);
            return result;
        });
    }
    //Devuelve 1 si logro eliminar el usuario indicado por id
    eliminar(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = (yield this.db.query('DELETE FROM usuario WHERE id = ?', [id]))[0].affectedRows;
            console.log(user);
            return user;
        });
    }
    //Adopcion animal
    comenzarAdopcion(adopcionData) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("idAnimal y idUsuario", adopcionData.data);
            console.log("idAnimal cual es", adopcionData.data.id_animal);
            const estadoCambiado = (yield this.db.query('UPDATE animal SET estado = 2 WHERE id = ?', [adopcionData.data.id_animal]))[0].affectedRows;
            const result = (yield this.db.query('INSERT INTO proceso_adopcion SET ?', [adopcionData.data]))[0].affectedRows;
            return result;
        });
    }
    confirmarAdopcion(idAnimal, idUsuario) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("idAnimal y idUsuario", idAnimal, idUsuario);
            const estadoCambiado = (yield this.db.query('UPDATE animal SET estado = 3 WHERE id = ?', [idAnimal]))[0].affectedRows;
            const result = (yield this.db.query('UPDATE proceso_adopcion SET fecha_fin = CURRENT_TIMESTAMP WHERE id_usuario=? AND id_animal=?', [idUsuario, idAnimal]))[0].affectedRows;
            return result;
        });
    }
    estadoAnimal(idAnimal) {
        return __awaiter(this, void 0, void 0, function* () {
            const estado = yield this.db.query('SELECT e.estado FROM estado_adopcion as e inner join animal as a on a.estado=e.id where a.id=?', [idAnimal]);
            return estado[0][0];
        });
    }
    cancelarProcesoAdopcion(idAnimal) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = (yield this.db.query('DELETE FROM proceso_adopcion WHERE id_animal = ?', [idAnimal]))[0].affectedRows;
            const estadoCambiado = (yield this.db.query('UPDATE animal SET estado = 1 WHERE id = ?', [idAnimal]))[0].affectedRows;
            console.log(result);
            return result;
        });
    }
    //interes
    mostrarInteres(idAnimal, idInteresado) {
        return __awaiter(this, void 0, void 0, function* () {
            const interes = { idAnimal: idAnimal, idInteresado: idInteresado };
            const result = (yield this.db.query('INSERT INTO animal_interesado SET ?', [interes]))[0].affectedRows;
            console.log(result);
            return result;
        });
    }
    quitarInteres(idAnimal, idInteresado) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = (yield this.db.query('DELETE FROM animal_interesado WHERE idAnimal = ? and idInteresado = ?', [idAnimal, idInteresado]))[0].affectedRows;
            console.log(result);
            return result;
        });
    }
    cargarInteres(idAnimal, idUsuario) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("idAnimal y idUsuario", idAnimal, idUsuario);
            const encontrado = yield this.db.query('SELECT COUNT(1) as interes FROM animal_interesado WHERE idAnimal = ? and idInteresado = ?', [idAnimal, idUsuario]);
            //'SELECT * FROM animal
            console.log("q onda el result del model", encontrado[0][0]);
            console.log("q onda el result del model", encontrado[0][0].interes);
            return encontrado[0][0].interes;
        });
    }
    cargarInteresados(idAnimal) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("idAnimal y idUsuario", idAnimal);
            const encontrado = yield this.db.query('SELECT u.id, u.nombre, u.apellido, u.email, u.nro_celular FROM usuario as u inner join animal_interesado as i on i.idInteresado=u.id WHERE idAnimal = ?', [idAnimal]);
            //SELECT * FROM animal
            console.log("q onda el result del model   ", encontrado[0]);
            return encontrado[0];
        });
    }
    siguiendoAnimales(idUsuario) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("idUsuario", idUsuario);
            const encontrado = yield this.db.query('SELECT 1 as est, a1.id, a1.nombre, e1.estado from animal as a1 inner join estado_adopcion as e1 on a1.estado=e1.id inner join proceso_adopcion as pa1 ON a1.id=pa1.id_animal where pa1.id_usuario=? UNION SELECT 0 as est, a2.id, a2.nombre, e2.estado from animal as a2 inner join estado_adopcion as e2 on a2.estado=e2.id inner join animal_interesado as ai2	ON a2.id=ai2.idAnimal where ai2.idInteresado=? AND a2.id NOT IN (SELECT a1.id from animal as a1 inner join proceso_adopcion as pa1 ON a1.id=pa1.id_animal where pa1.id_usuario=?)', [idUsuario, idUsuario, idUsuario]);
            /*
            //El codigo de arriba pero para q se lea//
            SELECT 1 as est, a1.id, a1.nombre, e1.estado from animal as a1
            inner join estado_adopcion as e1 on a1.estado=e1.id
            inner join proceso_adopcion as pa1
            ON a1.id=pa1.id_animal
            where pa1.id_usuario=?
            UNION
            SELECT 0 as est, a2.id, a2.nombre, e2.estado from animal as a2
            inner join estado_adopcion as e2 on a2.estado=e2.id
            inner join animal_interesado as ai2
            ON a2.id=ai2.idAnimal
            where ai2.idInteresado=?
            AND a2.id NOT IN (SELECT a1.id from animal as a1
            inner join proceso_adopcion as pa1
            ON a1.id=pa1.id_animal
            where pa1.id_usuario=?)
            */
            //SELECT * FROM animal
            console.log("animales a los q sigue   ", encontrado[0]);
            return encontrado[0];
        });
    }
    //APARTADO ADMIN
    eliminarComentario(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const RES2 = (yield this.db.query('DELETE FROM usuario_comentario_like WHERE idComentario = ?', [id]))[0].affectedRows;
            const RES = (yield this.db.query('DELETE FROM comentarios_usuarios WHERE ID = ?', [id]))[0].affectedRows;
            console.log(RES);
            return RES;
        });
    }
    /* Busco la cantidad de interesados que tiene un animal */
    cantidadInteresados(cantidad) {
        return __awaiter(this, void 0, void 0, function* () {
            const cantidadInteresados = yield this.db.query('SELECT * FROM animal_interesado WHERE idAnimal = ?', [cantidad]);
            return cantidadInteresados[0];
        });
    }
    /* Busco las vacunas que tiene un animal */
    traerVacunasAnimal(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const vacunas = yield this.db.query('SELECT Moquillo, Polivalente, Primovacunacion, Rabia, Castrado FROM animal_vacunas where idAnimal = ?', [id]);
            return vacunas[0][0];
        });
    }
    modificarVacunasAnimal(vacunas, id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("vacunas", vacunas, "id", id);
            const result = (yield this.db.query('UPDATE animal_vacunas SET ? WHERE idAnimal = ?', [vacunas, id]))[0].affectedRows;
            console.log(result);
            return result;
        });
    }
    cantidadUsuariosRegistrados() {
        return __awaiter(this, void 0, void 0, function* () {
            const usuariosRegistrados = yield this.db.query('SELECT COUNT(*) as us FROM usuario');
            return usuariosRegistrados[0][0];
        });
    }
    cantidadAnimalesRegistrados() {
        return __awaiter(this, void 0, void 0, function* () {
            const animalesRegistrados = yield this.db.query('SELECT COUNT(*) as an FROM animal');
            return animalesRegistrados[0][0];
        });
    }
    cantidadAnimalesAdoptados() {
        return __awaiter(this, void 0, void 0, function* () {
            const usuariosAdoptados = yield this.db.query('SELECT COUNT(*) as ana FROM animal where estado = 3');
            return usuariosAdoptados[0][0];
        });
    }
    //Atualizar datos (Modificar / updates)
    updateDataUsuario(usuarioData, id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("usuarioData", usuarioData, "id", id);
            const result = (yield this.db.query('UPDATE usuario SET ? WHERE ID = ?', [usuarioData, id]))[0].affectedRows;
            console.log(result);
            return result;
        });
    }
    /*
    Modifico los datos del animal
    Devuelve 1 si logro actualizar el usuario indicado por id
    */
    modificarDatosAnimal(animal, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = (yield this.db.query('UPDATE animal SET ? WHERE id = ?', [animal, id]))[0].affectedRows;
            console.log(result);
            return result;
        });
    }
    buscarToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const encontrado = yield this.db.query('SELECT * FROM usuario WHERE resetToken = ?', [token]);
            //Ojo la consulta devuelve una tabla de una fila. (Array de array) Hay que desempaquetar y obtener la unica fila al enviar
            if (encontrado.length > 1)
                return encontrado[0][0];
            return null;
        });
    }
    cantidadAnimalesEnAdopcion() {
        return __awaiter(this, void 0, void 0, function* () {
            const usuariosEnAdopcion = yield this.db.query('SELECT COUNT(*) as ane FROM animal where estado = 1 or estado = 2');
            return usuariosEnAdopcion[0][0];
        });
    }
    promedioAnimalesAdoptados() {
        return __awaiter(this, void 0, void 0, function* () {
            const promedio = yield this.db.query('select count(*) / (select count(*) from animal where estado = 3) as prom from animal');
            return promedio[0][0];
        });
    }
}
//Exportamos el enrutador con 
const userModel = new UserModel();
exports.default = userModel;
//# sourceMappingURL=userModel.js.map