# Use the official PostgreSQL image from Docker Hub
FROM postgres:latest

# Optionally, set environment variables
ENV POSTGRES_USER=myuser
ENV POSTGRES_PASSWORD=mypassword
ENV POSTGRES_DB=analysis_data

# Optionally, run any custom SQL scripts on initialization
COPY init.sql /docker-entrypoint-initdb.d/
