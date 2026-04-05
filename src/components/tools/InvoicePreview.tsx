import { forwardRef } from "react";

export interface InvoiceItem {
  name: string;
  qty: number;
  price: number;
}

export interface InvoiceData {
  shopName: string;
  ownerName: string;
  phone: string;
  address: string;
  invoiceNo: string;
  customerName: string;
  items: InvoiceItem[];
  discount: number;
  vatPercent: number;
  date: string;
}

const InvoicePreview = forwardRef<HTMLDivElement, { data: InvoiceData; compact?: boolean }>(
  ({ data, compact = false }, ref) => {
    const subtotal = data.items.reduce((s, i) => s + i.qty * i.price, 0);
    const vatAmount = Math.round(subtotal * (data.vatPercent / 100));
    const grandTotal = subtotal - data.discount + vatAmount;

    /* ═══ THERMAL / RECEIPT MODE ═══ */
    if (compact) {
      return (
        <div
          ref={ref}
          className="bg-white text-gray-900 font-bangla mx-auto"
          style={{
            fontFamily: "'Hind Siliguri', 'Noto Sans Bengali', monospace",
            width: "80mm",
            padding: "8mm 6mm",
            boxShadow: "4px 4px 20px rgba(0,0,0,0.12), -2px 0 8px rgba(0,0,0,0.04)",
            borderRadius: "2px",
          }}
        >
          <div className="text-center border-b border-dashed border-gray-400 pb-3 mb-3">
            <p className="text-base font-bold leading-tight">{data.shopName || "আপনার দোকান"}</p>
            {data.address && <p className="text-[10px] text-gray-500 mt-0.5">{data.address}</p>}
            {data.phone && <p className="text-[10px] text-gray-500">মোবাইল: {data.phone}</p>}
          </div>

          <div className="flex justify-between text-[10px] text-gray-600 mb-2">
            <span>#{data.invoiceNo}</span>
            <span>{data.date}</span>
          </div>
          {data.customerName && <p className="text-[10px] text-gray-600 mb-2">ক্রেতা: {data.customerName}</p>}

          <div className="border-t border-dashed border-gray-400 pt-2 mb-2">
            {data.items.map((item, i) => (
              <div key={i} className="flex justify-between text-[11px] py-0.5">
                <span className="truncate mr-2">{item.name} ×{item.qty}</span>
                <span className="font-medium shrink-0">৳{(item.qty * item.price).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-dashed border-gray-400 pt-2 space-y-0.5 text-[11px]">
            <div className="flex justify-between"><span>সাবটোটাল</span><span>৳{subtotal.toLocaleString()}</span></div>
            {data.discount > 0 && <div className="flex justify-between text-red-600"><span>ডিসকাউন্ট</span><span>-৳{data.discount.toLocaleString()}</span></div>}
            {vatAmount > 0 && <div className="flex justify-between"><span>ভ্যাট ({data.vatPercent}%)</span><span>৳{vatAmount.toLocaleString()}</span></div>}
          </div>

          <div className="border-t-2 border-gray-800 mt-2 pt-2 flex justify-between items-baseline">
            <span className="text-sm font-bold">মোট</span>
            <span className="text-xl font-bold">৳{grandTotal.toLocaleString()}</span>
          </div>

          <p className="text-center text-[9px] text-gray-400 mt-4 border-t border-dashed border-gray-300 pt-2">
            ধন্যবাদ! আবার আসবেন।
          </p>
        </div>
      );
    }

    /* ═══ A4 PREMIUM INVOICE MODE ═══ */
    return (
      <div
        ref={ref}
        className="bg-white text-gray-900 font-bangla"
        style={{
          fontFamily: "'Hind Siliguri', 'Noto Sans Bengali', sans-serif",
          padding: "40px",
          boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
        }}
      >
        {/* Gold top accent */}
        <div style={{ height: "4px", background: "linear-gradient(90deg, #b8860b, #daa520, #b8860b)", borderRadius: "2px", marginBottom: "32px" }} />

        {/* Header */}
        <div className="text-center pb-6 mb-6" style={{ borderBottom: "2px solid #1a1a2e" }}>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{data.shopName || "আপনার দোকান"}</h1>
          {data.ownerName && <p className="text-sm text-gray-500 mt-1">স্বত্বাধিকারী: {data.ownerName}</p>}
          {data.address && <p className="text-sm text-gray-500">{data.address}</p>}
          {data.phone && <p className="text-sm text-gray-500">মোবাইল: {data.phone}</p>}
          <div className="mt-4 inline-flex items-center gap-2 px-5 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase"
            style={{ background: "#1a1a2e", color: "#daa520" }}>
            ✦ ক্যাশ মেমো / INVOICE ✦
          </div>
        </div>

        {/* Invoice meta */}
        <div className="flex justify-between text-sm mb-6">
          <div>
            <p><strong>ইনভয়েস নং:</strong> {data.invoiceNo}</p>
            {data.customerName && <p><strong>ক্রেতা:</strong> {data.customerName}</p>}
          </div>
          <div className="text-right">
            <p><strong>তারিখ:</strong> {data.date}</p>
          </div>
        </div>

        {/* Item table */}
        <table className="w-full border-collapse mb-6">
          <thead>
            <tr style={{ background: "#1a1a2e" }}>
              <th className="p-3 text-left text-white text-sm font-semibold" style={{ borderRight: "1px solid rgba(255,255,255,0.1)" }}>ক্রমিক</th>
              <th className="p-3 text-left text-white text-sm font-semibold" style={{ borderRight: "1px solid rgba(255,255,255,0.1)" }}>পণ্যের নাম</th>
              <th className="p-3 text-center text-white text-sm font-semibold" style={{ borderRight: "1px solid rgba(255,255,255,0.1)" }}>পরিমাণ</th>
              <th className="p-3 text-right text-white text-sm font-semibold" style={{ borderRight: "1px solid rgba(255,255,255,0.1)" }}>একক দাম</th>
              <th className="p-3 text-right text-white text-sm font-semibold">মোট</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "#fafafa" : "#fff", borderBottom: "1px solid #eee" }}>
                <td className="p-3 text-sm">{i + 1}</td>
                <td className="p-3 text-sm font-medium">{item.name}</td>
                <td className="p-3 text-sm text-center">{item.qty}</td>
                <td className="p-3 text-sm text-right">৳{item.price.toLocaleString()}</td>
                <td className="p-3 text-sm text-right font-medium">৳{(item.qty * item.price).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals panel */}
        <div className="flex justify-end">
          <div className="w-72 rounded-lg overflow-hidden" style={{ border: "2px solid #1a1a2e" }}>
            <div className="flex justify-between px-4 py-2 text-sm" style={{ borderBottom: "1px solid #eee" }}>
              <span>সাবটোটাল</span>
              <span className="font-medium">৳{subtotal.toLocaleString()}</span>
            </div>
            {data.discount > 0 && (
              <div className="flex justify-between px-4 py-2 text-sm text-red-600" style={{ borderBottom: "1px solid #eee" }}>
                <span>ডিসকাউন্ট</span>
                <span>- ৳{data.discount.toLocaleString()}</span>
              </div>
            )}
            {vatAmount > 0 && (
              <div className="flex justify-between px-4 py-2 text-sm" style={{ borderBottom: "1px solid #eee" }}>
                <span>ভ্যাট ({data.vatPercent}%)</span>
                <span>৳{vatAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between px-4 py-3 font-bold text-lg" style={{ background: "#1a1a2e", color: "#daa520" }}>
              <span>সর্বমোট</span>
              <span>৳{grandTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Signature */}
        <div className="mt-16 flex justify-between items-end px-4">
          <div className="text-center">
            <div className="w-44 border-t-2 border-gray-400 pt-2 text-xs text-gray-500">ক্রেতার স্বাক্ষর</div>
          </div>
          <div className="text-center">
            <div className="w-44 border-t-2 border-gray-400 pt-2 text-xs text-gray-500">বিক্রেতার স্বাক্ষর ও সিল</div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 text-center text-xs text-gray-400 pt-4" style={{ borderTop: "1px solid #e5e5e5" }}>
          <p>ধন্যবাদ! আবার আসবেন। — পণ্য একবার বিক্রি হলে ফেরত নেওয়া হবে না।</p>
        </div>

        {/* Gold bottom accent */}
        <div style={{ height: "4px", background: "linear-gradient(90deg, #b8860b, #daa520, #b8860b)", borderRadius: "2px", marginTop: "24px" }} />
      </div>
    );
  }
);

InvoicePreview.displayName = "InvoicePreview";
export default InvoicePreview;
