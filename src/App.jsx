import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Auth from './pages/Auth';
import { AuthProvider } from './context/AuthContext';
import RecipeDetail from './pages/RecipeDetail';
import AddRecipe from './pages/AddRecipe';
import Dashboard from './pages/Dashboard';
import Footer from './components/Footer';

function App() {
    return (
        <AuthProvider>
        <Router>
        <Toaster position= "top-center" reverseOrder= {false}/>

        <div className= "min-h-screen bg-[#FDFDFD]">
            <Navbar />
            <Routes>
            <Route path= "/" element={<Home />} />
            <Route path= "/auth" element={<Auth />} />
            <Route path= "/recipe/:id" element={<RecipeDetail />} />
            <Route path= "/add-recipe" element={<AddRecipe />} />
            <Route path= "/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            </Routes>
            <Footer />
        </div> 
        </Router>
        </AuthProvider>
    );
}

export default App;