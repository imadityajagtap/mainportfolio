# Add Revalidation to Remaining API Routes

This document lists the exact changes needed for ALL remaining API routes that need revalidation.

## Files to Update

### 1. `/app/api/blog/route.ts`
Add to imports:
```typescript
import { revalidatePath } from 'next/cache';
```

Add after `await Blog.create(body);` in POST handler:
```typescript
revalidatePath('/');
revalidatePath('/blog');
revalidatePath(`/blog/${blog.slug}`);
```

### 2. `/app/api/blog/[id]/route.ts`
Add to imports:
```typescript
import { revalidatePath } from 'next/cache';
```

Add after UPDATE (PUT/PATCH):
```typescript
revalidatePath('/');
revalidatePath('/blog');
revalidatePath(`/blog/${blog.slug}`);
```

Add after DELETE:
```typescript
revalidatePath('/');
revalidatePath('/blog');
```

### 3. `/app/api/experience/route.ts`
Add to imports:
```typescript
import { revalidatePath } from 'next/cache';
```

Add after `await Experience.create(body);`:
```typescript
revalidatePath('/'); // Homepage experience section
```

### 4. `/app/api/experience/[id]/route.ts`
Add after UPDATE:
```typescript
revalidatePath('/');
```

Add after DELETE:
```typescript
revalidatePath('/');
```

### 5. `/app/api/skills/route.ts`
Add after `await Skill.create(body);`:
```typescript
revalidatePath('/'); // Homepage skills section
```

### 6. `/app/api/skills/[id]/route.ts`
Add after UPDATE:
```typescript
revalidatePath('/');
```

Add after DELETE:
```typescript
revalidatePath('/');
```

### 7. `/app/api/achievements/route.ts`
Add after CREATE:
```typescript
revalidatePath('/'); // Homepage achievements section
```

Add after UPDATE:
```typescript
revalidatePath('/');
```

Add after DELETE:
```typescript
revalidatePath('/');
```

### 8. `/app/api/research/route.ts`
Add after CREATE:
```typescript
revalidatePath('/'); // Homepage research section
```

Add after UPDATE:
```typescript
revalidatePath('/');
```

Add after DELETE:
```typescript
revalidatePath('/');
```

### 9. `/app/api/about/route.ts`
Add after PUT:
```typescript
revalidatePath('/'); // Homepage about section
```

## Pattern to Follow

For **every POST/PUT/PATCH/DELETE** in API routes:

1. Import `revalidatePath` at the top
2. After successful database operation, call:
   ```typescript
   revalidatePath('/'); // Always revalidate homepage
   revalidatePath('/[resource]'); // Revalidate list page if exists
   revalidatePath(`/[resource]/${id}`); // Revalidate detail page if exists
   ```

3. Place revalidation BEFORE `return NextResponse.json()`

## Why This Matters

Without revalidation, Next.js App Router caches:
- Server components forever (until manual revalidate or restart)
- fetch() calls with default cache settings
- Route handlers responses

This causes the "admin updates don't show on main site" bug.
