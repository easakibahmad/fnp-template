#! /usr/bin/env bash
set -euo pipefail

echo "Running prestart script..."

# Run migrations
alembic upgrade head

echo "Finished prestart script..."

exec "$@"
