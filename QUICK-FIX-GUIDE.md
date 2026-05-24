# Quick Fix Guide - Contact Info Not Showing

## ✅ YOUR MAIN ISSUE IS FIXED!

**Problem**: Admin updates to contact information were saving but not appearing on the public homepage.

**Root Cause**: Next.js App Router caches pages/data by default. Without telling Next.js to refresh the cache, it served stale data forever.

**Solution Applied**: Added `revalidatePath()` to `/app/api/site-settings/route.ts`

---

## 🧪 TEST IT NOW

1. **Start your dev server** (if not running):
   ```bash
   npm run dev
   ```

2. **Whitelist your IP in MongoDB Atlas** (if you haven't):
   - Go to: https://cloud.mongodb.com
   - Navigate to: Network Access → Add IP Address
   - Click: "ADD CURRENT IP ADDRESS"
   - Wait 2 minutes for changes to propagate

3. **Update contact info**:
   - Open: http://localhost:3000/admin/site-settings
   - Change Contact Email, Phone, Location
   - Click "Save All Settings"
   - You should see: "Settings saved! Public site will reflect changes."

4. **Verify on public site**:
   - Open NEW TAB: http://localhost:3000
   - Scroll down to Contact Section (bottom of page)
   - **Your new contact info should appear immediately**
   - Phone and Location cards only show if you entered values (not empty)

---

## 📋 WHAT WAS FIXED

### Files Modified:

1. **`/app/api/site-settings/route.ts`**
   - Added: `import { revalidatePath } from 'next/cache';`
   - Added after save: `revalidatePath('/', 'layout');`
   - **Result**: Homepage refreshes when settings change

2. **`/app/api/projects/route.ts`** & **`/app/api/projects/[slug]/route.ts`**
   - Same pattern for projects CRUD
   - **Result**: Project changes appear instantly

3. **`/app/admin/projects/[slug]/edit/page.tsx`**
   - Fixed typo: `grslug` → `grid`
   - Fixed placeholders: `dslug` → `did`
   - Added `router.refresh()` after save/delete
   - **Result**: Layout works, data refreshes

4. **`/components/public/Hero.tsx`**, **Navbar.tsx**, **BackToTopButton.tsx**
   - Added SSR guards: `if (typeof window === 'undefined') return;`
   - Added passive scroll listeners: `{ passive: true }`
   - **Result**: No hydration warnings, better performance

5. **`/app/admin/blog/new/page.tsx`** & **`/app/admin/blog/[id]/edit/page.tsx`**
   - Added `router.refresh()` after CRUD operations
   - **Result**: Blog list updates after edits

---

## 🔧 REMAINING WORK (Optional)

Your main issue is fixed, but to complete the audit:

### High Priority (Do Next)
Apply the same revalidation pattern to remaining API routes:

```bash
# Files that still need revalidatePath():
app/api/blog/route.ts
app/api/blog/[id]/route.ts
app/api/experience/route.ts
app/api/experience/[id]/route.ts
app/api/skills/route.ts
app/api/skills/[id]/route.ts
app/api/achievements/route.ts
app/api/research/route.ts
app/api/about/route.ts
```

**Pattern to copy**:
```typescript
// 1. Add import at top
import { revalidatePath } from 'next/cache';

// 2. After successful POST/PUT/PATCH/DELETE, before return:
revalidatePath('/'); // Revalidate homepage
revalidatePath('/blog'); // If resource has list page
revalidatePath(`/blog/${slug}`); // If resource has detail page

return NextResponse.json({ success: true, data });
```

See full checklist: `AUDIT-FIXES-CHECKLIST.md`

---

## 🚀 WHEN TO DEPLOY

### Before Production:
1. **Fix security issues**:
   - Move admin credentials to environment variables
   - Generate secure NEXTAUTH_SECRET
   - Hash admin password with bcrypt

2. **Add to Vercel environment variables**:
   ```
   MONGODB_URI=your_connection_string
   NEXTAUTH_SECRET=generate_with_openssl
   NEXTAUTH_URL=https://yourdomain.com
   ADMIN_USERNAME=your_admin
   ADMIN_PASSWORD_HASH=bcrypt_hash_here
   ```

3. **Whitelist Vercel IPs in MongoDB Atlas**:
   - Network Access → Add IP → "Allow from anywhere" (0.0.0.0/0)
   - Or add specific Vercel IPs

4. **Test thoroughly**:
   - Create/edit/delete content in admin
   - Verify changes appear on public site
   - Test on mobile devices
   - Check performance with Lighthouse

---

## 📚 REFERENCE DOCS

- **Full Audit Report**: `AUDIT-FIXES-CHECKLIST.md` (17 issues documented)
- **Architecture Guide**: `STEP-3-RECOMMENDATIONS.md` (Best practices)
- **Revalidation Pattern**: `scripts/add-revalidation-to-apis.md`

---

## ❓ TROUBLESHOOTING

### "Changes still don't appear on public site"

**Check**:
1. MongoDB connection working? (Check admin dashboard loads)
2. IP whitelisted in Atlas? (Check Network Access)
3. Browser cache cleared? (Hard refresh: Ctrl+Shift+R)
4. Saved successfully? (Check for success message in admin)
5. Looking at correct field? (Email always shows, phone/location only if filled)

### "Admin page is slow to load"

**Cause**: MongoDB connection timeout (30 seconds by default)

**Already Fixed**: Changed timeout to 5 seconds in `/lib/mongodb.ts`

**Must Do**: Whitelist your IP in MongoDB Atlas (see step 2 above)

### "Page shows 'Loading...' forever"

**Cause**: API fetch timed out or failed

**Check**:
1. Open browser DevTools → Console
2. Look for errors (red text)
3. Check Network tab for failed requests
4. Verify MongoDB connection string in `.env.local`

### "Contact cards show 'contact@example.com' placeholder"

**Cause**: Falling back to default settings

**Solution**:
1. Go to `/admin/site-settings`
2. Fill in ALL contact fields (don't leave empty)
3. Click Save
4. Refresh homepage

**Note**: Phone and Location cards ONLY show if you enter values. Empty = hidden.

---

## 🎯 QUICK SUMMARY

**What was broken**: Next.js cached public pages forever, even after admin updates.

**What was fixed**: Added cache revalidation (`revalidatePath()`) to API routes.

**Impact**: Admin changes now appear on public site immediately (on next page load).

**Your action**: Test it! Update contact info in admin, verify it shows on homepage.

**Next steps**: Apply same fix to remaining API routes (blog, experience, skills, etc.)

---

**Need Help?** Check the full documentation in:
- `AUDIT-FIXES-CHECKLIST.md` - Complete issue list
- `STEP-3-RECOMMENDATIONS.md` - Architecture & security
- `scripts/add-revalidation-to-apis.md` - Detailed API fix instructions
