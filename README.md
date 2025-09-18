# Student-Budget-Tracker-
A modern, feature-rich budget tracking application designed specifically for students to manage their finances, track expenses, set financial goals, and gain valuable insights into their spending patterns.

# 🎓 Student Budget Tracker

A modern, feature-rich budget tracking application designed specifically for students to manage their finances, track expenses, set financial goals, and gain valuable insights into their spending patterns.

![Student Budget Tracker](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 📊 Dashboard Overview
- **Real-time Budget Tracking** with visual progress indicators
- **Monthly Budget vs Spending** visualization
- **Remaining Budget** calculations with color-coded alerts
- **Beautiful Gradient UI** with glassmorphism effects

### 💰 Expense Management
- **Quick Expense Entry** with pre-defined student categories
- **Common Expense Templates** (coffee ₹415, lunch ₹995, textbooks ₹4,150)
- **Detailed Tracking** with notes, dates, and categorization
- **Recent Expenses History** with smart filtering

### 🎯 Budget Allocation
- **Category-based Budget Management** (Food, Transport, Entertainment, etc.)
- **Auto-allocation Suggestions** based on income
- **Real-time Utilization Tracking** with over-budget warnings
- **Smart Recommendations** for budget optimization

### 🏆 Financial Goals
- **Goal Creation** with student-focused templates
- **Progress Tracking** with visual indicators and deadlines
- **Quick Contributions** and milestone celebrations
- **Achievement Analytics** with probability assessments

### 📈 Advanced Analytics
- **Financial Health Score** calculation
- **Category Performance Analysis** with trends
- **AI-powered Insights** and personalized recommendations
- **Data Export/Import** functionality

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS with custom gradients
- **UI Components**: Radix UI + shadcn/ui
- **Charts**: Recharts for data visualization
- **Forms**: React Hook Form with Zod validation
- **Analytics**: Python (Pandas, NumPy, Matplotlib)
- **Storage**: LocalStorage with JSON persistence

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Python 3.8+ (for analytics scripts)

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <your-repo-url>
   cd student-budget-tracker
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. **Install Python dependencies** (for analytics)
   \`\`\`bash
   pip install pandas numpy matplotlib
   \`\`\`

4. **Run the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Usage Guide

### Setting Up Your Budget
1. Click **"Manage Budget"** in the header
2. Enter your monthly income
3. Allocate budgets across categories or use auto-allocation
4. Save your budget settings

### Adding Expenses
1. Use **Quick Actions** for common expenses
2. Or click **"Add Expense"** for detailed entry
3. Select category, amount, and add notes
4. Track your spending in real-time

### Creating Financial Goals
1. Click **"Manage Goals"** 
2. Choose from templates or create custom goals
3. Set target amounts and deadlines
4. Track progress and add contributions

### Viewing Analytics
1. Click **"View Analytics"** for detailed insights
2. Check your financial health score
3. Review category performance
4. Get personalized recommendations

## 🎨 Design Features

- **Mobile-First Responsive Design**
- **Dark/Light Theme Support**
- **Glassmorphism UI Effects**
- **Beautiful Gradient Backgrounds**
- **Smooth Animations & Transitions**
- **Accessibility Compliant**

## 📊 Student-Focused Categories

### Expense Categories
- 🍕 Food & Dining
- 🚌 Transportation  
- 🎬 Entertainment
- 📚 Books & Supplies
- 💄 Personal Care
- 🏠 Housing
- 🏥 Healthcare
- 📦 Other

### Goal Templates
- 🚨 Emergency Fund (₹41,500)
- 🏖️ Spring Break Trip (₹66,400)
- 💻 New Laptop (₹99,600)
- 📚 Textbooks (₹24,900)
- 📖 Summer Course (₹49,800)

## 🐍 Python Analytics

Run advanced budget analysis:

\`\`\`bash
python scripts/budget_analytics.py
\`\`\`

Features:
- Spending pattern analysis
- Budget optimization suggestions
- Financial health assessment
- Personalized recommendations
- Data visualization

## 📁 Project Structure

\`\`\`
├── app/                          # Next.js App Router
│   ├── globals.css              # Global styles & gradients
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Main dashboard
├── components/                   # React components
│   ├── ui/                      # shadcn/ui components
│   ├── add-expense-modal.tsx    # Expense tracking
│   ├── analytics-modal.tsx      # Financial analytics
│   ├── budget-management-modal.tsx # Budget allocation
│   ├── budget-overview.tsx      # Budget display
│   ├── expense-chart.tsx        # Spending charts
│   ├── goal-management-modal.tsx # Goals management
│   └── quick-actions.tsx        # Dashboard actions
├── scripts/                     # Python analytics
│   └── budget_analytics.py     # Advanced analysis
└── lib/                         # Utilities
\`\`\`

## 🌟 Key Highlights

- **₹ Indian Rupee Support** with proper formatting
- **Student-Centric Design** with relevant categories and goals
- **Real-time Calculations** with instant feedback
- **Data Persistence** across browser sessions
- **Export/Import** functionality for data portability
- **Responsive Design** for mobile and desktop

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/) and [React](https://reactjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Charts powered by [Recharts](https://recharts.org/)
- Icons from [Lucide React](https://lucide.dev/)

---

**Made with ❤️ for students, by students**

*Empowering financial literacy through technology*

