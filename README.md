# RoboMarket AE

Premium humanoid robots e-commerce platform.

## Authentication System

The authentication system is built with a seamless modal approach that allows users to log in from anywhere in the application without losing their context.

### Features

- **Modal-based authentication**: Users can log in from any page without navigation disruption
- **Optional login**: Guests can browse and checkout without creating an account
- **Context-aware**: After login, users stay on their current page with preserved session data
- **Persistent state**: Uses Zustand for state management
- **Optimized UX**: Encourages account creation at strategic moments like checkout

### Technical Implementation

The authentication system consists of:

1. **Modal Store**: A Zustand store in `src/store/modalStore.ts` for managing modal visibility
2. **LoginModal**: A modal component in `src/components/auth/LoginModal.tsx`
3. **AuthStore Integration**: Integration with existing Supabase authentication

## Checkout Flow

The checkout process supports both guest and authenticated users:

- Guests can complete purchases without creating an account
- Logged-in users get their information pre-filled
- Optional account creation/login during checkout
- Address saving for registered users

## Development

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

## Environment Setup

Create a `.env.local` file with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Deployment

This project is configured for deployment on Vercel.

```bash
npm run build
npm start
```