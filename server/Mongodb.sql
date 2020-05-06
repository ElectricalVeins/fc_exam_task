db.messages.aggregate( [
  {
    $match: {
      body: /паровоз/
    }
  },
  {
    $group: {
      _id: 'Количество паровозов:',
      count: { $sum: 1 }
    }
  }
] )
