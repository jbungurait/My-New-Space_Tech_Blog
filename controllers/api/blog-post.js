const router = require("express").Router();
const { BlogPost, User, Comments } = require("../../models");
const withAuth = require('../../utils/auth');

router.get("/", withAuth, async (req, res) => {
  try {
    const AllPosts = await BlogPost.findAll({
      include: [
        {
          model: User,
          attributes: ["username"],
        },
        {
          model: Comments,
          where: BlogPost.id = Comments.blogPostId,
          attributes: ["content", "userId"]
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
        attributes: ["username"],
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

router.post("/", withAuth, async (req,res) => {
  try {
    const newPost = await BlogPost.create({
      ...req.body,
      userId: req.session.user_id,
    });
    res.status(200).json(newPost);
  } catch (err) {
    res.status(400).json(err);

  }
})

router.delete('/:id', withAuth, async (req, res) => {
  try {
    const blogData = await BlogPost.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!blogData) {
      res.status(404).json({ message: 'No blog found!' });
      return;
    }

    res.status(200).json(blogData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;