# Mini CRM - Müşteri Takip Uygulaması

Bu proje müşteri takibi yapabileceğiniz basit bir CRM uygulamasıdır.

---

## Proje Kurulumu

### 1. Backend

```bash
cd backend
npm install
# Gerekirse .env dosyasını oluşturup ayarları yapın:
# MONGO_URI, JWT_SECRET, PORT gibi değişkenleri tanımlayın
npm start
# Testleri çalıştırmak için:
npm test


### 2. Frontend
bash

cd frontend
npm install
npm run dev
# Testleri çalıştırmak için:
npm test


Testler
Backend testleri Jest + Supertest ile yazılmıştır.

Frontend testleri React Testing Library kullanılarak yazılmıştır.

Testleri çalıştırmak için ilgili klasörde npm test komutunu kullanabilirsiniz.

| Email                                               | Şifre  |
| --------------------------------------------------- | ------ |
| [testuser@example.com](mailto:test@example.com) | 123456 |

