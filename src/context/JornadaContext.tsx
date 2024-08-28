import React, {createContext, useContext, useState, ReactNode} from 'react';

type JornadaContextType = {
  jornada: string;
  setJornada: React.Dispatch<React.SetStateAction<string>>;
};

// Crea el contexto con un valor inicial de undefined
const JornadaContext = createContext<JornadaContextType | undefined>(undefined);

type JornadaProviderProps = {
  children: ReactNode; // Define que el componente acepta children
};

export const JornadaProvider: React.FC<JornadaProviderProps> = ({children}) => {
  const [jornada, setJornada] = useState<string>('');

  return (
    <JornadaContext.Provider value={{jornada, setJornada}}>
      {children}
    </JornadaContext.Provider>
  );
};

export const useJornada = () => {
  const context = useContext(JornadaContext);
  if (context === undefined) {
    throw new Error('useJornada debe ser usado dentro de un JornadaProvider');
  }
  return context;
};
