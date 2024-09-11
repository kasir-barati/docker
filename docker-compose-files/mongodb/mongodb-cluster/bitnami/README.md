# How to run the cluster:

1. `./up.sh`

# Notes:

- Restore is for when you wanna restore a backup into the cluster
- Please first `cp` the .env files
- Connection string: `mongodb://root:root-password@localhost:27017/learning?authSource=admin&authMechanism=DEFAULT&tls=false&directConnection=true`
  - The `directConnection=true` part works fine as long as you wanna connect to a single replica.
  - `mongodb://root:root-password@localhost:27017,root:root-password@localhost:27018,root:root-password@localhost:27019/admin?replicaSet=rs0` works in NodeJS
