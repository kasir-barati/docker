# Mapping Multiprocessing Logs to `stdout`/`stderr`

In [this example](./) you can see how I am mapping everything we have **in `logs` dir** to `stdout`/`stderr`.

> [!CAUTION]
>
> This code only maps the logs in `/app/logs` directory to `stdout`/`stderr`.

1. I created `tail-logs.sh` which is just mapping logs to `stdout`/`stderr`.
2. And then whenever I spawn a new process I am storing its logs in logs dir and in my `Makefile` I start my Python app in background so I can then say: `./tail-logs.sh` which will run the `tail` command.
