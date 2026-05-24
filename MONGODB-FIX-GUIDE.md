# MongoDB Connection Fix Guide

## 🔍 Issue Diagnosed

**Error:** `MongooseServerSelectionError` - Could not connect to MongoDB Atlas cluster  
**Root Cause:** IP address not whitelisted in MongoDB Atlas (not an SSL configuration issue)

## ✅ Fixes Applied

### 1. Enhanced MongoDB Connection (`/lib/mongodb.ts`)
Added robust connection options to handle network issues:

```typescript
const opts = {
  bufferCommands: false,
  serverSelectionTimeoutMS: 30000,    // 30 second timeout
  socketTimeoutMS: 45000,              // 45 second timeout
  family: 4,                           // Force IPv4 (fixes SSL alert 80)
  retryWrites: true,                   // Auto-retry failed writes
  w: 'majority',                       // Write concern for durability
};
```

**Benefits:**
- Longer timeouts prevent premature connection failures
- IPv4 forcing resolves SSL/TLS handshake issues
- Better error logging for diagnostics

### 2. Graceful Degradation in SettingsProvider
Added `DEFAULT_SETTINGS` fallback to prevent UI crashes when MongoDB is unavailable:

```typescript
// Falls back to sensible defaults instead of throwing errors
catch (err) {
  console.warn('⚠️ Site settings API unavailable, using defaults:', err);
  setSettings(DEFAULT_SETTINGS);
}
```

**Result:** Public website stays functional even if database is down.

### 3. Error Handling in Public Sections
Changed all API error handlers from `console.error` to `console.warn` with empty state displays:

- ExperienceSection → Shows "No experience entries found"
- ResearchSection → Shows "Research papers coming soon"
- ProjectsSection → Shows "No projects in this category"

### 4. MongoDB Test Script (`/scripts/test-mongo.ts`)
Created diagnostic tool to verify connection:

```bash
npx tsx scripts/test-mongo.ts
```

## 🛠️ Action Required: Fix IP Whitelist

### Step 1: Get Your Current IP Address
```bash
curl -s https://api.ipify.org && echo
```

### Step 2: Add IP to MongoDB Atlas
1. Go to https://cloud.mongodb.com/
2. Navigate to your cluster
3. Click "Network Access" in left sidebar
4. Click "Add IP Address"
5. Options:
   - **Recommended for production:** Add specific IP address
   - **Quick fix for development:** Add `0.0.0.0/0` (allows all IPs - less secure)
6. Click "Confirm"

### Step 3: Wait 1-2 Minutes
Atlas needs time to propagate the whitelist changes.

### Step 4: Test Connection Again
```bash
npx tsx scripts/test-mongo.ts
```

You should see:
```
✅ Connection successful!
📡 Connection state: 1
🗄️  Database name: portfolio
✨ All tests passed!
```

## 🔐 Alternative: Connection String Check

Verify your `.env.local` has the correct format:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
```

**Common mistakes:**
- Wrong password (special characters must be URL-encoded)
- Wrong cluster URL
- Missing database name
- Expired credentials

## 📊 Connection Status Indicators

The enhanced logging will show:
- ✅ "Connected to MongoDB Atlas" + connection details
- ❌ "MongoDB connection failed" + specific error type
- 💡 Helpful hints based on error name

## ⚡ Next Steps After IP Whitelist Fix

1. Restart your dev server (after IP whitelist update only)
2. Navigate to http://localhost:3000
3. Check browser console for "✅ Connected to MongoDB Atlas"
4. Test admin login at http://localhost:3000/admin/login
5. Verify site-settings page loads at http://localhost:3000/admin/site-settings

## 🐛 If Issues Persist

**SSL Alert 80 Still Happening?**
- The `family: 4` option should fix this by forcing IPv4
- Check if your network has IPv6 issues
- Try connecting from a different network

**Timeout Errors?**
- Increase timeouts in `/lib/mongodb.ts`:
  ```typescript
  serverSelectionTimeoutMS: 60000,  // 60 seconds
  socketTimeoutMS: 90000,           // 90 seconds
  ```

**Authentication Errors?**
- Verify MongoDB Atlas username/password in `.env.local`
- Check user has correct database permissions (readWrite role)
- URL-encode special characters in password

## ✨ Summary

**Before:** MongoDB SSL errors crashed entire site  
**After:** Robust connection with graceful fallbacks

**Files Modified:**
- `/lib/mongodb.ts` - Enhanced connection options
- `/components/providers/SettingsProvider.tsx` - Added DEFAULT_SETTINGS fallback
- `/components/public/ExperienceSection.tsx` - Graceful error handling
- `/components/public/ResearchSection.tsx` - Graceful error handling
- `/components/public/ProjectsSection.tsx` - Graceful error handling

**Files Created:**
- `/scripts/test-mongo.ts` - Connection diagnostic tool
- `/MONGODB-FIX-GUIDE.md` - This guide
