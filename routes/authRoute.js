import express  from "express";
import {signupController,loginController,testController, googleController,forgotPasswordController, updateProfileController, getOrdersController, getAllOrdersController, orderStatusController, deleteOrderController} from '../controller/authController.js'
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
//router object
const router=express.Router()

router.post('/signup',signupController)

router.post('/login',loginController)

router.post('/google',googleController)

router.post('/forgot-password',forgotPasswordController)
//protected route
router.get('/user-auth',requireSignIn,(req,res)=>{
    res.status(200).send({
        ok:true
    })
})

router.get('/admin-auth',requireSignIn,isAdmin,(req,res)=>{
    res.status(200).send({
        ok:true
    })
})
//apdate profile
router.put('/profile/:pid',updateProfileController)
//test routes
router.get('/test',requireSignIn,isAdmin,testController)

//order
router.get('/orders/:pid',getOrdersController)

router.get('/all-orders',getAllOrdersController)

router.delete('/delete-order/:pid',deleteOrderController)

router.put('/order-status/:orderId',orderStatusController)
export default router