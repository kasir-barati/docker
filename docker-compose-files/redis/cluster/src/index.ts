import { Cluster } from 'ioredis';

import { calculateSlot, sleep, getCluster } from './utils/index.js';

async function main() {
  console.log('🚀 Starting Redis Cluster Cross-Slot Deletion Test\n');

  const cluster = getCluster();
  const keysInDifferentSlots = [
    'user:1',
    'user:2',
    'product:100',
    'order:50',
    'session:abc123',
  ];
  const sameSlotKeys = ['{user}:1', '{user}:2', '{user}:3'];
  const singleKeyDeletion = keysInDifferentSlots[0];
  const multiKeyDeletionCrossSlots = keysInDifferentSlots.slice(1);

  cluster.on('error', (err) => console.error('❌ Cluster Error:', err.message));

  await sleep(2);

  try {
    console.log('📝 Creating keys in different hash slots...\n');
    await createKeys(cluster, keysInDifferentSlots);
    console.log();

    console.log('📝 Creating keys in the SAME slot using hash tags...\n');
    await createKeys(cluster, sameSlotKeys);
    console.log();

    console.log('🗑️  Single key deletion (SHOULD WORK)...\n');
    const singleDelResult = await cluster.del(singleKeyDeletion);
    console.log(
      `   ✅ DEL ${singleKeyDeletion} → Result: ${singleDelResult} key deleted\n`,
    );

    console.log(
      '🗑️  Multi-key deletion ACROSS different slots (SHOULD FAIL)...\n',
    );

    await cluster.del(multiKeyDeletionCrossSlots).catch((error) => {
      console.log(`   ❌ Expected Error: ${(error as Error).message}\n`);
    });

    console.log('🗑️  Multi-key deletion in the SAME slot (SHOULD WORK)...\n');
    const sameSlotDelResult = await cluster.del(sameSlotKeys);
    console.log(
      `   ✅ DEL ${sameSlotKeys.join(', ')} → Result: ${sameSlotDelResult} keys deleted\n`,
    );

    await deleteKeysIndividually(cluster, multiKeyDeletionCrossSlots);

    console.log();
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await cluster.quit();
    console.log('👋 Disconnected from Redis Cluster');
  }
}

main();

async function createKeys(cluster: Cluster, keys: string[]) {
  for (const key of keys) {
    await cluster.set(key, `value-${key}`);
    const slot = calculateSlot(key);
    console.log(`   ✓ SET ${key} → Slot: ${slot}`);
  }
}

/**
 * @description individual deletion ACROSS different slots (WORKAROUND)
 */
async function deleteKeysIndividually(cluster: Cluster, keys: string[]) {
  for (const key of keys) {
    const result = await cluster.del(key);
    const slot = calculateSlot(key);
    console.log(`      ✅ ${key} (Slot ${slot}): Deleted ${result} key`);
  }
}
