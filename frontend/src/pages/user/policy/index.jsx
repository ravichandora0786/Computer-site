import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPolicyData } from "./slice";

const LegalLayout = ({ title, date, children }) => (
  <div className="container mx-auto px-4 py-20">
    <div className="max-w-4xl mx-auto bg-white rounded-[40px] border border-gray-100 shadow-2xl p-8 md:p-16">
      <h1 className="text-4xl font-black text-main tracking-tight mb-2 italic underline decoration-primary decoration-4 underline-offset-8">{title}</h1>
      <p className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-12">Last Updated: {date}</p>
      <div className="prose prose-slate max-w-none text-gray-500 font-medium leading-relaxed space-y-8">
        {children}
      </div>
    </div>
  </div>
);

const Policy = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.policy.data) || [];
  const loading = useSelector((state) => state.policy.loading);

  useEffect(() => {
    dispatch(fetchPolicyData());
  }, [dispatch]);

  if (loading) return <div className="container mx-auto px-4 py-20 text-center text-primary font-bold">Loading Policies...</div>;

  return (
    <LegalLayout title="Privacy Policy" date={data.length > 0 ? new Date(data[0].updatedAt).toLocaleDateString() : "Oct 2023"}>
      {data.length > 0 ? (
        data.map((policy, index) => (
          <section key={policy.id || index}>
            <div 
              className="text-gray-500 font-medium leading-relaxed"
              dangerouslySetInnerHTML={{ __html: policy.content_html }} 
            />
          </section>
        ))
      ) : (
        <p>No policy sections defined yet.</p>
      )}
    </LegalLayout>
  );
};

export default Policy;
