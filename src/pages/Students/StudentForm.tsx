import { useState, useRef, useEffect } from 'react';
import { Student, Attachment } from '../../types';
import { X, User, MapPin, CreditCard, Zap, History, Camera, ZoomIn, Activity, Phone, UserCheck, AlertCircle, Paperclip, Upload, FileText, Image as ImageIcon, Trash2, Plus, Video, UserCircle2, CheckCircle } from 'lucide-react';
import ReactInputMask from "react-input-mask";
import { extrairMensagemResposta, mapRespostaAlunoParaStudent, studentsService } from '../../services/students';
import { getErrorMessages } from '../../services/apiError';
import { getApiUrl } from '../../config/api';
import { authService } from '../../services/auth';

// @ts-ignore
const InputMask = ReactInputMask;

interface MotivoCancelamento {
  id: number;
  descricao: string;
}

interface StudentFormProps {
  student?: Student;
  isOpen: boolean;
  onClose: () => void;
  onSave: (student: Student) => void;
}

type TabType = 'basico' | 'responsavel' | 'saude' | 'emergencia' | 'endereco' | 'pagamento' | 'plano' | 'anexos' | 'historico';

export const StudentForm = ({ student, isOpen, onClose, onSave }: StudentFormProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('basico');
  const [photoPreview, setPhotoPreview] = useState<string>(student?.photo || '');
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>('');
  
  // Estados para anexos
  const [attachmentDescription, setAttachmentDescription] = useState('');
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  
  // Estados para histórico
  const [historyDescription, setHistoryDescription] = useState('');
  const [historyOccurredAt, setHistoryOccurredAt] = useState('');

  // Motivos de cancelamento
  const [motivosCancelamento, setMotivosCancelamento] = useState<MotivoCancelamento[]>([]);
  useEffect(() => {
    const fetchMotivos = async () => {
      try {
        const token = authService.getToken();
        const resp = await fetch(`${getApiUrl()}/MotivosCancelamento/ativos`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (resp.ok) {
          const data = await resp.json();
          setMotivosCancelamento(Array.isArray(data) ? data : data.dados ?? []);
        }
      } catch {
        // silencioso — campo de motivo simplesmente ficará sem opções da API
      }
    };
    fetchMotivos();
  }, []);
  
  // Estados e refs para webcam
  const [showWebcam, setShowWebcam] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [formData, setFormData] = useState<Student>(
    student || {
      id: '',
      name: '',
      email: '',
      telefone: '',
      dataNascimento: '',
      cpf: '',
      photo: '',
      health: {
        weight: '',
        height: '',
        bloodType: '',
        medicalConditions: '',
        allergies: '',
        goal: '',
      },
      emergencyContact: {
        name: '',
        telefone: '',
        relationship: '',
      },
      responsible: {
        name: '',
        relationship: '',
        cpf: '',
        identity: '',
        telefone: '',
        phoneCellular: '',
      },
      address: {
        street: '',
        number: '',
        neighborhood: '',
        city: '',
        state: 'SP',
        zipCode: '',
      },
      payment: {
        method: 'cartao',
      },
      subscription: {
        id: '1',
        name: 'Plano Mensal',
        price: 99,
        duration: 1,
        type: 'mensal',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'ativo',
      },
      history: [],
      attachments: [],
      status: 'ativo',
      joinDate: new Date().toISOString().split('T')[0],
    }
  );

  // Atualizar formData quando student (prop) muda
  useEffect(() => {
    if (student) {
      setFormData(student);
      setPhotoPreview(student.photo || '');
    } else {
      // Resetar para novo aluno
      setFormData({
        id: Date.now().toString(),
        name: '',
        email: '',
        telefone: '',
        dataNascimento: '',
        cpf: '',
        photo: '',
        health: {
          weight: '',
          height: '',
          bloodType: '',
          medicalConditions: '',
          allergies: '',
          goal: '',
        },
        emergencyContact: {
          name: '',
          telefone: '',
          relationship: '',
        },
        responsible: {
          name: '',
          relationship: '',
          cpf: '',
          identity: '',
          telefone: '',
          phoneCellular: '',
        },
        address: {
          street: '',
          number: '',
          neighborhood: '',
          city: '',
          state: 'SP',
          zipCode: '',
        },
        payment: {
          method: 'cartao',
        },
        subscription: {
          id: '1',
          name: 'Plano Mensal',
          price: 99,
          duration: 1,
          type: 'mensal',
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'ativo',
        },
        history: [],
        attachments: [],
        status: 'ativo',
        joinDate: new Date().toISOString().split('T')[0],
      });
      setPhotoPreview('');
    }
    setActiveTab('basico');
    setValidationErrors([]);
    setError([]);
    setSuccessMessage('');
  }, [student, isOpen]);

  if (!isOpen) return null;

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPhotoPreview(base64String);
        setFormData({
          ...formData,
          photo: base64String,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Iniciar webcam
  const startWebcam = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      });
      setStream(mediaStream);
      setShowWebcam(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Erro ao acessar webcam:', err);
      setError(['Não foi possível acessar a webcam. Verifique as permissões.']);
      setError(['Não foi possível acessar a webcam. Verifique as permissões.']);
    }
  };

  // Parar webcam
  const stopWebcam = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowWebcam(false);
  };

  // Capturar foto da webcam
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        
        const photoData = canvas.toDataURL('image/png');
        setPhotoPreview(photoData);
        setFormData({
          ...formData,
          photo: photoData,
        });
        
        stopWebcam();
      }
    }
  };

  // Gerar avatar com iniciais
  const generateAvatar = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    const context = canvas.getContext('2d');
    
    if (!context) return;

    // Obter iniciais do nome
    const name = formData.name || 'Aluno';
    const nameParts = name.trim().split(' ').filter(part => part.length > 0);
    const initials = nameParts.length >= 2 
      ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
      : nameParts[0]?.substring(0, 2).toUpperCase() || 'AL';

    // Cores de fundo aleatórias baseadas no nome
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DFE6E9', '#74B9FF', '#A29BFE', '#FD79A8', '#FDCB6E'
    ];
    const colorIndex = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    const bgColor = colors[colorIndex];

    // Desenhar fundo circular
    context.fillStyle = bgColor;
    context.fillRect(0, 0, 400, 400);

    // Desenhar iniciais
    context.fillStyle = '#FFFFFF';
    context.font = 'bold 160px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(initials, 200, 200);

    // Converter para base64
    const avatarData = canvas.toDataURL('image/png');
    setPhotoPreview(avatarData);
    setFormData({
      ...formData,
      photo: avatarData,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const keys = name.split('.');

    if (keys.length === 2) {
      const parentKey = keys[0] as keyof Student;
      const childKey = keys[1];
      const parentObj = formData[parentKey];
      
      setFormData({
        ...formData,
        [parentKey]: {
          ...(typeof parentObj === 'object' && parentObj !== null ? parentObj : {}),
          [childKey]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Validação CPF mod-11
  const isValidCpf = (cpf: string): boolean => {
    const digits = cpf.replace(/\D/g, '');
    if (digits.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(digits)) return false;
    const calcDigit = (base: string, factor: number) => {
      const sum = base.split('').reduce((acc, d) => acc + parseInt(d) * factor--, 0);
      const rem = (sum * 10) % 11;
      return rem >= 10 ? 0 : rem;
    };
    const d1 = calcDigit(digits.slice(0, 9), 10);
    const d2 = calcDigit(digits.slice(0, 10), 11);
    return d1 === parseInt(digits[9]) && d2 === parseInt(digits[10]);
  };

  // Validação dos dados básicos
  const validateBasicData = (): boolean => {
    const errors: string[] = [];

    // Validar nome completo (pelo menos um sobrenome)
    if (!formData.name || formData.name.trim() === '') {
      errors.push('Nome é obrigatório');
    } else {
      const nameParts = formData.name.trim().split(' ').filter(part => part.length > 0);
      if (nameParts.length < 2) {
        errors.push('Nome deve conter pelo menos um sobrenome');
      }
    }

    // Validar email
    if (!formData.email || formData.email.trim() === '') {
      errors.push('Email é obrigatório');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push('Email inválido');
    }

    // Validar telefone
    if (!formData.telefone || formData.telefone.trim() === '') {
      errors.push('Telefone é obrigatório');
    }

    // Validar data de nascimento
    if (!formData.dataNascimento || formData.dataNascimento.trim() === '') {
      errors.push('Data de nascimento é obrigatória');
    }

    // Validar CPF
    if (!formData.cpf || formData.cpf.trim() === '') {
      errors.push('CPF é obrigatório');
    } else if (!isValidCpf(formData.cpf)) {
      errors.push('CPF inválido');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  // Adicionar anexo
  const handleAddAttachment = () => {
    if (!attachmentFile || !attachmentDescription.trim()) {
      setError(['Selecione um arquivo e adicione uma descrição']);
        setError(['Selecione um arquivo e adicione uma descrição']);
        setError([]);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const newAttachment: Attachment = {
        id: Date.now().toString(),
        fileName: attachmentFile.name,
        fileType: attachmentFile.type.startsWith('image/') ? 'image' : 'pdf',
        fileData: reader.result as string,
        description: attachmentDescription,
        uploadDate: new Date().toISOString(),
      };

      setFormData({
        ...formData,
        attachments: [...(formData.attachments || []), newAttachment],
      });

      setAttachmentFile(null);
      setAttachmentDescription('');
      setError([]);
    };
    reader.readAsDataURL(attachmentFile);
  };

  // Remover anexo
  const handleRemoveAttachment = (id: string) => {
    setFormData({
      ...formData,
      attachments: (formData.attachments || []).filter(att => att.id !== id),
    });
  };

  // Adicionar entrada no histórico
  const handleAddHistory = () => {
    if (!historyDescription.trim() || !historyOccurredAt) {
      setError(['Preencha a descrição e a data da ocorrência']);
        setError(['Preencha a descrição e a data da ocorrência']);
        setError([]);
        setError([]);
        setError([]);
      return;
    }

    const newHistory = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      action: 'Registro Manual',
      description: historyDescription,
      type: 'alteracao' as const,
      occurredAt: historyOccurredAt,
      userName: 'Usuário Atual', // Aqui você pode pegar do contexto de autenticação
    };

    setFormData({
      ...formData,
      history: [...(formData.history || []), newHistory],
    });

    setHistoryDescription('');
    setHistoryOccurredAt('');
    setError([]);
  };

  // Remover entrada do histórico
  const handleRemoveHistory = (id: string) => {
    setFormData({
      ...formData,
      history: (formData.history || []).filter(h => h.id !== id),
    });
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setError([]);
      setSuccessMessage('');
      setValidationErrors([]);

      // Validar dados básicos
      if (!validateBasicData()) {
        setActiveTab('basico');
        setIsLoading(false);
        return;
      }

      // Se é um aluno existente, deve atualizar usando publicId
      if (student) {
        if (!student.publicId) {
          setError(['Não foi possível atualizar: publicId do aluno não encontrado.']);
          setIsLoading(false);
          return;
        }

        await studentsService.update(student.publicId, formData);
        console.log('Aluno atualizado com sucesso');
        setSuccessMessage('Aluno atualizado com sucesso!');
        
        // Chama o callback de sucesso e fecha após um pequeno delay
        setTimeout(() => {
          onSave(formData);
          onClose();
        }, 1500);
      } else {
        // Caso contrário, cria um novo aluno
        const resposta = await studentsService.create(formData);
        console.log('Aluno criado com sucesso', resposta);

        const alunoCriado = mapRespostaAlunoParaStudent(resposta);

        if (alunoCriado) {
          setFormData(alunoCriado);
          const mensagem = extrairMensagemResposta(resposta)
            || 'Aluno criado com sucesso! Agora está em modo edição.';
          setSuccessMessage(mensagem || 'Aluno criado com sucesso! Agora está em modo edição.');
          onSave(alunoCriado);

          setTimeout(() => {
            onClose();
          }, 1500);
        } else {
          onSave(formData);
          onClose();
        }
      }
    } catch (err) {
      console.error('Erro ao salvar aluno:', err);
      setError(getErrorMessages(err, 'Erro ao salvar aluno'));
    } finally {
      setIsLoading(false);
    }
  };

  // Verifica se o aluno é menor de idade
  const isMinor = () => {
    if (!formData.dataNascimento) return false;
    const today = new Date();
    const dataNascimento = new Date(formData.dataNascimento);
    const age = today.getFullYear() - dataNascimento.getFullYear();
    const monthDiff = today.getMonth() - dataNascimento.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dataNascimento.getDate())) {
      return age - 1 < 18;
    }
    return age < 18;
  };

  // Verifica se há informações preenchidas em Saúde
  const hasHealthInfo = () => {
    return (
      formData.health?.medicalConditions ||
      formData.health?.allergies
    );
  };

  const tabs = [
    { id: 'basico', label: 'Dados Básicos', icon: <User className="w-4 h-4" /> },
    ...(isMinor() ? [{ id: 'responsavel', label: 'Responsável', icon: <UserCheck className="w-4 h-4" /> }] : []),
    { id: 'saude', label: 'Saúde', icon: <Activity className="w-4 h-4" /> },
    { id: 'emergencia', label: 'Emergência', icon: <Phone className="w-4 h-4" /> },
    { id: 'endereco', label: 'Endereço', icon: <MapPin className="w-4 h-4" /> },
    { id: 'pagamento', label: 'Pagamento', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'plano', label: 'Plano', icon: <Zap className="w-4 h-4" /> },
    { id: 'anexos', label: 'Anexos', icon: <Paperclip className="w-4 h-4" /> },
    { id: 'historico', label: 'Histórico', icon: <History className="w-4 h-4" /> },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background-secondary border border-border-primary rounded-lg w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-primary">
          <div>
            <h2 className="text-2xl font-bold text-text-primary">
              {student ? 'Editar Aluno' : 'Novo Aluno'}
            </h2>
            {student?.matricula && (
              <p className="text-xs text-text-secondary mt-1">
                Matrícula: <span className="font-mono font-semibold text-text-primary">{student.matricula}</span>
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-background-tertiary rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-border-primary">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 px-4 py-3 whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-brand-primary text-brand-primary'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {tab.icon}
              <span className="text-sm">{tab.label}</span>
              {tab.id === 'saude' && hasHealthInfo() && (
                <AlertCircle className="w-4 h-4 text-red-500" />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Mensagens de Erro da API */}
          {error.length > 0 && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-red-500 mb-2">
                    Erro ao salvar:
                  </h3>
                  <ul className="list-disc list-inside space-y-1">
                    {error.map((err, index) => (
                      <li key={index} className="text-sm text-red-400">{err}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Mensagem de Sucesso */}
          {successMessage && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-green-600">{successMessage}</p>
                </div>
              </div>
            </div>
          )}

          {/* Mensagens de Validação */}
          {validationErrors.length > 0 && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-red-500 mb-2">
                    Corrija os seguintes erros:
                  </h3>
                  <ul className="list-disc list-inside space-y-1">
                    {validationErrors.map((error, index) => (
                      <li key={index} className="text-sm text-red-400">{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Dados Básicos */}
          {activeTab === 'basico' && (
            <div className="space-y-4">
              {/* Foto do Aluno */}
              <div className="flex justify-center mb-6">
                <div className="relative group">
                  <input
                    type="file"
                    id="photo-upload"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="cursor-pointer block"
                  >
                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-border-primary bg-background-tertiary group-hover:border-brand-primary transition-colors">
                      {photoPreview ? (
                        <img
                          src={photoPreview}
                          alt="Foto do aluno"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <UserCircle2 className="w-20 h-20 text-text-muted" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 py-4">
                        {/* Ícone do topo do triângulo */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            startWebcam();
                          }}
                          className="hover:scale-110 transition-transform"
                        >
                          <Video className="w-7 h-7 text-white" />
                        </button>
                        {/* Base do triângulo */}
                        <div className="flex items-center gap-6">
                          <Camera className="w-7 h-7 text-white" />
                          {photoPreview && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                setShowPhotoModal(true);
                              }}
                              className="hover:scale-110 transition-transform"
                            >
                              <ZoomIn className="w-7 h-7 text-white" />
                            </button>
                          )}
                        </div>
                        {/* Ícone Avatar abaixo */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            generateAvatar();
                          }}
                          className="hover:scale-110 transition-transform"
                        >
                          <UserCircle2 className="w-7 h-7 text-white" />
                        </button>
                      </div>
                    </div>
                    <p className="text-center text-xs text-text-secondary mt-2 group-hover:text-brand-primary transition-colors">
                      Clique para alterar foto
                    </p>
                  </label>
                </div>
              </div>

              {/* Modal da Webcam */}
              {showWebcam && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4">
                  <div className="bg-background-secondary rounded-lg p-6 max-w-2xl w-full">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-text-primary">Capturar Foto</h3>
                      <button
                        onClick={stopWebcam}
                        className="p-2 hover:bg-background-tertiary rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5 text-text-secondary" />
                      </button>
                    </div>
                    
                    <div className="relative bg-black rounded-lg overflow-hidden mb-4">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-auto"
                      />
                    </div>
                    
                    <canvas ref={canvasRef} className="hidden" />
                    
                    <div className="flex gap-3">
                      <button
                        onClick={stopWebcam}
                        className="flex-1 px-4 py-2 bg-background-tertiary hover:bg-background-primary border border-border-primary text-text-primary rounded-lg transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={capturePhoto}
                        className="flex-1 px-4 py-2 bg-brand-primary hover:bg-brand-primaryHover text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <Camera className="w-4 h-4" />
                        Capturar Foto
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Modal de Foto Ampliada */}
              {showPhotoModal && photoPreview && (
                <div 
                  className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4"
                  onClick={() => setShowPhotoModal(false)}
                >
                  <div className="relative max-w-4xl max-h-[90vh]">
                    <button
                      onClick={() => setShowPhotoModal(false)}
                      className="absolute -top-12 right-0 p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <X className="w-6 h-6 text-white" />
                    </button>
                    <img
                      src={photoPreview}
                      alt="Foto ampliada do aluno"
                      className="max-w-full max-h-[90vh] rounded-lg object-contain"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
              )}

              {/* Linha 1 */}
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Nome
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:border-brand-primary outline-none"
                  />
                </div>
                {/* Sexo ocupa 1 coluna */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Sexo
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:border-brand-primary outline-none"
                  >
                    <option value="">Selecione</option>
                    <option value="masculino">Masculino</option>
                    <option value="feminino">Feminino</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
              </div>

              {/* Linha 1.5 - Email */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:border-brand-primary outline-none"
                />
              </div>

              {/* Linha 2 */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    CPF
                  </label>
                  {/* @ts-ignore */}
                  <InputMask
                    mask="999.999.999-99"
                    value={formData.cpf}
                    onChange={handleInputChange}
                  >
                    {(inputProps) => (
                      <input
                        {...inputProps}
                        type="text"
                        name="cpf"
                        className="w-full px-3 py-2 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:border-brand-primary outline-none"
                      />
                    )}
                  </InputMask>
                </div>
                <div className="">
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Identidade
                  </label>
                  <input
                    type="text"
                    name="identity"
                    value={formData.identity}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:border-brand-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Data de Nascimento
                  </label>
                  <input
                    type="date"
                    name="dataNascimento"
                    value={formData.dataNascimento}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:border-brand-primary outline-none"
                  />
                </div>

                
              </div>

              {/* Linha 3 */}
              <div className="grid grid-cols-3 gap-4">
                <div className="">
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Tel. Residencial
                  </label>
                  <input
                    type="text"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:border-brand-primary outline-none"
                  />
                </div>

                
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Tel. Celular
                  </label>
                  <input
                    type="text"
                    name="cellPhone"
                    value={formData.cellPhone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:border-brand-primary outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:border-brand-primary outline-none"
                  >
                    <option value="ativo">Ativo</option>
                    <option value="inativo">Inativo</option>
                  </select>
                </div>
              </div>

              
            </div>

          )}

          {/* Endereço */}
          {activeTab === 'endereco' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Rua</label>
                <input
                  type="text"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:border-brand-primary outline-none"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Número</label>
                  <input
                    type="text"
                    name="address.number"
                    value={formData.address.number}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:border-brand-primary outline-none"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Complemento
                  </label>
                  <input
                    type="text"
                    name="address.complement"
                    value={formData.address.complement || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:border-brand-primary outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Bairro</label>
                  <input
                    type="text"
                    name="address.neighborhood"
                    value={formData.address.neighborhood}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:border-brand-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">CEP</label>
                  <input
                    type="text"
                    name="address.zipCode"
                    value={formData.address.zipCode}
                    onChange={handleInputChange}
                    placeholder="00000-000"
                    className="w-full px-3 py-2 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:border-brand-primary outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Cidade</label>
                  <input
                    type="text"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:border-brand-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Estado</label>
                  <input
                    type="text"
                    name="address.state"
                    value={formData.address.state}
                    onChange={handleInputChange}
                    placeholder="SP"
                    maxLength={2}
                    className="w-full px-3 py-2 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:border-brand-primary outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Pagamento */}
          {activeTab === 'pagamento' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Método de Pagamento
                </label>
                <select
                  name="payment.method"
                  value={formData.payment?.method || 'cartao'}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:border-brand-primary outline-none"
                >
                  <option value="cartao">Cartão de Crédito</option>
                  <option value="pix">PIX</option>
                  <option value="boleto">Boleto</option>
                  <option value="dinheiro">Dinheiro</option>
                </select>
              </div>
              {formData.payment?.method === 'cartao' && (
                <div className="space-y-4 p-4 bg-background-tertiary rounded-lg border border-border-primary">
                  <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-yellow-400">
                      Dados completos do cartão não são armazenados. Utilize gateway de pagamento (PIX ou boleto recomendados).
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Titular do Cartão
                    </label>
                    <input
                      type="text"
                      name="payment.cardHolder"
                      value={formData.payment?.cardHolder || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-background-secondary border border-border-primary rounded-lg text-text-primary focus:border-brand-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Últimos 4 dígitos
                    </label>
                    <input
                      type="text"
                      name="payment.lastFourDigits"
                      value={formData.payment?.lastFourDigits || ''}
                      onChange={handleInputChange}
                      placeholder="0000"
                      maxLength={4}
                      className="w-full px-3 py-2 bg-background-secondary border border-border-primary rounded-lg text-text-primary focus:border-brand-primary outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Plano */}
          {activeTab === 'plano' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Nome do Plano</label>
                <input
                  type="text"
                  name="subscription.name"
                  value={formData.subscription?.name || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:border-brand-primary outline-none"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Preço (R$)</label>
                  <input
                    type="number"
                    name="subscription.price"
                    value={formData.subscription?.price || 0}
                    onChange={handleInputChange}
                    step="0.01"
                    className="w-full px-3 py-2 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:border-brand-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Tipo</label>
                  <select
                    name="subscription.type"
                    value={formData.subscription?.type || 'mensal'}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:border-brand-primary outline-none"
                  >
                    <option value="mensal">Mensal</option>
                    <option value="trimestral">Trimestral</option>
                    <option value="semestral">Semestral</option>
                    <option value="anual">Anual</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Data de Início
                  </label>
                  <input
                    type="date"
                    name="subscription.startDate"
                    value={formData.subscription?.startDate || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:border-brand-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Data de Término
                  </label>
                  <input
                    type="date"
                    name="subscription.endDate"
                    value={formData.subscription?.endDate || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:border-brand-primary outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Status</label>
                <select
                  name="subscription.status"
                  value={formData.subscription?.status || 'ativo'}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:border-brand-primary outline-none"
                >
                  <option value="ativo">Ativo</option>
                  <option value="expirado">Expirado</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>
              {formData.subscription?.status === 'cancelado' && (
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Motivo de Cancelamento
                  </label>
                  <select
                    name="motivoCancelamentoId"
                    value={(formData as any).motivoCancelamentoId || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:border-brand-primary outline-none"
                  >
                    <option value="">Selecione o motivo...</option>
                    {motivosCancelamento.length > 0
                      ? motivosCancelamento.map((m) => (
                          <option key={m.id} value={m.id}>{m.descricao}</option>
                        ))
                      : <option disabled>Carregando motivos...</option>
                    }
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Saúde */}
          {activeTab === 'saude' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Peso (kg)
                  </label>
                  <input
                    type="number"
                    name="health.weight"
                    value={formData.health?.weight || ''}
                    onChange={handleInputChange}
                    placeholder="Ex: 75"
                    className="w-full px-3 py-2 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:border-brand-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Altura (cm)
                  </label>
                  <input
                    type="number"
                    name="health.height"
                    value={formData.health?.height || ''}
                    onChange={handleInputChange}
                    placeholder="Ex: 175"
                    className="w-full px-3 py-2 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:border-brand-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    IMC
                  </label>
                  <input
                    type="text"
                    value={
                      formData.health?.weight && formData.health?.height
                        ? (
                            Number(formData.health.weight) /
                            Math.pow(Number(formData.health.height) / 100, 2)
                          ).toFixed(2)
                        : ''
                    }
                    disabled
                    className="w-full px-3 py-2 bg-background-primary border border-border-primary rounded-lg text-text-secondary cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Tipo Sanguíneo
                  </label>
                  <select
                    name="health.bloodType"
                    value={formData.health?.bloodType || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:border-brand-primary outline-none"
                  >
                    <option value="">Selecione</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Objetivo
                  </label>
                  <select
                    name="health.goal"
                    value={formData.health?.goal || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:border-brand-primary outline-none"
                  >
                    <option value="">Selecione</option>
                    <option value="perder-peso">Perder Peso</option>
                    <option value="ganhar-massa">Ganhar Massa Muscular</option>
                    <option value="condicionamento">Condicionamento Físico</option>
                    <option value="saude">Saúde e Bem-estar</option>
                    <option value="reabilitacao">Reabilitação</option>
                    <option value="performance">Performance Esportiva</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Condições Médicas
                </label>
                <textarea
                  name="health.medicalConditions"
                  value={formData.health?.medicalConditions || ''}
                  onChange={handleInputChange}
                  placeholder="Ex: Diabetes, Hipertensão, Problemas cardíacos..."
                  rows={3}
                  className="w-full px-3 py-2 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:border-brand-primary outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Alergias
                </label>
                <textarea
                  name="health.allergies"
                  value={formData.health?.allergies || ''}
                  onChange={handleInputChange}
                  placeholder="Ex: Alergia a medicamentos, alimentos, látex..."
                  rows={3}
                  className="w-full px-3 py-2 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:border-brand-primary outline-none resize-none"
                />
              </div>
            </div>
          )}

          {/* Responsável (apenas para menores de idade) */}
          {activeTab === 'responsavel' && isMinor() && (
            <div className="space-y-4">
              <div className="p-4 bg-background-tertiary rounded-lg border border-border-primary mb-6">
                <div className="flex items-center gap-2 text-text-secondary mb-2">
                  <UserCheck className="w-4 h-4" />
                  <span className="text-sm font-medium">Dados do Responsável Legal</span>
                </div>
                <p className="text-xs text-text-muted">
                  Informações do responsável legal do aluno menor de idade.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Nome Completo do Responsável
                </label>
                <input
                  type="text"
                  name="responsible.name"
                  value={formData.responsible?.name || ''}
                  onChange={handleInputChange}
                  placeholder="Nome do responsável"
                  className="w-full px-3 py-2 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:border-brand-primary outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Parentesco
                  </label>
                  <select
                    name="responsible.relationship"
                    value={formData.responsible?.relationship || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:border-brand-primary outline-none"
                  >
                    <option value="">Selecione</option>
                    <option value="pai">Pai</option>
                    <option value="mae">Mãe</option>
                    <option value="padrasto">Padrasto</option>
                    <option value="madrasta">Madrasta</option>
                    <option value="avo">Avó</option>
                    <option value="ava">Avó</option>
                    <option value="tutor">Tutor Legal</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Telefone Celular
                  </label>
                  {/* @ts-ignore */}
                  <InputMask
                    mask="(99) 99999-9999"
                    type="text"
                    name="responsible.phoneCellular"
                    value={formData.responsible?.phoneCellular || ''}
                    onChange={handleInputChange}
                    placeholder="(00) 00000-0000"
                    className="w-full px-3 py-2 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:border-brand-primary outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    CPF
                  </label>
                  {/* @ts-ignore */}
                  <InputMask
                    mask="999.999.999-99"
                    type="text"
                    name="responsible.cpf"
                    value={formData.responsible?.cpf || ''}
                    onChange={handleInputChange}
                    placeholder="000.000.000-00"
                    className="w-full px-3 py-2 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:border-brand-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Identidade (RG)
                  </label>
                  {/* @ts-ignore */}
                  <input
                    type="text"
                    name="responsible.identity"
                    value={formData.responsible?.identity || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:border-brand-primary outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Telefone
                </label>
                {/* @ts-ignore */}
                <InputMask
                  mask="(99) 9999-9999"
                  type="text"
                  name="responsible.telefone"
                  value={formData.responsible?.telefone || ''}
                  onChange={handleInputChange}
                  placeholder="(00) 0000-0000"
                  className="w-full px-3 py-2 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:border-brand-primary outline-none"
                />
              </div>
            </div>
          )}

          {/* Contato de Emergência */}
          {activeTab === 'emergencia' && (
            <div className="space-y-4">
              <div className="p-4 bg-background-tertiary rounded-lg border border-border-primary mb-6">
                <div className="flex items-center gap-2 text-text-secondary mb-2">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm font-medium">Informações de Contato de Emergência</span>
                </div>
                <p className="text-xs text-text-muted">
                  Estas informações serão usadas em caso de emergência durante as atividades na academia.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Nome Completo
                </label>
                <input
                  type="text"
                  name="emergencyContact.name"
                  value={formData.emergencyContact?.name || ''}
                  onChange={handleInputChange}
                  placeholder="Nome do contato de emergência"
                  className="w-full px-3 py-2 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:border-brand-primary outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Telefone
                  </label>
                  {/* @ts-ignore */}
                  <InputMask
                    mask="(99) 99999-9999"
                    type="text"
                    name="emergencyContact.telefone"
                    value={formData.emergencyContact?.telefone || ''}
                    onChange={handleInputChange}
                    placeholder="(00) 00000-0000"
                    className="w-full px-3 py-2 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:border-brand-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Parentesco/Relação
                  </label>
                  <select
                    name="emergencyContact.relationship"
                    value={formData.emergencyContact?.relationship || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:border-brand-primary outline-none"
                  >
                    <option value="">Selecione</option>
                    <option value="pai">Pai</option>
                    <option value="mae">Mãe</option>
                    <option value="conjuge">Cônjuge</option>
                    <option value="filho">Filho(a)</option>
                    <option value="irmao">Irmão(ã)</option>
                    <option value="amigo">Amigo(a)</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Anexos */}
          {activeTab === 'anexos' && (
            <div className="space-y-4">
              <div className="p-4 bg-background-tertiary rounded-lg border border-border-primary">
                <div className="flex items-center gap-2 text-text-secondary mb-4">
                  <Paperclip className="w-4 h-4" />
                  <span className="text-sm font-medium">Adicionar Novo Anexo</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Descrição do Anexo
                    </label>
                    <input
                      type="text"
                      value={attachmentDescription}
                      onChange={(e) => setAttachmentDescription(e.target.value)}
                      placeholder="Ex: Atestado médico, Documento de identidade..."
                      className="w-full px-3 py-2 bg-background-secondary border border-border-primary rounded-lg text-text-primary focus:border-brand-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Arquivo (Imagem ou PDF)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => setAttachmentFile(e.target.files?.[0] || null)}
                        className="flex-1 px-3 py-2 bg-background-secondary border border-border-primary rounded-lg text-text-primary file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:bg-brand-primary file:text-white hover:file:bg-brand-primaryHover"
                      />
                      <button
                        onClick={handleAddAttachment}
                        className="px-4 py-2 bg-brand-primary hover:bg-brand-primaryHover text-white rounded-lg transition-colors flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        Adicionar
                      </button>
                    </div>
                    {attachmentFile && (
                      <p className="text-xs text-text-secondary mt-1">
                        Arquivo selecionado: {attachmentFile.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Lista de Anexos */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-text-secondary">Anexos Cadastrados</h3>
                {formData.attachments && formData.attachments.length > 0 ? (
                  formData.attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="p-4 bg-background-tertiary rounded-lg border border-border-primary flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        {attachment.fileType === 'image' ? (
                          <ImageIcon className="w-5 h-5 text-brand-primary" />
                        ) : (
                          <FileText className="w-5 h-5 text-red-500" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-text-primary text-sm">{attachment.description}</p>
                          <p className="text-xs text-text-secondary mt-0.5">
                            {attachment.fileName} • {new Date(attachment.uploadDate).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveAttachment(attachment.id)}
                        className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-text-secondary bg-background-tertiary rounded-lg border border-border-primary">
                    <Paperclip className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Nenhum anexo adicionado</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Histórico */}
          {activeTab === 'historico' && (
            <div className="space-y-4">
              <div className="p-4 bg-background-tertiary rounded-lg border border-border-primary">
                <div className="flex items-center gap-2 text-text-secondary mb-4">
                  <Plus className="w-4 h-4" />
                  <span className="text-sm font-medium">Adicionar Nova Ocorrência</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Descrição
                    </label>
                    <textarea
                      value={historyDescription}
                      onChange={(e) => setHistoryDescription(e.target.value)}
                      placeholder="Descreva a ocorrência..."
                      rows={3}
                      className="w-full px-3 py-2 bg-background-secondary border border-border-primary rounded-lg text-text-primary focus:border-brand-primary outline-none resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Data da Ocorrência
                      </label>
                      <input
                        type="date"
                        value={historyOccurredAt}
                        onChange={(e) => setHistoryOccurredAt(e.target.value)}
                        className="w-full px-3 py-2 bg-background-secondary border border-border-primary rounded-lg text-text-primary focus:border-brand-primary outline-none"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={handleAddHistory}
                        className="w-full px-4 py-2 bg-brand-primary hover:bg-brand-primaryHover text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Adicionar Ocorrência
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid de Histórico */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-text-secondary">Histórico de Ocorrências</h3>
                {formData.history && formData.history.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-background-tertiary border-b border-border-primary">
                          <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary">
                            Data Registro
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary">
                            Usuário
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary">
                            Descrição
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary">
                            Data Ocorrência
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary">
                            Ações
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.history.map((entry) => (
                          <tr
                            key={entry.id}
                            className="border-b border-border-primary hover:bg-background-tertiary transition-colors"
                          >
                            <td className="px-4 py-3 text-sm text-text-primary">
                              {new Date(entry.date).toLocaleDateString('pt-BR')}
                            </td>
                            <td className="px-4 py-3 text-sm text-text-primary">
                              {entry.userName || '-'}
                            </td>
                            <td className="px-4 py-3 text-sm text-text-primary">
                              {entry.description}
                            </td>
                            <td className="px-4 py-3 text-sm text-text-primary">
                              {entry.occurredAt ? new Date(entry.occurredAt).toLocaleDateString('pt-BR') : '-'}
                            </td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => handleRemoveHistory(entry.id)}
                                className="p-1 hover:bg-red-500/10 rounded transition-colors"
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-8 text-center text-text-secondary bg-background-tertiary rounded-lg border border-border-primary">
                    <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Nenhuma ocorrência registrada</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-border-primary">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-background-tertiary hover:bg-background-primary border border-border-primary text-text-primary rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-brand-primary hover:bg-brand-primaryHover text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Salvando...</span>
              </>
            ) : (
              'Salvar'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
