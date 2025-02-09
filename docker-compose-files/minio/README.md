## Bug

```bash
$ nx build bidirectional-grpc-file-upload --verbose

 NX   Running target build for project bidirectional-grpc-file-upload and 1 task it depends on:

———————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————

> nx run shared:build  [local cache]


> nx run bidirectional-grpc-file-upload:build:production

✘ [ERROR] No loader is configured for ".proto" files: apps/bidirectional-grpc-file-upload/src/assets/file.proto


 NX   Build failed with 1 error:

error: No loader is configured for ".proto" files: apps/bidirectional-grpc-file-upload/src/assets/file.proto
Error: Build failed with 1 error:
error: No loader is configured for ".proto" files: apps/bidirectional-grpc-file-upload/src/assets/file.proto
    at failureErrorWithLog (/home/kasir/projects/docker/docker-compose-files/minio/node_modules/.pnpm/esbuild@0.19.12/node_modules/esbuild/lib/main.js:1651:15)
    at /home/kasir/projects/docker/docker-compose-files/minio/node_modules/.pnpm/esbuild@0.19.12/node_modules/esbuild/lib/main.js:1059:25
    at /home/kasir/projects/docker/docker-compose-files/minio/node_modules/.pnpm/esbuild@0.19.12/node_modules/esbuild/lib/main.js:1004:52
    at buildResponseToResult (/home/kasir/projects/docker/docker-compose-files/minio/node_modules/.pnpm/esbuild@0.19.12/node_modules/esbuild/lib/main.js:1057:7)
    at /home/kasir/projects/docker/docker-compose-files/minio/node_modules/.pnpm/esbuild@0.19.12/node_modules/esbuild/lib/main.js:1086:16
    at responseCallbacks.<computed> (/home/kasir/projects/docker/docker-compose-files/minio/node_modules/.pnpm/esbuild@0.19.12/node_modules/esbuild/lib/main.js:704:9)
    at handleIncomingPacket (/home/kasir/projects/docker/docker-compose-files/minio/node_modules/.pnpm/esbuild@0.19.12/node_modules/esbuild/lib/main.js:764:9)
    at Socket.readFromStdout (/home/kasir/projects/docker/docker-compose-files/minio/node_modules/.pnpm/esbuild@0.19.12/node_modules/esbuild/lib/main.js:680:7)
    at Socket.emit (node:events:524:28)
    at addChunk (node:internal/streams/readable:561:12)


———————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————

 NX   Running target build for project bidirectional-grpc-file-upload and 1 task it depends on failed

Failed tasks:

- bidirectional-grpc-file-upload:build:production

Hint: run the command with --verbose for more details.
```

# Minio

```bash
pnpx create-nx-workspace --name minio --preset node-monorepo --appName bidirectional-grpc-file-upload --bundler esbuild --formatter prettier --docker false --unitTestRunner jest --skipGit true --packageManager pnpm --ci skip
nx add @nx/js
nx g @nx/js:lib libs/shared --bundler esbuild --linter eslint --unitTestRunner jest
```
