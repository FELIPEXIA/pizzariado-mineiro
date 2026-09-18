import { useMemo, useState } from "react";
import imgCalabresa from "./assets/pizzas/calabresa.jpg";
import imgMussarela from "./assets/pizzas/mussarela.jpg";
import imgFrangoCatupiry from "./assets/pizzas/frango-catupiry.jpg";
import imgPortuguesa from "./assets/pizzas/portuguesa.jpg";
import imgMineira from "./assets/pizzas/mineira.jpg";
import imgBacon from "./assets/pizzas/bacon.jpg";
import imgQuatroQueijos from "./assets/pizzas/quatro-queijos.jpg";
import imgPepperoni from "./assets/pizzas/pepperoni.jpg";
import imgHeroPizza from "./assets/pizzas/hero-pizza.jpg";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Banknote,
  Bike,
  Check,
  ChevronDown,
  Clock3,
  CreditCard,
  FileText,
  MapPin,
  Minus,
  Pizza,
  Plus,
  QrCode,
  ShoppingBag,
  Store,
  Trash2,
  X,
} from "lucide-react";

type Size = "Broto" | "Média" | "Grande";
type Crust = "Tradicional" | "Catupiry" | "Cheddar" | "Chocolate";

type PizzaFlavor = {
  id: string;
  name: string;
  description: string;
  prices: Record<Size, number>;
  popular?: boolean;
  imageUrl: string;
};

type Beverage = {
  id: string;
  name: string;
  volume: string;
  price: number;
  description: string;
  tag?: string;
  theme: {
    emoji: string;
    iconBg: string;
    border: string;
    badge: string;
  };
};

type CartItem = {
  id: string;
  name: string;
  subtitle: string;
  category: "pizza" | "bebida";
  quantity: number;
  unitPrice: number;
};

const SIZES: { label: Size; multiplier: number }[] = [
  { label: "Broto", multiplier: 0.72 },
  { label: "Média", multiplier: 0.88 },
  { label: "Grande", multiplier: 1 },
];

const CRUSTS: { label: Crust; extra: number }[] = [
  { label: "Tradicional", extra: 0 },
  { label: "Catupiry", extra: 9 },
  { label: "Cheddar", extra: 9 },
  { label: "Chocolate", extra: 12 },
];

const FLAVORS: PizzaFlavor[] = [
  {
    id: "calabresa",
    name: "Calabresa",
    description: "Molho de tomate, muçarela, calabresa fatiada, cebola e orégano.",
    prices: { Broto: 27, Média: 36, Grande: 41 },
    popular: true,
    imageUrl: imgCalabresa,
  },
  {
    id: "mussarela",
    name: "Muçarela",
    description: "Molho de tomate, muçarela especial, tomate, azeitona e orégano.",
    prices: { Broto: 27, Média: 36, Grande: 41 },
    imageUrl: imgMussarela,
  },
  {
    id: "frango-catupiry",
    name: "Frango com Catupiry",
    description: "Molho de tomate, frango desfiado, catupiry, milho e orégano.",
    prices: { Broto: 31, Média: 41, Grande: 47 },
    popular: true,
    imageUrl: imgFrangoCatupiry,
  },
  {
    id: "portuguesa",
    name: "Portuguesa",
    description: "Muçarela, presunto, ovo, cebola, pimentão, ervilha, milho e azeitona.",
    prices: { Broto: 31, Média: 41, Grande: 47 },
    imageUrl: imgPortuguesa,
  },
  {
    id: "mineira",
    name: "Mineira",
    description: "Muçarela, carne-seca, cebola, tomate, milho e um toque de orégano.",
    prices: { Broto: 34, Média: 45, Grande: 52 },
    popular: true,
    imageUrl: imgMineira,
  },
  {
    id: "bacon",
    name: "Bacon",
    description: "Molho de tomate, muçarela, bacon crocante, milho e orégano.",
    prices: { Broto: 31, Média: 41, Grande: 47 },
    imageUrl: imgBacon,
  },
  {
    id: "quatro-queijos",
    name: "4 Queijos",
    description: "Muçarela, provolone, parmesão e catupiry sobre molho artesanal.",
    prices: { Broto: 34, Média: 45, Grande: 52 },
    imageUrl: imgQuatroQueijos,
  },
  {
    id: "pepperoni",
    name: "Pepperoni",
    description: "Molho de tomate, muçarela, pepperoni e orégano.",
    prices: { Broto: 34, Média: 45, Grande: 52 },
    popular: true,
    imageUrl: imgPepperoni,
  },
  {
    id: "chocolate",
    name: "Chocolate",
    description: "Chocolate cremoso, granulado e cobertura especial.",
    prices: { Broto: 30, Média: 39, Grande: 45 },
    imageUrl:
      "https://static.itdg.com.br/images/640-400/ab93c09d82d7004b7c440fe5d3d734ad/131483-original.jpg",
  },
];

const BEVERAGES: Beverage[] = [
  {
    id: "coca-15",
    name: "Coca-Cola Original",
    volume: "1,5L",
    price: 10.0,
    description: "Sabor inconfundível e refrescante na medida certa para seu pedido.",
    theme: {
      emoji: "🥤",
      iconBg: "bg-red-950/60 text-red-500",
      border: "border-red-900/50",
      badge: "border-red-900/60 bg-red-950/40 text-red-400",
    },
  },
  {
    id: "coca-20",
    name: "Coca-Cola Original",
    volume: "2L",
    price: 12.0,
    description: "O tamanho perfeito de 2 Litros para dividir com a família toda.",
    tag: "Mais Pedida",
    theme: {
      emoji: "🥤",
      iconBg: "bg-red-950/60 text-red-500",
      border: "border-red-900/50",
      badge: "border-red-900/60 bg-red-950/40 text-red-400",
    },
  },
  {
    id: "coca-zero-15",
    name: "Coca-Cola Zero",
    volume: "1,5L",
    price: 10.0,
    description: "Todo o sabor inconfundível de Coca-Cola sem adição de açúcares.",
    tag: "Zero Açúcar",
    theme: {
      emoji: "🥤",
      iconBg: "bg-zinc-800 text-zinc-300",
      border: "border-zinc-700",
      badge: "border-zinc-700 bg-zinc-800 text-zinc-300",
    },
  },
  {
    id: "coca-zero-20",
    name: "Coca-Cola Zero",
    volume: "2L",
    price: 12.0,
    description: "Garrafa de 2 litros do clássico sem açúcar, extremamente gelada.",
    tag: "Zero Açúcar",
    theme: {
      emoji: "🥤",
      iconBg: "bg-zinc-800 text-zinc-300",
      border: "border-zinc-700",
      badge: "border-zinc-700 bg-zinc-800 text-zinc-300",
    },
  },
  {
    id: "guarana-coroa-20",
    name: "Guaraná Coroa",
    volume: "2L",
    price: 8.5,
    description: "O autêntico guaraná capixaba, muito refrescante e favorito da casa.",
    tag: "Destaque da Casa",
    theme: {
      emoji: "👑",
      iconBg: "bg-emerald-950/60 text-emerald-400",
      border: "border-emerald-800/60",
      badge: "border-emerald-700/60 bg-emerald-950/50 text-emerald-300",
    },
  },
  {
    id: "coroa-laranja-20",
    name: "Coroa Laranja",
    volume: "2L",
    price: 8.0,
    description: "Refrigerante Coroa sabor laranja, bem gelado e cítrico.",
    theme: {
      emoji: "🍊",
      iconBg: "bg-orange-950/60 text-orange-400",
      border: "border-orange-800/60",
      badge: "border-orange-800/60 bg-orange-950/40 text-orange-400",
    },
  },
  {
    id: "coroa-uva-20",
    name: "Coroa Uva",
    volume: "2L",
    price: 8.0,
    description: "Sabor doce e marcante de uva que harmoniza muito bem com pizza.",
    theme: {
      emoji: "🍇",
      iconBg: "bg-purple-950/60 text-purple-400",
      border: "border-purple-800/60",
      badge: "border-purple-800/60 bg-purple-950/40 text-purple-400",
    },
  },
  {
    id: "coroa-limao-20",
    name: "Coroa Limão",
    volume: "2L",
    price: 8.0,
    description: "Refrescância pura do limão para acompanhar e quebrar o paladar.",
    theme: {
      emoji: "🍋",
      iconBg: "bg-lime-950/60 text-lime-400",
      border: "border-lime-800/60",
      badge: "border-lime-800/60 bg-lime-950/40 text-lime-400",
    },
  },
  {
    id: "coroa-tangerina-20",
    name: "Coroa Tangerina",
    volume: "2L",
    price: 8.0,
    description: "O sabor cítrico e frutado especial de tangerina que todo mundo ama.",
    theme: {
      emoji: "🍊",
      iconBg: "bg-amber-950/60 text-amber-400",
      border: "border-amber-800/60",
      badge: "border-amber-800/60 bg-amber-950/40 text-amber-400",
    },
  },
  {
    id: "coroa-cola-20",
    name: "Coroa Cola",
    volume: "2L",
    price: 7.5,
    description: "Sabor cola refrescante com o melhor preço para sua refeição.",
    tag: "Super Preço",
    theme: {
      emoji: "🥤",
      iconBg: "bg-rose-950/60 text-rose-400",
      border: "border-rose-800/60",
      badge: "border-rose-800/60 bg-rose-950/40 text-rose-400",
    },
  },
];

const formatBRL = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function getWhatsAppNumber() {
  return (import.meta.env.VITE_WHATSAPP_NUMBER || "5527988721801").replace(/\D/g, "");
}

function isOpenNow(date = new Date()) {
  const day = date.getDay();
  const hour = date.getHours();
  const minutes = date.getMinutes();
  const currentMinutes = hour * 60 + minutes;
  const opens = 18 * 60;
  const closes = 23 * 60;
  const isBusinessDay = (day >= 2 && day <= 6) || day === 0;
  return isBusinessDay && currentMinutes >= opens && currentMinutes < closes;
}

function App() {
  const [selectedFlavor, setSelectedFlavor] = useState<PizzaFlavor | null>(null);
  const [selectedSize, setSelectedSize] = useState<Size>("Grande");
  const [selectedCrust, setSelectedCrust] = useState<Crust>("Tradicional");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartStep, setCartStep] = useState<1 | 2>(1);
  const [category, setCategory] = useState<"Todas" | "Salgadas" | "Doces">("Todas");
  const [customerName, setCustomerName] = useState("");
  const [deliveryType, setDeliveryType] = useState<"Retirada" | "Entrega">("Retirada");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [complement, setComplement] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "cartao" | "dinheiro">("pix");
  const [changeFor, setChangeFor] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    street?: string;
    number?: string;
    neighborhood?: string;
  }>({});

  const open = isOpenNow();

  const visibleFlavors = useMemo(() => {
    if (category === "Doces") return FLAVORS.filter((item) => item.id === "chocolate");
    if (category === "Salgadas") return FLAVORS.filter((item) => item.id !== "chocolate");
    return FLAVORS;
  }, [category]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const deliveryFee = deliveryType === "Entrega" && cart.length > 0 ? 5 : 0;
  const total = subtotal + deliveryFee;

  function openCustomizer(flavor: PizzaFlavor) {
    setSelectedFlavor(flavor);
    setSelectedSize("Grande");
    setSelectedCrust("Tradicional");
  }

  function addToCart() {
    if (!selectedFlavor) return;

    const crustExtra = CRUSTS.find((item) => item.label === selectedCrust)?.extra ?? 0;
    const unitPrice = selectedFlavor.prices[selectedSize] + crustExtra;
    const itemId = `pizza-${selectedFlavor.id}-${selectedSize}-${selectedCrust}`;

    setCart((current) => {
      const existing = current.find((item) => item.id === itemId);
      if (existing) {
        return current.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...current,
        {
          id: itemId,
          name: selectedFlavor.name,
          subtitle: `Tamanho ${selectedSize} · Borda ${selectedCrust}`,
          category: "pizza",
          quantity: 1,
          unitPrice,
        },
      ];
    });

    setSelectedFlavor(null);
    setCartStep(1);
    setCartOpen(true);
  }

  function addBeverageToCart(beverage: Beverage) {
    const itemId = `bev-${beverage.id}`;

    setCart((current) => {
      const existing = current.find((item) => item.id === itemId);
      if (existing) {
        return current.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...current,
        {
          id: itemId,
          name: beverage.name,
          subtitle: `Garrafa ${beverage.volume}`,
          category: "bebida",
          quantity: 1,
          unitPrice: beverage.price,
        },
      ];
    });

    setCartStep(1);
    setCartOpen(true);
  }

  function updateQuantity(itemId: string, delta: number) {
    setCart((current) =>
      current
        .map((item) =>
          item.id === itemId
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function handleAdvanceToStep2() {
    if (!cart.length) return;
    setCartStep(2);
  }

  function checkoutWhatsApp() {
    if (!cart.length) return;

    const errors: {
      name?: string;
      street?: string;
      number?: string;
      neighborhood?: string;
    } = {};

    if (!customerName.trim()) {
      errors.name = "Informe seu nome";
    }

    if (deliveryType === "Entrega") {
      if (!street.trim()) {
        errors.street = "Informe a rua / avenida";
      }
      if (!number.trim()) {
        errors.number = "Informe o número";
      }
      if (!neighborhood.trim()) {
        errors.neighborhood = "Informe o bairro";
      }
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});

    const paymentLabel = {
      pix: "⚡ PIX",
      cartao: "💳 Cartão (levar maquininha)",
      dinheiro: changeFor.trim()
        ? `💵 Dinheiro (troco para ${changeFor.trim()})`
        : "💵 Dinheiro (sem troco)",
    }[paymentMethod];

    const lines = cart.map(
      (item) =>
        `• ${item.quantity}x ${item.name} (${item.subtitle}) — ${formatBRL(
          item.unitPrice * item.quantity
        )}`
    );

    const formattedAddress = [
      `${street.trim()}, nº ${number.trim()}`,
      `Bairro: ${neighborhood.trim()}`,
      complement.trim() ? `Ref: ${complement.trim()}` : "",
    ]
      .filter(Boolean)
      .join(" — ");

    const message = [
      "🍕 *NOVO PEDIDO — PIZZARIA DO MINEIRO*",
      "",
      `👤 *Cliente:* ${customerName.trim()}`,
      `📦 *Modalidade:* ${deliveryType === "Entrega" ? "🛵 Entrega a domicílio" : "🏬 Retirada no balcão"}`,
      ...(deliveryType === "Entrega" ? [`📍 *Endereço:* ${formattedAddress}`] : []),
      `💳 *Forma de pagamento:* ${paymentLabel}`,
      ...(orderNotes.trim() ? [`📝 *Observações:* ${orderNotes.trim()}`] : []),
      "",
      "*Itens do Pedido:*",
      ...lines,
      "",
      `💰 Subtotal: ${formatBRL(subtotal)}`,
      `🛵 Taxa de entrega: ${deliveryFee > 0 ? formatBRL(deliveryFee) : "Grátis (Retirada)"}`,
      `🔥 *TOTAL A PAGAR: ${formatBRL(total)}*`,
      "",
      "Por favor, confirme se recebeu o pedido e qual a previsão de tempo! 🍕",
    ].join("\n");

    const url = `https://wa.me/${getWhatsAppNumber()}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="sticky top-0 z-30 border-b border-zinc-800/80 bg-zinc-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <a href="#" className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-full bg-red-600 shadow-lg shadow-red-950/40">
              <Pizza size={25} strokeWidth={2.5} />
            </div>
            <div>
              <p className="font-black leading-none tracking-tight">Pizzaria do Mineiro</p>
              <p className="mt-1 text-xs text-zinc-400">Sabor artesanal de verdade</p>
            </div>
          </a>

          <button
            onClick={() => {
              setCartStep(1);
              setCartOpen(true);
            }}
            className="relative flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-bold transition hover:border-red-500 hover:bg-zinc-800"
          >
            <ShoppingBag size={18} />
            <span className="hidden sm:inline">Meu pedido</span>
            {totalItems > 0 && (
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-red-600 px-1 text-[11px] font-black">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-4 pb-6 pt-8 sm:px-6 sm:pt-12">
          <div className="grid gap-5 lg:grid-cols-[1.6fr_.95fr]">
            <div className="relative overflow-hidden rounded-3xl border border-red-900/60 shadow-2xl shadow-red-950/30">
              {/* Full background pizza image */}
              <img
                src={imgHeroPizza}
                alt="Fundo Pizzaria do Mineiro"
                className="absolute inset-0 h-full w-full object-cover object-center"
              />

              {/* Dark layered gradient overlays for maximum text contrast */}
              <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/85 to-zinc-950/60" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/95 via-transparent to-red-950/30" />

              {/* Clean, legible content over dark background */}
              <div className="relative flex flex-col items-start justify-center p-6 sm:p-8 md:p-10 lg:p-11">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-black tracking-wide text-red-700 shadow-lg">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-red-600"></span>
                  </span>
                  OFERTA DA CASA
                </div>

                <h1 className="max-w-2xl text-2xl font-black uppercase leading-tight tracking-tight text-white drop-shadow-md sm:text-3xl md:text-4xl lg:text-[2.5rem]">
                  Compre uma Pizza Grande e ganhe{" "}
                  <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
                    Borda Recheada
                  </span>{" "}
                  +{" "}
                  <span className="bg-gradient-to-r from-emerald-300 to-green-400 bg-clip-text text-transparent">
                    Guaraná Coroa
                  </span>{" "}
                  grátis!
                </h1>

                <p className="mt-3.5 max-w-xl text-sm leading-relaxed text-zinc-200 drop-shadow sm:text-base">
                  Escolha seu sabor favorito, selecione a borda de Catupiry ou Cheddar e receba seu Guaraná 2L trincando de gelado direto no WhatsApp!
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-bold text-zinc-200">
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-red-800/60 bg-black/60 px-3 py-1.5 backdrop-blur-md">
                    🧀 Catupiry ou Cheddar
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-red-800/60 bg-black/60 px-3 py-1.5 backdrop-blur-md">
                    👑 Guaraná 2L Gelado
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-800/60 bg-black/60 px-3 py-1.5 text-amber-300 backdrop-blur-md">
                    ⭐ Oferta por tempo limitado
                  </span>
                </div>

                <div className="mt-7 flex w-full flex-wrap gap-3.5 sm:w-auto">
                  <a
                    href="#cardapio"
                    className="group inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-black text-red-900 shadow-xl shadow-black/40 transition hover:bg-red-50 hover:scale-[1.02] active:scale-[0.98] sm:flex-none"
                  >
                    <span>Ver pizzas</span>
                    <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
                  </a>
                  <a
                    href="#bebidas"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/20 bg-black/60 px-6 py-3.5 text-sm font-black text-white shadow-xl shadow-black/40 backdrop-blur-md transition hover:border-red-500 hover:bg-black/80 hover:scale-[1.02] active:scale-[0.98] sm:flex-none"
                  >
                    Ver bebidas 🥤
                  </a>
                </div>
              </div>
            </div>

            <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-b from-zinc-900/90 via-zinc-900/80 to-zinc-950/90 p-6 sm:p-7 shadow-2xl backdrop-blur-md">
              {/* Subtle ambient accent glow */}
              <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-red-600/10 blur-3xl" />

              {/* Top Row: Label & Status Badge */}
              <div className="flex items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.7)]" />
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">
                    Atendimento
                  </span>
                </div>
                <span
                  className={`status-pulse inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-black transition ${
                    open
                      ? "border-emerald-500/30 bg-emerald-950/80 text-emerald-400 shadow-sm shadow-emerald-950/50"
                      : "border-zinc-700/50 bg-zinc-800/80 text-zinc-400"
                  }`}
                >
                  <span className={`h-2 w-2 rounded-full ${open ? "bg-emerald-400 shadow-[0_0_6px_#34d399]" : "bg-zinc-500"}`} />
                  {open ? "Aberto" : "Fechado"}
                </span>
              </div>

              {/* Brand: Logo + Name + Slogan */}
              <div className="mt-5 flex items-center gap-3.5 border-b border-zinc-800/70 pb-5">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-red-600 text-white shadow-lg shadow-red-950/60 ring-2 ring-red-500/20">
                  <Pizza size={25} strokeWidth={2.4} />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-tight">
                    Pizzaria do Mineiro
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm font-medium text-zinc-400">
                    Sabor artesanal de verdade
                  </p>
                </div>
              </div>

              {/* Middle Section: Horário & Endereço with High Contrast & Generous Breathing Room */}
              <div className="my-auto flex flex-col gap-4 py-5">
                <div className="flex items-start gap-4 rounded-2xl border border-zinc-800/70 bg-zinc-950/40 p-4 transition hover:border-zinc-700/70">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-red-800/40 bg-red-950/60 text-red-400">
                    <Clock3 size={20} strokeWidth={2.2} />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-red-400">
                      Horário de funcionamento
                    </p>
                    <p className="mt-1 text-base font-bold text-white">
                      Terça a Domingo: <span className="font-extrabold text-zinc-200">18h às 23h</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-2xl border border-zinc-800/70 bg-zinc-950/40 p-4 transition hover:border-zinc-700/70">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-red-800/40 bg-red-950/60 text-red-400">
                    <MapPin size={20} strokeWidth={2.2} />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-red-400">
                      Endereço
                    </p>
                    <p className="mt-1 text-base font-bold text-white">
                      Nova Valverde, Rua Almir Cruz Amorim, Nº 1122
                    </p>
                    <p className="text-sm font-semibold text-zinc-400">
                      Cariacica - ES
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Footer: Service Badges to eliminate empty space */}
              <div className="border-t border-zinc-800/70 pt-4">
                <div className="flex items-center justify-between text-xs font-bold text-zinc-300">
                  <div className="flex items-center gap-2">
                    <div className="grid h-7 w-7 place-items-center rounded-lg bg-zinc-800/80 text-red-400">
                      <Bike size={16} />
                    </div>
                    <span>Delivery rápido</span>
                  </div>
                  <div className="h-4 w-px bg-zinc-800" />
                  <div className="flex items-center gap-2">
                    <div className="grid h-7 w-7 place-items-center rounded-lg bg-zinc-800/80 text-red-400">
                      <Store size={16} />
                    </div>
                    <span>Retirada no balcão</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="cardapio" className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <div className="flex flex-col gap-5 border-b border-zinc-800 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-red-500">Nosso cardápio</p>
              <h2 className="mt-1 text-3xl font-black tracking-tight">Sabores oficiais</h2>
              <p className="mt-2 text-sm text-zinc-500">Escolha seu sabor e personalize do seu jeito.</p>
            </div>

            <div className="flex w-full flex-wrap gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 p-1 sm:w-auto">
              {(["Todas", "Salgadas", "Doces"] as const).map((item) => (
                <button
                  key={item}
                  onClick={() => setCategory(item)}
                  className={`flex-1 rounded-lg px-4 py-2 text-sm font-bold transition sm:flex-none ${
                    category === item ? "bg-emerald-600 text-white shadow-sm" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {item}
                </button>
              ))}
              <a
                href="#bebidas"
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-sm font-bold text-amber-400 transition hover:bg-zinc-800 sm:flex-none"
              >
                <span>🥤</span> Bebidas
              </a>
            </div>
          </div>

          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visibleFlavors.map((flavor, index) => (
              <article
                key={flavor.id}
                className="animate-float-in group flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/70 transition hover:-translate-y-1 hover:border-red-900/60 hover:shadow-2xl hover:shadow-red-950/30"
                style={{ animationDelay: `${index * 45}ms` }}
              >
                {/* Image area */}
                <div className="relative h-44 w-full overflow-hidden bg-zinc-800">
                  <img
                    src={flavor.imageUrl}
                    alt={`Pizza ${flavor.name}`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Dark gradient overlay at bottom of image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 via-zinc-900/10 to-transparent" />
                  {/* Popular badge overlaid on image */}
                  {flavor.popular && (
                    <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full border border-red-800/80 bg-red-950/90 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-red-300 backdrop-blur-sm">
                      🔥 Mais pedido
                    </span>
                  )}
                </div>

                {/* Card body */}
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-xl font-black">{flavor.name}</h3>
                  <p className="mt-2 min-h-12 text-sm leading-5 text-zinc-400">{flavor.description}</p>

                  <div className="mt-5 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-600">Grande a partir de</p>
                      <p className="mt-1 text-xl font-black text-white">{formatBRL(flavor.prices.Grande)}</p>
                    </div>
                    <button
                      onClick={() => openCustomizer(flavor)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-sm font-black text-zinc-950 transition hover:bg-emerald-600 hover:text-white"
                    >
                      + Pedir
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* SEÇÃO DE BEBIDAS */}
        <section id="bebidas" className="mx-auto max-w-6xl border-t border-zinc-800/80 px-4 pb-24 pt-16 sm:px-6">
          <div className="flex flex-col gap-4 border-b border-zinc-800 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-black uppercase tracking-wider text-amber-400">
                <span>🥤</span> Bebidas Geladas
              </div>
              <h2 className="mt-2 text-3xl font-black tracking-tight">Refrigerantes & Bebidas</h2>
              <p className="mt-1 text-sm text-zinc-400">
                O acompanhamento gelado perfeito para saborear com sua pizza quentinha.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-400">
              <span className="h-2 w-2 rounded-full bg-green-500" /> 10 opções geladas prontas para entrega
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {BEVERAGES.map((beverage) => {
              const inCart = cart.find((item) => item.id === `bev-${beverage.id}`);
              const quantityInCart = inCart?.quantity ?? 0;

              return (
                <article
                  key={beverage.id}
                  className={`group relative flex flex-col justify-between rounded-2xl border bg-zinc-900/70 p-4.5 transition hover:-translate-y-0.5 hover:bg-zinc-900 ${
                    quantityInCart > 0
                      ? "border-green-800/80 bg-green-950/15 shadow-lg shadow-green-950/20"
                      : "border-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div
                        className={`grid h-12 w-12 place-items-center rounded-xl border ${beverage.theme.iconBg} ${beverage.theme.border}`}
                      >
                        <span className="text-2xl leading-none">{beverage.theme.emoji}</span>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="rounded-full border border-zinc-800 bg-zinc-950 px-2 py-0.5 text-[11px] font-black text-zinc-300">
                          {beverage.volume}
                        </span>
                        {beverage.tag && (
                          <span
                            className={`rounded-full border px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${beverage.theme.badge}`}
                          >
                            {beverage.tag}
                          </span>
                        )}
                      </div>
                    </div>

                    <h3 className="mt-3.5 text-base font-black text-white">{beverage.name}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-zinc-400 min-h-10">
                      {beverage.description}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-zinc-800/80 pt-3.5">
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                        Preço
                      </span>
                      <strong className="text-lg font-black text-white">
                        {formatBRL(beverage.price)}
                      </strong>
                    </div>

                    {quantityInCart > 0 ? (
                      <div className="flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-950 p-1">
                        <button
                          onClick={() => updateQuantity(`bev-${beverage.id}`, -1)}
                          className="grid h-7 w-7 place-items-center rounded-lg text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
                          aria-label={`Diminuir ${beverage.name}`}
                          title="Diminuir"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-5 text-center text-xs font-black text-green-400">
                          {quantityInCart}
                        </span>
                        <button
                          onClick={() => updateQuantity(`bev-${beverage.id}`, 1)}
                          className="grid h-7 w-7 place-items-center rounded-lg text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
                          aria-label={`Aumentar ${beverage.name}`}
                          title="Aumentar"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addBeverageToCart(beverage)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-xs font-black text-zinc-950 shadow-sm transition hover:bg-emerald-600 hover:text-white active:scale-95"
                      >
                        <Plus size={14} strokeWidth={3} />
                        Adicionar
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>

      {selectedFlavor && (
        <div className="fixed inset-0 z-50 grid place-items-end bg-black/75 p-0 backdrop-blur-sm sm:place-items-center sm:p-4">
          <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-zinc-800 bg-zinc-950 shadow-2xl sm:rounded-3xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-800 bg-zinc-950/95 px-5 py-4 backdrop-blur">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-500">Personalizar</p>
                <h2 className="text-xl font-black">{selectedFlavor.name}</h2>
              </div>
              <button
                onClick={() => setSelectedFlavor(null)}
                className="rounded-full bg-zinc-900 p-2 text-zinc-400 hover:text-white"
                aria-label="Fechar personalização"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-7 p-5">
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-black">1. Escolha o tamanho</h3>
                  <span className="text-xs text-zinc-500">Obrigatório</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {SIZES.map((size) => (
                    <button
                      key={size.label}
                      onClick={() => setSelectedSize(size.label)}
                      className={`rounded-xl border p-3 text-left transition ${
                        selectedSize === size.label
                          ? "border-emerald-500 bg-emerald-950/30 text-white shadow-sm shadow-emerald-950/30"
                          : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold">{size.label}</span>
                        {selectedSize === size.label && <Check size={16} className="text-emerald-400" />}
                      </div>
                      <span className="mt-1 block text-xs text-zinc-500">
                        {formatBRL(selectedFlavor.prices[size.label])}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-black">2. Escolha a borda</h3>
                  <span className="text-xs text-zinc-500">Opcional</span>
                </div>
                <div className="space-y-2">
                  {CRUSTS.map((crust) => (
                    <button
                      key={crust.label}
                      onClick={() => setSelectedCrust(crust.label)}
                      className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition ${
                        selectedCrust === crust.label
                          ? "border-emerald-500 bg-emerald-950/30 text-white shadow-sm shadow-emerald-950/30"
                          : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                      }`}
                    >
                      <span className="font-bold">{crust.label}</span>
                      <span className="flex items-center gap-2 text-sm text-zinc-400">
                        {crust.extra === 0 ? "Grátis" : `+ ${formatBRL(crust.extra)}`}
                        {selectedCrust === crust.label && <Check size={16} className="text-emerald-400" />}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-400">Total do item</span>
                  <strong className="text-2xl font-black">
                    {formatBRL(
                      selectedFlavor.prices[selectedSize] +
                        (CRUSTS.find((item) => item.label === selectedCrust)?.extra ?? 0)
                    )}
                  </strong>
                </div>
              </div>

              <button
                onClick={addToCart}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 font-black text-white shadow-lg shadow-emerald-950/40 transition hover:bg-emerald-500 active:scale-[0.99]"
              >
                <ShoppingBag size={18} />
                Adicionar ao pedido
              </button>
            </div>
          </div>
        </div>
      )}

      {cartOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm">
          <div className="ml-auto flex h-full w-full max-w-xl flex-col border-l border-zinc-800 bg-zinc-950 shadow-2xl">
            {/* Cabeçalho do Drawer */}
            <div className="border-b border-zinc-800 bg-zinc-950 px-5 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {cartStep === 2 && cart.length > 0 && (
                    <button
                      onClick={() => setCartStep(1)}
                      className="grid h-9 w-9 place-items-center rounded-full bg-zinc-900 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
                      aria-label="Voltar para os itens"
                      title="Voltar para os itens"
                    >
                      <ArrowLeft size={18} />
                    </button>
                  )}
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-wider text-emerald-500">
                      {cart.length === 0
                        ? "Seu pedido"
                        : cartStep === 1
                        ? "Etapa 1 de 2 • Itens do Pedido"
                        : "Etapa 2 de 2 • Entrega e Pagamento"}
                    </p>
                    <h2 className="text-lg font-black sm:text-xl">
                      {cart.length === 0
                        ? "Carrinho vazio"
                        : cartStep === 1
                        ? "Revise seu pedido"
                        : "Identificação e entrega"}
                    </h2>
                  </div>
                </div>

                <button
                  onClick={() => setCartOpen(false)}
                  className="grid h-9 w-9 place-items-center rounded-full bg-zinc-900 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
                  aria-label="Fechar carrinho"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Barra de Progresso Visual */}
              {cart.length > 0 && (
                <div className="mt-3.5 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCartStep(1)}
                    className="group flex flex-1 items-center gap-2 text-left"
                    title="Etapa 1: Itens"
                  >
                    <div
                      className={`h-1.5 flex-1 rounded-full transition-all ${
                        cartStep === 1 ? "bg-emerald-500" : "bg-emerald-500"
                      }`}
                    />
                  </button>
                  <button
                    type="button"
                    onClick={handleAdvanceToStep2}
                    className="group flex flex-1 items-center gap-2 text-left"
                    title="Etapa 2: Entrega e Pagamento"
                  >
                    <div
                      className={`h-1.5 flex-1 rounded-full transition-all ${
                        cartStep === 2 ? "bg-emerald-500" : "bg-zinc-800"
                      }`}
                    />
                  </button>
                </div>
              )}
            </div>

            {/* Conteúdo Dinâmico por Etapa */}
            {cart.length === 0 ? (
              <div className="flex flex-1 items-center justify-center p-5 text-center">
                <div>
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-red-950 text-red-500">
                    <ShoppingBag size={28} />
                  </div>
                  <h3 className="mt-4 text-lg font-black">Seu pedido está vazio</h3>
                  <p className="mt-1 text-sm text-zinc-500">Escolha uma pizza no cardápio para começar.</p>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="mt-5 rounded-xl bg-red-600 px-5 py-3 text-sm font-black text-white transition hover:bg-red-500"
                  >
                    Ver cardápio
                  </button>
                </div>
              </div>
            ) : cartStep === 1 ? (
              /* ETAPA 1: REVISÃO DOS ITENS */
              <div className="flex flex-1 flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>
                      {totalItems} {totalItems === 1 ? "item adicionado" : "itens adicionados"}
                    </span>
                    <button
                      onClick={() => setCart([])}
                      className="text-[11px] text-zinc-500 transition hover:text-red-400"
                    >
                      Esvaziar carrinho
                    </button>
                  </div>

                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-4 transition"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`rounded-md px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                                  item.category === "bebida"
                                    ? "border border-amber-500/30 bg-amber-500/10 text-amber-400"
                                    : "border border-red-500/30 bg-red-500/10 text-red-400"
                                }`}
                              >
                                {item.category === "bebida" ? "Bebida" : "Pizza"}
                              </span>
                              <h3 className="text-base font-black text-white">{item.name}</h3>
                            </div>
                            <p className="mt-1 text-xs text-zinc-400">
                              {item.subtitle}
                            </p>
                          </div>
                          <button
                            onClick={() => updateQuantity(item.id, -item.quantity)}
                            className="rounded-lg p-1.5 text-zinc-500 transition hover:bg-red-950/40 hover:text-red-400"
                            aria-label={`Remover ${item.name}`}
                            title="Remover item"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-950 p-1">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="grid h-7 w-7 place-items-center rounded-lg text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
                              aria-label="Diminuir quantidade"
                            >
                              <Minus size={13} />
                            </button>
                            <span className="w-6 text-center text-sm font-black">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="grid h-7 w-7 place-items-center rounded-lg text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
                              aria-label="Aumentar quantidade"
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                          <div className="text-right">
                            <span className="block text-xs text-zinc-500">Subtotal</span>
                            <strong className="text-base text-zinc-100">
                              {formatBRL(item.unitPrice * item.quantity)}
                            </strong>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Observações da cozinha */}
                  <div className="pt-2">
                    <label className="block rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-4">
                      <div className="mb-2 flex items-center gap-2 text-xs font-bold text-zinc-300">
                        <FileText size={14} className="text-zinc-400" />
                        Observações para a cozinha (opcional)
                      </div>
                      <textarea
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                        placeholder="Ex: Tirar cebola, massa bem crocante, sachês de maionese..."
                        rows={2}
                        className="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-xs text-zinc-200 placeholder:text-zinc-600 outline-none transition focus:border-zinc-500"
                      />
                    </label>
                  </div>
                </div>

                {/* Rodapé Fixo Passo 1 */}
                <div className="border-t border-zinc-800 bg-zinc-950/95 p-5 backdrop-blur">
                  <div className="mb-3.5 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-medium text-zinc-400">Subtotal dos itens</span>
                      <p className="text-2xl font-black text-white">{formatBRL(subtotal)}</p>
                    </div>
                    <span className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-[11px] text-zinc-400">
                      Entrega no próximo passo
                    </span>
                  </div>

                  <button
                    onClick={handleAdvanceToStep2}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-sm font-black text-white shadow-lg shadow-emerald-950/50 transition hover:bg-emerald-500 active:scale-[0.99]"
                  >
                    Continuar para entrega <ArrowRight size={17} />
                  </button>

                  <button
                    onClick={() => setCartOpen(false)}
                    className="mt-2.5 w-full py-1 text-center text-xs font-bold text-zinc-400 transition hover:text-zinc-200"
                  >
                    + Escolher mais itens no cardápio
                  </button>
                </div>
              </div>
            ) : (
              /* ETAPA 2: IDENTIFICAÇÃO, ENTREGA E PAGAMENTO */
              <div className="flex flex-1 flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto p-5 space-y-5">
                  {/* Seção 1: Identificação */}
                  <div>
                    <label className="block">
                      <div className="mb-1.5 flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                          Seu nome <span className="text-red-500">*</span>
                        </span>
                        {formErrors.name && (
                          <span className="flex items-center gap-1 text-xs font-semibold text-red-400">
                            <AlertCircle size={12} /> {formErrors.name}
                          </span>
                        )}
                      </div>
                      <input
                        value={customerName}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCustomerName(val);
                          if (formErrors.name) setFormErrors((prev) => ({ ...prev, name: undefined }));
                        }}
                        placeholder="Como podemos te chamar?"
                        className={`w-full rounded-xl border bg-zinc-900 px-4 py-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 ${
                          formErrors.name
                            ? "border-red-500 bg-red-950/10 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                            : customerName.trim()
                            ? "border-emerald-700/60 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30"
                            : "border-zinc-800 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-600"
                        }`}
                      />
                    </label>
                  </div>

                  {/* Seção 2: Modalidade de Recebimento */}
                  <div>
                    <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Como deseja receber?
                    </span>
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => {
                          setDeliveryType("Retirada");
                          setFormErrors((prev) => ({
                            ...prev,
                            street: undefined,
                            number: undefined,
                            neighborhood: undefined,
                          }));
                        }}
                        className={`flex flex-col items-start rounded-2xl border p-3.5 text-left transition ${
                          deliveryType === "Retirada"
                            ? "border-emerald-500 bg-emerald-950/30 text-white shadow-sm shadow-emerald-950/40"
                            : "border-zinc-800 bg-zinc-900/80 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                        }`}
                      >
                        <div className="flex w-full items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Store
                              size={18}
                              className={deliveryType === "Retirada" ? "text-emerald-400" : "text-zinc-500"}
                            />
                            <span className="text-sm font-bold">Retirada</span>
                          </div>
                          {deliveryType === "Retirada" && (
                            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-zinc-950">
                              <Check size={11} strokeWidth={3} />
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-[11px] text-zinc-400">Balcão da pizzaria (Grátis)</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeliveryType("Entrega")}
                        className={`flex flex-col items-start rounded-2xl border p-3.5 text-left transition ${
                          deliveryType === "Entrega"
                            ? "border-emerald-500 bg-emerald-950/30 text-white shadow-sm shadow-emerald-950/40"
                            : "border-zinc-800 bg-zinc-900/80 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                        }`}
                      >
                        <div className="flex w-full items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Bike
                              size={18}
                              className={deliveryType === "Entrega" ? "text-emerald-400" : "text-zinc-500"}
                            />
                            <span className="text-sm font-bold">Entrega</span>
                          </div>
                          {deliveryType === "Entrega" && (
                            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-zinc-950">
                              <Check size={11} strokeWidth={3} />
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-[11px] text-zinc-400">Receba em casa (+R$ 5,00)</p>
                      </button>
                    </div>
                  </div>

                  {/* Seção 3: Endereço de Entrega Estruturado */}
                  {deliveryType === "Entrega" && (
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-3.5">
                      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5">
                        <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-300">
                          <MapPin size={14} className="text-red-500" /> Endereço de entrega{" "}
                          <span className="text-red-500">*</span>
                        </span>
                        <span className="text-[11px] font-medium text-zinc-500">Dados da entrega</span>
                      </div>

                      {/* Linha 1: Rua / Avenida (flexível) e Número (fixo) */}
                      <div className="grid grid-cols-[1fr_105px] gap-2.5">
                        <div className="min-w-0">
                          <label className="mb-1 block text-xs font-bold text-zinc-400">
                            Rua / Avenida <span className="text-red-500">*</span>
                          </label>
                          <input
                            value={street}
                            onChange={(e) => {
                              const val = e.target.value;
                              setStreet(val);
                              if (formErrors.street)
                                setFormErrors((prev) => ({ ...prev, street: undefined }));
                            }}
                            placeholder="Ex: Rua Almir Cruz"
                            className={`w-full rounded-xl border bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 ${
                              formErrors.street
                                ? "border-red-500 bg-red-950/10 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                : street.trim()
                                ? "border-emerald-700/60 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30"
                                : "border-zinc-800 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-600"
                            }`}
                          />
                          {formErrors.street && (
                            <span className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-red-400">
                              <AlertCircle size={11} /> {formErrors.street}
                            </span>
                          )}
                        </div>

                        <div className="min-w-0">
                          <label className="mb-1 block text-xs font-bold text-zinc-400">
                            Número <span className="text-red-500">*</span>
                          </label>
                          <input
                            value={number}
                            onChange={(e) => {
                              const val = e.target.value;
                              setNumber(val);
                              if (formErrors.number)
                                setFormErrors((prev) => ({ ...prev, number: undefined }));
                            }}
                            placeholder="Ex: 150"
                            className={`w-full rounded-xl border bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 ${
                              formErrors.number
                                ? "border-red-500 bg-red-950/10 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                : number.trim()
                                ? "border-emerald-700/60 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30"
                                : "border-zinc-800 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-600"
                            }`}
                          />
                          {formErrors.number && (
                            <span className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-red-400">
                              <AlertCircle size={11} /> {formErrors.number}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Linha 2: Bairro */}
                      <div>
                        <label className="mb-1 block text-xs font-bold text-zinc-400">
                          Bairro <span className="text-red-500">*</span>
                        </label>
                        <input
                          value={neighborhood}
                          onChange={(e) => {
                            const val = e.target.value;
                            setNeighborhood(val);
                            if (formErrors.neighborhood)
                              setFormErrors((prev) => ({ ...prev, neighborhood: undefined }));
                          }}
                          placeholder="Ex: Nova Valverde"
                          className={`w-full rounded-xl border bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 ${
                            formErrors.neighborhood
                              ? "border-red-500 bg-red-950/10 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                              : neighborhood.trim()
                              ? "border-emerald-700/60 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30"
                              : "border-zinc-800 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-600"
                          }`}
                        />
                        {formErrors.neighborhood && (
                          <span className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-red-400">
                            <AlertCircle size={11} /> {formErrors.neighborhood}
                          </span>
                        )}
                      </div>

                      {/* Linha 3: Complemento / Referência */}
                      <div>
                        <div className="mb-1 flex items-center justify-between">
                          <label className="text-xs font-bold text-zinc-400">
                            Complemento / Referência
                          </label>
                          <span className="text-[10px] text-zinc-500">Opcional</span>
                        </div>
                        <input
                          value={complement}
                          onChange={(e) => setComplement(e.target.value)}
                          placeholder="Ex: Apto 302, Bloco B, ao lado do mercado..."
                          className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-zinc-500"
                        />
                      </div>
                    </div>
                  )}

                  {/* Seção 4: Forma de Pagamento */}
                  <div>
                    <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Forma de pagamento
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("pix")}
                        className={`flex flex-col items-center justify-center rounded-2xl border p-3 text-center transition ${
                          paymentMethod === "pix"
                            ? "border-emerald-500/80 bg-emerald-950/25 text-white shadow-sm shadow-emerald-950/30"
                            : "border-zinc-800 bg-zinc-900/80 text-zinc-400 hover:border-zinc-700"
                        }`}
                      >
                        <QrCode
                          size={20}
                          className={paymentMethod === "pix" ? "text-emerald-400" : "text-zinc-500"}
                        />
                        <span className="mt-1 text-xs font-bold">PIX</span>
                        <span className="text-[10px] text-zinc-500">Mais rápido</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod("cartao")}
                        className={`flex flex-col items-center justify-center rounded-2xl border p-3 text-center transition ${
                          paymentMethod === "cartao"
                            ? "border-emerald-500/80 bg-emerald-950/25 text-white shadow-sm shadow-emerald-950/30"
                            : "border-zinc-800 bg-zinc-900/80 text-zinc-400 hover:border-zinc-700"
                        }`}
                      >
                        <CreditCard
                          size={20}
                          className={paymentMethod === "cartao" ? "text-emerald-400" : "text-zinc-500"}
                        />
                        <span className="mt-1 text-xs font-bold">Cartão</span>
                        <span className="text-[10px] text-zinc-500">Maquininha</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod("dinheiro")}
                        className={`flex flex-col items-center justify-center rounded-2xl border p-3 text-center transition ${
                          paymentMethod === "dinheiro"
                            ? "border-emerald-500/80 bg-emerald-950/25 text-white shadow-sm shadow-emerald-950/30"
                            : "border-zinc-800 bg-zinc-900/80 text-zinc-400 hover:border-zinc-700"
                        }`}
                      >
                        <Banknote
                          size={20}
                          className={paymentMethod === "dinheiro" ? "text-emerald-400" : "text-zinc-500"}
                        />
                        <span className="mt-1 text-xs font-bold">Dinheiro</span>
                        <span className="text-[10px] text-zinc-500">Em espécie</span>
                      </button>
                    </div>

                    {/* Campo de troco quando selecionado Dinheiro */}
                    {paymentMethod === "dinheiro" && (
                      <div className="mt-3 rounded-xl border border-zinc-800 bg-zinc-900/70 p-3">
                        <label className="block">
                          <span className="mb-1 block text-xs font-bold text-zinc-400">
                            Precisa de troco para quanto? (Opcional)
                          </span>
                          <input
                            value={changeFor}
                            onChange={(e) => setChangeFor(e.target.value)}
                            placeholder="Ex: Troco para R$ 50 ou R$ 100"
                            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-yellow-500"
                          />
                        </label>
                      </div>
                    )}
                  </div>

                  {/* Resumo Financeiro */}
                  <div className="space-y-2 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4 text-xs">
                    <div className="flex justify-between text-zinc-400">
                      <span>
                        Subtotal ({totalItems} {totalItems === 1 ? "item" : "itens"})
                      </span>
                      <span className="text-zinc-200">{formatBRL(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>Taxa de entrega</span>
                      <span className={deliveryFee > 0 ? "text-zinc-200" : "font-bold text-green-400"}>
                        {deliveryFee > 0 ? formatBRL(deliveryFee) : "Grátis (Retirada)"}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-zinc-800 pt-3 text-sm">
                      <span className="font-bold text-white">Total do pedido</span>
                      <span className="text-lg font-black text-white">{formatBRL(total)}</span>
                    </div>
                  </div>
                </div>

                {/* Rodapé Fixo Passo 2 */}
                <div className="border-t border-zinc-800 bg-zinc-950/95 p-5 backdrop-blur">
                  <div className="mb-3 flex items-baseline justify-between">
                    <div>
                      <span className="text-xs font-medium text-zinc-400">Total a pagar:</span>
                      <p className="text-2xl font-black text-green-400">{formatBRL(total)}</p>
                    </div>
                    <button
                      onClick={() => setCartStep(1)}
                      className="text-xs font-bold text-zinc-400 underline underline-offset-4 transition hover:text-white"
                    >
                      Alterar itens
                    </button>
                  </div>

                  <button
                    onClick={checkoutWhatsApp}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-3.5 text-sm font-black text-white shadow-lg shadow-green-950/50 transition hover:bg-green-500 active:scale-[0.99]"
                  >
                    Finalizar pelo WhatsApp <ArrowRight size={17} />
                  </button>

                  <p className="mt-2 text-center text-[11px] leading-4 text-zinc-500">
                    Seu pedido estruturado será enviado diretamente para nosso WhatsApp oficial.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;