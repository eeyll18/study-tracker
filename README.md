# Ders Çalışma Takibi Uygulaması

Öğrenciler ve kendi kendine öğrenenler için geliştirilmiş modern bir ders çalışma takibi uygulamasıdır. Bu platform, kullanıcıların çalışma sürelerini verimli bir şekilde yönetmelerine, hedefler belirlemelerine ve ilerlemelerini görsel olarak takip etmelerine olanak tanır.

<!-- **[Canlı Demoyu Görüntüle](https://PROJENIN-VERCEL-LINKI.vercel.app)**  *(Buraya Vercel linkini eklemeyi unutma)*-->

![Uygulamamın Ekran Görüntüsü](./assets/study-tracker.png)


---

## ✨ Özellikler

- **🔐 Kullanıcı Yönetimi:** Supabase Auth ile güvenli e-posta/şifre tabanlı kayıt ve giriş sistemi.
- **📚 Ders Yönetimi:** Çalışılacak dersleri kolayca **Ekleme ve Silme**.
- **⏱️ Akıllı Zamanlayıcı:** Her ders için ayrı ayrı çalıştırılabilen kronometre ile net çalışma süresi takibi.
- **🎯 Hedef Belirleme:** Kullanıcıların kendilerine **günlük ve haftalık çalışma hedefleri** koyarak motivasyonlarını artırması.
- **📊 İstatistik ve Raporlama:** **Detaylı grafikler (Recharts/Chart.js)** ile hangi derse ne kadar çalışıldığını görsel olarak analiz etme ve ilerleme takibi.
- **🔒 Güvenli ve Kişisel:** Supabase Row Level Security (RLS) sayesinde her kullanıcının verileri tamamen kendine özel ve güvendedir.

---

## 🛠️ Teknoloji Yığını

- **Framework:** **Next.js** 
- **Dil:** **TypeScript**
- **Backend & Veritabanı:** **Supabase** (PostgreSQL, Auth, RLS)
- **Styling:** **Tailwind CSS**
- **UI Bileşenleri:** **shadcn/ui**
- **Grafikler:** **Recharts** 
<!-- - **Deployment:** **Vercel** -->

---

## 🚀 Projeyi Yerel Makinede Çalıştırma

Projeyi kendi bilgisayarınızda kurmak ve çalıştırmak için aşağıdaki adımları izleyin.

1.  **Repository'yi Klonlayın:**
    ```bash
    git clone https://github.com/eeyll18/study-tracker.git
    ```

2.  **Gerekli Paketleri Yükleyin:**
    ```bash
    npm install
    ```

3.  **Environment Değişkenlerini Ayarlayın:**
    Projenin ana dizininde `.env.local` adında bir dosya oluşturun ve Supabase projenizin bilgilerini içine ekleyin.

    ```.env.local
    NEXT_PUBLIC_SUPABASE_URL
    NEXT_PUBLIC_SUPABASE_ANON_KEY
    ```

4.  **Geliştirme Sunucusunu Başlatın:**
    ```bash
    npm run dev
    ```


---
