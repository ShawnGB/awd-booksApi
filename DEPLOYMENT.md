# Deployment Guide - Render

This guide covers deploying the Books API to Render with continuous deployment.

## Prerequisites

- GitHub repository connected to Render
- PostgreSQL database manually created in Render

## Automatic Deployment Setup

The `render.yaml` file in the root directory enables automatic deployments:
- **Trigger:** Every push to the `main` branch
- **Runtime:** Docker (uses `Dockerfile`)
- **Health Check:** `/api` endpoint
- **Region:** Frankfurt

## Required Environment Variables

Configure these in the Render dashboard for your web service:

### Database Connection
- `DB_TYPE` = `postgres`
- `DB_HOST` = (from your Render PostgreSQL database - Internal Database URL hostname)
- `DB_PORT` = `5432`
- `DB_USERNAME` = (from your Render PostgreSQL database)
- `DB_PASSWORD` = (from your Render PostgreSQL database)
- `DB_NAME` = (from your Render PostgreSQL database)

### Application
- `NODE_ENV` = `production`
- `PORT` = `3000`

## Deployment Steps

1. **Connect Repository:**
   - Go to Render Dashboard → New → Blueprint
   - Connect your GitHub repository
   - Render will detect `render.yaml` and create the service

2. **Configure Environment Variables:**
   - Go to your web service settings
   - Navigate to "Environment" tab
   - Add all required environment variables listed above
   - Get database credentials from your PostgreSQL database info page

3. **Deploy:**
   - Render will automatically deploy on first setup
   - Future deploys trigger automatically on push to `main`

## Accessing Your API

Once deployed, your API will be available at:
```
https://awd-books-api.onrender.com/api
```

### Test Endpoints
```bash
# Health check
curl https://awd-books-api.onrender.com/api

# Create user
curl -X POST https://awd-books-api.onrender.com/api/users \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"password123"}'
```

## Database Migrations

The app uses TypeORM with `synchronize: false` in production, so schema changes require migrations.

**Note:** Currently `synchronize` is set based on `NODE_ENV === 'development'`. In production, this is disabled for safety.

## Troubleshooting

### Deployment Fails
- Check build logs in Render dashboard
- Verify all environment variables are set
- Ensure Dockerfile builds successfully locally: `docker build -t test .`

### Database Connection Issues
- Verify database credentials match your PostgreSQL instance
- Ensure `DB_HOST` is the **Internal Database URL** hostname (not external)
- Check database is in the same region as web service

### Health Check Fails
- Verify `/api` endpoint returns 200 OK
- Check application logs for startup errors
- Ensure `PORT` environment variable is set to `3000`

## Continuous Deployment

With `autoDeploy: true` in render.yaml:
- Push to `main` → Automatic deployment
- Render builds using Dockerfile
- Zero-downtime deployments
- Automatic rollback on health check failure
