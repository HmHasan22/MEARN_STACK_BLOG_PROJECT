const express = require('express');
const router = express.Router();
const upload = require('../middleware/multerConfiguration');
const Blog = require('../schemas/blogSchema');
const fs = require('fs');
const slugify = require('slugify');
const verifyToken = require('../middleware/verifyToken');
const {
  getAllBlog,
  createBlog,
  getBlogBySlug,
} = require('../controller/blogController');
router.get('/', getAllBlog);
router.post('/', verifyToken, upload.single('image'), createBlog);
router.get('/:slug', getBlogBySlug);
router.put('/:slug', upload.single('image'), async (req, res) => {
  try {
    const slug = req.params.slug;
    const updateData = req.body;
    const existingPost = await Blog.findOne(slug);
    if (existingPost) {
      if (existingPost.image) {
        fs.unlinkSync(existingPost.image);
      }
      if (req.file) {
        updateData.image = req.file.filename;
      }
      await Blog.findByIdAndUpdate({ slug: slug }, updateData, { new: true })
        .then(() => {
          res.status(200).json({
            message: 'Post Update Successfully',
          });
        })
        .catch(() => {
          res.status(500).json('Something went wrong!');
        });
    }
  } catch (e) {
    res.status(500).json({
      message: 'Something went wrong!',
    });
  }
});

router.delete('/:slug', async (req, res) => {
  const slug = req.params.slug;
  try {
    const getBlog = await Blog.findOne({ slug: slug });
    if (getBlog.image) {
      fs.unlinkSync(`./uploads/${getBlog.image}`);
    }
    await Blog.findOneAndDelete({ slug: slug })
      .then((result) => {
        res.status(200).json({
          message: 'Blog deleted successfully',
        });
      })
      .catch((err) => {
        res.status(500).json({
          message: 'Something went wrong!',
        });
      });
  } catch (e) {
    res.status(500).json({
      message: 'Something went wrong!',
    });
  }
});

module.exports = router;
