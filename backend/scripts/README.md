# Scripts Directory

Utility scripts for the backend, organized by category.

Add new scripts here as needed and document usage in this file.

## Adding New Scripts

1. Choose or create an appropriate category subdirectory
2. Add usage documentation at the top of each script
3. Update this README with the new script information

## Troubleshooting

**Import errors**

- Run scripts from the `backend/` directory
- Ensure the virtual environment is active (`uv sync`)

**Database connection errors**

- Start the database: `docker compose -f ../docker/docker-compose.db.yml up -d`
- Verify `DATABASE_URL` in `.env`
