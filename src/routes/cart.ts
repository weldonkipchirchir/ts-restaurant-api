import express, { Request, Response, NextFunction } from "express";
import { prisma } from "../utils/db.utils";
const cartRouter = express.Router();
import { requireLogin } from "../middleware/requireLogin";
import { validate } from "../middleware/validateRequest";
import { limiter } from "../middleware/rateLimit";

type User = {
  id: string;
  googleId:   string;
  displayName: string

};

const user_Id ="65b57e262408a500e81ff509";

// Add menu items to the user's cart for a specific restaurant
cartRouter.post('/add', 
// [requireLogin, limiter],
 async (req: Request, res: Response, next: NextFunction) => {
  const { menuId, quantity, restaurantId } = req.body;
  // const user = req.user as User;
  // const userId = user.id;

  try {
    const isMenuFromRestaurant = await prisma.menu.findFirst({
      where: { id: menuId, restaurantId },
    });

    if (!isMenuFromRestaurant) {
      return res.status(400).json({ message: 'Menu item does not belong to the specified restaurant.' });
    }

    const cartItem = await prisma.cart.create({
      data: {
        userId: user_Id,
        menuId,
        quantity,
      },
    });

    res.json(cartItem);
  } catch (error) {
    next(error);
  }
});

// Get the user's cart items
cartRouter.get('/', 
// [requireLogin, limiter],
 async (req: Request, res: Response, next: NextFunction) => {
  
  // const user = req.user as User;
  // const userId = user.id;
  try {
    const cartItems = await prisma.cart.findMany({
      where: { userId: user_Id },
      include: { menu: true },
    });

    res.json(cartItems);
  } catch (error) {
    next(error);
  }
});

// Remove an item from the user's cart
cartRouter.delete('/:id', 
// [requireLogin, limiter],
 async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  // const user = req.user as User;
  // const userId = user.id;
  try {
    const deletedCartItem = await prisma.cart.delete({
      where: { id, userId: user_Id },
    });

    res.json({"message":`${deletedCartItem.id} deleted`});
  } catch (error) {
    next(error);
  }
});

export {cartRouter};

// Add menu items to the user's cart for a specific restaurant
// Get the user's cart items
// Remove an item from the user's cart
