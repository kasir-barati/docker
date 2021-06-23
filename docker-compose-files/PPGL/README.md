# Monitoring, Logging and Alerting with Docker

## Used Tech

- **Monitoring Stack:** Prometheus, Exporters and Grafana
- **Loggin Stack:** Loki, Promtail and Grafana
- **Alerting:** Alertmanager
- **Web Interface:** Traefik
- **Docker Visualisation:** Weaveworks

## Requirement before running compose file

1. Hardening OS

2. Install docker

3. Install docker-compose

4. Change and complate config files

## Installation

**Step1**: chnage service config files:

```bash
 $ tree monlog
.
|-- README.md
|-- alertmanager
|   `-- config.yml                # alertmanager config file     - alerting service
|-- docker-compose.yml
|-- loki
|   `-- local-config.yaml         # loki config file             - logging service
|-- prometheus
|   |-- alerts
|   |   |-- Alertmanager.rules    # alerting rules
|   |   `-- Prometheus.rules      # alerting rules
|   `-- prometheus.yml            # prometheus config file       - minitoring service
`-- promtail
    `-- docker-config.yaml        # promtail config file         - log forwarder

5 directories, 8 files
```

**Step2**: chnage **DOMAIN** on docker-comose file with your domain.

**Step3:** change alertmanager email notification config

**Step4:** check compose file and Run all services

```bash
docker-compose config
docker-compose up -d
```

**Step5:** Check compose services and view all services logs

```bash
docker-compose ps
docker-compose logs -f
```

**Step6:** check and visit your domain service:

1. prometheus.DOMAIN: prometheus dashboard

2. web.DOMAIN: traefik2 dashboard

3. alert.DOMAIN: alertmanager dashboard

4. grafana.DOMAIN: grafana dashboard

5. loki.DOMAIN: loki web interface

**Step7:** config grafana service for view all metric on visualize dashboard

## License

[DockerMe.ir](https://dockerme.ir)
