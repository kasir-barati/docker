# Clustered Redis Environment

```cmd
docker compose up --build -d
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
