#!/bin/bash

# 🚀 Repository Engineer - Production Deployment Monitoring Script
# 
# PURPOSE: Monitor EWU Cyber Games Portal deployment and ensure zero downtime
# TARGET: https://jdoner02.github.io/ewu-cyber-games-portal/
# REQUIREMENTS: Continuous monitoring for cyber camp students

echo "🚀 Repository Engineer - Production Deployment Monitor"
echo "=================================================="
echo "📅 Monitor Start: $(date)"
echo "🌐 Target Site: https://jdoner02.github.io/ewu-cyber-games-portal/"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check site health
check_site_health() {
    local url=$1
    local description=$2
    
    echo -n "🔍 Checking $description... "
    
    # Check if site is accessible and measure response time
    response=$(curl -s -o /dev/null -w "%{http_code},%{time_total}" "$url" --max-time 10)
    
    if [ $? -eq 0 ]; then
        http_code=$(echo $response | cut -d',' -f1)
        response_time=$(echo $response | cut -d',' -f2)
        
        if [ "$http_code" = "200" ]; then
            echo -e "${GREEN}✅ OK${NC} (${response_time}s)"
            return 0
        else
            echo -e "${RED}❌ HTTP $http_code${NC}"
            return 1
        fi
    else
        echo -e "${RED}❌ UNREACHABLE${NC}"
        return 1
    fi
}

# Function to check GitHub Actions status
check_github_actions() {
    echo "🔄 Checking GitHub Actions deployment status..."
    
    # Note: This would require GitHub CLI or API token for full automation
    # For now, we'll provide manual check instructions
    echo -e "${BLUE}ℹ️  Check deployment status at:${NC}"
    echo "   https://github.com/jdoner02/ewu-cyber-games-portal/actions"
    echo ""
}

# Main monitoring loop
main_monitoring() {
    local check_count=0
    local max_checks=10
    local wait_time=30
    
    echo "🎯 Starting continuous health monitoring..."
    echo "📊 Will perform $max_checks checks every ${wait_time}s"
    echo ""
    
    while [ $check_count -lt $max_checks ]; do
        check_count=$((check_count + 1))
        echo "📋 Health Check #$check_count of $max_checks"
        echo "⏰ Time: $(date)"
        
        # Critical endpoints for cyber camp students
        local all_healthy=true
        
        check_site_health "https://jdoner02.github.io/ewu-cyber-games-portal/" "Homepage" || all_healthy=false
        check_site_health "https://jdoner02.github.io/ewu-cyber-games-portal/games/pokemon-cyber-mmo/" "Pokemon Cyber MMO" || all_healthy=false
        check_site_health "https://jdoner02.github.io/ewu-cyber-games-portal/games/password-fortress/" "Password Fortress" || all_healthy=false
        check_site_health "https://jdoner02.github.io/ewu-cyber-games-portal/learning/" "Learning Hub" || all_healthy=false
        check_site_health "https://jdoner02.github.io/ewu-cyber-games-portal/security/" "Security Lab" || all_healthy=false
        
        if [ "$all_healthy" = true ]; then
            echo -e "${GREEN}🎉 All systems operational!${NC}"
        else
            echo -e "${YELLOW}⚠️  Some services experiencing issues${NC}"
        fi
        
        echo "----------------------------------------"
        
        if [ $check_count -lt $max_checks ]; then
            echo "⏳ Waiting ${wait_time}s before next check..."
            sleep $wait_time
        fi
    done
}

# Performance baseline check
check_performance() {
    echo "⚡ Performance Baseline Check"
    echo "============================="
    
    local url="https://jdoner02.github.io/ewu-cyber-games-portal/"
    echo "🔍 Measuring homepage performance..."
    
    # Perform multiple requests to get average
    local total_time=0
    local request_count=5
    
    for i in $(seq 1 $request_count); do
        response_time=$(curl -s -o /dev/null -w "%{time_total}" "$url" --max-time 10)
        total_time=$(echo "$total_time + $response_time" | bc -l)
        echo "   Request $i: ${response_time}s"
    done
    
    local avg_time=$(echo "$total_time / $request_count" | bc -l)
    echo ""
    echo "📊 Average Response Time: ${avg_time}s"
    
    # Alert if performance is degraded
    if (( $(echo "$avg_time > 3.0" | bc -l) )); then
        echo -e "${YELLOW}⚠️  Warning: Response time exceeds 3s threshold${NC}"
    else
        echo -e "${GREEN}✅ Performance within acceptable range${NC}"
    fi
    echo ""
}

# Student impact assessment
check_student_impact() {
    echo "🎓 Student Impact Assessment"
    echo "============================"
    
    # Key features that students use
    local student_features=(
        "https://jdoner02.github.io/ewu-cyber-games-portal/games/pokemon-cyber-mmo/"
        "https://jdoner02.github.io/ewu-cyber-games-portal/games/password-fortress/"
        "https://jdoner02.github.io/ewu-cyber-games-portal/games/phishing-detective/"
        "https://jdoner02.github.io/ewu-cyber-games-portal/learning/"
    )
    
    local feature_names=(
        "Pokemon Cyber MMO"
        "Password Fortress"
        "Phishing Detective"
        "Learning Hub"
    )
    
    local operational_count=0
    
    for i in "${!student_features[@]}"; do
        if check_site_health "${student_features[$i]}" "${feature_names[$i]}"; then
            operational_count=$((operational_count + 1))
        fi
    done
    
    local operational_percentage=$((operational_count * 100 / ${#student_features[@]}))
    
    echo ""
    echo "📈 Student Service Availability: $operational_percentage% ($operational_count/${#student_features[@]} features)"
    
    if [ $operational_percentage -eq 100 ]; then
        echo -e "${GREEN}🎉 All student features fully operational!${NC}"
    elif [ $operational_percentage -ge 75 ]; then
        echo -e "${YELLOW}⚠️  Partial service availability - monitor closely${NC}"
    else
        echo -e "${RED}🚨 Critical: Major service disruption affecting students${NC}"
    fi
    echo ""
}

# Execute monitoring
echo "🚀 Starting Repository Engineer Production Monitoring"
echo "======================================================"

check_github_actions
check_performance
check_student_impact
main_monitoring

echo ""
echo "📊 Monitoring Complete"
echo "====================="
echo "📅 Monitor End: $(date)"
echo "🎯 Status: Deployment monitoring completed successfully"
echo ""
echo "🎪 Next Steps:"
echo "   1. Continue periodic health checks"
echo "   2. Monitor student usage patterns"
echo "   3. Track performance metrics"
echo "   4. Respond to any issues immediately"
echo ""
echo "🌐 Live Site: https://jdoner02.github.io/ewu-cyber-games-portal/"
echo "📱 GitHub Actions: https://github.com/jdoner02/ewu-cyber-games-portal/actions"
