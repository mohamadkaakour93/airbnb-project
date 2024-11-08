Airbnb Project
Description

Ce projet est une application web de location de logements inspirée d'Airbnb, développée pour permettre aux utilisateurs de rechercher, réserver et gérer des locations de logements. Elle utilise une architecture MEAN (MongoDB, Express, Angular, Node.js) avec une géolocalisation, une recherche multicritères, et une authentification sécurisée par JWT.
Structure du projet

Le projet est organisé en deux dossiers principaux :

    airbnb-frontend : Contient le code pour le frontend, construit avec Angular, pour une interface utilisateur intuitive.
    airbnb-backend : Contient le code pour le backend, construit avec Node.js et Express, pour gérer la logique métier et les API RESTful.

Fonctionnalités principales

    Recherche multicritères : Les utilisateurs peuvent rechercher des logements selon des critères comme le lieu, le prix, et le type de logement.
    Géolocalisation : Affiche la localisation des logements sur une carte.
    Authentification JWT : Utilise des tokens JWT stockés dans localStorage pour authentifier les utilisateurs de manière sécurisée.
    Gestion des tokens : Les tokens JWT sont gérés via localStorage pour maintenir les sessions.

Comptes de test

Pour tester l'application, vous pouvez utiliser les comptes suivants :

    Utilisateur :
        Email : test1@gmail.com
        Mot de passe : motdepasse

    Loueur :
        Email : lo@gmail.com
        Mot de passe : motdepasse

  Installation locale

  1- Clonez le dépôt :
    git clone https://github.com/mohamadkaakour93/airbnb-project.git
    cd airbnb-project
  2-Frontend :
    cd airbnb-frontend
    npm install

  3- Backend :
     cd ../airbnb-backend
     npm install

  4- Lancement du projet :
     Frontend : Utilisez ng serve pour démarrer le frontend.
     Backend : Utilisez nodemon pour démarrer le backend.

  Outils utilisés

    MongoDB pour la base de données
    Express pour le serveur backend
    Angular pour le frontend
    Node.js pour la logique serveur





     

