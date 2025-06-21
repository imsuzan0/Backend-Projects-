import express from "express"
import { jwtAuthMiddleware } from "../middleware/jwt.js"
import { signup ,login,getProfile,changePassword} from "../controllers/user.controller.js"

const userRouter=express.Router()

userRouter.post("/signup",signup)
userRouter.post("/login",login)
userRouter.get("/profile",jwtAuthMiddleware,getProfile)
userRouter.post("/profile/change-password",jwtAuthMiddleware,changePassword)


export default userRouter