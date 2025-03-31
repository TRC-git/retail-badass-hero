
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Product } from '@/types';
import ProductVariantsManager from '../ProductVariantsManager';

interface VariantManagerModalProps {
  product: Product | null;
  showVariantsManager: boolean;
  onClose: () => void;
}

const VariantManagerModal: React.FC<VariantManagerModalProps> = ({
  product,
  showVariantsManager,
  onClose
}) => {
  // If no product is provided, we can't manage variants
  if (!product) return null;

  return (
    <Dialog open={showVariantsManager} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle>Manage Product Variants: {product.name}</DialogTitle>
          <DialogDescription>
            Add and edit variants for this product
          </DialogDescription>
        </DialogHeader>
        
        <div className="px-6 pb-6">
          <ProductVariantsManager product={product} onClose={onClose} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VariantManagerModal;
