# Deployment Guide

## Vercel Deployment (Frontend)

### Option 1: Using Vercel Dashboard (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/new)
2. Import your GitHub repository
3. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

4. Add Environment Variables:
   - `NEXT_PUBLIC_API_URL`: Your backend API URL

5. Click "Deploy"

### Option 2: Using Vercel CLI

```bash
cd frontend
npm install -g vercel
vercel --prod
```

## Backend Deployment

### Option 1: Railway

1. Go to [Railway](https://railway.app)
2. Create new project from GitHub repo
3. Select the `backend` folder
4. Add environment variables from `.env.example`
5. Deploy

### Option 2: Render

1. Go to [Render](https://render.com)
2. Create new Web Service
3. Connect your GitHub repo
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. Add environment variables
6. Deploy

### Option 3: Heroku

```bash
cd backend
heroku create your-app-name
heroku config:set OMDB_API_KEY=your_key
heroku config:set OPENAI_API_KEY=your_key
git subtree push --prefix backend heroku main
```

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
```

### Backend (.env)
```
PORT=3002
NODE_ENV=production
OMDB_API_KEY=your_omdb_key
OPENAI_API_KEY=your_openai_key
ALLOWED_ORIGINS=https://your-frontend-url.vercel.app
CACHE_ENABLED=true
CACHE_TTL=3600
CACHE_TYPE=memory
```

## Important Notes

- Make sure to update `ALLOWED_ORIGINS` in backend with your Vercel frontend URL
- Update `NEXT_PUBLIC_API_URL` in frontend with your deployed backend URL
- Never commit `.env` files to Git
