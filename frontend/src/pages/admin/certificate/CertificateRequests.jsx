import React, { useState, useEffect } from "react";
import { 
  MdCheckCircle, MdHourglassEmpty, MdPerson, MdSchool, 
  MdSearch, MdFilterList, MdVerified, MdErrorOutline,
  MdAdd
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import * as actions from "./slice";
import * as selectors from "./selector";
import DirectGenerationModal from "./components/DirectGenerationModal";

const CertificateRequests = () => {
  const dispatch = useDispatch();
  const requests = useSelector(selectors.selectRequests);
  const loading = useSelector(selectors.selectLoading);
  const isGenerating = useSelector(selectors.selectGenerating);
  const { users, courses } = useSelector(selectors.selectOptions);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(actions.fetchRequests());
    dispatch(actions.fetchOptions());
  }, [dispatch]);

  const handleApprove = (id) => {
    dispatch(actions.approveRequest(id));
  };

  const handleManualGenerate = (data) => {
    dispatch(actions.generateDirectly({
      data,
      callback: () => setIsModalOpen(false)
    }));
  };

  const filteredRequests = (requests || []).filter(req => {
    const matchesSearch = 
      req.user?.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.course?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.certificate_number?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === "all" || req.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <MdVerified className="text-primary" /> Certificate Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage, approve, or manually generate certificates.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all active:scale-95"
        >
          <MdAdd size={24} /> Generate Directly
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by student, course or cert number..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <MdFilterList className="text-gray-400" />
          <select 
            className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-primary/20"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Student</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Course</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Details</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {loading ? (
                [1,2,3].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="5" className="px-6 py-4"><div className="h-12 bg-gray-100 dark:bg-gray-700 rounded-lg" /></td>
                  </tr>
                ))
              ) : filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                       <MdErrorOutline size={48} />
                       <p>No certificate records found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                          <MdPerson size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 dark:text-white leading-tight">{req.user?.user_name}</p>
                          <p className="text-xs text-gray-500">{req.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <MdSchool className="text-gray-400" />
                        <div>
                          <p className="text-sm font-bold text-gray-700 dark:text-gray-300 leading-tight">{req.course?.title}</p>
                          <p className={`text-[10px] font-black uppercase italic ${req.course?.course_mode === 'Offline' ? 'text-blue-500' : 'text-primary'}`}>
                             {req.course?.course_mode} Mode
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs space-y-1">
                        <p className="text-gray-500 font-medium">Issued To: <span className="text-gray-800 dark:text-white font-bold">{req.custom_name}</span></p>
                        {req.certificate_number && (
                          <p className="text-primary font-black uppercase italic"># {req.certificate_number}</p>
                        )}
                        <p className="text-[10px] text-gray-400 italic">Created: {moment(req.createdAt).format('DD MMM YYYY')}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center w-fit gap-1 ${
                        req.status === 'approved' ? 'bg-emerald-50 text-emerald-600' :
                        req.status === 'pending' ? 'bg-orange-50 text-orange-600' :
                        'bg-red-50 text-red-600'
                      }`}>
                        {req.status === 'approved' ? <MdCheckCircle /> : <MdHourglassEmpty />}
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {req.status === 'pending' ? (
                        <button 
                          onClick={() => handleApprove(req.id)}
                          className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/10"
                        >
                          Approve Now
                        </button>
                      ) : req.status === 'approved' ? (
                        <div className="text-emerald-500 font-black italic text-[10px] flex items-center justify-end gap-1 uppercase tracking-widest">
                           <MdCheckCircle /> Finalized
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DirectGenerationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        users={users}
        courses={courses}
        onGenerate={handleManualGenerate}
        isGenerating={isGenerating}
      />
    </div>
  );
};

export default CertificateRequests;
