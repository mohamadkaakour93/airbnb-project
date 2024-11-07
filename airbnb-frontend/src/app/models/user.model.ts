export interface User {
    _id: string;
    email: string;
    prenom: string;
    nom: string;
    telephone: string;
    role: 'user' | 'loueur';
  }
  