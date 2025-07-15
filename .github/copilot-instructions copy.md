# Global AI Development Instructions

These instructions apply to all GitHub Copilot agents and AI assistants in this repository. They define our development standards, workflows, and safety rules for the Autonomous Knowledge Brain Ecosystem.

## General Workflow and Version Control
- **Git Practices:** Work in feature branches and commit in logical units. Include descriptive commit messages. When addressing a GitHub Issue or task, reference it in commits (e.g., "Fix #123 - add atomic concept extraction for cybersecurity docs"). Do **not** commit directly to `main` without review.
- **Pull Requests:** If your task is substantial, open a draft PR and link it to the relevant issue. Update the PR description with a summary of changes. Ensure each PR has a related test plan and passes all checks before requesting review.

## Test-Driven Development (TDD)
- **Write Tests First:** For any new feature or bug fix, first add or update a test in the `tests/` directory capturing the desired behavior or reported issue.
- **Red-Green-Refactor Loop:** Run tests to see the new test **fail** (red). Implement the minimal code required in `tools/` or relevant module to make the test **pass** (green). Re-run tests to confirm all pass. Then **refactor** the code for clarity and efficiency (without changing behavior). Run tests again after refactoring to ensure they stay green.
- **Continuous Testing:** Always run the full test suite (`pytest` or equivalent) after making changes. Do not consider a task done until all tests pass. If any test fails, address it before proceeding.

## Atomic Concept Standards
- **One Concept Per Note:** Each note in the Obsidian vault must represent a single, indivisible concept. If a note covers multiple ideas, split it into separate atomic notes.
- **Pedagogical Orientation:** Write all atomic concepts as self-contained tutorials, explaining from first principles with clear learning objectives.
- **YAML Frontmatter:** Every atomic concept note must include proper YAML frontmatter with tags, creation date, and metadata.
- **Internal Linking:** Use Obsidian-style `[[Note Title]]` links extensively to create rich interconnections between concepts.
- **Citation Requirements:** All factual claims must be supported by credible sources with proper academic citations.

## Security and Privacy Standards
- **Data Classification:** Properly classify all data (PII, HIPAA/FERPA, public, etc.) and apply appropriate protection measures.
- **Access Controls:** Implement least-privilege principles for all agent operations and data access.
- **Audit Logging:** Log all significant actions with sufficient detail for security auditing and compliance.
- **Threat Modeling:** Consider STRIDE/DREAD/LINDDUN implications for any new feature or system change.
- **Container Security:** Maintain proper container isolation and secure communication between agents.

## Environmental Responsibility
- **Energy Efficiency:** Prioritize local processing and dormant-mode operation to minimize energy consumption.
- **Resource Optimization:** Use appropriate algorithms and data structures to minimize computational overhead.
- **Carbon Tracking:** Monitor and report energy usage for all system operations.
- **Local-First:** Use local NLP models and embeddings where possible; reserve cloud LLMs for complex reasoning tasks only.

## Agent Behavior Guidelines
- **Autonomy with Oversight:** Agents should operate autonomously within their defined scope but escalate unclear situations to the Command Architect.
- **Idempotent Operations:** All agent operations must be idempotent to enable safe retries and resumption after interruptions.
- **Status Reporting:** Maintain clear status tracking for all long-running operations with persistent state files.
- **Error Handling:** Implement comprehensive error handling with detailed logging and graceful degradation.
- **Quality Assurance:** The Command Architect must review all outputs before integration into the knowledge base.

## Documentation Standards
- **Code Documentation:** All functions and classes must have comprehensive docstrings with examples.
- **Architecture Documentation:** Maintain up-to-date documentation of system architecture and agent interactions.
- **Security Documentation:** Document all security controls, threat mitigations, and access control policies.
- **User Documentation:** Provide clear, pedagogical documentation for all user-facing features.

## Integration and Compatibility
- **Office 365 Integration:** Ensure secure integration with Outlook, Teams, and other productivity tools.
- **Obsidian Compatibility:** Maintain full compatibility with Obsidian's markdown format and plugin ecosystem.
- **Container Standards:** Use standardized Docker configurations for reproducible deployments.
- **API Security:** Implement proper authentication and authorization for all external API integrations.

## Quality Control
- **Peer Review:** All significant changes require review by at least one other agent or human contributor.
- **Continuous Integration:** Automated testing and security scanning must pass before any merge to main.
- **Performance Monitoring:** Track system performance and resource usage to identify optimization opportunities.
- **Regular Audits:** Conduct periodic security and quality audits of the entire system.

## Educational Value
- **Student-Friendly:** All documentation and code should be accessible to AP Cybersecurity and Cyber 101 students.
- **Research Quality:** Maintain academic rigor suitable for publication in peer-reviewed venues.
- **Best Practices:** Demonstrate industry best practices in cybersecurity, software engineering, and AI development.
- **Open Source Ethics:** Contribute to the open source community with high-quality, well-documented code.

---

**Primary Agents and Their Duties:**
- **Command Architect:** Task delegation, oversight, quality control, and system orchestration
- **Repository Engineer:** File and repo management, Git operations, system maintenance
- **Content Analyst:** Document processing and atomic concept note creation
- **Reference Manager:** Bibliographic reference extraction and citation management
- **Feature Engineer:** Tool development, integration, and system enhancement
- **Logging Agent:** Activity summarization and audit trail generation

*All agents must follow these guidelines and their specific prompt instructions while maintaining the highest standards of security, quality, and educational value.*
