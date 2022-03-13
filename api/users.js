const express = require("express");
const usersRouter = express.Router();

const bcrypt = require("bcrypt");
const { JsonWebToken } = require("jsonwebtoken");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

const { getUserByUsername, createUser, getUserById, getPublicRoutinesByUser } = require("../db");
const { requireUser } = require("./utils");

usersRouter.post("/register", async(request, response, next) => {
    const { username, password } = request.body;

    try {
        const _user = await getUserByUsername( username );

        if (password.length < 8) {
            next ({
                name: "PasswordError",
                message: "Password too shot"
            });
        }

        if(_user) {
            next({
                name: "UserExistError",
                message: "A user by that username already exists"
            });
        } else {
            const SALT_COUNT = 10;
            const hashedPwd = await bcrypt.hash(password, SALT_COUNT);
    
            const newUser = await createUser({ username, hashedPwd })
    
            response.send({
                newUser
            });
        }

    } catch ({ name, message }) {
        next({ name, message });
    }
    
});

usersRouter.post("/login", async(request, response, next) => {
    const { username, password } = request.body;

    try {
        const user = await getUser(username, password);

        const isValid = await bcrypt.compare(password, user.password);

        if (user && isValid) {
            const token = jwt.sign({ id: user.id, username }, JWT_SECRET );

            response.send({ message: "You are logged in!", token: token});
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
});

usersRouter.get("/me", requireUser, async(request, response, next) => {
    const { username } = request.body;
    try {
        const userInfo = await getUserByUsername(username);
        response.send(userInfo);
    } catch (error) {
        throw error
    }
});

usersRouter.get("/:username/routines", async(request, response, next) => {
    const { username } = request.params;

    const userRoutines = await getPublicRoutinesByUser({ username });
    response.send(userRoutines);
});


module.exports = usersRouter;