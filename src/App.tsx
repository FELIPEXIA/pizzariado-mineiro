import { useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Clock3,
  MapPin,
  Minus,
  Pizza,
  Plus,
  ShoppingBag,
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
};

type CartItem = {
  id: string;
  flavor: PizzaFlavor;
  size: Size;
  crust: Crust;
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
  },
  {
    id: "mussarela",
    name: "Muçarela",
    description: "Molho de tomate, muçarela especial, tomate, azeitona e orégano.",
    prices: { Broto: 27, Média: 36, Grande: 41 },
  },
  {
    id: "frango-catupiry",
    name: "Frango com Catupiry",
    description: "Molho de tomate, frango desfiado, catupiry, milho e orégano.",
    prices: { Broto: 31, Média: 41, Grande: 47 },
    popular: true,
  },
  {
    id: "portuguesa",
    name: "Portuguesa",
    description: "Muçarela, presunto, ovo, cebola, pimentão, ervilha, milho e azeitona.",
    prices: { Broto: 31, Média: 41, Grande: 47 },
  },
  {
    id: "mineira",
    name: "Mineira",
    description: "Muçarela, carne-seca, cebola, tomate, milho e um toque de orégano.",
    prices: { Broto: 34, Média: 45, Grande: 52 },
    popular: true,
  },
  {
    id: "bacon",
    name: "Bacon",
    description: "Molho de tomate, muçarela, bacon crocante, milho e orégano.",
    prices: { Broto: 31, Média: 41, Grande: 47 },
  },
  {
    id: "quatro-queijos",
    name: "4 Queijos",
    description: "Muçarela, provolone, parmesão e catupiry sobre molho artesanal.",
    prices: { Broto: 34, Média: 45, Grande: 52 },
  },
  {
    id: "pepperoni",
    name: "Pepperoni",
    description: "Molho de tomate, muçarela, pepperoni e orégano.",
    prices: { Broto: 34, Média: 45, Grande: 52 },
    popular: true,
  },
  {
    id: "chocolate",
    name: "Chocolate",
    description: "Chocolate cremoso, granulado e cobertura especial.",
    prices: { Broto: 30, Média: 39, Grande: 45 },
  },
];

const formatBRL = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function getWhatsAppNumber() {
  return (import.meta.env.VITE_WHATSAPP_NUMBER || "5527999999999").replace(/\D/g, "");
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
  const [category, setCategory] = useState<"Todas" | "Salgadas" | "Doces">("Todas");
  const [customerName, setCustomerName] = useState("");
  const [deliveryType, setDeliveryType] = useState<"Retirada" | "Entrega">("Retirada");
  const [address, setAddress] = useState("");

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
    const itemId = `${selectedFlavor.id}-${selectedSize}-${selectedCrust}`;

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
          flavor: selectedFlavor,
          size: selectedSize,
          crust: selectedCrust,
          quantity: 1,
          unitPrice,
        },
      ];
    });

    setSelectedFlavor(null);
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

  function checkoutWhatsApp() {
    if (!cart.length) return;

    if (!customerName.trim()) {
      alert("Informe seu nome antes de finalizar o pedido.");
      return;
    }

    if (deliveryType === "Entrega" && !address.trim()) {
      alert("Informe o endereço para entrega.");
      return;
    }

    const lines = cart.map(
      (item) =>
        `${item.quantity}x ${item.flavor.name} — ${item.size} — Borda: ${item.crust} — ${formatBRL(
          item.unitPrice * item.quantity
        )}`
    );

    const message = [
      "🍕 *NOVO PEDIDO — PIZZARIA DO MINEIRO*",
      "",
      `👤 Cliente: ${customerName.trim()}`,
      `📦 Modalidade: ${deliveryType}`,
      ...(deliveryType === "Entrega" ? [`📍 Endereço: ${address.trim()}`] : []),
      "",
      "*Itens:*",
      ...lines,
      "",
      `💰 Subtotal: ${formatBRL(subtotal)}`,
      ...(deliveryFee ? [`🛵 Taxa de entrega: ${formatBRL(deliveryFee)}`] : []),
      `💳 *Total: ${formatBRL(total)}*`,
      "",
      "Pode confirmar o pedido e o prazo, por favor? 🍕",
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
            onClick={() => setCartOpen(true)}
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
          <div className="grid gap-5 lg:grid-cols-[1.45fr_.8fr]">
            <div className="relative overflow-hidden rounded-3xl border border-red-900/60 bg-gradient-to-br from-red-950 via-red-900 to-zinc-950 p-6 shadow-2xl shadow-red-950/20 sm:p-9">
              <div className="absolute -right-14 -top-14 h-40 w-40 rounded-full bg-red-500/10 blur-2xl" />
              <div className="relative">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-black tracking-wide text-red-700">
                  <span className="h-2 w-2 rounded-full bg-red-600" />
                  OFERTA DA CASA
                </div>
                <h1 className="max-w-3xl text-3xl font-black uppercase leading-tight tracking-tight sm:text-5xl">
                  BORDA RECHEADA <span className="text-red-300">+</span> GUARANÁ COROA
                  <span className="text-red-300"> EM DESTAQUE!</span>
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-red-100/80 sm:text-base">
                  Escolha sua pizza, personalize o tamanho e a borda e mande o pedido direto
                  para nosso WhatsApp.
                </p>
                <a
                  href="#cardapio"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-black text-red-800 transition hover:bg-red-50"
                >
                  Ver cardápio <ArrowRight size={17} />
                </a>
              </div>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-6">
              <div className="mb-5 flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">
                  Atendimento
                </span>
                <span
                  className={`status-pulse inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-black ${
                    open ? "bg-green-950 text-green-400" : "bg-zinc-800 text-zinc-400"
                  }`}
                >
                  <span className={`h-2 w-2 rounded-full ${open ? "bg-green-400" : "bg-zinc-500"}`} />
                  {open ? "Aberto" : "Fechado"}
                </span>
              </div>

              <h2 className="text-2xl font-black">Pizzaria do Mineiro</h2>
              <div className="mt-5 space-y-4 text-sm text-zinc-300">
                <div className="flex gap-3">
                  <Clock3 className="mt-0.5 shrink-0 text-red-500" size={19} />
                  <div>
                    <p className="font-bold text-white">Horário de funcionamento</p>
                    <p className="mt-1 text-zinc-400">Terça a Domingo: 18h às 23h</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <MapPin className="mt-0.5 shrink-0 text-red-500" size={19} />
                  <div>
                    <p className="font-bold text-white">Endereço</p>
                    <p className="mt-1 leading-5 text-zinc-400">
                      Nova Valverde, Rua Almir Cruz Amorim, Nº 1122
                      <br />
                      Cariacica - ES
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="cardapio" className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
          <div className="flex flex-col gap-5 border-b border-zinc-800 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-red-500">Nosso cardápio</p>
              <h2 className="mt-1 text-3xl font-black tracking-tight">Sabores oficiais</h2>
              <p className="mt-2 text-sm text-zinc-500">Escolha seu sabor e personalize do seu jeito.</p>
            </div>

            <div className="flex w-full rounded-xl border border-zinc-800 bg-zinc-900 p-1 sm:w-auto">
              {(["Todas", "Salgadas", "Doces"] as const).map((item) => (
                <button
                  key={item}
                  onClick={() => setCategory(item)}
                  className={`flex-1 rounded-lg px-4 py-2 text-sm font-bold transition sm:flex-none ${
                    category === item ? "bg-red-600 text-white" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibleFlavors.map((flavor, index) => (
              <article
                key={flavor.id}
                className="animate-float-in group flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 transition hover:-translate-y-1 hover:border-red-900/80 hover:bg-zinc-900"
                style={{ animationDelay: `${index * 45}ms` }}
              >
                <div className="mb-5 flex items-start justify-between gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-red-950 text-red-500">
                    <Pizza size={25} />
                  </div>
                  {flavor.popular && (
                    <span className="rounded-full border border-red-900 bg-red-950/60 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-red-300">
                      Mais pedido
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-black">{flavor.name}</h3>
                <p className="mt-2 min-h-14 text-sm leading-5 text-zinc-400">{flavor.description}</p>

                <div className="mt-5 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-600">Grande a partir de</p>
                    <p className="mt-1 text-xl font-black text-white">{formatBRL(flavor.prices.Grande)}</p>
                  </div>
                  <button
                    onClick={() => openCustomizer(flavor)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-sm font-black text-zinc-950 transition hover:bg-red-500 hover:text-white"
                  >
                    + Personalizar
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      {selectedFlavor && (
        <div className="fixed inset-0 z-50 grid place-items-end bg-black/75 p-0 backdrop-blur-sm sm:place-items-center sm:p-4">
          <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-zinc-800 bg-zinc-950 shadow-2xl sm:rounded-3xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-800 bg-zinc-950/95 px-5 py-4 backdrop-blur">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-red-500">Personalizar</p>
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
                          ? "border-red-500 bg-red-950/40"
                          : "border-zinc-800 bg-zinc-900 hover:border-zinc-600"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold">{size.label}</span>
                        {selectedSize === size.label && <Check size={16} className="text-red-500" />}
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
                          ? "border-red-500 bg-red-950/40"
                          : "border-zinc-800 bg-zinc-900 hover:border-zinc-600"
                      }`}
                    >
                      <span className="font-bold">{crust.label}</span>
                      <span className="flex items-center gap-2 text-sm text-zinc-400">
                        {crust.extra === 0 ? "Grátis" : `+ ${formatBRL(crust.extra)}`}
                        {selectedCrust === crust.label && <Check size={16} className="text-red-500" />}
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
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3.5 font-black transition hover:bg-red-500"
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
            <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-red-500">Seu pedido</p>
                <h2 className="text-xl font-black">Resumo do carrinho</h2>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="rounded-full bg-zinc-900 p-2 text-zinc-400 hover:text-white"
                aria-label="Fechar carrinho"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {cart.length === 0 ? (
                <div className="grid min-h-[50vh] place-items-center text-center">
                  <div>
                    <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-red-950 text-red-500">
                      <ShoppingBag size={28} />
                    </div>
                    <h3 className="mt-4 text-lg font-black">Seu pedido está vazio</h3>
                    <p className="mt-1 text-sm text-zinc-500">Escolha uma pizza no cardápio para começar.</p>
                    <button
                      onClick={() => setCartOpen(false)}
                      className="mt-5 rounded-xl bg-red-600 px-5 py-3 text-sm font-black"
                    >
                      Ver cardápio
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div key={item.id} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-black">{item.flavor.name}</h3>
                            <p className="mt-1 text-xs text-zinc-500">
                              {item.size} · Borda {item.crust}
                            </p>
                          </div>
                          <button
                            onClick={() => updateQuantity(item.id, -item.quantity)}
                            className="text-zinc-600 transition hover:text-red-500"
                            aria-label={`Remover ${item.flavor.name}`}
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-950 p-1">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="grid h-7 w-7 place-items-center rounded-md text-zinc-400 hover:bg-zinc-800 hover:text-white"
                              aria-label="Diminuir quantidade"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-6 text-center text-sm font-black">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="grid h-7 w-7 place-items-center rounded-md text-zinc-400 hover:bg-zinc-800 hover:text-white"
                              aria-label="Aumentar quantidade"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <strong>{formatBRL(item.unitPrice * item.quantity)}</strong>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-7 border-t border-zinc-800 pt-6">
                    <h3 className="mb-3 font-black">Dados para finalizar</h3>

                    <label className="block">
                      <span className="mb-1.5 block text-xs font-bold text-zinc-500">Seu nome</span>
                      <input
                        value={customerName}
                        onChange={(event) => setCustomerName(event.target.value)}
                        placeholder="Como podemos te chamar?"
                        className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-600 focus:border-red-500"
                      />
                    </label>

                    <div className="mt-4">
                      <span className="mb-1.5 block text-xs font-bold text-zinc-500">Recebimento</span>
                      <div className="grid grid-cols-2 gap-2">
                        {(["Retirada", "Entrega"] as const).map((type) => (
                          <button
                            key={type}
                            onClick={() => setDeliveryType(type)}
                            className={`rounded-xl border px-4 py-3 text-sm font-bold ${
                              deliveryType === type
                                ? "border-red-500 bg-red-950/40 text-white"
                                : "border-zinc-800 bg-zinc-900 text-zinc-400"
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    {deliveryType === "Entrega" && (
                      <label className="mt-4 block">
                        <span className="mb-1.5 block text-xs font-bold text-zinc-500">Endereço de entrega</span>
                        <input
                          value={address}
                          onChange={(event) => setAddress(event.target.value)}
                          placeholder="Rua, número, bairro e referência"
                          className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-600 focus:border-red-500"
                        />
                      </label>
                    )}

                    <div className="mt-6 space-y-2 rounded-2xl bg-zinc-900 p-4 text-sm">
                      <div className="flex justify-between text-zinc-400">
                        <span>Subtotal</span>
                        <span>{formatBRL(subtotal)}</span>
                      </div>
                      {deliveryFee > 0 && (
                        <div className="flex justify-between text-zinc-400">
                          <span>Taxa de entrega</span>
                          <span>{formatBRL(deliveryFee)}</span>
                        </div>
                      )}
                      <div className="mt-3 flex justify-between border-t border-zinc-800 pt-3">
                        <span className="font-bold">Total</span>
                        <span className="text-xl font-black">{formatBRL(total)}</span>
                      </div>
                    </div>

                    <button
                      onClick={checkoutWhatsApp}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3.5 font-black text-white transition hover:bg-green-500"
                    >
                      Finalizar pelo WhatsApp <ArrowRight size={18} />
                    </button>

                    <p className="mt-3 text-center text-[11px] leading-4 text-zinc-600">
                      Ao clicar, seu pedido será aberto em uma conversa do WhatsApp com todos os itens e valores.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;