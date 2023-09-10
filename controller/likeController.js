const blogSchema = require('../schemas/blogSchema');
const UserSchema = require('../schemas/userSchema');
const like = async (req, res) => {
  try {
    const token = res.locals.token;
    const { post_id } = req.body;
    const user = await UserSchema.findOne({
      tokens: {
        $elemMatch: {
          token: token,
        },
      },
    });
    const blog = await blogSchema.findById(post_id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    if (blog.likes.includes(user._id)) {
      blog.likes.filter((likeId) => likeId !== user._id);
      await blog.save();
      return res.status(200).json({ message: 'Unlike Success!' });
    } else {
      blog.likes.push(user._id);
      await blog.save();
      return res.status(200).json({ message: 'Like Success!' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { like };
