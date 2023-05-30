const router = require('express').Router();

const userRoutes = require('./users');
const blogRoutes = require('./blog-post');

router.use('/users', userRoutes);
router.use('/blogpost', blogRoutes);

module.exports = router;
