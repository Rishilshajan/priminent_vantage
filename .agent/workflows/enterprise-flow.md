---
description: Enterprise Onboarding and Login Workflow
---

# Enterprise Onboarding & Login Workflow

This document outlines the standard operating procedure for enterprise clients to join and access the Prominent Vantage platform.

## I. Enterprise Onboarding Flow

1. **Invitation & Access**:
   - Admin approves the enterprise request and generates a unique **Access Code**.
   - Admin provides the Access Code and the verified Work Email to the client.

2. **Step 1: Account Activation**:
   - Client navigates to `/enterprise/access` and enters their code and email.
   - Client is shown their basic details (Name, Email).
   - Client sets a secure password for their administrator account.

3. **Step 2: Organization Configuration**:
   - Client confirms company details (Name, Industry, Website).
   - Client chooses whether to enable **Multi-Factor Authentication (MFA)** for enhanced security.

4. **Step 3: Security Setup (MFA)**:
   - If MFA was enabled in Step 2:
     - Client is presented with a QR code.
     - Client scans the code using an authenticator app (e.g., Google Authenticator, Authy).
     - Client enters the verification code to finalize enrollment.
   - If MFA was disabled, this step is automatically skipped.

5. **Completion**:
   - Client is redirected to the **Enterprise Dashboard** (`/enterprise/dashboard`).

## II. Enterprise Login Flow

1. **Credentials Entry**:
   - User navigates to `/enterprise/signin`.
   - User enters their Work Email and Password.

2. **Security Check (MFA)**:
   - **MFA Enabled**: If the user has enrolled in MFA, they are redirected to a verification page to enter their TOTP code.
   - **MFA Disabled**: User is immediately authenticated.

3. **Landing**:
   - Authenticated users are redirected to the **Enterprise Dashboard**.
