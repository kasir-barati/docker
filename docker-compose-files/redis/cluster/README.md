# Clustered Redis Environment

1. ```cmd
   docker compose up --build -d
   ```
2. Here we have two options:
   - Use NodeJS: delete all the code inside the `src/index.ts` except the part that we are getting the cluster instance (i.e. `const cluster = getCluster();`) and start writing your code!.
   - If you wanna execute Redis commands in terminal simply do the following:
     ```cmd
     $ docker compose exec -it redis-node-1 redis-cli -c -p 7001
     ```

## Issue

```cmd
$ docker compose logs -f app
app-1  |
app-1  | > redis-cluster-test@1.0.0 start:dev /app
app-1  | > tsx watch src/index.ts
app-1  |
app-1  | 🚀 Starting Redis Cluster Cross-Slot Deletion Test
app-1  |
app-1  | 📡 Connecting to Redis Cluster nodes:
app-1  |    - redis-node-1:7001
app-1  |    - redis-node-2:7002
app-1  |    - redis-node-3:7003
app-1  |
app-1  | 📝 Creating keys in different hash slots...
app-1  |
app-1  |    ✓ SET user:1 → Slot: 10778
app-1  |    ✓ SET user:2 → Slot: 6777
app-1  |    ✓ SET product:100 → Slot: 9618
app-1  |    ✓ SET order:50 → Slot: 12928
app-1  |    ✓ SET session:abc123 → Slot: 11692
app-1  |
app-1  | 📝 Creating keys in the SAME slot using hash tags...
app-1  |
app-1  |    ✓ SET {user}:1 → Slot: 5474
app-1  |    ✓ SET {user}:2 → Slot: 5474
app-1  |    ✓ SET {user}:3 → Slot: 5474
app-1  |
app-1  | 🗑️  Single key deletion (SHOULD WORK)...
app-1  |
app-1  |    ✅ DEL user:1 → Result: 1 key deleted
app-1  |
app-1  | 🗑️  Multi-key deletion ACROSS different slots (SHOULD FAIL)...
app-1  |
app-1  |    ❌ Expected Error: CROSSSLOT Keys in request don't hash to the same slot
app-1  |
app-1  | 🗑️  Multi-key deletion in the SAME slot (SHOULD WORK)...
app-1  |
app-1  |    ✅ DEL {user}:1, {user}:2, {user}:3 → Result: 3 keys deleted
app-1  |
app-1  |       ✅ user:2 (Slot 6777): Deleted 1 key
app-1  |       ✅ product:100 (Slot 9618): Deleted 1 key
app-1  |       ✅ order:50 (Slot 12928): Deleted 1 key
app-1  |       ✅ session:abc123 (Slot 11692): Deleted 1 key
app-1  |
app-1  | 👋 Disconnected from Redis Cluster
```

## How `calculateSlot` Works

<details>
<summary>It computes the <strong>Redis Cluster hash slot</strong> (an integer <code>0..16383</code>) for a given key, following Redis Cluster’s rules.</summary>

1. **Pick the part of the key that should be hashed (hash tags)**
   - Redis Cluster supports _hash tags_: if a key contains a substring in braces like `{...}`, only what’s **inside the first `{}` pair** is hashed.
   - This makes different keys map to the **same slot** if they share the same hash tag (useful for multi-key operations).

   In your code:

   ```typescript name=docker-compose-files/redis/cluster/src/utils/cluster-slot.util.ts url=https://github.com/kasir-barati/docker/blob/6bce6992855eca76e2be21bd9821f0e87d5705e4/docker-compose-files/redis/cluster/src/utils/cluster-slot.util.ts#L1-L20
   /**
    * @description calculates Redis hash slot for a key
   */
   export function calculateSlot(key: string): number {
   // Find hash tags {...}
   const match = key.match(/\{([^}]+)\}/);
   const hashKey = match ? match[1] : key;
   ```

   - `key.match(/\{([^}]+)\}/)` looks for:
     - a literal `{`
     - then **one or more** characters that are not `}` (`[^}]+`) captured as group 1
     - then a literal `}`
   - If it matches, `hashKey` becomes the captured group (inside braces). Otherwise `hashKey` is the full key.

   Examples:
   - `"user:1"` → no braces → `hashKey = "user:1"`
   - `"user:{1}:name"` → matches `{1}` → `hashKey = "1"`
   - `"a{foo}b{bar}"` → it will take the **first** tag only → `hashKey = "foo"`

2. **Compute CRC16 of that string (Redis Cluster uses CRC16-CCITT)**
   The function defines a local `crc16(str)` that implements CRC16 using a precomputed lookup table:

   ```typescript name=docker-compose-files/redis/cluster/src/utils/cluster-slot.util.ts url=https://github.com/kasir-barati/docker/blob/6bce6992855eca76e2be21bd9821f0e87d5705e4/docker-compose-files/redis/cluster/src/utils/cluster-slot.util.ts#L21-L107
   // CRC16 implementation for Redis
   const crc16 = (str: string): number => {
     const table = [
       0x0000, 0x1021, 0x2042, 0x3063, 0x4084, 0x50a5, 0x60c6, 0x70e7, 0x8108,
       // ... 256-entry lookup table ...
       0x2e93, 0x3eb2, 0x0ed1, 0x1ef0,
     ];

     let crc = 0;
     for (let i = 0; i < str.length; i++) {
       crc =
         ((crc << 8) ^ table[((crc >> 8) ^ str.charCodeAt(i)) & 0xff]) & 0xffff;
     }
     return crc;
   };
   ```

   What happens in the loop, conceptually:
   - Start with `crc = 0`.
   - For each character in `str`:
   - `str.charCodeAt(i)` gets the character’s numeric code (0–65535).
   - `((crc >> 8) ^ charCode) & 0xff` uses the **top byte** of the current CRC XOR’d with the current character code, then keeps only the low 8 bits. That value (0–255) indexes into the 256-entry table.
   - `(crc << 8)` shifts CRC left by 8 bits (preparing to incorporate the next byte).
   - XOR with the table value updates the CRC efficiently.
   - `& 0xffff` keeps it as a 16-bit value (0–65535).

   So `crc16(hashKey)` returns a deterministic 16-bit checksum of the string.

3. **Map the CRC16 value into one of 16384 slots**
   Redis Cluster has exactly **16384 hash slots**, so the code does:

   ```typescript name=docker-compose-files/redis/cluster/src/utils/cluster-slot.util.ts url=https://github.com/kasir-barati/docker/blob/6bce6992855eca76e2be21bd9821f0e87d5705e4/docker-compose-files/redis/cluster/src/utils/cluster-slot.util.ts#L108-L110
   return crc16(hashKey) % 16384;
   }
   ```

   That modulus converts the 16-bit CRC into a slot number in the valid range.

   ***

### Why Hash Tags Matter?

- `calculateSlot("user:{42}:name")` and `calculateSlot("user:{42}:email")` will be the **same slot**, because both hash `"42"`.
- Without tags, `"user:42:name"` and `"user:42:email"` would typically end up in different slots.

If you want, paste a few example keys you use and I can walk through which part gets hashed and why they’ll co-locate (or not) in the cluster.

</details>
