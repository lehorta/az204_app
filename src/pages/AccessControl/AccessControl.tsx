import React from 'react';
import { AccessControlView } from './AccessControlView';
import { useAccessControl } from './useAccessControl';

export const AccessControl: React.FC = () => {
  const {
    credential,
    setCredential,
    isLoading,
    result,
    isOnline,
    handleValidate,
    handleLogout,
  } = useAccessControl();

  return (
    <AccessControlView
      credential={credential}
      isLoading={isLoading}
      result={result}
      isOnline={isOnline}
      onCredentialChange={setCredential}
      onValidate={handleValidate}
      onLogout={handleLogout}
    />
  );
};
