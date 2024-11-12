import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

// Define interfaces for the APIs response
interface EnderecoData {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  complemento: string;
  ddd: string;
  erro?: boolean;
}

interface CNPJData {
  nome: string;
  fantasia: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  municipio: string;
  uf: string;
  cep: string;
  telefone: string;
  email: string;
  situacao: string;
  status: string;
  message?: string;
}

// Props interfaces for the card components
interface EnderecoCardProps {
  label: string;
  value: string;
}

interface CNPJCardProps {
  label: string;
  value: string;
}

// Interface for styles
interface Styles {
  container: ViewStyle;
  header: ViewStyle;
  title: TextStyle;
  subtitle: TextStyle;
  inputContainer: ViewStyle;
  input: TextStyle;
  button: ViewStyle;
  buttonText: TextStyle;
  resultContainer: ViewStyle;
  cardItem: ViewStyle;
  cardLabel: TextStyle;
  cardValue: TextStyle;
  divider: ViewStyle;
}

export default function App(): JSX.Element {
  const [cep, setCep] = useState<string>('');
  const [cnpj, setCnpj] = useState<string>('');
  const [loadingCep, setLoadingCep] = useState<boolean>(false);
  const [loadingCnpj, setLoadingCnpj] = useState<boolean>(false);
  const [endereco, setEndereco] = useState<EnderecoData | null>(null);
  const [empresa, setEmpresa] = useState<CNPJData | null>(null);

  const validarCEP = (cep: string): boolean => /^[0-9]{8}$/.test(cep);
  
  const validarCNPJ = (cnpj: string): boolean => /^[0-9]{14}$/.test(cnpj);

  const buscarCEP = async (): Promise<void> => {
    const cepLimpo = cep.replace(/\D/g, '');

    if (!validarCEP(cepLimpo)) {
      Alert.alert('Erro', 'Digite um CEP válido com 8 dígitos');
      return;
    }

    setLoadingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data: EnderecoData = await response.json();

      if (data.erro) {
        Alert.alert('Erro', 'CEP não encontrado');
        setEndereco(null);
      } else {
        setEndereco(data);
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao buscar o CEP');
    } finally {
      setLoadingCep(false);
    }
  };

  const buscarCNPJ = async (): Promise<void> => {
    const cnpjLimpo = cnpj.replace(/\D/g, '');

    if (!validarCNPJ(cnpjLimpo)) {
      Alert.alert('Erro', 'Digite um CNPJ válido com 14 dígitos');
      return;
    }

    setLoadingCnpj(true);
    try {
      const response = await fetch(`https://www.receitaws.com.br/v1/cnpj/${cnpjLimpo}`);
      const data: CNPJData = await response.json();

      if (data.status === 'ERROR' || data.message) {
        Alert.alert('Erro', data.message || 'CNPJ não encontrado');
        setEmpresa(null);
      } else {
        setEmpresa(data);
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao buscar o CNPJ');
    } finally {
      setLoadingCnpj(false);
    }
  };

  const EnderecoCard: React.FC<EnderecoCardProps> = ({ label, value }) => (
    <View style={styles.cardItem}>
      <Text style={styles.cardLabel}>{label}</Text>
      <Text style={styles.cardValue}>{value || '-'}</Text>
    </View>
  );

  const CNPJCard: React.FC<CNPJCardProps> = ({ label, value }) => (
    <View style={styles.cardItem}>
      <Text style={styles.cardLabel}>{label}</Text>
      <Text style={styles.cardValue}>{value || '-'}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <ScrollView>
        <View style={styles.header}>
          <Ionicons name="location" size={40} color="#6C63FF" />
          <Text style={styles.title}>Consultas</Text>
        </View>

        <Text style={styles.subtitle}>Busca CEP</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Digite o CEP"
            placeholderTextColor="#666"
            value={cep}
            onChangeText={setCep}
            keyboardType="numeric"
            maxLength={8}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={buscarCEP}
            disabled={loadingCep}
          >
            {loadingCep ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Buscar</Text>
            )}
          </TouchableOpacity>
        </View>

        {endereco && (
          <View style={styles.resultContainer}>
            <EnderecoCard label="CEP" value={endereco.cep} />
            <EnderecoCard label="Logradouro" value={endereco.logradouro} />
            <EnderecoCard label="Bairro" value={endereco.bairro} />
            <EnderecoCard label="Cidade" value={endereco.localidade} />
            <EnderecoCard label="Estado" value={endereco.uf} />
            <EnderecoCard label="Complemento" value={endereco.complemento} />
            <EnderecoCard label="DDD" value={endereco.ddd} />
          </View>
        )}

        <View style={styles.divider} />

        <Text style={styles.subtitle}>Busca CNPJ</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Digite o CNPJ"
            placeholderTextColor="#666"
            value={cnpj}
            onChangeText={setCnpj}
            keyboardType="numeric"
            maxLength={14}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={buscarCNPJ}
            disabled={loadingCnpj}
          >
            {loadingCnpj ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Buscar</Text>
            )}
          </TouchableOpacity>
        </View>

        {empresa && (
          <View style={styles.resultContainer}>
            <CNPJCard label="Razão Social" value={empresa.nome} />
            <CNPJCard label="Nome Fantasia" value={empresa.fantasia} />
            <CNPJCard label="Situação" value={empresa.situacao} />
            <CNPJCard label="Logradouro" value={`${empresa.logradouro}, ${empresa.numero}`} />
            <CNPJCard label="Complemento" value={empresa.complemento} />
            <CNPJCard label="Bairro" value={empresa.bairro} />
            <CNPJCard label="Cidade" value={empresa.municipio} />
            <CNPJCard label="Estado" value={empresa.uf} />
            <CNPJCard label="CEP" value={empresa.cep} />
            <CNPJCard label="Telefone" value={empresa.telefone} />
            <CNPJCard label="Email" value={empresa.email} />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: '#121214',
    padding: 20,
  },
  header: {
    marginTop: 60,
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: '#202024',
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#FFF',
    marginRight: 10,
  },
  button: {
    backgroundColor: '#6C63FF',
    height: 50,
    width: 100,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    backgroundColor: '#202024',
    borderRadius: 10,
    padding: 16,
    marginTop: 20,
  },
  cardItem: {
    marginBottom: 16,
  },
  cardLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#333',
    marginVertical: 32,
  },
});