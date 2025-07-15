# Production Deployment Guide

## Overview
This guide covers the deployment of the EWU Cyber Games Portal to GitHub Pages for educational use by middle school students.

## Prerequisites

### System Requirements
- Node.js 18+ (LTS recommended)
- npm 9+ or yarn 3+
- Git 2.28+

### Development Environment
```bash
# Verify Node.js version
node --version

# Verify npm version
npm --version

# Verify Git version
git --version
```

## Deployment Architecture

### GitHub Pages Configuration
- **Source**: GitHub Actions workflow
- **Branch**: `gh-pages` (auto-generated)
- **Custom Domain**: Optional
- **HTTPS**: Enforced

### Static Site Generation
- **Framework**: Next.js with static export
- **Build Output**: `/out` directory
- **Asset Optimization**: Disabled for GitHub Pages compatibility
- **Image Handling**: Unoptimized for static deployment

## Deployment Process

### 1. Repository Setup
```bash
# Create new repository
gh repo create ewu-cyber-games-portal --public

# Add remote origin
git remote add origin https://github.com/jdoner02/ewu-cyber-games-portal.git

# Set default branch
git branch -M main
```

### 2. GitHub Pages Configuration
1. Navigate to repository Settings
2. Go to Pages section
3. Set Source to "GitHub Actions"
4. Configure custom domain (optional)
5. Enable "Enforce HTTPS"

### 3. Automated Deployment
The GitHub Actions workflow automatically:
1. Runs tests on every push/PR
2. Builds the application
3. Deploys to GitHub Pages on main branch updates

### 4. Manual Deployment (if needed)
```bash
# Install dependencies
npm ci

# Run tests
npm test

# Build for production
npm run build

# Serve locally for testing
npm run serve
```

## Environment Configuration

### Production Environment Variables
```bash
# Next.js configuration
NEXT_TELEMETRY_DISABLED=1
NODE_ENV=production

# GitHub Pages specific
GITHUB_PAGES=true
```

### Build Configuration
```typescript
// next.config.ts
const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  assetPrefix: process.env.NODE_ENV === 'production' ? '/ewu-cyber-games-portal' : '',
};
```

## Security Configuration

### HTTPS Enforcement
- GitHub Pages automatically provides SSL/TLS
- HSTS headers configured in Next.js
- All HTTP traffic redirected to HTTPS

### Content Security Policy
Comprehensive CSP headers prevent:
- Cross-site scripting (XSS)
- Code injection attacks
- Clickjacking attempts
- Unauthorized resource loading

### Access Controls
- Public repository for educational transparency
- No authentication required for student access
- No personal data collection or storage

## Performance Optimization

### Static Asset Optimization
- **Images**: Optimized for web delivery
- **CSS**: Minified and compressed
- **JavaScript**: Tree-shaken and minified
- **Fonts**: Preloaded for performance

### Caching Strategy
- **GitHub CDN**: Global content distribution
- **Browser Caching**: Long-term caching for static assets
- **Service Worker**: Offline capability (future enhancement)

## Monitoring & Maintenance

### Automated Monitoring
- **GitHub Actions**: Build and deployment status
- **Dependabot**: Security and dependency updates
- **CodeQL**: Static code analysis

### Performance Monitoring
- **Lighthouse CI**: Automated performance audits
- **Core Web Vitals**: User experience metrics
- **Bundle Analysis**: Asset size monitoring

### Manual Monitoring
- **Weekly**: Verify site accessibility
- **Monthly**: Review security alerts
- **Quarterly**: Full performance audit

## Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Run local build test
npm run build
```

#### Deployment Issues
```bash
# Check GitHub Actions logs
gh run list

# View specific run details
gh run view [RUN_ID]
```

#### Performance Issues
```bash
# Analyze bundle size
npm run build
npx @next/bundle-analyzer
```

### Support Contacts
- **Technical Issues**: GitHub Issues
- **Educational Content**: EWU Cybersecurity Program
- **Security Concerns**: Private security advisory

## Educational Deployment Checklist

### Pre-Deployment
- [ ] All tests passing (28/28)
- [ ] Security audit clean
- [ ] Content review complete
- [ ] Age-appropriate language verified
- [ ] COPPA/FERPA compliance confirmed

### Post-Deployment
- [ ] Site accessibility verified
- [ ] Mobile responsiveness tested
- [ ] Educational content validated
- [ ] Performance metrics within targets
- [ ] Security headers functioning

### Student Readiness
- [ ] Clear learning objectives
- [ ] Age-appropriate interface
- [ ] Safe exploration environment
- [ ] No data collection
- [ ] Parental transparency

## Future Enhancements

### Planned Features
- [ ] Offline capability with service workers
- [ ] Progressive Web App (PWA) features
- [ ] Enhanced accessibility features
- [ ] Multi-language support
- [ ] Teacher dashboard (future consideration)

### Scalability Considerations
- [ ] CDN optimization for global access
- [ ] Performance monitoring integration
- [ ] Load testing for classroom use
- [ ] Backup deployment strategy

---

**Deployment Authority**: Repository Engineer  
**Document Version**: 1.0  
**Last Updated**: 2025-01-15  
**Next Review**: 2025-02-15
