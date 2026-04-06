# FinFlow - Advanced Financial Dashboard

A modern, responsive financial dashboard built with React and Vite, designed to help users track their income, expenses, and savings with beautiful visualizations and intuitive user management.

![FinFlow Dashboard](https://via.placeholder.com/800x400/4f8ef7/ffffff?text=FinFlow+Dashboard)

## ✨ Features

### 🔐 User Management
- **Role-based Access**: Admin and Viewer roles with different permissions
- **Secure Authentication**: Email/password login system
- **User Profiles**: Custom avatars, contact information, and join dates
- **Multi-user Support**: Separate data isolation for each user

### 💰 Financial Tracking
- **Transaction Management**: Add, view, and delete income/expense transactions
- **Category Organization**: Categorized transactions (Food, Transport, Shopping, Health, Entertainment, Salary, Utilities, Freelance)
- **Real-time Calculations**: Automatic balance, income, expenses, and savings calculations
- **Transaction History**: Chronological transaction listing with emojis and categories

### 📊 Dashboard Analytics
- **Interactive Charts**: Beautiful charts powered by Chart.js
  - Doughnut chart for expense categories
  - Line chart for balance and expense trends over time
- **Summary Cards**: Key metrics at a glance (Total Balance, Income, Expenses, Net Savings)
- **Recent Transactions**: Quick view of latest financial activities

### 🎨 User Experience
- **Dark/Light Theme**: Toggle between themes with persistent preference
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Smooth Animations**: Framer Motion animations for enhanced UX
- **Modern UI**: Clean, professional interface with custom styling

### 🛠️ Technical Features
- **Local Data Persistence**: Data saved in browser's localStorage
- **Fast Development**: Vite for lightning-fast development and builds
- **Type-Safe**: Modern JavaScript with ESLint for code quality
- **Modular Architecture**: Well-organized components and context management

## 🚀 Tech Stack

- **Frontend**: React 19, Vite
- **Styling**: CSS Variables, Custom Themes
- **Charts**: Chart.js, react-chartjs-2
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Routing**: React Router DOM
- **Build Tool**: Vite
- **Linting**: ESLint

## 📋 Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/financial-dashboard-advanced.git
   cd financial-dashboard-advanced
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

## 📖 Usage

### Getting Started
1. **Login**: Use the default admin account or create a new user
   - Admin: `hemanth@finflow.app` / `admin123`
   - Viewer: `priya@finflow.app` / `viewer123`

2. **Dashboard**: View your financial overview with charts and summary cards

3. **Transactions**: Add new income/expense transactions with categories

4. **Users** (Admin only): Manage user accounts and view all transactions

### Key Features
- **Add Transaction**: Click "Add Transaction" to record new financial activities
- **View Analytics**: Explore charts to understand spending patterns
- **Theme Toggle**: Switch between dark and light themes
- **User Management**: Admins can add/remove users and view all data

## 📁 Project Structure

```
src/
├── assets/          # Static assets
├── context/         # React Context for state management
│   └── AppContext.jsx
├── pages/           # Main application pages
│   ├── AuthPage.jsx
│   ├── DashboardPage.jsx
│   ├── InsightsPage.jsx
│   ├── ProfilePage.jsx
│   ├── TransactionsPage.jsx
│   ├── UsersPage.jsx
│   └── DashboardLayout.jsx
├── utils.js         # Utility functions and constants
├── db.json          # Initial data structure
├── main.jsx         # Application entry point
└── App.jsx          # Main App component
```

## 🎯 Features in Detail

### Authentication System
- Secure login with email/password
- Role-based access control (Admin/Viewer)
- Persistent login state using localStorage

### Transaction Management
- Add transactions with amount, type, category, and date
- Automatic emoji assignment based on category
- Real-time balance calculations
- Transaction history with sorting

### Dashboard Visualization
- **Balance Trend Chart**: Shows balance progression over months
- **Expense Distribution**: Doughnut chart breaking down expenses by category
- **Summary Metrics**: Key financial indicators with percentage changes

### User Interface
- Responsive grid layouts
- Custom color schemes for different categories
- Smooth transitions and hover effects
- Mobile-friendly design

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - A JavaScript library for building user interfaces
- [Vite](https://vitejs.dev/) - Next generation frontend tooling
- [Chart.js](https://www.chartjs.org/) - Simple yet flexible JavaScript charting
- [Framer Motion](https://www.framer.com/motion/) - Production-ready motion library for React

## 📞 Support

If you have any questions or need help, please open an issue on GitHub or contact the maintainers.

---

**Made with ❤️ for better financial management**
