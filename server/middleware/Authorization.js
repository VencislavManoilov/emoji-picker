function Authorization(req, res, next) {
  // Check if the user is authenticated
  if (req.token === process.env.TOKEN) {
    // User is authenticated, proceed to the next middleware or route handler
    return next();
  }

  // User is not authenticated, redirect to the login page
  res.status(401).json({ error: 'Unauthorized access. Please log in' });
}

module.exports = Authorization;