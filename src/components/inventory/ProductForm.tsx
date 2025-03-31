
import React from 'react';
import { Product } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Form } from "@/components/ui/form";

// Import our form section components
import BasicProductInfo from './product-form/BasicProductInfo';
import PricingInfo from './product-form/PricingInfo';
import InventoryDetails from './product-form/InventoryDetails';
import FormHeader from './product-form/FormHeader';
import FormFooter from './product-form/FormFooter';
import VariantManagerModal from './product-form/VariantManagerModal';
import useProductForm from '@/hooks/useProductForm';

interface ProductFormProps {
  product?: Product;
  productId?: string;
  onClose: () => void;
  onSave?: () => void;
  threeColumns?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({ 
  product, 
  productId, 
  onClose, 
  onSave, 
  threeColumns = false 
}) => {
  const {
    form,
    isSubmitting,
    isEditing,
    categories,
    showVariantsManager,
    currentProduct,
    onSubmit,
    setShowVariantsManager,
    handleVariantManagerClose
  } = useProductForm({
    product,
    productId,
    onClose,
    onSave
  });

  return (
    <>
      <Card className="w-full mx-auto shadow-lg border border-border/30 bg-card">
        <FormHeader isEditing={isEditing} />
        
        <CardContent className="p-4 pt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className={`grid grid-cols-1 ${threeColumns ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6`}>
                <BasicProductInfo form={form} />
                <PricingInfo form={form} />
                <InventoryDetails form={form} categories={categories} />
              </div>
              
              <FormFooter 
                isSubmitting={isSubmitting}
                isEditing={isEditing}
                hasVariants={currentProduct?.has_variants || false}
                onClose={onClose}
                onManageVariants={() => setShowVariantsManager(true)}
              />
            </form>
          </Form>
        </CardContent>
      </Card>

      <VariantManagerModal 
        product={currentProduct}
        showVariantsManager={showVariantsManager}
        onClose={handleVariantManagerClose}
      />
    </>
  );
};

export default ProductForm;
