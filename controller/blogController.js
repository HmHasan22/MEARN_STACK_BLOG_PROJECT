const upload = require('../middleware/multerConfiguration');
const Blog = require('../schemas/blogSchema');
const fs = require('fs');
const slugify = require('slugify');
const UserSchema = require('../schemas/userSchema');
const imagePath = (image) => {
  return `${process.env.APP_URL}/uploads/${image}`;
};
const getAllBlog = async (req, res) => {
  try {
    await Blog.find()
      .populate('comments.user')
      .then((result) => {
        const blog = [];
        result.map((item) => {
          blog.push({
            id: item._id,
            slug: item.slug,
            title: item.title,
            description: item.body,
            image: imagePath(item.image),
            likes: item.likes.length,
            comments: item.comments.length,
          });
        });
        res.status(200).json(blog);
      });
  } catch (e) {
    console.log(e);
  }
};

const createBlog = async (req, res) => {
  const token = res.locals.token;
  try {
    const user = await UserSchema.findOne({
      tokens: {
        $elemMatch: {
          token: token,
        },
      },
    });
    const blog = new Blog({
      author: user._id,
      title: req.body.title,
      slug: slugify(req.body.title, { lower: true }),
      body: req.body.body,
      image: req.file.filename,
    });
    await blog
      .save()
      .then(() => {
        res.json({ message: 'Blog created successfully' });
      })
      .catch((err) => {
        res.json({ message: err.message });
      });
  } catch (e) {
    res.json({ message: e.message });
  }
};

const getBlogBySlug = async (req, res) => {
  const slug = req.params.slug;
  await Blog.findOne({ slug: slug })
    .populate(['author', 'comments.user', 'likes'])
    .exec()
    .then((result) => {
      res.status(200).json({
        blog: {
          title: result.title,
          body: result.body,
          image: imagePath(result.image),
        },
        author: {
          name: result.author.name,
          avatar: imagePath(result.author.avatar),
        },
        likes: {
          count: result.likes.length,
          data: result.likes.map((like) => {
            return {
              id: like._id,
              name: like.name,
              avatar: imagePath(like.avatar),
            };
          }),
        },
        comments: {
          count: result.comments.length,
          data: result.comments.map((comment) => {
            return {
              id: comment._id,
              text: comment.text,
              user: {
                id: comment.user._id,
                name: comment.user.name,
                avatar: imagePath(comment.user.avatar),
              },
            };
          }),
        },
      });
    })
    .catch((err) => {
      return res.status(500).json({
        message: err.message,
      });
    });
};

module.exports = { getAllBlog, createBlog, getBlogBySlug };
