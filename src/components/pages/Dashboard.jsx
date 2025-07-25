import React, { useState, useEffect } from "react";
import StatCard from "@/components/molecules/StatCard";
import TaskCard from "@/components/molecules/TaskCard";
import WeatherCard from "@/components/molecules/WeatherCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { farmService } from "@/services/api/farmService";
import { cropService } from "@/services/api/cropService";
import { taskService } from "@/services/api/taskService";
import { transactionService } from "@/services/api/transactionService";
import { weatherService } from "@/services/api/weatherService";
import { toast } from "react-toastify";
import { isToday, isThisWeek } from "date-fns";

const Dashboard = () => {
  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [farmsData, cropsData, tasksData, transactionsData, weatherData] = await Promise.all([
        farmService.getAll(),
        cropService.getAll(),
        taskService.getAll(),
        transactionService.getAll(),
        weatherService.getCurrentWeather()
      ]);

      setFarms(farmsData);
      setCrops(cropsData);
      setTasks(tasksData);
      setTransactions(transactionsData);
      setWeather(weatherData);
    } catch (err) {
      setError("Failed to load dashboard data");
      console.error("Dashboard loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      const task = tasks.find(t => t.Id === taskId);
      if (task) {
        const updatedTask = { ...task, completed: true };
        await taskService.update(taskId, updatedTask);
        setTasks(prev => prev.map(t => t.Id === taskId ? updatedTask : t));
        toast.success("Task completed successfully!");
      }
    } catch (err) {
      toast.error("Failed to complete task");
    }
  };

  if (loading) return (
    <div className="p-6">
      <Loading rows={4} />
    </div>
  );

  if (error) return (
    <div className="p-6">
      <Error message={error} onRetry={loadDashboardData} />
    </div>
  );

  // Calculate statistics
  const activeCrops = crops.filter(crop => crop.status !== "harvested").length;
  const pendingTasks = tasks.filter(task => !task.completed).length;
  const todaysTasks = tasks.filter(task => !task.completed && isToday(new Date(task.dueDate)));
  const thisWeekTasks = tasks.filter(task => !task.completed && isThisWeek(new Date(task.dueDate)));
  
  const thisMonthTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    const now = new Date();
    return transactionDate.getMonth() === now.getMonth() && 
           transactionDate.getFullYear() === now.getFullYear();
  });
  
  const monthlyIncome = thisMonthTransactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  
  const monthlyExpenses = thisMonthTransactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  
  const netIncome = monthlyIncome - monthlyExpenses;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display mb-2">
            Good morning! 🌱
          </h1>
          <p className="text-gray-600">Here's what's happening on your farms today.</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button onClick={loadDashboardData} variant="secondary">
            <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Farms"
          value={farms.length}
          icon="Map"
          iconBg="bg-forest/10"
          iconColor="text-forest"
        />
        <StatCard
          title="Active Crops"
          value={activeCrops}
          icon="Sprout"
          iconBg="bg-leaf/10"
          iconColor="text-leaf"
        />
        <StatCard
          title="Pending Tasks"
          value={pendingTasks}
          icon="CheckSquare"
          iconBg="bg-harvest/10"
          iconColor="text-harvest"
        />
        <StatCard
          title="Monthly Net Income"
          value={`$${netIncome.toFixed(2)}`}
          icon="DollarSign"
          trend={netIncome >= 0 ? "up" : "down"}
          trendValue={`${netIncome >= 0 ? "+" : ""}${netIncome.toFixed(2)}`}
          iconBg={netIncome >= 0 ? "bg-success/10" : "bg-error/10"}
          iconColor={netIncome >= 0 ? "text-success" : "text-error"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Tasks */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Today's Tasks</h2>
            <span className="text-sm text-gray-600">{todaysTasks.length} pending</span>
          </div>
          
          {todaysTasks.length === 0 ? (
            <Empty
              title="No tasks for today"
              description="All caught up! Check the Tasks page to plan ahead."
              icon="CheckCircle"
            />
          ) : (
            <div className="space-y-3">
              {todaysTasks.slice(0, 3).map(task => (
                <TaskCard
                  key={task.Id}
                  task={task}
                  onComplete={handleCompleteTask}
                  onEdit={() => {}}
                />
              ))}
              {todaysTasks.length > 3 && (
                <Card className="p-4 text-center">
                  <p className="text-gray-600">
                    And {todaysTasks.length - 3} more tasks...
                  </p>
                  <Button size="sm" variant="secondary" className="mt-2">
                    View All Tasks
                  </Button>
                </Card>
              )}
            </div>
          )}
        </div>

        {/* Weather */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Weather</h2>
          <WeatherCard weather={weather} forecast={weather?.forecast} />
          
          {/* Quick Stats */}
          <Card className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3">This Week</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ApperIcon name="CheckSquare" className="w-4 h-4 text-harvest" />
                  <span className="text-sm text-gray-600">Tasks Due</span>
                </div>
                <span className="font-semibold text-gray-900">{thisWeekTasks.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ApperIcon name="TrendingUp" className="w-4 h-4 text-success" />
                  <span className="text-sm text-gray-600">Monthly Income</span>
                </div>
                <span className="font-semibold text-success">${monthlyIncome.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ApperIcon name="TrendingDown" className="w-4 h-4 text-error" />
                  <span className="text-sm text-gray-600">Monthly Expenses</span>
                </div>
                <span className="font-semibold text-error">${monthlyExpenses.toFixed(2)}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;