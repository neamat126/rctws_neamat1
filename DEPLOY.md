# دليل رفع المشروع

## هيكل المشروع
- **Frontend**: React + Vite → يُرفع على Vercel أو Netlify
- **Backend**: Node.js + Express (`server.js`) → يُرفع على Railway أو Render

---

## 1. رفع الـ Backend على Railway

1. اذهب إلى [railway.app](https://railway.app) وسجّل دخول
2. اعمل **New Project → Deploy from GitHub repo**
3. اختر الـ repo
4. في **Settings → Variables** أضف:
   ```
   MWRI_API_PASSWORD=<كلمة السر الحقيقية>
   PACWA_API_PASSWORD=<كلمة السر الحقيقية>
   PORT=3001
   ```
5. في **Settings → Start Command** اكتب:
   ```
   node server.js
   ```
6. بعد الرفع ستحصل على URL مثل: `https://your-app.railway.app`

---

## 2. رفع الـ Frontend على Vercel

1. اذهب إلى [vercel.com](https://vercel.com) وسجّل دخول
2. اعمل **New Project → Import Git Repository**
3. في **Environment Variables** أضف:
   ```
   VITE_API_URL=https://your-app.railway.app
   ```
   (عنوان الـ backend من الخطوة السابقة)
4. اضبط الإعدادات:
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. اضغط **Deploy**

---

## 3. للتشغيل المحلي

```bash
# نسخ ملف البيئة
cp .env.example .env
# وعدّل القيم الحقيقية في .env

# تثبيت الحزم
npm install

# تشغيل الـ Backend
npm run server

# في terminal ثاني — تشغيل الـ Frontend
npm run dev
```

---

## ملاحظات مهمة

- ملف `.env` **لا يُرفع على GitHub** (موجود في .gitignore)
- ملف `.env.example` هو النموذج الآمن للرفع
- قواعد Firebase Security Rules لازم تكون صح قبل الإنتاج
