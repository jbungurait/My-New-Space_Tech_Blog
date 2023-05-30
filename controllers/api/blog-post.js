const router = require("express").Router();
const { BlogPost, User, Comments } = require("../../models");
const withAuth = require('../../utils/auth');

router.get("/", withAuth, async (req, res) => {
  try {
    const AllPosts = await BlogPost.findAll({
      include: [
        {
          model: User,
          attributes: ["userName"],
        },
        {
          model: Comments,
          where: BlogPost.id = Comments.blogPostId,
          attributes: ["contents", "userId"]
        }
      ],
    });

    const Posts = AllPosts.map((posts) => posts.get({ plain: true }));
    res.render("main", {
      Posts,
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/:id', withAuth, async (req, res) =>
{
  try {
    const blogPost = await BlogPost.findByPk(req.params.id, {
      include: [{
        module: User,
        attributes: ["userName"],
      },
    {
      module: Comments,
      where: BlogPost.id = Comments.blogPostId,
      attributes: ["contents", "userId"],
    }],
    });
    const post = blogPost.map((post) => post.get({ plain: true}));
    res.render("login", {
      post,
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
})

module.exports = router;