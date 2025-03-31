
import { Product } from '@/types';
import { ProductFormData } from '@/components/inventory/product-form/types';

export interface UseProductFormProps {
  product?: Product;
  productId?: string;
  onClose: () => void;
  onSave?: () => void;
}

export interface UseProductFormState {
  isSubmitting: boolean;
  isEditing: boolean;
  categories: { id: string; name: string; }[];
  showVariantsManager: boolean;
  currentProduct: Product | null;
}

export type { ProductFormData };
