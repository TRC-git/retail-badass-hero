
import { useState, useEffect } from 'react';
import { fetchCategories } from '@/api/inventoryApi';
import { toast } from 'sonner';

export function useCategories() {
  const [categories, setCategories] = useState<{ id: string; name: string; }[]>([]);

  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories');
      }
    };

    fetchCategoriesData();
  }, []);

  return categories;
}
