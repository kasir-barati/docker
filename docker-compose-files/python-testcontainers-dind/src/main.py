import asyncio


async def main():
    while True:
        await asyncio.sleep(5)
        print("Hello, Docker!")

if __name__ == "__main__":
    asyncio.run(main())