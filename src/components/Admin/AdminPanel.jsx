import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../Layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { Shield, Trash2, Search, User, Mail, Calendar, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

export function AdminPanel() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useAuth();

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const API_URL = import.meta.env.PROD ? '' : 'http://localhost:3000';
            const res = await fetch(`${API_URL}/api/users`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (err) {
            console.error("Failed to fetch users", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user? This cannot be undone.")) return;

        try {
            const token = localStorage.getItem('token');
            const API_URL = import.meta.env.PROD ? '' : 'http://localhost:3000';
            const res = await fetch(`${API_URL}/api/users/${userId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                setUsers(users.filter(u => u._id !== userId));
            } else {
                alert("Failed to delete user");
            }
        } catch (err) {
            alert("Error deleting user");
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            const token = localStorage.getItem('token');
            const API_URL = import.meta.env.PROD ? '' : 'http://localhost:3000';
            const res = await fetch(`${API_URL}/api/users/${userId}/role`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ role: newRole })
            });

            if (res.ok) {
                // Optimistic UI update or re-fetch
                setUsers(users.map(u =>
                    u._id === userId ? { ...u, role: newRole } : u
                ));
            } else {
                alert("Failed to update role");
            }
        } catch (err) {
            alert("Error updating role");
        }
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (user?.role !== 'Admin') {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center h-[50vh] text-red-500">
                    <Shield className="w-16 h-16 mb-4" />
                    <h2 className="text-2xl font-bold">Access Denied</h2>
                    <p className="text-slate-500">You do not have permission to view this page.</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            <Shield className="w-8 h-8 text-indigo-600" />
                            Admin Console
                        </h1>
                        <p className="text-slate-500 mt-1">Manage system users and permissions</p>
                    </div>

                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-100 text-xs uppercase text-slate-500 font-semibold">
                                <tr>
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4">Joined</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredUsers.map((u) => (
                                    <tr key={u._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                                                    {u.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-slate-900">{u.name}</div>
                                                    <div className="text-sm text-slate-500 flex items-center gap-1">
                                                        <Mail className="w-3 h-3" /> {u.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="relative group">
                                                <select
                                                    value={u.role}
                                                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                                    disabled={u._id === user._id}
                                                    className={`appearance-none pl-3 pr-8 py-1 rounded-full text-xs font-medium border cursor-pointer outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 transition-all ${u.role === 'Admin' ? 'bg-purple-50 text-purple-700 border-purple-100 hover:bg-purple-100' :
                                                        u.role === 'Manager' ? 'bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100' :
                                                            'bg-slate-50 text-slate-700 border-slate-100 hover:bg-slate-100'
                                                        }`}
                                                >
                                                    <option value="User">User</option>
                                                    <option value="Analyst">Analyst</option>
                                                    <option value="Manager">Manager</option>
                                                    <option value="Admin">Admin</option>
                                                </select>
                                                {/* Custom Arrow because default select arrow is ugly */}
                                                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                                                    <svg className={`w-3 h-3 ${u.role === 'Admin' ? 'text-purple-400' :
                                                        u.role === 'Manager' ? 'text-blue-400' : 'text-slate-400'
                                                        }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {u.createdAt ? format(new Date(u.createdAt), 'MMM d, yyyy') : 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {u._id !== user._id && (
                                                <button
                                                    onClick={() => handleDelete(u._id)}
                                                    className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                                                    title="Delete User"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filteredUsers.length === 0 && !isLoading && (
                        <div className="p-8 text-center text-slate-500">
                            No users found matching your search.
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
