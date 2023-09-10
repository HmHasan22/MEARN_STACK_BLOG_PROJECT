const mongoose = require('mongoose');
const blogSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  title: {
    type: String,
    required: [true, 'name field is required'],
  },
  slug: {
    type: String,
    lowercase: true,
    required: [true, 'slug field is required'],
    unique: [true, 'Slug is unique'],
  },
  body: {
    type: String,
    required: [true, 'body field is required'],
  },
  image: {
    type: String,
    required: [true, 'image field is required'],
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      text: String,
    },
  ],
  createdAt: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
  updatedAt: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
});

module.exports = mongoose.model('Blog', blogSchema);
