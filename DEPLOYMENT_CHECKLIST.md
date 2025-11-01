# 🚀 Hostinger Deployment Checklist

## ⚠️ CRITICAL: Review Before Building

### 1. **Environment Configuration**
- [ ] Review `.env` for sensitive data (API keys, passwords)
- [ ] Create `.env.production` template (never commit actual production .env)
- [ ] Update `APP_URL` to your Hostinger domain
- [ ] Set `APP_ENV=production`
- [ ] Set `APP_DEBUG=false`
- [ ] Update Pusher credentials for production

### 2. **Database Configuration**
**Current Issue:** Your `.env` uses `DB_CONNECTION=mysql` but `config/database.php` defaults to `sqlite`
- [ ] Fix database.php to default to 'mysql'
- [ ] Get Hostinger database credentials (host, name, username, password)
- [ ] Update production .env with correct database details

### 3. **Asset Configuration**
- [ ] Ensure `public/build` folder will be created after build
- [ ] Verify Vite builds to correct location
- [ ] Check that all asset paths use `asset()` or `@vite()` helpers

### 4. **File Permissions**
Hostinger will need writable directories:
- [ ] `storage/` (all subdirectories)
- [ ] `bootstrap/cache/`
- [ ] Set permissions to 755 for folders, 644 for files

### 5. **Security**
- [ ] Remove test files: `public/curltest.php`, `public/phpinfo.php`
- [ ] Verify APP_KEY is set (currently: ✅ set)
- [ ] Review CORS settings if using separate frontend
- [ ] Check Pusher keys are not exposed in frontend code

### 6. **Routes & URLs**
- [ ] Test all routes work without `/public/` in URL
- [ ] Ensure `.htaccess` redirects work properly
- [ ] Verify API routes have CSRF protection or are excluded

### 7. **Broadcasting/Pusher**
**Current Issue:** Duplicate Pusher configuration in .env
- [ ] Clean up duplicate BROADCAST_DRIVER and Pusher settings
- [ ] Verify Pusher credentials are production keys
- [ ] Test real-time features with production Pusher app

### 8. **Email Configuration**
**Current:** Using Gmail SMTP
- [ ] Verify Gmail app password is valid
- [ ] Consider using Hostinger's SMTP or a service like SendGrid
- [ ] Test email sending in production

### 9. **Session & Cache**
**Current:** Using file-based sessions/cache
- [ ] Acceptable for small traffic
- [ ] Consider Redis/Memcached for high traffic (Hostinger Business plans)

### 10. **Build & Dependencies**
- [ ] Run `composer install --optimize-autoloader --no-dev`
- [ ] Run `npm install` (if building on server)
- [ ] Run `npm run build` locally
- [ ] Commit `public/build` folder (or build on server if SSH available)

---

## 📝 Files to Create/Update

### 1. Fix `config/database.php` default
```php
'default' => env('DB_CONNECTION', 'mysql'),  // Change from 'sqlite' to 'mysql'
```

### 2. Create `.env.production` template
```env
APP_NAME="NegoGen"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

DB_CONNECTION=mysql
DB_HOST=localhost  # Hostinger provides this
DB_PORT=3306
DB_DATABASE=your_hostinger_db_name
DB_USERNAME=your_hostinger_db_user
DB_PASSWORD=your_hostinger_db_password

# ... rest of config
```

### 3. Create root `.htaccess` (for redirecting to /public)
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^(.*)$ public/$1 [L]
</IfModule>
```

### 4. Clean up `.env` duplicates
Remove duplicate BROADCAST_DRIVER and Pusher lines

---

## 🔧 Fixes Needed Now

1. **Database Default Connection**
2. **Remove Test Files**
3. **Clean Up .env Duplicates**
4. **Create Root .htaccess**

Would you like me to make these fixes automatically?
