import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';

const UserManagement: React.FC = () => {
  const { t } = useLanguage();
  const { getAllUsers } = useAuth();
  
  const users = getAllUsers();

  return (
    <div className="max-w-4xl mx-auto bg-gray-800/50 rounded-2xl p-6 md:p-8 border border-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-lime-400">{t.dashboardPage.tableTitle} ({users.length})</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-gray-600">
            <tr>
              <th className="p-4">{t.dashboardPage.nameHeader}</th>
              <th className="p-4">{t.dashboardPage.emailHeader}</th>
              <th className="p-4">{t.dashboardPage.dateHeader}</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.email} className="border-b border-gray-700 hover:bg-gray-800 transition-colors">
                <td className="p-4 font-medium flex items-center gap-3">
                  <img 
                    src={`https://api.dicebear.com/8.x/initials/svg?seed=${user.name}`}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full bg-gray-700"
                  />
                  {user.name}
                </td>
                <td className="p-4 text-gray-300">{user.email}</td>
                <td className="p-4 text-gray-400">{new Date(user.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;