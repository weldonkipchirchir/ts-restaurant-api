// orderRoutes.js
import express, { Request, Response, NextFunction } from "express";
import { prisma } from "../utils/db.utils";
const orderRouter = express.Router();
import { requireLogin } from "../middleware/requireLogin";
import { validate } from "../middleware/validateRequest";
import { adderssInput, addressSchema, adderssUpdateInput, addressUpdateSchema, reqParams } from "../schema/address";
import { limiter } from "../middleware/rateLimit";

type User = {
  id: string;
  googleId:   string;
  displayName: string
};

const User_Id ="65b57e262408a500e81ff509";

// Create a new order based on items in the user's cart
orderRouter.post('/create', 
// requireLogin,
 async (req: Request, res: Response, next: NextFunction) => {
  // const user = req.user as User;
  // const userId = user.id;
  try {
    const cartItems = await prisma.cart.findMany({
      where: { userId: User_Id },
      include: { menu: true },
    });

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: 'User has no items in the cart.' });
    }
    let orderItems: any[]; // Define the variable outside the mapping function

   orderItems = cartItems.map((cartItem) => {
  // Access individual values here
  const menuId = cartItem.menuId;
  const id = cartItem.id;
  const quantity = cartItem.quantity;
  const userId = cartItem.userId;

  // Create the order item object
  return {
    menu: { connect: { menuId } },
    id,
    quantity,
    userId,
  };
});
   console.log(orderItems) 
   
    // const restaurant_Id: string = cartItems[0]?.menu?.restaurantId; // Change this according to your data structure
    // console.log(restaurant_Id)

    // const restaurant_Id = prisma.menu.findUnique({
    //   where:{
    //     id: menu_Id
    //   }, select:{
    //     restaurantId:true
    //   }
    // })
    
    // const order = await prisma.order.create({
    //   data: {
    //     userId: User_Id,
    //     restaurantId: restaurant_Id,
    //     items: {
    //       create: orderItems,
    //     },
    //   },
    //   include: { items: { include: { menu: true } } },
    // });
    

    // await prisma.cart.deleteMany({ where: { userId: User_Id } });

    // res.json(order);
  } catch (error) {
    next(error);
  }
});

// Get all orders for a user
orderRouter.get('/', 
// requireLogin,
 async (req, res, next) => {
  // const user = req.user as User;
  // const userId = user.id;
  try {
    const orders = await prisma.order.findMany({
      where: { userId: User_Id },
      include: { items: { include: { menu: true } } },
    });

    res.json(orders);
  } catch (error) {
    next(error);
  }
});

export {orderRouter};
