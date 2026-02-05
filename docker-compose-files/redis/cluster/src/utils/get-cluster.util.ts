import { Cluster } from 'ioredis';

export function getCluster() {
  const redisNodes =
    process.env.REDIS_NODES ?? 'localhost:7001,localhost:7002,localhost:7003';
  const nodes = redisNodes.split(',').map((node) => {
    const [host, port] = node.split(':');
    return { host, port: parseInt(port, 10) };
  });

  console.log('📡 Connecting to Redis Cluster nodes:');
  nodes.forEach((node) => console.log(`   - ${node.host}:${node.port}`));
  console.log();

  // Create Redis Cluster client
  const cluster = new Cluster(nodes, {
    redisOptions: {
      connectTimeout: 10000,
    },
    clusterRetryStrategy: (times) => {
      const delay = Math.min(100 + times * 2, 2000);
      return delay;
    },
  });

  return cluster;
}
