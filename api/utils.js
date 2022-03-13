require("dotenv").config();

function requireUser(request, response, next) {

    const jwt = require("jsonwebtoken");
    const { JWT_SECRET } = process.env;
    const prefix = "Bearer";
    const auth = request.header ("Authorization");

    if (!auth) {
        next({
            name: "AuthorizationHeaderError",
            message: "Authorization is missing in headers"
        });
    } else if (auth.startWith(prefix)) {
        const token = auth.slice(prefix.length);

        try {
            const { id } = jwt.verify(token, JWT_SECRET);
            
            if(id) {
                request.user = await getUserById(id);
                next();
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

}

module.exports = { requireUser };