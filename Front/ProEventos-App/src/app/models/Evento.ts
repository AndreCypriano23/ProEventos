import { Lote } from "./Lote";
import { Palestrante } from "./Palestrante";
import { RedeSocial } from "./RedeSocial";

export interface Evento {

    //Vamos utilizar agora os multiplos cursores para montar a interface evento do Angular
    id: number; 
        
    local: string;

    dataEvento?: Date; 

    tema: string;

    qtdPessoas: number; 

    imagemURL: string; 

    telefone: string; 

    email: string;

    lotes: Lote[]; 
    
    redesSociais: RedeSocial[]; 

    palestranteEventos: Palestrante[];

}