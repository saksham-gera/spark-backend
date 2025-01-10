// middleware.js

let isLoggedIn = false;

const checkAuthMiddleware = (req, res, next) => {
  // Check the authentication logic here, such as checking if the user is logged in
  // For simplicity, I'm assuming isLoggedIn is set elsewhere, you may need to customize this logic
  if (isLoggedIn) {
    next(); // User is authenticated, proceed to the next middleware/route handler
  } else {
    res.status(401).send('Unauthorized'); // User is not authenticated, send 401 Unauthorized status
  }
};

const updateAuthStatusMiddleware = (req, res, next) => {
  // Update the isLoggedIn variable based on your authentication logic
  // This could be done after successful login/signup
  isLoggedIn = true;
  next();
};

module.exports = { checkAuthMiddleware, updateAuthStatusMiddleware };
