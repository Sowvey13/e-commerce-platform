# E-Commerce Platform (MVP)

API tabanlı e-ticaret MVP projesi. Backend (`e-commerce-api`) Laravel REST API olarak, `storefront` ve `admin` ise ayrı React/Vite uygulamaları olarak çalışır.

## Proje Yapısı

- `e-commerce-api/`: Laravel backend (REST API, Sanctum auth, sepet, adres, sipariş, fake ödeme, admin endpoints, feature testler)
- `storefront/`: Müşteri arayüzü (ürün vitrini, arama/filtreleme, misafir ve üye sepeti, checkout, adres yönetimi, siparişlerim, fake ödeme ve iptal)
- `admin/`: Yönetim paneli (ürün, kategori, kullanıcı listesi, kullanıcı sipariş geçmişi ve sipariş durum güncelleme)

## Gereksinimler

- Docker & Laravel Sail (veya PHP 8.2+ & Composer & MySQL)
- Node.js 18+ & npm

## Kurulum ve Çalıştırma

Tüm adımlar proje ana dizininden (`e-commerce-platform`) başlatılır:

### 1. Backend (`e-commerce-api`)

- `cd e-commerce-api`
- `cp .env.example .env`
- `./vendor/bin/sail up -d`
- `./vendor/bin/sail artisan key:generate`
- `./vendor/bin/sail artisan migrate:fresh --seed`
- `cd ..`

### 2. Storefront (`storefront`)

- `cd storefront`
- `npm install`
- `npm run dev`
- `cd ..`

### 3. Admin Panel (`admin`)

- `cd admin`
- `npm install`
- `npm run dev`
- `cd ..`

## Yerel Geliştirme Adresleri

- **Backend API:** `http://localhost`
- **Storefront:** `http://localhost:5175` *(veya terminaldeki `npm run dev` çıktısında belirtilen port)*
- **Admin Panel:** `http://localhost:5174` *(veya terminaldeki `npm run dev` çıktısında belirtilen port)*

## Örnek Seed Kullanıcıları

- **Admin:** `admin@example.com` / `123456`
- **Müşteri:** `customer@example.com` / `123456`

## Testleri Çalıştırma

- `cd e-commerce-api`
- `php artisan test` (veya Docker ortamında `./vendor/bin/sail artisan test`)