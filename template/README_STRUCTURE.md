# React Project Structure - Best Practices

## 📁 New Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── auth/            # Authentication related components
│   │   ├── ProtectedRoute.jsx
│   │   └── AccessDenied.jsx
│   ├── layout/          # Layout components
│   │   ├── AppLayout.jsx
│   │   └── Header.jsx
│   ├── features/        # Feature-specific components
│   │   ├── modals/      # Modal components
│   │   └── BubbleChat.jsx
│   ├── ui/              # Basic UI components (buttons, inputs, etc.)
│   └── index.js         # Component exports
├── pages/               # Page components (route components)
│   ├── auth/            # Authentication pages
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── admin/           # Admin pages
│   │   ├── manager.order.jsx
│   │   └── manager.camera.jsx
│   ├── camera/          # Camera related pages
│   │   ├── PublicCamera.jsx
│   │   ├── Camera.jsx
│   │   └── Video.jsx
│   ├── error/           # Error pages
│   │   ├── not.found.jsx
│   │   └── permission.jsx
│   ├── Home.jsx
│   ├── Profile.jsx
│   └── index.js         # Page exports
├── store/               # Redux store
│   ├── slices/          # Redux slices
│   │   └── authSlice.js
│   ├── store.js
│   └── index.js
├── services/            # API services
│   ├── api.js
│   └── axios-config.js
├── hooks/               # Custom React hooks
│   └── useAuth.js
├── utils/               # Utility functions
│   ├── status.color.js
│   └── index.js
├── constants/           # App constants
│   ├── api.js
│   └── index.js
├── assets/              # Static assets
│   └── react.svg
├── App.jsx              # Main App component
└── main.jsx             # Entry point
```

## 🎯 Key Improvements Made

### 1. **File Naming Convention**
- ✅ **PascalCase** for components: `AppLayout.jsx`, `ProtectedRoute.jsx`
- ✅ **camelCase** for utilities and hooks: `useAuth.js`, `status.color.js`
- ✅ **kebab-case** for pages that are routes: `manager.order.jsx`

### 2. **Folder Organization**
- ✅ **Separation of Concerns**: Components, pages, services, store are clearly separated
- ✅ **Feature-based Grouping**: Auth components together, layout components together
- ✅ **Logical Hierarchy**: Modals inside features, auth pages together

### 3. **Import/Export Strategy**
- ✅ **Barrel Exports**: `index.js` files for clean imports
- ✅ **Absolute Imports**: Using `@/` alias for cleaner import paths
- ✅ **Constants Extraction**: API URLs and routes in constants

### 4. **State Management**
- ✅ **Redux Toolkit**: Modern Redux with slices
- ✅ **Custom Hooks**: `useAuth` hook for auth logic
- ✅ **Clean Store Structure**: Slices in separate folder

### 5. **API Layer**
- ✅ **Constants**: API endpoints and routes extracted
- ✅ **Axios Configuration**: Centralized HTTP client setup
- ✅ **Service Layer**: Clean API functions

## 🚀 Benefits

1. **Scalability**: Easy to add new features and components
2. **Maintainability**: Clear structure makes code easy to find and modify
3. **Reusability**: Components are properly organized for reuse
4. **Developer Experience**: Better imports, clear naming, logical structure
5. **Team Collaboration**: Consistent patterns for team development

## 📝 Usage Examples

### Importing Components
```jsx
// Before
import ProtectedRoute from "./components/protected.route";
import LayoutApp from "./components/layout.app";

// After
import { ProtectedRoute, AppLayout } from "@/components";
```

### Using Custom Hooks
```jsx
// Before
const dispatch = useDispatch();
const token = localStorage.getItem("access_token");

// After
const { isAuthenticated, user, initializeAuth } = useAuth();
```

### API Calls
```jsx
// Before
axios.post("http://localhost:8080/api/auth/login", data);

// After
axios.post(API_ENDPOINTS.AUTH + API_ROUTES.AUTH.LOGIN, data);
```

## 🔧 Next Steps

1. **Add TypeScript**: Convert `.jsx` to `.tsx` for better type safety
2. **Component Library**: Create a design system with reusable UI components
3. **Testing**: Add unit tests for components and hooks
4. **Documentation**: Add JSDoc comments for better code documentation
5. **Performance**: Implement code splitting and lazy loading

This structure follows React best practices and will scale well as your application grows!