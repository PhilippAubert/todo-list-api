import express from "express";
import { 
    login_get,
    login_post,
    logout,
    signup_get, 
    signup_post 
} from "../controller/authController.js";

const loginRouter = express.Router();

loginRouter.route("/register")
    .get(signup_get)
    .post(signup_post);

loginRouter.route("/login")
    .get(login_get)
    .post(login_post);

loginRouter.route("/logout")
    .get(logout);

export default loginRouter;