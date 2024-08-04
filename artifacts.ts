//////////////////////
//
// For artifact calculations only
//
//////////////////////

import * as saveTypes from "./saveTypes"

// See https://github.com/elgranjero/EggIncProtos/tree/main/docs#artifactspecname 
// for which id's correspond with what
export const EB_ARTFIACT_IDS : {[key : number] : string} = {
    10 : "Book of Basan",
    34 : "Soul Stone",
    39 : "Prophecy Stone"
}

export const BOOK_EFFECT : {[key : number] : {[key : number] : number}} = {
    0 : {0 : 0.0025},
    1 : {0 : 0.005},
    2 : {0 : 0.0075, 2 : 0.008},
    3 : {0 : 0.01, 2 : 0.011, 3 : 0.012}
} 

export const PROP_EFFECT : {[key : number] : number} = {
    0 : 0.0005,
    1 : 0.001,
    2 : 0.0015
}

export const SOUL_EFFECT : {[key : number] : number} = {
    0 : 0.05,
    1 : 0.1,
    2 : 0.25
}
