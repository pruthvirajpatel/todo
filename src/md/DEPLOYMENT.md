# 🚀 Deployment Guide

This guide covers deploying your React Todo app to various platforms.

## ✅ Pre-Deployment Checklist

Before deploying, ensure:

- ✅ `npm run build` completes successfully
- ✅ `npm run preview` shows the app working correctly
- ✅ All tests pass (`npm test`)
- ✅ No TypeScript errors
- ✅ PostCSS configuration is present (`postcss.config.cjs`)

## 🌐 Vercel (Recommended)

Vercel offers the best experience for Vite/React apps with zero configuration.

### Method 1: Using CLI (Fastest)

```bash
# No installation needed - use npx
npx vercel

# For production deployment
npx vercel --prod
```

**First time setup:**
1. Login when prompted (creates account if needed)
2. Accept project defaults
3. App deploys automatically!

### Method 2: GitHub Integration (Automatic Deployments)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/todo.git
   git push -u origin main
   ```

2. **Connect to Vercel:**
   - Visit [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Click "Deploy"

3. **Automatic deployments:**
   - Every push to `main` → Production deployment
   - Every PR → Preview deployment

### Vercel Configuration

Vercel auto-detects Vite. No `vercel.json` needed!

**Optional - Custom domain:**
```bash
vercel domains add yourdomain.com
```

**Environment Variables:**
Currently none required. Add via Vercel dashboard if needed.

---

## 🌊 Netlify

Netlify is another excellent option with great DX.

### Method 1: Netlify CLI

```bash
# Install CLI
npm install -g netlify-cli

# Build your app
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

### Method 2: Drag & Drop

1. Build: `npm run build`
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
3. Drag the `dist` folder onto the page
4. Done!

### Method 3: GitHub Integration

1. Push code to GitHub
2. Visit [app.netlify.com](https://app.netlify.com)
3. Click "Add new site" → "Import from Git"
4. Select your repo
5. Build settings (auto-detected):
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click "Deploy"

### Netlify Configuration

Create `netlify.toml` for SPA routing:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## 🐙 GitHub Pages

Free hosting with custom domain support.

### Setup

1. **Install gh-pages:**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update `vite.config.ts`:**
   ```typescript
   export default defineConfig({
     base: '/todo/', // Your repo name
     // ... rest of config
   });
   ```

3. **Add scripts to `package.json`:**
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

4. **Deploy:**
   ```bash
   npm run deploy
   ```

5. **Enable GitHub Pages:**
   - Repo Settings → Pages
   - Source: `gh-pages` branch
   - Save

**Live at:** `https://YOUR_USERNAME.github.io/todo/`

### Custom Domain

1. Add `CNAME` file in `public/` folder:
   ```
   yourdomain.com
   ```

2. Configure DNS:
   - A Records: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - Or CNAME: `YOUR_USERNAME.github.io`

---

## 🚂 Railway

Deploy with a Dockerfile for full control.

### Dockerfile

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Deploy

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

---

## 🐳 Docker (Self-Hosted)

Use the Dockerfile above, then:

```bash
# Build
docker build -t todo-app .

# Run
docker run -p 8080:80 todo-app
```

Visit `http://localhost:8080`

---

## 🔧 Build Optimization

### Environment-Specific Builds

Create `.env.production`:
```bash
VITE_API_URL=https://api.production.com
```

Build with: `npm run build`

### Analyze Bundle Size

```bash
npm run build
# Opens bundle-stats.html automatically
```

Look for:
- Large dependencies (consider alternatives)
- Duplicate code (check imports)
- Unused code (tree-shake)

---

## 🐛 Common Deployment Issues

### Issue 1: CSS Missing in Production

**Problem:** Styles don't load after deployment.

**Solution:** Ensure `postcss.config.cjs` exists:
```javascript
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

### Issue 2: Build Fails - TypeScript Error

**Problem:** `error TS5055: Cannot write file...`

**Solution:** Update `tsconfig.json` exclude:
```json
{
  "exclude": [
    "node_modules",
    "dist",
    "vite.config.ts",
    "postcss.config.cjs",
    "tailwind.config.cjs"
  ]
}
```

### Issue 3: Blank Page After Deployment

**Problem:** App shows blank page in production.

**Solutions:**
1. Check browser console for errors
2. Verify `base` in `vite.config.ts` matches your URL path
3. Check that all assets are in the `dist` folder
4. Ensure SPA fallback is configured (for Netlify/Nginx)

### Issue 4: 404 on Refresh

**Problem:** Direct URLs or page refresh shows 404.

**Solution:** Configure SPA routing:

**Vercel:** Auto-configured ✅

**Netlify:** Add `netlify.toml` (see above)

**Nginx:**
```nginx
try_files $uri $uri/ /index.html;
```

### Issue 5: Vercel Build Timeout

**Problem:** Build exceeds time limit.

**Solutions:**
1. Remove unused dependencies
2. Disable source maps: `sourcemap: false` in `vite.config.ts`
3. Reduce build complexity

---

## 📊 Post-Deployment Checklist

After deploying, verify:

- ✅ App loads correctly
- ✅ All routes work (navigate and refresh)
- ✅ CSS/styles are applied
- ✅ Images load
- ✅ LocalStorage works
- ✅ Mobile responsive
- ✅ No console errors
- ✅ Lighthouse score > 90

---

## 🔒 Security Best Practices

1. **Never commit secrets**
   - Use environment variables
   - Add `.env` to `.gitignore`

2. **Enable HTTPS**
   - Vercel/Netlify: Automatic ✅
   - Custom: Use Let's Encrypt

3. **Set security headers**
   - Most platforms handle this
   - For custom: Add CSP, HSTS headers

4. **Keep dependencies updated**
   ```bash
   npm audit
   npm audit fix
   ```

---

## 📈 Monitoring & Analytics

### Add Analytics

**Vercel Analytics:**
```bash
npm install @vercel/analytics
```

```typescript
// In main.tsx
import { Analytics } from '@vercel/analytics/react';

<App />
<Analytics />
```

**Google Analytics:**
```html
<!-- In index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
```

---

## 🎯 Performance Tips

1. **Enable gzip/brotli** - Vercel/Netlify automatic
2. **Use CDN** - Vercel/Netlify built-in
3. **Optimize images** - Use WebP format
4. **Lazy load routes** - Already implemented ✅
5. **Cache static assets** - Configure via headers

---

## 🆘 Need Help?

- **Vercel Issues:** [vercel.com/support](https://vercel.com/support)
- **Netlify Issues:** [answers.netlify.com](https://answers.netlify.com)
- **General:** Check browser console and build logs

---

**🎉 Congratulations! Your app is live!**

Share your deployment URL and get feedback from users.
