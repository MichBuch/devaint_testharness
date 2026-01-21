# Deviant Test Harness

Test harness application for AI dev agent interactions. This app provides a UI to test various cloud services and APIs.

## Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Neon DB** - Serverless PostgreSQL
- **AWS S3** - Object storage
- **Azure Blob Storage** - Cloud storage
- **Stripe** - Payment processing
- **MCP Servers** - Model Context Protocol integration
- **Vercel** - Deployment platform

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables (create `.env.local`):
```env
# Neon DB
DATABASE_URL=postgresql://user:password@host/database

# AWS
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name

# Azure
AZURE_STORAGE_CONNECTION_STRING=your_connection_string
AZURE_CONTAINER_NAME=test-container

# Stripe
STRIPE_SECRET_KEY=sk_test_...

# Optional
WEATHER_API_KEY=your_weather_api_key
```

3. Initialize database:
```bash
npm run dev
# The app will auto-initialize the database on first run
```

4. Run development server:
```bash
npm run dev
```

Visit `http://localhost:3000` to see the test harness UI.

## Features

- **Service Testing**: Test buttons for each integrated service
- **Real-time Logging**: View test results and logs in real-time
- **Error Handling**: Graceful error handling with detailed messages
- **Metadata Tracking**: Store and display test metadata

## Deployment

### Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Azure/AWS

Configure environment variables in your hosting platform's settings.

## Development

The app structure:
- `app/` - Next.js app directory
- `components/` - React components
- `lib/` - Utilities and service integrations
- `app/api/` - API routes
