import { useState } from 'react';
import { User, UserRole } from '../../types';
import { X } from 'lucide-react';

interface UserFormProps {
  user?: User;
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: User) => void;
}

export const UserForm = ({ user, isOpen, onClose, onSave }: UserFormProps) => {
  const [formData, setFormData] = useState<User>(
    user || {
      id: Date.now().toString(),
      name: '',
      email: '',
      telefone: '',
      role: 'Recepcionista',
      status: 'ativo',
      lastAccess: new Date().toISOString().split('T')[0],
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  const roles: UserRole[] = ['Administrador', 'Gerente', 'Financeiro', 'Recepcionista', 'Professor'];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background-secondary border border-border-primary rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-primary sticky top-0 bg-background-secondary">
          <h2 className="text-2xl font-bold text-text-primary">
            {user ? 'Editar Usuário' : 'Novo Usuário'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-text-secondary hover:text-text-primary transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-3 gap-6 mb-6">
            {/* Nome */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Nome Completo *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="João Silva"
                className="w-full px-4 py-2 bg-background-primary border border-border-primary rounded-lg text-text-primary placeholder-text-disabled focus:outline-none focus:ring-2 focus:ring-brand-primary"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="joao@academia.com"
                className="w-full px-4 py-2 bg-background-primary border border-border-primary rounded-lg text-text-primary placeholder-text-disabled focus:outline-none focus:ring-2 focus:ring-brand-primary"
                required
              />
            </div>

            {/* Telefone */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Telefone *
              </label>
              <input
                type="tel"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                placeholder="(11) 98765-4321"
                className="w-full px-4 py-2 bg-background-primary border border-border-primary rounded-lg text-text-primary placeholder-text-disabled focus:outline-none focus:ring-2 focus:ring-brand-primary"
                required
              />
            </div>

            {/* Perfil */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Perfil de Acesso *
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-background-primary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
                required
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-background-primary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
                required
              >
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </select>
            </div>

            {/* Último Acesso */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Último Acesso
              </label>
              <input
                type="date"
                name="lastAccess"
                value={formData.lastAccess}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-background-primary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-border-primary">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-background-primary border border-border-primary text-text-primary rounded-lg hover:bg-background-tertiary transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-brand-primary hover:bg-brand-primary/80 text-white rounded-lg transition-colors"
            >
              {user ? 'Atualizar' : 'Criar'} Usuário
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
