# XPERTY - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

```bash
# 1. Navigate to project directory
cd xperty-react-app

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
# Application will automatically open at http://localhost:3000
```

### First Time Setup

1. **Landing Page**: You'll see the landing page with 2 personas
   - Landlords (for 1-50 properties)
   - Enterprise (for 50+ properties)

2. **Registration**: Click on a persona card
   - Fill in your details, OR
   - Click "Use Demo Environment" to load sample data

3. **Dashboard**: After registration, you'll be redirected to the dashboard
   - Explore widgets
   - Add your first property
   - Try the Property 360 view

### Demo Account

If you want to explore without creating an account:

- Email: `demo@xperty.com`
- Password: `demo123456`

OR click "Use Demo Environment" during registration to auto-create a demo account.

## 📋 What's Included

### ✅ Working Features
- Landing page with 2 personas
- Registration with demo data option
- Login with persistent authentication
- Dashboard layout with sidebar navigation
- Dashboard home with stats and activity
- Responsive mobile design
- PWA configuration (service worker ready)
- Authentication system
- Toast notifications
- Theme support

### 🏗️ Stub Pages (Ready to Implement)
- Properties page
- Units page
- Tenants page
- Maintenance page
- Compliance page
- Documents page
- Meters page
- Reports page
- Settings page

### 🎯 Next Steps to Complete

#### 1. Property Onboarding Flow
Create `src/components/property/PropertyOnboarding.jsx`:
- Multi-step wizard
- Intention capture (what to track)
- Adaptive flow based on selections
- Visual asset library
- Compliance pre-check
- Summary & activation

#### 2. Property 360 View
Create `src/components/property/Property360View.jsx`:
- Right-side slider (fullscreen on mobile)
- 7 tabs: Details, Units, Assets, Tenants, Maintenance, Compliance, Finance
- Swipe gestures
- Mobile-optimized

#### 3. Configurable Dashboard
Create `src/components/dashboard/WidgetSystem.jsx`:
- Widget library
- Drag & drop reordering (use react-beautiful-dnd)
- Add/remove widgets
- Resize widgets
- Save configurations

#### 4. Visual Asset Library
Create `src/components/property/AssetLibrary.jsx`:
- 100+ categorized assets
- Card-based selection
- Compliance indicators
- Search and filter

#### 5. Smart AI Assistant
Create `src/components/ai/ChatAssistant.jsx`:
- Context-aware responses
- Intent recognition
- Form filling via chat
- Navigation commands

#### 6. Mock Data Service
Create `src/services/mockDataService.js`:
- 12 sample properties
- 25 sample tenants
- 50+ assets
- Compliance certificates
- Maintenance records

#### 7. Complete Page Implementations
For each stub page, implement:
- Data tables with sorting/pagination
- Filter and search
- CRUD operations
- Mobile-responsive cards
- Actions and modals

## 🎨 Design System Usage

### Buttons
```jsx
<button className="ent-btn-primary">Primary Action</button>
<button className="ent-btn-secondary">Secondary Action</button>
<button className="ent-btn-accent">Accent Action</button>
<button className="ent-btn-ghost">Ghost Action</button>
<button className="ent-btn-danger">Danger Action</button>
```

### Cards
```jsx
<div className="ent-card p-6">
  Card content
</div>

<div className="ent-card-hover p-6">
  Hoverable card
</div>
```

### Inputs
```jsx
<input type="text" className="ent-input" placeholder="Enter text" />
<select className="ent-select">
  <option>Option 1</option>
</select>
```

### Badges
```jsx
<span className="ent-badge-success">Active</span>
<span className="ent-badge-warning">Pending</span>
<span className="ent-badge-error">Overdue</span>
<span className="ent-badge-info">Info</span>
<span className="ent-badge-neutral">Neutral</span>
```

### Status Dots
```jsx
<span className="status-dot-active"></span>
<span className="status-dot-pending"></span>
<span className="status-dot-inactive"></span>
<span className="status-dot-error"></span>
```

## 🔧 Common Tasks

### Add a New Page
1. Create file in `src/pages/`
2. Add route in `src/App.jsx`
3. Add navigation item in `src/components/dashboard/DashboardLayout.jsx`

### Add a New Widget
1. Create widget component in `src/components/dashboard/widgets/`
2. Add to widget library
3. Users can add from dashboard

### Customize Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  brand: {
    // Your custom colors
  }
}
```

### Add API Integration
Create service in `src/services/`:
```javascript
// src/services/propertyService.js
export const propertyService = {
  getAll: async () => {
    const response = await fetch('/api/properties')
    return response.json()
  },
  // Add more methods
}
```

## 📱 PWA Deployment

### Production Build
```bash
npm run build
```

This generates:
- Optimized static files in `dist/`
- Service worker for offline support
- Manifest for installability
- Compressed assets

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Deploy to Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

## 🐛 Troubleshooting

### Development Server Won't Start
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
```bash
# Check for TypeScript errors (if using TS)
npm run lint

# Clear build cache
rm -rf dist
npm run build
```

### PWA Not Installing
- Ensure you're using HTTPS
- Check service worker registration in DevTools
- Verify manifest.json is accessible
- Check browser console for errors

## 📚 Resources

- **React Docs**: https://react.dev
- **Vite Docs**: https://vitejs.dev
- **Tailwind Docs**: https://tailwindcss.com
- **Lucide Icons**: https://lucide.dev
- **PWA Guide**: https://web.dev/progressive-web-apps/

## 🎯 Development Roadmap

### Phase 1: Core Features (Week 1-2)
- ✅ Authentication
- ✅ Dashboard layout
- ✅ Basic navigation
- 🏗️ Property onboarding
- 🏗️ Property 360 view

### Phase 2: Data Management (Week 3-4)
- 🏗️ Properties CRUD
- 🏗️ Tenants CRUD
- 🏗️ Assets management
- 🏗️ Compliance tracking

### Phase 3: Advanced Features (Week 5-6)
- 🏗️ Configurable dashboard
- 🏗️ AI assistant
- 🏗️ Reports & analytics
- 🏗️ Document management

### Phase 4: Polish & Deploy (Week 7-8)
- 🏗️ Mobile optimization
- 🏗️ PWA enhancements
- 🏗️ Performance tuning
- 🏗️ Production deployment

## 💡 Tips

1. **Start with Demo Data**: Use demo mode to see how the app should work with real data
2. **Mobile First**: Test on mobile devices frequently
3. **Use the Design System**: Stick to defined button/card/badge classes
4. **Component Reusability**: Build shared components in `src/components/shared/`
5. **Keep it Simple**: Start with basic features, add complexity gradually

## 🤝 Need Help?

- Check `README.md` for detailed documentation
- Review `IMPLEMENTATION_GUIDE.md` for architecture details
- Inspect existing components for patterns
- Use browser DevTools for debugging

---

**Happy Building! 🚀**
