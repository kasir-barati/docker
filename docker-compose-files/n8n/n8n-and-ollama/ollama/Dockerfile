FROM ollama/ollama:latest

ENV OLLAMA_MODEL=qwen3.5:9b

RUN bash -c "ollama serve & \
             until ollama list >/dev/null 2>&1; do sleep 1; done; \
             ollama pull ${OLLAMA_MODEL}"
