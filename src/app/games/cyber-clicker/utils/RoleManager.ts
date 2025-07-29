/**
 * RoleManager utility for efficient role operations in CyberClickerGame
 * REFACTOR Phase: Extracted from main component for better maintainability
 */

export interface CareerRole {
  id: string
  name: string
  baseCost: number
  spPerSec: number
  tier: number
  nextRoleId?: string
  description: string
}

export interface RoleTransaction {
  roleId: string
  cost: number
  type: 'hire' | 'promote'
  success: boolean
  message?: string
  newCount?: number
}

// Game balance constants - extracted for easy tuning
export const GAME_CONSTANTS = {
  HIRE_COST_MULTIPLIER: 1.15,
  PROMOTION_COST_MULTIPLIER: 2,
  MAX_NOTIFICATIONS: 5,
  NOTIFICATION_TIMEOUT: 3000
} as const

/**
 * Optimized role management with O(1) lookups and standardized cost calculations
 */
export class RoleManager {
  private roleMap: Map<string, CareerRole>
  
  constructor(roles: CareerRole[]) {
    this.roleMap = new Map(roles.map(role => [role.id, role]))
  }
  
  /**
   * Get role by ID - O(1) lookup instead of O(n) array.find()
   */
  getRole(id: string): CareerRole | undefined {
    return this.roleMap.get(id)
  }
  
  /**
   * Get role by ID with error handling
   */
  getRoleRequired(id: string): CareerRole {
    const role = this.roleMap.get(id)
    if (!role) {
      throw new Error(`Role with ID '${id}' not found`)
    }
    return role
  }
  
  /**
   * Calculate hire cost with exponential scaling
   */
  calculateHireCost(role: CareerRole, currentCount: number): number {
    if (currentCount < 0) {
      throw new Error('Current count cannot be negative')
    }
    return Math.floor(role.baseCost * Math.pow(GAME_CONSTANTS.HIRE_COST_MULTIPLIER, currentCount))
  }
  
  /**
   * Calculate promotion cost based on tier
   */
  calculatePromotionCost(role: CareerRole): number {
    return Math.floor(role.baseCost * GAME_CONSTANTS.PROMOTION_COST_MULTIPLIER * role.tier)
  }
  
  /**
   * Validate hire transaction before execution
   */
  validateHire(role: CareerRole, currentSP: number, currentCount: number): RoleTransaction {
    const cost = this.calculateHireCost(role, currentCount)
    
    if (currentSP < cost) {
      return {
        roleId: role.id,
        cost,
        type: 'hire',
        success: false,
        message: `Insufficient SP. Need ${cost}, have ${Math.floor(currentSP)}`
      }
    }
    
    return {
      roleId: role.id,
      cost,
      type: 'hire',
      success: true,
      newCount: currentCount + 1
    }
  }
  
  /**
   * Validate promotion transaction before execution
   */
  validatePromotion(role: CareerRole, currentSP: number, currentCount: number): RoleTransaction {
    // Check if promotion is possible
    if (!role.nextRoleId) {
      return {
        roleId: role.id,
        cost: 0,
        type: 'promote',
        success: false,
        message: `${role.name} cannot be promoted further`
      }
    }
    
    if (currentCount < 1) {
      return {
        roleId: role.id,
        cost: 0,
        type: 'promote',
        success: false,
        message: `No ${role.name} available to promote`
      }
    }
    
    const cost = this.calculatePromotionCost(role)
    
    if (currentSP < cost) {
      return {
        roleId: role.id,
        cost,
        type: 'promote',
        success: false,
        message: `Insufficient SP. Need ${cost}, have ${Math.floor(currentSP)}`
      }
    }
    
    const nextRole = this.getRoleRequired(role.nextRoleId)
    
    return {
      roleId: role.id,
      cost,
      type: 'promote',
      success: true,
      message: `Promoted 1 ${role.name} → ${nextRole.name}!`,
      newCount: currentCount - 1
    }
  }
  
  /**
   * Get all roles of a specific tier
   */
  getRolesByTier(tier: number): CareerRole[] {
    return Array.from(this.roleMap.values()).filter(role => role.tier === tier)
  }
  
  /**
   * Get promotion chain for a role (with circular reference protection)
   */
  getPromotionChain(roleId: string): CareerRole[] {
    const chain: CareerRole[] = []
    const visited = new Set<string>()
    let currentRole = this.getRole(roleId)
    
    while (currentRole && !visited.has(currentRole.id)) {
      visited.add(currentRole.id)
      chain.push(currentRole)
      currentRole = currentRole.nextRoleId ? this.getRole(currentRole.nextRoleId) : undefined
    }
    
    return chain
  }
  
  /**
   * Calculate total SP/sec from hired roles
   */
  calculateTotalSpPerSec(hired: Record<string, number>): number {
    let total = 0
    for (const [roleId, count] of Object.entries(hired)) {
      const role = this.getRole(roleId)
      if (role) {
        total += role.spPerSec * count
      }
    }
    return total
  }
}

/**
 * Utility functions for testing and debugging
 */
export class RoleManagerUtils {
  static createTestManager(): RoleManager {
    const testRoles: CareerRole[] = [
      {
        id: 'security_analyst',
        name: 'Security Analyst',
        baseCost: 10,
        spPerSec: 0.5,
        tier: 1,
        nextRoleId: 'senior_analyst',
        description: 'Monitors security alerts'
      },
      {
        id: 'senior_analyst',
        name: 'Senior Security Analyst',
        baseCost: 50,
        spPerSec: 2,
        tier: 2,
        description: 'Advanced threat analysis'
      }
    ]
    return new RoleManager(testRoles)
  }
  
  static benchmarkLookup(manager: RoleManager, iterations: number = 10000): number {
    const start = performance.now()
    for (let i = 0; i < iterations; i++) {
      manager.getRole('security_analyst')
    }
    const end = performance.now()
    return end - start
  }
}
