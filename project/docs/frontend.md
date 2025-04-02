# P Triple E Games - Frontend Documentation

## Overview
The frontend of P Triple E Games is built using Next.js 14 with TypeScript, providing a modern, responsive, and type-safe user interface for managing video game inventory. The application follows a component-based architecture and implements best practices for state management, routing, and user authentication.

## Technology Stack
- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: CSS Modules
- **State Management**: React Hooks
- **Image Handling**: Next.js Image Component
- **API Integration**: Fetch API with TypeScript types

## Project Structure
```
project/
├── app/
│   ├── components/         # Reusable UI components
│   ├── api/               # API route handlers
│   ├── lib/               # Utility functions and configurations
│   ├── types/             # TypeScript type definitions
│   └── services/          # API service layer
├── public/                # Static assets and uploads
└── styles/               # Global styles and CSS modules
```

## Core Components

### 1. Inventory Page (`app/inventory/page.tsx`)
The main inventory management interface that displays all games in a card-based layout.

#### Features
- Responsive grid layout for game cards
- Filtering by platform and genre
- Admin-only actions (add, edit, delete)
- Image support with fallback
- Real-time updates

#### State Management
```typescript
const [games, setGames] = useState<VideoGame[]>([]);
const [platforms, setPlatforms] = useState<string[]>([]);
const [filter, setFilter] = useState<FilterState>({
  platform: '',
  genre: '',
  rating: ''
});
```

### 2. GameForm Component (`app/components/GameForm.tsx`)
A reusable form component for adding and editing games.

#### Features
- Form validation
- Image upload with preview
- Platform selection
- Rating system (1-5 stars)
- Price and quantity management

#### Props Interface
```typescript
interface GameFormProps {
  game: GameFormData;
  platforms: string[];
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  submitLabel: string;
  onChange: (field: keyof GameFormData, value: string) => void;
}
```

## Styling

### CSS Modules
The application uses CSS Modules for component-specific styling, ensuring:
- Scoped CSS classes
- No style conflicts
- Better maintainability
- Improved performance

#### Example Structure
```css
/* inventory.module.css */
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.gameGrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.gameCard {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow: hidden;
  transition: transform 0.2s;
}

.gameCard:hover {
  transform: translateY(-4px);
}
```

## API Integration

### API Service Layer (`app/services/api.ts`)
Centralized service for handling all API calls.

#### Available Methods
```typescript
const api = {
  fetchInventory(): Promise<VideoGame[]>;
  fetchPlatforms(): Promise<string[]>;
  fetchUser(): Promise<User>;
  addGame(game: GameFormData): Promise<{ success: boolean; gameId: number }>;
  updateGame(id: number, data: GameFormData): Promise<{ success: boolean }>;
  deleteGame(gameId: number): Promise<{ success: boolean }>;
  uploadImage(file: File): Promise<string>;
}
```

## Authentication Flow

### User Authentication
1. Login form submission
2. Token storage in HTTP-only cookies
3. Protected route verification
4. Role-based access control

### Protected Routes
- `/inventory`: Viewable by all authenticated users
- Admin actions (add/edit/delete): Restricted to admin users (userType === 1)

## Error Handling

### Global Error Handling
- API error responses
- Form validation errors
- Authentication failures
- Network issues

### Error Display
```typescript
const [error, setError] = useState('');
// Displayed in a modal or toast notification
```

## Performance Optimizations

### Image Optimization
- Next.js Image component for automatic optimization
- Lazy loading for images
- Responsive image sizes
- Fallback placeholders

### Data Fetching
- Server-side rendering where appropriate
- Client-side caching
- Optimistic updates

## Responsive Design

### Breakpoints
```css
/* Mobile first approach */
@media (min-width: 768px) {
  /* Tablet styles */
}

@media (min-width: 1024px) {
  /* Desktop styles */
}
```

### Layout Components
- Fluid grid system
- Responsive typography
- Mobile-friendly navigation
- Touch-friendly controls

## Accessibility

### Features
- Semantic HTML structure
- ARIA labels
- Keyboard navigation
- Color contrast compliance
- Screen reader support

## Development Guidelines

### Code Style
- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Component documentation

### Best Practices
1. Use TypeScript interfaces for all data structures
2. Implement proper error boundaries
3. Follow React hooks best practices
4. Maintain consistent component structure
5. Document complex logic and business rules

## Testing

### Component Testing
- Unit tests for utility functions
- Integration tests for API calls
- Component rendering tests
- User interaction tests

## Deployment

### Build Process
1. TypeScript compilation
2. CSS module processing
3. Image optimization
4. Code minification

### Environment Variables
Required environment variables:
```env
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
JWT_SECRET=
```

## Future Improvements

### Planned Features
1. Advanced search functionality
2. Sorting options
3. Bulk operations
4. Export/Import functionality
5. User preferences
6. Dark mode support
7. Offline capabilities

### Performance Enhancements
1. Implement React Query for data fetching
2. Add service worker for offline support
3. Optimize bundle size
4. Implement code splitting
5. Add performance monitoring 