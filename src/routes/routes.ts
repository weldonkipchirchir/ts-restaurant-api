import express, {Request, Response} from 'express'
import { limiter } from '../middleware/rateLimit'

export const healthcheckRoute = express.Router()

healthcheckRoute.get('/healthcheck', limiter, (req: Request, res:Response)=>{
    const status = {status:"UP"}
    res.status(200).send(status);
})



