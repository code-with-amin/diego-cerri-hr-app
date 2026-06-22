# HR Candidate Registration Web Application Roadmap

## Project Overview

This roadmap defines the specification for a web application that allows candidates to register, fill in resume information, and save their profiles in a structured database. The platform must also provide a restricted manager login so an HR manager can review candidate records, assign approval status, and add private internal comments visible only to the manager.

The original proposal describes a talent collaboration portal with candidate registration, profile maintenance, database storage, and restricted access for a company decision-maker to review applicants. It also recommends a modern web stack based on React/NextJS, TypeScript, Tailwind CSS, Node.js, PostgreSQL, Redis, Elasticsearch, AWS S3, and RabbitMQ.

## Product Goals

- Create a fast and simple candidate experience for entering personal, professional, and resume information.
- Ensure all submitted information is stored securely and can be retrieved through an authorized manager account.
- Enable the HR manager to evaluate each candidate with three internal controls: status, private comment, and profile review visibility.
- Provide a scalable technical foundation for future features such as search, notifications, document uploads, and integrations.

## User Roles

### Candidate
- Access a public registration form.
- Fill in and edit personal and professional information before final submission.
- Upload resume and supporting files if required.
- Receive confirmation that the data was saved.

### HR Manager
- Log in through a protected area.
- View a list of all registered candidates.
- Open a candidate profile with full submitted information.
- Assign status such as Approved, Rejected, or Under Review.
- Add internal comments visible only to manager-level users.
- Filter and search candidates by name, role, status, and submission date.

## Functional Requirements

### Candidate-Facing
1. Public candidate registration page.
2. Simple and intuitive form flow with clear labels and grouped sections.
3. Required and optional fields validation.
4. Save candidate profile to database.
5. Resume/CV upload support.
6. Confirmation screen or success message after submission.
7. Mobile-friendly experience.

### Manager-Facing
1. Secure authentication for a specific manager account or role-based HR accounts.
2. Dashboard listing all candidates.
3. Candidate profile detail view.
4. Candidate status management with values: New, Under Review, Approved, Rejected.
5. Internal notes field restricted to manager access only.
6. Search and filtering capabilities.
7. Audit visibility for submission date, last update, and evaluation status.

## Suggested Candidate Form Structure

### Basic Information
- Full name
- Email
- Phone number
- City and state
- LinkedIn profile
- Portfolio or website

### Professional Information
- Desired role
- Area of expertise
- Years of experience
- Current employment status
- Salary expectation
- Availability date
- Preferred work model (onsite, hybrid, remote)

### Education and Qualifications
- Degree level
- Course or major
- Institution
- Certifications
- Languages

### Experience Summary
- Professional summary
- Key technical skills
- Software/tools knowledge
- Main projects or achievements

### Attachments and Consent
- Resume upload
- Portfolio upload (if applicable)
- Data privacy consent
- Accuracy declaration

## Data and Permission Rules

- Candidate-submitted data must be stored in a relational database for secure retrieval and reporting.
- Resume files and attachments should be stored in object storage linked to the candidate record.
- Only authenticated manager users may access the administrative dashboard.
- Private manager comments must not be visible to candidates.
- Status changes must be saved with timestamp and responsible user.
- Sensitive data should follow secure authentication, encrypted transmission, and role-based access controls.

## Recommended Technical Architecture

### Front End
- Next.js or React with TypeScript
- Tailwind CSS for consistent UI development
- Responsive form and dashboard components

### Back End
- Node.js with Express or NestJS
- REST API or modular service architecture
- Authentication and authorization middleware

### Data Layer
- PostgreSQL for candidate records and manager review data.
- Redis for session and performance support when needed.
- Elasticsearch for future advanced talent search.
- AWS S3 for resume and portfolio files.
- RabbitMQ for asynchronous notifications and background tasks in later phases.

## Delivery Roadmap

### Phase 1 - Discovery and UX Definition
- Review current reference material and existing form examples.
- Define final candidate fields and manager workflow.
- Prepare wireframes for registration, login, dashboard, and candidate detail views.
- Approve business rules for status and private comments.

### Phase 2 - MVP Build
- Develop candidate registration form.
- Implement file upload and database persistence.
- Build secure manager login.
- Create candidate listing and profile detail screens.
- Add manager-only status and comment actions.
- Test submission flow end to end.

### Phase 3 - Validation and Hardening
- Add form validation improvements and error handling.
- Test permissions and private note visibility.
- Improve filtering, searching, and dashboard usability.
- Validate mobile responsiveness and performance.
- Run security and access-control review.

### Phase 4 - Future Enhancements
- Email notifications for submission and review milestones.
- Advanced search and talent matching.
- Reporting dashboard and export functions.
- Multi-manager role support.
- Integration with HR or ERP systems.

## Acceptance Criteria

- Candidates can submit a complete profile through a simple web form.
- Submitted information is saved successfully and can be retrieved later.
- An HR manager can log in securely and see all registered candidates.
- The HR manager can assign Approved or Rejected status to each profile.
- The HR manager can create private comments that only manager users can view.
- The system is responsive, secure, and ready for future expansion.

---

## Milestone Plan

### Milestone 1: Admin Dashboard UI (Static Interface)
**Delivery Date:** June 23, 2026

**Scope**
- HR/Admin dashboard UI design based on provided company visual identity
- Candidate listing page (UI only, no backend)
- Candidate detail view layout (UI only)
- Status control interface (Approved / Rejected / Under Review) UI only
- Internal notes section UI (non-functional)
- Search & filter UI mockup
- Responsive layout (desktop + mobile)

**Deliverables**
- Fully static dashboard prototype
- Pixel-aligned UI based on provided brand style
- Clickable navigation flow (frontend only)
- Unlimited revision cycles within scope (UI/feedback adjustments)

---

### Milestone 2: Functional HR System (Backend + Dashboard Integration)
**Delivery Date:** June 25, 2026

**Scope**
- Secure HR authentication (login system)
- Database setup (PostgreSQL)
- Candidate data storage & retrieval system
- Functional HR dashboard (connect UI to backend)
- Candidate listing from database
- Candidate profile full view (dynamic data)
- Status management system (New / Under Review / Approved / Rejected)
- Internal HR notes (private to admin users)
- Search & filtering (name, status, date)
- File access for uploaded resumes (view/download)

**Deliverables**
- Fully working HR dashboard system
- Backend API integration
- Secure access control (admin-only)
- End-to-end candidate review workflow (backend driven)
- Unlimited revisions within defined scope

---

### Milestone 3: Source Code Delivery & Deployment Support
**Delivery Date:** June 29, 2026

**Scope**
- Final code cleanup and optimization
- Full source code delivery (frontend + backend)
- Database schema and setup instructions
- Deployment assistance (server or cloud setup guidance)
- Bug fixes within agreed scope
- Handover walkthrough support

**Deliverables**
- Complete source code package
- Deployment-ready system
- Documentation for setup and maintenance
- Final production handover support
- Unlimited revision support within agreed scope
