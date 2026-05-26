# Main Website Deployment Checklist

## Issue: Main website not showing data from MongoDB

### Root Cause
The main website on Vercel is missing environment variables needed to connect to MongoDB Atlas.

### Solution Steps

#### 1. Set Environment Variables on Vercel

Go to: https://vercel.com/your-username/mainportfolio/settings/environment-variables

Add these variables:

```env
MONGODB_URI=mongodb+srv://adityajagtap312:Adity%40007@cluster0.cn19nzi.mongodb.net/portfolio?appName=Cluster0

CLOUDINARY_CLOUD_NAME=dfbbtljul
CLOUDINARY_API_KEY=731984111671395
CLOUDINARY_API_SECRET=oeeFYgKoQ9dxCCSuTVEnSDwziEY
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dfbbtljul

NEXTAUTH_SECRET=qeKiUrlAW5McXk9k8KOPDeNE1U6pyEz/tRbz8pcnAVE=
NEXTAUTH_URL=https://mainportfolio-aditya-projects312.vercel.app
```

**IMPORTANT:** 
- Make sure to check "Production", "Preview", and "Development" for each variable
- The password contains @ which MUST be encoded as %40 in the connection string
- After adding variables, click "Redeploy" to apply them

#### 2. Verify MongoDB IP Whitelist

Go to: https://cloud.mongodb.com/v2#/org/YOUR_ORG/projects

1. Navigate to: Network Access
2. Verify `0.0.0.0/0` is in the IP Access List (allows Vercel to connect)
3. If not present, click "Add IP Address" → "Allow Access from Anywhere" → Confirm

#### 3. Test the Connection

After redeploying, visit:
- https://mainportfolio-aditya-projects312.vercel.app/api/experience
- Should return: `{"success":true,"data":[...],"count":X}`
- If it returns an error, check Vercel logs for details

#### 4. Verify Data Display

1. Visit: https://mainportfolio-aditya-projects312.vercel.app
2. Scroll to Experience section
3. Should display experience entries from database
4. If no data, add entries via admin panel first

### Quick Test Commands

```bash
# Test API from command line
curl https://mainportfolio-aditya-projects312.vercel.app/api/experience

# Should return JSON with success: true
```

### Troubleshooting

**If still not working:**

1. Check Vercel deployment logs for errors
2. Verify all env vars are saved (go back to settings)
3. Try redeploying again (sometimes takes 2 deploys)
4. Check MongoDB Atlas shows active connections

**Common Errors:**

- `Please define MONGODB_URI` → Environment variable not set on Vercel
- `MongoServerSelectionError` → IP not whitelisted or wrong connection string
- `Authentication failed` → Password encoding issue (use %40 for @)
