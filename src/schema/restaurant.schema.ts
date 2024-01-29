import {object, string, TypeOf} from 'zod'

export const restaurantSchema = object({
  body: object({
    name: string({required_error:"Name required"}).min(3).max(50),
    description: string({required_error:"Description"}).min(3).max(50),
    phoneNumber: string({required_error:'PhoneNumber is required'}).min(10).max(13),
  })  
})

export type restaurantInput = TypeOf<typeof restaurantSchema>