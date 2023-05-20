
exports.getAllUsers = (req, res) => {
    console.log("Showing all users");
    res.status(200).json({
        status: 'success',
    })
};
exports.createUser = (req, res) => {
    console.log("Creating a user");
    res.status(200).json({
        status: 'success',
    })
};
exports.getOneUser = (req, res) => {
    console.log("Get one users");
    res.status(200).json({
        status: 'success',
    })
};
exports.updateOneUser = (req, res) => {
    console.log("Updaing a user");
    res.status(201).json({
        status: 'success',
    })
};
exports.deleteUser = (req, res) => {
    console.log("Showing all users");
    res.status(300).json({
        status: 'success',
    })
};