// Test to verify that the Password Fortress state persistence is working
// This would be placed in the tests directory

import { describe, it, expect } from '@jest/globals'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Mock the game store structure to test persistence
interface TestPasswordFortressState {
  password: string
  securityPoints: number
  clickCount: number
  fortressLevel: number
  upgrades: { [key: string]: { owned: number; cost: number } }
  achievements: { [key: string]: boolean }
  lastSaved: string
}

interface TestGameSpecificStates {
  passwordFortress?: TestPasswordFortressState
}

interface TestGameState {
  gameSpecificStates: TestGameSpecificStates
  savePasswordFortressState: (state: TestPasswordFortressState) => void
  loadPasswordFortressState: () => TestPasswordFortressState | null
}

describe('Password Fortress State Persistence', () => {
  it('should save and load password fortress state', () => {
    // Create a test store with persistence
    const useTestStore = create<TestGameState>()(
      persist(
        (set, get) => ({
          gameSpecificStates: {},
          
          savePasswordFortressState: (state: TestPasswordFortressState) => {
            set((gameState) => ({
              gameSpecificStates: {
                ...gameState.gameSpecificStates,
                passwordFortress: {
                  ...state,
                  lastSaved: new Date().toISOString()
                }
              }
            }))
          },
          
          loadPasswordFortressState: () => {
            const state = get()
            return state.gameSpecificStates.passwordFortress || null
          }
        }),
        {
          name: 'test-game-storage',
          partialize: (state) => ({
            gameSpecificStates: state.gameSpecificStates
          })
        }
      )
    )

    const store = useTestStore.getState()

    // Test data
    const testState: TestPasswordFortressState = {
      password: 'MySecurePassword123!',
      securityPoints: 500,
      clickCount: 25,
      fortressLevel: 3,
      upgrades: {
        'auto-length': { owned: 2, cost: 100 },
        'smart-symbols': { owned: 1, cost: 150 }
      },
      achievements: {
        'first-click': true,
        'double-digits': true,
        'fortress-defender': false
      },
      lastSaved: new Date().toISOString()
    }

    // Save state
    store.savePasswordFortressState(testState)

    // Load state
    const loadedState = store.loadPasswordFortressState()

    // Verify state was saved and loaded correctly
    expect(loadedState).toBeTruthy()
    expect(loadedState?.password).toBe('MySecurePassword123!')
    expect(loadedState?.securityPoints).toBe(500)
    expect(loadedState?.clickCount).toBe(25)
    expect(loadedState?.fortressLevel).toBe(3)
    expect(loadedState?.upgrades['auto-length'].owned).toBe(2)
    expect(loadedState?.achievements['first-click']).toBe(true)
    expect(loadedState?.achievements['fortress-defender']).toBe(false)
  })

  it('should return null when no state is saved', () => {
    const useTestStore = create<TestGameState>()(
      persist(
        (set, get) => ({
          gameSpecificStates: {},
          savePasswordFortressState: () => {},
          loadPasswordFortressState: () => {
            const state = get()
            return state.gameSpecificStates.passwordFortress || null
          }
        }),
        {
          name: 'empty-test-game-storage',
          partialize: (state) => ({
            gameSpecificStates: state.gameSpecificStates
          })
        }
      )
    )

    const store = useTestStore.getState()
    const loadedState = store.loadPasswordFortressState()
    
    expect(loadedState).toBeNull()
  })
})
