const Role = require('../schemas/roleSchema');
const rolesToSeed = [
  {
    name: 'admin',
  },
  {
    name: 'user',
  },
];

const roleSeeder = async (req, res, next) => {
  Role.deleteMany({}).then(() => {
    rolesToSeed.forEach(async (name) => {
      await Role.create(name).then(() => {
        res.status(200).json({
          status: 'success',
          message: 'seeding complete',
        });
      });
    });
  });
};

module.exports = roleSeeder;
