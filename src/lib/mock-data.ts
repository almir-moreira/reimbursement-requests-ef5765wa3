export type ItemCondition = 'UNC' | 'AU' | 'XF' | 'VF' | 'F' | 'VG'
export type ItemCategory = 'Cédulas' | 'Moedas' | 'Medalhas' | 'Coleções'

export interface Product {
  id: string
  name: string
  shortName: string
  price: number
  oldPrice?: number
  category: ItemCategory
  origin: string
  year: number
  material: string
  condition: ItemCondition
  catalogNumber: string
  weight?: string
  description: string
  images: string[]
  stock: number
  isNew?: boolean
  isFeatured?: boolean
}

export const mockProducts: Product[] = [
  {
    id: 'p1',
    name: '100 Cruzeiros 1981 - Juscelino Kubitschek - Flor de Estampa',
    shortName: '100 Cruzeiros 1981',
    price: 45.0,
    category: 'Cédulas',
    origin: 'Brasil',
    year: 1981,
    material: 'Papel',
    condition: 'UNC',
    catalogNumber: 'Pick 198',
    description:
      'Cédula de 100 Cruzeiros homenageando o ex-presidente Juscelino Kubitschek. Estado de conservação impecável, Flor de Estampa. Peça essencial para qualquer coleção de República.',
    images: [
      'https://img.usecurling.com/p/800/600?q=old%20banknote&color=green',
      'https://img.usecurling.com/p/800/600?q=banknote%20back&color=green',
    ],
    stock: 5,
    isFeatured: true,
  },
  {
    id: 'p2',
    name: 'Moeda 2000 Réis 1939 - Machado de Assis - Prata',
    shortName: '2000 Réis 1939 Prata',
    price: 180.0,
    oldPrice: 220.0,
    category: 'Moedas',
    origin: 'Brasil',
    year: 1939,
    material: 'Prata',
    condition: 'AU',
    catalogNumber: 'KM 548',
    weight: '8g',
    description:
      'Bela moeda de prata da série "Brasileiros Ilustres", homenageando Machado de Assis. Conservação Soberba (AU) com belo brilho original.',
    images: [
      'https://img.usecurling.com/p/800/600?q=silver%20coin&color=gray',
      'https://img.usecurling.com/p/800/600?q=silver%20coin%20back&color=gray',
    ],
    stock: 2,
    isNew: true,
    isFeatured: true,
  },
  {
    id: 'p3',
    name: '1 Dólar 1935 E - Silver Certificate - USA',
    shortName: '1 Dólar 1935 Silver Cert',
    price: 120.0,
    category: 'Cédulas',
    origin: 'Estados Unidos',
    year: 1935,
    material: 'Papel',
    condition: 'XF',
    catalogNumber: 'Pick 416',
    description:
      'Clássico Silver Certificate americano. Característico selo azul. Cédula que no passado garantia a conversibilidade em prata. Muito Bem Conservada.',
    images: ['https://img.usecurling.com/p/800/600?q=dollar%20bill&color=blue'],
    stock: 1,
  },
  {
    id: 'p4',
    name: 'Moeda 1 Florim 1860 - Império Austro-Húngaro',
    shortName: '1 Florim 1860 Áustria',
    price: 350.0,
    category: 'Moedas',
    origin: 'Europa',
    year: 1860,
    material: 'Prata',
    condition: 'VF',
    catalogNumber: 'KM 2219',
    weight: '12.3g',
    description:
      'Moeda histórica do Império Austro-Húngaro apresentando o busto de Franz Joseph I. Rica em detalhes e história europeia.',
    images: ['https://img.usecurling.com/p/800/600?q=antique%20coin&color=gray'],
    stock: 1,
  },
  {
    id: 'p5',
    name: 'Coleção Cédulas Plano Real (1994) - Série Incompleta',
    shortName: 'Lote Plano Real 1994',
    price: 280.0,
    category: 'Coleções',
    origin: 'Brasil',
    year: 1994,
    material: 'Papel',
    condition: 'AU',
    catalogNumber: 'Vários',
    description:
      'Lote contendo cédulas da primeira família do Plano Real (1, 5, 10, 50 Reais). Estado de conservação variando entre Soberba e Flor de Estampa.',
    images: ['https://img.usecurling.com/p/800/600?q=stack%20of%20bills'],
    stock: 3,
    isFeatured: true,
  },
  {
    id: 'p6',
    name: 'Moeda 50 Centavos 1970 - Níquel',
    shortName: '50 Centavos 1970 Níquel',
    price: 15.0,
    category: 'Moedas',
    origin: 'Brasil',
    year: 1970,
    material: 'Níquel',
    condition: 'XF',
    catalogNumber: 'KM 575',
    weight: '5.5g',
    description:
      'Moeda comum da ditadura militar brasileira. Desenho da esfinge da República. Excelente para iniciantes.',
    images: ['https://img.usecurling.com/p/800/600?q=nickel%20coin'],
    stock: 20,
    isNew: true,
  },
]

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}
