const Terms = () => (
  <div className="min-h-screen pt-24 pb-16">
    <div className="container max-w-2xl">
      <div className="space-y-8 animate-fade-in">
        <div className="text-center space-y-2">
          <h1 className="font-heading text-2xl font-bold text-foreground">শর্তাবলী ও গোপনীয়তা নীতি</h1>
          <p className="text-sm text-muted-foreground font-bangla">সর্বশেষ আপডেট: মার্চ ২০২৬</p>
        </div>

        <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-6">
          <section className="space-y-3">
            <h2 className="font-heading font-semibold text-lg text-foreground">ব্যবহারের শর্তাবলী</h2>
            <div className="space-y-2 text-sm text-muted-foreground font-bangla leading-relaxed">
              <p>JibonFlow একটি ফ্রি টুলস প্ল্যাটফর্ম। এই অ্যাপ ব্যবহার করে আপনি নিম্নোক্ত শর্তাবলী মেনে নিচ্ছেন:</p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>এই অ্যাপটি শুধুমাত্র ব্যক্তিগত ও শিক্ষামূলক ব্যবহারের জন্য।</li>
                <li>অ্যাপের কোনো তথ্য পেশাদার পরামর্শ হিসেবে গণ্য নয়।</li>
                <li>ব্যবহারকারীর ইনপুট ডেটা ব্রাউজারে থাকে, কোনো সার্ভারে পাঠানো হয় না।</li>
              </ul>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading font-semibold text-lg text-foreground">গোপনীয়তা নীতি</h2>
            <div className="space-y-2 text-sm text-muted-foreground font-bangla leading-relaxed">
              <p>আমরা আপনার গোপনীয়তাকে সম্মান করি:</p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>কোনো ব্যক্তিগত তথ্য সংগ্রহ করা হয় না।</li>
                <li>কোনো কুকি বা ট্র্যাকিং ব্যবহার করা হয় না।</li>
                <li>সমস্ত গণনা আপনার ডিভাইসে সম্পন্ন হয়।</li>
                <li>তৃতীয় পক্ষের সাথে কোনো ডেটা শেয়ার করা হয় না।</li>
              </ul>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading font-semibold text-lg text-foreground">যোগাযোগ</h2>
            <p className="text-sm text-muted-foreground font-bangla">
              কোনো প্রশ্ন থাকলে{" "}
              <a href="https://mdnasrullah.pro.bd" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                mdnasrullah.pro.bd
              </a>{" "}
              তে যোগাযোগ করুন।
            </p>
          </section>
        </div>
      </div>
    </div>
  </div>
);

export default Terms;
