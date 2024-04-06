const bcrypt = require("bcryptjs");

const validateUserInput = (email, password) => {
    return email && password;
};

// Hashed password compared whit user input
const comparePassword = (password, hashedPassword) => {

    return bcrypt.compare(password, hashedPassword);
}


module.exports = {
    validateUserInput, 
    comparePassword
};