FROM python:3.14-slim

# Set up non-root user for security
RUN apt-get update && \
    apt-get install -y --no-install-recommends curl && \
    rm -rf /var/lib/apt/lists/* && \
    groupadd -r app && useradd -r -g app app-user

WORKDIR /app

# Install Poetry
RUN pip install --no-cache-dir poetry

# Copy Poetry configuration (paths relative to build context root)
COPY services/api/pyproject.toml services/api/poetry.lock* ./

# Configure Poetry to not create a virtual environment
RUN poetry config virtualenvs.create false 

RUN poetry install --no-interaction --no-ansi --no-root

# Copy application code
COPY services/api/app .

# Copy entrypoint script into a fixed location outside the /app volume
COPY scripts/api.entrypoint.sh /usr/local/bin/api.entrypoint.sh
RUN chmod +x /usr/local/bin/api.entrypoint.sh

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 

# Expose the port the server runs on
EXPOSE 5005

# Switch to non-root user
USER app-user

# Use entrypoint script
ENTRYPOINT ["/usr/local/bin/api.entrypoint.sh"]