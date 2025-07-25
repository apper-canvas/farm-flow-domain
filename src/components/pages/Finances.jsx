import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import FinanceForm from "@/components/organisms/FinanceForm";
import TransactionRow from "@/components/molecules/TransactionRow";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { transactionService } from "@/services/api/transactionService";
import { farmService } from "@/services/api/farmService";
import { toast } from "react-toastify";
import Chart from "react-apexcharts";

const Finances = () => {
  const [transactions, setTransactions] = useState([]);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [filterFarm, setFilterFarm] = useState("");
  const [filterType, setFilterType] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [transactionsData, farmsData] = await Promise.all([
        transactionService.getAll(),
        farmService.getAll()
      ]);
      setTransactions(transactionsData);
      setFarms(farmsData);
    } catch (err) {
      setError("Failed to load financial data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (transactionData) => {
    try {
      if (editingTransaction) {
        await transactionService.update(editingTransaction.Id, transactionData);
        toast.success("Transaction updated successfully!");
      } else {
        await transactionService.create(transactionData);
        toast.success("Transaction added successfully!");
      }
      await loadData();
      setShowForm(false);
      setEditingTransaction(null);
    } catch (err) {
      toast.error("Failed to save transaction");
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleDelete = async (transactionId) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await transactionService.delete(transactionId);
        toast.success("Transaction deleted successfully!");
        await loadData();
      } catch (err) {
        toast.error("Failed to delete transaction");
      }
    }
  };

  const getFarmName = (farmId) => {
    const farm = farms.find(f => f.Id === farmId);
    return farm ? farm.name : "Unknown Farm";
  };

  const filteredTransactions = transactions.filter(transaction => {
    const farmMatch = !filterFarm || transaction.farmId === parseInt(filterFarm);
    const typeMatch = !filterType || transaction.type === filterType;
    return farmMatch && typeMatch;
  });

  // Calculate summary statistics
  const totalIncome = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const netIncome = totalIncome - totalExpenses;

  // Chart data for monthly summary
  const getMonthlyData = () => {
    const monthlyData = {};
    transactions.forEach(t => {
      const date = new Date(t.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { income: 0, expenses: 0 };
      }
      
      if (t.amount > 0) {
        monthlyData[monthKey].income += t.amount;
      } else {
        monthlyData[monthKey].expenses += Math.abs(t.amount);
      }
    });

    const months = Object.keys(monthlyData).sort().slice(-6); // Last 6 months
    return {
      categories: months.map(m => {
        const [year, month] = m.split('-');
        return new Date(year, month - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      }),
      income: months.map(m => monthlyData[m].income),
      expenses: months.map(m => monthlyData[m].expenses)
    };
  };

  const chartData = getMonthlyData();

  const chartOptions = {
    chart: {
      type: 'bar',
      toolbar: { show: false }
    },
    colors: ['#43A047', '#E53935'],
    xaxis: {
      categories: chartData.categories
    },
    yaxis: {
      labels: {
        formatter: (value) => '$' + value.toFixed(0)
      }
    },
    legend: {
      position: 'top'
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded'
      }
    }
  };

  const chartSeries = [
    {
      name: 'Income',
      data: chartData.income
    },
    {
      name: 'Expenses',
      data: chartData.expenses
    }
  ];

  if (loading) return (
    <div className="p-6">
      <Loading rows={3} />
    </div>
  );

  if (error) return (
    <div className="p-6">
      <Error message={error} onRetry={loadData} />
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display mb-2">Finances</h1>
          <p className="text-gray-600">Track your farm income and expenses.</p>
        </div>
        <Button 
          onClick={() => {
            setEditingTransaction(null);
            setShowForm(true);
          }}
          variant="primary"
        >
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Transaction
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Income</p>
              <p className="text-2xl font-bold text-success">${totalIncome.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
              <ApperIcon name="TrendingUp" className="w-6 h-6 text-success" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Expenses</p>
              <p className="text-2xl font-bold text-error">${totalExpenses.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-error/10 rounded-xl flex items-center justify-center">
              <ApperIcon name="TrendingDown" className="w-6 h-6 text-error" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Net Income</p>
              <p className={`text-2xl font-bold ${netIncome >= 0 ? 'text-success' : 'text-error'}`}>
                ${netIncome.toFixed(2)}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              netIncome >= 0 ? 'bg-success/10' : 'bg-error/10'
            }`}>
              <ApperIcon 
                name="DollarSign" 
                className={`w-6 h-6 ${netIncome >= 0 ? 'text-success' : 'text-error'}`} 
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Chart */}
      {chartData.categories.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Summary</h3>
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="bar"
            height={300}
          />
        </Card>
      )}

      {/* Form */}
      {showForm && (
        <FinanceForm
          transaction={editingTransaction}
          farms={farms}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingTransaction(null);
          }}
        />
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Select
          value={filterFarm}
          onChange={(e) => setFilterFarm(e.target.value)}
          className="sm:w-64"
        >
          <option value="">All Farms</option>
          {farms.map(farm => (
            <option key={farm.Id} value={farm.Id}>{farm.name}</option>
          ))}
        </Select>
        
        <Select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="sm:w-48"
        >
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </Select>
      </div>

      {/* Transactions Table */}
      {filteredTransactions.length === 0 ? (
        <Empty
          title="No transactions found"
          description={transactions.length === 0 
            ? "Start by adding your first transaction to track your farm finances."
            : "No transactions match your current filters. Try adjusting your search criteria."
          }
          actionLabel="Add Transaction"
          onAction={() => setShowForm(true)}
          icon="DollarSign"
        />
      ) : (
        <div className="bg-white rounded-xl card-shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Farm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.map(transaction => (
                  <TransactionRow
                    key={transaction.Id}
                    transaction={transaction}
                    farmName={getFarmName(transaction.farmId)}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Finances;