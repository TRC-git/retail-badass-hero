
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { UseProductFormProps, ProductFormData } from './types';
import { useCategories } from './useCategories';
import { useProductLoader } from './useProductLoader';
import { useProductSubmit } from './useProductSubmit';

const useProductForm = ({ product, productId, onClose, onSave }: UseProductFormProps) => {
  const [showVariantsManager, setShowVariantsManager] = useState(false);
  
  // Initialize form with useForm
  const form = useForm<ProductFormData>({
    defaultValues: {
      name: '',
      description: '',
      price: undefined,
      cost: undefined,
      stock: undefined,
      sku: '',
      barcode: '',
      image_url: '',
      category: '',
      category_id: '',
      has_variants: false,
    }
  });

  // Load categories
  const categories = useCategories();
  
  // Load product data if editing
  const { isEditing, currentProduct, setCurrentProduct } = useProductLoader(product, productId, form);
  
  // Handle product submission
  const { isSubmitting, handleSubmit } = useProductSubmit(
    isEditing,
    productId,
    product,
    setCurrentProduct,
    setShowVariantsManager,
    onSave,
    onClose
  );

  // Submit handler that connects to the form
  const onSubmit = async (data: ProductFormData) => {
    await handleSubmit(data);
  };

  const handleVariantManagerClose = () => {
    setShowVariantsManager(false);
    if (onSave) onSave();
    onClose();
  };

  return {
    form,
    isSubmitting,
    isEditing,
    categories,
    showVariantsManager,
    currentProduct,
    onSubmit,
    setShowVariantsManager,
    handleVariantManagerClose
  };
};

export default useProductForm;
