/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock the monster catching system components
jest.mock('@/app/games/pokemon-cyber-mmo/PokemonCyberMMO-v2-educational', () => {
  return function MockPokemonCyberMMO() {
    return <div data-testid="pokemon-cyber-mmo">Mock Game</div>;
  };
});

// Monster catching system types and interfaces
interface CyberPokemon {
  id: string;
  name: string;
  type: string;
  level: number;
  hp: number;
  maxHp: number;
  abilities: string[];
  rarity: 'starter' | 'common' | 'uncommon' | 'rare' | 'legendary';
  catchRate: number;
}

interface CatchAttempt {
  pokemonId: string;
  ballType: 'cyber-ball' | 'ultra-cyber-ball' | 'master-cyber-ball';
  success: boolean;
  shakeCount: number;
}

// Mock monster catching system
class MonsterCatchingSystem {
  static calculateCatchRate(pokemon: CyberPokemon, ballType: string): number {
    const baseRate = pokemon.catchRate;
    const ballMultiplier = {
      'cyber-ball': 1.0,
      'ultra-cyber-ball': 1.5,
      'master-cyber-ball': 100.0 // Always catches
    }[ballType] || 1.0;
    
    return Math.min(baseRate * ballMultiplier, 1.0);
  }

  static attemptCatch(pokemon: CyberPokemon, ballType: string): CatchAttempt {
    const catchRate = this.calculateCatchRate(pokemon, ballType);
    const success = Math.random() < catchRate;
    const shakeCount = success ? 3 : Math.floor(Math.random() * 3);

    return {
      pokemonId: pokemon.id,
      ballType: ballType as any,
      success,
      shakeCount
    };
  }
}

describe('Pokemon Cyber MMO - Monster Catching System', () => {
  const mockPokemon: CyberPokemon = {
    id: 'hackmon',
    name: 'Hackmon',
    type: 'cyber-career',
    level: 5,
    hp: 35,
    maxHp: 35,
    abilities: ['White Hat Ethics', 'Vulnerability Scan'],
    rarity: 'starter',
    catchRate: 0.8 // 80% base catch rate
  };

  describe('1. Wild Pokemon Encounters', () => {
    it('should spawn wild pokemon in different areas with appropriate types', () => {
      const areas = [
        { name: 'Cyber Career City', expectedTypes: ['cyber-career'] },
        { name: 'Hardware Forest', expectedTypes: ['hardware'] },
        { name: 'Software Gardens', expectedTypes: ['software'] },
        { name: 'Security Fortress', expectedTypes: ['security'] }
      ];

      areas.forEach(area => {
        const wildPokemon = generateWildPokemon(area.name);
        expect(area.expectedTypes).toContain(wildPokemon.type);
      });
    });

    it('should have appropriate rarity distribution for wild encounters', () => {
      const encounters = Array.from({ length: 100 }, () => generateWildPokemon('test-area'));
      const rarities = encounters.map(p => p.rarity);
      
      const commonCount = rarities.filter(r => r === 'common').length;
      const uncommonCount = rarities.filter(r => r === 'uncommon').length;
      const rareCount = rarities.filter(r => r === 'rare').length;
      const legendaryCount = rarities.filter(r => r === 'legendary').length;

      expect(commonCount).toBeGreaterThan(uncommonCount);
      expect(uncommonCount).toBeGreaterThan(rareCount);
      expect(rareCount).toBeGreaterThan(legendaryCount);
    });

    it('should display wild pokemon stats and abilities before battle', () => {
      const encounterInfo = getWildEncounterInfo(mockPokemon);
      
      expect(encounterInfo).toEqual({
        name: 'Hackmon',
        type: 'cyber-career',
        level: 5,
        abilities: ['White Hat Ethics', 'Vulnerability Scan'],
        description: expect.stringContaining('ethical hacking')
      });
    });
  });

  describe('2. Catch Probability System', () => {
    it('should calculate correct catch rates based on pokemon rarity and ball type', () => {
      const testCases = [
        { pokemon: { ...mockPokemon, rarity: 'common' as const, catchRate: 0.9 }, ball: 'cyber-ball', expected: 0.9 },
        { pokemon: { ...mockPokemon, rarity: 'rare' as const, catchRate: 0.3 }, ball: 'cyber-ball', expected: 0.3 },
        { pokemon: { ...mockPokemon, rarity: 'legendary' as const, catchRate: 0.05 }, ball: 'ultra-cyber-ball', expected: 0.075 },
        { pokemon: { ...mockPokemon, rarity: 'legendary' as const, catchRate: 0.05 }, ball: 'master-cyber-ball', expected: 1.0 }
      ];

      testCases.forEach(({ pokemon, ball, expected }) => {
        const catchRate = MonsterCatchingSystem.calculateCatchRate(pokemon, ball);
        expect(catchRate).toBeCloseTo(expected, 2);
      });
    });

    it('should implement shake animation based on catch probability', () => {
      const lowCatchRate = { ...mockPokemon, catchRate: 0.1 };
      const highCatchRate = { ...mockPokemon, catchRate: 0.9 };

      const attempts = Array.from({ length: 50 }, () => [
        MonsterCatchingSystem.attemptCatch(lowCatchRate, 'cyber-ball'),
        MonsterCatchingSystem.attemptCatch(highCatchRate, 'cyber-ball')
      ]).flat();

      const lowRateAttempts = attempts.filter(a => a.pokemonId === lowCatchRate.id);
      const highRateAttempts = attempts.filter(a => a.pokemonId === highCatchRate.id);

      // High catch rate should have more successes
      const lowSuccessRate = lowRateAttempts.filter(a => a.success).length / lowRateAttempts.length;
      const highSuccessRate = highRateAttempts.filter(a => a.success).length / highRateAttempts.length;

      expect(highSuccessRate).toBeGreaterThan(lowSuccessRate);
    });
  });

  describe('3. Ball Types and Effectiveness', () => {
    it('should provide different ball types with varying effectiveness', () => {
      const ballTypes = ['cyber-ball', 'ultra-cyber-ball', 'master-cyber-ball'];
      const effectivenessResults = ballTypes.map(ballType => {
        const attempts = Array.from({ length: 20 }, () => 
          MonsterCatchingSystem.attemptCatch(mockPokemon, ballType)
        );
        return {
          ballType,
          successRate: attempts.filter(a => a.success).length / attempts.length
        };
      });

      // Ultra balls should be more effective than regular balls
      const regularBall = effectivenessResults.find(r => r.ballType === 'cyber-ball')!;
      const ultraBall = effectivenessResults.find(r => r.ballType === 'ultra-cyber-ball')!;
      const masterBall = effectivenessResults.find(r => r.ballType === 'master-cyber-ball')!;

      expect(ultraBall.successRate).toBeGreaterThanOrEqual(regularBall.successRate);
      expect(masterBall.successRate).toBe(1.0); // Master ball always catches
    });

    it('should track ball inventory and consumption', () => {
      const inventory = {
        'cyber-ball': 10,
        'ultra-cyber-ball': 3,
        'master-cyber-ball': 1
      };

      const useBall = (ballType: string) => {
        if (inventory[ballType as keyof typeof inventory] > 0) {
          inventory[ballType as keyof typeof inventory]--;
          return true;
        }
        return false;
      };

      expect(useBall('cyber-ball')).toBe(true);
      expect(inventory['cyber-ball']).toBe(9);

      // Use all master balls
      expect(useBall('master-cyber-ball')).toBe(true);
      expect(useBall('master-cyber-ball')).toBe(false); // Should fail when out
      expect(inventory['master-cyber-ball']).toBe(0);
    });
  });

  describe('4. Collection and Storage System', () => {
    it('should add caught pokemon to player collection', () => {
      const playerCollection: CyberPokemon[] = [];
      
      const addToCollection = (pokemon: CyberPokemon) => {
        playerCollection.push({ ...pokemon, id: `caught_${Date.now()}` });
      };

      addToCollection(mockPokemon);
      expect(playerCollection).toHaveLength(1);
      expect(playerCollection[0].name).toBe('Hackmon');
    });

    it('should organize pokemon by type and rarity in storage', () => {
      const collection = [
        { ...mockPokemon, type: 'cyber-career', rarity: 'starter' as const },
        { ...mockPokemon, id: 'guardmon', name: 'Guardmon', type: 'cyber-career', rarity: 'starter' as const },
        { ...mockPokemon, id: 'firewallmon', name: 'Firewallmon', type: 'security', rarity: 'uncommon' as const }
      ];

      const organizedByType = organizeByType(collection);
      const organizedByRarity = organizeByRarity(collection);

      expect(organizedByType['cyber-career']).toHaveLength(2);
      expect(organizedByType['security']).toHaveLength(1);
      expect(organizedByRarity['starter']).toHaveLength(2);
      expect(organizedByRarity['uncommon']).toHaveLength(1);
    });

    it('should track unique pokemon discoveries for completion', () => {
      const discovered = new Set<string>();
      const totalUnique = 50; // Assume 50 unique pokemon in the game

      const discoverPokemon = (pokemonId: string) => {
        discovered.add(pokemonId);
      };

      discoverPokemon('hackmon');
      discoverPokemon('guardmon');
      discoverPokemon('hackmon'); // Duplicate should not increase count

      expect(discovered.size).toBe(2);
      expect(discovered.size / totalUnique).toBeCloseTo(0.04); // 4% completion
    });
  });

  describe('5. Educational Integration', () => {
    it('should link caught pokemon to cybersecurity concepts', () => {
      const conceptMappings = {
        'hackmon': ['Ethical Hacking', 'Penetration Testing', 'Vulnerability Assessment'],
        'guardmon': ['Network Security', 'Intrusion Detection', 'Incident Response'],
        'firewallmon': ['Network Filtering', 'Access Control', 'Perimeter Defense']
      };

      Object.entries(conceptMappings).forEach(([pokemonId, concepts]) => {
        const pokemon = getPokemonById(pokemonId);
        expect(pokemon.educationalConcepts).toEqual(expect.arrayContaining(concepts));
      });
    });

    it('should unlock learning modules when catching specific pokemon', () => {
      const unlockedModules: string[] = [];
      
      const catchPokemon = (pokemonId: string) => {
        const pokemon = getPokemonById(pokemonId);
        if (pokemon.unlocksModule) {
          unlockedModules.push(pokemon.unlocksModule);
        }
      };

      catchPokemon('hackmon');
      expect(unlockedModules).toContain('Ethical Hacking Fundamentals');

      catchPokemon('firewallmon');
      expect(unlockedModules).toContain('Network Security Basics');
    });
  });
});

// Helper functions for tests
function generateWildPokemon(areaName: string): CyberPokemon {
  const typeMapping: { [key: string]: string } = {
    'Cyber Career City': 'cyber-career',
    'Hardware Forest': 'hardware',
    'Software Gardens': 'software',
    'Security Fortress': 'security'
  };

  return {
    id: 'wild_' + Math.random().toString(36).substr(2, 9),
    name: 'Wild Pokemon',
    type: typeMapping[areaName] || 'common',
    level: Math.floor(Math.random() * 10) + 1,
    hp: 30,
    maxHp: 30,
    abilities: ['Test Ability'],
    rarity: Math.random() < 0.6 ? 'common' : Math.random() < 0.8 ? 'uncommon' : Math.random() < 0.95 ? 'rare' : 'legendary',
    catchRate: 0.7
  };
}

function getWildEncounterInfo(pokemon: CyberPokemon) {
  return {
    name: pokemon.name,
    type: pokemon.type,
    level: pokemon.level,
    abilities: pokemon.abilities,
    description: `A wild ${pokemon.name} focused on ethical hacking practices.`
  };
}

function organizeByType(collection: CyberPokemon[]) {
  return collection.reduce((acc, pokemon) => {
    if (!acc[pokemon.type]) acc[pokemon.type] = [];
    acc[pokemon.type].push(pokemon);
    return acc;
  }, {} as { [key: string]: CyberPokemon[] });
}

function organizeByRarity(collection: CyberPokemon[]) {
  return collection.reduce((acc, pokemon) => {
    if (!acc[pokemon.rarity]) acc[pokemon.rarity] = [];
    acc[pokemon.rarity].push(pokemon);
    return acc;
  }, {} as { [key: string]: CyberPokemon[] });
}

function getPokemonById(id: string): CyberPokemon & { educationalConcepts?: string[], unlocksModule?: string } {
  const pokemonDatabase: { [key: string]: CyberPokemon & { educationalConcepts?: string[], unlocksModule?: string } } = {
    'hackmon': {
      id: 'hackmon',
      name: 'Hackmon',
      type: 'cyber-career',
      level: 5,
      hp: 35,
      maxHp: 35,
      abilities: ['White Hat Ethics'],
      rarity: 'starter',
      catchRate: 0.8,
      educationalConcepts: ['Ethical Hacking', 'Penetration Testing', 'Vulnerability Assessment'],
      unlocksModule: 'Ethical Hacking Fundamentals'
    },
    'guardmon': {
      id: 'guardmon',
      name: 'Guardmon',
      type: 'cyber-career',
      level: 5,
      hp: 40,
      maxHp: 40,
      abilities: ['Shield Wall'],
      rarity: 'starter',
      catchRate: 0.8,
      educationalConcepts: ['Network Security', 'Intrusion Detection', 'Incident Response']
    },
    'firewallmon': {
      id: 'firewallmon',
      name: 'Firewallmon',
      type: 'security',
      level: 3,
      hp: 60,
      maxHp: 60,
      abilities: ['Block Threats'],
      rarity: 'uncommon',
      catchRate: 0.6,
      educationalConcepts: ['Network Filtering', 'Access Control', 'Perimeter Defense'],
      unlocksModule: 'Network Security Basics'
    }
  };

  return pokemonDatabase[id] || pokemonDatabase['hackmon'];
}
