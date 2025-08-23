import React, { useState } from 'react';
import { CategoryManagement } from './category-management';
import { PaymentDashboard } from './payment-dashboard';
import { UserManagement } from './user-management';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  CreditCard,
  BarChart3,
  Settings,
  Tag,
  ShoppingCart,
  TrendingUp,
  Shield
} from 'lucide-react';

interface AdminSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  component: React.ReactNode;
  description: string;
}

export const AdminDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('overview');

  const adminSections: AdminSection[] = [
    {
      id: 'overview',
      title: 'Overview',
      icon: <LayoutDashboard className="h-5 w-5" />,
      component: <OverviewSection />,
      description: 'Platform overview and key metrics'
    },
    {
      id: 'categories',
      title: 'Categories',
      icon: <Tag className="h-5 w-5" />,
      component: <CategoryManagement />,
      description: 'Manage course categories'
    },
    {
      id: 'payments',
      title: 'Payments',
      icon: <CreditCard className="h-5 w-5" />,
      component: <PaymentDashboard />,
      description: 'Payment processing and analytics'
    },
    {
      id: 'users',
      title: 'Users',
      icon: <Users className="h-5 w-5" />,
      component: <UserManagement />,
      description: 'User accounts and permissions'
    },
    {
      id: 'courses',
      title: 'Courses',
      icon: <BookOpen className="h-5 w-5" />,
      component: <div className="p-4 text-center text-muted-foreground">Course management coming soon...</div>,
      description: 'Course creation and management'
    },
    {
      id: 'analytics',
      title: 'Analytics',
      icon: <BarChart3 className="h-5 w-5" />,
      component: <div className="p-4 text-center text-muted-foreground">Advanced analytics coming soon...</div>,
      description: 'Platform analytics and insights'
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: <Settings className="h-5 w-5" />,
      component: <div className="p-4 text-center text-muted-foreground">Platform settings coming soon...</div>,
      description: 'Platform configuration'
    }
  ];

  const activeSectionData = adminSections.find(section => section.id === activeSection);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm border-r">
          <div className="p-6">
            <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">Platform Management</p>
          </div>

          <nav className="px-3">
            <div className="space-y-1">
              {adminSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeSection === section.id
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                  <span className="mr-3">{section.icon}</span>
                  {section.title}
                </button>
              ))}
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {activeSectionData?.title}
              </h2>
              <p className="text-gray-600 mt-1">
                {activeSectionData?.description}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border">
              {activeSectionData?.component}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const OverviewSection: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">567</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,345</div>
            <p className="text-xs text-muted-foreground">+24% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Enrollments</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8,901</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <BookOpen className="h-4 w-4 mr-2" />
              Create New Course
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Tag className="h-4 w-4 mr-2" />
              Add Category
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Users className="h-4 w-4 mr-2" />
              Manage Users
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              View Reports
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Backend API</span>
              <div className="flex items-center text-green-600">
                <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                Operational
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Database</span>
              <div className="flex items-center text-green-600">
                <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                Connected
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Payment Gateway</span>
              <div className="flex items-center text-green-600">
                <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                Active
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">File Storage</span>
              <div className="flex items-center text-green-600">
                <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                Available
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};