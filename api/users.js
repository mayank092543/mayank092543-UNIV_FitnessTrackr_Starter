const express = require("express");
const usersRouter = express.Router();
const bcrypt = require("bcrypt");
const { getUserByUsername, createUser } = require("./db");

usersRouter.post("/register", async(request, response, next) => {
    const { username, password } = request.body;

        if (password.length < 8) {
            next ({
                name: "PasswordError",
                message: "Password too shot"
            });
        }
    try {
        const _user = await getUserByUsername( username );

        if(_user) {
            next({
                name: "UserExistError",
                message: "A user by that username already exists"
            });
        }

        const SALT_COUNT = 10;
        const hashedPwd = await bcrypt.hash(password, SALT_COUNT);

        const newUser = await createUser({ username, hashedPwd })

        response.send({
            message: "Thankyou for signing up"
        });

    } catch (error) {
        next(error);
    }
    
})

module.exports = usersRouter;