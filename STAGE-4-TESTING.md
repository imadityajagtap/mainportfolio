# Stage 4 - Authentication Testing Guide

## ✅ Pre-Flight Checklist

- [x] TypeScript compilation passes (no errors)
- [x] MongoDB connection working
- [x] NextAuth configured
- [x] Admin UI pages created
- [x] API routes protected
- [ ] Admin account created (Task 1 below)

---

## TASK 1: Create Your Admin Account

Run the interactive script:

```bash
npx tsx scripts/create-admin-interactive.ts
```

**You will be prompted for:**
1. **Email** - Enter your preferred email (e.g., `aditya.jagtap@portfolio.com`)
2. **Password** - Minimum 8 characters
3. **Confirm Password** - Must match

**The script will:**
- ✅ Validate email format
- ✅ Check if user already exists (offer to reset password)
- ✅ Hash password with bcrypt (10 rounds)
- ✅ Save to MongoDB User collection
- ✅ Display login credentials

**Expected Output:**
```
╔═══════════════════════════════════════════════════════╗
║         ADMIN ACCOUNT CREATION                        ║
╚═══════════════════════════════════════════════════════╝

Enter admin email: aditya.jagtap@portfolio.com
Enter password (min 8 characters): ********
Confirm password: ********

🔐 Hashing password...
✅ Admin user created successfully!

╔═══════════════════════════════════════════════════════╗
║         LOGIN CREDENTIALS                             ║
╚═══════════════════════════════════════════════════════╝
   Email:    aditya.jagtap@portfolio.com
   Password: [your password]

🔗 Login URL: http://localhost:3000/admin/login
```

---

## TASK 2: Verify MongoDB Has the User

Run the verification script:

```bash
npx tsx scripts/verify-admin.ts
```

**Expected Output:**
```
🔍 Verifying admin user in MongoDB...

✅ Found 2 admin user(s):

1. Email: admin@adityajagtap.com
   Role:  admin
   ID:    [ObjectId]
   Created: [timestamp]

2. Email: aditya.jagtap@portfolio.com
   Role:  admin
   ID:    [ObjectId]
   Created: [timestamp]

🔌 Database connection closed
```

---

## TASK 3: Start Dev Server & Test Authentication

Start the development server:

```bash
npm run dev
```

Wait for: `✓ Ready on http://localhost:3000`

---

## 🧪 Test Scenarios

### Test 1: Protected Route Redirect ✅
**Action:** Visit `http://localhost:3000/admin/dashboard` (while logged out)

**Expected Result:**
- ✅ Automatically redirects to `/admin/login`
- ✅ URL changes to `http://localhost:3000/admin/login`

**Status:** [ ] PASS [ ] FAIL

---

### Test 2: Login Page Loads ✅
**Action:** Visit `http://localhost:3000/admin/login`

**Expected Result:**
- ✅ Login form is visible
- ✅ Email and password fields present
- ✅ "Sign In" button visible
- ✅ Default credentials hint shown

**Status:** [ ] PASS [ ] FAIL

---

### Test 3: Wrong Credentials ❌
**Action:** Enter wrong credentials
- Email: `wrong@email.com`
- Password: `wrongpass`
- Click "Sign In"

**Expected Result:**
- ✅ Error message appears: "Invalid email or password"
- ✅ Stays on login page (no redirect)
- ✅ Form remains visible

**Status:** [ ] PASS [ ] FAIL

---

### Test 4: Correct Credentials ✅
**Action:** Enter your credentials
- Email: [your email from Task 1]
- Password: [your password from Task 1]
- Click "Sign In"

**Expected Result:**
- ✅ Redirects to `/admin/dashboard`
- ✅ Dashboard loads with stats
- ✅ Sidebar navigation visible
- ✅ Shows real data from database
- ✅ Quick actions buttons visible

**Status:** [ ] PASS [ ] FAIL

---

### Test 5: Already Logged In Redirect ✅
**Action:** While logged in, visit `http://localhost:3000/admin/login`

**Expected Result:**
- ✅ Automatically redirects to `/admin/dashboard`
- ✅ Login page never shows

**Status:** [ ] PASS [ ] FAIL

---

### Test 6: API Protection (Unauthenticated) 🔒
**Action:** 
1. Click logout button
2. Open browser DevTools (F12) → Console tab
3. Paste and run this code:

```javascript
fetch('/api/projects', { 
  method: 'POST', 
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    title: 'Unauthorized Project', 
    category: 'Finance' 
  }) 
}).then(r => r.json()).then(console.log)
```

**Expected Result:**
```json
{
  "success": false,
  "error": "Unauthorized - Authentication required"
}
```

**Status:** [ ] PASS [ ] FAIL

---

### Test 7: API Works When Authenticated ✅
**Action:**
1. Log back in with your credentials
2. Open browser DevTools (F12) → Console tab
3. Paste and run this code:

```javascript
fetch('/api/projects', { 
  method: 'POST', 
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    title: 'Test Project from Console',
    slug: 'test-project-console',
    category: 'Strategy',
    hook: 'Testing authenticated API access',
    featured: false
  }) 
}).then(r => r.json()).then(console.log)
```

**Expected Result:**
```json
{
  "success": true,
  "data": {
    "_id": "[new ObjectId]",
    "title": "Test Project from Console",
    "slug": "test-project-console",
    "category": "Strategy",
    ...
  }
}
```

**Verification:**
- Navigate to `/admin/projects` page
- New project should appear in the table

**Status:** [ ] PASS [ ] FAIL

---

### Test 8: Logout Flow ✅
**Action:** Click "Logout" button in sidebar

**Expected Result:**
- ✅ Redirects to `/admin/login`
- ✅ Logged out message or login form appears
- ✅ Visiting `/admin/dashboard` redirects back to login

**Status:** [ ] PASS [ ] FAIL

---

## 📊 Final Summary

### TypeScript Compilation
```bash
npx tsc --noEmit
```
**Result:** ✅ No errors

### Admin Files Created

```
app/admin/
├── layout.tsx                    (Sidebar + main layout)
├── login/page.tsx               (Login form)
├── dashboard/page.tsx           (Stats overview)
├── projects/page.tsx            (Projects list)
├── blog/page.tsx                (Blog posts list)
├── skills/page.tsx              (Skills grid)
├── experience/page.tsx          (Experience list)
├── messages/page.tsx            (Contact messages)
└── site-settings/page.tsx       (Site configuration)

components/admin/
└── Sidebar.tsx                   (Navigation component)

lib/
├── auth.ts                       (NextAuth config)
└── auth-helpers.ts               (Auth utility functions)

types/
└── next-auth.d.ts                (TypeScript extensions)

scripts/
├── create-admin-interactive.ts   (Interactive account creation)
└── verify-admin.ts               (Verify users in DB)

middleware.ts                     (Route protection)
```

### Test Results Summary

| Test | Description | Status |
|------|-------------|--------|
| 1 | Protected route redirect | [ ] |
| 2 | Login page loads | [ ] |
| 3 | Wrong credentials | [ ] |
| 4 | Correct credentials | [ ] |
| 5 | Already logged in | [ ] |
| 6 | API protection (no auth) | [ ] |
| 7 | API works (with auth) | [ ] |
| 8 | Logout flow | [ ] |

**Overall Status:** [ ] ALL PASS → Stage 4 Complete! 🎉

---

## 🐛 Troubleshooting

### Issue: "Module not found" error
**Solution:** Run `npm install` to ensure all dependencies are installed

### Issue: TypeScript errors
**Solution:** Run `npx tsc --noEmit` to see specific errors

### Issue: Login redirects immediately
**Solution:** Clear browser cookies or use incognito mode

### Issue: API returns 401 even when logged in
**Solution:** 
1. Check that you're logged in (visit `/admin/dashboard`)
2. Session cookie may have expired (30-day expiry)
3. Try logging out and back in

### Issue: Can't create admin user - "email already exists"
**Solution:** Script will ask if you want to reset the password. Type "yes"

---

## 🎯 Stage 4 Completion Criteria

- ✅ Admin account created successfully
- ✅ User verified in MongoDB
- ✅ All 8 tests pass
- ✅ TypeScript compiles without errors
- ✅ Dev server running without warnings

**When all criteria are met, Stage 4 is complete!** 🚀

Next: Stage 5 - Design System & Public Pages
