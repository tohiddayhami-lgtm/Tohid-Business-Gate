# OmanGate Firestore Security Specification

## 1. Data Invariants
- An application cannot exist without a `userId` that matches the authenticated user.
- Applications have strict statuses that follow a state machine (draft -> submitted -> in_review -> ...).
- Users can only read their own applications or chats unless they are admins.
- Timestamps (`createdAt`, `updatedAt`) must be server-generated.

## 2. The Dirty Dozen (Attacks & Payloads)

1. **Identity Spoofing**: `applications/{any}` - `{"userId": "another_user"}` (Try to create application for someone else).
2. **Privilege Escalation**: `users/{myUid}` - `{"role": "admin"}` (Try to make myself an admin).
3. **Ghost Field Injection**: `applications/{any}` - `{"isApproved": true, "userId": "myUid"}` (Inject hidden approval flag).
4. **ID Poisoning**: `users/A?REALLY_LONG_ID_OR_SQL_INJECTION!!` (Attack via document ID).
5. **Denial of Wallet**: `applications/{any}` - `{"data": "A" * 1024 * 1024}` (Massive field size).
6. **Relation Bypass**: `chats/{other_user_chat}/messages` (Read/write messages in someone else's chat).
7. **Terminal State Break**: Update an `approved` application back to `draft`.
8. **PII Leak**: Querying `users` collection without filtering by `uid`.
9. **Timestamp Fork**: Providing a future or past `createdAt`.
10. **Query Scraper**: `db.collection('applications').get()` (Attempt to list ALL applications).
11. **Relational Sync Failure**: Creating an application with a `serviceId` that doesn't exist.
12. **Status Shortcut**: Moving status from `draft` to `approved` directly.

## 3. Test Runner (Summary)
The following rules will be tested against these payloads and must return `PERMISSION_DENIED`.
