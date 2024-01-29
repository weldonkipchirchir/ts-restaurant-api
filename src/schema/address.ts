import {object, string, TypeOf} from 'zod'

export const addressSchema = object({
  body: object({
    city: string({required_error:"City required"}).min(3).max(50),
    state: string({required_error:"State"}).min(3).max(50),
    postalCode: string({required_error:'postalCode is required'}),
    restaurantId: string({required_error:'restaurantId is required'}),
  })  
})

export type adderssInput = TypeOf<typeof addressSchema>

export const addressUpdateSchema = object({
  body: object({
    city: string({required_error:"City required"}).min(3).max(50),
    state: string({required_error:"State"}).min(3).max(50),
    postalCode: string({required_error:'postalCode is required'}),
  })  
})

export type adderssUpdateInput = TypeOf<typeof addressUpdateSchema>

export const reqSchema = object({
  body: object({
    id: string({required_error:"id required"}).min(3).max(50),
  })  
})

export type reqParams = TypeOf<typeof reqSchema>

