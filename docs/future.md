# Future State Architecture

## Component Structure

```
src/
├── components/
│   ├── club/
│   │   ├── details/
│   │   │   ├── MainDetailsCard.tsx
│   │   │   ├── SpecialsCard.tsx
│   │   │   └── EventsCard.tsx
│   │   ├── list/
│   │   │   ├── ClubListItem.tsx
│   │   │   └── ClubList.tsx
│   │   └── filters/
│   │       ├── GenreFilter.tsx
│   │       └── SortFilter.tsx
│   ├── map/
│   │   ├── config/
│   │   │   ├── mapStyles.ts
│   │   │   └── mapOptions.ts
│   │   ├── markers/
│   │   │   ├── ClubMarker.tsx
│   │   │   └── UserMarker.tsx
│   │   └── MapView.tsx
│   └── shared/
│       ├── Card.tsx
│       ├── Modal.tsx
│       └── AnimatedPanel.tsx
├── contexts/
│   ├── ClubContext.tsx
│   ├── ChatContext.tsx
│   ├── LocationContext.tsx
│   └── FriendContext.tsx
├── hooks/
│   ├── animation/
│   │   ├── useSlideAnimation.ts
│   │   └── useCardAnimation.ts
│   └── club/
│       ├── useClubSelection.ts
│       └── useClubFiltering.ts
└── config/
    ├── constants.ts
    └── animations.ts
```

## Key Improvements

1. **Maintainability**
   - Smaller, focused components
   - Clear separation of concerns
   - Consistent patterns

2. **Performance**
   - Optimized rendering
   - Proper memoization
   - Efficient state management

3. **Developer Experience**
   - Clear file structure
   - Predictable patterns
   - Easy to test

4. **Scalability**
   - Easy to add features
   - Modular architecture
   - Reusable components

## Implementation Plan

1. **Week 1: Infrastructure**
   - Set up new folder structure
   - Create base contexts
   - Implement shared hooks

2. **Week 2: Component Migration**
   - Break down large components
   - Create new specialized components
   - Update imports and dependencies

3. **Week 3: State Management**
   - Implement contexts
   - Migrate state management
   - Clean up prop drilling

4. **Week 4: Polish**
   - Add tests
   - Document components
   - Performance optimization