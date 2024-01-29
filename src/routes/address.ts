// addressRoutes.js
import express, { Request, Response, NextFunction } from "express";
import { prisma } from "../utils/db.utils";
const addressRouter = express.Router();
import { requireLogin } from "../middleware/requireLogin";
import { validate } from "../middleware/validateRequest";
import { adderssInput, addressSchema, adderssUpdateInput, addressUpdateSchema, reqParams } from "../schema/address";
import { limiter } from "../middleware/rateLimit";
// Add a new address to a restaurant
addressRouter.post('/add',
 [
    requireLogin,
    limiter,
    validate(addressSchema)],
  async (req: Request<{}, {}, adderssInput['body']>, res: Response, next: NextFunction) => {
  const { restaurantId, city, state, postalCode } = req.body;

  try {
    const restaurantExists = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurantExists) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const newAddress = await prisma.address.create({
      data: {
        restaurantId,
        city,
        state,
        postalCode,
      },
    });

    res.status(201).json({"message":`${newAddress.id}, created`});
  } catch (error:any) {
    next(error);
  }
});


// Update an existing address for a restaurant
addressRouter.put('/update/:id', 
[
    requireLogin,
    limiter,
    validate(addressUpdateSchema)],
async (req: Request<reqParams['body'], {}, adderssUpdateInput['body']>, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { city, state, postalCode } = req.body;

  try {
    const updatedAddress = await prisma.address.update({
      where: { id },
      data: {
        city,
        state,
        postalCode,
      },
    });

    res.status(200).json({"message":`${updatedAddress.id}, updated`});
  } catch (error: any) {
    next(error);
  }
});

// Delete an address for a restaurant
addressRouter.delete('/delete/:id', [limiter, requireLogin], async (req: Request, res:Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const deletedAddress = await prisma.address.delete({
      where: { id },
    });

    res.status(200).json({"message":`${deletedAddress.id}, deleted`});
  } catch (error:any) {
    next(error);
  }
});

export {addressRouter};
