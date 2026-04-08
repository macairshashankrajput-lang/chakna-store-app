/**
 * Admin Menu Management Screen
 * Add, edit, and manage menu items
 */

import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useState } from 'react';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  available: boolean;
}

const mockMenuItems: MenuItem[] = [
  { id: '1', name: 'Masala Peanuts', price: 49, category: 'Snacks', available: true },
  { id: '2', name: 'Chivda Mix', price: 79, category: 'Snacks', available: true },
  { id: '3', name: 'Samosa', price: 59, category: 'Snacks', available: false },
];

export default function AdminMenuScreen() {
  const [menuItems, setMenuItems] = useState(mockMenuItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', price: '', category: 'Snacks' });

  const filteredItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddItem = () => {
    if (!newItem.name || !newItem.price) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    const item: MenuItem = {
      id: Date.now().toString(),
      name: newItem.name,
      price: parseFloat(newItem.price),
      category: newItem.category,
      available: true,
    };
    setMenuItems([...menuItems, item]);
    setNewItem({ name: '', price: '', category: 'Snacks' });
    setShowAddForm(false);
    Alert.alert('Success', 'Menu item added successfully');
  };

  const handleDeleteItem = (id: string) => {
    Alert.alert('Delete Item', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        onPress: () => {
          setMenuItems(menuItems.filter(item => item.id !== id));
          Alert.alert('Success', 'Item deleted');
        },
        style: 'destructive',
      },
    ]);
  };

  const handleToggleAvailability = (id: string) => {
    setMenuItems(
      menuItems.map(item =>
        item.id === id ? { ...item, available: !item.available } : item
      )
    );
  };

  return (
    <ScreenContainer className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="px-4 py-6">
          {/* Header */}
          <View className="mb-6">
            <Text className="text-3xl font-bold text-foreground mb-2">Menu Management</Text>
            <Text className="text-muted text-sm">Add and manage menu items</Text>
          </View>

          {/* Search Bar */}
          <View className="mb-4">
            <TextInput
              className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              placeholder="Search menu items..."
              placeholderTextColor="#7A7A7A"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Add Item Button */}
          <TouchableOpacity
            className="w-full bg-primary rounded-lg py-3 items-center mb-6"
            onPress={() => setShowAddForm(!showAddForm)}
          >
            <Text className="text-white font-bold text-base">
              {showAddForm ? 'Cancel' : '+ Add New Item'}
            </Text>
          </TouchableOpacity>

          {/* Add Item Form */}
          {showAddForm && (
            <View className="bg-surface border border-border rounded-lg p-4 mb-6">
              <Text className="text-lg font-bold text-foreground mb-3">Add New Item</Text>

              <TextInput
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground mb-3"
                placeholder="Item name"
                placeholderTextColor="#7A7A7A"
                value={newItem.name}
                onChangeText={name => setNewItem({ ...newItem, name })}
              />

              <TextInput
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground mb-3"
                placeholder="Price"
                placeholderTextColor="#7A7A7A"
                value={newItem.price}
                onChangeText={price => setNewItem({ ...newItem, price })}
                keyboardType="decimal-pad"
              />

              <TouchableOpacity
                className="w-full bg-primary rounded-lg py-3 items-center"
                onPress={handleAddItem}
              >
                <Text className="text-white font-bold">Add Item</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Menu Items List */}
          <View>
            <Text className="text-lg font-bold text-foreground mb-3">
              Items ({filteredItems.length})
            </Text>
            {filteredItems.length > 0 ? (
              filteredItems.map(item => (
                <View
                  key={item.id}
                  className="bg-surface rounded-lg p-4 mb-3 border border-border flex-row items-center justify-between"
                >
                  <View className="flex-1">
                    <Text className="text-base font-bold text-foreground">{item.name}</Text>
                    <Text className="text-sm text-muted">₹{item.price}</Text>
                    <View className="flex-row items-center gap-2 mt-2">
                      <TouchableOpacity
                        className={`px-3 py-1 rounded-full ${
                          item.available
                            ? 'bg-success/20'
                            : 'bg-error/20'
                        }`}
                        onPress={() => handleToggleAvailability(item.id)}
                      >
                        <Text className={`text-xs font-semibold ${
                          item.available ? 'text-success' : 'text-error'
                        }`}>
                          {item.available ? 'Available' : 'Out of Stock'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <TouchableOpacity
                    className="bg-error/20 px-3 py-2 rounded-lg"
                    onPress={() => handleDeleteItem(item.id)}
                  >
                    <Text className="text-error font-bold text-sm">Delete</Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <View className="items-center py-8">
                <Text className="text-muted text-base">No items found</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
