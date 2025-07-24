/**
 * 🎓 CYBER FARM CYBERSECURITY EDUCATIONAL ENHANCEMENTS - TDD Implementation
 * 
 * Command Architect Agent - Educational Context Enhancement
 * Target: Transform Farmville mechanics into meaningful cybersecurity education
 * Focus: NIST Framework, Risk Assessment, Incident Response, Threat Intelligence
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// Import component under test
import CyberFarmGame from '@/app/games/cyber-farm/page';

describe('🎓 CyberFarm Cybersecurity Educational Enhancements', () => {

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Mock console methods to avoid test noise
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('🏛️ NIST Cybersecurity Framework Integration', () => {
    test('🔴 RED: should display NIST framework progression dashboard', () => {
      render(<CyberFarmGame />);
      
      // Should show NIST framework dashboard
      expect(screen.getByTestId('nist-framework-dashboard')).toBeInTheDocument();
      
      // Should show all five NIST functions with progress indicators
      expect(screen.getByTestId('nist-identify-progress')).toBeInTheDocument();
      expect(screen.getByTestId('nist-protect-progress')).toBeInTheDocument();
      expect(screen.getByTestId('nist-detect-progress')).toBeInTheDocument();
      expect(screen.getByTestId('nist-respond-progress')).toBeInTheDocument();
      expect(screen.getByTestId('nist-recover-progress')).toBeInTheDocument();
      
      // Should show current framework phase
      expect(screen.getByText('Current Phase: IDENTIFY')).toBeInTheDocument();
      expect(screen.getByText('Asset Inventory & Risk Assessment')).toBeInTheDocument();
    });

    test('🔴 RED: should require completing IDENTIFY phase before PROTECT', async () => {
      const user = userEvent.setup();
      render(<CyberFarmGame />);
      
      // PROTECT phase should be locked initially
      const protectButton = screen.getByTestId('nist-protect-phase-button');
      expect(protectButton).toHaveClass('locked');
      expect(protectButton).toBeDisabled();
      
      // Complete IDENTIFY phase activities
      const assetInventoryTask = screen.getByTestId('asset-inventory-task');
      await user.click(assetInventoryTask);
      
      const riskAssessmentTask = screen.getByTestId('risk-assessment-task');
      await user.click(riskAssessmentTask);
      
      // PROTECT phase should now be unlocked
      await waitFor(() => {
        expect(protectButton).not.toHaveClass('locked');
        expect(protectButton).toBeEnabled();
      });
    });

    test('🔴 RED: should map security controls to NIST framework functions', () => {
      render(<CyberFarmGame />);
      
      // Should show framework mapping for each control
      const firewallControl = screen.getByTestId('firewall-control');
      expect(firewallControl).toHaveAttribute('data-nist-function', 'protect');
      expect(firewallControl).toHaveAttribute('data-nist-category', 'access-control');
      
      const encryptionControl = screen.getByTestId('encryption-control');
      expect(encryptionControl).toHaveAttribute('data-nist-function', 'protect');
      expect(encryptionControl).toHaveAttribute('data-nist-category', 'data-security');
      
      const monitoringControl = screen.getByTestId('monitoring-control');
      expect(monitoringControl).toHaveAttribute('data-nist-function', 'detect');
      expect(monitoringControl).toHaveAttribute('data-nist-category', 'continuous-monitoring');
    });
  });

  describe('⚠️ Enhanced Threat Intelligence & Realistic Scenarios', () => {
    test('🔴 RED: should present multi-stage attack scenarios with kill chain', () => {
      render(<CyberFarmGame />);
      
      // Should show advanced threat scenario
      expect(screen.getByTestId('advanced-threat-scenario')).toBeInTheDocument();
      
      // Should display cyber kill chain stages
      expect(screen.getByTestId('kill-chain-reconnaissance')).toBeInTheDocument();
      expect(screen.getByTestId('kill-chain-weaponization')).toBeInTheDocument();
      expect(screen.getByTestId('kill-chain-delivery')).toBeInTheDocument();
      expect(screen.getByTestId('kill-chain-exploitation')).toBeInTheDocument();
      expect(screen.getByTestId('kill-chain-installation')).toBeInTheDocument();
      expect(screen.getByTestId('kill-chain-command-control')).toBeInTheDocument();
      expect(screen.getByTestId('kill-chain-actions-objectives')).toBeInTheDocument();
      
      // Should show threat actor profile
      expect(screen.getByText('Threat Actor: APT29 (Cozy Bear)')).toBeInTheDocument();
      expect(screen.getByText('Motivation: Espionage')).toBeInTheDocument();
      expect(screen.getByText('TTPs: Spear phishing, Living off the land')).toBeInTheDocument();
    });

    test('🔴 RED: should include indicators of compromise (IoCs) learning', async () => {
      const user = userEvent.setup();
      render(<CyberFarmGame />);
      
      // Should show IoC training module
      const iocTraining = screen.getByTestId('ioc-training-module');
      await user.click(iocTraining);
      
      // Should display different IoC types
      expect(screen.getByTestId('ioc-ip-addresses')).toBeInTheDocument();
      expect(screen.getByTestId('ioc-file-hashes')).toBeInTheDocument();
      expect(screen.getByTestId('ioc-domain-names')).toBeInTheDocument();
      expect(screen.getByTestId('ioc-email-addresses')).toBeInTheDocument();
      
      // Should have IoC identification exercise
      expect(screen.getByText('Identify the malicious IP address:')).toBeInTheDocument();
      expect(screen.getByText('192.168.1.100')).toBeInTheDocument();
      expect(screen.getByText('185.234.72.45')).toBeInTheDocument(); // Malicious
      expect(screen.getByText('10.0.0.1')).toBeInTheDocument();
    });

    test('🔴 RED: should simulate supply chain attacks with vendor risk scenarios', () => {
      render(<CyberFarmGame />);
      
      // Should show supply chain scenario
      expect(screen.getByTestId('supply-chain-scenario')).toBeInTheDocument();
      expect(screen.getByText('🏭 Supply Chain Security Challenge')).toBeInTheDocument();
      
      // Should show vendor risk assessment
      expect(screen.getByTestId('vendor-risk-matrix')).toBeInTheDocument();
      expect(screen.getByTestId('vendor-acme-software')).toHaveAttribute('data-risk-level', 'high');
      expect(screen.getByTestId('vendor-secure-solutions')).toHaveAttribute('data-risk-level', 'low');
      
      // Should show third-party dependency analysis
      expect(screen.getByTestId('dependency-analysis')).toBeInTheDocument();
      expect(screen.getByText('Dependencies with known vulnerabilities: 3')).toBeInTheDocument();
    });
  });

  describe('📊 Risk Assessment & Management Matrix', () => {
    test('🔴 RED: should provide quantitative risk assessment tools', () => {
      render(<CyberFarmGame />);
      
      // Should show risk assessment matrix
      expect(screen.getByTestId('risk-assessment-matrix')).toBeInTheDocument();
      
      // Should display risk calculation components
      expect(screen.getByTestId('threat-likelihood-slider')).toBeInTheDocument();
      expect(screen.getByTestId('impact-severity-slider')).toBeInTheDocument();
      expect(screen.getByTestId('vulnerability-rating')).toBeInTheDocument();
      
      // Should show calculated risk score
      expect(screen.getByTestId('calculated-risk-score')).toBeInTheDocument();
      expect(screen.getByText('Risk Score: 7.2 (HIGH)')).toBeInTheDocument();
      
      // Should show risk treatment options
      expect(screen.getByTestId('risk-treatment-accept')).toBeInTheDocument();
      expect(screen.getByTestId('risk-treatment-mitigate')).toBeInTheDocument();
      expect(screen.getByTestId('risk-treatment-transfer')).toBeInTheDocument();
      expect(screen.getByTestId('risk-treatment-avoid')).toBeInTheDocument();
    });

    test('🔴 RED: should implement business impact analysis scenarios', async () => {
      const user = userEvent.setup();
      render(<CyberFarmGame />);
      
      // Should show BIA module
      const biaModule = screen.getByTestId('business-impact-analysis');
      await user.click(biaModule);
      
      // Should display critical business functions
      expect(screen.getByTestId('critical-function-payment-processing')).toBeInTheDocument();
      expect(screen.getByTestId('critical-function-customer-data')).toBeInTheDocument();
      expect(screen.getByTestId('critical-function-manufacturing')).toBeInTheDocument();
      
      // Should show RTO/RPO calculations
      expect(screen.getByText('RTO: 4 hours')).toBeInTheDocument();
      expect(screen.getByText('RPO: 1 hour')).toBeInTheDocument();
      
      // Should display financial impact estimates
      expect(screen.getByText('Downtime Cost: $50,000/hour')).toBeInTheDocument();
      expect(screen.getByText('Regulatory Fines: $2.5M')).toBeInTheDocument();
    });

    test('🔴 RED: should track risk register with treatment progress', () => {
      render(<CyberFarmGame />);
      
      // Should show organizational risk register
      expect(screen.getByTestId('organizational-risk-register')).toBeInTheDocument();
      
      // Should display risks with status tracking
      expect(screen.getByTestId('risk-phishing-attacks')).toHaveAttribute('data-status', 'in-progress');
      expect(screen.getByTestId('risk-data-breach')).toHaveAttribute('data-status', 'mitigated');
      expect(screen.getByTestId('risk-ddos-attack')).toHaveAttribute('data-status', 'accepted');
      
      // Should show risk trend analysis
      expect(screen.getByTestId('risk-trend-chart')).toBeInTheDocument();
      expect(screen.getByText('Overall Risk Trend: Decreasing')).toBeInTheDocument();
    });
  });

  describe('🚨 Incident Response Training & Playbooks', () => {
    test('🔴 RED: should provide realistic incident response scenarios', () => {
      render(<CyberFarmGame />);
      
      // Should show incident response dashboard
      expect(screen.getByTestId('incident-response-dashboard')).toBeInTheDocument();
      
      // Should display active incident scenario
      expect(screen.getByTestId('active-incident-ransomware')).toBeInTheDocument();
      expect(screen.getByText('🚨 ACTIVE INCIDENT: Ransomware Detected')).toBeInTheDocument();
      expect(screen.getByText('Severity: CRITICAL')).toBeInTheDocument();
      expect(screen.getByText('Time Elapsed: 23 minutes')).toBeInTheDocument();
      
      // Should show incident response phases
      expect(screen.getByTestId('ir-phase-preparation')).toBeInTheDocument();
      expect(screen.getByTestId('ir-phase-identification')).toBeInTheDocument();
      expect(screen.getByTestId('ir-phase-containment')).toBeInTheDocument();
      expect(screen.getByTestId('ir-phase-eradication')).toBeInTheDocument();
      expect(screen.getByTestId('ir-phase-recovery')).toBeInTheDocument();
      expect(screen.getByTestId('ir-phase-lessons-learned')).toBeInTheDocument();
    });

    test('🔴 RED: should require correct decision-making sequence in incident response', async () => {
      const user = userEvent.setup();
      render(<CyberFarmGame />);
      
      // Should start in identification phase
      expect(screen.getByTestId('current-ir-phase')).toHaveTextContent('IDENTIFICATION');
      
      // Wrong decision should show educational feedback
      const wrongDecision = screen.getByTestId('ir-decision-wrong');
      await user.click(wrongDecision);
      
      expect(screen.getByTestId('educational-feedback')).toBeInTheDocument();
      expect(screen.getByText('❌ Incorrect: This action could spread the malware further.')).toBeInTheDocument();
      expect(screen.getByText('💡 Remember: Containment comes before eradication.')).toBeInTheDocument();
      
      // Correct decision should advance phase
      const correctDecision = screen.getByTestId('ir-decision-correct');
      await user.click(correctDecision);
      
      await waitFor(() => {
        expect(screen.getByTestId('current-ir-phase')).toHaveTextContent('CONTAINMENT');
      });
    });

    test('🔴 RED: should include communication and stakeholder management', () => {
      render(<CyberFarmGame />);
      
      // Should show stakeholder communication panel
      expect(screen.getByTestId('stakeholder-communication')).toBeInTheDocument();
      
      // Should display different stakeholder groups
      expect(screen.getByTestId('stakeholder-executive-team')).toBeInTheDocument();
      expect(screen.getByTestId('stakeholder-legal-team')).toBeInTheDocument();
      expect(screen.getByTestId('stakeholder-public-relations')).toBeInTheDocument();
      expect(screen.getByTestId('stakeholder-customers')).toBeInTheDocument();
      expect(screen.getByTestId('stakeholder-regulators')).toBeInTheDocument();
      
      // Should show communication templates
      expect(screen.getByTestId('communication-template-initial')).toBeInTheDocument();
      expect(screen.getByTestId('communication-template-update')).toBeInTheDocument();
      expect(screen.getByTestId('communication-template-resolution')).toBeInTheDocument();
    });
  });

  describe('📋 Compliance & Auditing Framework', () => {
    test('🔴 RED: should track compliance with major security frameworks', () => {
      render(<CyberFarmGame />);
      
      // Should show compliance dashboard
      expect(screen.getByTestId('compliance-dashboard')).toBeInTheDocument();
      
      // Should display various compliance frameworks
      expect(screen.getByTestId('compliance-soc2')).toBeInTheDocument();
      expect(screen.getByTestId('compliance-pci-dss')).toBeInTheDocument();
      expect(screen.getByTestId('compliance-gdpr')).toBeInTheDocument();
      expect(screen.getByTestId('compliance-hipaa')).toBeInTheDocument();
      expect(screen.getByTestId('compliance-iso27001')).toBeInTheDocument();
      
      // Should show compliance scores
      expect(screen.getByText('SOC 2: 87% Compliant')).toBeInTheDocument();
      expect(screen.getByText('PCI DSS: 92% Compliant')).toBeInTheDocument();
      expect(screen.getByText('GDPR: 78% Compliant')).toBeInTheDocument();
    });

    test('🔴 RED: should provide audit preparation and evidence collection', async () => {
      const user = userEvent.setup();
      render(<CyberFarmGame />);
      
      // Should show audit preparation module
      const auditPrep = screen.getByTestId('audit-preparation');
      await user.click(auditPrep);
      
      // Should display evidence collection checklist
      expect(screen.getByTestId('evidence-security-policies')).toBeInTheDocument();
      expect(screen.getByTestId('evidence-access-logs')).toBeInTheDocument();
      expect(screen.getByTestId('evidence-vulnerability-scans')).toBeInTheDocument();
      expect(screen.getByTestId('evidence-training-records')).toBeInTheDocument();
      
      // Should show audit timeline
      expect(screen.getByTestId('audit-timeline')).toBeInTheDocument();
      expect(screen.getByText('Next Audit: 45 days')).toBeInTheDocument();
    });

    test('🔴 RED: should simulate regulatory violation scenarios and remediation', () => {
      render(<CyberFarmGame />);
      
      // Should show regulatory violation scenario
      expect(screen.getByTestId('regulatory-violation-scenario')).toBeInTheDocument();
      expect(screen.getByText('⚠️ GDPR Violation Detected')).toBeInTheDocument();
      expect(screen.getByText('Data retention period exceeded')).toBeInTheDocument();
      
      // Should show remediation actions
      expect(screen.getByTestId('remediation-data-deletion')).toBeInTheDocument();
      expect(screen.getByTestId('remediation-policy-update')).toBeInTheDocument();
      expect(screen.getByTestId('remediation-staff-training')).toBeInTheDocument();
      
      // Should calculate potential fines
      expect(screen.getByText('Potential Fine: €2.4M (4% of annual revenue)')).toBeInTheDocument();
    });
  });

  describe('🔍 Threat Hunting & Proactive Defense', () => {
    test('🔴 RED: should provide threat hunting exercises with real data', () => {
      render(<CyberFarmGame />);
      
      // Should show threat hunting dashboard
      expect(screen.getByTestId('threat-hunting-dashboard')).toBeInTheDocument();
      
      // Should display hunting hypotheses
      expect(screen.getByTestId('hunting-hypothesis-1')).toBeInTheDocument();
      expect(screen.getByText('Hypothesis: Lateral movement via RDP')).toBeInTheDocument();
      
      // Should show hunting tools and techniques
      expect(screen.getByTestId('hunting-tool-sigma-rules')).toBeInTheDocument();
      expect(screen.getByTestId('hunting-tool-yara-rules')).toBeInTheDocument();
      expect(screen.getByTestId('hunting-tool-timeline-analysis')).toBeInTheDocument();
      
      // Should display log analysis interface
      expect(screen.getByTestId('log-analysis-interface')).toBeInTheDocument();
      expect(screen.getByText('Analyzing 2.3M log entries...')).toBeInTheDocument();
    });

    test('🔴 RED: should teach MITRE ATT&CK framework mapping', async () => {
      const user = userEvent.setup();
      render(<CyberFarmGame />);
      
      // Should show MITRE ATT&CK matrix
      const attackMatrix = screen.getByTestId('mitre-attack-matrix');
      await user.click(attackMatrix);
      
      // Should display tactics and techniques
      expect(screen.getByTestId('tactic-initial-access')).toBeInTheDocument();
      expect(screen.getByTestId('tactic-execution')).toBeInTheDocument();
      expect(screen.getByTestId('tactic-persistence')).toBeInTheDocument();
      expect(screen.getByTestId('tactic-privilege-escalation')).toBeInTheDocument();
      
      // Should show technique details
      expect(screen.getByTestId('technique-t1566-phishing')).toBeInTheDocument();
      expect(screen.getByTestId('technique-t1059-command-scripting')).toBeInTheDocument();
      
      // Should map observed activities to techniques
      expect(screen.getByText('Observed Activity: PowerShell execution')).toBeInTheDocument();
      expect(screen.getByText('Maps to: T1059.001 - PowerShell')).toBeInTheDocument();
    });

    test('🔴 RED: should provide automated detection rule creation training', () => {
      render(<CyberFarmGame />);
      
      // Should show detection engineering module
      expect(screen.getByTestId('detection-engineering')).toBeInTheDocument();
      
      // Should display rule creation interface
      expect(screen.getByTestId('sigma-rule-builder')).toBeInTheDocument();
      expect(screen.getByTestId('yara-rule-builder')).toBeInTheDocument();
      expect(screen.getByTestId('snort-rule-builder')).toBeInTheDocument();
      
      // Should show rule validation and testing
      expect(screen.getByTestId('rule-validation')).toBeInTheDocument();
      expect(screen.getByText('Rule Accuracy: 94.2%')).toBeInTheDocument();
      expect(screen.getByText('False Positive Rate: 0.8%')).toBeInTheDocument();
    });
  });
});
