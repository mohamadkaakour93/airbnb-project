// src/app/models/bien.model.ts

import { User } from "./user.model";

export interface BienCreation {
    idBien?: string;
    emailProprietaire: string;
    commune: string;
    rue: string;
    codePostal: string;
    nombreCouchages: number;
    nombreChambres: number;
    distanceCentreVille: number;
    prix: number;
    imageUrl?: string;
  }
  
  export interface Bien extends BienCreation {
    _id: string;
    avis?: Avis[];
  }

 

  export interface Avis {
    note: number;
    commentaire: string;
    date: Date;
    utilisateur: string;
  }
  