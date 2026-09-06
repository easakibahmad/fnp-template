# Stage 1: builder — install deps with uv
FROM python:3.13-slim AS builder

COPY --from=ghcr.io/astral-sh/uv:0.6.14 /uv /uvx /bin/

WORKDIR /app

COPY pyproject.toml uv.lock requirements.txt ./
RUN uv sync --frozen --no-dev --no-editable

# Stage 2: runtime — minimal image, non-root
FROM python:3.13-slim AS runtime

RUN groupadd -r app && useradd -r -g app -d /app app

WORKDIR /app

COPY --from=builder /app/.venv /app/.venv
COPY app ./app
COPY alembic.ini prestart.sh ./

ENV PATH="/app/.venv/bin:$PATH"

RUN chown -R app:app /app && chmod +x /app/prestart.sh

USER app

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8000/health')"

ENTRYPOINT ["./prestart.sh"]
CMD ["fastapi", "run", "--host", "0.0.0.0", "--port", "8000"]
