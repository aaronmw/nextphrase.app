import { Tables } from '@/app/database.types'
import { clamp, last, random, sample, without } from 'lodash'

export enum AppScreen {
  Options = 'options',
  Intro = 'intro',
  Scoring = 'scoring',
  Guessing = 'guessing',
  Winners = 'winners',
}

export interface AppState {
  activeScreen: AppScreen
  categoriesById: Record<
    Tables<'categories'>['id'],
    Tables<'categories'> & {
      phrases: Tables<'phrases'>[]
    }
  >
  currentPhraseId: Tables<'phrases'>['id'] | null
  currentRoundStartTime: number | null
  currentRoundAccelerationStartTime: number | null
  currentRoundEndTime: number | null
  disabledCategoryIds: string[]
  freezeDuration: number
  isNewGame: boolean
  isRoundOver: boolean
  phrasesById: Map<string, string>
  pointsForTeamA: number
  pointsForTeamB: number
  pointsToWin: number
  tickRate: number
  acceleratedTickRate: number
  roundDurationMin: number
  roundDurationMax: number
  accelerationDurationMin: number
  accelerationDurationMax: number
  viewedPhraseIds: Tables<'phrases'>['id'][]
}

export const initialState: AppState = {
  activeScreen: AppScreen.Intro,
  categoriesById: {},
  currentPhraseId: null,
  currentRoundStartTime: null,
  currentRoundAccelerationStartTime: null,
  currentRoundEndTime: null,
  disabledCategoryIds: [],
  freezeDuration: 3000,
  isNewGame: true,
  isRoundOver: false,
  phrasesById: new Map(),
  pointsForTeamA: 0,
  pointsForTeamB: 0,
  pointsToWin: 7,
  tickRate: 1,
  acceleratedTickRate: 0.5,
  roundDurationMin: process.env.NODE_ENV === 'development' ? 3 : 45,
  roundDurationMax: process.env.NODE_ENV === 'development' ? 5 : 60,
  accelerationDurationMin: process.env.NODE_ENV === 'development' ? 2 : 10,
  accelerationDurationMax: process.env.NODE_ENV === 'development' ? 3 : 15,
  viewedPhraseIds: [],
}

export const persistedStateKeys: (keyof AppState)[] = [
  'activeScreen',
  'currentPhraseId',
  'currentRoundStartTime',
  'currentRoundAccelerationStartTime',
  'currentRoundEndTime',
  'disabledCategoryIds',
  'isNewGame',
  'isRoundOver',
  'pointsForTeamA',
  'pointsForTeamB',
  'pointsToWin',
  'viewedPhraseIds',
] as (keyof AppState)[]

export type AppAction =
  | {
      type: 'SET_PHRASES_AND_CATEGORIES'
      categoriesById: AppState['categoriesById']
    }
  | { type: 'SET_ACTIVE_SCREEN'; screen: AppState['activeScreen'] }
  | { type: 'NEW_GAME' }
  | { type: 'START_ROUND' }
  | { type: 'NEXT_PHRASE' }
  | { type: 'PREVIOUS_PHRASE' }
  | { type: 'ACCELERATE_ROUND' }
  | { type: 'END_ROUND' }
  | { type: 'ABORT_ROUND' }
  | { type: 'ADD_POINT'; team: 'A' | 'B' }
  | { type: 'SUBTRACT_POINT'; team: 'A' | 'B' }
  | { type: 'END_GAME' }
  | { type: 'ENABLE_CATEGORY_ID'; categoryId: string }
  | { type: 'DISABLE_CATEGORY_ID'; categoryId: string }
  | { type: 'FACTORY_RESET' }

export function appStateReducer(state: AppState, action: AppAction): AppState {
  let newState: AppState

  switch (action.type) {
    case 'SET_PHRASES_AND_CATEGORIES':
      newState = {
        ...state,
        categoriesById: action.categoriesById,
        phrasesById: new Map(
          Object.values(action.categoriesById).flatMap(category =>
            category.phrases.map(phrase => [phrase.id, phrase.phrase]),
          ),
        ),
      }
      break

    case 'END_GAME':
      newState = {
        ...state,
        activeScreen: AppScreen.Winners,
      }
      break

    case 'NEW_GAME':
      newState = {
        ...state,
        activeScreen: AppScreen.Scoring,
        isNewGame: true,
        isRoundOver: false,
        pointsForTeamA: 0,
        pointsForTeamB: 0,
      }
      break

    case 'START_ROUND':
      const now = Date.now()
      const {
        roundDurationMin,
        roundDurationMax,
        accelerationDurationMin,
        accelerationDurationMax,
      } = state
      const roundDuration = random(roundDurationMin, roundDurationMax) * 1000
      const accelerationDuration =
        random(accelerationDurationMin, accelerationDurationMax) * 1000

      newState = appStateReducer(
        {
          ...state,
          activeScreen: AppScreen.Guessing,
          currentRoundStartTime: now,
          currentRoundAccelerationStartTime: now + roundDuration,
          currentRoundEndTime: now + roundDuration + accelerationDuration,
          isRoundOver: false,
        },
        { type: 'NEXT_PHRASE' },
      )
      break

    case 'ABORT_ROUND':
      newState = {
        ...state,
        activeScreen: AppScreen.Scoring,
        currentRoundStartTime: null,
        currentRoundAccelerationStartTime: null,
        currentRoundEndTime: null,
        isRoundOver: false,
      }
      break

    case 'END_ROUND':
      newState = {
        ...state,
        activeScreen: AppScreen.Scoring,
        currentRoundStartTime: null,
        currentRoundAccelerationStartTime: null,
        currentRoundEndTime: null,
        isRoundOver: true,
      }
      break

    case 'NEXT_PHRASE': {
      const allPhrases = Object.values(state.categoriesById).flatMap(
        category => category.phrases,
      )
      const enabledPhrases = allPhrases.filter(
        phrase => !state.disabledCategoryIds.includes(phrase.category_id),
      )
      const unviewedPhrases = enabledPhrases.filter(
        phrase => !state.viewedPhraseIds.includes(phrase.id),
      )
      const eligiblePhrases =
        unviewedPhrases.length > 0 ? unviewedPhrases : enabledPhrases
      const currentPhrase = sample(eligiblePhrases)!

      newState = {
        ...state,
        currentPhraseId: currentPhrase.id,
        viewedPhraseIds:
          unviewedPhrases.length > 0
            ? [...state.viewedPhraseIds, currentPhrase.id]
            : [currentPhrase.id],
      }
      break
    }

    case 'PREVIOUS_PHRASE': {
      newState = {
        ...state,
        currentPhraseId: last(state.viewedPhraseIds) ?? null,
      }
      break
    }

    case 'SUBTRACT_POINT':
    case 'ADD_POINT': {
      const propName = `pointsForTeam${action.team}` as const
      const currentPoints = state[propName]
      const newPoints =
        action.type === 'ADD_POINT' ? currentPoints + 1 : currentPoints - 1

      newState = {
        ...state,
        isNewGame: false,
        isRoundOver: false,
        [propName]: clamp(newPoints, 0, state.pointsToWin),
      }
      break
    }

    case 'SET_ACTIVE_SCREEN': {
      newState = {
        ...state,
        activeScreen: action.screen,
      }
      break
    }

    case 'FACTORY_RESET':
      newState = initialState
      break

    case 'ENABLE_CATEGORY_ID':
    case 'DISABLE_CATEGORY_ID': {
      const shouldEnable = action.type === 'ENABLE_CATEGORY_ID'
      const isAlreadyInList = state.disabledCategoryIds.includes(
        action.categoryId,
      )

      // Check if we're trying to disable the last possible category
      const isLastCategory =
        !shouldEnable &&
        state.disabledCategoryIds.length ===
          Object.keys(state.categoriesById).length - 1

      if (isLastCategory) {
        newState = state
      } else {
        const updatedList = shouldEnable
          ? without(state.disabledCategoryIds, action.categoryId)
          : isAlreadyInList
            ? state.disabledCategoryIds
            : [...state.disabledCategoryIds, action.categoryId]

        newState = {
          ...state,
          disabledCategoryIds: updatedList,
        }
      }
      break
    }

    default:
      newState = state
  }

  if (
    newState.activeScreen &&
    !Object.values(AppScreen).includes(newState.activeScreen)
  ) {
    newState.activeScreen = AppScreen.Intro
  }

  // console.log('Action:', action)
  // console.log('Previous State:', state)
  // console.log('New State:', newState)

  return newState
}
