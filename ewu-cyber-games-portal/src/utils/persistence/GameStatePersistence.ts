/**
 * 🎮 GAME STATE PERSISTENCE ORCHESTRATOR
 * 
 * Hybrid persistence system combining localStorage, cookies, and memory storage
 * with enterprise-grade security, COPPA compliance, and performance optimization.
 * 
 * Architecture:
 * - Primary: localStorage (fast access, large capacity)
 * - Backup: Secure cookies (survives browser restart)
 * - Cache: Memory (ultra-fast access)
 * - Audit: Session storage (debugging and compliance)
 * 
 * Features:
 * - Automatic failover between storage mechanisms
 * - Real-time data classification and sanitization
 * - Performance optimization with intelligent caching
 * - Comprehensive audit logging
 * - COPPA/FERPA compliance validation
 * 
 * @author Feature Engineer Agent
 * @version 1.0.0
 * @since 2025-01-15
 */

import { SecureCookieManager } from './SecureCookieManager'
import { DataClassificationEngine, isGameDataCOPPACompliant, sanitizeGameData } from '../../security/persistence/DataClassification'

/**
 * 📊 STORAGE MECHANISM TYPES
 */
export enum StorageMechanism {
  MEMORY = 'memory',
  LOCAL_STORAGE = 'localStorage',
  COOKIES = 'cookies',
  SESSION_STORAGE = 'sessionStorage'
}

/**
 * 🎯 PERSISTENCE STRATEGY
 */
interface PersistenceStrategy {
  primary: StorageMechanism
  backup: StorageMechanism
  cache: StorageMechanism
  audit: StorageMechanism
}

/**
 * 📈 PERFORMANCE METRICS
 */
interface PerformanceMetrics {
  storageOperations: number
  averageWriteTime: number
  averageReadTime: number
  cacheHitRate: number
  failoverCount: number
  compressionRatio: number
  lastOptimization: string
}

/**
 * 🎮 GAME STATE STRUCTURE
 */
interface GameState {
  playerStats: {
    level: number
    totalXP: number
    gamesCompleted: number
    achievementsUnlocked: number
    streakDays: number
    lastVisit: string
    timeSpent: number
  }
  achievements: Array<{
    id: string
    title: string
    description: string
    icon: string
    unlockedAt?: string
    category: string
  }>
  gameProgress: Array<{
    gameId: string
    completed: boolean
    highScore: number
    timeSpent: number
    attempts: number
    hintsUsed: number
    completedAt?: string
  }>
  skillProgress: {
    cryptography: number
    passwordSecurity: number
    phishingDetection: number
    socialEngineering: number
    networkSecurity: number
    incidentResponse: number
  }
  preferences: {
    soundEnabled: boolean
    difficulty: string
    theme: string
  }
  sessionInfo: {
    sessionId: string
    startTime: string
    lastActivity: string
  }
}

/**
 * 🛡️ PERSISTENCE HEALTH STATUS
 */
interface PersistenceHealth {
  available: boolean
  secure: boolean
  compliant: boolean
  performance: {
    readLatency: number
    writeLatency: number
    storageSize: number
    errorRate: number
  }
  storage: {
    [key in StorageMechanism]: {
      available: boolean
      capacity: number
      used: number
      errors: number
    }
  }
}

/**
 * 🎮 GAME STATE PERSISTENCE MANAGER
 * 
 * Main orchestrator for all game state persistence operations
 */
export class GameStatePersistenceManager {
  private cookieManager: SecureCookieManager
  private classifier: DataClassificationEngine
  private memoryCache: Map<string, any> = new Map()
  private metrics: PerformanceMetrics
  private strategy: PersistenceStrategy
  private readonly STORAGE_KEY = 'ewu_cyber_games_state'
  private readonly CRITICAL_FIELDS = ['playerStats', 'achievements', 'gameProgress']
  
  constructor() {
    this.cookieManager = new SecureCookieManager({
      cookiePrefix: 'ewu_cyber_',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      secure: true,
      sameSite: 'strict'
    })
    
    this.classifier = new DataClassificationEngine()
    
    this.strategy = {
      primary: StorageMechanism.LOCAL_STORAGE,
      backup: StorageMechanism.COOKIES,
      cache: StorageMechanism.MEMORY,
      audit: StorageMechanism.SESSION_STORAGE
    }
    
    this.metrics = {
      storageOperations: 0,
      averageWriteTime: 0,
      averageReadTime: 0,
      cacheHitRate: 0,
      failoverCount: 0,
      compressionRatio: 1.0,
      lastOptimization: new Date().toISOString()
    }
    
    this.initializeStorage()
  }
  
  /**
   * 💾 SAVE GAME STATE
   * 
   * Orchestrates saving game state across all storage mechanisms with security validation
   */
  async saveGameState(gameState: Partial<GameState>): Promise<{
    success: boolean
    mechanisms: StorageMechanism[]
    warnings: string[]
    performance: {
      writeTime: number
      compressionAchieved: number
    }
  }> {
    const startTime = performance.now()
    const savedMechanisms: StorageMechanism[] = []
    const warnings: string[] = []
    
    try {
      // 🔍 Validate COPPA compliance
      if (!isGameDataCOPPACompliant(gameState)) {
        throw new Error('Game state violates COPPA compliance requirements')
      }
      
      // 🧹 Sanitize data for storage
      const sanitizedState = sanitizeGameData(gameState)
      
      // 📊 Add metadata
      const enrichedState = {
        ...sanitizedState,
        _metadata: {
          savedAt: new Date().toISOString(),
          version: '1.0.0',
          mechanism: 'hybrid',
          compressed: false
        }
      }
      
      // 💾 Save to memory cache (fastest)
      this.saveToMemory(enrichedState)
      savedMechanisms.push(StorageMechanism.MEMORY)
      
      // 💾 Save to primary storage (localStorage)
      const primarySuccess = await this.saveToPrimaryStorage(enrichedState)
      if (primarySuccess) {
        savedMechanisms.push(this.strategy.primary)
      } else {
        warnings.push('Primary storage failed, using backup')
        this.metrics.failoverCount++
      }
      
      // 🍪 Save critical data to cookies (backup)
      const criticalData = this.extractCriticalData(enrichedState)
      const cookieSuccess = await this.saveToBackupStorage(criticalData)
      if (cookieSuccess) {
        savedMechanisms.push(this.strategy.backup)
      } else {
        warnings.push('Backup storage failed')
      }
      
      // 📋 Save audit trail
      this.saveAuditTrail('SAVE_GAME_STATE', {
        mechanisms: savedMechanisms,
        dataSize: JSON.stringify(enrichedState).length,
        sanitized: true
      })
      
      const writeTime = performance.now() - startTime
      this.updatePerformanceMetrics('write', writeTime)
      
      return {
        success: savedMechanisms.length > 0,
        mechanisms: savedMechanisms,
        warnings,
        performance: {
          writeTime,
          compressionAchieved: this.calculateCompressionRatio(gameState, enrichedState)
        }
      }
      
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error)
      this.saveAuditTrail('SAVE_GAME_STATE_ERROR', { error: errorMsg })
      
      return {
        success: false,
        mechanisms: savedMechanisms,
        warnings: [errorMsg],
        performance: {
          writeTime: performance.now() - startTime,
          compressionAchieved: 0
        }
      }
    }
  }
  
  /**
   * 📁 LOAD GAME STATE
   * 
   * Orchestrates loading game state with intelligent fallback mechanisms
   */
  async loadGameState(): Promise<{
    gameState: GameState | null
    source: StorageMechanism
    performance: {
      readTime: number
      cacheHit: boolean
    }
    warnings: string[]
  }> {
    const startTime = performance.now()
    let warnings: string[] = []
    
    try {
      // 🚀 Try memory cache first (fastest)
      const memoryState = this.loadFromMemory()
      if (memoryState) {
        this.metrics.cacheHitRate = (this.metrics.cacheHitRate + 1) / 2 // Running average
        return {
          gameState: memoryState,
          source: StorageMechanism.MEMORY,
          performance: {
            readTime: performance.now() - startTime,
            cacheHit: true
          },
          warnings
        }
      }
      
      // 💾 Try primary storage (localStorage)
      const primaryState = await this.loadFromPrimaryStorage()
      if (primaryState) {
        // Cache for next time
        this.saveToMemory(primaryState)
        
        return {
          gameState: primaryState,
          source: this.strategy.primary,
          performance: {
            readTime: performance.now() - startTime,
            cacheHit: false
          },
          warnings
        }
      }
      
      warnings.push('Primary storage unavailable, using backup')
      this.metrics.failoverCount++
      
      // 🍪 Try backup storage (cookies)
      const backupState = await this.loadFromBackupStorage()
      if (backupState) {
        // Restore to primary storage
        await this.saveToPrimaryStorage(backupState)
        this.saveToMemory(backupState)
        
        warnings.push('Data restored from backup storage')
        
        return {
          gameState: backupState,
          source: this.strategy.backup,
          performance: {
            readTime: performance.now() - startTime,
            cacheHit: false
          },
          warnings
        }
      }
      
      warnings.push('No stored game state found')
      
      return {
        gameState: null,
        source: StorageMechanism.MEMORY,
        performance: {
          readTime: performance.now() - startTime,
          cacheHit: false
        },
        warnings
      }
      
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error)
      this.saveAuditTrail('LOAD_GAME_STATE_ERROR', { error: errorMsg })
      
      return {
        gameState: null,
        source: StorageMechanism.MEMORY,
        performance: {
          readTime: performance.now() - startTime,
          cacheHit: false
        },
        warnings: [errorMsg]
      }
    } finally {
      this.updatePerformanceMetrics('read', performance.now() - startTime)
    }
  }
  
  /**
   * 🧹 CLEAR ALL GAME STATE
   * 
   * Securely removes all stored game state data
   */
  async clearGameState(): Promise<{
    success: boolean
    clearedMechanisms: StorageMechanism[]
    warnings: string[]
  }> {
    const clearedMechanisms: StorageMechanism[] = []
    const warnings: string[] = []
    
    try {
      // Clear memory cache
      this.memoryCache.clear()
      clearedMechanisms.push(StorageMechanism.MEMORY)
      
      // Clear localStorage
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(this.STORAGE_KEY)
        clearedMechanisms.push(StorageMechanism.LOCAL_STORAGE)
      }
      
      // Clear cookies
      const cookieCleared = this.cookieManager.clearGameState()
      if (cookieCleared) {
        clearedMechanisms.push(StorageMechanism.COOKIES)
      }
      
      // Clear session storage audit trail
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.removeItem('game_audit_logs')
        clearedMechanisms.push(StorageMechanism.SESSION_STORAGE)
      }
      
      this.saveAuditTrail('CLEAR_GAME_STATE', {
        mechanisms: clearedMechanisms
      })
      
      return {
        success: clearedMechanisms.length > 0,
        clearedMechanisms,
        warnings
      }
      
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error)
      warnings.push(errorMsg)
      
      return {
        success: false,
        clearedMechanisms,
        warnings
      }
    }
  }
  
  /**
   * 🏥 HEALTH CHECK
   * 
   * Comprehensive health check of all persistence mechanisms
   */
  async healthCheck(): Promise<PersistenceHealth> {
    const health: PersistenceHealth = {
      available: false,
      secure: false,
      compliant: false,
      performance: {
        readLatency: 0,
        writeLatency: 0,
        storageSize: 0,
        errorRate: 0
      },
      storage: {
        [StorageMechanism.MEMORY]: { available: false, capacity: 0, used: 0, errors: 0 },
        [StorageMechanism.LOCAL_STORAGE]: { available: false, capacity: 0, used: 0, errors: 0 },
        [StorageMechanism.COOKIES]: { available: false, capacity: 0, used: 0, errors: 0 },
        [StorageMechanism.SESSION_STORAGE]: { available: false, capacity: 0, used: 0, errors: 0 }
      }
    }
    
    try {
      // Test memory storage
      health.storage.memory = {
        available: true,
        capacity: 50 * 1024 * 1024, // 50MB estimate
        used: this.calculateMemoryUsage(),
        errors: 0
      }
      
      // Test localStorage
      if (typeof localStorage !== 'undefined') {
        const testKey = 'health_test_' + Date.now()
        localStorage.setItem(testKey, 'test')
        localStorage.removeItem(testKey)
        
        health.storage.localStorage = {
          available: true,
          capacity: 10 * 1024 * 1024, // 10MB typical limit
          used: this.calculateLocalStorageUsage(),
          errors: 0
        }
      }
      
      // Test cookies
      const cookieHealth = await this.cookieManager.healthCheck()
      health.storage.cookies = {
        available: cookieHealth.available,
        capacity: 4096, // 4KB per cookie limit
        used: cookieHealth.performance.storageSize,
        errors: cookieHealth.available ? 0 : 1
      }
      
      // Test sessionStorage
      if (typeof sessionStorage !== 'undefined') {
        const testKey = 'health_test_' + Date.now()
        sessionStorage.setItem(testKey, 'test')
        sessionStorage.removeItem(testKey)
        
        health.storage.sessionStorage = {
          available: true,
          capacity: 10 * 1024 * 1024, // 10MB typical limit
          used: this.calculateSessionStorageUsage(),
          errors: 0
        }
      }
      
      // Calculate overall health
      const availableStorages = Object.values(health.storage).filter(s => s.available).length
      health.available = availableStorages >= 2 // Need at least 2 mechanisms
      health.secure = cookieHealth.secure
      health.compliant = cookieHealth.compliant
      
      health.performance = {
        readLatency: this.metrics.averageReadTime,
        writeLatency: this.metrics.averageWriteTime,
        storageSize: Object.values(health.storage).reduce((sum, s) => sum + s.used, 0),
        errorRate: this.calculateErrorRate()
      }
      
    } catch (error) {
      console.error('Health check failed:', error)
    }
    
    return health
  }
  
  /**
   * 📊 GET PERFORMANCE METRICS
   */
  getPerformanceMetrics(): PerformanceMetrics {
    return { ...this.metrics }
  }
  
  // 🔧 PRIVATE METHODS
  
  private async initializeStorage(): Promise<void> {
    try {
      // Verify all storage mechanisms
      await this.healthCheck()
      
      // Initialize session ID if not present
      if (!this.memoryCache.has('sessionId')) {
        const sessionId = 'session_' + Math.random().toString(36).substring(2, 15) + 
                         Math.random().toString(36).substring(2, 15)
        this.memoryCache.set('sessionId', sessionId)
      }
      
      this.saveAuditTrail('PERSISTENCE_INITIALIZED', {
        strategy: this.strategy,
        sessionId: this.memoryCache.get('sessionId')
      })
      
    } catch (error) {
      console.error('Failed to initialize storage:', error)
    }
  }
  
  private saveToMemory(data: any): boolean {
    try {
      this.memoryCache.set(this.STORAGE_KEY, data)
      return true
    } catch {
      return false
    }
  }
  
  private loadFromMemory(): any {
    try {
      return this.memoryCache.get(this.STORAGE_KEY) || null
    } catch {
      return null
    }
  }
  
  private async saveToPrimaryStorage(data: any): Promise<boolean> {
    try {
      if (typeof localStorage === 'undefined') return false
      
      const serialized = JSON.stringify(data)
      localStorage.setItem(this.STORAGE_KEY, serialized)
      return true
    } catch {
      return false
    }
  }
  
  private async loadFromPrimaryStorage(): Promise<any> {
    try {
      if (typeof localStorage === 'undefined') return null
      
      const serialized = localStorage.getItem(this.STORAGE_KEY)
      return serialized ? JSON.parse(serialized) : null
    } catch {
      return null
    }
  }
  
  private async saveToBackupStorage(data: any): Promise<boolean> {
    try {
      const gameStateCookie = this.convertToGameStateCookie(data)
      return await this.cookieManager.setGameState(gameStateCookie)
    } catch {
      return false
    }
  }
  
  private async loadFromBackupStorage(): Promise<any> {
    try {
      const cookieData = await this.cookieManager.getGameState()
      return cookieData ? this.convertFromGameStateCookie(cookieData) : null
    } catch {
      return null
    }
  }
  
  private extractCriticalData(gameState: any): any {
    const critical: any = {}
    
    for (const field of this.CRITICAL_FIELDS) {
      if (gameState[field]) {
        critical[field] = gameState[field]
      }
    }
    
    // Always include session info
    critical.sessionInfo = gameState.sessionInfo || {
      sessionId: this.memoryCache.get('sessionId'),
      startTime: new Date().toISOString(),
      lastActivity: new Date().toISOString()
    }
    
    return critical
  }
  
  private convertToGameStateCookie(data: any): any {
    return {
      playerLevel: data.playerStats?.level || 1,
      totalXP: data.playerStats?.totalXP || 0,
      achievementsCount: data.achievements?.length || 0,
      gamesCompleted: data.playerStats?.gamesCompleted || 0,
      sessionId: data.sessionInfo?.sessionId || this.memoryCache.get('sessionId'),
      lastGamePlayed: data.gameProgress?.[0]?.gameId,
      criticalCheckpoints: {
        lastSave: new Date().toISOString(),
        version: '1.0.0'
      }
    }
  }
  
  private convertFromGameStateCookie(cookieData: any): any {
    return {
      playerStats: {
        level: cookieData.playerLevel,
        totalXP: cookieData.totalXP,
        gamesCompleted: cookieData.gamesCompleted,
        achievementsUnlocked: cookieData.achievementsCount,
        streakDays: 0,
        lastVisit: new Date().toISOString(),
        timeSpent: 0
      },
      achievements: [],
      gameProgress: [],
      skillProgress: {
        cryptography: 0,
        passwordSecurity: 0,
        phishingDetection: 0,
        socialEngineering: 0,
        networkSecurity: 0,
        incidentResponse: 0
      },
      preferences: {
        soundEnabled: true,
        difficulty: 'normal',
        theme: 'dark'
      },
      sessionInfo: {
        sessionId: cookieData.sessionId,
        startTime: new Date().toISOString(),
        lastActivity: new Date().toISOString()
      },
      _restoredFromCookies: true,
      _restoredAt: new Date().toISOString()
    }
  }
  
  private saveAuditTrail(event: string, data: any): void {
    try {
      if (typeof sessionStorage === 'undefined') return
      
      const auditEntry = {
        timestamp: new Date().toISOString(),
        event,
        data,
        sessionId: this.memoryCache.get('sessionId')
      }
      
      const existingLogs = sessionStorage.getItem('game_audit_logs') || '[]'
      const logs = JSON.parse(existingLogs)
      logs.push(auditEntry)
      
      // Keep only last 50 entries
      if (logs.length > 50) {
        logs.splice(0, logs.length - 50)
      }
      
      sessionStorage.setItem('game_audit_logs', JSON.stringify(logs))
    } catch {
      // Audit logging failure should not break the application
    }
  }
  
  private updatePerformanceMetrics(operation: 'read' | 'write', time: number): void {
    this.metrics.storageOperations++
    
    if (operation === 'read') {
      this.metrics.averageReadTime = (this.metrics.averageReadTime + time) / 2
    } else {
      this.metrics.averageWriteTime = (this.metrics.averageWriteTime + time) / 2
    }
  }
  
  private calculateCompressionRatio(original: any, compressed: any): number {
    try {
      const originalSize = JSON.stringify(original).length
      const compressedSize = JSON.stringify(compressed).length
      return originalSize > 0 ? compressedSize / originalSize : 1.0
    } catch {
      return 1.0
    }
  }
  
  private calculateMemoryUsage(): number {
    return Array.from(this.memoryCache.values())
      .reduce((total, value) => total + JSON.stringify(value).length, 0)
  }
  
  private calculateLocalStorageUsage(): number {
    try {
      let total = 0
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          total += localStorage[key].length + key.length
        }
      }
      return total
    } catch {
      return 0
    }
  }
  
  private calculateSessionStorageUsage(): number {
    try {
      let total = 0
      for (let key in sessionStorage) {
        if (sessionStorage.hasOwnProperty(key)) {
          total += sessionStorage[key].length + key.length
        }
      }
      return total
    } catch {
      return 0
    }
  }
  
  private calculateErrorRate(): number {
    const totalOperations = this.metrics.storageOperations
    const totalFailovers = this.metrics.failoverCount
    return totalOperations > 0 ? totalFailovers / totalOperations : 0
  }
}

// 🏭 FACTORY PATTERN

export class PersistenceManagerFactory {
  static createForProduction(): GameStatePersistenceManager {
    return new GameStatePersistenceManager()
  }
  
  static createForTesting(): GameStatePersistenceManager {
    // Test version might have different configuration
    return new GameStatePersistenceManager()
  }
}

export default GameStatePersistenceManager
