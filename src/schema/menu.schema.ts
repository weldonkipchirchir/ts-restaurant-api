import {object, string, number, TypeOf} from 'zod'

export const menuSchema = object({
  body: object({
    name: string({required_error:"Name required"}).min(3).max(50),
    description: string({required_error:"Description"}),
    price: number({required_error:'price is required'}),
    calories: number({required_error:'calories is required'}),
    protein: number({required_error:'protein is required'}),
    carbohydrates: number({required_error:'carbohydrates is required'}),
    fat: number({required_error:'fat is required'}),
    restaurantId: string({required_error:'restaurantId is required'}).min(1).max(25),
  })  
})

export type menuInput = TypeOf<typeof menuSchema>

export const menuUpdateSchema = object({
  body: object({
    name: string({required_error:"Name required"}).min(3).max(50),
    description: string({required_error:"Description"}),
    price: number({required_error:'price is required'}),
    calories: number({required_error:'calories is required'}),
    protein: number({required_error:'protein is required'}),
    carbohydrates: number({required_error:'carbohydrates is required'}),
    fat: number({required_error:'fat is required'}),
  })  
})

export type menuUpdateInput = TypeOf<typeof menuUpdateSchema>

export const reqSchema = object({
    body: object({
      id: string({required_error:"id required"}).min(3).max(50),
    })  
  })
  
  export type reqParams = TypeOf<typeof reqSchema>