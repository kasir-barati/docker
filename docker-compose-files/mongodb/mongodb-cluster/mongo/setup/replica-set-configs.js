replicaSetConfig = {
  _id: 'mongo-cluster',
  members: [
    {
      _id: 0,
      host: 'primary:27017',
    },
    {
      _id: 1,
      host: 'secondary:27017',
    },
    {
      _id: 2,
      host: 'tertiary:27017',
    },
  ],
};

rs.initiate(replicaSetConfig);
rs.conf();
