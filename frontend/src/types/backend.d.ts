export interface IUserInfo {
    id?: number;
    avatar?: string;
    name?: string;
    email?: string;
}

export interface IProduct {
    id?: number;
    name?: string;
    price?: number;
    image?: string;
    category?: string;
    description?: string;
    rating?: number;
    stock?: number;
    reviews?: number;
}

interface ICartItem {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  quantity: number;
  category?: string;
  stock?: number;

}