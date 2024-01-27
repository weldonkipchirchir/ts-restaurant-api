import {passport} from '../utils/passport'
import {Router, Request, Response} from 'express'

const authRoutes = Router()

authRoutes.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}))

authRoutes.get('/auth/google/callback',
  passport.authenticate('google'), (req: Request, res: Response) => {
    res.status(200).json({"message":"login successful"})
  });


authRoutes.get('/auth/logout', (req: Request, res: Response) => {
    req.logout((err: any) => {
      res.status(200).send('logout successful');
    });
  });

  authRoutes.get('/api/current_user', (req: Request, res: Response) => {
    res.send(req.user);
  });
  
  export {authRoutes};