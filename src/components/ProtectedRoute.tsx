import { Navigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

export const ProtectedRoute = ({ children, requireAdmin = false }: { children: React.ReactNode, requireAdmin?: boolean }) => {
    const { user, profile, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    if (!user || profile?.status !== 'ACTIVE') {
        return <Navigate to="/admin" />;
    }

    if (requireAdmin && profile?.role !== 'ADMIN') {
        return <Navigate to="/" />; // Redirect non-admins away from admin dashboard
    }

    return <>{children}</>;
};
