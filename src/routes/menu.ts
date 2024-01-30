import express, { Request, Response, NextFunction } from "express";
import { prisma } from "../utils/db.utils";
const menuRouter = express.Router();
import { requireLogin } from "../middleware/requireLogin";
import { validate } from "../middleware/validateRequest";
import {
  menuInput,
  menuSchema,
  reqParams,
  reqSchema,
  menuUpdateInput,
  menuUpdateSchema,
} from "../schema/menu.schema";
import { limiter } from "../middleware/rateLimit";

// Get a specific menu by ID
menuRouter.get(
  "/:id",
  //   requireLogin,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const menu = await prisma.menu.findUnique({
        where: { id: req.params.id },
      });
      if (!menu) return res.status(404).json("Menu not found");
      else return res.json(menu);
    } catch (e: any) {
      next(e);
    }
  }
);

const createMenuValidator = [limiter, requireLogin];

/**
 * Create new menu item
 */
menuRouter.post(
  "/create",
  //   createMenuValidator,
  validate(menuSchema),
  async (
    req: Request<{}, {}, menuInput["body"]>,
    res: Response,
    next: NextFunction
  ) => {
    const {
      name,
      description,
      price,
      calories,
      protein,
      carbohydrates,
      fat,
      restaurantId,
    } = req.body;
    try {
      const restaurantExists = await prisma.restaurant.findUnique({
        where: { id: restaurantId },
      });

      if (!restaurantExists) {
        return res.status(404).json({ message: "Restaurant not found" });
      }

      const createdMenu = await prisma.menu.create({
        data: {
          name,
          description,
          price,
          calories,
          protein,
          carbohydrates,
          fat,
          restaurantId,
        },
      });
      res.status(201).json(createdMenu);
    } catch (e: any) {
      next(e);
    }
  }
);

// Update an existing menu item with given ID
const updateMenuValidator = [validate(menuUpdateSchema), limiter];
menuRouter.put(
  "/:id",
  //   requireLogin,
  async (
    req: Request<reqParams["body"], {}, menuUpdateInput["body"]>,
    res: Response,
    next: NextFunction
  ) => {
    const { id } = req.params;
    const { name, description, price, calories, protein, carbohydrates, fat } =
      req.body;

    try {
      const updatedMenu = await prisma.menu.update({
        where: { id },
        data: {
          name,
          description,
          price,
          calories,
          protein,
          carbohydrates,
          fat,
        },
      });

      res.status(200).json({ message: `${updatedMenu.id}, updated` });
    } catch (error: any) {
      next(error);
    }
  }
);

menuRouter.get(
  "/restaurant-menu/:id",
  // [requireLogin, limiter],
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {

        const restaurantExists = await prisma.menu.findMany({
            where: { restaurantId:id }
          });
    
          if (!restaurantExists) {
            return res.status(404).json({ message: "Restaurant not found" });
          }
      const menu = await prisma.menu.findMany({
        where: { restaurantId: id },
        select: {
          name: true,
          description: true,
          price: true,
          calories:true,
          protein: true,
          carbohydrates:true,
          fat:true,
        },
      });

      // Map the restaurants to a new array with desired modifications
      const modifiedMenu = menu.map((menu) => ({
        name: menu.name,
        description: menu.description,
        price: menu.price,
        calories: menu.calories,
        protein: menu.protein,
        carbohydrates: menu.carbohydrates,
        fat: menu.fat,
      }));

      res.status(200).json(modifiedMenu);
    } catch (err: any) {
      next(err);
    }
  }
);

//delete book based on id
menuRouter.delete(
  "/delete/:id",
//   [requireLogin, limiter],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const menu = await prisma.menu.findFirst({
        where: {
          id,
        },
      });

      if (!menu) {
        return res.status(404).json({ message: "Restaurant not found" });
      }

      const menuDelete = await prisma.menu.delete({
        where: {
          id,
        },
        select: {
          id: true,
          name: true,
        },
      });

      res
        .status(200)
        .json({ message: `${menuDelete.name} deleted successfully` });
    } catch (err: any) {
      next(err);
    }
  }
);

export { menuRouter };
// Get all menus
