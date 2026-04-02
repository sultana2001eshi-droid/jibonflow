import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Receipt, Plus, Trash2, Save, Download, Printer, Image, RotateCcw, Store } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import ToolBackButton from "@/components/tools/ToolBackButton";
import InvoicePreview, { InvoiceData, InvoiceItem } from "@/components/tools/InvoicePreview";
import { saveDocument, saveShopProfile, getShopProfile, generateInvoiceNumber } from "@/lib/documentService";
import { saveToolHistory } from "@/lib/toolHistory";
import { exportAsPDF, exportAsJPG, printElement } from "@/lib/exportUtils";
import { toast } from "sonner";

const CashMemoTool = () => {
  const previewRef = useRef<HTMLDivElement>(null);
  const [shopName, setShopName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [invoiceNo, setInvoiceNo] = useState(generateInvoiceNumber());
  const [customerName, setCustomerName] = useState("");
  const [discount, setDiscount] = useState("");
  const [vatPercent, setVatPercent] = useState("");
  const [items, setItems] = useState<{ name: string; qty: string; price: string }[]>([
    { name: "", qty: "1", price: "" },
  ]);
  const [showPreview, setShowPreview] = useState(false);
  const [compact, setCompact] = useState(false);
  const [shopLoaded, setShopLoaded] = useState(false);

  // Load saved shop profile
  useEffect(() => {
    getShopProfile().then((profile) => {
      if (profile) {
        setShopName(profile.shop_name);
        setOwnerName(profile.owner_name || "");
        setPhone(profile.phone || "");
        setAddress(profile.address || "");
        setShopLoaded(true);
      }
    });
  }, []);

  const addItem = () => setItems([...items, { name: "", qty: "1", price: "" }]);
  const removeItem = (i: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, idx) => idx !== i));
  };
  const updateItem = (i: number, field: string, value: string) => {
    const n = [...items];
    n[i] = { ...n[i], [field]: value };
    setItems(n);
  };

  const parsedItems: InvoiceItem[] = items
    .filter((i) => i.name.trim())
    .map((i) => ({
      name: i.name,
      qty: parseFloat(i.qty) || 1,
      price: parseFloat(i.price) || 0,
    }));

  const invoiceData: InvoiceData = {
    shopName,
    ownerName,
    phone,
    address,
    invoiceNo,
    customerName,
    items: parsedItems,
    discount: parseFloat(discount) || 0,
    vatPercent: parseFloat(vatPercent) || 0,
    date: new Date().toLocaleDateString("bn-BD"),
  };

  const canGenerate = parsedItems.length > 0 && shopName.trim();

  const handleGenerate = () => {
    if (!canGenerate) {
      toast.error("দোকানের নাম ও কমপক্ষে একটি পণ্য দিন।");
      return;
    }
    setShowPreview(true);
    saveToolHistory("cashmemo", { shopName, customerName, items: parsedItems }, { invoiceNo, items: parsedItems, discount: invoiceData.discount, vatPercent: invoiceData.vatPercent });
  };

  const handleSaveShop = async () => {
    if (!shopName.trim()) {
      toast.error("দোকানের নাম দিন।");
      return;
    }
    await saveShopProfile({ shop_name: shopName, owner_name: ownerName || undefined, phone: phone || undefined, address: address || undefined });
    toast.success("দোকানের তথ্য সেভ হয়েছে!");
    setShopLoaded(true);
  };

  const handlePDF = () => {
    if (!previewRef.current) return;
    exportAsPDF(previewRef.current, `invoice-${invoiceNo}`);
    toast.success("PDF ডাউনলোড হচ্ছে...");
  };

  const handleJPG = () => {
    if (!previewRef.current) return;
    exportAsJPG(previewRef.current, `invoice-${invoiceNo}`);
    toast.success("JPG ডাউনলোড হচ্ছে...");
  };

  const handlePrint = () => {
    if (!previewRef.current) return;
    printElement(previewRef.current);
  };

  const handleSaveDocument = async () => {
    const subtotal = parsedItems.reduce((s, i) => s + i.qty * i.price, 0);
    const vat = Math.round(subtotal * ((parseFloat(vatPercent) || 0) / 100));
    const total = subtotal - (parseFloat(discount) || 0) + vat;
    await saveDocument({
      doc_type: "cash_memo",
      title: `${shopName} — ৳${total.toLocaleString()}`,
      content: JSON.stringify(invoiceData),
    });
    toast.success("ডকুমেন্ট সেভ হয়েছে!");
  };

  const resetTool = () => {
    setInvoiceNo(generateInvoiceNumber());
    setCustomerName("");
    setDiscount("");
    setVatPercent("");
    setItems([{ name: "", qty: "1", price: "" }]);
    setShowPreview(false);
  };

  const subtotal = parsedItems.reduce((s, i) => s + i.qty * i.price, 0);
  const vatAmt = Math.round(subtotal * ((parseFloat(vatPercent) || 0) / 100));
  const grandTotal = subtotal - (parseFloat(discount) || 0) + vatAmt;

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-16">
        <div className="container max-w-2xl">
          <div className="mb-6">
            <ToolBackButton />
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                <Receipt size={22} className="text-white" />
              </div>
              <div>
                <h1 className="font-heading text-xl font-bold text-foreground">ক্যাশ মেমো / ইনভয়েস</h1>
                <p className="text-xs text-muted-foreground font-bangla">ব্যবসায়িক মানের ইনভয়েস তৈরি করুন</p>
              </div>
            </div>
          </div>

          {/* Shop Info */}
          <div className="glass-card gradient-border rounded-2xl p-6 space-y-3 mb-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-semibold text-foreground flex items-center gap-2">
                <Store size={16} /> দোকানের তথ্য
              </h3>
              <Button variant="ghost" size="sm" onClick={handleSaveShop} className="text-xs">
                <Save size={14} /> {shopLoaded ? "আপডেট" : "সেভ করুন"}
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-heading font-medium text-foreground">দোকানের নাম *</label>
                <Input placeholder="আল-মদিনা ট্রেডার্স" value={shopName} onChange={(e) => setShopName(e.target.value)} className="font-bangla" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-heading font-medium text-foreground">মালিকের নাম</label>
                <Input placeholder="মোহাম্মদ আলী" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} className="font-bangla" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-heading font-medium text-foreground">মোবাইল</label>
                <Input placeholder="০১XXXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} className="font-bangla" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-heading font-medium text-foreground">ঠিকানা</label>
                <Input placeholder="বরিশাল, বাংলাদেশ" value={address} onChange={(e) => setAddress(e.target.value)} className="font-bangla" />
              </div>
            </div>
          </div>

          {/* Invoice info */}
          <div className="glass-card gradient-border rounded-2xl p-6 space-y-4 mb-4">
            <h3 className="font-heading font-semibold text-foreground">ইনভয়েস তথ্য</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-heading font-medium text-foreground">ইনভয়েস নম্বর</label>
                <Input value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} className="font-bangla" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-heading font-medium text-foreground">ক্রেতার নাম</label>
                <Input placeholder="ক্রেতার নাম (ঐচ্ছিক)" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="font-bangla" />
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2">
              <label className="text-sm font-heading font-medium text-foreground block">পণ্যের তালিকা *</label>
              {items.map((item, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-center">
                  <Input placeholder="পণ্যের নাম" value={item.name} onChange={(e) => updateItem(i, "name", e.target.value)} className="col-span-5 font-bangla text-sm" />
                  <Input placeholder="সংখ্যা" type="number" value={item.qty} onChange={(e) => updateItem(i, "qty", e.target.value)} className="col-span-2 font-bangla text-sm" />
                  <Input placeholder="দাম" type="number" value={item.price} onChange={(e) => updateItem(i, "price", e.target.value)} className="col-span-3 font-bangla text-sm" />
                  <div className="col-span-2 flex justify-center">
                    {items.length > 1 && (
                      <Button variant="ghost" size="icon" onClick={() => removeItem(i)} className="h-8 w-8 text-destructive">
                        <Trash2 size={14} />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              <Button variant="ghost" size="sm" onClick={addItem} className="text-accent text-xs">
                <Plus size={14} /> আরো পণ্য যোগ করুন
              </Button>
            </div>

            {/* Discount & VAT */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-heading font-medium text-foreground">ডিসকাউন্ট (৳)</label>
                <Input type="number" placeholder="০" value={discount} onChange={(e) => setDiscount(e.target.value)} className="font-bangla" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-heading font-medium text-foreground">ভ্যাট (%)</label>
                <Input type="number" placeholder="০" value={vatPercent} onChange={(e) => setVatPercent(e.target.value)} className="font-bangla" />
              </div>
            </div>

            {/* Live total */}
            {parsedItems.length > 0 && (
              <div className="bg-muted/50 rounded-xl p-4 space-y-1">
                <div className="flex justify-between text-sm font-bangla">
                  <span>সাবটোটাল:</span><span>৳{subtotal.toLocaleString()}</span>
                </div>
                {(parseFloat(discount) || 0) > 0 && (
                  <div className="flex justify-between text-sm font-bangla text-destructive">
                    <span>ডিসকাউন্ট:</span><span>- ৳{(parseFloat(discount) || 0).toLocaleString()}</span>
                  </div>
                )}
                {vatAmt > 0 && (
                  <div className="flex justify-between text-sm font-bangla">
                    <span>ভ্যাট ({vatPercent}%):</span><span>৳{vatAmt.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-heading font-bold pt-1 border-t border-border/30">
                  <span>সর্বমোট:</span><span>৳{grandTotal.toLocaleString()}</span>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button onClick={handleGenerate} disabled={!canGenerate} variant="hero" className="flex-1" size="lg">
                <Receipt size={16} /> মেমো তৈরি করুন
              </Button>
              <Button onClick={resetTool} variant="outline" size="lg">
                <RotateCcw size={16} /> রিসেট
              </Button>
            </div>
          </div>

          {/* Preview & Export */}
          {showPreview && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-semibold text-foreground">ইনভয়েস প্রিভিউ</h3>
                <div className="flex gap-1">
                  <button onClick={() => setCompact(false)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bangla ${!compact ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>
                    A4 ইনভয়েস
                  </button>
                  <button onClick={() => setCompact(true)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bangla ${compact ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>
                    রিসিট
                  </button>
                </div>
              </div>

              <div className="border border-border/30 rounded-xl overflow-hidden shadow-lg">
                <InvoicePreview ref={previewRef} data={invoiceData} compact={compact} />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <Button onClick={handlePDF} variant="outline" size="sm" className="text-xs">
                  <Download size={14} /> PDF
                </Button>
                <Button onClick={handleJPG} variant="outline" size="sm" className="text-xs">
                  <Image size={14} /> JPG
                </Button>
                <Button onClick={handlePrint} variant="outline" size="sm" className="text-xs">
                  <Printer size={14} /> প্রিন্ট
                </Button>
                <Button onClick={handleSaveDocument} variant="outline" size="sm" className="text-xs">
                  <Save size={14} /> সেভ করুন
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default CashMemoTool;
