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

    return (
      <div
        ref={ref}
        className={`bg-white text-gray-900 ${compact ? "p-4 text-xs" : "p-8"} font-bangla`}
        style={{ fontFamily: "'Hind Siliguri', 'Noto Sans Bengali', sans-serif" }}
      >
        {/* Header */}
        <div className="text-center border-b-2 border-gray-800 pb-4 mb-4">
          <h1 className={`font-bold ${compact ? "text-lg" : "text-2xl"}`}>{data.shopName || "আপনার দোকান"}</h1>
          {data.ownerName && <p className={compact ? "text-[10px]" : "text-sm"}>স্বত্বাধিকারী: {data.ownerName}</p>}
          {data.address && <p className={compact ? "text-[10px]" : "text-sm"}>{data.address}</p>}
          {data.phone && <p className={compact ? "text-[10px]" : "text-sm"}>মোবাইল: {data.phone}</p>}
          <div className={`mt-2 inline-block px-3 py-1 bg-gray-800 text-white rounded ${compact ? "text-[10px]" : "text-xs"} font-semibold tracking-wider`}>
            ক্যাশ মেমো / INVOICE
          </div>
        </div>

        {/* Invoice info */}
        <div className={`flex justify-between ${compact ? "text-[10px] mb-2" : "text-sm mb-4"}`}>
          <div>
            <p><strong>ইনভয়েস নং:</strong> {data.invoiceNo}</p>
            {data.customerName && <p><strong>ক্রেতা:</strong> {data.customerName}</p>}
          </div>
          <div className="text-right">
            <p><strong>তারিখ:</strong> {data.date}</p>
          </div>
        </div>

        {/* Item table */}
        <table className="w-full border-collapse mb-4">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className={`border border-gray-600 ${compact ? "p-1 text-[10px]" : "p-2 text-sm"} text-left`}>ক্রমিক</th>
              <th className={`border border-gray-600 ${compact ? "p-1 text-[10px]" : "p-2 text-sm"} text-left`}>পণ্যের নাম</th>
              <th className={`border border-gray-600 ${compact ? "p-1 text-[10px]" : "p-2 text-sm"} text-center`}>পরিমাণ</th>
              <th className={`border border-gray-600 ${compact ? "p-1 text-[10px]" : "p-2 text-sm"} text-right`}>একক দাম</th>
              <th className={`border border-gray-600 ${compact ? "p-1 text-[10px]" : "p-2 text-sm"} text-right`}>মোট</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                <td className={`border border-gray-300 ${compact ? "p-1 text-[10px]" : "p-2 text-sm"}`}>{i + 1}</td>
                <td className={`border border-gray-300 ${compact ? "p-1 text-[10px]" : "p-2 text-sm"}`}>{item.name}</td>
                <td className={`border border-gray-300 ${compact ? "p-1 text-[10px]" : "p-2 text-sm"} text-center`}>{item.qty}</td>
                <td className={`border border-gray-300 ${compact ? "p-1 text-[10px]" : "p-2 text-sm"} text-right`}>৳{item.price.toLocaleString()}</td>
                <td className={`border border-gray-300 ${compact ? "p-1 text-[10px]" : "p-2 text-sm"} text-right`}>৳{(item.qty * item.price).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className={`flex justify-end ${compact ? "text-[10px]" : "text-sm"}`}>
          <div className={`${compact ? "w-48" : "w-64"} space-y-1`}>
            <div className="flex justify-between border-b border-gray-300 pb-1">
              <span>সাবটোটাল:</span>
              <span>৳{subtotal.toLocaleString()}</span>
            </div>
            {data.discount > 0 && (
              <div className="flex justify-between border-b border-gray-300 pb-1 text-red-600">
                <span>ডিসকাউন্ট:</span>
                <span>- ৳{data.discount.toLocaleString()}</span>
              </div>
            )}
            {vatAmount > 0 && (
              <div className="flex justify-between border-b border-gray-300 pb-1">
                <span>ভ্যাট ({data.vatPercent}%):</span>
                <span>৳{vatAmount.toLocaleString()}</span>
              </div>
            )}
            <div className={`flex justify-between ${compact ? "pt-1 text-sm" : "pt-2 text-lg"} font-bold`}>
              <span>সর্বমোট:</span>
              <span>৳{grandTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Signature */}
        {!compact && (
          <div className="mt-12 flex justify-between items-end">
            <div className="text-center">
              <div className="w-40 border-t border-gray-600 pt-1 text-sm">ক্রেতার স্বাক্ষর</div>
            </div>
            <div className="text-center">
              <div className="w-40 border-t border-gray-600 pt-1 text-sm">বিক্রেতার স্বাক্ষর ও সিল</div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className={`text-center ${compact ? "mt-4 text-[10px]" : "mt-8 text-xs"} text-gray-500 border-t border-gray-300 pt-3`}>
          ধন্যবাদ! আবার আসবেন। — পণ্য একবার বিক্রি হলে ফেরত নেওয়া হবে না।
        </div>
      </div>
    );
  }
);

InvoicePreview.displayName = "InvoicePreview";
export default InvoicePreview;
