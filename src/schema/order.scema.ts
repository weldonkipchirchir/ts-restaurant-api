import {object, string, number, TypeOf} from 'zod'

export const orderSchema = object({
  body: object({
    quantity: string({required_error:"Name required"}).min(3).max(50),
    user: string({required_error:"Description"}),
    userId: number({required_error:'price is required'}),
    restaurant: number({required_error:'calories is required'}),
    restaurantId: number({required_error:'restaurantId is required'}),
  })  
})

export type orderInput = TypeOf<typeof orderSchema>
