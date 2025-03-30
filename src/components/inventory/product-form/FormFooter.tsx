
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';
import { Save, X, Plus } from 'lucide-react';

interface FormFooterProps {
  isSubmitting: boolean;
  isEditing: boolean;
  hasVariants: boolean;
  onClose: () => void;
  onManageVariants: () => void;
}

const FormFooter: React.FC<FormFooterProps> = ({
  isSubmitting,
  isEditing,
  hasVariants,
  onClose,
  onManageVariants
}) => {
  return (
    <CardFooter className="px-0 pb-0 pt-4 flex justify-end gap-2">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onClose}
      >
        <X className="mr-2 h-4 w-4" />
        Cancel
      </Button>
      <Button 
        type="submit"
        disabled={isSubmitting}
        className="min-w-[120px]"
      >
        <Save className="mr-2 h-4 w-4" />
        {isSubmitting ? 'Saving...' : hasVariants ? 'Save & Continue' : 'Save Product'}
      </Button>
      {isEditing && hasVariants && (
        <Button 
          type="button" 
          onClick={onManageVariants}
          disabled={isSubmitting}
        >
          <Plus className="mr-2 h-4 w-4" />
          Manage Variants
        </Button>
      )}
    </CardFooter>
  );
};

export default FormFooter;
