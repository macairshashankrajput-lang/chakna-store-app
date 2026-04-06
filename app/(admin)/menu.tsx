/**
 * Admin Menu Management Screen
 * Full CRUD for products/menu items
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, Switch, FlatList } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { Product } from '@/shared/types';

const mockMenuItems: Product[] = [
  {
    id: '1',
    name: 'Masala Peanuts',
    description: 'Spicy roasted peanuts',
    price: 49,
    imageUrl: '',
    category: 'snacks',
    available: true,
    vendorId: 'vendor1',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Veg Samosa',
    description: 'Crispy samosas',
    price: 35,
    imageUrl: '',
    category: 'starters',
    available: true,
    vendorId: 'vendor1',
    createdAt: new Date().toISOString(),
  },
  // TODO: Load from tRPC.products.list()
];

const categories = ['snacks', 'starters', 'non-veg', 'vegetarian'];

interface FormData {
  name: string;
  description: string;
  price: string;
  category: string;
  imageUrl: string;
}

export default function AdminMenuScreen() {
  const [menuItems, setMenuItems] = useState(mockMenuItems);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>({
    name: '',
    description: '',
    price: '',
    category: 'snacks',
    imageUrl: '',
  });

  const saveItem = () => {
    const priceNum = parseFloat(form.price);
    if (!form.name || isNaN(priceNum)) {
      Alert.alert('Error', 'Please fill name and price');
      return;
    }

    const newItem: Product = {
      id: editingId || Date.now().toString(),
      name: form.name,
      description: form.description,
      price: priceNum,
      imageUrl: form.imageUrl || '',
      category: form.category,
      available: true, // default
      vendorId: 'vendor1',
      createdAt: new Date().toISOString(),
    };

    if (editingId) {
      setMenuItems(menuItems.map(item => item.id === editingId ? newItem : item));
      setEditingId(null);
    } else {
      setMenuItems([newItem, ...menuItems]);
    }

    // TODO: tRPC.products.create/update(newItem)
    Alert.alert('Success', `Item ${editingId ? 'updated' : 'added'}!`);
    setForm({ name: '', description: '', price: '', category: 'snacks', imageUrl: '' });
    setShowForm(false);
  };

  const editItem = (item: Product) => {
    setForm({
      name: item.name,
      description: item.description || '',
      price: item.price.toString(),
      category: item.category,
      imageUrl: item.imageUrl,
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const deleteItem = (id: string) => {
    Alert.alert('Delete', 'Remove this item?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setMenuItems(menuItems.filter(item => item.id !== id));
          // TODO: tRPC.products.delete(id)
        }
      }
    ]);
  };

  const renderItem = ({ item }: { item: Product }) => (
    <View className="bg-surface p-4 rounded-2xl mb-4 border border-border">
      <View className="flex-row justify-between items-start mb-3">
        <Text className="text-xl font-bold text-foreground flex-1 mr-4">{item.name}</Text>
        <View className="flex-row gap-2">
          <TouchableOpacity
            className="bg-blue-500 px-4 py-2 rounded-lg"
            onPress={() => editItem(item)}
          >
            <Text className="text-white font-semibold">Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-red-500 px-4 py-2 rounded-lg"
            onPress={() => deleteItem(item.id)}
          >
            <Text className="text-white font-semibold">Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text className="text-muted mb-2">{item.description}</Text>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Text className="text-primary font-bold text-lg">₹{item.price}</Text>
          <Text className="ml-4 text-sm text-muted capitalize">{item.category}</Text>
        </View>
        <View className="flex-row items-center">
          <Switch value={item.available} />
          <Text className="ml-2 text-sm">Available</Text>
        </View>
      </View>
    </View>
  );

  return (
    <ScreenContainer className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="px-4 py-6">
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-3xl font-bold text-foreground">Menu Management</Text>
            <TouchableOpacity
              className="bg-primary rounded-lg px-6 py-3"
              onPress={() => {
                setEditingId(null);
                setForm({ name: '', description: '', price: '', category: 'snacks', imageUrl: '' });
                setShowForm(true);
              }}
            >
              <Text className="text-background font-bold text-lg">+ Add Item</Text>
            </TouchableOpacity>
          </View>

          {/* Items List */}
          <FlatList
            data={menuItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center py-12">
                <Text className="text-5xl mb-4">🍽️</Text>
                <Text className="text-lg font-semibold text-foreground mb-2">No Items</Text>
                <Text className="text-muted text-center">Add your first menu item</Text>
              </View>
            }
          />
        </View>
      </ScrollView>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <View className="absolute inset-0 bg-black/50 items-center justify-center p-4">
          <View className="bg-background rounded-3xl p-6 w-full max-w-md">
            <Text className="text-2xl font-bold text-foreground mb-6">
              {editingId ? 'Edit Item' : 'Add New Item'}
            </Text>

            <View className="space-y-4 mb-6">
              <TextInput
                className="bg-surface p-4 rounded-2xl border border-border"
                placeholder="Item Name *"
                value={form.name}
                onChangeText={(text) => setForm({ ...form, name: text })}
              />
              <TextInput
                className="bg-surface p-4 rounded-2xl border border-border"
                placeholder="Description"
                multiline
                numberOfLines={3}
                value={form.description}
                onChangeText={(text) => setForm({ ...form, description: text })}
              />
              <TextInput
                className="bg-surface p-4 rounded-2xl border border-border"
                placeholder="Price (₹)"
                keyboardType="decimal-pad"
                value={form.price}
                onChangeText={(text) => setForm({ ...form, price: text })}
              />
              <View>
                <Text className="text-foreground font-semibold mb-2">Category</Text>
                <View className="flex-row gap-2 flex-wrap">
                  {categories.map(cat => (
                    <TouchableOpacity
                      key={cat}
                      className={`px-4 py-2 rounded-xl border ${form.category === cat ? 'bg-primary border-primary' : 'bg-surface border-border'
                        }`}
                      onPress={() => setForm({ ...form, category: cat })}
                    >
                      <Text className={`font-semibold ${form.category === cat ? 'text-background' : 'text-foreground'
                        }`}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <TextInput
                className="bg-surface p-4 rounded-2xl border border-border"
                placeholder="Image URL (optional)"
                value={form.imageUrl}
                onChangeText={(text) => setForm({ ...form, imageUrl: text })}
              />
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 bg-muted py-4 rounded-2xl items-center border border-border"
                onPress={() => setShowForm(false)}
              >
                <Text className="font-bold text-foreground">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-primary py-4 rounded-2xl items-center"
                onPress={saveItem}
              >
                <Text className="font-bold text-background text-lg">{editingId ? 'Update' : 'Add'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </ScreenContainer>
  );
}

