import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { accessService } from '../../services/api';
import { AccessResponse } from '../../types';

export const useAccessControl = () => {
  const [credential, setCredential] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AccessResponse | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const navigate = useNavigate();

  // Monitora status da API
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await accessService.getStatus();
        setIsOnline(true);
      } catch {
        setIsOnline(false);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Valida credencial
  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);

    try {
      const response = await accessService.validateAccess({
        credential,
        type: 'manual'
      });

      setResult(response);

      if (response.allowAccess) {
        await accessService.openGate();
        setTimeout(() => {
          setCredential('');
          setResult(null);
        }, 5000);
      } else {
        setTimeout(() => {
          setCredential('');
          setResult(null);
        }, 3000);
      }
    } catch (error) {
      alert('Erro ao validar acesso. Verifique a conexão.');
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const handleLogout = () => {
    navigate('/');
  };

  return {
    credential,
    setCredential,
    isLoading,
    result,
    isOnline,
    handleValidate,
    handleLogout,
  };
};
