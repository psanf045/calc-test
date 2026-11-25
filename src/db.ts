import Dexie, { type EntityTable } from 'dexie'

// Banco simples no próprio navegador (IndexedDB), sem servidor.
export interface Calculo {
  id: number
  expressao: string
  resultado: string
  criadoEm: Date
}

export const db = new Dexie('calculadora') as Dexie & {
  calculos: EntityTable<Calculo, 'id'>
}

db.version(1).stores({
  calculos: '++id, criadoEm',
})
