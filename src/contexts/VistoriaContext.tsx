import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Vistoria, VistoriaStatus, VistoriaTipo, FotoVistoria } from '@/types/vistoria';

interface VistoriaContextType {
  vistorias: Vistoria[];
  currentVistoria: Vistoria | null;
  isLoading: boolean;
  createVistoria: (data: Partial<Vistoria>) => Promise<Vistoria>;
  updateVistoria: (id: string, data: Partial<Vistoria>) => Promise<void>;
  getVistoriaByCodigo: (codigo: string) => Promise<Vistoria | null>;
  setCurrentVistoria: (vistoria: Vistoria | null) => void;
  addFoto: (foto: FotoVistoria) => void;
  setAssinatura: (assinatura: string) => void;
  finalizarVistoria: () => Promise<void>;
}

const VistoriaContext = createContext<VistoriaContextType | undefined>(undefined);

// Generate unique code
const generateCodigo = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `VIS-${timestamp}-${random}`;
};

export function VistoriaProvider({ children }: { children: ReactNode }) {
  const [vistorias, setVistorias] = useState<Vistoria[]>(() => {
    const stored = localStorage.getItem('sos_vistorias');
    return stored ? JSON.parse(stored) : [];
  });
  const [currentVistoria, setCurrentVistoria] = useState<Vistoria | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const saveVistorias = (updated: Vistoria[]) => {
    setVistorias(updated);
    localStorage.setItem('sos_vistorias', JSON.stringify(updated));
  };

  const createVistoria = async (data: Partial<Vistoria>): Promise<Vistoria> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const newVistoria: Vistoria = {
      id: crypto.randomUUID(),
      codigo: generateCodigo(),
      tipo: data.tipo || 'novo_associado',
      status: 'aguardando_cliente',
      veiculo: data.veiculo || {
        placa: '',
        marca: '',
        modelo: '',
        ano: '',
        cor: '',
        chassi: '',
        renavam: '',
      },
      cliente: data.cliente || {
        nome: '',
        cpf: '',
        telefone: '',
      },
      consultora: data.consultora || '',
      observacoes: data.observacoes,
      fotos: [],
      dataCriacao: new Date().toISOString(),
      siprovStatus: 'pendente_envio',
      lgpdAceito: false,
    };

    const updated = [...vistorias, newVistoria];
    saveVistorias(updated);
    setIsLoading(false);
    return newVistoria;
  };

  const updateVistoria = async (id: string, data: Partial<Vistoria>) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));

    const updated = vistorias.map(v => 
      v.id === id 
        ? { ...v, ...data, dataAtualizacao: new Date().toISOString() }
        : v
    );
    saveVistorias(updated);
    
    if (currentVistoria?.id === id) {
      setCurrentVistoria({ ...currentVistoria, ...data });
    }
    setIsLoading(false);
  };

  const getVistoriaByCodigo = async (codigo: string): Promise<Vistoria | null> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const found = vistorias.find(v => v.codigo.toUpperCase() === codigo.toUpperCase());
    setIsLoading(false);
    return found || null;
  };

  const addFoto = (foto: FotoVistoria) => {
    if (!currentVistoria) return;
    
    const updatedFotos = [...currentVistoria.fotos];
    const existingIndex = updatedFotos.findIndex(f => f.ordem === foto.ordem);
    
    if (existingIndex >= 0) {
      updatedFotos[existingIndex] = foto;
    } else {
      updatedFotos.push(foto);
    }
    
    setCurrentVistoria({
      ...currentVistoria,
      fotos: updatedFotos,
      status: updatedFotos.length >= 6 ? 'assinatura_pendente' : 'fotos_pendentes',
    });
  };

  const setAssinatura = (assinatura: string) => {
    if (!currentVistoria) return;
    setCurrentVistoria({
      ...currentVistoria,
      assinatura,
    });
  };

  const finalizarVistoria = async () => {
    if (!currentVistoria) return;
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const finalizada: Vistoria = {
      ...currentVistoria,
      status: 'concluida',
      dataFinalizacao: new Date().toISOString(),
    };
    
    const updated = vistorias.map(v => 
      v.id === currentVistoria.id ? finalizada : v
    );
    saveVistorias(updated);
    setCurrentVistoria(finalizada);
    setIsLoading(false);
  };

  return (
    <VistoriaContext.Provider value={{
      vistorias,
      currentVistoria,
      isLoading,
      createVistoria,
      updateVistoria,
      getVistoriaByCodigo,
      setCurrentVistoria,
      addFoto,
      setAssinatura,
      finalizarVistoria,
    }}>
      {children}
    </VistoriaContext.Provider>
  );
}

export function useVistoria() {
  const context = useContext(VistoriaContext);
  if (context === undefined) {
    throw new Error('useVistoria must be used within a VistoriaProvider');
  }
  return context;
}
