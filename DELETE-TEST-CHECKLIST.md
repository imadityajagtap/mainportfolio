# Delete Functionality Test Checklist

## Testing Instructions

### 1. Start Dev Server
```bash
npm run dev
```

### 2. Test Blog Delete
**From Blog List Page** (`/admin/blog`):
- [ ] Click delete icon on any blog post
- [ ] Confirm modal appears
- [ ] Click "Delete" in modal
- [ ] Verify success alert shows: "✅ Post deleted successfully!"
- [ ] Verify post disappears from list
- [ ] If delete fails, verify error alert shows with reason

**From Blog Edit Page** (`/admin/blog/[slug]/edit`):
- [ ] Open any blog post for editing
- [ ] Click "Delete post" button
- [ ] Confirm modal appears
- [ ] Click "Delete" in modal
- [ ] Verify success alert shows
- [ ] Verify redirect to `/admin/blog`
- [ ] Verify post no longer exists in list

### 3. Test Project Delete
**From Projects List Page** (`/admin/projects`):
- [ ] Click delete icon on any project
- [ ] Confirm modal appears
- [ ] Click "Delete" in modal
- [ ] Verify success alert shows: "✅ Project deleted successfully!"
- [ ] Verify project disappears from list
- [ ] If delete fails, verify error alert shows with reason

**From Project Edit Page** (`/admin/projects/[slug]/edit`):
- [ ] Open any project for editing
- [ ] Click "Delete project" button
- [ ] Confirm modal appears
- [ ] Click "Delete" in modal
- [ ] Verify success alert shows
- [ ] Verify redirect to `/admin/projects`
- [ ] Verify project no longer exists in list

### 4. Test Research Delete
**From Research List Page** (`/admin/research`):
- [ ] Click delete icon on any research item
- [ ] Confirm modal appears
- [ ] Click "Delete" in modal
- [ ] Verify success alert shows: "✅ Research deleted successfully!"
- [ ] Verify research disappears from list
- [ ] If delete fails, verify error alert shows with reason

**From Research Edit Page** (`/admin/research/[id]/edit`):
- [ ] Open any research item for editing
- [ ] Click "Delete research" button
- [ ] Confirm modal appears
- [ ] Click "Delete" in modal
- [ ] Verify success alert shows
- [ ] Verify redirect to `/admin/research`
- [ ] Verify research no longer exists in list

### 5. Test Authentication
Log out and try accessing delete endpoints directly:
```bash
# Should return 401 Unauthorized
curl -X DELETE http://localhost:3000/api/blog/[some-slug]
curl -X DELETE http://localhost:3000/api/projects/[some-slug]
curl -X DELETE http://localhost:3000/api/research/[some-id]
```

### 6. Test Error Scenarios
**Network Error Test:**
- Turn off MongoDB or disconnect internet
- Try deleting an item
- Verify error alert shows with network error message

**Not Found Test:**
- Manually call delete API with non-existent ID
- Verify 404 error returned

**Invalid ID Test (Research only):**
- Call `/api/research/invalid-id-format`
- Verify 400 error returned

## Common Issues to Watch For

1. **Delete silently fails** → Check browser console for errors
2. **401 Unauthorized** → Session expired, log in again
3. **Modal doesn't close** → JavaScript error in confirmDelete handler
4. **Page doesn't update** → State update failed, check setPosts/setProjects/setResearch call
5. **Wrong item deleted** → ID mismatch between modal state and API call

## Success Criteria

✅ All 12 test scenarios pass (6 list page + 6 edit page)
✅ Success alerts show for successful deletes
✅ Error alerts show for failed deletes with specific error messages
✅ UI updates immediately after delete (no page refresh needed)
✅ Authentication properly blocks unauthenticated delete requests
