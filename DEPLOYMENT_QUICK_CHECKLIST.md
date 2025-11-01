# 📋 Hostinger Deployment Quick Checklist

## Before Upload:
- [x] ✅ Fixed database config (mysql default)
- [x] ✅ Removed test files (phpinfo.php, curltest.php)
- [x] ✅ Cleaned up .env duplicates
- [x] ✅ Created root .htaccess
- [x] ✅ Built production assets (`npm run build`)
- [ ] Run `composer install --optimize-autoloader --no-dev`

## Files to Upload:
```
✅ /app
✅ /bootstrap
✅ /config
✅ /database
✅ /public (includes /build folder)
✅ /resources
✅ /routes
✅ /storage
✅ /vendor (after composer install)
✅ /.htaccess (root)
✅ /artisan
✅ /composer.json
✅ /composer.lock

❌ DO NOT UPLOAD:
   - .env (create new on server)
   - /node_modules
   - .git folder
   - README.md (optional)
```

## On Hostinger:

### 1. Database Setup (hPanel)
- [ ] Create MySQL database
- [ ] Note: database name, username, password

### 2. Upload Files
- [ ] Upload via FTP/File Manager/Git
- [ ] Upload to: `/domains/yourdomain.com/` or `/public_html/`

### 3. Environment Setup
- [ ] Copy `.env.production.example` to `.env`
- [ ] Edit `.env` with Hostinger database credentials
- [ ] Verify APP_KEY is set
- [ ] Set APP_URL to your domain

### 4. Set Document Root
- [ ] In hPanel → Domains → Manage
- [ ] Change Document Root to `/public_html/public`
- [ ] Or use the root .htaccess redirect

### 5. File Permissions
- [ ] Set `storage/` to 755
- [ ] Set `bootstrap/cache/` to 755

### 6. Run Migrations
With SSH:
```bash
php artisan migrate --force
php artisan storage:link
php artisan config:cache
```

Without SSH:
- [ ] Use migrate.php method (see full guide)

### 7. Enable SSL
- [ ] In hPanel → SSL → Enable Let's Encrypt
- [ ] Force HTTPS redirect

### 8. Test Application
- [ ] Visit https://yourdomain.com
- [ ] Test login/registration
- [ ] Test all major features
- [ ] Check browser console for errors

## Post-Deployment:
- [ ] Set APP_DEBUG=false
- [ ] Delete any temporary migration/cache scripts
- [ ] Test email sending
- [ ] Test Pusher real-time features
- [ ] Create admin account

## 🎉 You're Live!

See `HOSTINGER_DEPLOYMENT_GUIDE.md` for detailed instructions.
