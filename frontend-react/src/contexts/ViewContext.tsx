import { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'Administrador' | 'Gerente' | 'Financeiro' | 'Recepcionista' | 'Professor';

interface ViewContextType {
  currentView: UserRole;
  setCurrentView: (role: UserRole) => void;
  availableViews: UserRole[];
  resetToActualRole: () => void;
}

const ViewContext = createContext<ViewContextType | undefined>(undefined);

interface ViewProviderProps {
  children: ReactNode;
  actualRole?: UserRole;
}

export const ViewProvider = ({ children, actualRole = 'Administrador' }: ViewProviderProps) => {
  const [currentView, setCurrentView] = useState<UserRole>(actualRole);
  const [actualUserRole] = useState<UserRole>(actualRole);

  const availableViews: UserRole[] = [
    'Administrador',
    'Gerente',
    'Financeiro',
    'Recepcionista',
    'Professor',
  ];

  const resetToActualRole = () => {
    setCurrentView(actualUserRole);
  };

  return (
    <ViewContext.Provider
      value={{
        currentView,
        setCurrentView,
        availableViews,
        resetToActualRole,
      }}
    >
      {children}
    </ViewContext.Provider>
  );
};

export const useView = (): ViewContextType => {
  const context = useContext(ViewContext);
  if (!context) {
    throw new Error('useView deve ser usado dentro de um ViewProvider');
  }
  return context;
};
