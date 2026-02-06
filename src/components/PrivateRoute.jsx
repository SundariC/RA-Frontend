import React from 'react';
import { useAuth } from "../context/AuthContext";
const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) 
    return 
        <div>
            Loading...
        </div> 
        return user ? children: <Navigate to="/auth" />
};

export default PrivateRoute;