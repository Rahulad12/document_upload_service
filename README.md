# Document Management System (DMS)

A modern, responsive Document Management System built with React 19, TypeScript, and Vite. This application provides comprehensive document handling capabilities with a clean, intuitive user interface and seamless API integration.

## 🎯 Features

- **Document Upload & Preview** - Upload and preview documents with drag-and-drop support
- **Document Management** - Organize, view, and manage documents efficiently
- **Document Details Viewer** - Detailed document information and metadata

## Algorithm
- **Hash Map + Tree**

## 🛠️ Tech Stack

### Core
- **Frontend Framework**: React 19
- **Language**: TypeScript 5.9
- **Build Tool**: Vite 7
- **Routing**: React Router 7

### Styling & UI
- **CSS Framework**: Tailwind CSS 4
- **Component Library**: Radix UI
- **Icons**: Lucide React

### State & Data
- **Server State**: TanStack React Query
- **HTTP Client**: Axios

### Developer Tools
- **Linting**: ESLint 9
- **Formatting**: Prettier

## 📁 Project Structure

```
├── assets
│   └── react.svg
├── components
│   ├── custom
│   │   ├── common
│   │   │   ├── document-preview.tsx
│   │   │   ├── document-uploader copy.tsx
│   │   │   ├── document-uploader-demo copy.tsx
│   │   │   ├── document-uploader-demo.tsx
│   │   │   ├── document-uploader.tsx
│   │   │   ├── loader.tsx
│   │   │   └── page-not-found.tsx
│   │   └── dms-2
│   │       ├── dms-layout.tsx
│   │       ├── document-detail copy.tsx
│   │       ├── document-detail.tsx
│   │       ├── document-navbar-strip copy.tsx
│   │       ├── document-navbar-strip.tsx
│   │       ├── document-uploader.tsx
│   │       ├── existing-document-card.tsx
│   │       └── test.tsx
│   └── ui
│       ├── alert.tsx
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── empty.tsx
│       ├── input.tsx
│       ├── progress.tsx
│       ├── scroll-area.tsx
│       ├── separator.tsx
│       ├── sheet.tsx
│       ├── sidebar.tsx
│       ├── skeleton.tsx
│       ├── sonner.tsx
│       ├── table.tsx
│       ├── tabs.tsx
│       └── tooltip.tsx
├── context
│   └── use-preview-documents-context.tsx
├── data
│   └── mockDocument.ts
├── hooks
│   ├── use-document copy.ts
│   ├── use-document-preview.ts
│   ├── use-document.ts
│   ├── use-file-upload.tsx
│   └── use-mobile.ts
├── lib
│   └── utils.ts
├── module
│   └── dms-2
│       ├── dms.tsx
│       └── index.tsx
├── providers
│   └── react-query-provider.tsx
├── routes
│   ├── dms-routes.tsx
│   └── mainRoutes.tsx
├── schema
│   └── documentUploadSchema.ts
├── services
│   ├── apis
│   │   └── documet-service.ts
│   ├── hooks
│   │   ├── use-auth.ts
│   │   └── use-documents.ts
│   └── axiosInstance.ts
├── types
│   ├── global.d.ts
│   ├── types.ts
│   └── window.d.ts
├── utils
│   └── helper.tsx
├── App.tsx
├── index.css
├── main.tsx
└── runtime-config.ts
```

## 🚀 Quick Start

### Prerequisites

- **Node.js**: v16 or higher
- **npm** or **yarn**

3. **Configure Environment**
   - Edit `public/runtime-env.js` with your API endpoints and configuration
   - The app uses runtime environment configuration for multi-environment support

## 👤 Contributors

This project is maintained and developed by the development team.
```
