/**
 * RoleManager Tests - REFACTOR Phase
 * Comprehensive testing for extracted role management utilities
 */

import { RoleManager, RoleManagerUtils, GAME_CONSTANTS, CareerRole } from '../../../../src/app/games/cyber-clicker/utils/RoleManager'

describe('RoleManager - REFACTOR Phase', () => {
  let roleManager: RoleManager
  let testRoles: CareerRole[]

  beforeEach(() => {
    testRoles = [
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
        nextRoleId: 'security_manager',
        description: 'Advanced threat analysis'
      },
      {
        id: 'security_manager',
        name: 'Security Manager',
        baseCost: 200,
        spPerSec: 8,
        tier: 3,
        description: 'Leads security operations'
      }
    ]
    roleManager = new RoleManager(testRoles)
  })

  describe('Role Lookup Operations', () => {
    test('getRole returns correct role for valid ID', () => {
      const role = roleManager.getRole('security_analyst')
      expect(role).toBeDefined()
      expect(role?.name).toBe('Security Analyst')
      expect(role?.baseCost).toBe(10)
    })

    test('getRole returns undefined for invalid ID', () => {
      const role = roleManager.getRole('nonexistent_role')
      expect(role).toBeUndefined()
    })

    test('getRoleRequired throws error for invalid ID', () => {
      expect(() => roleManager.getRoleRequired('nonexistent_role'))
        .toThrow("Role with ID 'nonexistent_role' not found")
    })

    test('getRoleRequired returns role for valid ID', () => {
      const role = roleManager.getRoleRequired('senior_analyst')
      expect(role.name).toBe('Senior Security Analyst')
    })
  })

  describe('Cost Calculations', () => {
    test('calculateHireCost with no existing hires', () => {
      const role = roleManager.getRoleRequired('security_analyst')
      const cost = roleManager.calculateHireCost(role, 0)
      expect(cost).toBe(10) // 10 * 1.15^0 = 10
    })

    test('calculateHireCost with exponential scaling', () => {
      const role = roleManager.getRoleRequired('security_analyst')
      
      // Test progression: 10 * 1.15^n
      expect(roleManager.calculateHireCost(role, 0)).toBe(10)
      expect(roleManager.calculateHireCost(role, 1)).toBe(11) // Math.floor(10 * 1.15^1)
      expect(roleManager.calculateHireCost(role, 2)).toBe(13) // Math.floor(10 * 1.15^2)
      expect(roleManager.calculateHireCost(role, 5)).toBe(20) // Math.floor(10 * 1.15^5)
    })

    test('calculateHireCost throws error for negative count', () => {
      const role = roleManager.getRoleRequired('security_analyst')
      expect(() => roleManager.calculateHireCost(role, -1))
        .toThrow('Current count cannot be negative')
    })

    test('calculatePromotionCost based on tier', () => {
      const analyst = roleManager.getRoleRequired('security_analyst')
      const senior = roleManager.getRoleRequired('senior_analyst')
      const manager = roleManager.getRoleRequired('security_manager')

      // Cost = baseCost * 2 * tier
      expect(roleManager.calculatePromotionCost(analyst)).toBe(20) // 10 * 2 * 1
      expect(roleManager.calculatePromotionCost(senior)).toBe(200) // 50 * 2 * 2  
      expect(roleManager.calculatePromotionCost(manager)).toBe(1200) // 200 * 2 * 3
    })
  })

  describe('Transaction Validation', () => {
    describe('Hire Validation', () => {
      test('successful hire validation', () => {
        const role = roleManager.getRoleRequired('security_analyst')
        const result = roleManager.validateHire(role, 100, 0)

        expect(result.success).toBe(true)
        expect(result.cost).toBe(10)
        expect(result.type).toBe('hire')
        expect(result.newCount).toBe(1)
        expect(result.message).toBeUndefined()
      })

      test('failed hire validation - insufficient SP', () => {
        const role = roleManager.getRoleRequired('security_analyst')
        const result = roleManager.validateHire(role, 5, 0)

        expect(result.success).toBe(false)
        expect(result.cost).toBe(10)
        expect(result.type).toBe('hire')
        expect(result.message).toBe('Insufficient SP. Need 10, have 5')
      })

      test('hire validation with existing roles', () => {
        const role = roleManager.getRoleRequired('security_analyst')
        const result = roleManager.validateHire(role, 15, 2)

        expect(result.success).toBe(true)
        expect(result.cost).toBe(13) // 10 * 1.15^2
        expect(result.newCount).toBe(3)
      })
    })

    describe('Promotion Validation', () => {
      test('successful promotion validation', () => {
        const role = roleManager.getRoleRequired('security_analyst')
        const result = roleManager.validatePromotion(role, 100, 1)

        expect(result.success).toBe(true)
        expect(result.cost).toBe(20) // 10 * 2 * 1
        expect(result.type).toBe('promote')
        expect(result.message).toBe('Promoted 1 Security Analyst → Senior Security Analyst!')
        expect(result.newCount).toBe(0)
      })

      test('failed promotion - no next role', () => {
        const role = roleManager.getRoleRequired('security_manager')
        const result = roleManager.validatePromotion(role, 100, 1)

        expect(result.success).toBe(false)
        expect(result.message).toBe('Security Manager cannot be promoted further')
      })

      test('failed promotion - no hired units', () => {
        const role = roleManager.getRoleRequired('security_analyst')
        const result = roleManager.validatePromotion(role, 100, 0)

        expect(result.success).toBe(false)
        expect(result.message).toBe('No Security Analyst available to promote')
      })

      test('failed promotion - insufficient SP', () => {
        const role = roleManager.getRoleRequired('security_analyst')
        const result = roleManager.validatePromotion(role, 10, 1)

        expect(result.success).toBe(false)
        expect(result.cost).toBe(20)
        expect(result.message).toBe('Insufficient SP. Need 20, have 10')
      })
    })
  })

  describe('Utility Functions', () => {
    test('getRolesByTier returns correct roles', () => {
      const tier1Roles = roleManager.getRolesByTier(1)
      const tier2Roles = roleManager.getRolesByTier(2)
      const tier3Roles = roleManager.getRolesByTier(3)

      expect(tier1Roles).toHaveLength(1)
      expect(tier1Roles[0].name).toBe('Security Analyst')
      
      expect(tier2Roles).toHaveLength(1)
      expect(tier2Roles[0].name).toBe('Senior Security Analyst')
      
      expect(tier3Roles).toHaveLength(1)
      expect(tier3Roles[0].name).toBe('Security Manager')
    })

    test('getPromotionChain returns complete chain', () => {
      const chain = roleManager.getPromotionChain('security_analyst')
      
      expect(chain).toHaveLength(3)
      expect(chain[0].name).toBe('Security Analyst')
      expect(chain[1].name).toBe('Senior Security Analyst') 
      expect(chain[2].name).toBe('Security Manager')
    })

    test('getPromotionChain for mid-tier role', () => {
      const chain = roleManager.getPromotionChain('senior_analyst')
      
      expect(chain).toHaveLength(2)
      expect(chain[0].name).toBe('Senior Security Analyst')
      expect(chain[1].name).toBe('Security Manager')
    })

    test('calculateTotalSpPerSec sums correctly', () => {
      const hired = {
        'security_analyst': 2, // 2 * 0.5 = 1.0
        'senior_analyst': 1,   // 1 * 2.0 = 2.0
        'security_manager': 1  // 1 * 8.0 = 8.0
      }
      
      const total = roleManager.calculateTotalSpPerSec(hired)
      expect(total).toBe(11.0)
    })

    test('calculateTotalSpPerSec ignores invalid roles', () => {
      const hired = {
        'security_analyst': 1,  // 1 * 0.5 = 0.5
        'invalid_role': 10     // Should be ignored
      }
      
      const total = roleManager.calculateTotalSpPerSec(hired)
      expect(total).toBe(0.5)
    })
  })

  describe('Performance Tests', () => {
    test('getRole lookup performance', () => {
      const iterations = 10000
      const duration = RoleManagerUtils.benchmarkLookup(roleManager, iterations)
      
      // Should complete 10k lookups in under 50ms (very generous)
      expect(duration).toBeLessThan(50)
      console.log(`✅ REFACTOR PERFORMANCE: ${iterations} lookups in ${duration.toFixed(2)}ms`)
    })

    test('large role set performance', () => {
      // Create manager with many roles
      const largeRoleSet: CareerRole[] = []
      for (let i = 0; i < 1000; i++) {
        largeRoleSet.push({
          id: `role_${i}`,
          name: `Role ${i}`,
          baseCost: 10 + i,
          spPerSec: 0.1 + i * 0.01,
          tier: Math.floor(i / 100) + 1,
          description: `Test role ${i}`
        })
      }
      
      const largeManager = new RoleManager(largeRoleSet)
      const duration = RoleManagerUtils.benchmarkLookup(largeManager, 1000)
      
      // Should still be fast even with 1000 roles
      expect(duration).toBeLessThan(20)
      console.log(`✅ REFACTOR SCALABILITY: 1000 lookups on 1000 roles in ${duration.toFixed(2)}ms`)
    })
  })

  describe('Constants Verification', () => {
    test('game constants are properly defined', () => {
      expect(GAME_CONSTANTS.HIRE_COST_MULTIPLIER).toBe(1.15)
      expect(GAME_CONSTANTS.PROMOTION_COST_MULTIPLIER).toBe(2)
      expect(GAME_CONSTANTS.MAX_NOTIFICATIONS).toBe(5)
      expect(GAME_CONSTANTS.NOTIFICATION_TIMEOUT).toBe(3000)
    })
  })

  describe('Edge Cases', () => {
    test('empty role manager', () => {
      const emptyManager = new RoleManager([])
      expect(emptyManager.getRole('any_id')).toBeUndefined()
      expect(emptyManager.getRolesByTier(1)).toHaveLength(0)
    })

    test('role with circular promotion chain prevention', () => {
      // This should be caught during development - roles shouldn't have circular chains
      const circularRole: CareerRole = {
        id: 'circular',
        name: 'Circular Role',
        baseCost: 10,
        spPerSec: 1,
        tier: 1,
        nextRoleId: 'circular', // Points to itself
        description: 'Should not create infinite loop'
      }
      
      const circularManager = new RoleManager([circularRole])
      const chain = circularManager.getPromotionChain('circular')
      
      // Should stop at reasonable length to prevent infinite loop
      expect(chain.length).toBeLessThan(100)
    })
  })

  describe('Integration with Game Constants', () => {
    test('hire cost matches original game logic', () => {
      // Verify our refactored calculations match the original game
      const role = roleManager.getRoleRequired('security_analyst')
      
      // Original: Math.floor(role.baseCost * Math.pow(1.15, hired[role.id]))
      // Ours: Math.floor(role.baseCost * Math.pow(GAME_CONSTANTS.HIRE_COST_MULTIPLIER, currentCount))
      for (let count = 0; count < 10; count++) {
        const originalCost = Math.floor(role.baseCost * Math.pow(1.15, count))
        const refactoredCost = roleManager.calculateHireCost(role, count)
        expect(refactoredCost).toBe(originalCost)
      }
    })

    test('promotion cost matches original game logic', () => {
      const role = roleManager.getRoleRequired('security_analyst')
      
      // Original: Math.floor(role.baseCost * 2 * role.tier)
      // Ours: Math.floor(role.baseCost * GAME_CONSTANTS.PROMOTION_COST_MULTIPLIER * role.tier)
      const originalCost = Math.floor(role.baseCost * 2 * role.tier)
      const refactoredCost = roleManager.calculatePromotionCost(role)
      expect(refactoredCost).toBe(originalCost)
    })
  })
})

describe('RoleManagerUtils', () => {
  test('createTestManager produces working manager', () => {
    const testManager = RoleManagerUtils.createTestManager()
    
    const analyst = testManager.getRole('security_analyst')
    expect(analyst).toBeDefined()
    expect(analyst?.name).toBe('Security Analyst')
    
    const cost = testManager.calculateHireCost(analyst!, 0)
    expect(cost).toBe(10)
  })

  test('benchmarkLookup returns reasonable timing', () => {
    const testManager = RoleManagerUtils.createTestManager()
    const duration = RoleManagerUtils.benchmarkLookup(testManager, 100)
    
    expect(duration).toBeGreaterThan(0)
    expect(duration).toBeLessThan(100) // Should be very fast
  })
})
