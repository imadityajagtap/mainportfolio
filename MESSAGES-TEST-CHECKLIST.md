# Messages Section Test Checklist

## Testing Instructions

### 1. Start Dev Server
```bash
npm run dev
```

### 2. Navigate to Messages
Go to: `/admin/messages`

### 3. Test View Functionality

**View Button Test:**
- [ ] Click the eye icon (View) on any message
- [ ] Verify modal opens with full message details
- [ ] Verify modal shows:
  - [ ] Sender name
  - [ ] Email address (clickable mailto: link)
  - [ ] Date and time sent
  - [ ] Read/Unread status badge
  - [ ] Full message content (preserves line breaks)
- [ ] Verify "Close" button closes the modal
- [ ] Verify clicking outside modal closes it
- [ ] Verify X button in top-right closes modal

**Read Status Test:**
- [ ] Find an unread message (blue "Unread" badge)
- [ ] Click View on that message
- [ ] Verify status changes to "Read" in the table
- [ ] Verify status badge changes from blue "Unread" to gray "Read"
- [ ] Refresh the page - verify status persists

**Delete from Modal Test:**
- [ ] Open a message in view modal
- [ ] Click "Delete Message" button in modal
- [ ] Verify delete confirmation modal appears
- [ ] Click "Delete" to confirm
- [ ] Verify success alert: "✅ Message deleted successfully!"
- [ ] Verify both modals close
- [ ] Verify message removed from table
- [ ] Verify message no longer in database

### 4. Test Delete from Table

**Direct Delete Test:**
- [ ] Click trash icon on any message in the table
- [ ] Verify delete confirmation modal appears
- [ ] Click "Delete" to confirm
- [ ] Verify success alert shows
- [ ] Verify message disappears from table immediately
- [ ] If that message was open in view modal, verify modal closes

**Cancel Delete Test:**
- [ ] Click trash icon on a message
- [ ] Click "Cancel" in confirmation modal
- [ ] Verify modal closes
- [ ] Verify message remains in table

### 5. Test Empty State
- [ ] Delete all messages
- [ ] Verify empty state shows:
  - [ ] Mail icon
  - [ ] "No messages yet" text
  - [ ] Helper text about contact form

### 6. Test Error Handling

**Network Error Test:**
- Stop MongoDB or disconnect internet
- Try viewing a message
- Try deleting a message
- Verify error alerts show with specific error messages

**Authentication Test:**
- Log out
- Try accessing `/admin/messages` directly
- Verify redirect to login or 401 error

### 7. Test Table Features

**Data Display:**
- [ ] Name column shows sender name correctly
- [ ] Email column shows email address
- [ ] Message column shows truncated preview with ellipsis
- [ ] Date column shows formatted date (e.g., "Jan 15, 2026, 3:45 PM")
- [ ] Status column shows Read/Unread badge
- [ ] Actions column shows Eye and Trash icons

**Hover Effects:**
- [ ] Row hover changes background color
- [ ] Eye icon hover changes color to primary
- [ ] Trash icon hover changes color to red
- [ ] Action buttons show hover background

### 8. Test Responsive Behavior
- [ ] Resize browser to mobile width
- [ ] Verify table scrolls horizontally if needed
- [ ] Verify modal is responsive and centered
- [ ] Verify modal doesn't overflow on small screens

### 9. Test Multiple Messages
- [ ] Have 5+ messages in the system
- [ ] Verify all load correctly
- [ ] Verify sorting (newest first)
- [ ] Open different messages - verify correct one shows
- [ ] Delete from middle of list - verify others remain

## Common Issues to Watch For

1. **View button does nothing** → Check console for errors, verify onClick handler exists
2. **Modal shows wrong message** → selectedMessage state not updating correctly
3. **Delete removes wrong message** → ID mismatch in filter
4. **Status doesn't update** → PUT request to mark as read failed
5. **Modal won't close** → stopPropagation missing on modal content
6. **401 errors** → Session expired, log in again

## Success Criteria

✅ View button opens modal with complete message details
✅ Read status updates automatically when viewing unread messages
✅ Delete works from both table and modal
✅ Success/error alerts show for all operations
✅ UI updates immediately without page refresh
✅ Empty state shows when no messages
✅ All hover effects and transitions work smoothly
✅ Responsive design works on mobile and desktop
✅ Authentication properly protects all operations

## API Endpoints Used

- `GET /api/messages` - Fetch all messages
- `GET /api/messages/[id]` - Fetch single message (optional, not used in current implementation)
- `PUT /api/messages/[id]` - Mark message as read
- `DELETE /api/messages/[id]` - Delete message

All endpoints require authentication via NextAuth session.
