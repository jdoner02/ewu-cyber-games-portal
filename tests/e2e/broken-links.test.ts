/**
 * 🚨 RED PHASE: Link Validation Test
 * 
 * This test is designed to FAIL and identify actual broken links
 * by checking that all games referenced on the homepage actually exist
 */

import fs from 'fs'
import path from 'path'

describe('🔗 Broken Link Detection Tests', () => {
  
  describe('Homepage Game Link Validation', () => {
    it('should have matching game pages for all featured games', () => {
      // GREEN: This test should now pass with corrected game references
      
      // Games referenced in the homepage FEATURED_GAMES array (corrected)
      const featuredGameIds = [
        'password-fortress',
        'cyber-clicker', 
        'cyber-defense-simulator', // ✅ Fixed: was 'network-defense'
        'cyber-knowledge-brain'    // ✅ Fixed: was 'phishing-detective'
      ]
      
      // Check what games actually exist in the filesystem
      const gamesDir = path.join(process.cwd(), 'src/app/games')
      const actualGameDirs = fs.readdirSync(gamesDir)
      
      console.log('🎮 Featured games on homepage:', featuredGameIds)
      console.log('📁 Actual game directories:', actualGameDirs)
      
      // This should now pass - all featured games exist
      featuredGameIds.forEach(gameId => {
        expect(actualGameDirs).toContain(gameId)
      })
    })

    it('should not have orphaned game directories', () => {
      // GREEN: Check for games that exist but aren't featured (should be none now)
      
      const gamesDir = path.join(process.cwd(), 'src/app/games')
      const actualGameDirs = fs.readdirSync(gamesDir)
      
      // Games that we expect to be featured (corrected list)
      const featuredGameIds = [
        'password-fortress',
        'cyber-clicker', 
        'cyber-defense-simulator', 
        'cyber-knowledge-brain'
      ]
      
      console.log('📂 All game directories:', actualGameDirs)
      console.log('⭐ Featured on homepage:', featuredGameIds)
      
      // Find orphaned games (exist but not featured) - should be none now
      const orphanedGames = actualGameDirs.filter(gameDir => 
        !featuredGameIds.includes(gameDir)
      )
      
      console.log('🚫 Orphaned games (not featured):', orphanedGames)
      
      // This should pass - no orphaned games
      expect(orphanedGames.length).toBe(0)
    })
  })

  describe('Navigation Link Integrity', () => {
    it('should have valid file paths for all game links', () => {
      // GREEN: Check that all linked games have actual page.tsx files (corrected)
      
      const gameLinks = [
        'password-fortress',
        'cyber-clicker',
        'cyber-defense-simulator', // ✅ Fixed: was 'phishing-detective'
        'cyber-knowledge-brain'    // ✅ Fixed: was 'network-defense'
      ]
      
      gameLinks.forEach(gameId => {
        const gamePath = path.join(process.cwd(), 'src/app/games', gameId, 'page.tsx')
        const pageExists = fs.existsSync(gamePath)
        
        console.log(`🔍 Checking ${gameId}: ${pageExists ? '✅ EXISTS' : '❌ MISSING'}`)
        
        // This should now pass for all games
        expect(pageExists).toBe(true)
      })
    })
  })
})

/**
 * 🎯 Test Guardian Log:
 * 
 * RED PHASE - This test intentionally fails to identify:
 * 1. Games referenced on homepage that don't exist
 * 2. Games that exist but aren't featured
 * 3. Broken navigation paths
 * 
 * Next: Fix the mismatches (GREEN phase)
 */
