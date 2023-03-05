import { Router, Request, Response } from 'express';
class IndexRoutes{
	public router: Router = Router();
	constructor(){
		this.config();
	}
	config():void{
		this.router.get('/',(req:Request,res:Response)=> {
           //res.send("Hola Mundo!!!");
			req.session.auth=false;
			req.session.user={};
		   res.render("partials/principal");		
        });
	}
}

//Exportamos el enrutador con 

const indexRoutes = new IndexRoutes();
export default indexRoutes.router;