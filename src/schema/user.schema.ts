import {object, string, TypeOf} from 'zod'

export const userSchema = object({
  body: object({
    firstName: string({required_error:"firstName required"}).min(3).max(50),
    lastName: string({required_error:"lastName"}).min(3).max(50),
    email: string({required_error:'Email is required'}).email("Not a valid email"),
    password: string({
        required_error: "Password required",
      }).min(6, "Password too short, should be at least 6 characters long")
  })  
})

export type CreateUserInput = TypeOf<typeof userSchema>