<details>
<summary>Ho to use exported env variables inside the cotainer in <code>CMD</code></summary>

I have this `Dockerfile`:

```Dockerfile
FROM python:3.12.9-bullseye
WORKDIR /app
COPY requirements.txt .
RUN pip3 install -r requirements.txt
COPY . .
CMD [ "uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "$APP_PORT", "--log-level", "error" ]
```

And this `compose.yml` file:

```yaml
services:
  app:
    build: 
      context: .
    env_file:
      - .env
    ports:
      - 8000:$APP_PORT
```

With this `.env` file:

```cmd
APP_NAME="My API"
APP_PORT=3000
```

Why when I run my compose file I get this error message:

```cmd
app-1  | Usage: uvicorn [OPTIONS] APP
app-1  | Try 'uvicorn --help' for help.
app-1  | 
app-1  | Error: Invalid value for '--port': '$APP_PORT' is not a valid integer.
```

I wanna read `APP_PORT` env variable in `CMD` in `Dockerfile` from the shell.

---

The issue occurs because environment variables are not expanded in Docker's exec form (the JSON array syntax). In your CMD instruction, `$APP_PORT` is treated as a literal string rather than being replaced by its value. To fix that you need to use shell form in `CMD`:

```Dockerfile
CMD uvicorn src.main:app --host 0.0.0.0 --port $APP_PORT --log-level error
```

Or you can use explicit shell invocation: 

```Dockerfile
CMD ["sh", "-c", "uvicorn src.main:app --host 0.0.0.0 --port $APP_PORT --log-level error"]
```

</details>
