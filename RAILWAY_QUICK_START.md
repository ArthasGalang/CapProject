# 🚂 Railway Deployment - Quick Start

## ⚡ 5-Minute Setup

### Step 1: Commit & Push to GitHub ✅
```bash
git add .
git commit -m "Add Railway configuration"
git push origin main
```

### Step 2: Sign Up & Create Project 🚀
1. Go to **https://railway.app**
2. Sign up with GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Select **ArthasGalang/CapProject**

### Step 3: Add MySQL Database 🗄️
1. Click **"+ New"** → **"Database"** → **"Add MySQL"**
2. Wait for provisioning (~30 seconds)

### Step 4: Set Environment Variables 🔧
Click your service → **"Variables"** tab → Add these:

**Quick Copy-Paste:**
```
APP_NAME=NegoGen
APP_ENV=production
APP_KEY=base64:zypIere4dWPMdmP8LuicLkLQK9DtDSPMcN3sdF7tNHw=
APP_DEBUG=false
APP_URL=https://${{RAILWAY_PUBLIC_DOMAIN}}

DB_CONNECTION=mysql
```

**For Database Variables** (use "Add Reference"):
- DB_HOST → Reference: MySQL.MYSQL_HOST
- DB_PORT → Reference: MySQL.MYSQL_PORT
- DB_DATABASE → Reference: MySQL.MYSQL_DATABASE
- DB_USERNAME → Reference: MySQL.MYSQL_USER
- DB_PASSWORD → Reference: MySQL.MYSQL_PASSWORD

Copy rest from `.env.railway` file!

### Step 5: Generate Public Domain 🌐
Settings → Networking → **"Generate Domain"**

### Step 6: Deploy! 🎉
Railway auto-deploys! Watch in **"Deployments"** tab.

---

## 📁 Files Created for Railway

- ✅ `nixpacks.toml` - Build configuration
- ✅ `Procfile` - Start command
- ✅ `railway-deploy.sh` - Deployment script
- ✅ `.env.railway` - Environment variables template
- ✅ `RAILWAY_DEPLOYMENT_GUIDE.md` - Full guide

---

## 🐛 If Something Goes Wrong

### Check Build Logs:
Deployments tab → Click latest deployment → View logs

### Common Fixes:
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and link project
railway login
railway link

# Clear cache
railway run php artisan config:clear
railway run php artisan cache:clear

# Run migrations manually
railway run php artisan migrate --force

# Generate app key
railway run php artisan key:generate
```

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Railway account created  
- [ ] Project created from GitHub repo
- [ ] MySQL database added
- [ ] Environment variables added (especially DB references)
- [ ] Public domain generated
- [ ] Deployment succeeded (check Deployments tab)
- [ ] App loads in browser
- [ ] Database works (test login/register)

---

## 🎯 Your Next Push Auto-Deploys!

```bash
# Make changes
git add .
git commit -m "New feature"
git push

# Railway automatically deploys! 🚀
```

---

## 💰 Free Tier Usage

- **$5 credit/month** = ~500 hours of runtime
- Small Laravel app uses ~$3-5/month
- Monitor usage in dashboard

---

## 📖 Need More Help?

See `RAILWAY_DEPLOYMENT_GUIDE.md` for detailed instructions!

**🎊 Happy Deploying!**
