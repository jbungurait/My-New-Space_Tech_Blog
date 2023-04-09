const router = require('express').Router();

const userRoutes = require('./user');
const blogRoutes = require('./blog-post');

router.use('/user', userRoutes);
router.use('/blogpost', blogRoutes);

module.exports = router;
