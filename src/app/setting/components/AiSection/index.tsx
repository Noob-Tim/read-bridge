import { useEffect, useState } from 'react';
import { Menu, theme, Button, Form } from 'antd';
import { Provider, Model } from '@/src/types/llm';
import { useLLMStore } from '@/src/store/useLLMStore';
import { ModelFormModal, ProviderForm } from './cpns';

export default function AiSection() {
  const { providers: defaultProviders, addProvider, editProvider, deleteProvider } = useLLMStore()
  const [providers, setProviders] = useState<Provider[]>([])
  const [selectedProviderId, setSelectedProviderId] = useState<string>('');
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const { token } = theme.useToken();
  const [form] = Form.useForm();
  const [modelModalVisible, setModelModalVisible] = useState(false);
  const [currentModel, setCurrentModel] = useState<Model | undefined>(undefined);

  useEffect(() => {
    setProviders([...defaultProviders])
    if (selectedProviderId === '') {
      setSelectedProviderId(defaultProviders[0].id)
      setSelectedProvider(defaultProviders[0])
    }
  }, [defaultProviders])

  useEffect(() => {
    if (selectedProvider) {
      form.setFieldsValue({
        name: selectedProvider.name,
        baseUrl: selectedProvider.baseUrl,
        apiKey: selectedProvider.apiKey,
      });
    }
  }, [selectedProvider, form]);

  const menuItems = providers.map((provider: Provider) => ({
    key: provider.id,
    label: (
      <div className="flex flex-col justify-center">
        <span className="text-base font-medium">{provider.name}</span>
        <span className="text-sm text-gray-500">{provider.models.length} Models</span>
      </div>
    ),
  }));

  const handleMenuSelect = ({ key }: { key: string }) => {
    setSelectedProviderId(key);
    setSelectedProvider(providers.find(p => p.id === key) || null)
  };

  const handleProviderUpdate = (values: any) => {
    if (selectedProvider) {
      const updatedProvider = {
        ...selectedProvider,
        ...values
      };
      editProvider(updatedProvider);
      setSelectedProvider(updatedProvider);
    }
  };

  const handleAddModel = () => {
    setCurrentModel(undefined);
    setModelModalVisible(true);
  };

  const handleEditModel = (model: Model) => {
    setCurrentModel(model);
    setModelModalVisible(true);
  };

  const handleModelSubmit = (model: Model) => {
    if (!selectedProvider) return;

    let updatedModels: Model[];
    if (currentModel) {
      // Edit existing model
      updatedModels = selectedProvider.models.map(m =>
        m.id === model.id ? model : m
      );
    } else {
      // Add new model
      updatedModels = [...selectedProvider.models, model];
    }

    const updatedProvider = {
      ...selectedProvider,
      model: updatedModels
    };

    editProvider(updatedProvider);
    setSelectedProvider(updatedProvider);
    setModelModalVisible(false);
  };

  const handleDeleteModel = (modelId: string) => {
    if (!selectedProvider) return;

    const updatedProvider = {
      ...selectedProvider,
      model: selectedProvider.models.filter(m => m.id !== modelId)
    };

    editProvider(updatedProvider);
    setSelectedProvider(updatedProvider);
  };

  const handleDeleteProvider = () => {
    if (selectedProvider && !selectedProvider.isDefault) {
      deleteProvider(selectedProvider.id);
      // Reset selection to first provider
      if (providers.length > 1) {
        const firstRemainingProvider = providers.find(p => p.id !== selectedProvider.id);
        if (firstRemainingProvider) {
          setSelectedProviderId(firstRemainingProvider.id);
          setSelectedProvider(firstRemainingProvider);
        }
      }
    }
  };

  return (
    <div className="h-[50vh] flex justify-between border rounded-lg overflow-hidden" style={{ borderColor: token.colorBorder }}>
      <div className='w-[20%] flex flex-col overflow-y-auto'>
        <Menu
          mode="inline"
          selectedKeys={[selectedProviderId]}
          className="w-full"
          items={menuItems}
          onClick={handleMenuSelect}
        />
        <Button className='h-[10%] mb-2' type="text" onClick={addProvider}>+</Button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        {selectedProvider && (
          <ProviderForm
            provider={selectedProvider}
            form={form}
            onProviderUpdate={handleProviderUpdate}
            onAddModel={handleAddModel}
            onEditModel={handleEditModel}
            onDeleteModel={handleDeleteModel}
            onDeleteProvider={handleDeleteProvider}
          />
        )}
      </div>

      <ModelFormModal
        visible={modelModalVisible}
        onCancel={() => setModelModalVisible(false)}
        onSubmit={handleModelSubmit}
        initialValues={currentModel}
        providerId={selectedProviderId}
      />
    </div>
  );
}

