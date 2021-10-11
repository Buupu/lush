export interface ProductModal {
  name: string;
  description: string;
  defaultVariant: {
    name: string;
    id: string;
  };
  variants: VariantModal[];
  media: MediaModal[];
}

export interface CatalogProductModal {
  cursor: string;
  node: {
    id: string;
    name: string;
    pricing: {
      priceRange: {
        start: PriceModal;
      };
    };
    thumbnail: MediaModal;
  };
}

export interface VariantModal {
  name: string;
  id: string;
  pricing: {
    price: PriceModal;
  };
}

export interface CategoryModal {
  node: { name: string; id: string };
}

export interface PriceModal {
  gross: {
    amount: number;
    currency: string;
  };
}

export interface MediaModal {
  id?: string;
  url: string;
  alt: string;
}
