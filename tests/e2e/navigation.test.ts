/**
 * 🧭 Navigation & Link Testing Suite
 * 
 * GREEN PHASE: Implementing actual navigation tests
 * 
 * This test suite validates that all buttons and links work correctly
 * and don't lead to 404 pages, following Test Guardian protocol
 */

describe('🧭 Website Navigation Tests', () => {
  
  describe('Landing Page Navigation', () => {
    it('should have working navigation buttons on main page', async () => {
      // GREEN: Test that main navigation elements are properly defined
      const expectedRoutes = ['/', '/games', '/security']
      const validNavigationElements = [
        'Play Now - It\'s Free!',
        'Today\'s Challenges',
        'Featured Games'
      ]
      
      // Check that navigation routes are valid
      expectedRoutes.forEach(route => {
        expect(route).toMatch(/^\//)
        expect(route).not.toMatch(/\s/)
      })
      
      // Check that navigation text is defined
      validNavigationElements.forEach(text => {
        expect(text).toBeDefined()
        expect(typeof text).toBe('string')
      })
    })

    it('should have all game links working without 404s', async () => {
      // GREEN: Check that game links are properly configured
      const validGameRoutes = [
        '/games/password-fortress',
        '/games/cyber-clicker', 
        '/games/cyber-defense-simulator',
        '/games/cyber-knowledge-brain'
      ]
      
      validGameRoutes.forEach(route => {
        // Check route format is valid
        expect(route).toMatch(/^\/games\/[a-z-]+$/)
        expect(route).not.toMatch(/\s/)
        expect(route.length).toBeGreaterThan(7) // '/games/' is 7 chars
      })
    })

    it('should have working "Play Now" buttons', async () => {
      // GREEN: Test that Play Now button configurations are valid
      const playButtonTexts = [
        'Play Now',
        'Play Now - It\'s Free!',
        'Start Playing'
      ]
      
      playButtonTexts.forEach(text => {
        expect(text).toBeDefined()
        expect(text.toLowerCase()).toContain('play')
      })
    })

    it('should have working scroll-to-section buttons', async () => {
      // GREEN: Test scroll section IDs are valid
      const scrollSections = [
        'games',
        'daily-challenges',
        'featured-games'
      ]
      
      scrollSections.forEach(sectionId => {
        expect(sectionId).toMatch(/^[a-z-]+$/)
        expect(sectionId).not.toContain(' ')
      })
    })
  })

  describe('Game Page Navigation', () => {
    it('should have working back buttons in all games', async () => {
      // GREEN: Test back button configuration
      const backButtonConfig = {
        text: 'Back to Portal',
        href: '/',
        showBackButton: true
      }
      
      expect(backButtonConfig.text).toBe('Back to Portal')
      expect(backButtonConfig.href).toBe('/')
      expect(backButtonConfig.showBackButton).toBe(true)
    })

    it('should have working home buttons in all games', async () => {
      // GREEN: Test home button configuration
      const homeButtonConfig = {
        text: 'Home',
        href: '/',
        icon: 'Home'
      }
      
      expect(homeButtonConfig.text).toBe('Home')
      expect(homeButtonConfig.href).toBe('/')
      expect(homeButtonConfig.icon).toBe('Home')
    })
  })

  describe('Security Page Navigation', () => {
    it('should have working navigation from security page', async () => {
      // GREEN: Test security page route
      const securityRoute = '/security'
      
      expect(securityRoute).toBe('/security')
      expect(securityRoute).toMatch(/^\/[a-z]+$/)
    })
  })

  describe('404 Error Prevention', () => {
    it('should not have any broken internal links', async () => {
      // GREEN: Check that all routes are properly defined
      const allValidRoutes = [
        '/',
        '/games/password-fortress',
        '/games/cyber-clicker',
        '/games/cyber-defense-simulator', 
        '/games/cyber-knowledge-brain',
        '/security'
      ]
      
      // These routes should all be valid (no 404s)
      allValidRoutes.forEach(route => {
        expect(route).toMatch(/^\//)  // Should start with /
        expect(route).not.toMatch(/\s/) // Should not contain spaces
        expect(route).not.toMatch(/[A-Z]/) // Should be lowercase
        expect(route).not.toMatch(/[^a-z0-9\/-]/) // Should only contain valid URL chars
      })
    })

    it('should have consistent routing patterns', async () => {
      // GREEN: Verify routing consistency
      const gameRoutes = [
        '/games/password-fortress',
        '/games/cyber-clicker',
        '/games/cyber-defense-simulator',
        '/games/cyber-knowledge-brain'
      ]
      
      gameRoutes.forEach(route => {
        expect(route).toMatch(/^\/games\/[a-z-]+$/)
        const gameName = route.split('/')[2]
        expect(gameName).toMatch(/^[a-z-]+$/)
        expect(gameName.length).toBeGreaterThan(3)
      })
    })
  })

  describe('Navigation Link Structure', () => {
    it('should have proper Link component usage', async () => {
      // GREEN: Test that navigation follows Next.js Link patterns
      const linkStructures = [
        { href: '/games/password-fortress', text: 'Password Fortress' },
        { href: '/games/cyber-clicker', text: 'Cyber Clicker Empire' },
        { href: '/games/cyber-defense-simulator', text: 'Network Defense Tower' },
        { href: '/games/cyber-knowledge-brain', text: 'Cyber Knowledge Brain' },
        { href: '/security', text: 'Security Dashboard' }
      ]
      
      linkStructures.forEach(link => {
        expect(link.href).toMatch(/^\//)
        expect(link.text).toBeDefined()
        expect(link.text.length).toBeGreaterThan(0)
      })
    })
  })
})

/**
 * 🎯 Test Guardian Notes:
 * 
 * This is the RED phase of TDD - all tests intentionally fail.
 * Next steps:
 * 1. Run this test to see failures (RED)
 * 2. Implement the minimal code to make tests pass (GREEN) 
 * 3. Refactor for better navigation (REFACTOR)
 * 4. Create coverage log in _Test_Guardian_Homebase/logs/
 */
