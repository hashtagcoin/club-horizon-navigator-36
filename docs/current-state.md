# Current State Analysis

## Large Components That Need Refactoring

### 1. ClubDetailsPanel.tsx (242 lines)
- **Issues:**
  - Handles too many responsibilities (events, specials, main details)
  - Complex animation logic mixed with UI
  - Multiple state management concerns
- **Proposed Solutions:**
  - Split into separate card components
  - Move animation logic to a custom hook
  - Create separate context for state management

### 2. ClubMap.tsx (246 lines)
- **Issues:**
  - Complex map styling mixed with functionality
  - Large map options configuration
  - Multiple marker handling logic
- **Proposed Solutions:**
  - Extract map styles to separate config file
  - Create separate marker components
  - Move map options to configuration file

### 3. ClubPilot.tsx (192 lines)
- **Issues:**
  - Too many hooks and state management
  - Mixed concerns between layout and functionality
  - Complex chat window handling
- **Proposed Solutions:**
  - Create separate contexts for different features
  - Split into smaller functional components
  - Move chat logic to dedicated manager

### 4. FriendsList.tsx (178 lines)
- **Issues:**
  - Mixed UI and animation logic
  - Complex state management
  - Multiple responsibilities
- **Proposed Solutions:**
  - Extract animation to custom hook
  - Create separate components for list and chat
  - Use context for friend management

## Common Patterns to Address

1. **State Management**
   - Create dedicated contexts for:
     - Club selection/filtering
     - Chat management
     - Location management
     - Friend management

2. **UI Components**
   - Extract common patterns into reusable components:
     - Card layouts
     - List items
     - Modal wrappers

3. **Animation Logic**
   - Create shared animation hooks:
     - useSlideAnimation
     - useCardAnimation
     - useMapAnimation

4. **Configuration**
   - Centralize configuration:
     - Map styles
     - Default values
     - Animation settings

## Refactoring Strategy

1. Phase 1: Setup Infrastructure
   - Create contexts
   - Set up shared hooks
   - Extract configuration

2. Phase 2: Component Splitting
   - Break down large components
   - Create specialized sub-components
   - Implement shared UI components

3. Phase 3: State Management
   - Implement contexts
   - Migrate state to appropriate locations
   - Clean up prop drilling

4. Phase 4: Animation and Styling
   - Implement shared animation hooks
   - Clean up and centralize styles
   - Create consistent UI patterns

## Testing Strategy

- Add unit tests for new components
- Ensure refactored components maintain existing functionality
- Add integration tests for complex interactions