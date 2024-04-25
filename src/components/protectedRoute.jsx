import { Navigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { db } from '../firebase';
import { getDatabase, ref, set, child, get } from "firebase/database";
import { useState, useEffect } from 'react';

// Define a simple loading indicator component
const LoadingIndicator = () => {
    return <div>Loading...</div>;
};

export const ProtectedRoute = ({ children, user }) => {
    const [role, setRole] = useState("");
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const currentRoute = location.pathname.slice(1);

    useEffect(() => {
        if (user !== null) {
            getUserRole(user.uid)
                .then((userRole) => {
                    setRole(userRole);
                })
                .catch((error) => {
                    console.error("Error fetching user role:", error);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            // If user is logged out, set role to null and loading to false
            setRole(null);
            setLoading(false);
        }
    }, [user]);

    // Function to fetch user role
    function getUserRole(a) {
        return new Promise((resolve, reject) => {
            const dbRef = ref(db);
            get(child(dbRef, 'users/' + a)).then((snapshot) => {
                if (snapshot.exists()) {
                    const result = snapshot.val().role;
                    resolve(result);
                } else {
                    console.log("No data available");
                    resolve(null);
                }
            }).catch((error) => {
                console.log(error);
                reject(error);
            });
        });
    }

    if (loading) {
        return <LoadingIndicator />; // Render loading indicator while role is being fetched
    }

    if (role && role !== currentRoute) {
        return <Navigate to="/login" />;
    }

    return user ? children : <Navigate to="/login" />;
}
