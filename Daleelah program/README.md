# Daleelah - منصة السياحة الذكية في السعودية

> مشروع تخرج - نسخة Frontend First

## 📋 نظرة عامة

**Daleelah** منصة سياحية ذكية تربط السياح بالمرشدين والوجهات في المملكة العربية السعودية. المشروع يدعم 4 أدوار رئيسية:

1. **Tourist** 🧳 - السائح
2. **Guide** 🎯 - المرشد السياحي  
3. **Tourism Company** 🏢 - شركة السياحة
4. **Ministry of Tourism** 🏛️ - وزارة السياحة
5. **Admin** ⚙️ - المسؤول

## ✅ ما تم إصلاحه

### المشكلة الأساسية
- ✅ إصلاح خطأ المجلد: `[sulg]` → `[slug]` في صفحة تفاصيل المرشدين
- ✅ الآن `/guides/fahad-jeddah-sea` تعمل بشكل صحيح

### التحسينات
- ✅ بناء صفحات Dashboard لكل دور (Tourist, Guide, Company, Ministry, Admin)
- ✅ إضافة Types كاملة (User, Booking, Review, Offer)
- ✅ إضافة Mock Data للحجوزات والعروض
- ✅ تنظيف البنية وتحسين الأكواد

## 🚀 التشغيل

### المتطلبات
- Node.js (v18+)
- npm أو yarn

### خطوات التشغيل

```bash
# تثبيت الحزم
npm install

# تشغيل المشروع
npm run dev
```

المشروع سيعمل على: `http://localhost:3000`

### في حالة مشاكل الكاش
```bash
rm -rf .next
npm run dev
```

## 📁 البنية

```
src/
├── app/
│   ├── (site)/              # الصفحات العامة
│   │   ├── page.tsx         # الصفحة الرئيسية
│   │   ├── destinations/    # الوجهات
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── guides/          # المرشدين ✅ (تم الإصلاح)
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── planner/         # مخطط الرحلة
│   │   ├── about/
│   │   └── contact/
│   │
│   ├── (dashboard)/         # لوحات التحكم
│   │   ├── dashboard/       # Dashboard الرئيسي
│   │   ├── tourist/         # 🧳 لوحة السائح
│   │   ├── guide/           # 🎯 لوحة المرشد
│   │   ├── company/         # 🏢 لوحة الشركة
│   │   ├── ministry/        # 🏛️ لوحة الوزارة
│   │   └── admin/           # ⚙️ لوحة المسؤول
│   │
│   └── auth/                # التسجيل/الدخول
│       ├── login/
│       └── register/
│
├── components/              # المكونات
│   ├── destinations/
│   ├── guides/
│   ├── layout/
│   ├── ui/
│   └── common/
│
├── data/                    # البيانات الوهمية
│   ├── destinations.ts
│   ├── guides.ts
│   ├── bookings.ts          # 🆕
│   ├── offers.ts            # 🆕
│   └── cities.ts
│
├── types/                   # أنواع TypeScript
│   ├── destination.ts
│   ├── guide.ts
│   ├── user.ts              # 🆕 محدّث
│   ├── booking.ts           # 🆕
│   ├── review.ts            # 🆕
│   └── offer.ts             # 🆕
│
└── styles/                  # الأنماط
    ├── globals.css
    ├── theme.css
    └── sadu.css
```

## 🎯 الوظائف حسب Use Case

### 1. Tourist (السائح)
- ✅ تصفح الوجهات (Browse Destinations)
- ✅ إدارة الحجوزات (Manage Bookings) - UI جاهز
- ✅ تقديم التقييمات (Submit Reviews) - UI جاهز
- ✅ الحصول على توصيات AI - UI جاهز

### 2. Guide (المرشد السياحي)
- ✅ إدارة الجولات (Handle Tours) - UI جاهز
- ✅ استقبال التقييمات (Collect Ratings) - UI جاهز
- ✅ اقتراح جداول بالـ AI - UI جاهز

### 3. Tourism Company (شركة السياحة)
- ✅ معالجة الحجوزات (Process Bookings) - UI جاهز
- ✅ إلغاء الحجوزات (Cancel Booking) - UI جاهز
- ✅ إنشاء العروض (Create Offers) - UI جاهز
- ✅ إدارة القوائم (Manage Listings) - UI جاهز

### 4. Ministry of Tourism (وزارة السياحة)
- ✅ عرض التحليلات (View Analytics) - UI جاهز
- ✅ إصدار الإعلانات (Issue Announcements) - UI جاهز
- ✅ إدارة المحتوى (Manage Content) - UI جاهز

### 5. Admin (المسؤول)
- ✅ إدارة المستخدمين
- ✅ إدارة المحتوى
- ✅ مراقبة النظام

## 🔗 الروابط المتاحة

### الصفحات العامة
- `/` - الصفحة الرئيسية
- `/destinations` - قائمة الوجهات
- `/destinations/[slug]` - تفاصيل وجهة
- `/guides` - قائمة المرشدين
- `/guides/[slug]` - تفاصيل مرشد ✅
- `/planner` - مخطط الرحلة

### لوحات التحكم
- `/dashboard` - Dashboard الرئيسي (اختيار الدور)
- `/tourist` - لوحة السائح
- `/guide` - لوحة المرشد
- `/company` - لوحة الشركة
- `/ministry` - لوحة الوزارة
- `/admin` - لوحة المسؤول

### التسجيل/الدخول
- `/auth/login` - تسجيل الدخول (UI فقط)
- `/auth/register` - التسجيل (UI فقط)

## 📝 المراحل القادمة

### المرحلة الحالية: ✅ Frontend Complete
- [x] كل الصفحات تعمل
- [x] كل الروابط صحيحة
- [x] UI كامل لكل الأدوار
- [x] بيانات Mock جاهزة

### المرحلة 2: Database & API
- [ ] إعداد Prisma + PostgreSQL/MySQL
- [ ] إنشاء الجداول (Users, Guides, Destinations, Bookings, Reviews, Offers)
- [ ] بناء API Routes
- [ ] CRUD Operations

### المرحلة 3: Authentication
- [ ] تسجيل/دخول فعلي
- [ ] JWT أو NextAuth
- [ ] Role-based Access Control
- [ ] Middleware للحماية

### المرحلة 4: AI Features
- [ ] Trip Planner بالذكاء الاصطناعي
- [ ] توصيات للسياح
- [ ] اقتراحات جداول للمرشدين

## 🎨 التصميم

المشروع يستخدم:
- **Next.js 15** - Framework
- **TypeScript** - Type Safety
- **CSS Custom Properties** - للثيم
- **Inline Styles** - للسرعة (Frontend First)

## 📊 البيانات

### Mock Data المتاحة
- 3 وجهات (Destinations)
- 3 مرشدين (Guides)
- 3 حجوزات (Bookings)
- 3 عروض (Offers)

## ⚠️ ملاحظات مهمة

1. **الأمان**: حالياً لا يوجد Authentication حقيقي - كل شيء UI فقط
2. **Database**: لا يوجد قاعدة بيانات - كل شيء Mock Data
3. **AI**: لا يوجد AI حقيقي - الـ Planner يستخدم logic بسيط

**هذا مقصود!** الهدف الحالي هو Frontend First - نثبت كل الواجهات والروابط، ثم نضيف الـ Backend والـ AI.

## 🐛 الأخطاء المُصلحة

### ✅ المشكلة الرئيسية (Guides)
- **الخطأ**: مجلد `[sulg]` بدلاً من `[slug]`
- **الأثر**: صفحة تفاصيل المرشد ترجع 404
- **الحل**: إعادة تسمية المجلد إلى `[slug]`

### ✅ مشاكل أخرى تم حلها
- تنظيف الـ Types
- إضافة Dashboard لكل دور
- توحيد الأسلوب البرمجي

## 📞 الدعم

للمشاكل أو الأسئلة، راجع:
1. ملف `REPORT.md` - التقرير الكامل للحالة
2. التعليقات داخل الكود
3. الـ Types في `/src/types`

## 📄 الترخيص

مشروع تخرج - للاستخدام التعليمي

---

**تم التطوير بواسطة**: فريق Daleelah  
**التاريخ**: فبراير 2026  
**الحالة**: ✅ Frontend Complete - جاهز للـ Backend
