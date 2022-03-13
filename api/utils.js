function requireUser(request, response, next) {

    if (!request.user) {
        next({
            name: "MissingUserError",
            message: "You must be logged in to perfrom this action"
        });
    }

    next();
}    

module.exports = { requireUser };