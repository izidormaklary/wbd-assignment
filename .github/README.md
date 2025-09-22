# GitHub Actions Workflows

This directory contains GitHub Actions workflows for CI/CD of the tracking platform.

## Workflows

### 1. `deploy-api-dev.yml`
Deploys the tracking API (Lambda functions) to AWS DEV stage using Serverless Framework.

**Triggers:**
- Push to `dev` branch
- Only runs when files in `apps/tracking-api/**` or `packages/**` change

**Environment:**
- Uses `preview` environment for branch protection
- Deploys to `dev` stage

### 2. `deploy-api-prod.yml`
Deploys the tracking API (Lambda functions) to AWS PROD stage using Serverless Framework.

**Triggers:**
- Push to `main` branch
- Pull requests to `main` branch
- Only runs when files in `apps/tracking-api/**` or `packages/**` change

**Environment:**
- Uses `preview` environment for branch protection
- Deploys to `prod` stage

**Required Secrets:**
- `SERVERLESS_ACCESS_KEY`: Serverless Framework GitHub access key
- `MONGODB_URI`: MongoDB connection string

## Required Secrets

Add these secrets to your GitHub repository settings:

### Serverless Framework
- `SERVERLESS_ACCESS_KEY`: Serverless Framework GitHub access key for deployment

### Database
- `MONGODB_URI`: MongoDB connection string for the API

## How to Add Secrets

1. Go to your GitHub repository
2. Click on "Settings" tab
3. Click on "Secrets and variables" → "Actions"
4. Click "New repository secret"
5. Add each secret with the exact name listed above

## Deployment Process

1. **Build Process**: Uses Turbo to build the tracking-api package
2. **Deployment**: Uses Serverless Framework to deploy to AWS Lambda
3. **Multi-stage**: Separate deployments for dev and prod stages
4. **Path-based Triggers**: Only runs when relevant files change

## Build Commands

Both workflows run:
```bash
yarn build --filter=tracking-api
yarn deploy --filter=tracking-api
```

**Environment Variables:**
- `STAGE`: Set to `dev` for dev workflow, `prod` for prod workflow
- `MONGODB_URI`: Database connection string
- `SERVERLESS_ACCESS_KEY`: Serverless Framework access key

## Deployment Stages

- **DEV**: Triggered by pushes to `dev` branch
- **PROD**: Triggered by pushes to `main` branch and pull requests

## Environment Protection

The workflow uses the `preview` environment which can be configured with branch protection rules in GitHub.
