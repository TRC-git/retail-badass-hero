
import React from 'react';
import { Product } from '@/types';
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
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
  if (!product) return null;

  return (
    <Dialog open={showVariantsManager} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Variants for {product.name}</DialogTitle>
          <DialogDescription>
            Create and manage product variants with different attributes like size, color, and price.
          </DialogDescription>
        </DialogHeader>
        <ProductVariantsManager 
          product={product} 
          onClose={onClose} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default VariantManagerModal;
