# 🔴 Pokedextop

**Pokedextop** est une application web moderne pour collectionner et organiser vos Pokémons préférés. Créez votre compte, explorez le catalogue complet et constituez votre propre Pokédex !

---

## 📋 À propos

Pokedextop vous permet de :
- 👤 Créer votre compte personnel
- 🔍 Explorer un catalogue de 151 Pokémons de première génération
- ➕ Ajouter des Pokémons à votre collection
- 📚 Consulter votre Pokédex personnel
- 🔎 Rechercher par nom ou type de Pokémon

Chaque utilisateur dispose de sa propre collection indépendante. Vos données sont sécurisées et isolées !

---

## 🚀 Installation et Lancement

### Prérequis
- Node.js (v18+)
- npm

### Backend (JSON Server)
```bash
cd back
npm install
npm start
```
Le serveur API démarre sur **http://localhost:3000**

### Frontend (Angular)
```bash
cd front/pokedextop
npm install
ng serve
```
L'application web démarre sur **http://localhost:4200**

---

## 📖 Guide d'utilisation

### 1️⃣ Accéder à l'application
Ouvrez votre navigateur et allez sur **http://localhost:4200**

### 2️⃣ Créer un compte ou se connecter
- Cliquez sur **"S'inscrire"** pour créer un nouveau compte
- Ou utilisez un compte de test (voir ci-dessous)

### 3️⃣ Explorer le catalogue
- Allez à la page **"Pokémon"** pour voir tous les Pokémons disponibles
- Chaque carte affiche le nom, l'image, la taille, le poids et les types

### 4️⃣ Ajouter à ma collection
- Cliquez sur le bouton **"+"** sur une carte pour l'ajouter à votre collection

### 5️⃣ Gérer ma collection
- Allez à **"Ma Collection"** pour voir vos Pokémons collectés
- Utilisez le bouton **"✕"** pour retirer un Pokémon
- Recherchez par nom ou type avec la barre de recherche

### 6️⃣ Se déconnecter
- Cliquez sur le bouton **"Déconnexion"** pour quitter

---

## 🎮 Comptes de test

Vous pouvez tester l'application avec ces comptes :

| Username | Mot de passe |
|----------|-------------|
| admin    | admin123    |
| user     | user123     |
| pablo    | pablo123    |

---

## 🛠️ Build pour la production

```bash
ng build
```

Les fichiers optimisés seront générés dans le dossier `dist/`.

---

## 📁 Structure du projet

```
Pokedextop/
├── back/                 # Backend (JSON Server)
│   └── db.json          # Base de données
├── front/pokedextop/    # Frontend (Angular)
│   ├── src/
│   │   └── app/
│   │       ├── auth.ts                  # Service d'authentification
│   │       ├── pokemon-service.ts       # Service des Pokémons
│   │       ├── user-pokemon.service.ts  # Service de collection
│   │       ├── pokedex/                 # Page Ma Collection
│   │       ├── pokemon/                 # Page Catalogue
│   │       └── login/                   # Page Connexion
│   └── package.json
└── README.md
```

---

## 🔐 Sécurité

- Chaque utilisateur ne peut voir et modifier que sa propre collection
- Les données sont stockées de manière isolée par utilisateur
- Authentification par token JWT

---

## 💡 Technologies utilisées

- **Frontend** : Angular 21, TypeScript, Bootstrap 5
- **Backend** : JSON Server (REST API)
- **Database** : JSON (db.json)

---

## ❓ Besoin d'aide ?

Consultez la documentation officielle :
- [Angular CLI](https://angular.dev/tools/cli)
- [JSON Server](https://github.com/typicode/json-server)

---

**Amusez-vous bien avec votre collection Pokémon ! 🎮**
