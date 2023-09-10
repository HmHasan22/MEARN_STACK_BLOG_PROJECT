const blogSchema = require('../schemas/blogSchema');
const UserSchema = require('../schemas/userSchema');
const addComment = async (req, res) => {
  try {
    const token = res.locals.token;
    const { post_id, text } = req.body;
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
    const comments = {
      user: user._id,
      text,
    };
    blog.comments.push(comments);
    await blog.save();
    return res.status(201).json({
      message: 'Comment created!',
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const singleComment = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await blogSchema.findById(id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    const comment = blog.comments;
    return res.status(200).json(comment);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
const deleteComment = async (req, res) => {
  const token = res.locals.token;
  const { id } = req.params;
  try {
    // get user by token
    const user = await UserSchema.findOne({
      tokens: {
        $elemMatch: {
          token: token,
        },
      },
    });
    // get blog by id
    const blog = await blogSchema.findById(id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    // get comment by id
    const comment = blog.comments.find((comment) => comment.id === id);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    // check if user is the owner of the comment
    if (comment.user.toString() !== user._id.toString()) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    // delete comment
    const index = blog.comments
      .map((comment) => comment.id)
      .indexOf(req.params.id);
    blog.comments.splice(index, 1);
    await blog.save();
    return res.status(200).json({ message: 'Comment deleted' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
const updateComment = async (req, res) => {
  const token = res.locals.token;
  const { id } = req.params;
  const { text } = req.body;
  try {
    const user = await UserSchema.findOne({
      tokens: {
        $elemMatch: {
          token: token,
        },
      },
    });
    const blog = await blogSchema.findById(id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    const comment = blog.comments.find((comment) => comment.id === id);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    if (comment.user.toString() !== user._id.toString()) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    comment.text = text;
    await blog.save();
    return res.status(200).json({ message: 'Comment updated' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { addComment, updateComment, deleteComment, singleComment };
