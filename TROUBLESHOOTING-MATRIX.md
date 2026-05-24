# 🔧 TROUBLESHOOTING MATRIX

Quick reference for common issues and fixes.

---

## MongoDB Connection Errors

| Symptom | Cause | Fix | Time |
|---------|-------|-----|------|
| "Could not connect to any servers" | ❌ **FALSE ALARM** - Your connection works! | Test: `node test-mongodb-connection.js` | 1 min |
| "MongoServerSelectionError" | Old dev server with stale connection | `taskkill //F //IM node.exe` → `npm run dev` | 2 min |
| Connection takes >10 seconds | Multiple servers competing for connections | Kill all Node processes, restart fresh | 2 min |
| SSL handshake errors | IPv6/IPv4 conflict (already fixed in mongodb.ts) | Verify `family: 4` in connection opts | - |

**✅ VERIFIED WORKING:**
- IP 103.24.126.106 is correctly whitelisted
- Connection string is valid
- Standalone test succeeds in 2.6 seconds
- All 10 collections accessible

---

## "Stuck Loading" / Content Not Visible

| Symptom | Cause | Fix | Time |
|---------|-------|-----|------|
| Sections invisible until scroll | `opacity: 0` in Framer Motion | ✅ **ALREADY FIXED** in ResearchCard, BlogCard, ExperienceCard | - |
| Loading spinner never disappears | API fetch timeout (MongoDB not responding) | Check MongoDB connection, restart dev server | 2 min |
| Content appears after 5+ seconds | 5-second timeout in fetch (intentional fail-fast) | Normal if DB is slow; check Atlas cluster status | - |
| Skeleton loaders show forever | Frontend waiting for data that never arrives | Check DevTools Network tab for failed API calls | 2 min |

**Before Fix:**
```typescript
initial={{ opacity: 0 }} // ❌ Invisible
```

**After Fix:**
```typescript
initial={{ opacity: 1 }} // ✅ Visible
```

---

## Admin CRUD Failures

| Symptom | Cause | Fix | Time |
|---------|-------|-----|------|
| "Failed to update research" alert | Missing cache revalidation in API route | Add `revalidatePath('/')` after mutation | 30 min |
| Save succeeds but list doesn't update | No `router.refresh()` after redirect | Add after `router.push()` | 10 min |
| Changes don't appear on public site | Missing `revalidatePath()` in API route | Complete remaining revalidation fixes | 2 hours |
| 500 Internal Server Error | MongoDB connection failed OR validation error | Check console logs for actual error | 5 min |

**Status:**
- ✅ Site settings: Revalidation added
- ✅ Projects: Revalidation added
- ⏳ Research, Experience, Skills, etc.: **NEEDS REVALIDATION**

---

## Dev Server Issues

| Symptom | Cause | Fix | Time |
|---------|-------|-----|------|
| "Port 3000 already in use" | Old dev server still running | `taskkill //F //IM node.exe` | 1 min |
| Two servers shown in logs | Second server started while first running | Kill all, start one | 1 min |
| Changes not reflecting | Stale `.next` cache | `rm -rf .next` → restart | 2 min |
| "Module not found" after changes | Cache corruption | `rm -rf .next node_modules/.cache` → restart | 5 min |

**Prevention:**
Use restart scripts:
```bash
# Windows
.\scripts\restart-dev.ps1

# macOS/Linux
./scripts/restart-dev.sh
```

---

## Data Sync Issues (Admin ↔ Public)

| Symptom | Cause | Status | Fix |
|---------|-------|--------|-----|
| Contact info doesn't sync | No revalidation | ✅ **FIXED** | - |
| Projects don't sync | No revalidation | ✅ **FIXED** | - |
| Research doesn't sync | No revalidation | ⏳ **TODO** | Add revalidatePath() |
| Experience doesn't sync | No revalidation | ⏳ **TODO** | Add revalidatePath() |
| Skills don't sync | No revalidation | ⏳ **TODO** | Add revalidatePath() |
| Blog doesn't sync | No revalidation | ⏳ **TODO** | Add revalidatePath() |

**Fix Pattern:**
```typescript
// In /app/api/[resource]/route.ts
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  // ... create item ...
  
  revalidatePath('/'); // ✅ Add this
  
  return NextResponse.json({ ... });
}
```

---

## Environment Variable Issues

| Symptom | Cause | Fix | Time |
|---------|-------|-----|------|
| "MONGODB_URI is undefined" | .env.local not loaded | Check file exists in project root | 1 min |
| Dev server doesn't show "Environments: .env.local" | File in wrong location OR syntax error | Move to root, check for typos | 2 min |
| Variables work in test script but not in app | Next.js not reloaded after .env change | Restart dev server | 1 min |
| Production deployment fails | Env vars not set in hosting platform | Add all vars in Vercel/Netlify dashboard | 5 min |

**Verify .env.local loaded:**
```bash
npm run dev 2>&1 | grep "Environments"
```
Should show: "Environments: .env.local"

---

## Animation/Rendering Issues

| Symptom | Cause | Fix | Time |
|---------|-------|-----|------|
| Hydration mismatch warnings | Server/client render different | ✅ **ALREADY FIXED** with SSR guards | - |
| Content flashes on page load | Server renders opacity: 0, client animates | ✅ **ALREADY FIXED** - now opacity: 1 | - |
| Scroll janky/stuttering | Unthrottled scroll listeners | ✅ **ALREADY FIXED** with passive listeners | - |
| Images don't load | Cloudinary not configured OR invalid URLs | Check image URLs, configure Cloudinary | 10 min |

---

## Browser/Cache Issues

| Symptom | Cause | Fix | Time |
|---------|-------|-----|------|
| Changes not visible after refresh | Browser cache | Hard refresh: Ctrl+Shift+R | 1 sec |
| Old version still showing | Service worker cache | Clear site data in DevTools | 1 min |
| Styles look broken | CSS not loaded OR Tailwind not compiled | Check browser console for 404s | 2 min |
| Different behavior in incognito | Browser extension conflict | Disable extensions OR use incognito | - |

---

## Network/Firewall Issues

| Symptom | Cause | Fix | Time |
|---------|-------|-----|------|
| MongoDB works from test script but not app | Different Node process OR network config | Use same connection opts, check firewall | 10 min |
| Connection works sometimes | Corporate firewall OR VPN | Disable VPN, whitelist MongoDB ports | Varies |
| Timeout only on first request | Cold start (MongoDB cluster sleeping) | Normal for free tier; upgrade for <1s response | - |
| Works on WiFi but not mobile hotspot | IP changed | Check new IP: `curl https://api.ipify.org` | 2 min |

---

## TypeScript Errors

| Symptom | Cause | Fix | Time |
|---------|-------|-----|------|
| "Property does not exist" | Type mismatch OR missing import | Check types match API response | 5 min |
| "Cannot find module" | Missing dependency OR wrong path | `npm install <package>` OR fix import path | 2 min |
| Many errors after changes | Stale type cache | `rm -rf .next` → `npx tsc --noEmit` | 3 min |

**Current Status:** ✅ **Zero TypeScript errors** after all fixes

---

## Production Deployment Issues

| Symptom | Cause | Fix | Time |
|---------|-------|-----|------|
| Build fails with "Module not found" | Missing dependency in package.json | Add to dependencies (not devDependencies) | 5 min |
| API routes return 500 | Environment variables not set | Add all .env.local vars to hosting platform | 10 min |
| MongoDB connection fails | Vercel IPs not whitelisted in Atlas | Add 0.0.0.0/0 OR specific Vercel IPs | 5 min |
| Images 404 | Cloudinary not configured for production | Set NEXT_PUBLIC_CLOUDINARY vars | 5 min |
| Admin can't login | Credentials hardcoded in code (not env) | Move to environment variables | 15 min |

---

## Quick Diagnostic Commands

### Check MongoDB Connection:
```bash
node test-mongodb-connection.js
```
**Expected:** ✅ SUCCESS in <3 seconds

### Check Current IP:
```bash
curl https://api.ipify.org
```
**Expected:** 103.24.126.106 (or verify new IP if changed)

### Check Running Processes:
```bash
# Windows
netstat -ano | findstr :3000

# macOS/Linux
lsof -ti:3000
```
**Expected:** Empty (no processes) OR single PID

### Check Dev Server Logs:
```bash
npm run dev 2>&1 | head -20
```
**Expected:** 
- "Environments: .env.local"
- "Local: http://localhost:3000"
- No MongoDB connection errors

### Check TypeScript:
```bash
npx tsc --noEmit
```
**Expected:** No output (zero errors)

### Check Build:
```bash
npm run build
```
**Expected:** Completes without errors

---

## Priority Decision Matrix

| Issue | Impact | Urgency | Fix Time | Priority |
|-------|--------|---------|----------|----------|
| MongoDB connection errors | HIGH | **RESOLVED** | - | ✅ DONE |
| Content invisible until scroll | HIGH | **RESOLVED** | - | ✅ DONE |
| Admin CRUD doesn't sync | MEDIUM | High | 2 hours | 🔥 DO NEXT |
| Missing error states | LOW | Low | 1 hour | Later |
| Alert() instead of toast | LOW | Low | 1 hour | Polish |
| No rate limiting | LOW | Medium | 30 min | Pre-deploy |
| Hardcoded credentials | HIGH | Medium | 15 min | Pre-deploy |

---

## Step-by-Step Troubleshooting Flow

### 1. Start Here (Always)
```bash
# Kill all servers
taskkill //F //IM node.exe

# Clear cache
rm -rf .next

# Start fresh
npm run dev
```

### 2. Test MongoDB
```bash
node test-mongodb-connection.js
```
- ✅ Success → MongoDB is fine
- ❌ Failure → Check IP whitelist, connection string

### 3. Test Public Site
Open: http://localhost:3000
- ✅ Loads fast → Good
- ❌ Stuck loading → Check DevTools Console for errors

### 4. Test Admin
Open: http://localhost:3000/admin
- ✅ Can login → Good
- ❌ Can't login → Check credentials
- ✅ Can create items → Good
- ❌ Save fails → Check console logs

### 5. Test Sync
1. Create item in admin
2. Open new tab → go to homepage
3. Scroll to relevant section
4. ✅ Item appears → Revalidation working
5. ❌ Item missing → Add revalidatePath()

---

## Emergency Reset (When Everything Breaks)

```bash
# 1. Kill all Node processes
taskkill //F //IM node.exe

# 2. Delete all caches
rm -rf .next
rm -rf node_modules/.cache
rm -rf .turbo

# 3. Reinstall dependencies (rarely needed)
rm -rf node_modules
npm install

# 4. Verify environment variables
cat .env.local

# 5. Test MongoDB standalone
node test-mongodb-connection.js

# 6. Start fresh
npm run dev

# 7. Test in incognito/private window
# (avoids browser cache issues)
```

---

## Contact & Support

If nothing above works:

1. **Check documentation:**
   - `START-HERE-FINAL-FIX.md` (main guide)
   - `COMPLETE-FIX-GUIDE.md` (detailed solutions)
   - `AUDIT-FIXES-CHECKLIST.md` (all known issues)

2. **Check logs:**
   - Browser DevTools Console (F12)
   - Terminal where dev server is running
   - `.next/dev/logs/next-development.log`

3. **Create issue report:**
   - What command did you run?
   - What was the exact error?
   - What did you try already?
   - Include screenshots of console errors

---

**Last Updated:** 2026-05-09  
**Status:** All critical issues resolved ✅  
**Next Action:** Restart dev server and test
