# ShopApp — Application de Gestion de Produits avec Panier

## Stack Technique

| Composant | Technologie |
|-----------|-------------|
| Backend   | ASP.NET Core Web API (.NET 9) |
| Base de données | MySQL (via XAMPP) |
| ORM | Entity Framework Core (Code First) |
| Auth | JWT Bearer Token |
| Frontend | Angular 17 + Angular Material |

---

## 🚀 Installation & Lancement

### Prérequis
- [.NET 9 SDK](https://dotnet.microsoft.com/download)
- [XAMPP](https://www.apachefriends.org/) (MySQL)
- [Node.js 18+](https://nodejs.org/) + npm
- [Angular CLI](https://angular.io/cli) : `npm install -g @angular/cli`

---

### 1. Configurer la base de données MySQL

1. Démarrer **XAMPP** → activer **Apache** et **MySQL**
2. Ouvrir **phpMyAdmin** : http://localhost/phpmyadmin
3. Créer une base de données nommée **`ShopDb`**

> EF Core créera les tables automatiquement au démarrage de l'API.

---

### 2. Lancer le Backend

```bash
cd ShopAPI

# Restaurer les packages NuGet
dotnet restore

# Appliquer les migrations (crée les tables dans MySQL)
dotnet ef database update

# Lancer l'API
dotnet run
```

✅ API disponible sur : **http://localhost:5000**  
✅ Swagger UI : **http://localhost:5000/swagger**

---

### 3. Créer un compte Admin

Par défaut, tous les comptes créés via `/api/auth/register` ont le rôle **Client**.

Pour créer un Admin, exécuter dans phpMyAdmin :

```sql
-- Après avoir créé un compte via l'API ou le frontend :
UPDATE Users SET Role = 'Admin' WHERE Username = 'votre_username';
```

---

### 4. Lancer le Frontend Angular

```bash
cd shop-frontend

# Installer les dépendances
npm install

# Lancer le serveur de développement
ng serve
```

✅ Application disponible sur : **http://localhost:4200**

---

## 📁 Structure du Projet

```
ShopProject/
├── ShopAPI/                    ← Backend ASP.NET Core
│   ├── Controllers/            ← AuthController, ProductsController, CartController
│   ├── Data/                   ← OltpDbContext.cs
│   ├── Entities/               ← User, Product, CartItem
│   ├── Repositories/           ← Interfaces + Implementations
│   ├── Services/               ← AuthService, TokenService
│   ├── DTOs/                   ← Auth, Products, Cart DTOs
│   ├── appsettings.json
│   └── Program.cs
│
└── shop-frontend/              ← Frontend Angular
    └── src/app/
        ├── components/
        │   ├── admin/          ← product-list, product-form
        │   ├── client/         ← product-catalog, cart
        │   ├── auth/           ← login, register
        │   └── shared/         ← navbar
        ├── services/           ← auth, product, cart services
        ├── guards/             ← authGuard, roleGuard
        ├── interceptors/       ← JwtInterceptor
        ├── app.module.ts
        └── app-routing.module.ts
```

---

## 🔐 Endpoints API

| Méthode | Endpoint | Rôle | Description |
|---------|----------|------|-------------|
| POST | /api/auth/register | Public | Créer un compte |
| POST | /api/auth/login | Public | Connexion + JWT |
| GET | /api/products | Admin, Client | Liste des produits |
| GET | /api/products/{id} | Admin, Client | Détail d'un produit |
| POST | /api/products | Admin | Créer un produit |
| PUT | /api/products/{id} | Admin | Modifier un produit |
| DELETE | /api/products/{id} | Admin | Supprimer un produit |
| GET | /api/cart | Client | Voir son panier |
| POST | /api/cart | Client | Ajouter au panier |
| DELETE | /api/cart/{id} | Client | Supprimer du panier |
| PUT | /api/cart/{id} | Client | Modifier la quantité |

---

## 🏗️ Architecture Patterns

- **Repository Pattern** : Accès aux données via interfaces (jamais le DbContext directement dans les contrôleurs)
- **DTOs** : Objets de transfert de données séparés des entités
- **JWT Authentication** : Token Bearer pour sécuriser l'API
- **Role-based Authorization** : `[Authorize(Roles = "Admin")]` sur les endpoints sensibles
- **Code First** : Modèle défini en C#, base de données générée par EF Core

---

## 🎯 Comptes de test

Après démarrage :

1. **S'inscrire** via l'interface ou Swagger : `POST /api/auth/register`
2. **Promouvoir en Admin** via SQL : `UPDATE Users SET Role = 'Admin' WHERE Username = 'admin';`
3. **Se connecter** → le frontend redirige selon le rôle

---

*Projet académique — Data Warehouse & Programmation .NET*
