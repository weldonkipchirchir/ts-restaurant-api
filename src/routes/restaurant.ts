import express, { Request, Response, NextFunction } from "express";
import { prisma } from "../utils/db.utils";
const restaurantRouter = express.Router();
import { requireLogin } from "../middleware/requireLogin";
import { validate } from "../middleware/validateRequest";
import { restaurantInput, restaurantSchema } from "../schema/restaurant.schema";
import { limiter } from "../middleware/rateLimit";
// Get all restaurants
restaurantRouter.get(
  "/",
  // [requireLogin, limiter],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const restaurants = await prisma.restaurant.findMany({
        select: {
          id: true,
          name: true,
          description: true,
          address: true,
          phoneNumber: true,
          menus: true,
        },
      });

      if (!restaurants) {
        return res.status(404).json({ message: "Restaurant not found" });
      }

      // Map the restaurants to a new array with desired modifications
      const modifiedRestaurants = restaurants.map((restaurant) => ({
        id: restaurant.id,
        name: restaurant.name,
        description: restaurant.description,
        address: restaurant.address,
        phoneNumber: restaurant.phoneNumber,
      }));

      res.status(200).json(modifiedRestaurants);
    } catch (err: any) {
      console.log(err.message)
      next(err);
    }
  }
);

// Get a specific restaurant by ID
restaurantRouter.get(
  "/:id",
  [limiter, requireLogin],
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      const restaurant = await prisma.restaurant.findFirst({
        where: {
          id,
        },
        select: {
          id: true,
          name: true,
          description: true,
          address: true,
          phoneNumber: true,
          menus: {
            select: {
              id: true,
              name: true,
              description: true,
              price: true,
              calories: true,
              protein: true,
              carbohydrates: true,
              fat: true,
            },
          },
        },
      });

      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }

      res.status(200).json(restaurant);
    } catch (err: any) {
      next(err);
    }
  }
);

// Get menus from a specific restaurant
restaurantRouter.get(
  "/menu/:id", 
  // [limiter, requireLogin],
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      const restaurantMenu = await prisma.restaurant.findFirst({
        where: {
          id,
        },
        select: {
          menus: {
            select: {
              id: true,
              name: true,
              description: true,
              price: true,
              calories: true,
              protein: true,
              carbohydrates: true,
              fat: true,
            },
          },
        },
      });

      if (!restaurantMenu) {
        return res.status(404).json({ message: "Restaurant not found" });
      }

      res.json(restaurantMenu);
    } catch (err: any) {
      next(err);
    }
  }
);

//create restaurant
restaurantRouter.post(
  "/create",
  [limiter,
    requireLogin,
  validate(restaurantSchema)],
  async (req: Request <{}, {}, restaurantInput['body']>, res: Response, next: NextFunction) => {
    try {
      const { name, description, phoneNumber } = req.body;
      const newRestaurant = await prisma.restaurant.create({
        data: {
          name,
          description,
          phoneNumber,
        },
        select: {
          id: true,
          name: true,
          description: true,
          address: true,
          phoneNumber: true,
          menus: {
            select: {
              id: true,
              name: true,
              description: true,
              price: true,
              calories: true,
              protein: true,
              carbohydrates: true,
              fat: true,
            }
          }
        },
      });
      res.status(201).json(newRestaurant);
    } catch (err: any) {
      next(err);
    }
  }
);

//update restaurant
restaurantRouter.put(
  "/update/:id",
  [
    requireLogin,
    limiter,
    validate(restaurantSchema)],
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { name, description, phoneNumber } = req.body;
    try {
      const restaurant = await prisma.restaurant.findFirst({
        where: {
          id,
        },
      });

      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }
      const restaurantUpdate = await prisma.restaurant.update({
        where: { id },
        data: {
          name,
          description,
          phoneNumber,
        },
        select: {
          id: true,
          name: true,
          description: true,
          address: true,
          phoneNumber: true,
          menus: {
            select: {
              id: true,
              name: true,
              description: true,
              price: true,
              calories: true,
              protein: true,
              carbohydrates: true,
              fat: true,
            },
          },
        },
      });

      res.status(201).json(restaurantUpdate);
    } catch (err: any) {
      next(err);
    }
  }
);

//delete book based on id
restaurantRouter.delete(
  "/delete/:id",
  [requireLogin, limiter],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const restaurant = await prisma.restaurant.findFirst({
        where: {
          id,
        },
      });

      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }

      const restaurantDelete = await prisma.restaurant.delete({
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
        .json({ message: `${restaurantDelete.name} deleted successfully` });
    } catch (err: any) {
      next(err);
    }
  }
);

export { restaurantRouter };
