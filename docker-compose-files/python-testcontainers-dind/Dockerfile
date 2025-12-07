FROM python:3.13.10 AS base
WORKDIR /app
# Install Docker
RUN apt-get update && \
    apt-get install -y ca-certificates curl gnupg && \
    install -m 0755 -d /etc/apt/keyrings && \
    curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg && \
    chmod a+r /etc/apt/keyrings/docker.gpg && \
    echo "deb [arch=\"$(dpkg --print-architecture)\" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
    \"$(. /etc/os-release && echo \"$VERSION_CODENAME\")\" stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null && \
    apt-get update && \
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
COPY Makefile .

FROM base AS dev
COPY requirements*.txt .
RUN --mount=type=ssh,required=true pip install --no-cache-dir -r requirements.dev.txt -r requirements.txt --upgrade pip
CMD ["make", "start"]

FROM base AS prod
COPY entrypoint.sh .
COPY requirements.txt .
RUN --mount=type=ssh,required=true pip install --no-cache-dir -r requirements.txt --upgrade pip
COPY . .
CMD ["make", "start"]
