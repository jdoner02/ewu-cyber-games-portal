/**
 * Container Security Management System
 * Implements comprehensive container security for agent isolation and protection
 * Following CIS Docker Benchmark and NIST container security guidelines
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Container Security Interfaces
export interface ContainerConfig {
  name: string
  image: string
  tag: string
  ports: number[]
  environment: Record<string, string>
  volumes: VolumeMount[]
  securityContext: SecurityContext
  resources: ResourceLimits
  networkPolicy: NetworkPolicy
}

export interface VolumeMount {
  hostPath: string
  containerPath: string
  readOnly: boolean
  type: 'bind' | 'volume' | 'tmpfs'
}

export interface SecurityContext {
  runAsUser: number
  runAsGroup: number
  runAsNonRoot: boolean
  readOnlyRootFilesystem: boolean
  allowPrivilegeEscalation: boolean
  capabilities: {
    add: string[]
    drop: string[]
  }
  seccompProfile: string
  seLinuxOptions?: SELinuxOptions
}

export interface SELinuxOptions {
  level: string
  role: string
  type: string
  user: string
}

export interface ResourceLimits {
  cpu: string // e.g., "100m" for 0.1 CPU
  memory: string // e.g., "128Mi"
  storage: string // e.g., "1Gi"
  maxFileDescriptors: number
  maxProcesses: number
}

export interface NetworkPolicy {
  isolation: 'none' | 'pod' | 'namespace' | 'cluster'
  allowedIngress: NetworkRule[]
  allowedEgress: NetworkRule[]
  dnsPolicy: 'ClusterFirst' | 'Default' | 'None'
}

export interface NetworkRule {
  from?: string[]
  to?: string[]
  ports: number[]
  protocols: ('TCP' | 'UDP' | 'ICMP')[]
}

// Container Vulnerability
export interface ContainerVulnerability {
  id: string
  containerId: string
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'UNKNOWN'
  title: string
  description: string
  packageName?: string
  installedVersion?: string
  fixedVersion?: string
  cveId?: string
  cvssScore?: number
  references: string[]
  discoveredAt: string
  status: 'open' | 'patched' | 'ignored' | 'false_positive'
}

// Image Scan Result
export interface ImageScanResult {
  imageId: string
  imageName: string
  imageTag: string
  scanDate: string
  vulnerabilities: ContainerVulnerability[]
  configurationIssues: ConfigurationIssue[]
  malwareDetected: boolean
  overallRiskScore: number
  compliance: ComplianceResult[]
  recommendations: string[]
}

export interface ConfigurationIssue {
  id: string
  severity: 'HIGH' | 'MEDIUM' | 'LOW'
  title: string
  description: string
  remediation: string
  cis_benchmark?: string
}

export interface ComplianceResult {
  framework: string
  version: string
  score: number
  passedChecks: number
  totalChecks: number
  failedChecks: ComplianceCheck[]
}

export interface ComplianceCheck {
  checkId: string
  title: string
  description: string
  severity: string
  remediation: string
}

// Secure Container
export interface SecureContainer {
  id: string
  name: string
  config: ContainerConfig
  securityPolicies: SecurityPolicy[]
  networkIsolation: NetworkIsolation
  resourceLimits: ResourceLimits
  monitoringEnabled: boolean
  status: 'creating' | 'running' | 'stopped' | 'error'
  lastSecurityScan?: string
  vulnerabilityCount: {
    critical: number
    high: number
    medium: number
    low: number
  }
  complianceScore: number
  createdAt: string
  lastUpdated: string
}

export interface SecurityPolicy {
  id: string
  name: string
  type: 'access_control' | 'network' | 'resource' | 'runtime'
  rules: PolicyRule[]
  enabled: boolean
}

export interface PolicyRule {
  id: string
  description: string
  condition: string
  action: 'allow' | 'deny' | 'audit'
  priority: number
}

export interface NetworkIsolation {
  vpcId?: string
  subnetId?: string
  securityGroupIds: string[]
  allowedCommunication: string[]
  blockedCommunication: string[]
  firewallRules: FirewallRule[]
}

export interface FirewallRule {
  id: string
  direction: 'inbound' | 'outbound'
  protocol: string
  port: number | string
  source: string
  destination: string
  action: 'allow' | 'deny'
}

// Container Security State
interface ContainerSecurityState {
  containers: SecureContainer[]
  scanResults: ImageScanResult[]
  vulnerabilities: ContainerVulnerability[]
  securityPolicies: SecurityPolicy[]
  isMonitoringEnabled: boolean
  defaultSecurityContext: SecurityContext
  
  // Actions
  scanContainerImage: (imageName: string, tag: string) => Promise<ImageScanResult>
  deploySecureContainer: (config: ContainerConfig) => Promise<SecureContainer>
  updateSecurityPolicy: (policy: SecurityPolicy) => void
  monitorContainerSecurity: (containerId: string) => Promise<void>
  generateComplianceReport: () => string
  remediateVulnerabilities: (containerId: string) => Promise<void>
  quarantineContainer: (containerId: string, reason: string) => void
}

export const useContainerSecurityStore = create<ContainerSecurityState>()(
  persist(
    (set, get) => ({
      containers: [],
      scanResults: [],
      vulnerabilities: [],
      securityPolicies: [
        // Default CIS Docker Benchmark policies
        {
          id: 'cis-docker-001',
          name: 'CIS Docker Benchmark - User Namespace',
          type: 'access_control',
          rules: [
            {
              id: 'rule-001',
              description: 'Ensure user namespace is enabled',
              condition: 'user_namespace_enabled',
              action: 'deny',
              priority: 1
            }
          ],
          enabled: true
        },
        {
          id: 'cis-docker-002',
          name: 'CIS Docker Benchmark - Network Security',
          type: 'network',
          rules: [
            {
              id: 'rule-002',
              description: 'Restrict network traffic between containers',
              condition: 'inter_container_communication',
              action: 'audit',
              priority: 2
            }
          ],
          enabled: true
        }
      ],
      isMonitoringEnabled: true,
      defaultSecurityContext: {
        runAsUser: 1000,
        runAsGroup: 1000,
        runAsNonRoot: true,
        readOnlyRootFilesystem: true,
        allowPrivilegeEscalation: false,
        capabilities: {
          add: [],
          drop: ['ALL']
        },
        seccompProfile: 'runtime/default'
      },
      
      // Actions
      scanContainerImage: async (imageName, tag) => {
        console.log(`🔍 Scanning container image: ${imageName}:${tag}`)
        
        // Simulate image scanning
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        const vulnerabilities: ContainerVulnerability[] = []
        const configurationIssues: ConfigurationIssue[] = []
        
        // Simulate vulnerability findings
        const vulnTypes = [
          { name: 'OpenSSL', severity: 'HIGH' as const, cve: 'CVE-2023-1234' },
          { name: 'curl', severity: 'MEDIUM' as const, cve: 'CVE-2023-5678' },
          { name: 'bash', severity: 'LOW' as const, cve: 'CVE-2023-9012' }
        ]
        
        vulnTypes.forEach((vuln, index) => {
          if (Math.random() < 0.3) { // 30% chance of finding each vulnerability
            vulnerabilities.push({
              id: `vuln_${Date.now()}_${index}`,
              containerId: `${imageName}:${tag}`,
              severity: vuln.severity,
              title: `${vuln.name} vulnerability`,
              description: `Vulnerability found in ${vuln.name} package`,
              packageName: vuln.name.toLowerCase(),
              installedVersion: '1.0.0',
              fixedVersion: '1.0.1',
              cveId: vuln.cve,
              cvssScore: vuln.severity === 'HIGH' ? 8.5 : vuln.severity === 'MEDIUM' ? 5.5 : 2.5,
              references: [`https://cve.mitre.org/cgi-bin/cvename.cgi?name=${vuln.cve}`],
              discoveredAt: new Date().toISOString(),
              status: 'open'
            })
          }
        })
        
        // Simulate configuration issues
        const configIssues = [
          { title: 'Running as root user', severity: 'HIGH' as const, cis: 'CIS-DI-0002' },
          { title: 'Unnecessary packages installed', severity: 'MEDIUM' as const, cis: 'CIS-DI-0003' },
          { title: 'Default secrets present', severity: 'HIGH' as const, cis: 'CIS-DI-0004' }
        ]
        
        configIssues.forEach((issue, index) => {
          if (Math.random() < 0.2) { // 20% chance of finding each issue
            configurationIssues.push({
              id: `config_${Date.now()}_${index}`,
              severity: issue.severity,
              title: issue.title,
              description: `Configuration issue: ${issue.title}`,
              remediation: `Follow CIS Docker Benchmark ${issue.cis} remediation steps`,
              cis_benchmark: issue.cis
            })
          }
        })
        
        // Calculate risk score
        const criticalCount = vulnerabilities.filter(v => v.severity === 'CRITICAL').length
        const highCount = vulnerabilities.filter(v => v.severity === 'HIGH').length + 
                         configurationIssues.filter(i => i.severity === 'HIGH').length
        const mediumCount = vulnerabilities.filter(v => v.severity === 'MEDIUM').length +
                           configurationIssues.filter(i => i.severity === 'MEDIUM').length
        
        const overallRiskScore = Math.min(
          criticalCount * 25 + highCount * 15 + mediumCount * 5, 100
        )
        
        // Generate compliance results
        const compliance: ComplianceResult[] = [
          {
            framework: 'CIS Docker Benchmark',
            version: '1.6.0',
            score: Math.max(0, 100 - overallRiskScore),
            passedChecks: 45 - configurationIssues.length,
            totalChecks: 45,
            failedChecks: configurationIssues.map(issue => ({
              checkId: issue.cis_benchmark || 'CIS-UNKNOWN',
              title: issue.title,
              description: issue.description,
              severity: issue.severity,
              remediation: issue.remediation
            }))
          }
        ]
        
        const scanResult: ImageScanResult = {
          imageId: `sha256:${Math.random().toString(36).substr(2, 64)}`,
          imageName,
          imageTag: tag,
          scanDate: new Date().toISOString(),
          vulnerabilities,
          configurationIssues,
          malwareDetected: Math.random() < 0.01, // 1% chance of malware
          overallRiskScore,
          compliance,
          recommendations: generateSecurityRecommendations(vulnerabilities, configurationIssues)
        }
        
        // Update state
        set(state => ({
          scanResults: [scanResult, ...state.scanResults].slice(0, 50),
          vulnerabilities: [...state.vulnerabilities, ...vulnerabilities]
        }))
        
        return scanResult
      },
      
      deploySecureContainer: async (config) => {
        console.log(`🚀 Deploying secure container: ${config.name}`)
        
        // Apply security hardening to config
        const hardenedConfig = applySecurityHardening(config, get().defaultSecurityContext)
        
        // Scan image before deployment
        const scanResult = await get().scanContainerImage(config.image, config.tag)
        
        if (scanResult.overallRiskScore > 70) {
          throw new Error(`Image security risk too high (${scanResult.overallRiskScore}/100). Address vulnerabilities before deployment.`)
        }
        
        // Create secure container
        const container: SecureContainer = {
          id: `container_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: config.name,
          config: hardenedConfig,
          securityPolicies: get().securityPolicies.filter(p => p.enabled),
          networkIsolation: generateNetworkIsolation(config.networkPolicy),
          resourceLimits: config.resources,
          monitoringEnabled: true,
          status: 'running',
          lastSecurityScan: new Date().toISOString(),
          vulnerabilityCount: {
            critical: scanResult.vulnerabilities.filter(v => v.severity === 'CRITICAL').length,
            high: scanResult.vulnerabilities.filter(v => v.severity === 'HIGH').length,
            medium: scanResult.vulnerabilities.filter(v => v.severity === 'MEDIUM').length,
            low: scanResult.vulnerabilities.filter(v => v.severity === 'LOW').length
          },
          complianceScore: scanResult.compliance[0]?.score || 0,
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        }
        
        // Add to state
        set(state => ({
          containers: [...state.containers, container]
        }))
        
        return container
      },
      
      updateSecurityPolicy: (policy) => {
        set(state => ({
          securityPolicies: state.securityPolicies.map(p => 
            p.id === policy.id ? policy : p
          )
        }))
      },
      
      monitorContainerSecurity: async (containerId) => {
        console.log(`🔍 Monitoring container security: ${containerId}`)
        
        const container = get().containers.find(c => c.id === containerId)
        if (!container) return
        
        // Simulate runtime security monitoring
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Check for runtime anomalies
        const anomalies = detectRuntimeAnomalies(container)
        
        if (anomalies.length > 0) {
          console.warn(`⚠️ Security anomalies detected in container ${containerId}:`, anomalies)
          
          // Auto-remediate if possible
          const remediated = await autoRemediateAnomalies(container, anomalies)
          if (!remediated) {
            console.error(`🚨 Manual intervention required for container ${containerId}`)
          }
        }
        
        // Update last monitoring time
        set(state => ({
          containers: state.containers.map(c => 
            c.id === containerId 
              ? { ...c, lastUpdated: new Date().toISOString() }
              : c
          )
        }))
      },
      
      generateComplianceReport: () => {
        const state = get()
        const report = {
          summary: {
            totalContainers: state.containers.length,
            compliantContainers: state.containers.filter(c => c.complianceScore >= 80).length,
            averageComplianceScore: state.containers.reduce((sum, c) => sum + c.complianceScore, 0) / (state.containers.length || 1),
            totalVulnerabilities: state.vulnerabilities.length,
            criticalVulnerabilities: state.vulnerabilities.filter(v => v.severity === 'CRITICAL').length
          },
          containers: state.containers.map(container => ({
            id: container.id,
            name: container.name,
            complianceScore: container.complianceScore,
            vulnerabilityCount: container.vulnerabilityCount,
            status: container.status,
            lastScanned: container.lastSecurityScan
          })),
          recommendations: [
            'Implement automated vulnerability scanning in CI/CD pipeline',
            'Regularly update base images to latest secure versions',
            'Enable runtime security monitoring for all containers',
            'Implement network segmentation for container workloads',
            'Use minimal base images to reduce attack surface'
          ],
          compliance: {
            'CIS Docker Benchmark': calculateCISCompliance(state.containers),
            'NIST Container Security': calculateNISTCompliance(state.containers),
            'PCI DSS': 'Assessment required for payment processing workloads'
          }
        }
        
        return JSON.stringify(report, null, 2)
      },
      
      remediateVulnerabilities: async (containerId) => {
        console.log(`🔧 Remediating vulnerabilities for container: ${containerId}`)
        
        const container = get().containers.find(c => c.id === containerId)
        if (!container) return
        
        const containerVulns = get().vulnerabilities.filter(v => v.containerId === containerId)
        
        // Simulate vulnerability remediation
        for (const vuln of containerVulns) {
          if (vuln.fixedVersion && vuln.severity !== 'LOW') {
            // Mark as patched
            set(state => ({
              vulnerabilities: state.vulnerabilities.map(v => 
                v.id === vuln.id ? { ...v, status: 'patched' } : v
              )
            }))
          }
        }
        
        // Update container vulnerability count
        const remainingVulns = get().vulnerabilities.filter(v => 
          v.containerId === containerId && v.status === 'open'
        )
        
        set(state => ({
          containers: state.containers.map(c => 
            c.id === containerId 
              ? { 
                  ...c, 
                  vulnerabilityCount: {
                    critical: remainingVulns.filter(v => v.severity === 'CRITICAL').length,
                    high: remainingVulns.filter(v => v.severity === 'HIGH').length,
                    medium: remainingVulns.filter(v => v.severity === 'MEDIUM').length,
                    low: remainingVulns.filter(v => v.severity === 'LOW').length
                  },
                  lastUpdated: new Date().toISOString()
                }
              : c
          )
        }))
      },
      
      quarantineContainer: (containerId, reason) => {
        console.log(`🔒 Quarantining container ${containerId}: ${reason}`)
        
        set(state => ({
          containers: state.containers.map(c => 
            c.id === containerId 
              ? { 
                  ...c, 
                  status: 'stopped',
                  lastUpdated: new Date().toISOString()
                }
              : c
          )
        }))
      }
    }),
    {
      name: 'container-security-store',
      partialize: (state) => ({
        containers: state.containers,
        scanResults: state.scanResults.slice(0, 20),
        vulnerabilities: state.vulnerabilities.slice(0, 100),
        securityPolicies: state.securityPolicies
      })
    }
  )
)

// Helper Functions
function applySecurityHardening(config: ContainerConfig, defaultContext: SecurityContext): ContainerConfig {
  return {
    ...config,
    securityContext: {
      ...defaultContext,
      ...config.securityContext,
      // Ensure critical security settings
      runAsNonRoot: true,
      readOnlyRootFilesystem: true,
      allowPrivilegeEscalation: false,
      // Remove potentially dangerous capabilities
      capabilities: {
        add: [],
        drop: ['ALL', 'CAP_NET_RAW', 'CAP_SYS_ADMIN', 'CAP_SYS_TIME']
      }
    }
  }
}

function generateNetworkIsolation(networkPolicy: NetworkPolicy): NetworkIsolation {
  return {
    securityGroupIds: ['sg-secure-default'],
    allowedCommunication: networkPolicy.allowedEgress.map(rule => rule.to?.join(',') || ''),
    blockedCommunication: ['0.0.0.0/0'], // Block all by default
    firewallRules: [
      {
        id: 'default-deny-all',
        direction: 'inbound',
        protocol: 'all',
        port: 'all',
        source: '0.0.0.0/0',
        destination: 'container',
        action: 'deny'
      }
    ]
  }
}

function detectRuntimeAnomalies(container: SecureContainer): string[] {
  const anomalies: string[] = []
  
  // Simulate runtime anomaly detection
  if (Math.random() < 0.05) anomalies.push('Unexpected network connections detected')
  if (Math.random() < 0.03) anomalies.push('Privilege escalation attempt detected')
  if (Math.random() < 0.02) anomalies.push('Suspicious file system modifications')
  if (Math.random() < 0.01) anomalies.push('Malicious process execution detected')
  
  return anomalies
}

async function autoRemediateAnomalies(container: SecureContainer, anomalies: string[]): Promise<boolean> {
  // Simulate auto-remediation
  console.log(`🔧 Attempting auto-remediation for ${anomalies.length} anomalies...`)
  
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Simple anomalies can be auto-remediated
  const remediableAnomalies = anomalies.filter(a => 
    a.includes('network connections') || a.includes('file system')
  )
  
  return remediableAnomalies.length === anomalies.length
}

function generateSecurityRecommendations(vulnerabilities: ContainerVulnerability[], configIssues: ConfigurationIssue[]): string[] {
  const recommendations: string[] = []
  
  if (vulnerabilities.length > 0) {
    recommendations.push('Update packages to latest versions to address vulnerabilities')
  }
  
  if (configIssues.some(i => i.severity === 'HIGH')) {
    recommendations.push('Address high-severity configuration issues immediately')
  }
  
  recommendations.push(
    'Use minimal base images to reduce attack surface',
    'Implement runtime security monitoring',
    'Enable vulnerability scanning in CI/CD pipeline',
    'Apply principle of least privilege for container permissions',
    'Use read-only file systems where possible'
  )
  
  return recommendations
}

function calculateCISCompliance(containers: SecureContainer[]): string {
  if (containers.length === 0) return '0% - No containers assessed'
  
  const totalScore = containers.reduce((sum, c) => sum + c.complianceScore, 0)
  const averageScore = totalScore / containers.length
  
  return `${averageScore.toFixed(1)}% compliant with CIS Docker Benchmark`
}

function calculateNISTCompliance(containers: SecureContainer[]): string {
  if (containers.length === 0) return '0% - No containers assessed'
  
  // NIST compliance based on security controls implementation
  const secureContainers = containers.filter(c => 
    c.complianceScore >= 80 && 
    c.vulnerabilityCount.critical === 0 && 
    c.vulnerabilityCount.high <= 2
  ).length
  
  const compliance = (secureContainers / containers.length) * 100
  
  return `${compliance.toFixed(1)}% compliant with NIST container security guidelines`
}

// Container Security Service
export class ContainerSecurityService {
  private static instance: ContainerSecurityService
  
  static getInstance(): ContainerSecurityService {
    if (!ContainerSecurityService.instance) {
      ContainerSecurityService.instance = new ContainerSecurityService()
    }
    return ContainerSecurityService.instance
  }
  
  // Continuous security monitoring
  startSecurityMonitoring(): void {
    const monitoringInterval = 5 * 60 * 1000 // 5 minutes
    
    setInterval(() => {
      const store = useContainerSecurityStore.getState()
      
      store.containers.forEach(container => {
        if (container.status === 'running') {
          store.monitorContainerSecurity(container.id)
        }
      })
    }, monitoringInterval)
  }
  
  // Security policy enforcement
  enforceSecurityPolicies(containerId: string): boolean {
    const store = useContainerSecurityStore.getState()
    const container = store.containers.find(c => c.id === containerId)
    
    if (!container) return false
    
    // Check each security policy
    for (const policy of container.securityPolicies) {
      if (!policy.enabled) continue
      
      for (const rule of policy.rules) {
        const violationDetected = this.checkPolicyViolation(container, rule)
        
        if (violationDetected) {
          console.warn(`🚨 Policy violation detected: ${rule.description}`)
          
          if (rule.action === 'deny') {
            store.quarantineContainer(containerId, `Policy violation: ${rule.description}`)
            return false
          }
        }
      }
    }
    
    return true
  }
  
  private checkPolicyViolation(container: SecureContainer, rule: PolicyRule): boolean {
    // Simulate policy violation checks
    switch (rule.condition) {
      case 'user_namespace_enabled':
        return !container.config.securityContext.runAsNonRoot
      case 'inter_container_communication':
        return container.networkIsolation.allowedCommunication.length > 5
      default:
        return Math.random() < 0.02 // 2% chance of violation
    }
  }
}
