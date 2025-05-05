import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    Home, BookOpen, User, LogOut,
    Menu, X, CheckSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';


export default function CandidateDashboardLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path) => {
        return location.pathname.startsWith(path);
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="h-screen flex flex-col">
            <div className="md:hidden bg-white border-b px-4 py-3 flex items-center justify-between">

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                    {sidebarOpen ? <X /> : <Menu />}
                </Button>
            </div>

            <div className="flex flex-1 overflow-hidden">

                <aside
                    className={`bg-white w-64 flex-shrink-0 flex flex-col ${sidebarOpen ? 'fixed inset-y-0 left-0 z-50' : 'hidden'
                        } md:flex`}
                >
                    <div className="p-4 border-b border-gray-200 hidden md:flex">
                        <h1 className="text-3xl"><span className="text-[#F97316]">S</span>YAQA</h1>
                    </div>

                    <div className="flex-1 overflow-y-auto py-4">
                        <nav className="px-2 space-y-1">
                            <Link
                                to="/candidate/home"
                                className={`sidebar-nav-link hover:text-black  ${isActive('/candidate/home') && !isActive('/candidate/dashboard/courses') ? 'active' : ''}`}
                            >
                                <Home className="sidebar-icon" />
                                <span className="sidebar-link-text">Tableau de bord</span>
                            </Link>

                            <Link
                                to="/candidate/courses"
                                className={`sidebar-nav-link ${isActive('/candidate/courses') ? 'active' : ''}`}
                            >
                                <BookOpen className="sidebar-icon" />
                                <span className="sidebar-link-text">Mes formations</span>
                            </Link>

                            <Link
                                to="/candidate/quiz"
                                className={`sidebar-nav-link ${isActive('/candidate/quiz') ? 'active' : ''}`}
                            >
                                <CheckSquare className="sidebar-icon" />
                                <span className="sidebar-link-text">Quiz code</span>
                            </Link>

                            <Link
                                to="/account"
                                className={`sidebar-nav-link ${isActive('/account') ? 'active' : ''}`}
                            >
                                <User className="sidebar-icon" />
                                <span className="sidebar-link-text">Mon compte</span>
                            </Link>
                        </nav>
                    </div>

                    <div className="p-4 border-t">
                        <button
                            className="w-full flex items-center px-3 py-2 text-sm rounded-md text-red-600 hover:bg-red-50"
                            onClick={handleLogout}
                        >
                            <LogOut className="h-4 w-4 mr-3" />
                            <span>Déconnexion</span>
                        </button>
                    </div>
                </aside>

                <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}