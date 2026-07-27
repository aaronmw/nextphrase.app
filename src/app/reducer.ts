import { Tables } from '@/app/database.types'
import clamp from 'lodash/clamp'
import last from 'lodash/last'
import random from 'lodash/random'
import sample from 'lodash/sample'
import without from 'lodash/without'

export enum AppScreen {
  Options = 'options',
  MainMenu = 'mainMenu',
  Instructions = 'instructions',
  Scoring = 'scoring',
  Guessing = 'guessing',
  Winners = 'winners',
}

export const HEARTS_PER_TEAM = 7

export const DEFAULT_ROUND_DURATION_MIN =
  process.env.NODE_ENV === 'development' ? 3 : 45
export const DEFAULT_ROUND_DURATION_MAX =
  process.env.NODE_ENV === 'development' ? 5 : 60
export const ROUND_DURATION_MULTIPLIERS = [0.5, 1, 2] as const

export type RoundDurationMultiplier =
  (typeof ROUND_DURATION_MULTIPLIERS)[number]

export interface AppState {
  activeScreen: AppScreen
  activeTeamInRound: 'A' | 'B'
  categoriesById: Record<
    Tables<'categories'>['id'],
    Tables<'categories'> & {
      phrases: Tables<'phrases'>[]
    }
  >
  countdownEnabled: boolean
  currentPhraseId: Tables<'phrases'>['id'] | null
  currentRoundStartTime: number | null
  currentRoundAccelerationStartTime: number | null
  currentRoundEndTime: number | null
  disabledCategoryIds: string[]
  freezeDuration: number
  heartsRemainingForTeamA: number
  heartsRemainingForTeamB: number
  isNewGame: boolean
  phrasesById: Map<string, string>
  tickRate: number
  acceleratedTickRate: number
  roundDurationMultiplier: RoundDurationMultiplier
  roundDurationMin: number
  roundDurationMax: number
  accelerationDurationMin: number
  accelerationDurationMax: number
  rotateScreen: boolean
  viewedPhraseIds: Tables<'phrases'>['id'][]
}

export const initialState: AppState = {
  activeScreen: AppScreen.MainMenu,
  activeTeamInRound: 'A',
  categoriesById: {},
  countdownEnabled: true,
  currentPhraseId: null,
  currentRoundStartTime: null,
  currentRoundAccelerationStartTime: null,
  currentRoundEndTime: null,
  disabledCategoryIds: [],
  freezeDuration: 3000,
  heartsRemainingForTeamA: HEARTS_PER_TEAM,
  heartsRemainingForTeamB: HEARTS_PER_TEAM,
  isNewGame: true,
  phrasesById: new Map(),
  tickRate: 1,
  acceleratedTickRate: 0.5,
  roundDurationMultiplier: 1,
  roundDurationMin: DEFAULT_ROUND_DURATION_MIN,
  roundDurationMax: DEFAULT_ROUND_DURATION_MAX,
  accelerationDurationMin: process.env.NODE_ENV === 'development' ? 2 : 10,
  accelerationDurationMax: process.env.NODE_ENV === 'development' ? 3 : 15,
  rotateScreen: false,
  viewedPhraseIds: [],
}

export const persistedStateKeys: (keyof AppState)[] = [
  'activeScreen',
  'activeTeamInRound',
  'countdownEnabled',
  'currentPhraseId',
  'currentRoundStartTime',
  'currentRoundAccelerationStartTime',
  'currentRoundEndTime',
  'disabledCategoryIds',
  'heartsRemainingForTeamA',
  'heartsRemainingForTeamB',
  'isNewGame',
  'rotateScreen',
  'roundDurationMultiplier',
  'roundDurationMin',
  'roundDurationMax',
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
  | { type: 'TOGGLE_ACTIVE_TEAM' }
  | { type: 'SET_ACTIVE_TEAM'; team: 'A' | 'B' }
  | { type: 'ADD_HEART'; team: 'A' | 'B' }
  | { type: 'SUBTRACT_HEART'; team: 'A' | 'B' }
  | { type: 'END_GAME' }
  | { type: 'ENABLE_CATEGORY_ID'; categoryId: string }
  | { type: 'DISABLE_CATEGORY_ID'; categoryId: string }
  | { type: 'SET_COUNTDOWN_ENABLED'; countdownEnabled: boolean }
  | { type: 'SET_ROTATE_SCREEN'; rotateScreen: boolean }
  | {
      type: 'SET_ROUND_DURATION_MULTIPLIER'
      roundDurationMultiplier: RoundDurationMultiplier
    }
  | { type: 'SET_HEARTS'; heartsA: number; heartsB: number }
  | {
      type: 'SET_ROUND_DURATION'
      roundDurationMin: number
      roundDurationMax: number
    }
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
        activeTeamInRound: 'A',
        currentPhraseId: null,
        currentRoundAccelerationStartTime: null,
        currentRoundEndTime: null,
        currentRoundStartTime: null,
        heartsRemainingForTeamA: HEARTS_PER_TEAM,
        heartsRemainingForTeamB: HEARTS_PER_TEAM,
        isNewGame: true,
      }
      break

    case 'START_ROUND':
      const now = Date.now()
      const {
        roundDurationMin,
        roundDurationMax,
        roundDurationMultiplier,
        accelerationDurationMin,
        accelerationDurationMax,
      } = state
      const roundDuration =
        random(roundDurationMin, roundDurationMax) *
        roundDurationMultiplier *
        1000
      const accelerationDuration =
        random(accelerationDurationMin, accelerationDurationMax) *
        roundDurationMultiplier *
        1000

      newState = appStateReducer(
        {
          ...state,
          activeScreen: AppScreen.Guessing,
          currentRoundStartTime: now,
          currentRoundAccelerationStartTime: now + roundDuration,
          currentRoundEndTime: now + roundDuration + accelerationDuration,
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
      }
      break

    case 'END_ROUND': {
      const losingTeam = state.activeTeamInRound
      const winningTeam = losingTeam === 'A' ? 'B' : 'A'
      const propName =
        losingTeam === 'A'
          ? 'heartsRemainingForTeamA'
          : 'heartsRemainingForTeamB'
      const currentHearts = state[propName]
      const newHearts = Math.max(0, currentHearts - 1)
      const isGameOver = newHearts === 0
      newState = {
        ...state,
        activeScreen: AppScreen.Scoring,
        activeTeamInRound: isGameOver ? winningTeam : state.activeTeamInRound,
        currentRoundStartTime: null,
        currentRoundAccelerationStartTime: null,
        currentRoundEndTime: null,
        isNewGame: false,
        [propName]: newHearts,
      }
      break
    }

    case 'TOGGLE_ACTIVE_TEAM':
      newState = {
        ...state,
        activeTeamInRound: state.activeTeamInRound === 'A' ? 'B' : 'A',
      }
      break

    case 'SET_ACTIVE_TEAM':
      newState = {
        ...state,
        activeTeamInRound: action.team,
      }
      break

    case 'NEXT_PHRASE': {
      const allPhrases = Object.values(state.categoriesById).flatMap(
        category => category.phrases,
      )
      const disabledCategoryIds = new Set(state.disabledCategoryIds)
      const viewedPhraseIds = new Set(state.viewedPhraseIds)
      const enabledPhrases = allPhrases.filter(
        phrase => !disabledCategoryIds.has(phrase.category_id),
      )
      const unviewedPhrases = enabledPhrases.filter(
        phrase => !viewedPhraseIds.has(phrase.id),
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

    case 'SUBTRACT_HEART':
    case 'ADD_HEART': {
      const propName = `heartsRemainingForTeam${action.team}` as const
      const currentHearts = state[propName]
      const newHearts =
        action.type === 'ADD_HEART' ? currentHearts + 1 : currentHearts - 1
      const clampedHearts = clamp(newHearts, 0, HEARTS_PER_TEAM)
      const isGameOver = action.type === 'SUBTRACT_HEART' && clampedHearts === 0
      const winningTeam = action.team === 'A' ? 'B' : 'A'

      newState = {
        ...state,
        isNewGame: false,
        activeScreen: isGameOver ? AppScreen.Scoring : state.activeScreen,
        activeTeamInRound: isGameOver ? winningTeam : state.activeTeamInRound,
        [propName]: clampedHearts,
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

    case 'SET_ROTATE_SCREEN': {
      newState = {
        ...state,
        rotateScreen: action.rotateScreen,
      }
      break
    }

    case 'SET_COUNTDOWN_ENABLED': {
      newState = {
        ...state,
        countdownEnabled: action.countdownEnabled,
      }
      break
    }

    case 'SET_ROUND_DURATION_MULTIPLIER': {
      newState = {
        ...state,
        roundDurationMultiplier: action.roundDurationMultiplier,
      }
      break
    }

    case 'SET_HEARTS': {
      const heartsA = clamp(action.heartsA, 0, HEARTS_PER_TEAM)
      const heartsB = clamp(action.heartsB, 0, HEARTS_PER_TEAM)
      const isGameOver = heartsA === 0 || heartsB === 0
      const winningTeam = heartsA === 0 ? 'B' : 'A'
      newState = {
        ...state,
        isNewGame: false,
        heartsRemainingForTeamA: heartsA,
        heartsRemainingForTeamB: heartsB,
        activeScreen: isGameOver ? AppScreen.Scoring : state.activeScreen,
        activeTeamInRound: isGameOver ? winningTeam : state.activeTeamInRound,
        currentRoundStartTime: null,
        currentRoundAccelerationStartTime: null,
        currentRoundEndTime: null,
      }
      break
    }

    case 'SET_ROUND_DURATION': {
      const roundDurationMin = clamp(action.roundDurationMin, 1, 300)
      const roundDurationMax = clamp(
        Math.max(action.roundDurationMax, roundDurationMin),
        1,
        300,
      )
      newState = {
        ...state,
        roundDurationMultiplier: 1,
        roundDurationMin,
        roundDurationMax,
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
    newState.activeScreen = AppScreen.MainMenu
  }

  // console.log('Action:', action)
  // console.log('Previous State:', state)
  // console.log('New State:', newState)

  return newState
}
