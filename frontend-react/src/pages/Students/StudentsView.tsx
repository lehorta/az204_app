import { AdminLayout } from '../../components/AdminLayout';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Student, StudentStats } from '../../types';
import { Search, Edit2, Trash2, Plus, MapPin, Mail, Phone } from 'lucide-react';

interface StudentsViewProps {
  students: Student[];
  stats: StudentStats[];
  searchQuery: string;
  isLoading: boolean;
  onSearch: (query: string) => void;
  onEdit: (studentId: string) => void;
  onDelete: (studentId: string) => void;
  onNewStudent: () => void;
}

export const StudentsView = ({
  students,
  stats,
  searchQuery,
  isLoading,
  onSearch,
  onEdit,
  onDelete,
  onNewStudent,
}: StudentsViewProps) => {
  return (
    <AdminLayout userName="Alunos">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">Alunos</h1>
            <p className="text-text-secondary">Cadastro e gerenciamento de alunos</p>
          </div>
          <Button onClick={onNewStudent} size="md">
            <Plus className="w-5 h-5 mr-2" />
            Novo Aluno
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="bg-background-secondary border-border-primary">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${stat.color}`}></div>
                <div className="flex-1">
                  <p className="text-xs text-text-secondary mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Buscar por nome, email, CPF ou telefone..."
            className="w-full pl-12 pr-4 py-3 bg-background-secondary border border-border-primary rounded-lg text-text-primary placeholder-text-disabled focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
        </div>

        {/* Students Grid */}
        {isLoading ? (
          <div className="p-8 text-center text-text-secondary">
            Carregando alunos...
          </div>
        ) : students.length === 0 ? (
          <div className="p-8 text-center text-text-secondary">
            Nenhum aluno encontrado
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {students.map((student) => (
              <Card key={student.id} className="bg-background-secondary border-border-primary overflow-hidden hover:border-border-secondary transition-all">
                <div className="space-y-4">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-brand-primary to-brand-primary/50 flex items-center justify-center flex-shrink-0 border border-border-primary">
                      <span className="text-white font-bold text-lg">{student.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-text-primary mb-1">{student.name}</h3>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          student.status === 'ativo'
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {student.status === 'ativo' ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                  </div>

                  {/* Basic Info */}
                  <div className="space-y-2 border-t border-border-primary pt-4">
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{student.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                      <Phone className="w-4 h-4" />
                      <span>{student.telefone}</span>
                    </div>
                    <div className="text-xs text-text-muted">
                      CPF: <span className="font-mono">{student.cpf}</span>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="border-t border-border-primary pt-4">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-text-secondary flex-shrink-0 mt-0.5" />
                      <div className="text-xs text-text-secondary space-y-1 flex-1">
                        <p>
                          {student.address.street}, {student.address.number}
                          {student.address.complement && ` - ${student.address.complement}`}
                        </p>
                        <p>
                          {student.address.neighborhood}, {student.address.city} - {student.address.state}
                        </p>
                        <p className="font-mono">{student.address.zipCode}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 border-t border-border-primary pt-4">
                    <button
                      onClick={() => onEdit(student.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span className="text-sm">Editar</span>
                    </button>
                    <button
                      onClick={() => onDelete(student.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="text-sm">Excluir</span>
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
