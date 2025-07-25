import React, { useContext } from 'react';
import { AuthContext } from '../../App';
import Button from './Button';
import ApperIcon from '../ApperIcon';

const LogoutButton = () => {
  const { logout } = useContext(AuthContext);

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={logout}
      className="flex items-center space-x-2"
    >
      <ApperIcon name="LogOut" className="w-4 h-4" />
      <span className="hidden sm:inline">Logout</span>
    </Button>
  );
};

export default LogoutButton;