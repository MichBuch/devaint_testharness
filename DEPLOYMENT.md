# Deployment Guide

## Vercel Deployment

### Quick Deploy

1. **Connect Repository**
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository: `MichBuch/devaint_testharness`

2. **Configure Environment Variables**
   Add these in Vercel dashboard → Settings → Environment Variables:

   ```
   DATABASE_URL=postgresql://...
   AWS_ACCESS_KEY_ID=...
   AWS_SECRET_ACCESS_KEY=...
   AWS_REGION=us-east-1
   AWS_S3_BUCKET=...
   AZURE_STORAGE_CONNECTION_STRING=...
   AZURE_CONTAINER_NAME=test-container
   STRIPE_SECRET_KEY=sk_...
   WEATHER_API_KEY=...
   ```

3. **Deploy**
   - Vercel auto-detects Next.js
   - Click "Deploy"
   - Your app will be live at `https://your-app.vercel.app`

### Manual Deploy via CLI

```bash
npm i -g vercel
vercel login
vercel
```

## Azure Deployment

### Azure App Service

1. **Create App Service**
   ```bash
   az webapp create --resource-group myResourceGroup --plan myAppServicePlan --name devaint-testharness --runtime "NODE:20-lts"
   ```

2. **Set Environment Variables**
   ```bash
   az webapp config appsettings set --resource-group myResourceGroup --name devaint-testharness --settings DATABASE_URL="..." AWS_ACCESS_KEY_ID="..." ...
   ```

3. **Deploy**
   ```bash
   npm run build
   az webapp deploy --resource-group myResourceGroup --name devaint-testharness --src-path .
   ```

## AWS Deployment

### AWS Amplify

1. **Connect Repository**
   - Go to AWS Amplify Console
   - Connect GitHub repo
   - Select branch: `main`

2. **Build Settings**
   ```
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm install
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
   ```

3. **Environment Variables**
   - Add all required env vars in Amplify console

### AWS Elastic Beanstalk

1. **Initialize**
   ```bash
   eb init -p node.js devaint-testharness
   eb create devaint-testharness-env
   ```

2. **Set Environment Variables**
   ```bash
   eb setenv DATABASE_URL="..." AWS_ACCESS_KEY_ID="..." ...
   ```

3. **Deploy**
   ```bash
   npm run build
   eb deploy
   ```

## Health Check

After deployment, verify health:
```
GET https://your-app-url/api/health
```

Should return:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "services": {
    "database": "connected"
  }
}
```

## Post-Deployment

1. **Initialize Database**
   - Visit `/api/init-db` (POST) or it auto-initializes on first use

2. **Test Services**
   - Use the UI to test each service integration
   - Check logs panel for results

3. **Monitor**
   - Check Vercel/Azure/AWS logs for errors
   - Monitor database connections
   - Review test logs in the app
