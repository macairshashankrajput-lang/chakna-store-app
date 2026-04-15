import menuJson from '@/menu.json';

export type RawMenuItem = {
    id: string;
    name: string;
    type: 'veg' | 'non-veg' | string;
    price: number;
    portion: string;
    ingredients: string[];
};

export interface MenuCategory {
    category: string;
    items: RawMenuItem[];
}

export interface MenuItem extends RawMenuItem {
    category: string;
    description: string;
    vegetarian: boolean;
    available?: boolean;
}

const rawCategories = (menuJson.menu ?? []) as MenuCategory[];

export const menuCatalog: MenuCategory[] = rawCategories;

export const menuItems: MenuItem[] = rawCategories.flatMap((category) =>
    category.items.map((item) => ({
        ...item,
        category: category.category,
        description: `${item.portion} • ${item.ingredients.join(', ')}`,
        vegetarian: item.type === 'veg',
    })),
);

export const getMenuItems = () => [...menuItems];

export const getMenuItem = (id: string) => menuItems.find((item) => item.id === id);

export const getMenuCategories = () => ['All', ...new Set(menuItems.map((item) => item.category))];
