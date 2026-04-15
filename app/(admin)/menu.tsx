/**
 * Admin Menu Management Screen
 * Add, edit, and manage menu items
 */

import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert, Image, ActivityIndicator } from 'react-native';
import { useEffect, useMemo, useState } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { getMenuItems } from '@/lib/menu-data';
import { menuService, type MenuItem } from '@/lib/supabase-service';

const appLogo = require('@/applogo.png');

export default function AdminMenuScreen() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', price: '', category: 'Snacks' });
  const [isLoading, setIsLoading] = useState(true);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editFields, setEditFields] = useState({ name: '', price: '', category: '' });

  const filteredItems = useMemo(
    () =>
      menuItems.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [menuItems, searchQuery],
  );

  useEffect(() => {
    let unsubscribe = () => { };

    const loadMenu = async () => {
      try {
        setIsLoading(true);
        let items = await menuService.getAllMenuItems();

        if (items.length === 0) {
          await menuService.seedMenuFromJson(
            getMenuItems().map((item) => ({
              name: item.name,
              price: item.price,
              category: item.category,
              description: item.description,
              image: '',
              available: item.available ?? true,
            })),
          );
          items = await menuService.getAllMenuItems();
        }

        setMenuItems(items);
        unsubscribe = menuService.subscribeToMenu(setMenuItems);
      } catch (error) {
        console.error('Failed to load admin menu items', error);
        Alert.alert('Error', 'Failed to load menu items from Supabase.');
      } finally {
        setIsLoading(false);
      }
    };

    loadMenu();

    return () => unsubscribe();
  }, []);

  const handleAddItem = async () => {
    if (!newItem.name.trim() || !newItem.price.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await menuService.addMenuItem({
        name: newItem.name.trim(),
        price: parseFloat(newItem.price),
        category: newItem.category.trim() || 'Snacks',
        description: `${newItem.category.trim() || 'Snack'} item`,
        image: '',
        available: true,
      });
      setNewItem({ name: '', price: '', category: 'Snacks' });
      setShowAddForm(false);
      Alert.alert('Success', 'Menu item added successfully');
    } catch (error) {
      console.error('Add menu item failed', error);
      Alert.alert('Error', 'Unable to add item to Supabase.');
    }
  };

  const handleDeleteItem = async (id: string) => {
    Alert.alert('Delete Item', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await menuService.deleteMenuItem(id);
            Alert.alert('Success', 'Item deleted');
          } catch (error) {
            console.error('Delete menu item failed', error);
            Alert.alert('Error', 'Failed to delete item from Supabase.');
          }
        },
      },
    ]);
  };

  const handleToggleAvailability = async (item: MenuItem) => {
    try {
      await menuService.updateMenuItem(item.id, { available: !item.available });
    } catch (error) {
      console.error('Update availability failed', error);
      Alert.alert('Error', 'Failed to update availability');
    }
  };

  const handleStartEdit = (item: MenuItem) => {
    setEditingItemId(item.id);
    setEditFields({
      name: item.name,
      price: item.price.toString(),
      category: item.category,
    });
  };

  const handleChangeEditField = (field: 'name' | 'price' | 'category', value: string) => {
    setEditFields((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveEdit = async (id: string) => {
    if (!editFields.name.trim() || !editFields.price.trim()) {
      Alert.alert('Error', 'Please enter a name and price');
      return;
    }

    try {
      await menuService.updateMenuItem(id, {
        name: editFields.name.trim(),
        price: parseFloat(editFields.price),
        category: editFields.category.trim() || 'Snacks',
      });
      setEditingItemId(null);
      Alert.alert('Success', 'Menu item updated successfully');
    } catch (error) {
      console.error('Save menu edit failed', error);
      Alert.alert('Error', 'Unable to save menu item changes');
    }
  };

  const handleCancelEdit = () => {
    setEditingItemId(null);
  };

  return (
    <ScreenContainer className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="px-4 py-6">
          <View className="mb-6 flex-row items-center gap-4">
            <View className="w-16 h-16 rounded-full bg-primary/10 items-center justify-center overflow-hidden">
              <Image source={appLogo} style={{ width: 56, height: 56, resizeMode: 'contain' }} />
            </View>
            <View>
              <Text className="text-3xl font-bold text-foreground mb-2">Menu Management</Text>
              <Text className="text-muted text-sm">Add and manage menu items from Supabase</Text>
            </View>
          </View>

          {isLoading ? (
            <ActivityIndicator size="large" color="#FF6B35" />
          ) : (
            <>
              <View className="mb-4">
                <TextInput
                  className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
                  placeholder="Search menu items..."
                  placeholderTextColor="#7A7A7A"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>

              <TouchableOpacity
                className="w-full bg-primary rounded-lg py-3 items-center mb-6"
                onPress={() => setShowAddForm(!showAddForm)}
              >
                <Text className="text-white font-bold text-base">
                  {showAddForm ? 'Cancel' : '+ Add New Item'}
                </Text>
              </TouchableOpacity>

              {showAddForm && (
                <View className="bg-surface border border-border rounded-lg p-4 mb-6">
                  <Text className="text-lg font-bold text-foreground mb-3">Add New Item</Text>

                  <TextInput
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground mb-3"
                    placeholder="Item name"
                    placeholderTextColor="#7A7A7A"
                    value={newItem.name}
                    onChangeText={(name) => setNewItem((prev) => ({ ...prev, name }))}
                  />

                  <TextInput
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground mb-3"
                    placeholder="Price"
                    placeholderTextColor="#7A7A7A"
                    value={newItem.price}
                    onChangeText={(price) => setNewItem((prev) => ({ ...prev, price }))}
                    keyboardType="decimal-pad"
                  />

                  <TextInput
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground mb-3"
                    placeholder="Category"
                    placeholderTextColor="#7A7A7A"
                    value={newItem.category}
                    onChangeText={(category) => setNewItem((prev) => ({ ...prev, category }))}
                  />

                  <TouchableOpacity
                    className="w-full bg-primary rounded-lg py-3 items-center"
                    onPress={handleAddItem}
                  >
                    <Text className="text-white font-bold">Add Item</Text>
                  </TouchableOpacity>
                </View>
              )}

              <View>
                <Text className="text-lg font-bold text-foreground mb-3">Items ({filteredItems.length})</Text>
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <View
                      key={item.id}
                      className="bg-surface rounded-lg p-4 mb-3 border border-border"
                    >
                      {editingItemId === item.id ? (
                        <>
                          <TextInput
                            className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground mb-3"
                            value={editFields.name}
                            onChangeText={(text) => handleChangeEditField('name', text)}
                            placeholder="Item name"
                            placeholderTextColor="#7A7A7A"
                          />
                          <TextInput
                            className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground mb-3"
                            value={editFields.price}
                            onChangeText={(text) => handleChangeEditField('price', text)}
                            placeholder="Price"
                            placeholderTextColor="#7A7A7A"
                            keyboardType="decimal-pad"
                          />
                          <TextInput
                            className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground mb-3"
                            value={editFields.category}
                            onChangeText={(text) => handleChangeEditField('category', text)}
                            placeholder="Category"
                            placeholderTextColor="#7A7A7A"
                          />
                          <View className="flex-row gap-3">
                            <TouchableOpacity
                              className="flex-1 bg-primary rounded-lg py-3 items-center"
                              onPress={() => handleSaveEdit(item.id)}
                            >
                              <Text className="text-background font-bold">Save</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              className="flex-1 bg-surface border border-border rounded-lg py-3 items-center"
                              onPress={handleCancelEdit}
                            >
                              <Text className="text-foreground font-bold">Cancel</Text>
                            </TouchableOpacity>
                          </View>
                        </>
                      ) : (
                        <>
                          <Text className="text-base font-bold text-foreground">{item.name}</Text>
                          <Text className="text-sm text-muted">₹{item.price}</Text>
                          <Text className="text-sm text-muted mb-3">{item.category}</Text>
                          <View className="flex-row items-center gap-2 mb-3">
                            <TouchableOpacity
                              className={`px-3 py-1 rounded-full ${item.available ? 'bg-success/20' : 'bg-error/20'}`}
                              onPress={() => handleToggleAvailability(item)}
                            >
                              <Text className={`text-xs font-semibold ${item.available ? 'text-success' : 'text-error'}`}>
                                {item.available ? 'Available' : 'Out of Stock'}
                              </Text>
                            </TouchableOpacity>
                          </View>
                          <View className="flex-row gap-3">
                            <TouchableOpacity
                              className="flex-1 bg-surface border border-border rounded-lg py-3 items-center"
                              onPress={() => handleStartEdit(item)}
                            >
                              <Text className="text-foreground font-bold">Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              className="flex-1 bg-error/20 rounded-lg py-3 items-center"
                              onPress={() => handleDeleteItem(item.id)}
                            >
                              <Text className="text-error font-bold">Delete</Text>
                            </TouchableOpacity>
                          </View>
                        </>
                      )}
                    </View>
                  ))
                ) : (
                  <View className="items-center py-8">
                    <Text className="text-muted text-base">No items found</Text>
                  </View>
                )}
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
