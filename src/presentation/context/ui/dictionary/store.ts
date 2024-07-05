import { LoadAllDictionary } from '@/domain'
import { create } from 'zustand'

export const dictionaryStore = create<{ dictionary: LoadAllDictionary.Model | null }>(() => ({
  dictionary: null,
}))