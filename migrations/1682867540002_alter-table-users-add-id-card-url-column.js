exports.up = (pgm) => {
  pgm.addColumn('users', {
    id_card_url: {
      type: 'TEXT',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('users', 'id_card_url');
};
