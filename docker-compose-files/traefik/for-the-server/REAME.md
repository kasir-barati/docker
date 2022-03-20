# How to configure Traefik for the server

# Run a dockerized traefik in you local system. You can checkout to this commit sha: fa8379558dab47770b75d490963d815a5766ab16

## Normal mistakes

The following mistakes were common for me while start using traefik but I was newbie in traefik

### Use the socket file to connect to docker (`endpoint: "unix:///var/run/docker.sock"`)

This is a very bad open door to the attackers, [read here for more](https://doc.traefik.io/traefik/providers/docker/#endpoint).

### 404 page not found

There are two different reason for this error:

1. The reason is that you forgot to put `"--providers.docker=true"` command in the `docker-compose.yml` file, or in the `traefik.yml` config file. Here is a sample working `docker-compose.yml` and `traefik.yml` file:

<details>
  <summary markdown="span">docker-compose.yml and traefik.yml</summary>

```yml
version: "3.7"

services:
  traefik:
    image: traefik:v2.6
    ports: - "80:80" - "8080:8080"
    volumes: - /var/run/docker.sock:/var/run/docker.sock - "./traefik.yml:/etc/traefik/traefik.yml:ro"
    networks: - traefik_default

  whoami:
    image: traefik/whoami:v1.8.0
    labels: - "traefik.http.routers.whoami.rule=Host(`whoami.docker.localhost`)"
    depends_on: - traefik
    networks: - traefik_default

networks:
  traefik_default:
    name: traefik_default
```

```yml
log:
  level: "DEBUG"
api:
  dashboard: true
  insecure: true
providers:
  docker:
    network: traefik_default
```

</details>

2. `exposedByDefault: false` part is added in the `traefik.yml` config file. What? Let me explain it, It specifies when containers are Exposed by default through Traefik. If set to false, containers that do not have a `traefik.enable=true` in their docker-compose `label` section are ignored from the resulting routing configuration.

<details>
  <summary markdown="span">traefik.yml</summary>

```yml
log:
  level: "DEBUG"
api:
  dashboard: true
  insecure: true
providers:
  docker:
    network: traefik_default
    exposedByDefault: false
```

</details>

<details>
  <summary markdown="span">docker-compose.yml</summary>

```yml
version: "3.7"

services:
  traefik:
    image: traefik:v2.6
    ports:
      - "80:80"
      - "8080:8080"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - "./traefik.yml:/etc/traefik/traefik.yml:ro"
    scale: 1
    networks:
      - traefik_default
    healthcheck:
      test: ["CMD", "./traefik", "healthcheck", "--ping"]
      interval: 30s
      timeout: 3s
      retries: 30

  whoami:
    image: traefik/whoami:v1.8.0
    labels:
      - traefik.http.routers.whoami.rule=Host(`whoami.docker.localhost`)
      - traefik.enable=true
    depends_on:
      - traefik
    scale: 1
    networks:
      - traefik_default

networks:
  traefik_default:
    name: traefik_default
```

</details>

**Note: Defines a default docker network - `network: traefik_default` - to use for connections to all containers. This option can be overridden on a per-container basis with the `traefik.docker.network` label.** In this way you are sure that just those containers who are in a specific network will be exposed, and we have also another extra layer to prevent unwanted exposed containers by `exposedByDefault: false` in our `traefik.yml` file.

# How to use this section

- Start a traefik docker container

  - Update `traefik.yml` file
    - Change the written email address in `traefik.yml`
    - Traeffik dashboard is accessible. To generate a strong password you can use `apache2-utils`. You have to install it on your system by running this command: `sudo apt install apache2-utils`. Now you can generate a strong password with this command: `htpasswd -n admin`, Do not use `-b` flag. It is possible to saw the issued commands by checking history file. Note that iff you are going to use env in the labels I guess you have to pass .env file to the container too. BTW I am not sure. But I think it is like that.
    - `network: traefik_default`
      This line tell Traefik to expose containers that are in the `traefik_default` network. Assume you have other internal networks too, They are not exposed due to this configuration.
    - `traefik.mydomain.com` should exists otherwise your certificate will fail.
  - `docker-compose up`

## Why Traefik over the Nginx?

- Automate HTTP to HTTPS redirection
- Auto generated SSL
