# GitHub Actions Workflows

This directory contains GitHub Actions workflows for CI/CD of the tracking platform.

## Workflows

### 1. `deploy-api-dev.yml`
Deploys the tracking API (Lambda functions) to AWS using Serverless Framework.

**Triggers:**
- Push to `dev` or `main` branches
- Pull requests to `dev` or `main` branches
- Only runs when files in `apps/tracking-api/**` or `packages/**` change

**Environment:**
- Uses `preview` environment for branch protection

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
3. **Environment**: Deploys to `dev` stage
4. **Path-based Triggers**: Only runs when relevant files change

## Build Commands

The workflow runs:
```bash
yarn build --filter=tracking-api
yarn deploy --filter=tracking-api
```

**Environment Variables:**
- `STAGE=dev`: Sets the deployment stage
- `MONGODB_URI`: Database connection string
- `SERVERLESS_ACCESS_KEY`: Serverless Framework access key

## Environment Protection

The workflow uses the `preview` environment which can be configured with branch protection rules in GitHub.
