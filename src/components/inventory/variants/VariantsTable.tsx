
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2, RefreshCw } from "lucide-react";
import { ProductVariant } from "@/types";

interface VariantsTableProps {
  variants: ProductVariant[];
  loading: boolean;
  handleUpdateVariant: (id: string, updates: Partial<ProductVariant>) => Promise<ProductVariant | null>;
  handleDeleteVariant: (id: string) => Promise<boolean>;
}

const VariantsTable = ({
  variants,
  loading,
  handleUpdateVariant,
  handleDeleteVariant
}: VariantsTableProps) => {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>SKU</TableHead>
            <TableHead>Color</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Flavor</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                <RefreshCw className="h-5 w-5 animate-spin mx-auto" />
              </TableCell>
            </TableRow>
          ) : variants.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No variants found. Add your first variant.
              </TableCell>
            </TableRow>
          ) : (
            variants.map((variant) => (
              <TableRow key={variant.id}>
                <TableCell>{variant.sku || "-"}</TableCell>
                <TableCell>{variant.color || "-"}</TableCell>
                <TableCell>{variant.size || "-"}</TableCell>
                <TableCell>{variant.flavor || "-"}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={variant.price || 0}
                    onChange={(e) => handleUpdateVariant(variant.id, { price: Number(e.target.value) })}
                    className="w-24"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    value={variant.stock_count || 0}
                    onChange={(e) => handleUpdateVariant(variant.id, { stock_count: Number(e.target.value) })}
                    className="w-24"
                  />
                </TableCell>
                <TableCell className="text-right">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Variant</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this variant? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteVariant(variant.id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default VariantsTable;
