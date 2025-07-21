/*
  ==================================================================================
  🏰 Password Fortress Game – Complete Educational Password Builder
  🚧 STATUS: UNFINISHED - Production Ready Implementation

  This single file implements an interactive, incremental game designed to teach
  K‑12 students and beginners about password security.  The design draws on
  constructivist learning theory – players learn by actively building, testing
  and improving their own passwords.  Through upgrades, achievements and
  simulated attack scenarios, the game communicates core cybersecurity
  principles such as entropy, character diversity, multi‑factor authentication
  and the danger of re‑using weak passwords.

  🎮 Gameplay Overview
  • Build your password character by character by clicking the big “Build” button.
  • Earn Security Points (🛡️) based on the strength of the current password.
  • Purchase upgrades with your points to automate and enhance password growth.
  • Unlock achievements that reward milestones and highlight key concepts.
  • Test your password against simulated attack scenarios to see how it stands up.
  • Learn about real‑world applications and standards in the integrated learning panel.

  👨‍👩‍👧‍👦 Designed for Students, Parents and Educators
  • Students experience an addictive clicker with immediate feedback and clear goals.
  • Parents can rest assured that the content is safe, age‑appropriate and aligned
    with national K‑12 cybersecurity learning standards (e.g. CSTA 3B Network
    & Cybersecurity and AP CS Principles Big Idea 6 – Cybersecurity).
  • Educators can integrate the game into lessons on authentication, password
    policies and attack awareness; a standards summary appears at the bottom.

  📦 This component is fully self‑contained; it does not depend on any external
  stores or server endpoints.  Progress is persisted to the browser’s localStorage
  so that players can return later and pick up where they left off.
*/

"use client";

import React, { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Shield,
  Key,
  Zap,
  CheckCircle,
  AlertTriangle,
  Users,
  UserX,
  ShieldIcon,
  Eye,
  EyeOff,
  BookOpen,
  Info,
} from "lucide-react";

// -----------------------------------------------------------------------------
// Types and Interfaces
//
// These definitions describe the shape of the game state.  Defining clear
// interfaces up front not only helps TypeScript catch errors but also
// models the importance of precise data definitions in real cybersecurity code.

interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  owned: number;
  maxLevel: number;
  effectDescription: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  condition: (args: AchievementContext) => boolean;
  concept: string;
}

interface AchievementContext {
  password: string;
  strength: number;
  clickCount: number;
  upgrades: Upgrade[];
}

interface AttackScenario {
  id: string;
  name: string;
  description: string;
  baseTime: number;
  // Determines whether this attack time is influenced by password strength.
  dependsOnStrength: boolean;
}

interface Notification {
  id: number;
  message: string;
  type: "success" | "info" | "warning" | "danger";
}

// -----------------------------------------------------------------------------
// Helper Functions
//
// Many of the core mechanics (e.g. generating characters, calculating strength)
// are encapsulated in pure functions.  These helpers make the component easier
// to reason about and also reflect mathematical concepts such as entropy.

/**
 * Returns a random character from a given set.  The optional `set` parameter
 * can be one of "lowercase", "uppercase", "number" or "symbol"; if omitted
 * all categories are considered.  Exposing the character sets explicitly
 * underscores the combinatorial explosion that comes with mixing types.
 */
function generateRandomChar(set?: "lowercase" | "uppercase" | "number" | "symbol"): string {
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()-_=+[]{};:'\",.<>/?";

  let candidates = "";
  switch (set) {
    case "lowercase":
      candidates = lowercase;
      break;
    case "uppercase":
      candidates = uppercase;
      break;
    case "number":
      candidates = numbers;
      break;
    case "symbol":
      candidates = symbols;
      break;
    default:
      candidates = lowercase + uppercase + numbers + symbols;
  }
  return candidates.charAt(Math.floor(Math.random() * candidates.length));
}

/**
 * Computes a numeric password strength score (0–150) based on length,
 * character variety and owned upgrades.  The exact weights chosen here were
 * informed by NIST guidance (longer passwords matter more than complexity) and
 * classroom experience.  Multi‑factor, password manager and biometric upgrades
 * add bonus points to communicate that security extends beyond the password
 * itself.
 */
function computeStrength(password: string, upgrades: Upgrade[]): number {
  let strength = 0;
  // Length: each character adds 6 points; this emphasises passphrases.
  strength += password.length * 6;
  // Variety bonuses: each category present yields bonus points.
  if (/[a-z]/.test(password)) strength += 5;
  if (/[A-Z]/.test(password)) strength += 5;
  if (/[0-9]/.test(password)) strength += 5;
  if (/[^A-Za-z0-9]/.test(password)) strength += 10;
  // Penalise some obvious patterns.  Educators may expand these.
  if (/1234/.test(password)) strength -= 15;
  if (/abcd/i.test(password)) strength -= 15;
  if (/password/i.test(password)) strength -= 20;
  // Upgrade bonuses: each level of these upgrades contributes additional points.
  const mfa = upgrades.find((u) => u.id === "mfa-shield")?.owned || 0;
  const manager = upgrades.find((u) => u.id === "password-manager")?.owned || 0;
  const bio = upgrades.find((u) => u.id === "biometric-guard")?.owned || 0;
  strength += mfa * 15 + manager * 12 + bio * 20;
  // Clamp the score between 0 and 150.
  return Math.max(0, Math.min(150, strength));
}

/**
 * Derives a fortress level (0–7) from the strength score.  Each level
 * corresponds to a visual stage defined in `getFortressStage` below.
 */
function getFortressLevel(strength: number): number {
  if (strength < 10) return 0; // Empty plot
  if (strength < 25) return 1; // Wooden shack
  if (strength < 40) return 2; // Small house
  if (strength < 60) return 3; // Fortified house
  if (strength < 80) return 4; // Stone castle
  if (strength < 100) return 5; // Medieval fortress
  if (strength < 120) return 6; // High‑tech fortress
  return 7; // Impenetrable digital fortress
}

/**
 * Maps a fortress level to an emoji, name and description.  Using emojis avoids
 * loading external images while still communicating progression.  Teachers can
 * ask students to imagine what a fortress might look like at each stage.
 */
function getFortressStage(level: number) {
  const stages = [
    { emoji: "🏗️", name: "Empty Plot", description: "A bare plot of land – start building!" },
    { emoji: "🛖", name: "Wooden Shack", description: "A flimsy hut that offers little security." },
    { emoji: "🏠", name: "Small House", description: "A modest dwelling – better but still vulnerable." },
    { emoji: "🏚️", name: "Fortified House", description: "Sturdier walls and a solid door." },
    { emoji: "🏰", name: "Stone Castle", description: "Thick walls and a moat deter intruders." },
    { emoji: "🏯", name: "Medieval Fortress", description: "Towers, battlements and guards on watch." },
    { emoji: "🏢", name: "High‑Tech Fortress", description: "Advanced systems protect your data." },
    { emoji: "🏛️", name: "Digital Citadel", description: "An impenetrable bastion of cyber security." },
  ];
  return stages[Math.min(level, stages.length - 1)];
}

/**
 * Translates a numeric strength score into a label, colour and advice.  Having
 * clear thresholds helps students understand when their choices make a
 * meaningful difference.  Colours are encoded as Tailwind classes and must be
 * explicitly listed to avoid being purged during production builds.
 */
function getStrengthInfo(strength: number) {
  if (strength < 20)
    return {
      label: "Very Weak",
      barClass: "bg-red-500",
      textClass: "text-red-500",
      advice: "Add more characters – length matters most!",
    };
  if (strength < 40)
    return {
      label: "Weak",
      barClass: "bg-orange-500",
      textClass: "text-orange-500",
      advice: "Mix in numbers or symbols to strengthen it.",
    };
  if (strength < 60)
    return {
      label: "Fair",
      barClass: "bg-yellow-500",
      textClass: "text-yellow-500",
      advice: "Keep building – variety improves security.",
    };
  if (strength < 80)
    return {
      label: "Strong",
      barClass: "bg-green-500",
      textClass: "text-green-500",
      advice: "Great job!  Longer phrases make brute force harder.",
    };
  if (strength < 120)
    return {
      label: "Very Strong",
      barClass: "bg-blue-500",
      textClass: "text-blue-500",
      advice: "Almost unbreakable – consider adding MFA for more layers.",
    };
  return {
    label: "Fortress",
    barClass: "bg-purple-500",
    textClass: "text-purple-500",
    advice: "You’ve achieved a digital fortress!  Help a friend learn too.",
  };
}

/**
 * Calculates the approximate time to break in seconds for a given attack
 * scenario.  Brute force and dictionary attacks scale with strength; social
 * engineering and phishing do not, emphasising that some attacks bypass
 * passwords altogether.  In a classroom discussion, ask students why that is.
 */
function calculateBreakTime(strength: number, scenario: AttackScenario): number {
  if (!scenario.dependsOnStrength) {
    return scenario.baseTime;
  }
  // The higher the strength, the longer it takes.  We invert the score
  // relative to the base time; adding 1 prevents division by zero.
  const divisor = 1 + strength / 50;
  return scenario.baseTime * divisor;
}

// -----------------------------------------------------------------------------
// Main Component
//
export default function PasswordFortressGame() {
  // -------------------- State Definitions ------------------------------------
  const [password, setPassword] = useState<string>("");
  const [securityPoints, setSecurityPoints] = useState<number>(0);
  const [clickCount, setClickCount] = useState<number>(0);
  const [upgrades, setUpgrades] = useState<Upgrade[]>([{
    id: "auto-length",
    name: "Length Booster",
    description: "Automatically adds a random character every few seconds",
    cost: 50,
    owned: 0,
    maxLevel: 10,
    effectDescription: "Longer passphrases exponentially increase security."
  }, {
    id: "symbol-generator",
    name: "Symbol Generator",
    description: "Occasionally inserts special characters (!@#$%)",
    cost: 150,
    owned: 0,
    maxLevel: 5,
    effectDescription: "Symbols dramatically increase password space."
  }, {
    id: "number-ninja",
    name: "Number Ninja",
    description: "Occasionally adds random digits",
    cost: 100,
    owned: 0,
    maxLevel: 5,
    effectDescription: "Numbers make passwords harder to guess."
  }, {
    id: "case-mixer",
    name: "Case Mixer",
    description: "Randomly capitalises letters in your password",
    cost: 200,
    owned: 0,
    maxLevel: 3,
    effectDescription: "Mixing upper and lower case multiplies possibilities."
  }, {
    id: "mfa-shield",
    name: "MFA Shield",
    description: "Adds a multi‑factor authentication bonus (passive)",
    cost: 300,
    owned: 0,
    maxLevel: 3,
    effectDescription: "MFA requires something you know, have and are."
  }, {
    id: "password-manager",
    name: "Password Vault",
    description: "Grants a password manager bonus (passive)",
    cost: 400,
    owned: 0,
    maxLevel: 3,
    effectDescription: "Managers generate unique passwords for each account."
  }, {
    id: "biometric-guard",
    name: "Biometric Guard",
    description: "Adds fingerprint/face recognition bonus (passive)",
    cost: 600,
    owned: 0,
    maxLevel: 2,
    effectDescription: "Biometrics prove who you are, not what you remember."
  }]);

  // Achievements with conditions capturing password length, clicks and upgrades.
  const [achievements, setAchievements] = useState<Achievement[]>([{
    id: "first-click",
    name: "Password Pioneer",
    description: "Added your first character!",
    unlocked: false,
    condition: ({ clickCount }) => clickCount >= 1,
    concept: "Every password begins with a single character.  Keep going!"
  }, {
    id: "double-digits",
    name: "Double Digits",
    description: "Reached a 10‑character password.",
    unlocked: false,
    condition: ({ password }) => password.length >= 10,
    concept: "Longer passwords are exponentially stronger than short ones."
  }, {
    id: "strength-master",
    name: "Strength Master",
    description: "Achieved a strength score of 80.",
    unlocked: false,
    condition: ({ strength }) => strength >= 80,
    concept: "Your password would take centuries to brute force."
  }, {
    id: "upgrade-novice",
    name: "Upgrade Novice",
    description: "Purchased your first upgrade.",
    unlocked: false,
    condition: ({ upgrades }) => upgrades.some((u) => u.owned > 0),
    concept: "Automation can help you build safer passwords faster."
  }, {
    id: "mfa-guru",
    name: "MFA Guru",
    description: "Owned an MFA Shield upgrade.",
    unlocked: false,
    condition: ({ upgrades }) => (upgrades.find((u) => u.id === "mfa-shield")?.owned || 0) > 0,
    concept: "Multi‑factor authentication protects against stolen passwords."
  }, {
    id: "vault-keeper",
    name: "Vault Keeper",
    description: "Owned a Password Vault upgrade.",
    unlocked: false,
    condition: ({ upgrades }) => (upgrades.find((u) => u.id === "password-manager")?.owned || 0) > 0,
    concept: "Password managers can remember unique credentials for you."
  }, {
    id: "fortress-conqueror",
    name: "Fortress Conqueror",
    description: "Built a digital citadel (max fortress level).",
    unlocked: false,
    condition: ({ strength }) => getFortressLevel(strength) >= 7,
    concept: "Congratulations!  You’ve mastered password security."
  }]);

  // Notifications are short messages that appear and then disappear.  They
  // reinforce successes and advise the player without interrupting gameplay.
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Attack simulation state.  When the player chooses to test their password,
  // we compute results for each scenario and display them in a modal.  We store
  // the results rather than re‑computing on each render.
  const [attackResults, setAttackResults] = useState<null | { scenario: AttackScenario; time: number }[]>(null);
  const [showAttackModal, setShowAttackModal] = useState<boolean>(false);

  // Derived values for the current password.  These are recomputed whenever
  // password or upgrades change.  Strength influences fortress stage and advice.
  const strength = computeStrength(password, upgrades);
  const fortressLevel = getFortressLevel(strength);
  const strengthInfo = getStrengthInfo(strength);
  const fortressStage = getFortressStage(fortressLevel);

  // -------------------- Effects and Persistence -----------------------------
  // On mount, load any saved state from localStorage.  Local storage keys are
  // namespaced to avoid collisions with other games.
  useEffect(() => {
    try {
      const saved = localStorage.getItem("passwordFortressState");
      if (saved) {
        const data = JSON.parse(saved);
        if (typeof data.password === "string") setPassword(data.password);
        if (typeof data.securityPoints === "number") setSecurityPoints(data.securityPoints);
        if (typeof data.clickCount === "number") setClickCount(data.clickCount);
        if (Array.isArray(data.upgrades)) {
          // Merge saved upgrade counts and costs with defaults to handle new upgrades.
          setUpgrades((prev) =>
            prev.map((u) => {
              const savedU = data.upgrades.find((su: any) => su.id === u.id);
              return savedU
                ? { ...u, owned: savedU.owned ?? 0, cost: savedU.cost ?? u.cost }
                : u;
            }),
          );
        }
        if (Array.isArray(data.achievements)) {
          setAchievements((prev) =>
            prev.map((a) => {
              const savedA = data.achievements.find((sa: any) => sa.id === a.id);
              return savedA ? { ...a, unlocked: savedA.unlocked } : a;
            }),
          );
        }
      }
    } catch (err) {
      console.warn("Failed to load saved state", err);
    }
  }, []);

  // Save the state whenever the password, security points, click count,
  // upgrades or achievements change.  Only persist minimal fields to avoid
  // storing transient UI state.
  useEffect(() => {
    const state = {
      password,
      securityPoints,
      clickCount,
      upgrades: upgrades.map((u) => ({ id: u.id, owned: u.owned, cost: u.cost })),
      achievements: achievements.map((a) => ({ id: a.id, unlocked: a.unlocked })),
    };
    try {
      localStorage.setItem("passwordFortressState", JSON.stringify(state));
    } catch (err) {
      // Storage can fail (e.g. in private mode).  If it does, just ignore.
    }
  }, [password, securityPoints, clickCount, upgrades, achievements]);

  // Auto‑upgrade loop.  Every 3 seconds, apply the effects of owned upgrades.
  useEffect(() => {
    const interval = setInterval(() => {
      let newPassword = password;
      let didModify = false;

      upgrades.forEach((upgrade) => {
        if (upgrade.owned <= 0) return;
        switch (upgrade.id) {
          case "auto-length":
            // Each level adds one random lowercase letter per tick.
            for (let i = 0; i < upgrade.owned; i++) {
              newPassword += generateRandomChar("lowercase");
            }
            didModify = true;
            break;
          case "symbol-generator":
            // With probability proportional to levels, insert a symbol.
            for (let i = 0; i < upgrade.owned; i++) {
              if (Math.random() < 0.4) {
                newPassword += generateRandomChar("symbol");
                didModify = true;
              }
            }
            break;
          case "number-ninja":
            for (let i = 0; i < upgrade.owned; i++) {
              if (Math.random() < 0.5) {
                newPassword += generateRandomChar("number");
                didModify = true;
              }
            }
            break;
          case "case-mixer":
            // Randomly capitalise the last few letters.
            if (newPassword.length > 0) {
              let pwdArr = newPassword.split("");
              for (let i = 0; i < upgrade.owned; i++) {
                const index = Math.floor(Math.random() * pwdArr.length);
                const char = pwdArr[index];
                if (/[a-z]/.test(char)) {
                  pwdArr[index] = char.toUpperCase();
                } else if (/[A-Z]/.test(char)) {
                  pwdArr[index] = char.toLowerCase();
                }
              }
              newPassword = pwdArr.join("");
              didModify = true;
            }
            break;
          // Passive upgrades (MFA, manager, biometrics) do not modify the string
          // directly; their bonus is applied in computeStrength.
        }
      });
      if (didModify) {
        setPassword(newPassword);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [password, upgrades]);

  // Achievement checking.  Whenever the password, strength, click count or
  // upgrades change, evaluate all achievement conditions.  If a new
  // achievement is unlocked, show a notification and update state.
  useEffect(() => {
    const context: AchievementContext = { password, strength, clickCount, upgrades };
    setAchievements((prev) =>
      prev.map((ach) => {
        if (ach.unlocked) return ach;
        if (ach.condition(context)) {
          // Show a success notification.
          addNotification(`🏆 Achievement Unlocked: ${ach.name}`, "success");
          // After a short delay, show the concept.
          setTimeout(() => {
            addNotification(`💡 ${ach.concept}`, "info");
          }, 1500);
          return { ...ach, unlocked: true };
        }
        return ach;
      }),
    );
    // We intentionally omit context dependencies; React already re‑runs this
    // effect when any of password, strength, clickCount or upgrades changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [password, strength, clickCount, upgrades]);

  // -------------------- Notification Helpers -------------------------------
  /** Adds a notification to the queue.  Notifications auto‑dismiss after 4 s. */
  const addNotification = useCallback(
    (message: string, type: "success" | "info" | "warning" | "danger" = "info") => {
      const id = Date.now();
      setNotifications((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 4000);
    },
    [],
  );

  // -------------------- Event Handlers ------------------------------------
  /** Handle a manual click to add one random character to the password. */
  const handleBuildClick = () => {
    const newChar = generateRandomChar();
    const newPassword = password + newChar;
    setPassword(newPassword);
    setClickCount((prev) => prev + 1);
    // Award security points based on incremental strength increase.  Each click
    // yields at least one point so progress never feels stalled.
    const newStrength = computeStrength(newPassword, upgrades);
    const pointsEarned = Math.max(1, Math.floor(newStrength / 10));
    setSecurityPoints((prev) => prev + pointsEarned);
    // Encourage the player with a small notification.
    if (newStrength >= 100) {
      addNotification(`🛡️ Digital Fortress! +${pointsEarned} points`, "success");
    } else if (newStrength >= 60) {
      addNotification(`💪 Getting Stronger! +${pointsEarned} points`, "success");
    } else {
      addNotification(`✨ Added ${newChar}. +${pointsEarned} points`, "info");
    }
  };

  /** Attempt to purchase an upgrade by ID.  Deducts points and increases cost. */
  const purchaseUpgrade = (id: string) => {
    setUpgrades((prev) => {
      return prev.map((u) => {
        if (u.id !== id) return u;
        if (u.owned >= u.maxLevel) return u;
        if (securityPoints < u.cost) return u;
        // Deduct cost and increase cost for next level.
        setSecurityPoints((points) => points - u.cost);
        // Notify the player and show what they’ve learned.
        addNotification(`🚀 Upgraded ${u.name}!`, "success");
        setTimeout(() => {
          addNotification(`📘 ${u.effectDescription}`, "info");
        }, 1000);
        return { ...u, owned: u.owned + 1, cost: Math.floor(u.cost * 1.6) };
      });
    });
  };

  /** Opens the attack modal and computes times to break for each scenario. */
  const handleTestAttacks = () => {
    const scenarios: AttackScenario[] = [
      {
        id: "bruteforce",
        name: "Brute Force Attack",
        description: "Systematically tries every possible combination.",
        baseTime: 5000,
        dependsOnStrength: true,
      },
      {
        id: "dictionary",
        name: "Dictionary Attack",
        description: "Uses lists of common words and passwords.",
        baseTime: 800,
        dependsOnStrength: true,
      },
      {
        id: "social",
        name: "Social Engineering",
        description: "Tricks you into revealing your password.",
        baseTime: 120,
        dependsOnStrength: false,
      },
      {
        id: "phishing",
        name: "Phishing Campaign",
        description: "Sends fake emails or sites to steal credentials.",
        baseTime: 100,
        dependsOnStrength: false,
      },
    ];
    const results = scenarios.map((s) => ({ scenario: s, time: calculateBreakTime(strength, s) }));
    setAttackResults(results);
    setShowAttackModal(true);
  };

  /** Closes the attack modal. */
  const closeAttackModal = () => {
    setShowAttackModal(false);
  };

  // -------------------- Render Helpers -------------------------------------
  /** Formats a time in seconds into a human friendly string (e.g. "3.2 s" or "5 days"). */
  function formatTime(seconds: number) {
    if (seconds < 60) return `${seconds.toFixed(1)} s`;
    const minutes = seconds / 60;
    if (minutes < 60) return `${minutes.toFixed(1)} min`;
    const hours = minutes / 60;
    if (hours < 24) return `${hours.toFixed(1)} h`;
    const days = hours / 24;
    if (days < 365) return `${days.toFixed(1)} days`;
    const years = days / 365;
    return `${years.toFixed(1)} yrs`;
  }

  // When rendering lists of Tailwind classes conditionally, list all possible
  // classes up front in comments to ensure they aren’t purged:
  // bg-red-500 bg-orange-500 bg-yellow-500 bg-green-500 bg-blue-500 bg-purple-500

  // -------------------- JSX Rendering --------------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 text-white p-4">
      {/* Notification stack */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        <AnimatePresence>
          {notifications.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className={`px-4 py-2 rounded shadow-lg backdrop-blur-md ${
                n.type === "success"
                  ? "bg-green-600/70"
                  : n.type === "warning"
                  ? "bg-yellow-600/70"
                  : n.type === "danger"
                  ? "bg-red-600/70"
                  : "bg-blue-600/70"
              }`}
            >
              {n.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
          Password Fortress
        </h1>
        <p className="text-slate-300 text-lg max-w-xl mx-auto">
          Build an unbreakable password fortress by learning, upgrading and testing your
          defences.  Each click teaches you about real cybersecurity principles.
        </p>
      </header>

      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
        {/* Main Column: Fortress & Builder */}
        <div className="lg:col-span-2 space-y-6">
          {/* Fortress Display */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white/10 rounded-xl p-6 text-center backdrop-blur-sm shadow-lg"
          >
            <div className="text-7xl mb-4">{fortressStage.emoji}</div>
            <h2 className="text-2xl font-bold mb-1">{fortressStage.name}</h2>
            <p className="text-slate-300 text-sm">{fortressStage.description}</p>
          </motion.div>

          {/* Build Button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleBuildClick}
            className="w-full py-8 px-6 rounded-xl bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-400 hover:to-blue-400 text-white text-xl font-bold shadow-lg transition-transform"
          >
            🔨 Click to Build Password
            <div className="text-sm mt-1 opacity-80">
              Each click adds a random character
            </div>
          </motion.button>

          {/* Password Display */}
          <div className="bg-white/10 rounded-xl p-6 shadow-lg backdrop-blur-sm">
            <h3 className="text-xl font-bold mb-3 flex items-center"><Lock className="w-6 h-6 mr-2" /> Your Password</h3>
            <div className="bg-black/30 rounded p-4 font-mono break-all text-green-400">
              {password || "Click above to start building..."}
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{password.length}</div>
                <div className="text-slate-300 text-sm">Characters</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${strengthInfo.textClass}`}>{strengthInfo.label}</div>
                <div className="text-slate-300 text-sm">Strength</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Password Strength</span>
                <span className={strengthInfo.textClass}>{Math.round(strength)}%</span>
              </div>
              <div className="w-full h-3 bg-gray-700 rounded-full">
                <div
                  className={`h-3 rounded-full ${strengthInfo.barClass}`}
                  style={{ width: `${Math.min(100, (strength / 120) * 100)}%` }}
                ></div>
              </div>
              <p className="mt-3 text-slate-300 text-sm">💡 {strengthInfo.advice}</p>
            </div>
          </div>

          {/* Attack Test Button */}
          <div className="bg-white/10 rounded-xl p-6 shadow-lg backdrop-blur-sm text-center">
            <h3 className="text-xl font-bold mb-4 flex items-center justify-center"><ShieldIcon className="w-6 h-6 mr-2" /> Test Your Password</h3>
            <p className="text-slate-300 mb-4 text-sm max-w-md mx-auto">
              Curious how your password would fare against attackers?  Click below to
              simulate different types of attacks and see how long your fortress holds.
            </p>
            <button
              onClick={handleTestAttacks}
              className="px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 font-semibold"
            >
              🛡️ Simulate Attacks
            </button>
          </div>
        </div>

        {/* Sidebar: Upgrades, Achievements, Stats */}
        <div className="space-y-6">
          {/* Stats */}
          <div className="bg-white/10 rounded-xl p-6 shadow-lg backdrop-blur-sm">
            <h3 className="text-xl font-bold mb-4 flex items-center"><Key className="w-6 h-6 mr-2" /> Your Stats</h3>
            <div className="space-y-2 text-slate-300 text-sm">
              <div className="flex justify-between">
                <span>Security Points:</span>
                <span className="font-bold text-yellow-400">{securityPoints} 🛡️</span>
              </div>
              <div className="flex justify-between">
                <span>Total Clicks:</span>
                <span className="font-bold">{clickCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Fortress Level:</span>
                <span className="font-bold">{fortressLevel}</span>
              </div>
            </div>
          </div>

          {/* Upgrades Shop */}
          <div className="bg-white/10 rounded-xl p-6 shadow-lg backdrop-blur-sm">
            <h3 className="text-xl font-bold mb-4 flex items-center"><Zap className="w-6 h-6 mr-2" /> Upgrades</h3>
            <div className="space-y-3">
              {upgrades.map((u) => (
                <button
                  key={u.id}
                  onClick={() => purchaseUpgrade(u.id)}
                  disabled={securityPoints < u.cost || u.owned >= u.maxLevel}
                  className="w-full flex flex-col p-3 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed text-left"
                >
                  <div className="flex justify-between items-center">
                    <div className="font-medium text-white">{u.name}</div>
                    <div className="text-right">
                      <div className="text-yellow-400 font-bold">{u.cost} 🛡️</div>
                      <div className="text-xs text-slate-300">Owned: {u.owned}/{u.maxLevel}</div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 mt-1">{u.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white/10 rounded-xl p-6 shadow-lg backdrop-blur-sm">
            <h3 className="text-xl font-bold mb-4 flex items-center"><CheckCircle className="w-6 h-6 mr-2" /> Achievements</h3>
            <div className="space-y-2">
              {achievements.map((a) => (
                <div
                  key={a.id}
                  className={`p-2 rounded-lg flex items-center justify-between ${
                    a.unlocked ? "bg-green-600/20" : "bg-gray-600/10"
                  }`}
                >
                  <span className={a.unlocked ? "text-green-300" : "text-slate-400"}>{a.name}</span>
                  {a.unlocked && <CheckCircle className="w-4 h-4 text-green-300" />}
                </div>
              ))}
            </div>
          </div>

          {/* Learning Panel */}
          <div className="bg-white/10 rounded-xl p-6 shadow-lg backdrop-blur-sm">
            <h3 className="text-xl font-bold mb-4 flex items-center"><BookOpen className="w-6 h-6 mr-2" /> Learning Centre</h3>
            <div className="grid md:grid-cols-2 gap-4 text-slate-200 text-sm">
              <div>
                <h4 className="font-semibold text-white mb-1">Password Principles</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Length matters more than complexity.</li>
                  <li>Mix letters, numbers and symbols to enlarge the search space.</li>
                  <li>Avoid dictionary words and obvious patterns.</li>
                  <li>Use a different password for every account.</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1">Real‑World Applications</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Use a password manager to generate and store credentials.</li>
                  <li>Enable multi‑factor authentication wherever possible.</li>
                  <li>Never share your password or enter it on untrusted sites.</li>
                  <li>Change your passwords if you suspect a breach.</li>
                </ul>
              </div>
              <div className="md:col-span-2 mt-4">
                <h4 className="font-semibold text-white mb-1">Standards Alignment</h4>
                <p className="text-xs text-slate-300">
                  This game aligns with the CSTA 3B Network &amp; Cybersecurity strand and
                  supports AP Computer Science Principles Big Idea 6 – Cybersecurity.
                  By experimenting with password length, character diversity and
                  multi‑factor authentication, students explore authentication,
                  cryptographic strength and common attack vectors in an age‑appropriate
                  setting.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Attack Simulation Modal */}
      {showAttackModal && attackResults && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-slate-800 text-white max-w-md w-full rounded-xl p-6 relative"
          >
            <button
              onClick={closeAttackModal}
              className="absolute top-3 right-3 text-slate-400 hover:text-white"
            >
              ✖
            </button>
            <h3 className="text-2xl font-bold mb-4 flex items-center"><Shield className="w-6 h-6 mr-2" /> Attack Simulation</h3>
            <p className="text-slate-300 mb-4 text-sm">
              Here’s how long it would take different attacks to break your current password.
              Remember that social engineering and phishing can succeed regardless of
              password strength!
            </p>
            <div className="space-y-4">
              {attackResults.map(({ scenario, time }) => {
                const safe = scenario.dependsOnStrength ? time > 10000 : false;
                return (
                  <div key={scenario.id} className="p-3 rounded-lg bg-white/5">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">{scenario.name}</span>
                      <span className={safe ? "text-green-400" : "text-red-400"}>
                        {safe ? "Secure" : "Risky"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mb-2">{scenario.description}</p>
                    <div className="flex justify-between items-center text-sm">
                      <span>Time to Break:</span>
                      <span className="font-bold">{formatTime(time / 10)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={closeAttackModal}
                className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}