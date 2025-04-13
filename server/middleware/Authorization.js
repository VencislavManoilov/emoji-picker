function Authorization(req, res, next) {
    const token = req.headers['authorization'];
    if (token === process.env.TOKEN) {
        return next();
    }

  res.status(401).json({ error: 'Unauthorized access. Please log in' });
}

module.exports = Authorization;