/**
 * TrueGrant AI - Seed Data & Mock Dataset
 * Theme: Cyber Emerald | WCAG 2.2 AAA Accessible | Enterprise Security Tool
 * Track: Agents That Act (TrueFoundry Hackathon)
 */

export const INITIAL_USERS = [
  {
    id: 'usr-001',
    name: 'Sarah Chen',
    email: 'sarah.chen@cyber-emerald.io',
    department: 'Platform Engineering',
    role: 'Staff DevOps Lead',
    totalKeys: 5,
    flaggedCount: 1,
    lastActive: '2 hours ago',
    avatar: 'SC',
    status: 'Active',
    systems: ['AWS IAM', 'GitHub']
  },
  {
    id: 'usr-002',
    name: 'Marcus Vance',
    email: 'marcus.vance@former-employee.internal',
    department: 'Infrastructure (Departed)',
    role: 'Former Staff Engineer (Terminated 142d ago)',
    totalKeys: 3,
    flaggedCount: 3,
    lastActive: '142 days ago',
    avatar: 'MV',
    status: 'Terminated / High Risk',
    systems: ['AWS IAM']
  },
  {
    id: 'usr-003',
    name: 'Priya Sharma',
    email: 'priya.sharma@cyber-emerald.io',
    department: 'Data Platform',
    role: 'Lead Data Architect',
    totalKeys: 6,
    flaggedCount: 2,
    lastActive: '3 days ago',
    avatar: 'PS',
    status: 'Active',
    systems: ['AWS IAM']
  },
  {
    id: 'usr-004',
    name: 'Alex Rivera',
    email: 'alex.rivera@cyber-emerald.io',
    department: 'Release Engineering',
    role: 'CI/CD Systems Architect',
    totalKeys: 8,
    flaggedCount: 2,
    lastActive: '5 hours ago',
    avatar: 'AR',
    status: 'Active',
    systems: ['AWS IAM', 'GitHub']
  },
  {
    id: 'usr-005',
    name: 'David Miller',
    email: 'david.miller@cyber-emerald.io',
    department: 'Core Services',
    role: 'Senior Backend Developer',
    totalKeys: 4,
    flaggedCount: 1,
    lastActive: '1 day ago',
    avatar: 'DM',
    status: 'Active',
    systems: ['AWS IAM', 'GitHub']
  },
  {
    id: 'usr-006',
    name: 'Elena Rostova',
    email: 'elena.rostova@cyber-emerald.io',
    department: 'InfoSec & Compliance',
    role: 'Security Compliance Analyst',
    totalKeys: 2,
    flaggedCount: 0,
    lastActive: '10 mins ago',
    avatar: 'ER',
    status: 'Active Approver',
    systems: ['AWS IAM', 'GitHub']
  },
  {
    id: 'usr-007',
    name: 'svc-deployer-prod',
    email: 'service-account@ci.internal',
    department: 'Automated CI/CD Robot',
    role: 'Legacy Deploy Machine Principal',
    totalKeys: 4,
    flaggedCount: 2,
    lastActive: '110 days ago',
    avatar: '🤖',
    status: 'Service Principal',
    systems: ['AWS IAM', 'GitHub']
  }
];

export const INITIAL_FLAGGED_KEYS = [
  {
    id: 'key-001',
    name: 'ProductionDataPipelineWorker (Master Key)',
    keyId: 'AKIAIOSFODNN7EXAMPLE',
    system: 'AWS IAM',
    systemType: 'aws',
    owner: 'Marcus Vance (Former Staff Eng)',
    ownerId: 'usr-002',
    department: 'Infrastructure',
    lastUsed: '142 days ago',
    idleDays: 142,
    riskScore: 96,
    severity: 'CRITICAL',
    status: 'AWAITING_HUMAN_APPROVAL',
    targetResource: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:prod/database/master',
    reasoning: 'Critical credential abandoned by departed engineer 142 days ago. Possesses unrestricted wildcard ["s3:*"] on "*" allowing arbitrary retrieval of configuration files and lateral pivot to AWS Secrets Manager master DB secrets.',
    blastRadius: {
      services: ['DataIngest-Worker', 'BillingSync-Lambda', 'Reporting-ReadCluster'],
      downtimeRisk: '0% — Zero CloudTrail API invocations recorded in 90 consecutive days.',
      confidence: 99.4,
      affectedResources: ['s3:::production-analytics-lake', 'secretsmanager:prod/database/master']
    },
    currentPolicy: {
      Version: "2012-10-17",
      Statement: [
        {
          Sid: "OverPrivilegedWildcardAccess",
          Effect: "Allow",
          Action: [
            "iam:ListAccessKeys",
            "iam:Get*",
            "s3:*",
            "secretsmanager:GetSecretValue",
            "secretsmanager:ListSecrets"
          ],
          Resource: "*"
        }
      ]
    },
    proposedPolicy: {
      Version: "2012-10-17",
      Statement: [
        {
          Sid: "StrictLeastPrivilegeWorker",
          Effect: "Allow",
          Action: [
            "s3:GetObject",
            "s3:ListBucket"
          ],
          Resource: [
            "arn:aws:s3:::production-analytics-lake",
            "arn:aws:s3:::production-analytics-lake/*"
          ]
        }
      ]
    },
    diffLines: [
      { type: 'neutral', text: '  {' },
      { type: 'neutral', text: '    "Sid": "ProductionDataPipelineScope",' },
      { type: 'neutral', text: '    "Effect": "Allow",' },
      { type: 'neutral', text: '    "Action": [' },
      { type: 'removed', text: '-     "s3:*",' },
      { type: 'removed', text: '-     "secretsmanager:GetSecretValue",' },
      { type: 'removed', text: '-     "secretsmanager:ListSecrets",' },
      { type: 'removed', text: '-     "iam:ListAccessKeys",' },
      { type: 'added',   text: '+     "s3:GetObject",' },
      { type: 'added',   text: '+     "s3:ListBucket"' },
      { type: 'neutral', text: '    ],' },
      { type: 'removed', text: '-   "Resource": "*"' },
      { type: 'added',   text: '+   "Resource": [' },
      { type: 'added',   text: '+     "arn:aws:s3:::production-analytics-lake",' },
      { type: 'added',   text: '+     "arn:aws:s3:::production-analytics-lake/*"' },
      { type: 'added',   text: '+   ]' },
      { type: 'neutral', text: '  }' }
    ],
    cloudTrailVerification: 'Replayed against 90 days of CloudTrail traffic — 0 requests would have failed.'
  },
  {
    id: 'key-002',
    name: 'CI-Deployer Legacy Machine Token',
    keyId: 'AKIAI44QH8DHBEXAMPLE',
    system: 'AWS IAM',
    systemType: 'aws',
    owner: 'Alex Rivera / svc-deployer-prod',
    ownerId: 'usr-004',
    department: 'Release Engineering',
    lastUsed: '110 days ago',
    idleDays: 110,
    riskScore: 88,
    severity: 'HIGH',
    status: 'AWAITING_HUMAN_APPROVAL',
    targetResource: 'arn:aws:ecr:us-east-1:123456789012:repository/*',
    reasoning: 'Unrotated long-lived deploy token created prior to GitHub OIDC federation migration. Has not pushed a build image in 110 days but still holds full ECR admin privileges.',
    blastRadius: {
      services: ['Legacy Jenkins Runner', 'Staging Docker Builder'],
      downtimeRisk: '0% — CI pipelines fully converted to ephemeral GitHub OIDC role assumption.',
      confidence: 98.7,
      affectedResources: ['ecr:*', 'ecs:UpdateService']
    },
    diffLines: [
      { type: 'neutral', text: '  "Statement": [' },
      { type: 'removed', text: '-   "Action": "ecr:*",' },
      { type: 'removed', text: '-   "Resource": "*"' },
      { type: 'added',   text: '+   "Action": ["ecr:BatchCheckLayerAvailability", "ecr:GetDownloadUrlForLayer"],' },
      { type: 'added',   text: '+   "Resource": "arn:aws:ecr:us-east-1:123456789012:repository/staging-*"' },
      { type: 'neutral', text: '  ]' }
    ],
    cloudTrailVerification: 'Replayed against 90 days of CloudTrail traffic — 0 requests would have failed.'
  },
  {
    id: 'key-003',
    name: 'LegacyReportRunner Analytics Role',
    keyId: 'AKIAI68GHIJK5EXAMPLE',
    system: 'AWS IAM',
    systemType: 'aws',
    owner: 'Priya Sharma (Data Architect)',
    ownerId: 'usr-003',
    department: 'Data Platform',
    lastUsed: '94 days ago',
    idleDays: 94,
    riskScore: 78,
    severity: 'MEDIUM',
    status: 'AWAITING_HUMAN_APPROVAL',
    targetResource: 'arn:aws:dynamodb:us-east-1:123456789012:table/UserSessions',
    reasoning: 'Automated batch reporting runner with zero CloudTrail calls since Q2 migration to Snowflake. Retains permission to execute table-wide DynamoDB scans.',
    blastRadius: {
      services: ['WeeklyMetricsCronJob'],
      downtimeRisk: '0% — Job retired in favor of dbt-cloud transformation.',
      confidence: 96.2,
      affectedResources: ['dynamodb:Scan', 'dynamodb:GetItem']
    },
    diffLines: [
      { type: 'neutral', text: '  "Statement": [' },
      { type: 'removed', text: '-   "Action": ["dynamodb:*", "cloudwatch:*"],' },
      { type: 'added',   text: '+   "Action": ["cloudwatch:GetMetricData"],' },
      { type: 'neutral', text: '  ]' }
    ],
    cloudTrailVerification: 'Replayed against 90 days of CloudTrail traffic — 0 requests would have failed.'
  },
  {
    id: 'key-004',
    name: 'GitHub Org Admin Automation PAT',
    keyId: 'ghp_live_sec_token_99b0x82',
    system: 'GitHub',
    systemType: 'github',
    owner: 'Sarah Chen (DevOps)',
    ownerId: 'usr-001',
    department: 'Platform Engineering',
    lastUsed: '156 days ago',
    idleDays: 156,
    riskScore: 92,
    severity: 'CRITICAL',
    status: 'AWAITING_HUMAN_APPROVAL',
    targetResource: 'https://github.com/cyber-emerald-corp',
    reasoning: 'Personal Access Token with full "admin:org" and "repo" scopes granted for initial org setup. Dormant for 5+ months; poses severe supply-chain takeover risk if leaked in developer environment.',
    blastRadius: {
      services: ['GitHub Org Webhook Setup'],
      downtimeRisk: '0% — All automated org configurations now managed by GitHub App.',
      confidence: 99.8,
      affectedResources: ['github:admin:org', 'github:repo']
    },
    diffLines: [
      { type: 'neutral', text: '  "Scopes": [' },
      { type: 'removed', text: '-   "admin:org",' },
      { type: 'removed', text: '-   "repo:status",' },
      { type: 'removed', text: '-   "delete_repo"' },
      { type: 'added',   text: '+   "read:org"' },
      { type: 'neutral', text: '  ]' }
    ],
    cloudTrailVerification: 'Replayed against 90 days of audit logs — 0 requests would have failed.'
  },
  {
    id: 'key-005',
    name: 'AnalyticsLakeDumpRole S3 Worker',
    keyId: 'arn:aws:iam::123456789012:role/AnalyticsLakeDumpRole',
    system: 'AWS IAM',
    systemType: 'aws',
    owner: 'Priya Sharma (Data Architect)',
    ownerId: 'usr-003',
    department: 'Data Platform',
    lastUsed: '128 days ago',
    idleDays: 128,
    riskScore: 84,
    severity: 'HIGH',
    status: 'AWAITING_HUMAN_APPROVAL',
    targetResource: 'arn:aws:s3:::analytics-raw-bucket-prod/*',
    reasoning: 'Wildcard S3 write permissions attached to an abandoned Glue ingestion job. Has not written to the data lake in 128 days.',
    blastRadius: {
      services: ['Glue-NightlyRawSync'],
      downtimeRisk: '0% — Redundant pipeline replaced by Fivetran connector.',
      confidence: 97.9,
      affectedResources: ['s3:PutObject', 's3:DeleteObject']
    },
    diffLines: [
      { type: 'removed', text: '-   "Action": "s3:*"' },
      { type: 'added',   text: '+   "Action": ["s3:GetObject", "s3:ListBucket"]' }
    ],
    cloudTrailVerification: 'Replayed against 90 days of CloudTrail traffic — 0 requests would have failed.'
  },
  {
    id: 'key-006',
    name: 'EmergencyBreakGlassAdmin Key',
    keyId: 'AKIA_BREAK_GLASS_ADMIN_9901',
    system: 'AWS IAM',
    systemType: 'aws',
    owner: 'David Miller (Backend)',
    ownerId: 'usr-005',
    department: 'Core Services',
    lastUsed: '180 days ago',
    idleDays: 180,
    riskScore: 72,
    severity: 'MEDIUM',
    status: 'AWAITING_HUMAN_APPROVAL',
    targetResource: 'arn:aws:iam::123456789012:root',
    reasoning: 'Static credentials generated for emergency break-glass procedures. Retained past 90-day rotation policy without MFA hardware token enforcement.',
    blastRadius: {
      services: ['Manual Disaster Recovery Override'],
      downtimeRisk: 'Requires confirmation — Break-glass access should use AWS SSO permission sets.',
      confidence: 91.0,
      affectedResources: ['iam:*', 'ec2:*', 'rds:*']
    },
    diffLines: [
      { type: 'removed', text: '-   "Effect": "Allow", "Action": "*"' },
      { type: 'added',   text: '+   "Condition": { "Bool": { "aws:MultiFactorAuthPresent": "true" } }' }
    ],
    cloudTrailVerification: 'Replayed against 90 days of CloudTrail traffic — 0 requests would have failed.'
  },
  {
    id: 'key-007',
    name: 'GitHub Webhook Sync Dispatcher',
    keyId: 'ghp_webhook_sync_disp_441',
    system: 'GitHub',
    systemType: 'github',
    owner: 'Alex Rivera (Release Eng)',
    ownerId: 'usr-004',
    department: 'Release Engineering',
    lastUsed: '102 days ago',
    idleDays: 102,
    riskScore: 68,
    severity: 'MEDIUM',
    status: 'AWAITING_HUMAN_APPROVAL',
    targetResource: 'https://github.com/cyber-emerald-corp/core-api',
    reasoning: 'Token has "admin:repo_hook" write access to push webhooks. Repository moved to org-level webhook dispatcher.',
    blastRadius: {
      services: ['Legacy Slack Webhook Bot'],
      downtimeRisk: '0% — Webhook endpoint was decommissioned 3 months ago.',
      confidence: 98.1,
      affectedResources: ['github:admin:repo_hook']
    },
    diffLines: [
      { type: 'removed', text: '-   "Scope": "admin:repo_hook"' },
      { type: 'added',   text: '+   "Scope": "read:repo_hook"' }
    ],
    cloudTrailVerification: 'Replayed against 90 days of audit logs — 0 requests would have failed.'
  },
  {
    id: 'key-008',
    name: 'Staging Kubernetes Node Role',
    keyId: 'arn:aws:iam::123456789012:role/k8s-staging-node-role',
    system: 'AWS IAM',
    systemType: 'aws',
    owner: 'Sarah Chen (DevOps)',
    ownerId: 'usr-001',
    department: 'Platform Engineering',
    lastUsed: '98 days ago',
    idleDays: 98,
    riskScore: 64,
    severity: 'MEDIUM',
    status: 'AWAITING_HUMAN_APPROVAL',
    targetResource: 'arn:aws:ec2:us-west-2:123456789012:instance/*',
    reasoning: 'Orphaned node group role from dismantled v1.24 EKS staging cluster. Never detached after cluster deletion.',
    blastRadius: {
      services: ['Staging Cluster v1.24 (Deleted)'],
      downtimeRisk: '0% — Cluster no longer exists.',
      confidence: 99.9,
      affectedResources: ['ec2:DescribeInstances', 'ecr:GetAuthorizationToken']
    },
    diffLines: [
      { type: 'removed', text: '-   "AttachRolePolicy": "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy"' }
    ],
    cloudTrailVerification: 'Replayed against 90 days of CloudTrail traffic — 0 requests would have failed.'
  },
  {
    id: 'key-009',
    name: 'RDS Automated Backup Worker Key',
    keyId: 'AKIA_RDS_BACKUP_SNAPSHOT_882',
    system: 'AWS IAM',
    systemType: 'aws',
    owner: 'David Miller (Backend)',
    ownerId: 'usr-005',
    department: 'Core Services',
    lastUsed: '115 days ago',
    idleDays: 115,
    riskScore: 59,
    severity: 'MEDIUM',
    status: 'AWAITING_HUMAN_APPROVAL',
    targetResource: 'arn:aws:rds:us-east-1:123456789012:snapshot:master-*',
    reasoning: 'External backup cron job token unused since enabling AWS Backup centralized vault plans.',
    blastRadius: {
      services: ['Custom Python RDS Cron'],
      downtimeRisk: '0% — Central AWS Backup handles all retention policies natively.',
      confidence: 99.2,
      affectedResources: ['rds:CreateDBSnapshot', 'rds:DeleteDBSnapshot']
    },
    diffLines: [
      { type: 'removed', text: '-   "Action": "rds:*"' },
      { type: 'added',   text: '+   "Action": "rds:DescribeDBSnapshots"' }
    ],
    cloudTrailVerification: 'Replayed against 90 days of CloudTrail traffic — 0 requests would have failed.'
  },
  {
    id: 'key-010',
    name: 'Legacy CloudWatch Alarm Dispatcher',
    keyId: 'AKIA_CW_ALARM_DISP_5531',
    system: 'AWS IAM',
    systemType: 'aws',
    owner: 'Sarah Chen (DevOps)',
    ownerId: 'usr-001',
    department: 'Platform Engineering',
    lastUsed: '92 days ago',
    idleDays: 92,
    riskScore: 35,
    severity: 'LOW',
    status: 'AWAITING_HUMAN_APPROVAL',
    targetResource: 'arn:aws:cloudwatch:us-east-1:123456789012:alarm:*',
    reasoning: 'Read-only CloudWatch metric query key. Unused for 92 days due to Datadog agent migration.',
    blastRadius: {
      services: ['Legacy CW Metric Poller'],
      downtimeRisk: '0% — Low risk telemetry role.',
      confidence: 98.4,
      affectedResources: ['cloudwatch:GetMetricData']
    },
    diffLines: [
      { type: 'removed', text: '-   "Action": ["cloudwatch:*", "sns:Publish"]' },
      { type: 'added',   text: '+   "Action": ["cloudwatch:ListMetrics"]' }
    ],
    cloudTrailVerification: 'Replayed against 90 days of CloudTrail traffic — 0 requests would have failed.'
  },
  {
    id: 'key-011',
    name: 'GitHub Action Test Runner (Ephemeral)',
    keyId: 'ghp_test_runner_ephem_109',
    system: 'GitHub',
    systemType: 'github',
    owner: 'Alex Rivera (Release Eng)',
    ownerId: 'usr-004',
    department: 'Release Engineering',
    lastUsed: '95 days ago',
    idleDays: 95,
    riskScore: 32,
    severity: 'LOW',
    status: 'AWAITING_HUMAN_APPROVAL',
    targetResource: 'https://github.com/cyber-emerald-corp/qa-tests',
    reasoning: 'Test harness token with read:packages scope. Test suite shifted to internal npm registry.',
    blastRadius: {
      services: ['QA Cypress Suite'],
      downtimeRisk: '0% — Low risk read credential.',
      confidence: 99.0,
      affectedResources: ['github:read:packages']
    },
    diffLines: [
      { type: 'removed', text: '-   "Scope": "read:packages"' }
    ],
    cloudTrailVerification: 'Replayed against 90 days of audit logs — 0 requests would have failed.'
  },
  {
    id: 'key-012',
    name: 'S3 Asset Sync Staging Bucket Writer',
    keyId: 'AKIA_S3_SYNC_STAGING_7741',
    system: 'AWS IAM',
    systemType: 'aws',
    owner: 'David Miller (Backend)',
    ownerId: 'usr-005',
    department: 'Core Services',
    lastUsed: '91 days ago',
    idleDays: 91,
    riskScore: 28,
    severity: 'LOW',
    status: 'AWAITING_HUMAN_APPROVAL',
    targetResource: 'arn:aws:s3:::static-assets-staging-bucket',
    reasoning: 'Scoped to staging assets bucket. Idle for 91 days after staging assets CDN proxy overhaul.',
    blastRadius: {
      services: ['Frontend Asset Deployer'],
      downtimeRisk: '0% — Staging build uses Cloudflare R2 direct push.',
      confidence: 99.5,
      affectedResources: ['s3:PutObject']
    },
    diffLines: [
      { type: 'removed', text: '-   "Action": "s3:PutObject"' }
    ],
    cloudTrailVerification: 'Replayed against 90 days of CloudTrail traffic — 0 requests would have failed.'
  },
  {
    id: 'key-013',
    name: 'Marcus Vance Secondary Ingress Key',
    keyId: 'AKIAVANCE142OLDEXAM',
    system: 'AWS IAM',
    systemType: 'aws',
    owner: 'Marcus Vance (Former Staff Eng)',
    ownerId: 'usr-002',
    department: 'Infrastructure',
    lastUsed: '142 days ago',
    idleDays: 142,
    riskScore: 94,
    severity: 'CRITICAL',
    status: 'AWAITING_HUMAN_APPROVAL',
    targetResource: 'arn:aws:iam::123456789012:role/*',
    reasoning: 'Dormant secondary access key tied to terminated staff engineer. Possesses iam:PassRole and iam:AttachUserPolicy permissions.',
    blastRadius: {
      services: ['Infra Provisioning CLI'],
      downtimeRisk: '0% — User terminated 142 days ago.',
      confidence: 100,
      affectedResources: ['iam:PassRole', 'iam:AttachUserPolicy']
    },
    diffLines: [
      { type: 'removed', text: '-   "Action": ["iam:PassRole", "iam:AttachUserPolicy"]' }
    ],
    cloudTrailVerification: 'Replayed against 90 days of CloudTrail traffic — 0 requests would have failed.'
  },
  {
    id: 'key-014',
    name: 'GitHub Enterprise Security Scanner Integration',
    keyId: 'ghp_sec_scan_integ_7718',
    system: 'GitHub',
    systemType: 'github',
    owner: 'Elena Rostova (InfoSec)',
    ownerId: 'usr-006',
    department: 'InfoSec & Compliance',
    lastUsed: '93 days ago',
    idleDays: 93,
    riskScore: 40,
    severity: 'LOW',
    status: 'AWAITING_HUMAN_APPROVAL',
    targetResource: 'https://github.com/cyber-emerald-corp/*',
    reasoning: 'Legacy third-party scanner token replaced by GitHub Advanced Security native codeql workflows.',
    blastRadius: {
      services: ['Legacy Snyk Poller'],
      downtimeRisk: '0% — Scanner replaced with native CodeQL.',
      confidence: 99.1,
      affectedResources: ['github:security_events:read']
    },
    diffLines: [
      { type: 'removed', text: '-   "Scope": "security_events"' }
    ],
    cloudTrailVerification: 'Replayed against 90 days of audit logs — 0 requests would have failed.'
  }
];

export const INITIAL_AUDIT_LOG = [
  {
    id: 'audit-001',
    itemId: 'key-legacy-099',
    itemName: 'StagingEC2BastionKey (Dormant 160d)',
    action: 'REVOKED',
    decision: 'APPROVE',
    reviewer: 'Sarah Chen (Staff DevOps)',
    timestamp: '2026-09-24T14:22:10.000Z',
    formattedDate: 'Yesterday at 2:22 PM',
    reasonSummary: 'Wildcard SSH bastion ingress key abandoned after migration to AWS SSM Session Manager.',
    reviewerNote: 'Verified zero active SSH tunnels in CloudTrail. Safely purged.',
    soc2Signature: 'SOC2-SIGNED-1790250130000-APPROVE-A8F9B2',
    sha256Hash: 'SHA256: 3a7f8e12b4c9019d88e001928374a5f6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2',
    statusBadge: 'Revoked & Secured'
  },
  {
    id: 'audit-002',
    itemId: 'key-006-prior',
    itemName: 'DisasterRecoveryToken-Q2',
    action: 'KEPT',
    decision: 'REJECT',
    reviewer: 'Elena Rostova (InfoSec Approver)',
    timestamp: '2026-09-23T11:05:44.000Z',
    formattedDate: '2 days ago',
    reasonSummary: 'Overruled agent recommendation: Break-glass disaster recovery token preserved for upcoming Q3 annual drill.',
    reviewerNote: 'Human Overrule: Required for scheduled offline DR tabletop exercise next week. Added MFA hardware token requirement.',
    soc2Signature: 'SOC2-SIGNED-1790151944000-REJECT-OVERRULE-7C21AA',
    sha256Hash: 'SHA256: 7c21aa5b8d9e0f1a2b3c4d5e6f7a8b9c0d1e23a7f8e12b4c9019d88e00192837',
    statusBadge: 'Kept (Human Overrule)'
  },
  {
    id: 'audit-003',
    itemId: 'key-snooze-044',
    itemName: 'BillingReportWorkerLambda',
    action: 'SNOOZED',
    decision: 'SNOOZE',
    reviewer: 'David Miller (Backend)',
    timestamp: '2026-09-22T09:40:12.000Z',
    formattedDate: '3 days ago',
    reasonSummary: 'Finance team running quarterly tax closing reconciliations until end of month.',
    reviewerNote: 'Snoozed for 30 days pending finance audit sign-off.',
    soc2Signature: 'SOC2-SIGNED-1790060412000-SNOOZE-9D441C',
    sha256Hash: 'SHA256: 9d441c8f8e12b4c9019d88e001928374a5f6b7c8d9e0f1a2b3c4d5e6f7a8b9c0',
    statusBadge: 'Snoozed 30 Days'
  },
  {
    id: 'audit-004',
    itemId: 'key-emergency-rbk',
    itemName: 'ProdAnalyticsLakeWriter (Rollback Event)',
    action: 'ROLLBACK',
    decision: 'ROLLBACK',
    reviewer: 'Alex Rivera (Release Eng)',
    timestamp: '2026-09-20T16:18:05.000Z',
    formattedDate: '5 days ago',
    reasonSummary: 'Panic Rollback Triggered: Prior IAM policy snapshot restored within 2.1s after unexpected batch ingestion failure.',
    reviewerNote: 'Fail-safe rollback tested during staging incident drill. Successfully recovered in 3-second SLA.',
    soc2Signature: 'SOC2-SIGNED-1789894685000-RESTORED-55E8D1',
    sha256Hash: 'SHA256: 55e8d1a2b3c4d5e6f7a8b9c0d1e23a7f8e12b4c9019d88e001928374a5f6b7c8',
    statusBadge: 'Snapshot Restored'
  }
];

export const CONNECTED_SYSTEMS = [
  {
    id: 'sys-aws',
    name: 'AWS IAM (Production & Staging)',
    icon: 'aws',
    provider: 'Amazon Web Services',
    connectionStatus: 'Connected via MCP (@mcp/aws-iam)',
    isOnline: true,
    rolesCount: 42,
    activeKeysCount: 38,
    flaggedStaleCount: 3,
    lastSynced: 'Just now (Continuous eBPF Trapped)',
    environmentCount: 3,
    environments: [
      { name: 'prod-us-east-1', roles: 24, policies: 68, status: 'Active' },
      { name: 'staging-us-west-2', roles: 11, policies: 22, status: 'Active' },
      { name: 'analytics-eu-central-1', roles: 7, policies: 14, status: 'Quarantined' }
    ],
    readOnlyBadge: 'Read-only until approval',
    autoRevokeLowRisk: false
  },
  {
    id: 'sys-github',
    name: 'GitHub Enterprise Org',
    icon: 'github',
    provider: 'GitHub IAM (@mcp/github-mcp)',
    connectionStatus: 'Connected via MCP (@mcp/github-mcp)',
    isOnline: true,
    rolesCount: 18,
    activeKeysCount: 22,
    flaggedStaleCount: 2,
    lastSynced: '2 mins ago',
    environmentCount: 1,
    environments: [
      { name: 'cyber-emerald-corp (All Repos)', roles: 18, policies: 32, status: 'Active' }
    ],
    readOnlyBadge: 'Read-only until approval',
    autoRevokeLowRisk: false
  }
];

export const STATS_DATA = {
  keysScanned: 248,
  staleKeysFound: 14,
  pendingApprovals: 8,
  attackSurfaceReduced: 87,
  revocationsExecuted: 42,
  avgKeyAgeDays: 118,
  activeEngines: 1,
  uptimeSla: '99.99%',
  rollbackTimeSeconds: 3
};

export const FLAGGED_VS_RESOLVED_DATA = [
  { day: 'Day 1', flagged: 18, resolved: 2 },
  { day: 'Day 5', flagged: 22, resolved: 8 },
  { day: 'Day 10', flagged: 27, resolved: 16 },
  { day: 'Day 15', flagged: 24, resolved: 21 },
  { day: 'Day 20', flagged: 31, resolved: 28 },
  { day: 'Day 25', flagged: 29, resolved: 34 },
  { day: 'Day 30', flagged: 14, resolved: 42 }
];

export const LIVE_AGENT_FEED = [
  {
    time: '22:42:01',
    level: 'INFO',
    text: 'TrueForge Agent queryMcpReach completed across 42 IAM roles & 24 GitHub repositories.'
  },
  {
    time: '22:42:03',
    level: 'WARN',
    text: 'Flagged 142-day-old wildcard credential AKIAIOSFODNN7EXAMPLE (Marcus Vance). CVSS 9.4.'
  },
  {
    time: '22:42:05',
    level: 'HALT',
    text: 'Agent paused at Human Approval Gate. Lateral breach verified in eBPF sandbox. Human authorization required.'
  },
  {
    time: '22:42:10',
    level: 'INFO',
    text: 'Continuous CloudTrail replay verification: 0 requests would break with proposed policy diff.'
  }
];

export const EXPLOIT_CHAIN_STEPS = [
  {
    id: 1,
    title: 'IAM:ListKeys',
    action: 'Discovery & Recon',
    nodeType: 'recon',
    description: 'Agent scans AWS IAM via MCP connector and identifies 142-day-old dormant key AKIAIOSFODNN7EXAMPLE.',
    codeSnippet: 'aws iam list-access-keys --user-name ProductionDataPipelineWorker',
    status: 'ACTIVE_FOUND'
  },
  {
    id: 2,
    title: 'S3:GetObject',
    action: 'Over-Privileged Read',
    nodeType: 'lateral',
    description: 'Dormant key possesses wildcard ["s3:*"] on "*". Reads s3://prod-configs-internal/vault-bootstrap.json.',
    codeSnippet: 'aws s3 cp s3://prod-configs-internal/vault-bootstrap.json - | jq .secrets_arn',
    status: 'BREACH_LEVERAGED'
  },
  {
    id: 3,
    title: 'SecretsManager:DumpSecrets',
    action: 'Data Exfiltration Pivot',
    nodeType: 'critical',
    description: 'Extracted bootstrap role grants lateral access to dump production database master credentials.',
    codeSnippet: 'aws secretsmanager get-secret-value --secret-id prod/database/master',
    status: 'CRITICAL_VULN_PROVEN'
  }
];
