import { createContext } from 'react';
import type { ThemeContextType, CartContextType, TableContextType } from '../types';

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
export const CartContext = createContext<CartContextType | undefined>(undefined);
export const TableContext = createContext<TableContextType | undefined>(undefined);