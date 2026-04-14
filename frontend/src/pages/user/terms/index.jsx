import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { fetchTermsData } from "./slice";
import { selectTermsData, selectTermsLoading } from "./selector";

const LegalLayout = ({ title, date, children }) => (
  <div className="container mx-auto px-4 py-20">
    <div className="max-w-4xl mx-auto bg-white rounded-[40px] border border-gray-100 shadow-2xl p-8 md:p-16">
      <h1 className="text-4xl font-black text-main tracking-tight mb-2 italic underline decoration-primary decoration-4 underline-offset-8">{title}</h1>
      <p className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-12">Last Updated: {date || "Recently"}</p>
      <div className="prose prose-slate max-w-none text-gray-500 font-medium leading-relaxed space-y-8">
        {children}
      </div>
    </div>
  </div>
);

const Terms = () => {
  const dispatch = useDispatch();
  const data = useSelector(selectTermsData);
  const loading = useSelector(selectTermsLoading);

  React.useEffect(() => {
    dispatch(fetchTermsData());
  }, [dispatch]);

  if (loading) return (
    <div className="py-40 text-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary mx-auto mb-4" />
      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading Studio Terms...</p>
    </div>
  );

  return (
    <LegalLayout 
      title="Terms & Conditions" 
      date={data?.items?.[0]?.updatedAt ? new Date(data.items[0].updatedAt).toLocaleDateString() : "Oct 2023"}
    >
      <div className="flex flex-col gap-12">
        {data?.items && data.items.length > 0 ? (
          data.items.map((item) => (
            <motion.section 
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group"
            >
              <h3 className="text-xl font-black text-main italic mb-6 flex items-center gap-4">
                <span className="h-2 w-8 bg-primary rounded-full group-hover:w-12 transition-all" />
                {item.heading}
              </h3>
              <div 
                className="text-gray-500 font-medium leading-relaxed pl-12 border-l-2 border-gray-50 group-hover:border-primary/20 transition-colors"
                dangerouslySetInnerHTML={{ __html: item.description }} 
              />
            </motion.section>
          ))
        ) : (
          <div className="py-20 text-center bg-gray-50 rounded-[32px] border-2 border-dashed border-gray-100">
             <p className="text-gray-400 font-bold italic">No legal sections published yet.</p>
          </div>
        )}
      </div>
    </LegalLayout>
  );
};

export default Terms;
