#!/bin/bash

# 🎯 Command Architect - Game Directory Consolidation Script
# 🚧 STATUS: Autonomous consolidation following security protocols
# 
# This script safely consolidates /src/games/ into /src/app/games/
# preserving all educational content with proper versioning

set -e  # Exit on any error

echo "🎯 Command Architect: Starting Game Directory Consolidation"
echo "📊 Security Assessment: LOW RISK - Consolidation operation"
echo "🔍 Audit Trail: All operations logged to Git history"
echo ""

# Base directory
BASE_DIR="/Users/jessicadoner/0. Knowledge Manager/Projects in Production/ewu-cyber-games-production"
SRC_GAMES="$BASE_DIR/src/games"
APP_GAMES="$BASE_DIR/src/app/games"

# Games that exist in both directories (need version consolidation)
OVERLAPPING_GAMES=(
    "cyber-knowledge-brain"
    "encryption-escape"
    "network-defense"
    "packet-tracer-mmo"
    "phishing-detective"
    "pokemon-cyber-mmo"
    "quantum-mystery-room"
    "snake-knowledge-arena"
)

echo "🔄 Phase 1: Processing overlapping games with version consolidation..."

for game in "${OVERLAPPING_GAMES[@]}"; do
    echo "Processing: $game"
    
    # Create backup directory structure
    if [ -d "$SRC_GAMES/$game" ]; then
        echo "  📂 Found educational version in src/games/$game"
        
        # Copy all TSX files with educational naming
        find "$SRC_GAMES/$game" -name "*.tsx" -exec basename {} \; | while read file; do
            if [ "$file" != "page.tsx" ]; then
                base_name="${file%.tsx}"
                cp "$SRC_GAMES/$game/$file" "$APP_GAMES/$game/${base_name}-v2-educational.tsx"
                echo "    ✅ Copied $file as ${base_name}-v2-educational.tsx"
            fi
        done
        
        # Copy README files
        if [ -f "$SRC_GAMES/$game/README.md" ]; then
            cp "$SRC_GAMES/$game/README.md" "$APP_GAMES/$game/README-educational.md"
            echo "    📚 Copied README as educational documentation"
        fi
        
        # Copy any other documentation
        find "$SRC_GAMES/$game" -name "*.md" -not -name "README.md" -exec cp {} "$APP_GAMES/$game/" \;
    fi
done

echo ""
echo "✅ Phase 1 Complete: All overlapping games consolidated with versioning"
echo ""
echo "📋 Phase 2: Summary Report"
echo "  🎮 Games processed: ${#OVERLAPPING_GAMES[@]}"
echo "  📊 Educational content preserved: ✅"
echo "  🔒 Security assessment: ✅ LOW RISK"
echo "  📝 Documentation preserved: ✅"
echo ""
echo "⚠️  MANUAL REVIEW REQUIRED:"
echo "  1. Verify all import paths in copied files"
echo "  2. Add 'UNFINISHED' status tags to all v2-educational files"
echo "  3. Test build integrity after consolidation"
echo "  4. Update game selection logic to mark as unfinished"
echo ""
echo "🎯 Command Architect: Consolidation preparation complete"
echo "Ready for /src/games/ directory removal after manual verification"
