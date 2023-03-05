import { Request, Response } from 'express';
import userModel from '../models/userModel';
import flash from "connect-flash";
import jwt from "jsonwebtoken";
import jwtDecode, { JwtPayload } from "jwt-decode";
import nodemailer from "nodemailer";

class UserController {

    // Login
    public signin(req: Request, res: Response) {
        console.log(req.body);
        // res.send('Sign In!!!');
        res.render("partials/signinForm");
    }

    public async login(req: Request, res: Response) {
        console.log('SERVIDOR -> DENTRO DE LOGIN');
        const { email, password } = req.body; // hacemos detrucsturing y obtenemos el ID. Es decir, obtenemos una parte de un objeto JS.
        const result = await userModel.buscarEmail(email);

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

                    const token: string = jwt.sign({ _id: result.id }, "secretKey");

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
    }

    public dToken(req: Request, res: Response) {

        //const { token } = req.params;
        const token = req.body.token;
        console.log(token);
        // const decoded = jwtDecode<JwtPayload>(token); //Returns with the JwtPayload type
        // console.log(decoded);


        const decoded = jwt.verify(token, "secretKey");
        var userId = decoded;
        console.log("Q onda, el usuario cual es", userId)

        console.log(decoded)


        return res.json({ user: (<any>decoded)._id });
        // return res.send({
        //      user: (<any>decoded)._id
        // });


    }



    // Registro Usuario
    public signup(req: Request, res: Response) {
        console.log(req.body);
        //res.send('Sign Up!!!');
        res.render("partials/signupForm");
    }

    // Registro Organizacion
    public signupOrg(req: Request, res: Response) {
        console.log(req.body);
        //res.send('Sign Up!!!');
        res.render("partials/signupOrgForm");
    }


    // Registro Animal
    public signupAnimal(req: Request, res: Response) {
        console.log(req.body);
        if (!req.session.auth) {
            res.render("partials/signinForm");
        }
        res.render("partials/signupAnimalForm", { mi_session: true });
    }


    public async home(req: Request, res: Response) {
        console.log(req.body);
        if (!req.session.auth) {
            res.render("partials/signinForm");
        }
        res.render("partials/home", { mi_session: true });
    }

    public async adoptados(req: Request, res: Response) {
        console.log(req.body);
        res.render("partials/adoptados");
    }
    public async informes(req: Request, res: Response) {
        console.log(req.body);
        res.render("partials/informes");
    }

    //adopcion animal
    public async comenzarAdopcion(req: Request, res: Response) {


        const adopcionData = req.body;



        console.log(req.body);
        // console.log("El id del Interesado", idInteresado);
        // const { idAnimal } = req.params;
        // console.log("El id del animal", idAnimal);
        const result = await userModel.comenzarAdopcion({data: adopcionData});

        console.log("El result",result);
        return res.json(result);



    }

    public async confirmarAdopcion(req: Request, res: Response) {


        const idUsuario = req.body.idInteresado;


        const { idAnimal } = req.params;


        console.log(req.body);
        const result = await userModel.confirmarAdopcion(idAnimal, idUsuario);

        console.log("El result",result);
        return res.json(result);



    }



    public async estadoAnimal(req: Request, res: Response) {
        console.log(req.body);
        const { idAnimal } = req.params;
        const estado = await userModel.estadoAnimal(idAnimal);
        console.log(estado);
        return res.json(estado);
        //res.send('Listado de animales!!!');
    }



    public async cancelarProcesoAdopcion(req: Request, res: Response) {
        console.log(req.body);
        
        const { idAnimal } = req.params; 
        
        const result = await userModel.cancelarProcesoAdopcion(idAnimal);
        console.log(result);
        return res.json(result);
    }

    //



    public async solicitudesEnviadas(req: Request, res: Response) {
        console.log(req.body);
        res.render("partials/solicitudesEnviadas");
    }

    public async solicitudesRecibidas(req: Request, res: Response) {
        console.log(req.body);
        res.render("partials/solicitudesRecibidas");
    }


    public async control(req: Request, res: Response) {
        if (!req.session.auth) {
            //res.redirect("/");
            req.flash('error_session', 'Debes iniciar sesion para ver esta seccion -- chauuuuuuuu');
            res.redirect("./error");
        }
        //res.send('Controles');

        const usuarios = await userModel.listar();
        //const users = usuarios;
        res.render('partials/controls', { users: usuarios, mi_session: true });
    }

    public async procesar(req: Request, res: Response) {
        if (!req.session.auth) {
            //res.redirect("/");
            req.flash('error_session', 'Debes iniciar sesion para ver esta seccion');
            res.redirect("./error");
        }

        console.log(req.body);

        let usuario = req.body.usuario;
        var usuarios: any = [];
        console.log(usuario);

        if (usuario !== undefined) {
            for (let elemento of usuario) {
                const encontrado = await userModel.buscarId(elemento);
                if (encontrado) {
                    usuarios.push(encontrado);
                    console.log(encontrado);
                }

            }
        }
        console.log(usuarios);
        res.render("partials/seleccion", { usuarios, home: req.session.user, mi_session: true });

    }

    public endSession(req: Request, res: Response) {
        console.log(req.body);
        req.session.user = {};
        req.session.auth = false;
        req.session.destroy(() => console.log("Session finalizada"));
        res.redirect("/");
    }

    public showError(req: Request, res: Response) {
        res.render("partials/error");
        //res.send({ "Usuario y/o contraseña incorrectos flash": req.body });
    }


    //Notificaciones

        public async notificacionesListar(req: Request, res: Response) {
            console.log(req.body);
            const { id } = req.params;
            const notificaciones = await userModel.notificacionesListar(id);
            console.log(notificaciones);
            return res.json(notificaciones);
            
        } 

        public async notificacionesConteo(req: Request, res: Response) {
            console.log(req.body);
            const { id } = req.params;
            const conteo = await userModel.notificacionesConteo(id);
            console.log(conteo);
            return res.json(conteo);
            
        }

        public async notificacionesVistas(req: Request, res: Response) {
            console.log(req.body);
            const { id } = req.params;
            const vistas = await userModel.notificacionesVistas(id);
            console.log(vistas);
            return res.json(vistas);
            
        }
    //




    //
    public async list(req: Request, res: Response) {
        console.log(req.body);
        const usuarios = await userModel.listar();
        console.log(usuarios);
        return res.json(usuarios);
        //res.send('Listado de usuarios!!!');
    }

    public async listAnimals(req: Request, res: Response) {
        console.log(req.body);
        const animales = await userModel.listarAnimales();
        console.log(animales);
        return res.json(animales);
        //res.send('Listado de animales!!!');
    } 


    public async listarAnimalesAdoptados(req: Request, res: Response) {
        console.log(req.body);
        const animales = await userModel.listarAnimalesAdoptados();
        console.log(animales);
        return res.json(animales);
        
    }

    public async listarAnimalesSinAdoptar(req: Request, res: Response) {
        console.log(req.body);
        const animales = await userModel.listarAnimalesSinAdoptar();
        console.log(animales);
        return res.json(animales);
        
    }

    public async fechaAdoptados(req: Request, res: Response) {
        console.log(req.body);
        const fechaAdoptado = await userModel.fechaAdoptados();
        console.log(fechaAdoptado);
        return res.json(fechaAdoptado);
    }



    public async listAnimalsFiltrado(req: Request, res: Response) {
        console.log(req.body);


        const filtroIncluye  = req.body.filtroIncluye;
        const filtroExcluye  = req.body.filtroExcluye;
        

        var incluye:any=[];
        var excluye:any=[];
        
        const propiedades: any={tipo: 2, edad: 2, tamano: 3};
        
        //Tomo el de excluye porq es lo mismo, los dos tienen las mismas keys 
        //lo distinto son los valores de true y false de cada key
        
        var keys = Object.keys(filtroExcluye);

        for(var i=0; i<keys.length; i++){


            var keyChangeI = false;
            var keyChangeE = false;


            for(var y=0; y<propiedades[`${keys[i]}`]; y++){


                var excluyeFiltro: any={}
                var incluyeFiltro: any={}
                excluyeFiltro = filtroExcluye[`${keys[i]}`];
                incluyeFiltro = filtroIncluye[`${keys[i]}`];


                var keysFiltro = Object.keys(excluyeFiltro);


                if(excluyeFiltro[Object.keys(excluyeFiltro)[y]]==true){
                   
                    
                    //--gato, grande, mediano


                    if(keyChangeE==true){

                        excluye[`${keys[i]}`]= [excluye[`${keys[i]}`],`${keysFiltro[y]}`];
                        //console.log("excluye 2", excluye);

                    }
                    else
                    {


                        excluye[`${keys[i]}`]=`${keysFiltro[y]}`;
                        //console.log("excluye 1", excluye);
                        keyChangeE=true;

                    }




                }
                else
                {

                    if(incluyeFiltro[Object.keys(incluyeFiltro)[y]]==true){
                   
                        //--perro

                        if(keyChangeI==true){

                            incluye[`${keys[i]}`]= [incluye[`${keys[i]}`],`${keysFiltro[y]}`];
                            //console.log("incluye 2", incluye);
                        }
                        else
                        {


                            incluye[`${keys[i]}`]=`${keysFiltro[y]}`;
                            //console.log("incluye 1", incluye);
                            keyChangeI=true;



                        }



                    }


                }




            }

        }

        const animales = await userModel.listAnimalsFiltrado(incluye, excluye);
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
    }

    public async listAnimalsUser(req: Request, res: Response) {
        console.log(req.body);
        const { id } = req.params;
        const animales = await userModel.listarAnimalesUser(id);
        console.log(animales);
        return res.json(animales);
        //res.send('Listado de animales!!!');
    }

    public async listAnimalsUserAdoptados(req: Request, res: Response) {
        console.log(req.body);
        const { id } = req.params;
        const animales = await userModel.listarAnimalesUserAdoptados(id);
        console.log(animales);
        return res.json(animales);
    }

    public async listAnimalsUserEnAdopcion(req: Request, res: Response) {
        console.log(req.body);
        const { id } = req.params;
        const animales = await userModel.listarAnimalesUserEnAdopcion(id);
        console.log(animales);
        return res.json(animales);
    }


    public async find(req: Request, res: Response) {
        console.log(req.params.id);
        const { id } = req.params;
        const usuario = await userModel.buscarId(id);
        if (usuario)
            return res.json(usuario);
        return res.status(404).json({ text: "User doesn't exists" });
    }


    public async findUserWithMail(req: Request, res: Response) {
        console.log(req.params.id);
        const { mail } = req.params;
        const usuario = await userModel.buscarEmail(mail);
        if (usuario)
            return res.json(usuario);
        return res.status(404).json({ text: "User doesn't exists" });
    }


    public async findAnimal(req: Request, res: Response) {
        console.log(req.params.id);
        const { id } = req.params;
        const animal = await userModel.buscarIdAnimal(id);
        if (animal)
            return res.json(animal);
        return res.status(404).json({ text: "animal doesn't exists" });
    }

    public async addUser(req: Request, res: Response) {
        const usuario = req.body;
        const { nombre, email, nro_celular } = req.body;
        delete usuario.repassword;
        console.log(req.body);
        try {
            const emailExiste = await userModel.buscarEmail(usuario.email);
            console.log('emailExiste => ', emailExiste);
            if(emailExiste){
				console.log('dentro de emailExiste');
                return res.status(403).json({message: 44});
            }
        } catch (error) {
            return res.status(403).json({message: 'Ha ocurrido un error'+error});
        }

        let user;
        try {
            user = await userModel.crear(usuario);
            console.log('user => ', user);
        } catch (error) {
            console.log('Error al crear usuario');
            return res.status(403).json({message: 'Error al intentar crear usuario'+error});
        }
        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    type: "OAuth2",
                    user: "adogtamesa@gmail.com",
                    clientId: "548268239241-t5g8ugpitk66mpa4bfkbkr9bl17g1rrf.apps.googleusercontent.com",
                    clientSecret: "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",
                    refreshToken: "1//04IBPVJJF2IvuCgYIARAAGAQSNwF-L9IrCVT-Yb6lhPFPMf8wVGw2dY2z16BLN5364yDGvq6Hbx1DFU98b2UbreGX5g3Uj9RbR9Q"
                }
            });

            const user = await userModel.buscarEmail(usuario.email);
            console.log('Servidor user => ', user);

            const token: string = jwt.sign(
                { _id: user.id },
                "secretKey",
                {
                    expiresIn: '1d',
                }
            );

			console.log('token => ', token);

            const url = `http://adogtameweb.herokuapp.com/usuarios/verificar/${token}`;
            var contentHTML = `
						<h1>Completa tu registro - Adogtame App</h1>
						<h2>Hola ${nombre}!</h2>
							
						<p>Por favor haz click en el siguiente link, o copialo en la barra de direcciones de tu navegador
						para completar el proceso de registro:</p>
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

            const info = await transporter.sendMail({
                from: "'Adogtame App' <adogtamesa@gmail.com>",
                to: email,
                subject: "Confirmacion de registro Adogtame App",
                html: contentHTML
            });

            console.log('Message sent, info => ', info);

            console.log('token result => ', token);
            return res.status(200).json({ message: user, token: token });
            //return res.json({ message: 'User saved!!' });
        } catch (error) {
			console.log('algo salio mal, error:', error);
            return res.status(403).json({ message: 'Algo salio mal' });
        }
    }

    public async recoverPassword(req: Request, res: Response) {
        console.log('adogtame-app req => ',req.body);
        const {email} = req.body;
        if(!(email)) {
            return res.status(400).json({message: email+'Email de usuario requerido!'});
        }

        const message = 'Se ha enviado un e-mail a la casilla de correo electronico indicada, por favor,'+
            'revise su bandeja de entrada para poder restaurar su contraseña.';

        let verificationLink;
        let emailStatus: string = 'OK';
        let user;

        //const userRepository = buscarEmail(Users);
        
        try {
            //Buscar user en base de datos
            user = await userModel.buscarEmail(email);
            const token: string = jwt.sign(
                { _id: user.id, email: user.email },
                "secretKey",
                {
                    expiresIn: '1h',
                }
            );

            console.log('token => ', token);

            verificationLink = `https://adogtameweb.herokuapp.com/usuarios/new-password/${token}`;
            user.resetToken = token;
        } catch (error) {
            //En caso de no haberlo encontrado en la BD, arrojar el mensaje de la variable "message"
            return res.json({message: 'Algo ha salido mal'});
        }

        //TO DO: SendEmail
        try {
            const transporter = nodemailer.createTransport({
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

            const info = await transporter.sendMail({
                from: "'Adogtame App' <adogtamesa@gmail.com>",
                to: email,
                subject: "Restablecer contraseña en Adogtame Web",
                html: contentHTML
            });
        } catch (error) {
            emailStatus = String(error);
            return res.status(400).json({message: 'Algo salio mal, por favor contactese con el equipo de soporte para mas informacion 1'});
        }
        let result;
        try {
            result = await userModel.updateDataUsuario(user, user.id);
        } catch (error) {
            emailStatus = String(error);
            return res.status(400).json({message: 'Algo salio mal, por favor contactese con el equipo de soporte para mas informacion'});
        }

        res.status(200).json({message: result});
    }

    public async newPassword(req: Request, res: Response) {
        const {newPassword} = req.body;
        console.log('newPassword ',newPassword);
        const resetToken = req.headers['reset'] as string;
        console.log('resetToken ', resetToken);
        
        if(!(resetToken && newPassword)) {
            res.status(400).json({message: 'Todos los campos son requeridos'});
        }

        let jwtPayload;
        let user;
        let result;

        try {
            jwtPayload = jwt.verify(resetToken, 'secretKey');
            user = await userModel.buscarToken(resetToken);
        } catch (error) {
            return res.status(401).json({message: 'Algo salio mal, por favor contactese con soporte para mas informacion 1'});
        }

        user.password = newPassword;
        
        try {
            result = await userModel.updateDataUsuario(user, user.id);
        } catch (error) {
            return res.status(401).json({message: 'Algo salio mal, por favor contactese con soporte para mas informacion'});
        }

        return res.status(200).json({message: result});
    }

    public async confirmarRegistro(req: Request, res: Response) {
        try {
            const jwtPayload = jwt.verify(req.params.token, 'secretKey');
            console.log('jwtPayload', jwtPayload);
            interface JWTPayload {
                _id: string;
            }
            const id = (jwtPayload as JWTPayload)._id;
            console.log('Servidor id => ', id);
            const result = await userModel.confirmarUsuario(1, id);
            return res.status(200).json({ message: result });
        } catch (e) {
            console.log('Servidor entro en el catch');
            res.send('error');
        }
    }

    public async addAnimal(req: Request, res: Response) {
        const animal = req.body;

        console.log("Q onda cuantos son", req.body);

        const busqueda = await userModel.buscarAnimal(animal.nombre, animal.idDador);
        if (!busqueda) {

            const result = await userModel.crearAnimal(animal);


            //Hace falta pasar el id del nuevo animal creado, asi lo devolvemos para poder ir a ese perfil de animal


            console.log("EL id aca ", result);
            // res.redirect("./signin");   
            return res.json({ id: result });


        }


        return res.status(403).json({ message: 'animal exists!!' });




    }



    public async update(req: Request, res: Response) {
        console.log(req.body);
        const { id } = req.params;
        const result = await userModel.actualizar(req.body, id);
        //res.send('Usuario '+ req.params.id +' actualizado!!!');

        //creo hay q cambiar por res.status.json
        return res.json({ text: 'updating a user ' + id });
    }

    public async delete(req: Request, res: Response) {
        console.log(req.body);
        //res.send('Usuario '+ req.params.id +' Eliminado!!!');
        const { id } = req.params; // hacemos detrucsturing y obtenemos el ID. Es decir, obtenemos una parte de un objeto JS.
        const result = await userModel.eliminar(id);
        //return res.json({ text: 'deleting a user ' + id });
        res.redirect('../control');
    }
    //FIN CRUD


    //Interes

    public async mostrarInteres(req: Request, res: Response) {


        const idInteresado = req.body.idInteresado;



        console.log(req.body);
        console.log("El id del interesado", idInteresado);
        const { idAnimal } = req.params;
        console.log("El id del animal", idAnimal);
        const result = await userModel.mostrarInteres(idAnimal, idInteresado);

        return res.status(200).json({ text: 'Mostrando Interes de' + idInteresado });



    }


    public async quitarInteres(req: Request, res: Response) {


        const idInteresado = req.body.idInteresado;



        console.log(req.body);
        console.log("El id del interesado", idInteresado);
        const { idAnimal } = req.params;
        console.log("El id del animal", idAnimal);
        const result = await userModel.quitarInteres(idAnimal, idInteresado);

        return res.status(200).json({ text: 'Mostrando Interes de' + idInteresado });



    }
    

    public async cargarInteres(req: Request, res: Response) {
        const idUsuario = req.body.idUsuario;
        console.log(req.body);
        console.log("El id del Usuario", idUsuario);
        const { idAnimal } = req.params;
        console.log("El id del animal", idAnimal);
        const result = await userModel.cargarInteres(idAnimal, idUsuario);

        console.log("El pinche result",result);
        return res.json(result);

    }



    public async cargarInteresados(req: Request, res: Response) {


        const { idAnimal } = req.params;
        console.log("El id del animal", idAnimal);
        const result = await userModel.cargarInteresados(idAnimal);

        console.log("El result  ",result);
        return res.json(result);



    }


    //

    public async siguiendoAnimales(req: Request, res: Response) {


        const { idUsuario } = req.params;
        console.log("El id del usuario", idUsuario);
        const result = await userModel.siguiendoAnimales(idUsuario);

        console.log("El result  ",result);
        return res.json(result);



    }

    //



    //Atualizar datos (Modificar / updates)
    public async updateDataUsuario(req: Request, res: Response) {
		
        console.log(req.body);
		const idUsuario = req.params.id;    
		var usuarioCambios:any=req.body;

        console.log("idUsuario",idUsuario);
        console.log("usuarioCambios q hay",usuarioCambios);

		const result = await userModel.updateDataUsuario(usuarioCambios, idUsuario);

		res.status(200).json({ text: "usuario actualizado correctamente" });


	}


    public async modificarDatosAnimal(req: Request, res: Response) {
      
        console.log(req.body);
		const idAnimal = req.params.id;    
		var animalCambios:any=req.body;

        console.log("idAnimal",idAnimal);
        console.log("animalCambios q hay",animalCambios);
        const result = await userModel.modificarDatosAnimal(animalCambios, idAnimal);
        return res.json({ text: 'updating animal ' + idAnimal });
    }





    //APARTADO ADMIN


    public async deleteComentario(req: Request, res: Response) {
        console.log(req.body);
        //res.send('Usuario '+ req.params.id +' Eliminado!!!');
        const { id } = req.params; // hacemos detrucsturing y obtenemos el ID. Es decir, obtenemos una parte de un objeto JS.
        const result = await userModel.eliminarComentario(id);
        //return res.json({ text: 'deleting a user ' + id });
        //res.redirect('../abmProductos');

        res.status(200).json({ text: "Comentario eliminado correctamente" });
    }



    public async cantidadInteresados(req: Request, res: Response) {
        console.log(req.body);
        const { cantidad } = req.params;
        console.log("animal idd ", cantidad);
        const cantidadInteresados = await userModel.cantidadInteresados(cantidad);
        console.log(cantidadInteresados);
        return res.json(cantidadInteresados);
    }



    public async traerVacunasAnimal(req: Request, res: Response) {
        console.log(req.body);
        const { id } = req.params;
        console.log("animal id ", id);
        const vacunas = await userModel.traerVacunasAnimal(id);
        console.log(vacunas);
        return res.json(vacunas);
    }

    public async modificarVacunasAnimal(req: Request, res: Response) {
        console.log(req.body);
        const { id } = req.params;
        const vacunas = req.body;
        console.log("animal id ", id, "vacunas cambios", vacunas);
        const result = await userModel.modificarVacunasAnimal(vacunas, id);
        console.log(result);
        return res.json(result);
    }

    


    public async cantidadUsuariosRegistrados(req: Request, res: Response) {
        console.log(req.body);
        const usuariosRegistrados = await userModel.cantidadUsuariosRegistrados();
        console.log(usuariosRegistrados);
        return res.json(usuariosRegistrados);
    }
    public async cantidadAnimalesRegistrados(req: Request, res: Response) {
        console.log(req.body);
        const animalesRegistrados = await userModel.cantidadAnimalesRegistrados();
        console.log(animalesRegistrados);
        return res.json(animalesRegistrados);
    }
    public async cantidadAnimalesAdoptados(req: Request, res: Response) {
        console.log(req.body);
        const animalesAdoptados = await userModel.cantidadAnimalesAdoptados();
        console.log(animalesAdoptados);
        return res.json(animalesAdoptados);
    }
    public async cantidadAnimalesEnAdopcion(req: Request, res: Response) {
        console.log(req.body);
        const animalesEnAdopcion = await userModel.cantidadAnimalesEnAdopcion();
        console.log(animalesEnAdopcion);
        return res.json(animalesEnAdopcion);
    }

    public async promedioAnimalesAdoptados(req: Request, res: Response) {
        console.log(req.body);
        const promedio = await userModel.promedioAnimalesAdoptados();
        console.log(promedio);
        return res.json(promedio);
    }


}

const userController = new UserController();
export default userController;

