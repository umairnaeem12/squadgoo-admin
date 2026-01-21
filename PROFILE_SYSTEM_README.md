# Admin Profile System - Complete Implementation

## Overview

This is a comprehensive Admin Profile System for managing Job Seeker, Recruiter, and Staff profiles. The system provides full view, edit, and action capabilities with admin-only controls, problem-solving tools, audit trails, and staff management controls.

## Features Implemented

### ✅ Core Features

1. **Profile View Parity**
   - Admin sees everything the user sees in the mobile app
   - Exact same sections, grouping, and values
   - Complete data transparency

2. **Profile Types Supported**
   - Job Seeker profiles
   - Recruiter profiles
   - Staff profiles

3. **Profile Header**
   - Profile picture with completeness indicator
   - Name, ID, role, rating with stars
   - Email, phone, profile status
   - Account status badge (Active/Inactive/Suspended/Blocked)
   - Verification badge (Verified/Pending/Rejected)
   - Custom badges (Top Verified, Premium Member, etc.)
   - Action buttons: Back, Internal Notes, Start Chat

4. **Profile Menu Navigation**
   - Sidebar menu matching mobile app structure
   - Status indicators for each section
   - Visual feedback for active section
   - User-type specific menus

### ✅ Job Seeker Profile Sections

- Basic details
- Address
- Contact details
- Experience
- Education
- Preferences
- Tax information
- Visa details
- KYC & KYB verifications
- Extra job qualifications
- Documents
- Job history
- Conversations
- Social media
- Password

### ✅ Recruiter Profile Sections

- Basic details
- Address
- Contact details
- Company details (replaces qualifications)
- Tax information
- KYC & KYB verifications
- Documents
- Job postings
- Conversations
- Social media
- Password

### ✅ Staff Profile Sections

- Basic details
- Address
- Contact details
- Documents
- Password
- Staff hierarchy and roles
- Department assignments
- Menu permissions

### ✅ Document Management (Full CRUD)

- **List View**: Shows all documents with metadata
- **Upload**: Admin can upload documents on behalf of users
  - Choose document type
  - Add notes
  - Track upload metadata
- **View/Preview**: Open documents in new tab
- **Download**: Download any document
- **Verify**: Mark documents as verified with reason
- **Reject**: Reject documents with reason
- **Request Re-upload**: Request user to resubmit document
- **Delete**: Remove documents (with confirmation + reason)
- **Status Tracking**: Pending/Verified/Rejected with timestamps
- **Verifier Info**: Who verified and when

### ✅ KYC/KYB Manual Review Workflow

- **Submission Details**:
  - ID type, ID number (masked)
  - Submission timestamp
  - Current status
  - Review history with attempts
  
- **Review Actions**:
  - Approve/Verify: Mark KYC as verified
  - Reject: Reject with reason + optional additional docs
  - Need More Info: Request specific documents
  
- **History Tracking**:
  - All previous attempts
  - Rejection reasons
  - Requested documents
  - Reviewer details

- **Document Integration**:
  - View submitted documents inline
  - Quick access to document viewer
  - Status indicators per document

### ✅ Profile Editing

- Section-by-section editing
- Inline field editors
- Validation support
- **Reason Required**: All edits require reason input
- Audit log creation
- Permission-based access control

### ✅ Internal Staff Notes

- **Add Note**: Create internal notes about the profile
- **Categories**: Wallet, KYC, Behavior, Technical, Other
- **Privacy Control**: Mark notes as private
- **Timeline View**: Chronological display
- **Author Tracking**: Who wrote the note and when
- **Never Visible to Users**: Internal only

### ✅ Badge Management

- **Add Badge**: Assign badges with reason
- **Remove Badge**: Remove badges with reason
- **Badge History**: Track who added/removed and why
- **Visual Display**: Color-coded badges in header
- **Hover Details**: See badge details on hover

### ✅ Status Actions (with Audit)

All actions require reason + create audit log:

- **Suspend User**: Temporarily suspend account
- **Unsuspend User**: Restore suspended account
- **Block User**: Permanently block account
- **Unblock User**: Restore blocked account
- **Activate User**: Activate inactive account
- **Deactivate User**: Deactivate active account
- **Delete Account**: Permanently delete (with warnings)

### ✅ Assignment & Ownership System

- **Case Ownership**: Track who is handling the profile
- **Assign to Me**: Claim a case
- **Assign to Staff**: Assign to specific team member
- **Transfer**: Transfer case to another staff member
- **Transfer History**: Full history of assignments
- **Department Tracking**: Link assignments to departments
- **Status**: Open, In Progress, Resolved, Transferred
- **Prevent Duplicates**: Visual indication of ownership

### ✅ Audit Trail

- **Comprehensive Logging**: Every action is logged
- **Captures**:
  - Actor (staff who performed action)
  - Action type (verify, reject, edit, suspend, etc.)
  - Module (profile, kyc, wallet, document, etc.)
  - Before/After values
  - Reason (required)
  - Timestamp
  - IP address
  
- **Filtering**: Filter by module or action type
- **Expandable Details**: Show before/after JSON
- **Color-Coded**: Visual indicators for action types

### ✅ Problem Visibility

- **Issues Summary Block**:
  - Wallet issues (pending transactions, bank verification)
  - KYC issues (pending review, rejections)
  - Open tickets count
  - Chat reports count
  - Flags (suspicious activity, repeated declines)
  
- **Quick Navigation**: "Go to section" buttons for each issue

### ✅ Chat Integration

- **Live Chat**: Admin ↔ User support chat
- **User-to-User Chat Viewer**:
  - WhatsApp-style interface
  - Left: conversation list
  - Right: message panel
  - Search conversations
  - Filter reported messages
  - Jump to reported message anchor

### ✅ Staff Management (Staff Profiles Only)

- **Hierarchy Roles**:
  - Super Admin (top level)
  - Admin/Manager
  - Staff/Customer Service
  
- **Role Management**:
  - Promote/demote staff
  - Role history tracking
  - Permission-based actions
  
- **Department Assignment**:
  - Assign to multiple departments
  - Access levels: View only, Action allowed, Manager
  - Can take ownership: Yes/No
  - Can transfer cases: Yes/No
  
- **Menu Permissions Matrix**:
  - Configure which menus staff can access
  - Granular action permissions
  - Module-based grouping
  
- **Workload Visibility**:
  - Show pending cases by type
  - Wallet, KYC, Tickets, Disputes
  - Reassignment capability
  
- **Staff Activity Log**:
  - All actions performed by staff
  - Filterable by module
  - Accountability tracking

## Technical Implementation

### TypeScript Types

**Location**: `src/types/admin-profile.ts`

Comprehensive type definitions for:
- Profile structure
- Documents
- KYC/KYB submissions
- Audit entries
- Assignments
- Staff hierarchy
- Permissions
- API requests/responses

### Components

**Location**: `src/components/user-profile/`

1. **ProfileHeader.tsx**: Header with profile picture, badges, actions
2. **ProfileMenu.tsx**: Sidebar navigation menu
3. **SectionDetailView.tsx**: Generic section viewer with edit capability
4. **DocumentManagement.tsx**: Full CRUD for documents
5. **KYCReviewWorkflow.tsx**: KYC/KYB review interface
6. **AdminControlsOverlay.tsx**: Notes, badges, status actions
7. **AssignmentAndAudit.tsx**: Assignment panel and audit trail
8. **ComprehensiveProfilePage.tsx**: Main page integrating all components

### API Routes

**Location**: `src/app/api/profile/`

1. `/profile/[userType]/[userId]/route.ts`: Get/update profile
2. `/profile/documents/route.ts`: Document CRUD
3. `/profile/kyc/route.ts`: KYC review actions
4. `/profile/notes/route.ts`: Staff notes management
5. `/profile/badges/route.ts`: Badge management
6. `/profile/status/route.ts`: Status actions
7. `/profile/assignment/route.ts`: Assignment operations

### Mock Data

**Location**: `src/data/mockProfileData.ts`

- Complete mock data generator
- Supports all three profile types
- Includes all sections, documents, KYC, badges, notes, etc.

## Usage

### View a Profile

Navigate to:
```
/admin/profile/[userType]/[userId]/new-page
```

Where:
- `userType`: `jobseeker`, `recruiter`, or `staff`
- `userId`: User's unique ID

Examples:
- `/admin/profile/jobseeker/1035/new-page`
- `/admin/profile/recruiter/5678/new-page`
- `/admin/profile/staff/999/new-page`

### Component Usage

```tsx
import ComprehensiveProfilePage from "@/components/user-profile/ComprehensiveProfilePage";

<ComprehensiveProfilePage
  profile={profile}
  currentStaffId="admin-1"
  availableStaff={staffList}
  onProfileUpdate={(updates) => {
    // Handle updates
  }}
/>
```

## API Integration

Replace mock data with actual API calls:

```typescript
// Example: Fetch real profile
const response = await fetch(`/api/profile/${userType}/${userId}`);
const profile = await response.json();

// Example: Update section
await fetch(`/api/profile/${userType}/${userId}`, {
  method: 'PATCH',
  body: JSON.stringify({ sectionKey, fields, reason })
});

// Example: Verify document
await fetch('/api/profile/documents', {
  method: 'PATCH',
  body: JSON.stringify({ documentId, action: 'verify', reason })
});
```

## Database Schema Requirements

You'll need tables for:

1. **users**: User profiles
2. **profile_sections**: Dynamic profile sections
3. **documents**: Document storage metadata
4. **kyc_submissions**: KYC/KYB submissions with history
5. **staff_notes**: Internal notes
6. **badges**: Badge assignments
7. **assignments**: Case ownership tracking
8. **audit_logs**: Comprehensive audit trail
9. **staff_permissions**: Staff role and permission matrix
10. **chat_messages**: Chat history
11. **chat_conversations**: Conversation metadata

## Security Considerations

1. **Authentication**: Verify staff has permission to view/edit profiles
2. **Authorization**: Role-based access control for all actions
3. **Audit Logging**: Log all sensitive actions
4. **Reason Required**: Enforce reason input for important actions
5. **Data Masking**: Mask sensitive fields (ID numbers, SSN, etc.)
6. **File Upload Security**: Validate file types, scan for malware
7. **Rate Limiting**: Prevent abuse of API endpoints

## Permissions Matrix Example

```typescript
const permissions = {
  'super-admin': {
    canViewProfiles: true,
    canEditProfiles: true,
    canVerifyKYC: true,
    canSuspendUsers: true,
    canDeleteAccounts: true,
    canManageStaff: true,
  },
  'admin': {
    canViewProfiles: true,
    canEditProfiles: true,
    canVerifyKYC: true,
    canSuspendUsers: true,
    canDeleteAccounts: false,
    canManageStaff: false,
  },
  'staff': {
    canViewProfiles: true,
    canEditProfiles: false,
    canVerifyKYC: false,
    canSuspendUsers: false,
    canDeleteAccounts: false,
    canManageStaff: false,
  },
};
```

## Testing

Test the following workflows:

1. **Profile View**: Navigate through all sections
2. **Document Upload**: Upload a test document
3. **Document Actions**: Verify, reject, request reupload
4. **KYC Review**: Approve/reject KYC submission
5. **Edit Section**: Make changes with reason
6. **Add Note**: Create internal note
7. **Add Badge**: Assign a badge
8. **Status Action**: Suspend/unsuspend user
9. **Assignment**: Assign case to yourself/others
10. **Audit Trail**: Verify all actions are logged

## Future Enhancements

- [ ] Real-time notifications
- [ ] Bulk actions (multiple profiles)
- [ ] Advanced search and filters
- [ ] Export to PDF/Excel
- [ ] Email notifications for status changes
- [ ] Integration with payment/wallet system
- [ ] Video call support for verification
- [ ] AI-powered document verification
- [ ] Mobile app for staff
- [ ] Advanced analytics dashboard

## Support

For issues or questions, refer to:
- Type definitions in `src/types/admin-profile.ts`
- Component implementations in `src/components/user-profile/`
- API routes in `src/app/api/profile/`
- Mock data in `src/data/mockProfileData.ts`

## Credits

Built following the comprehensive requirements for an admin profile system with full parity to user mobile app plus admin-only controls and problem-solving tools.
