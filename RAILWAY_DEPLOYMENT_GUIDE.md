# 🚂 Railway.app Deployment Guide

## Why Railway?
- ✅ **Easy deployment** from GitHub
- ✅ **$5 free credit** per month (enough for small projects)
- ✅ **Automatic deployments** on git push
- ✅ **Built-in MySQL** database
- ✅ **Free SSL** certificate
- ✅ **Environment variables** management
- ✅ **Logs and monitoring**

---

## 📋 Prerequisites

- [ ] GitHub account
- [ ] Railway account (sign up at https://railway.app)
- [ ] Your project pushed to GitHub
- [ ] Credit card (for verification only, no charges on free tier)

---

## STEP 1: Push Your Project to GitHub

### If not already on GitHub:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Prepare for Railway deployment"

# Create repository on GitHub: https://github.com/new
# Then push:
git remote add origin https://github.com/ArthasGalang/CapProject.git
git branch -M main
git push -u origin main
```

### If already on GitHub:
```bash
# Make sure latest changes are pushed
git add .
git commit -m "Add Railway configuration"
git push origin main
```

---

## STEP 2: Create Railway Account

1. Go to **https://railway.app**
2. Click **"Login"** or **"Start a New Project"**
3. Sign up with GitHub (recommended)
4. Authorize Railway to access your repositories

---

## STEP 3: Create New Project on Railway

### 3.1 Create Project

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose **"ArthasGalang/CapProject"**
4. Railway will detect it's a PHP/Laravel project

### 3.2 Add MySQL Database

1. In your project dashboard, click **"+ New"**
2. Select **"Database"**
3. Choose **"Add MySQL"**
4. Railway will provision a MySQL database automatically

---

## STEP 4: Configure Environment Variables

### 4.1 Click on Your Service (not the database)

In the Railway dashboard, click on your **main service** (CapProject).

### 4.2 Go to Variables Tab

Click **"Variables"** in the top menu.

### 4.3 Add Environment Variables

Click **"+ New Variable"** and add these one by one:

```env
# Application
APP_NAME=NegoGen
APP_ENV=production
APP_KEY=base64:zypIere4dWPMdmP8LuicLkLQK9DtDSPMcN3sdF7tNHw=
APP_DEBUG=false
APP_URL=${{RAILWAY_PUBLIC_DOMAIN}}

# Database - Railway will provide these automatically!
# Click "Add Reference" → Select MySQL → Choose these variables:
DB_CONNECTION=mysql
DB_HOST=${{MySQL.MYSQL_HOST}}
DB_PORT=${{MySQL.MYSQL_PORT}}
DB_DATABASE=${{MySQL.MYSQL_DATABASE}}
DB_USERNAME=${{MySQL.MYSQL_USER}}
DB_PASSWORD=${{MySQL.MYSQL_PASSWORD}}

# Session & Cache
SESSION_DRIVER=file
SESSION_LIFETIME=120
FILESYSTEM_DISK=local
CACHE_STORE=file
QUEUE_CONNECTION=sync

# Broadcasting (Pusher)
BROADCAST_DRIVER=pusher
PUSHER_APP_ID=2066533
PUSHER_APP_KEY=059dc1ecc7821ef442d3
PUSHER_APP_SECRET=874976c1465e30c8b3f3
PUSHER_APP_CLUSTER=ap1

# Mail (Gmail)
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=sahtrathrow@gmail.com
MAIL_PASSWORD=yneyqhyrbkbesmyd
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=sahtrathrow@gmail.com
MAIL_FROM_NAME="${APP_NAME}"

# Vite
VITE_APP_NAME="${APP_NAME}"
VITE_PUSHER_APP_KEY="${PUSHER_APP_KEY}"
VITE_PUSHER_APP_CLUSTER="${PUSHER_APP_CLUSTER}"
```

### 4.4 Using Railway's Variable References (EASIER METHOD)

**For Database Variables:**
1. Instead of typing manually, click **"+ New Variable"**
2. In the dropdown, you'll see **"Add Reference"**
3. Select your **MySQL** service
4. Choose the variable you want (e.g., `MYSQL_HOST`)
5. Railway automatically links them!

**Example:**
```
DB_HOST = Reference: MySQL.MYSQL_HOST
DB_PORT = Reference: MySQL.MYSQL_PORT
DB_DATABASE = Reference: MySQL.MYSQL_DATABASE
DB_USERNAME = Reference: MySQL.MYSQL_USER
DB_PASSWORD = Reference: MySQL.MYSQL_PASSWORD
```

---

## STEP 5: Configure Settings

### 5.1 Set Root Directory (if needed)

1. Go to **"Settings"** tab
2. Under **"Build & Deploy"**
3. Check if **Root Directory** is correct (should be `/`)

### 5.2 Add Custom Start Command (if needed)

In **Settings** → **"Deploy"** section:
- **Custom Start Command:** `php artisan serve --host=0.0.0.0 --port=$PORT`

(This should already be in your `Procfile`)

### 5.3 Enable Public Domain

1. Go to **"Settings"** tab
2. Under **"Networking"**
3. Click **"Generate Domain"**
4. Railway will give you a URL like: `capproject-production-xxxx.up.railway.app`
5. Copy this URL!

---

## STEP 6: Update APP_URL

1. Go back to **"Variables"** tab
2. Find **APP_URL**
3. Update it to your Railway domain:
   ```
   APP_URL=https://capproject-production-xxxx.up.railway.app
   ```
   Or use the Railway variable:
   ```
   APP_URL=https://${{RAILWAY_PUBLIC_DOMAIN}}
   ```

---

## STEP 7: Deploy!

### Railway will automatically deploy when:
- You push to GitHub
- You change environment variables
- You trigger a manual deployment

### To trigger deployment now:

1. Go to **"Deployments"** tab
2. Click **"Deploy"** button
3. Watch the build logs in real-time!

### Build Process:
```
🔨 Installing dependencies...
📦 Running composer install...
📦 Running npm install...
🔨 Building assets with Vite...
🗄️  Running migrations...
⚡ Caching configuration...
✅ Deployment successful!
```

---

## STEP 8: Run Migrations

### Option 1: Automatic (Recommended)

Railway should run migrations automatically from `railway-deploy.sh`.

### Option 2: Manual

If migrations don't run automatically:

1. Click on your **Service**
2. Go to **"Settings"** tab
3. Under **"Deploy"**, add:
   - **Build Command:** `npm run build && composer install --no-dev`
   - **Start Command:** `php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=$PORT`

### Option 3: Using Railway CLI

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Run migrations
railway run php artisan migrate --force
```

---

## STEP 9: Test Your Application

1. Visit your Railway domain: `https://capproject-production-xxxx.up.railway.app`
2. Test key features:
   - [ ] Homepage loads
   - [ ] User registration
   - [ ] Login works
   - [ ] Database queries work
   - [ ] Assets load (CSS/JS)
   - [ ] Images display

---

## STEP 10: Set Up Automatic Deployments

Railway automatically deploys when you push to GitHub!

### Workflow:
```bash
# Make changes locally
git add .
git commit -m "Update feature"
git push origin main

# Railway automatically detects the push and deploys!
# Watch deployment at: railway.app/project/your-project/deployments
```

---

## 🎯 Post-Deployment Tasks

### Create Admin User

**Option 1: Using Railway CLI**
```bash
railway run php artisan tinker
>>> $user = new App\Models\User();
>>> $user->name = "Admin";
>>> $user->email = "admin@negogen.com";
>>> $user->password = bcrypt('secure-password');
>>> $user->role = 'admin';
>>> $user->email_verified_at = now();
>>> $user->save();
```

**Option 2: Register normally, then update in database**
1. Register a user on your site
2. Go to Railway → MySQL service → Data tab
3. Run SQL:
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
   ```

### Enable Persistent Storage (for uploads)

If you need to store uploaded files:

1. Go to **Service Settings**
2. Under **"Volumes"**
3. Click **"+ New Volume"**
4. Mount path: `/app/storage/app/public`

---

## 🔧 Useful Railway Commands

### Using Railway CLI:

```bash
# View logs
railway logs

# Run artisan commands
railway run php artisan migrate
railway run php artisan cache:clear
railway run php artisan config:cache

# Open shell
railway shell

# View variables
railway variables

# Open in browser
railway open
```

---

## 🐛 Troubleshooting

### Application Error / 500

**Check logs:**
1. Go to Railway dashboard
2. Click your service
3. View **"Deployments"** → Click latest deployment
4. Check build and runtime logs

**Common issues:**
```bash
# APP_KEY not set
railway run php artisan key:generate

# Migrations not run
railway run php artisan migrate --force

# Cache issues
railway run php artisan config:clear
railway run php artisan cache:clear
railway run php artisan view:clear
```

### Assets Not Loading

1. Check `APP_URL` is set correctly
2. Ensure `npm run build` ran successfully
3. Check `public/build` folder exists
4. View build logs for errors

### Database Connection Error

1. Verify database variables are linked correctly
2. Check MySQL service is running
3. Test connection:
   ```bash
   railway run php artisan migrate:status
   ```

### Out of Credits

Railway free tier includes **$5/month**:
- Monitor usage in dashboard
- Optimize by reducing replicas
- Upgrade to paid plan if needed (~$5/month for small apps)

---

## 📊 Monitor Your Application

### Check Usage:
1. Dashboard → Project Settings
2. View **"Usage"** tab
3. Monitor:
   - CPU usage
   - Memory usage
   - Network bandwidth
   - Credit consumption

### View Logs:
- Real-time logs in **Deployments** tab
- Filter by service
- Download logs for debugging

---

## 🔄 Rolling Back Deployments

If something breaks:

1. Go to **"Deployments"** tab
2. Find a working deployment
3. Click **"⋮"** (three dots)
4. Select **"Redeploy"**

---

## 🎉 Your App is Live!

**Your Laravel + Inertia.js app is now deployed on Railway!**

### Share your app:
- Production URL: `https://your-app.up.railway.app`
- Automatic HTTPS (SSL included)
- Auto-deploy on git push

### Next steps:
- [ ] Add custom domain (if you have one)
- [ ] Set up monitoring/alerts
- [ ] Configure backups
- [ ] Test all features thoroughly
- [ ] Share with users!

---

## 💰 Cost Breakdown

**Free Tier ($5 credit/month):**
- Small Laravel app: ~$3-5/month
- MySQL database: Included
- SSL certificate: Free
- Bandwidth: 100GB free

**If you exceed free tier:**
- Pay only for what you use
- Usually $5-10/month for hobby projects
- Much cheaper than traditional hosting

---

## 🆘 Need Help?

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Railway Status: https://status.railway.app
- Your deployment logs (in Railway dashboard)

---

## ✅ Deployment Checklist

- [ ] Project pushed to GitHub
- [ ] Railway account created
- [ ] MySQL database added
- [ ] Environment variables configured
- [ ] Public domain generated
- [ ] APP_URL updated
- [ ] Deployment successful
- [ ] Migrations run
- [ ] Application tested
- [ ] Admin user created
- [ ] Features verified

**🎊 Congratulations! You've deployed to Railway!**
