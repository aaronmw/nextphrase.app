import { PhraseList, phrases } from '@/app/phrases'

export interface AppState {
  enabledPhraseLists: PhraseList[]
  viewedPhraseIndices: number[]
}

export type AppAction = {
  type: 'FACTORY_RESET'
}

export const initialState: AppState = {
  enabledPhraseLists: Object.keys(phrases) as PhraseList[],
  viewedPhraseIndices: [],
}

export function AppReducer(state: AppState, action: AppAction) {
  switch (action.type) {
    case 'FACTORY_RESET':
      return {
        ...initialState,
      }

    default:
      return state
  }
}
