import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const FinanceForm = ({ transaction, farms, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    farmId: "",
    type: "expense",
    category: "",
    amount: "",
    date: format(new Date(), "yyyy-MM-dd"),
    description: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const expenseCategories = [
    "Seeds", "Fertilizer", "Equipment", "Fuel", "Labor", "Maintenance", 
    "Insurance", "Utilities", "Supplies", "Other"
  ];

  const incomeCategories = [
    "Crop Sales", "Livestock Sales", "Equipment Rental", "Government Subsidies", "Other"
  ];

  useEffect(() => {
    if (transaction) {
      setFormData({
        farmId: transaction.farmId,
        type: transaction.type,
        category: transaction.category,
        amount: Math.abs(transaction.amount).toString(),
        date: format(new Date(transaction.date), "yyyy-MM-dd"),
        description: transaction.description || ""
      });
    }
  }, [transaction]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const amount = parseFloat(formData.amount);
      await onSubmit({
        ...formData,
        farmId: parseInt(formData.farmId),
        amount: formData.type === "expense" ? -amount : amount,
        date: new Date(formData.date).toISOString()
      });
      
      if (!transaction) {
        setFormData({
          farmId: "",
          type: "expense",
          category: "",
          amount: "",
          date: format(new Date(), "yyyy-MM-dd"),
          description: ""
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === "type" && { category: "" }) // Reset category when type changes
    }));
  };

  const categories = formData.type === "expense" ? expenseCategories : incomeCategories;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          {transaction ? "Edit Transaction" : "Add New Transaction"}
        </h3>
        {onCancel && (
          <Button variant="secondary" size="sm" onClick={onCancel}>
            <ApperIcon name="X" className="w-4 h-4" />
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </Select>

          <Select
            label="Farm"
            name="farmId"
            value={formData.farmId}
            onChange={handleChange}
            required
          >
            <option value="">Select a farm</option>
            {farms.map(farm => (
              <option key={farm.Id} value={farm.Id}>{farm.name}</option>
            ))}
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select category</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </Select>

          <Input
            label="Amount ($)"
            name="amount"
            type="number"
            step="0.01"
            min="0"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            required
          />
        </div>

        <Input
          label="Date"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          required
        />

        <Input
          label="Description (Optional)"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Additional details about this transaction"
        />

        <div className="flex justify-end space-x-3 pt-4">
          {onCancel && (
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                {transaction ? "Updating..." : "Adding..."}
              </>
            ) : (
              <>
                <ApperIcon name={transaction ? "Save" : "Plus"} className="w-4 h-4 mr-2" />
                {transaction ? "Update Transaction" : "Add Transaction"}
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default FinanceForm;