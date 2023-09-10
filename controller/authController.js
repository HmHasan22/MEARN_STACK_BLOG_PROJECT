const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserSchema = require('../schemas/userSchema');
const roleSchema = require('../schemas/roleSchema');
const { validationResult } = require('express-validator');
const userSchema = require('../schemas/userSchema');
const { response } = require('express');
const imagePath = (image) => {
  return `${process.env.APP_URL}/uploads/${image}`;
};

const getUserRole = async (id) => {
  const role = await roleSchema.findById('64eef1f543dd4fbeaeba2322');
  if (!role) {
    return res.status(500).json({
      error: 'Role is missing',
    });
  } else {
    const user_role = await UserSchema.findById(id).populate('role').exec();
    if (user_role) {
      return {
        id: role._id,
        name: user_role?.role?.name,
      };
    } else {
      return 'role not found';
    }
  }
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new UserSchema({
      name,
      email,
      avatar: req.file.filename,
      role: '64eef1f543dd4fbeaeba2322',
      password: hashedPassword,
    });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    user.tokens.push({ token });
    await user.save();
    res.status(201).json({
      message: 'user register successful',
      token: token,
      user: {
        name: user.name,
        avatar: imagePath(user.avatar),
        role: await getUserRole(user._id),
      },
    });
  } catch (e) {
    res.status(500).json({
      message: e.message,
    });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserSchema.findOne({ email: email });
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!user && !isValidPassword) {
      res.status(404).json({
        message: 'Login failed!',
      });
    } else {
      if (user.tokens.length === 0) {
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        user.tokens.push({ token });
        await user.save();
      }
      res.status(200).json({
        message: 'Login successful!',
        token: user.tokens[0].token,
        user: {
          name: user.name,
          avatar: imagePath(user.avatar),
          role: await getUserRole(user._id),
        },
      });
    }
  } catch (e) {
    return res.status(500).json({
      error: e.message,
    });
  }
};
const logout = async (req, res) => {
  const token = res.locals.token;
  const user = await UserSchema.findOne({
    tokens: {
      $elemMatch: {
        token: token,
      },
    },
  });
  user.tokens = user.tokens.filter((token) => token !== token);
  await user.save();
  res.status(200).json({ message: 'Logout successful' });
};

const user = async (req, res) => {
  const token = res.locals.token;
  try {
    const user = await UserSchema.findOne({
      tokens: {
        $elemMatch: {
          token: token,
        },
      },
    });
    if (user) {
      res.status(200).json({
        message: 'success',
        user: {
          name: user.name,
          email: user.email,
          avatar: imagePath(user.avatar),
        },
      });
    }
  } catch (e) {
    return res.status(500).json({
      error: e.message,
    });
  }
};
module.exports = { register, login, logout, user };
