# GitHub Personal Access Token Setup (Deprecated)

> GitHub Gist integration has been replaced by Supabase. You can ignore this unless you still use Gist.

Untuk bisa edit/add/delete schedules, kamu perlu GitHub Personal Access Token.

## Step 1: Buat Personal Access Token

1. Login ke GitHub
2. Buka https://github.com/settings/tokens
3. Klik **"Generate new token"** → **"Generate new token (classic)"**
4. Isi form:
   - **Note**: "Stand By Schedule App" (nama token)
   - **Expiration**: 90 days (atau No expiration kalau mau permanent)
   - **Scopes**: Centang **`gist`** aja (cukup untuk manage Gist)
5. Scroll ke bawah, klik **"Generate token"**
6. **PENTING**: Copy token yang muncul (gak bakal muncul lagi!)

Token akan seperti ini:
```
ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Step 2: Update .env File

1. Buka file `.env`
2. Ganti `your_github_personal_access_token_here` dengan token kamu:

```env
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Step 3: Ganti Username & Password (Opsional)

Ubah default admin credentials di `.env`:

```env
ADMIN_USERNAME=rheza
ADMIN_PASSWORD=password_yang_aman_123
```

## Step 4: Generate JWT Secret (Opsional tapi Recommended)

Generate random string untuk JWT secret:

```bash
# Pakai OpenSSL
openssl rand -base64 32

# Atau pakai Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Update di `.env`:
```env
JWT_SECRET=hasil_random_string_dari_command_diatas
```

## Step 5: Restart Server

```bash
pm2 restart standby-scheduler --update-env
```

## Testing

1. **Login**: POST ke `http://localhost:10001/api/auth/login`
   ```json
   {
     "username": "admin",
     "password": "admin123"
   }
   ```

2. **Dapat Token**: Response akan return JWT token

3. **Test Edit**: Pakai token di header `Authorization: Bearer <token>`

## Security Tips

✅ **DO**:
- Simpan token di `.env` (jangan commit ke Git)
- Ganti default password segera
- Generate JWT secret yang kuat
- Set token expiration

❌ **DON'T**:
- Jangan share token ke orang lain
- Jangan commit `.env` ke Git
- Jangan pakai default password di production
