import { calculateSlot , sleep , getCluster } from './utils/index.js';

async function main() {
  console.log('🚀 Starting Redis Cluster Cross-Slot Deletion Test\n');

  const cluster = getCluster();

  cluster.on('error', (err) => console.error('❌ Cluster Error:', err.message));
  cluster.on('ready', () => console.log('✅ Cluster connection ready!\n'));

  await sleep(2);

  try {
    // Step 1: Create keys in different slots
    console.log('📝 Step 1: Creating keys in different hash slots...\n');

    const keys = [
      'user:1',
      'user:2',
      'product:100',
      'order:50',
      'session:abc123',
    ];

    for (const key of keys) {
      await cluster.set(key, `value-${key}`);
      const slot = calculateSlot(key);
      console.log(`   ✓ SET ${key} → Slot: ${slot}`);
    }

    console.log();

    // Step 2: Create keys in the SAME slot using hash tags
    console.log(
      '📝 Step 2: Creating keys in the SAME slot using hash tags...\n',
    );

    const sameSlotKeys = ['{user}:1', '{user}:2', '{user}:3'];

    for (const key of sameSlotKeys) {
      await cluster.set(key, `value-${key}`);
      const slot = calculateSlot(key);
      console.log(`   ✓ SET ${key} → Slot: ${slot}`);
    }

    console.log();

    // Step 3: Try single key deletion (should work)
    console.log('🗑️  Step 3: Single key deletion (SHOULD WORK)...\n');
    const singleDelResult = await cluster.del('user:1');
    console.log(`   ✅ DEL user:1 → Result: ${singleDelResult} key deleted\n`);

    // Step 4: Try multi-key deletion across different slots (should fail)
    console.log(
      '🗑️  Step 4: Multi-key deletion ACROSS different slots (SHOULD FAIL)...\n',
    );
    try {
      await cluster.del('user:2', 'product:100', 'order:50');
      console.log('   ✅ Unexpectedly succeeded!\n');
    } catch (error) {
      console.log(`   ❌ Expected Error: ${(error as Error).message}\n`);
    }

    // Step 5: Try multi-key deletion in the SAME slot (should work)
    console.log(
      '🗑️  Step 5: Multi-key deletion in the SAME slot (SHOULD WORK)...\n',
    );
    const sameslotDelResult = await cluster.del(
      '{user}:1',
      '{user}:2',
      '{user}:3',
    );
    console.log(
      `   ✅ DEL {user}:1, {user}:2, {user}:3 → Result: ${sameslotDelResult} keys deleted\n`,
    );

    // Step 6: Delete cross-slot keys individually (workaround)
    console.log(
      '🗑️  Step 6: Individual deletion ACROSS different slots (WORKAROUND)...\n',
    );
    const keysToDelete = [
      'user:2',
      'product:100',
      'order:50',
      'session:abc123',
    ];

    for (const key of keysToDelete) {
      const result = await cluster.del(key);
      const slot = calculateSlot(key);
      console.log(`      ✅ ${key} (Slot ${slot}): Deleted ${result} key`);
    }

    console.log();

    // Summary
    console.log('📊 Summary:\n');
    console.log('   ✅ Single key deletion: Works');
    console.log('   ❌ Multi-key DEL across slots: Fails with CROSSSLOT error');
    console.log('   ✅ Multi-key DEL in same slot (hash tags): Works');
    console.log('   ✅ Individual sequential DELs: Works (but slower)');
    console.log();
    console.log(
      '💡 Conclusion: ioredis CANNOT delete keys across different slots',
    );
    console.log('   in a single command or pipeline. Solutions:');
    console.log('   1. Use hash tags to keep related keys in the same slot');
    console.log('   2. Delete keys individually (less efficient but works)\n');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await cluster.quit();
    console.log('👋 Disconnected from Redis Cluster');
  }
}

main();
