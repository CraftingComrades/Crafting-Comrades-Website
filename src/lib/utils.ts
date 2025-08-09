import PocketBase from 'pocketbase';
import type { TypedPocketBase } from './types';
export const pb = new PocketBase('https://db.craftingcomrades.net') as TypedPocketBase;
