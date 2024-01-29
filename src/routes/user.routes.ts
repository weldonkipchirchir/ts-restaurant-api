import {passport} from '../utils/passport'
import {Router, Request, Response} from 'express'
import { limiter } from '../middleware/rateLimit'

const authRoutes = Router()

authRoutes.get('/auth/google', limiter, passport.authenticate('google', {
    scope: ['profile', 'email']
}))

authRoutes.get('/auth/google/callback', limiter, 
  passport.authenticate('google'), (req: Request, res: Response) => {
    res.status(200).json({"message":"login successful"})
  });


authRoutes.get('/auth/logout', limiter, (req: Request, res: Response) => {
    req.logout((err: any) => {
      res.status(200).send('logout successful');
    });
  });

  authRoutes.get('/api/current_user',limiter, (req: Request, res: Response) => {
    res.send(req.user);
  });
  
  export {authRoutes};