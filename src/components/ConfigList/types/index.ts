import { ApiConfig } from '../../../utils/contentScriptTool/types';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ConfigFormData extends Partial<ApiConfig> {}

export interface FieldInputProps {
  paths: string;
  description: string;
  onChange: (paths: string, description: string) => void;
  placeholder?: {
    paths?: string;
    description?: string;
  };
}

export interface ConfigItemProps {
  config: ApiConfig;
  isEditing: boolean;
  isActive: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onSave: (config: ApiConfig) => void;
  onCancel: () => void;
  onUse: () => void;
}

export interface ConfigFormProps {
  initialData?: ConfigFormData;
  onSubmit: (data: ApiConfig) => void;
  submitText: string;
}
