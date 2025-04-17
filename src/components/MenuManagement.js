import { resetAndImportMenuData } from '../utils/menuDataManager';

const handleImportMenu = async () => {
  try {
    setIsLoading(true);
    await resetAndImportMenuData();
    toast.success('Menu data has been successfully reset and imported');
  } catch (error) {
    console.error('Error importing menu:', error);
    toast.error('Failed to import menu data. Please try again.');
  } finally {
    setIsLoading(false);
  }
}; 