import { Router, Request, Response } from 'express';
import userController from "../controller/userController";

class UserRoutes {
    public router: Router = Router();
    constructor() {
        this.config();
    }
    config(): void {
        this.router.get('/', (req: Request, res: Response) => {
            res.send('Main!!!');
            //res.render("partials/principal");
        });

        // Login
        this.router.get('/signin', userController.signin);
        this.router.post('/signin', userController.login);

        // Registro
        this.router.get('/signup', userController.signup);
        this.router.post('/signup', userController.addUser);
        
        this.router.get('/signupAnimal', userController.signupAnimal);
        this.router.post('/signupAnimal', userController.addAnimal);

        //Recuperar contraseña
        this.router.post('/password-recovery', userController.recoverPassword);
        this.router.get('/password-recovery', userController.recoverPassword);
        this.router.post('/new-password/:token', userController.newPassword);

        // Home del usuario
        this.router.get('/home',userController.home);
        this.router.get('/control',userController.control);
        this.router.post('/procesar',userController.procesar);
        this.router.get('/salir',userController.endSession);
        this.router.get('/error',userController.showError);
        this.router.get('/delete/:id',userController.delete);
        this.router.get('/adoptados',userController.adoptados);
        this.router.get('/solicitudesEnviadas',userController.solicitudesEnviadas);
        this.router.get('/solicitudesRecibidas',userController.solicitudesRecibidas);

        /* Informes */
        this.router.get('/informes',userController.informes);
        this.router.get('/cantidadUsuariosRegistrados',userController.cantidadUsuariosRegistrados);
        this.router.get('/cantidadAnimalesRegistrados',userController.cantidadAnimalesRegistrados);
        this.router.get('/cantidadAnimalesAdoptados',userController.cantidadAnimalesAdoptados);
        this.router.get('/cantidadAnimalesEnAdopcion',userController.cantidadAnimalesEnAdopcion);
        this.router.get('/promedioAnimalesAdoptados',userController.promedioAnimalesAdoptados);
        
        //Notificaciones

        //Buscar los id de animal de los animales del usuario logueado y interesados de ese animal
        this.router.get('/notificacionesListar/:id',userController.notificacionesListar);
        this.router.get('/notificacionesConteo/:id',userController.notificacionesConteo);
        this.router.get('/notificacionesVistas/:id',userController.notificacionesVistas);
        

        //Interes
		this.router.post('/mostrarInteres/:idAnimal',userController.mostrarInteres);
		this.router.post('/quitarInteres/:idAnimal',userController.quitarInteres);
		this.router.post('/cargarInteres/:idAnimal',userController.cargarInteres);
		this.router.get('/cargarInteresados/:idAnimal',userController.cargarInteresados);

        //
		this.router.get('/siguiendoAnimales/:idUsuario',userController.siguiendoAnimales);
        
        //   
        //Adopcion animal        
		this.router.post('/comenzarAdopcion',userController.comenzarAdopcion);
		this.router.post('/confirmarAdopcion/:idAnimal',userController.confirmarAdopcion);
		this.router.get('/estadoAnimal/:idAnimal',userController.estadoAnimal);
		this.router.delete('/cancelarProcesoAdopcion/:idAnimal',userController.cancelarProcesoAdopcion);


		//Confirmacion de registro via nodemailer
		this.router.get('/confirmar/:token',userController.confirmarRegistro);


		this.router.get('/list',userController.list);
		this.router.get('/listAnimals',userController.listAnimals);
        this.router.get('/listarAnimalesAdoptados',userController.listarAnimalesAdoptados);
        this.router.get('/listarAnimalesSinAdoptar',userController.listarAnimalesSinAdoptar);
        this.router.get('/fechaAdoptados',userController.fechaAdoptados);
        this.router.get('/cantidadInteresados/:cantidad',userController.cantidadInteresados);
 
		this.router.post('/listAnimalsFiltrado',userController.listAnimalsFiltrado);
		this.router.get('/listAnimalsUser/:id',userController.listAnimalsUser);
        this.router.get('/listAnimalsUserAdoptados/:id',userController.listAnimalsUserAdoptados);
        this.router.get('/listAnimalsUserEnAdopcion/:id',userController.listAnimalsUserEnAdopcion);
        
		this.router.get('/find/:id',userController.find);
		this.router.get('/findAnimal/:id',userController.findAnimal);
		this.router.post('/add',userController.addUser);
		this.router.put('/update/:id',userController.update);
		this.router.delete('/delete/:id',userController.delete);


        //Atualizar datos (Modificar / updates)
        this.router.put('/updateDataUsuario/:id',userController.updateDataUsuario);
        // Modificar datos del animal
        this.router.put('/modificarDatosAnimal/:id',userController.modificarDatosAnimal);        
        this.router.put('/modificarVacunasAnimal/:id',userController.modificarVacunasAnimal);
        this.router.get('/traerVacunasAnimal/:id',userController.traerVacunasAnimal);
        //
		this.router.post('/dToken',userController.dToken);
        // FIN DEL CRUD
		this.router.get('/findUserWithMail/:mail',userController.findUserWithMail);



        
        //APARTADO ADMIN
        //Para no crear otro objeto q sea admin lo metemos en user

        //Esto del comentario falta borrar
        //this.router.delete('/deleteComentario/:id',userController.deleteComentario);	



    }
}

//Exportamos el enrutador con 
const userRoutes = new UserRoutes();
export default userRoutes.router;
