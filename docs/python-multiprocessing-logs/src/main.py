from datetime import datetime
from multiprocessing import Process
from time import sleep

from .utils import get_process_logger


def worker(i: int) -> None:
    logger = get_process_logger(f"Process-{i}", log_dir=f"logs/process-{i}")

    for count in range(100):
        logger.info(f"[{i}] Logging message {count}")

        sleep(10)


processes: list[Process] = []

for index in range(3):
    p = Process(target=worker, args=(index,), daemon=True)
    p.start()
    processes.append(p)

while True:
    print(f"[main process]: {datetime.now().isoformat()}")
    sleep(30)
