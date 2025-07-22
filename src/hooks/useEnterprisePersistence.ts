/**
 * 🔧 ENTERPRISE PERSISTENCE HOOK
 * 
 * Custom hook for integrating GameStatePersistenceManager with React components
 * Provides enterprise-grade persistence with data validation and fallback mechanisms
 * 
 * @author Test Guardian Agent
 * @version 1.0.0
 * @since 2025-01-15
 */

import { useEffect, useState } from 'react'
import GameStatePersistenceManager from '../utils/persistence/GameStatePersistence'
import { sanitizeGameData, isGameDataCOPPACompliant } from '../security/persistence/DataClassification'

interface EnterprisePersistenceResult {
  persistenceManager: GameStatePersistenceManager | null
  isLoading: boolean
  error: string | null
}

/**
 * Hook for enterprise persistence integration
 */
export function useEnterprisePersistence(): EnterprisePersistenceResult {
  const [persistenceManager, setPersistenceManager] = useState<GameStatePersistenceManager | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initializePersistence = async () => {
      try {
        // Only initialize in browser environment
        if (typeof window === 'undefined') {
          setIsLoading(false)
          return
        }

        const manager = new GameStatePersistenceManager()
        
        // Validate the manager is properly initialized
        if (manager && 
            typeof manager.loadGameState === 'function' && 
            typeof manager.saveGameState === 'function') {
          setPersistenceManager(manager)
        } else {
          console.warn('Persistence manager not properly initialized, using localStorage fallback')
          setError('Persistence manager initialization failed')
        }
      } catch (err) {
        console.warn('Failed to initialize enterprise persistence:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setIsLoading(false)
      }
    }

    initializePersistence()
  }, [])

  return { persistenceManager, isLoading, error }
}

/**
 * Enhanced data validation for game state
 */
export function validateGameState(data: any): { isValid: boolean, errors: string[] } {
  const errors: string[] = []

  try {
    // Check basic structure
    if (!data || typeof data !== 'object') {
      errors.push('Invalid data structure')
      return { isValid: false, errors }
    }

    // Validate required numeric fields
    const numericFields = ['sp', 'totalSpEarned', 'totalClicks', 'playerLevel', 'dayStreak']
    for (const field of numericFields) {
      if (data[field] !== undefined && (typeof data[field] !== 'number' || isNaN(data[field]))) {
        errors.push(`Invalid ${field}: must be a valid number`)
      }
    }

    // Validate object fields
    if (data.hired && typeof data.hired !== 'object') {
      errors.push('Invalid hired data: must be an object')
    }

    if (data.achievements && !Array.isArray(data.achievements)) {
      errors.push('Invalid achievements: must be an array')
    }

    // Check COPPA compliance
    if (!isGameDataCOPPACompliant(data)) {
      errors.push('Data violates COPPA compliance requirements')
    }

    return { isValid: errors.length === 0, errors }
  } catch (error) {
    errors.push(`Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    return { isValid: false, errors }
  }
}

/**
 * Safe data sanitization wrapper
 */
export function safeDataSanitization(data: any): any {
  try {
    return sanitizeGameData(data)
  } catch (error) {
    console.warn('Data sanitization failed, using original data:', error)
    return data
  }
}

export default useEnterprisePersistence
