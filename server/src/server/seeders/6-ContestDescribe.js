module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('ContestDescribes', [
      {
        describe: 'Photo - based',
      },
      {
        describe: 'Brick & Mortar',
      },
      {
        describe: 'Publisher',
      },
      {
        describe: 'Medical',
      },
      {
        describe: 'Minimal',
      },
      {
        describe: 'Product',
      },
      {
        describe: 'Modern',
      },
      {
        describe: 'Consulting Firm',
      },
      {
        describe: 'Any',
      },
      {
        describe: 'Descriptive',
      },
      {
        describe: 'Fun',
      },
      {
        describe: 'Classic',
      },
      {
        describe: 'Creative Agency',
      },
      {
        describe: 'Builders',
      },
      {
        describe: 'Fancy',
      },
      {
        describe: 'Powerful',
      },
      {
        describe: 'Youthful',
      },
      {
        describe: 'Footwear',
      },
      {
        describe: 'Techy',
      },
      {
        describe: 'Skin care',
      },
      {
        describe: 'Company',
      },
      {
        describe: 'Biotech',
      },
      {
        describe: 'Education',
      },
      {
        describe: 'Project',
      },
      {
        describe: 'Professional',
      },
    ], {});
  },
};
