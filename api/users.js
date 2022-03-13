const express = require("express");
const usersRouter = express.Router();

const bcrypt = require("bcrypt");
const { getUserByUsername, createUser, getUserById, getPublicRoutinesByUser } = require("../db");
const jwt = require("jsonwebtoken");

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

usersRouter.post("/login", async(request, response, next) => {
    const { username, password } = request.body;

    try {
        const user = await getUserByUsername(username);

        const isValid = await bcrypt.compare(password, user.password);

        if (user && isValid) {
            const token = jwt.sign({ id: user.id, username }, process.env.JWT_SECRET );

            response.send({token: token});
        }
    } catch (error) {
        next(error);
    }
});

usersRouter.get("/me", async(request, response, next) => {
    const prefix = "Bearer";
    const auth = request.header ("Authorization");

    if (!auth) {
        next({ // Is this right??
            name: "AuthorizationHeaderError",
            message: "Authorization is missing in headers"
        });
    } else if (auth.startWith(prefix)) {
        const token = auth.slice(prefix.length);

        try {
            const { id } = jwt.verify(token, JWT_SECRET);
            
            if(id) {
                const userInfo = await getUserById(id);
                response.send(userInfo); // returning user's Data
                next();
            } else {
            next ({
                name: "AuthorizationHeaderError",
                message: "Authorization token malformed"
            });
        }
    } catch ({ name, message}) {
        next({ name, message });
    }
    
    } else {
        next ({
            name: "AuthorizationHeaderError",
            message: `Authorization token must start with ${prefix}`
        });
    }
});

usersRouter.get("/users/:username/routines", async(request, response, next) => {
    const { username } = request.params;

    const userRoutines = await getPublicRoutinesByUser({ username });
    response.send(userRoutines);
});


module.exports = usersRouter;