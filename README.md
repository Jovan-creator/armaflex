# 🏨 Armaflex Hotel Management System

A comprehensive, modern hotel management platform built with React, TypeScript, and Tailwind CSS. This enterprise-grade solution provides complete operational management for hotels of all sizes.

![Hotel Management System](https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&w=1200&h=400&fit=crop)

## ✨ Features

### 🎯 **Core Management**

- **Dashboard Analytics** - Real-time KPIs and operational metrics
- **Guest Management** - Complete guest profiles, preferences, and history
- **Room Management** - Availability, pricing, and room assignments
- **Reservation System** - Booking management with calendar integration
- **Billing & Payments** - Invoice generation and payment processing

### 🚀 **Advanced Modules**

- **Channel Manager** - Multi-platform booking management (Booking.com, Expedia, etc.)
- **Inventory Management** - Supplies, assets, and procurement tracking
- **Maintenance System** - Work orders, preventive maintenance, and technician management
- **Housekeeping** - Task management and room status tracking
- **Staff Management** - Employee profiles and role-based permissions

### 📊 **Business Intelligence**

- **Reports & Analytics** - Comprehensive business insights
- **Notifications System** - Real-time alerts and communications
- **Settings Management** - System configuration and customization

### 🔐 **Security & Access**

- **Role-Based Authentication** - Admin, Manager, Receptionist, Housekeeping roles
- **Secure Login System** - Protected routes and permissions
- **User Management** - Staff account management

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Shadcn/ui Components
- **Routing**: React Router 6
- **State Management**: React Context API
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Package Manager**: npm

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Jovan-creator/armaflex.git
   cd armaflex
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:8080`

## 🔑 Demo Accounts

| Role             | Email                | Password | Access Level            |
| ---------------- | -------------------- | -------- | ----------------------- |
| **Admin**        | jovan.k@armaflex.com | admin123 | Full system access      |
| **Receptionist** | sarah.j@armaflex.com | front123 | Front desk operations   |
| **Housekeeping** | mike.w@armaflex.com  | house123 | Housekeeping management |
| **Manager**      | emma.d@armaflex.com  | mgmt123  | Departmental oversight  |

## 📱 Screenshots

### Login & Dashboard

- Beautiful sliding background with hotel imagery
- Role-based dashboard with personalized metrics
- Real-time analytics and KPI tracking

### Guest Management

- Comprehensive guest profiles and preferences
- Booking history and loyalty program integration
- Communication center and feedback management

### Channel Manager

- Multi-platform rate and inventory management
- Performance analytics by booking channel
- Competitive rate comparison tools

### Maintenance System

- Work order management and technician assignment
- Preventive maintenance scheduling
- Cost tracking and performance metrics

## 🎨 Design Features

- **Responsive Design** - Mobile-first approach, works on all devices
- **Professional UI** - Clean, modern interface with hotel branding
- **Accessibility** - WCAG compliant with proper ARIA labels
- **Dark/Light Mode** - Theme customization options
- **Animation Effects** - Smooth transitions and micro-interactions

## 📊 Business Modules

### **Channel Manager**

- Booking.com, Expedia, Airbnb, Agoda integration
- Real-time rate synchronization
- Inventory management across platforms
- Revenue optimization tools

### **Inventory Management**

- Supply tracking with low-stock alerts
- Asset management with maintenance schedules
- Purchase order management
- Cost center tracking

### **Maintenance System**

- Work order creation and assignment
- Preventive maintenance scheduling
- Technician management (internal/external)
- Performance analytics and cost tracking

## 🔧 Configuration

### Environment Setup

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:3001
VITE_APP_NAME=Armaflex Hotel Management
VITE_APP_VERSION=1.0.0
```

### Customization

- **Branding**: Update logo and colors in `tailwind.config.ts`
- **Hotel Info**: Modify hotel details in Settings module
- **Features**: Enable/disable modules based on needs

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Netlify

1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`

### Deploy to Vercel

```bash
npm install -g vercel
vercel --prod
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check our [Wiki](../../wiki) for detailed guides
- **Issues**: Report bugs or request features via [GitHub Issues](../../issues)
- **Discussions**: Join our [Community Discussions](../../discussions)

## 🙏 Acknowledgments

- Built with [React](https://reactjs.org/) and [TypeScript](https://www.typescriptlang.org/)
- UI components from [Shadcn/ui](https://ui.shadcn.com/)
- Icons provided by [Lucide](https://lucide.dev/)
- Images from [Unsplash](https://unsplash.com/)

## 📈 Roadmap

- [ ] Mobile app (React Native)
- [ ] API integration for PMS systems
- [ ] Advanced reporting with charts
- [ ] Multi-language support
- [ ] Integration marketplace
- [ ] White-label solutions

---

**Made with ❤️ by [Jovan Shyane](https://github.com/Jovan-creator)**

⭐ Star this repo if you find it helpful!
