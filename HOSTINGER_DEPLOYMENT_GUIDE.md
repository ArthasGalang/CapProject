# 🚀 Complete Hostinger Deployment Guide

## 📋 Prerequisites
- [ ] Hostinger hosting account (Premium or Business plan recommended)
- [ ] Domain name (or use Hostinger subdomain)
- [ ] SSH/FTP access credentials
- [ ] Database credentials from Hostinger

---

## STEP 1: Prepare Hostinger Account

### 1.1 Create MySQL Database
1. Log into Hostinger's hPanel
2. Go to **Databases → MySQL Databases**
3. Click **Create New Database**
4. Note down:
   - Database name
   - Database username
   - Database password
   - Database host (usually `localhost`)

### 1.2 Get SSH Access (if available)
1. Go to **Advanced → SSH Access**
2. Enable SSH access
3. Note down SSH credentials

---

## STEP 2: Upload Files to Hostinger

### Method A: Using File Manager (Recommended for beginners)

1. **In hPanel, go to File Manager**

2. **Upload project files:**
   ```
   CapProject/
   ├── app/
   ├── bootstrap/
   ├── config/
   ├── database/
   ├── public/        ← This is important!
   ├── resources/
   ├── routes/
   ├── storage/
   ├── vendor/
   ├── .htaccess      ← Root htaccess (we created this)
   ├── artisan
   ├── composer.json
   └── package.json
   ```

3. **Upload to:** `/domains/yourdomain.com/` or `/public_html/`

### Method B: Using FTP (FileZilla)

1. **Connect with FTP:**
   - Host: `ftp.yourdomain.com`
   - Username: (from hPanel)
   - Password: (from hPanel)
   - Port: 21

2. **Upload entire project folder**

### Method C: Using Git (Best method - if SSH available)

```bash
# SSH into your Hostinger account
ssh your_username@your_server

# Navigate to your domain folder
cd domains/yourdomain.com

# Clone your repository
git clone https://github.com/ArthasGalang/CapProject.git .

# Or if already cloned:
git pull origin main
```

---

## STEP 3: Configure Environment

### 3.1 Create .env file

1. **Copy `.env.production.example` to `.env`**
   ```bash
   cp .env.production.example .env
   ```

2. **Edit .env with your Hostinger database credentials:**
   ```env
   APP_NAME="NegoGen"
   APP_ENV=production
   APP_KEY=base64:zypIere4dWPMdmP8LuicLkLQK9DtDSPMcN3sdF7tNHw=
   APP_DEBUG=false
   APP_URL=https://yourdomain.com

   DB_CONNECTION=mysql
   DB_HOST=localhost
   DB_PORT=3306
   DB_DATABASE=u123456789_negogen       ← Your Hostinger DB name
   DB_USERNAME=u123456789_user          ← Your Hostinger DB user
   DB_PASSWORD=YourSecurePassword       ← Your Hostinger DB password

   # Keep your existing Pusher, Mail config...
   ```

---

## STEP 4: Install Dependencies

### If you have SSH access:

```bash
# Navigate to your project
cd /domains/yourdomain.com

# Install Composer dependencies (production only)
composer install --optimize-autoloader --no-dev

# Generate application key (if not set)
php artisan key:generate

# Run migrations
php artisan migrate --force

# Create storage link
php artisan storage:link

# Clear and cache config
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### If you DON'T have SSH access:

1. **Run these locally BEFORE uploading:**
   ```bash
   composer install --optimize-autoloader --no-dev
   npm run build
   ```

2. **Upload the `vendor/` folder along with your project**

3. **Run migrations using a custom PHP file:**
   Create `public/migrate.php`:
   ```php
   <?php
   require __DIR__.'/../vendor/autoload.php';
   $app = require_once __DIR__.'/../bootstrap/app.php';
   $app->make('Illuminate\Contracts\Console\Kernel')->call('migrate', ['--force' => true]);
   echo "Migrations completed!";
   // DELETE THIS FILE after running!
   ```

4. Visit: `https://yourdomain.com/migrate.php`
5. **DELETE `public/migrate.php` immediately after!**

---

## STEP 5: Set File Permissions

### Using File Manager:
Right-click folders → Change Permissions:
- `storage/` → **755** (all subdirectories)
- `bootstrap/cache/` → **755**

### Using SSH:
```bash
chmod -R 755 storage
chmod -R 755 bootstrap/cache
```

---

## STEP 6: Configure Document Root

### CRITICAL: Set document root to `/public` folder

1. **In hPanel, go to Domains**
2. Click **Manage** on your domain
3. Find **Document Root** setting
4. Change from `/public_html` to `/public_html/public`
   Or if installed in subfolder: `/public_html/CapProject/public`
5. **Save changes**

**Alternative:** If you can't change document root, the root `.htaccess` we created will handle redirects.

---

## STEP 7: Test Your Application

Visit your domain: `https://yourdomain.com`

### If you see errors:

1. **500 Internal Server Error:**
   - Check file permissions (storage/ and bootstrap/cache/)
   - Check .env file exists and has correct values
   - Check APP_KEY is set

2. **Database Connection Error:**
   - Verify database credentials in .env
   - Test database connection in hPanel

3. **Missing Assets/CSS:**
   - Ensure `public/build/` folder was uploaded
   - Check `APP_URL` in .env matches your domain
   - Clear browser cache

4. **Enable Debug Mode (temporarily):**
   ```env
   APP_DEBUG=true
   ```
   Then visit site to see detailed errors
   **IMPORTANT: Set back to `false` after fixing!**

---

## STEP 8: Post-Deployment Tasks

### 8.1 Security Checklist
- [ ] APP_DEBUG=false
- [ ] Strong database password
- [ ] APP_KEY is set
- [ ] Remove any test/debug files
- [ ] Test file upload permissions

### 8.2 SSL Certificate
1. In hPanel, go to **SSL**
2. Enable **Free Let's Encrypt SSL**
3. Force HTTPS redirect

### 8.3 Create Admin User (if needed)
```bash
php artisan tinker
>>> $user = new App\Models\User();
>>> $user->name = "Admin";
>>> $user->email = "admin@yourdomain.com";
>>> $user->password = bcrypt('your-secure-password');
>>> $user->role = 'admin';
>>> $user->email_verified_at = now();
>>> $user->save();
```

Or visit your registration page and manually set role to 'admin' in database.

---

## 🔄 Updating Your Site (Future Deployments)

### With Git (SSH):
```bash
ssh your_username@your_server
cd /domains/yourdomain.com
git pull origin main
composer install --optimize-autoloader --no-dev
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Without SSH:
1. Build locally: `npm run build`
2. Upload changed files via FTP/File Manager
3. Clear cache using custom PHP file

---

## 🆘 Troubleshooting

### Clear All Cache
Create `public/clear-cache.php`:
```php
<?php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make('Illuminate\Contracts\Console\Kernel');
$kernel->call('config:clear');
$kernel->call('cache:clear');
$kernel->call('view:clear');
$kernel->call('route:clear');
echo "Cache cleared!";
// DELETE THIS FILE after use!
```

### Check Logs
- Laravel logs: `storage/logs/laravel.log`
- PHP errors: Check hPanel → Error Logs

### Common Issues:
1. **"No input file specified"** → Document root not set to `/public`
2. **404 on all routes** → .htaccess not working, enable mod_rewrite
3. **Assets not loading** → Check public/build folder uploaded, APP_URL correct
4. **Database errors** → Check credentials, test connection in hPanel

---

## 📞 Need Help?

- Hostinger Support: https://www.hostinger.com/contact
- Laravel Documentation: https://laravel.com/docs
- Check your `storage/logs/laravel.log` for detailed errors

---

## ✅ Deployment Complete!

Your Laravel + Inertia.js app should now be live at:
**https://yourdomain.com**

Test all features:
- [ ] User registration/login
- [ ] Product browsing
- [ ] Shopping cart
- [ ] Checkout process
- [ ] Admin dashboard
- [ ] Shop management
- [ ] Real-time chat (Pusher)
- [ ] Email notifications

---

**Note:** This guide assumes you're using Hostinger Premium or Business plan with PHP 8.2+ support.
