import React from "react";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const TransactionRow = ({ transaction, farmName, onEdit, onDelete }) => {
  const isIncome = transaction.type === "income";
  
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            isIncome ? "bg-success/10" : "bg-error/10"
          }`}>
            <ApperIcon 
              name={isIncome ? "TrendingUp" : "TrendingDown"} 
              className={`w-5 h-5 ${isIncome ? "text-success" : "text-error"}`} 
            />
          </div>
          <div>
            <p className="font-semibold text-gray-900 capitalize">{transaction.category}</p>
            {transaction.description && (
              <p className="text-sm text-gray-600">{transaction.description}</p>
            )}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">{farmName}</td>
      <td className="px-6 py-4">
        <Badge variant={isIncome ? "success" : "error"} className="capitalize">
          {transaction.type}
        </Badge>
      </td>
      <td className="px-6 py-4">
        <span className={`font-semibold ${isIncome ? "text-success" : "text-error"}`}>
          {isIncome ? "+" : "-"}${Math.abs(transaction.amount).toFixed(2)}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">
        {format(new Date(transaction.date), "MMM dd, yyyy")}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="secondary" onClick={() => onEdit(transaction)}>
            <ApperIcon name="Edit" className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="danger" onClick={() => onDelete(transaction.Id)}>
            <ApperIcon name="Trash2" className="w-4 h-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default TransactionRow;