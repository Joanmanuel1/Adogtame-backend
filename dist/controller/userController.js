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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = __importDefault(require("../models/userModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = __importDefault(require("nodemailer"));
class UserController {
    // Login
    signin(req, res) {
        console.log(req.body);
        // res.send('Sign In!!!');
        res.render("partials/signinForm");
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('SERVIDOR -> DENTRO DE LOGIN');
            const { email, password } = req.body; // hacemos detrucsturing y obtenemos el ID. Es decir, obtenemos una parte de un objeto JS.
            const result = yield userModel_1.default.buscarEmail(email);
            console.log("Este es el email", email);
            console.log("Este es el password", password);
            console.log("Este es el result", result);
            if (!result) {
                return res.status(404).json({ message: "Usuario no registrado" });
                //req.flash('error_session', 'Usuario y/o Password Incorrectos');
                //res.redirect("./signin");
            }
            else {
                const confirmado = result.confirmado;
                console.log('Servidor confirmado => ', confirmado);
                if (confirmado == 0) {
                    console.log('Usuario no confirmado');
                    return res.status(404).json({ message: "Debes verificar tu cuenta primero para poder ingresar. Por favor, revisa tu e-mail" });
                }
                else {
                    //res.send({ "Usuario no registrado Recibido": req.body }); El profe dejo esta linea pero no valida si el user es incorrecto
                    if (result.email == email && result.password == password) {
                        const token = jsonwebtoken_1.default.sign({ _id: result.id }, "secretKey");
                        console.log("Este es el id del usuario", result.id);
                        req.session.user = result;
                        req.session.auth = true;
                        res.status(200).json({ message: result.id, token: token });
                        //res.redirect("./home");
                        return;
                    }
                    else {
                        //res.send({ "Usuario y/o contraseña incorrectos": req.body });
                        //req.flash('error_session', 'Usuario y/o Password Incorrectos');
                        //res.redirect("./error");
                        return res.status(403).json({ message: "Usuario y/o contraseña incorrectos" });
                    }
                }
            }
        });
    }
    dToken(req, res) {
        //const { token } = req.params;
        const token = req.body.token;
        console.log(token);
        // const decoded = jwtDecode<JwtPayload>(token); //Returns with the JwtPayload type
        // console.log(decoded);
        const decoded = jsonwebtoken_1.default.verify(token, "secretKey");
        var userId = decoded;
        console.log("Q onda, el usuario cual es", userId);
        console.log(decoded);
        return res.json({ user: decoded._id });
        // return res.send({
        //      user: (<any>decoded)._id
        // });
    }
    // Registro Usuario
    signup(req, res) {
        console.log(req.body);
        //res.send('Sign Up!!!');
        res.render("partials/signupForm");
    }
    // Registro Organizacion
    signupOrg(req, res) {
        console.log(req.body);
        //res.send('Sign Up!!!');
        res.render("partials/signupOrgForm");
    }
    // Registro Animal
    signupAnimal(req, res) {
        console.log(req.body);
        if (!req.session.auth) {
            res.render("partials/signinForm");
        }
        res.render("partials/signupAnimalForm", { mi_session: true });
    }
    home(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            if (!req.session.auth) {
                res.render("partials/signinForm");
            }
            res.render("partials/home", { mi_session: true });
        });
    }
    adoptados(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            res.render("partials/adoptados");
        });
    }
    informes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            res.render("partials/informes");
        });
    }
    //adopcion animal
    comenzarAdopcion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const adopcionData = req.body;
            console.log(req.body);
            // console.log("El id del Interesado", idInteresado);
            // const { idAnimal } = req.params;
            // console.log("El id del animal", idAnimal);
            const result = yield userModel_1.default.comenzarAdopcion({ data: adopcionData });
            console.log("El result", result);
            return res.json(result);
        });
    }
    confirmarAdopcion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const idUsuario = req.body.idInteresado;
            const { idAnimal } = req.params;
            console.log(req.body);
            const result = yield userModel_1.default.confirmarAdopcion(idAnimal, idUsuario);
            console.log("El result", result);
            return res.json(result);
        });
    }
    estadoAnimal(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const { idAnimal } = req.params;
            const estado = yield userModel_1.default.estadoAnimal(idAnimal);
            console.log(estado);
            return res.json(estado);
            //res.send('Listado de animales!!!');
        });
    }
    cancelarProcesoAdopcion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const { idAnimal } = req.params;
            const result = yield userModel_1.default.cancelarProcesoAdopcion(idAnimal);
            console.log(result);
            return res.json(result);
        });
    }
    //
    solicitudesEnviadas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            res.render("partials/solicitudesEnviadas");
        });
    }
    solicitudesRecibidas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            res.render("partials/solicitudesRecibidas");
        });
    }
    control(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.session.auth) {
                //res.redirect("/");
                req.flash('error_session', 'Debes iniciar sesion para ver esta seccion -- chauuuuuuuu');
                res.redirect("./error");
            }
            //res.send('Controles');
            const usuarios = yield userModel_1.default.listar();
            //const users = usuarios;
            res.render('partials/controls', { users: usuarios, mi_session: true });
        });
    }
    procesar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.session.auth) {
                //res.redirect("/");
                req.flash('error_session', 'Debes iniciar sesion para ver esta seccion');
                res.redirect("./error");
            }
            console.log(req.body);
            let usuario = req.body.usuario;
            var usuarios = [];
            console.log(usuario);
            if (usuario !== undefined) {
                for (let elemento of usuario) {
                    const encontrado = yield userModel_1.default.buscarId(elemento);
                    if (encontrado) {
                        usuarios.push(encontrado);
                        console.log(encontrado);
                    }
                }
            }
            console.log(usuarios);
            res.render("partials/seleccion", { usuarios, home: req.session.user, mi_session: true });
        });
    }
    endSession(req, res) {
        console.log(req.body);
        req.session.user = {};
        req.session.auth = false;
        req.session.destroy(() => console.log("Session finalizada"));
        res.redirect("/");
    }
    showError(req, res) {
        res.render("partials/error");
        //res.send({ "Usuario y/o contraseña incorrectos flash": req.body });
    }
    //Notificaciones
    notificacionesListar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const { id } = req.params;
            const notificaciones = yield userModel_1.default.notificacionesListar(id);
            console.log(notificaciones);
            return res.json(notificaciones);
        });
    }
    notificacionesConteo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const { id } = req.params;
            const conteo = yield userModel_1.default.notificacionesConteo(id);
            console.log(conteo);
            return res.json(conteo);
        });
    }
    notificacionesVistas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const { id } = req.params;
            const vistas = yield userModel_1.default.notificacionesVistas(id);
            console.log(vistas);
            return res.json(vistas);
        });
    }
    //
    //
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const usuarios = yield userModel_1.default.listar();
            console.log(usuarios);
            return res.json(usuarios);
            //res.send('Listado de usuarios!!!');
        });
    }
    listAnimals(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const animales = yield userModel_1.default.listarAnimales();
            console.log(animales);
            return res.json(animales);
            //res.send('Listado de animales!!!');
        });
    }
    listarAnimalesAdoptados(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const animales = yield userModel_1.default.listarAnimalesAdoptados();
            console.log(animales);
            return res.json(animales);
        });
    }
    listarAnimalesSinAdoptar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const animales = yield userModel_1.default.listarAnimalesSinAdoptar();
            console.log(animales);
            return res.json(animales);
        });
    }
    fechaAdoptados(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const fechaAdoptado = yield userModel_1.default.fechaAdoptados();
            console.log(fechaAdoptado);
            return res.json(fechaAdoptado);
        });
    }
    listAnimalsFiltrado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const filtroIncluye = req.body.filtroIncluye;
            const filtroExcluye = req.body.filtroExcluye;
            var incluye = [];
            var excluye = [];
            const propiedades = { tipo: 2, edad: 2, tamano: 3 };
            //Tomo el de excluye porq es lo mismo, los dos tienen las mismas keys 
            //lo distinto son los valores de true y false de cada key
            var keys = Object.keys(filtroExcluye);
            for (var i = 0; i < keys.length; i++) {
                var keyChangeI = false;
                var keyChangeE = false;
                for (var y = 0; y < propiedades[`${keys[i]}`]; y++) {
                    var excluyeFiltro = {};
                    var incluyeFiltro = {};
                    excluyeFiltro = filtroExcluye[`${keys[i]}`];
                    incluyeFiltro = filtroIncluye[`${keys[i]}`];
                    var keysFiltro = Object.keys(excluyeFiltro);
                    if (excluyeFiltro[Object.keys(excluyeFiltro)[y]] == true) {
                        //--gato, grande, mediano
                        if (keyChangeE == true) {
                            excluye[`${keys[i]}`] = [excluye[`${keys[i]}`], `${keysFiltro[y]}`];
                            //console.log("excluye 2", excluye);
                        }
                        else {
                            excluye[`${keys[i]}`] = `${keysFiltro[y]}`;
                            //console.log("excluye 1", excluye);
                            keyChangeE = true;
                        }
                    }
                    else {
                        if (incluyeFiltro[Object.keys(incluyeFiltro)[y]] == true) {
                            //--perro
                            if (keyChangeI == true) {
                                incluye[`${keys[i]}`] = [incluye[`${keys[i]}`], `${keysFiltro[y]}`];
                                //console.log("incluye 2", incluye);
                            }
                            else {
                                incluye[`${keys[i]}`] = `${keysFiltro[y]}`;
                                //console.log("incluye 1", incluye);
                                keyChangeI = true;
                            }
                        }
                    }
                }
            }
            const animales = yield userModel_1.default.listAnimalsFiltrado(incluye, excluye);
            console.log(animales);
            return res.json(animales);
            //res.send('Listado de animales!!!');
            /*
    
            filtroIncluye={tipo:{perro:false, gato:false}, edad:{cria:false, adulto:false},
            tamano:{grande:false, mediano:false, chico:false}}
    
            filtroExcluye={tipo:{perro:false, gato:false}, edad:{cria:false, adulto:false},
            tamano:{grande:false, mediano:false, chico:false}}
    
    
            /*
    
    
    
    
    
    
    
    
            if(filtro.perroF==true){
                if(filtro.perroE==true){
                    excluyeTipo.push("perro");
    
                    if(filtro.gatoF==false && filtro.chicoF==false && filtro.medianoF==false && filtro.grandeF==false){
                    
                        excluyeTipo.push("gato");
                        excluyeTamano.push("chico");
                        excluyeTamano.push("mediano");
                        excluyeTamano.push("grande");
                    }
    
                }
                else
                {
                    incluyeTipo.push("perro");
                }
                
            }
            else
            {
    
                if(filtro.perroE==true){
    
                    
                    excluyeTipo.push("perro");
    
                }
    
    
            }
    
            if(filtro.gatoF==true){
                
                if(filtro.gatoE==true){
    
                    excluyeTipo.push("gato");
    
                    if(filtro.perroF==false && filtro.chicoF==false && filtro.medianoF==false && filtro.grandeF==false){
                    
                        excluyeTipo.push("perro");
                        excluyeTamano.push("chico");
                        excluyeTamano.push("mediano");
                        excluyeTamano.push("grande");
                    }
    
       
    
                }
                else
                {
    
                    incluyeTipo.push("gato");
                }
                
            }
            else
            {
                if(filtro.gatoE==true){
    
                    excluyeTipo.push("gato");
                    
                }
                
            }
        
    
    
            if(filtro.chicoF==true){
                
                if(filtro.chicoE==true){
    
                    excluyeTamano.push("chico");
    
                    if(filtro.perroF==false && filtro.gatoF==false && filtro.medianoF==false && filtro.grandeF==false){
                    
                        excluyeTipo.push("perro");
                        excluyeTipo.push("gato");
                        excluyeTamano.push("mediano");
                        excluyeTamano.push("grande");
                    }
    
                }
                else
                {
    
                    incluyeTamano.push("chico");
                }
                
            }
            else
            {
                if(filtro.chicoE==true){
    
                    excluyeTamano.push("chico");
                    
                }
                
            }
    
    
    
            if(filtro.medianoF==true){
                
                if(filtro.medianoE==true){
    
                    excluyeTamano.push("mediano");
    
                    if(filtro.perroF==false && filtro.gatoF==false && filtro.chicoF==false && filtro.grandeF==false){
                    
                        excluyeTipo.push("perro");
                        excluyeTipo.push("gato");
                        excluyeTamano.push("chico");
                        excluyeTamano.push("grande");
                    }
    
                }
                else
                {
    
                    incluyeTamano.push("mediano");
                }
                
            }
            else
            {
                if(filtro.medianoE==true){
    
                    excluyeTamano.push("mediano");
                    
                }
                
            }
    
    
    
            if(filtro.grandeF==true){
                
                if(filtro.grandeE==true){
    
                    excluyeTamano.push("grande");
    
                    if(filtro.perroF==false && filtro.gatoF==false && filtro.chicoF==false && filtro.medianoF==false){
                    
                        excluyeTipo.push("perro");
                        excluyeTipo.push("gato");
                        excluyeTamano.push("chico");
                        excluyeTamano.push("mediano");
                    }
    
                }
                else
                {
    
                    incluyeTamano.push("grande");
                }
                
            }
            else
            {
                if(filtro.grandeE==true){
    
                    excluyeTamano.push("grande");
                    
                }
                
            }
            // if(filtro.gatoE==false && filtro.perroE==false){
    
            //     excluye.push("Vacio");
                
            // }
    
            // if(filtro.gatoF==false && filtro.perroF==false){
    
            //     incluye.push("Vacio");
                
            // }
            console.log(incluyeTipo);
            console.log(excluyeTipo);
    
            console.log(incluyeTamano);
            console.log(excluyeTamano);
            const animales = await userModel.listAnimalsFiltrado(incluyeTipo, excluyeTipo, incluyeTamano, excluyeTamano);
            console.log(animales);
            return res.json(animales);
            //res.send('Listado de animales!!!');
    
    
    
    
            /**/
        });
    }
    listAnimalsUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const { id } = req.params;
            const animales = yield userModel_1.default.listarAnimalesUser(id);
            console.log(animales);
            return res.json(animales);
            //res.send('Listado de animales!!!');
        });
    }
    listAnimalsUserAdoptados(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const { id } = req.params;
            const animales = yield userModel_1.default.listarAnimalesUserAdoptados(id);
            console.log(animales);
            return res.json(animales);
        });
    }
    listAnimalsUserEnAdopcion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const { id } = req.params;
            const animales = yield userModel_1.default.listarAnimalesUserEnAdopcion(id);
            console.log(animales);
            return res.json(animales);
        });
    }
    find(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.params.id);
            const { id } = req.params;
            const usuario = yield userModel_1.default.buscarId(id);
            if (usuario)
                return res.json(usuario);
            return res.status(404).json({ text: "User doesn't exists" });
        });
    }
    findUserWithMail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.params.id);
            const { mail } = req.params;
            const usuario = yield userModel_1.default.buscarEmail(mail);
            if (usuario)
                return res.json(usuario);
            return res.status(404).json({ text: "User doesn't exists" });
        });
    }
    findAnimal(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.params.id);
            const { id } = req.params;
            const animal = yield userModel_1.default.buscarIdAnimal(id);
            if (animal)
                return res.json(animal);
            return res.status(404).json({ text: "animal doesn't exists" });
        });
    }
    addUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const usuario = req.body;
            delete usuario.repassword;
            console.log(req.body);
            // try {
            //     const emailExiste = await userModel.buscarEmail(usuario.email);
            //     console.log('emailExiste => ', emailExiste);
            //     if(emailExiste){
            // 		console.log('dentro de emailExiste');
            //         return res.status(403).json({message: 44});
            //     }
            // } catch (error) {
            //     return res.status(403).json({message: 'Ha ocurrido un error'+error});
            // }
            let user;
            try {
                user = yield userModel_1.default.crear(usuario);
                console.log('user => ', user);
            }
            catch (error) {
                console.log('Error al crear usuario');
                return res.status(403).json({ message: 'Error al intentar crear usuario' + error });
            }
            // try {
            //     const transporter = nodemailer.createTransport({
            //         service: 'gmail',
            //         auth: {
            //             type: "OAuth2",
            //             user: "adogtamesa@gmail.com",
            //             clientId: "548268239241-t5g8ugpitk66mpa4bfkbkr9bl17g1rrf.apps.googleusercontent.com",
            //             clientSecret: "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",
            //             refreshToken: "1//04IBPVJJF2IvuCgYIARAAGAQSNwF-L9IrCVT-Yb6lhPFPMf8wVGw2dY2z16BLN5364yDGvq6Hbx1DFU98b2UbreGX5g3Uj9RbR9Q"
            //         }
            //     });
            //     const user = await userModel.buscarEmail(usuario.email);
            //     console.log('Servidor user => ', user);
            //     const token: string = jwt.sign(
            //         { _id: user.id },
            //         "secretKey",
            //         {
            //             expiresIn: '1d',
            //         }
            //     );
            // 	console.log('token => ', token);
            //     const url = `http://adogtameweb.herokuapp.com/usuarios/verificar/${token}`;
            //     var contentHTML = `
            // 				<h1>Completa tu registro - Adogtame App</h1>
            // 				<h2>Hola ${nombre}!</h2>
            // 				<p>Por favor haz click en el siguiente link, o copialo en la barra de direcciones de tu navegador
            // 				para completar el proceso de registro:</p>
            // 				<a href="${url}">${url}</a>
            // 				<img src="https://st2.depositphotos.com/1606449/7516/i/950/depositphotos_75163555-stock-photo-cats-and-dogs-hanging-paws.jpg"/>
            // 				<p><h3><b>Adogtame S.A.</b></h3><br/>
            // 				<b>Nuestro sitio web:</b> <a href="https://adogtameweb.herokuapp.com/">Adogtame Web</a><br/>
            // 				<b>Nuestras redes:</b> <img src="http://assets.stickpng.com/images/580b57fcd9996e24bc43c521.png" width="32" heigth="32"/>
            // 				<img src="https://images.vexels.com/media/users/3/223136/isolated/lists/984f500cf9de4519b02b354346eb72e0-facebook-icon-redes-sociales.png" width="32" height="32"/>
            // 				<img src="https://image.similarpng.com/very-thumbnail/2020/06/Logo-Twitter-icon-transparent-PNG.png" width="32" height="32"/><br/>
            // 				<b>Contacto:</b> adogtamesa@gmail.com - (54) 11 9999 5555
            // 				</p>
            // 			`;
            //     const info = await transporter.sendMail({
            //         from: "'Adogtame App' <adogtamesa@gmail.com>",
            //         to: email,
            //         subject: "Confirmacion de registro Adogtame App",
            //         html: contentHTML
            //     });
            //     console.log('Message sent, info => ', info);
            //     console.log('token result => ', token);
            //     return res.status(200).json({ message: user, token: token });
            //     //return res.json({ message: 'User saved!!' });
            // } catch (error) {
            // 	console.log('algo salio mal, error:', error);
            //     return res.status(403).json({ message: 'Algo salio mal' });
            // }
        });
    }
    recoverPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('adogtame-app req => ', req.body);
            const { email } = req.body;
            if (!(email)) {
                return res.status(400).json({ message: email + 'Email de usuario requerido!' });
            }
            const message = 'Se ha enviado un e-mail a la casilla de correo electronico indicada, por favor,' +
                'revise su bandeja de entrada para poder restaurar su contraseña.';
            let verificationLink;
            let emailStatus = 'OK';
            let user;
            //const userRepository = buscarEmail(Users);
            try {
                //Buscar user en base de datos
                user = yield userModel_1.default.buscarEmail(email);
                const token = jsonwebtoken_1.default.sign({ _id: user.id, email: user.email }, "secretKey", {
                    expiresIn: '1h',
                });
                console.log('token => ', token);
                verificationLink = `https://adogtameweb.herokuapp.com/usuarios/new-password/${token}`;
                user.resetToken = token;
            }
            catch (error) {
                //En caso de no haberlo encontrado en la BD, arrojar el mensaje de la variable "message"
                return res.json({ message: 'Algo ha salido mal' });
            }
            //TO DO: SendEmail
            try {
                const transporter = nodemailer_1.default.createTransport({
                    service: 'gmail',
                    auth: {
                        type: "OAuth2",
                        user: "adogtamesa@gmail.com",
                        clientId: "548268239241-t5g8ugpitk66mpa4bfkbkr9bl17g1rrf.apps.googleusercontent.com",
                        clientSecret: "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",
                        refreshToken: "1//04IBPVJJF2IvuCgYIARAAGAQSNwF-L9IrCVT-Yb6lhPFPMf8wVGw2dY2z16BLN5364yDGvq6Hbx1DFU98b2UbreGX5g3Uj9RbR9Q"
                    }
                });
                const url = verificationLink;
                var contentHTML = `
						<h1>Restablece tu contraseña - Adogtame App</h1>
						<h2>Hola ${user.nombre}!</h2>
						
                        <p>Hemos recibido una solicitud de cambio de contraseña, si no has sido tú, te pedimos por favor que desestimes este e-mail.</p>
						<p>De lo contrario, por favor haz click en el siguiente link, o copialo en la barra de direcciones de tu navegador
						para completar el proceso de cambio de contraseña:</p>
						<a href="${url}">${url}</a>
						<img src="https://st2.depositphotos.com/1606449/7516/i/950/depositphotos_75163555-stock-photo-cats-and-dogs-hanging-paws.jpg"/>
						<p><h3><b>Adogtame S.A.</b></h3><br/>
						<b>Nuestro sitio web:</b> <a href="https://adogtameweb.herokuapp.com/">Adogtame Web</a><br/>
						<b>Nuestras redes:</b> <img src="http://assets.stickpng.com/images/580b57fcd9996e24bc43c521.png" width="32" heigth="32"/>
						<img src="https://images.vexels.com/media/users/3/223136/isolated/lists/984f500cf9de4519b02b354346eb72e0-facebook-icon-redes-sociales.png" width="32" height="32"/>
						<img src="https://image.similarpng.com/very-thumbnail/2020/06/Logo-Twitter-icon-transparent-PNG.png" width="32" height="32"/><br/>
						<b>Contacto:</b> adogtamesa@gmail.com - (54) 11 9999 5555
						</p>
					`;
                const info = yield transporter.sendMail({
                    from: "'Adogtame App' <adogtamesa@gmail.com>",
                    to: email,
                    subject: "Restablecer contraseña en Adogtame Web",
                    html: contentHTML
                });
            }
            catch (error) {
                emailStatus = String(error);
                return res.status(400).json({ message: 'Algo salio mal, por favor contactese con el equipo de soporte para mas informacion 1' });
            }
            let result;
            try {
                result = yield userModel_1.default.updateDataUsuario(user, user.id);
            }
            catch (error) {
                emailStatus = String(error);
                return res.status(400).json({ message: 'Algo salio mal, por favor contactese con el equipo de soporte para mas informacion' });
            }
            res.status(200).json({ message: result });
        });
    }
    newPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { newPassword } = req.body;
            console.log('newPassword ', newPassword);
            const resetToken = req.headers['reset'];
            console.log('resetToken ', resetToken);
            if (!(resetToken && newPassword)) {
                res.status(400).json({ message: 'Todos los campos son requeridos' });
            }
            let jwtPayload;
            let user;
            let result;
            try {
                jwtPayload = jsonwebtoken_1.default.verify(resetToken, 'secretKey');
                user = yield userModel_1.default.buscarToken(resetToken);
            }
            catch (error) {
                return res.status(401).json({ message: 'Algo salio mal, por favor contactese con soporte para mas informacion 1' });
            }
            user.password = newPassword;
            try {
                result = yield userModel_1.default.updateDataUsuario(user, user.id);
            }
            catch (error) {
                return res.status(401).json({ message: 'Algo salio mal, por favor contactese con soporte para mas informacion' });
            }
            return res.status(200).json({ message: result });
        });
    }
    confirmarRegistro(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jwtPayload = jsonwebtoken_1.default.verify(req.params.token, 'secretKey');
                console.log('jwtPayload', jwtPayload);
                const id = jwtPayload._id;
                console.log('Servidor id => ', id);
                const result = yield userModel_1.default.confirmarUsuario(1, id);
                return res.status(200).json({ message: result });
            }
            catch (e) {
                console.log('Servidor entro en el catch');
                res.send('error');
            }
        });
    }
    addAnimal(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const animal = req.body;
            console.log("Q onda cuantos son", req.body);
            const busqueda = yield userModel_1.default.buscarAnimal(animal.nombre, animal.idDador);
            if (!busqueda) {
                const result = yield userModel_1.default.crearAnimal(animal);
                //Hace falta pasar el id del nuevo animal creado, asi lo devolvemos para poder ir a ese perfil de animal
                console.log("EL id aca ", result);
                // res.redirect("./signin");   
                return res.json({ id: result });
            }
            return res.status(403).json({ message: 'animal exists!!' });
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const { id } = req.params;
            const result = yield userModel_1.default.actualizar(req.body, id);
            //res.send('Usuario '+ req.params.id +' actualizado!!!');
            //creo hay q cambiar por res.status.json
            return res.json({ text: 'updating a user ' + id });
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            //res.send('Usuario '+ req.params.id +' Eliminado!!!');
            const { id } = req.params; // hacemos detrucsturing y obtenemos el ID. Es decir, obtenemos una parte de un objeto JS.
            const result = yield userModel_1.default.eliminar(id);
            //return res.json({ text: 'deleting a user ' + id });
            res.redirect('../control');
        });
    }
    //FIN CRUD
    //Interes
    mostrarInteres(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const idInteresado = req.body.idInteresado;
            console.log(req.body);
            console.log("El id del interesado", idInteresado);
            const { idAnimal } = req.params;
            console.log("El id del animal", idAnimal);
            const result = yield userModel_1.default.mostrarInteres(idAnimal, idInteresado);
            return res.status(200).json({ text: 'Mostrando Interes de' + idInteresado });
        });
    }
    quitarInteres(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const idInteresado = req.body.idInteresado;
            console.log(req.body);
            console.log("El id del interesado", idInteresado);
            const { idAnimal } = req.params;
            console.log("El id del animal", idAnimal);
            const result = yield userModel_1.default.quitarInteres(idAnimal, idInteresado);
            return res.status(200).json({ text: 'Mostrando Interes de' + idInteresado });
        });
    }
    cargarInteres(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const idUsuario = req.body.idUsuario;
            console.log(req.body);
            console.log("El id del Usuario", idUsuario);
            const { idAnimal } = req.params;
            console.log("El id del animal", idAnimal);
            const result = yield userModel_1.default.cargarInteres(idAnimal, idUsuario);
            console.log("El pinche result", result);
            return res.json(result);
        });
    }
    cargarInteresados(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idAnimal } = req.params;
            console.log("El id del animal", idAnimal);
            const result = yield userModel_1.default.cargarInteresados(idAnimal);
            console.log("El result  ", result);
            return res.json(result);
        });
    }
    //
    siguiendoAnimales(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idUsuario } = req.params;
            console.log("El id del usuario", idUsuario);
            const result = yield userModel_1.default.siguiendoAnimales(idUsuario);
            console.log("El result  ", result);
            return res.json(result);
        });
    }
    //
    //Atualizar datos (Modificar / updates)
    updateDataUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const idUsuario = req.params.id;
            var usuarioCambios = req.body;
            console.log("idUsuario", idUsuario);
            console.log("usuarioCambios q hay", usuarioCambios);
            const result = yield userModel_1.default.updateDataUsuario(usuarioCambios, idUsuario);
            res.status(200).json({ text: "usuario actualizado correctamente" });
        });
    }
    modificarDatosAnimal(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const idAnimal = req.params.id;
            var animalCambios = req.body;
            console.log("idAnimal", idAnimal);
            console.log("animalCambios q hay", animalCambios);
            const result = yield userModel_1.default.modificarDatosAnimal(animalCambios, idAnimal);
            return res.json({ text: 'updating animal ' + idAnimal });
        });
    }
    //APARTADO ADMIN
    deleteComentario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            //res.send('Usuario '+ req.params.id +' Eliminado!!!');
            const { id } = req.params; // hacemos detrucsturing y obtenemos el ID. Es decir, obtenemos una parte de un objeto JS.
            const result = yield userModel_1.default.eliminarComentario(id);
            //return res.json({ text: 'deleting a user ' + id });
            //res.redirect('../abmProductos');
            res.status(200).json({ text: "Comentario eliminado correctamente" });
        });
    }
    cantidadInteresados(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const { cantidad } = req.params;
            console.log("animal idd ", cantidad);
            const cantidadInteresados = yield userModel_1.default.cantidadInteresados(cantidad);
            console.log(cantidadInteresados);
            return res.json(cantidadInteresados);
        });
    }
    traerVacunasAnimal(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const { id } = req.params;
            console.log("animal id ", id);
            const vacunas = yield userModel_1.default.traerVacunasAnimal(id);
            console.log(vacunas);
            return res.json(vacunas);
        });
    }
    modificarVacunasAnimal(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const { id } = req.params;
            const vacunas = req.body;
            console.log("animal id ", id, "vacunas cambios", vacunas);
            const result = yield userModel_1.default.modificarVacunasAnimal(vacunas, id);
            console.log(result);
            return res.json(result);
        });
    }
    cantidadUsuariosRegistrados(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const usuariosRegistrados = yield userModel_1.default.cantidadUsuariosRegistrados();
            console.log(usuariosRegistrados);
            return res.json(usuariosRegistrados);
        });
    }
    cantidadAnimalesRegistrados(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const animalesRegistrados = yield userModel_1.default.cantidadAnimalesRegistrados();
            console.log(animalesRegistrados);
            return res.json(animalesRegistrados);
        });
    }
    cantidadAnimalesAdoptados(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const animalesAdoptados = yield userModel_1.default.cantidadAnimalesAdoptados();
            console.log(animalesAdoptados);
            return res.json(animalesAdoptados);
        });
    }
    cantidadAnimalesEnAdopcion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const animalesEnAdopcion = yield userModel_1.default.cantidadAnimalesEnAdopcion();
            console.log(animalesEnAdopcion);
            return res.json(animalesEnAdopcion);
        });
    }
    promedioAnimalesAdoptados(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const promedio = yield userModel_1.default.promedioAnimalesAdoptados();
            console.log(promedio);
            return res.json(promedio);
        });
    }
}
const userController = new UserController();
exports.default = userController;
//# sourceMappingURL=userController.js.map