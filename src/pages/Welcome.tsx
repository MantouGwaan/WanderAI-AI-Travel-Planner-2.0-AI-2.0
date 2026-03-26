import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, ArrowRight, MapPin, Calendar, Trash2, X, Check } from 'lucide-react';
import { useAppStore } from '../store';

export default function Welcome() {
  const navigate = useNavigate();
  const { recentTrips, loadTrip, deleteTrip, resetJourney } = useAppStore();
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);

  const handleResumeTrip = (tripId: string) => {
    if (confirmingDeleteId) return; // Don't navigate if confirming delete
    loadTrip(tripId);
    navigate('/workbench');
  };

  const initiateDelete = (e: React.MouseEvent, tripId: string) => {
    e.stopPropagation();
    setConfirmingDeleteId(tripId);
  };

  const cancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmingDeleteId(null);
  };

  const confirmDelete = (e: React.MouseEvent, tripId: string) => {
    e.stopPropagation();
    deleteTrip(tripId);
    setConfirmingDeleteId(null);
  };

  return (
    <div className="h-full bg-[#fdfdfb] flex flex-col items-center relative overflow-y-auto pb-20">
      {/* Hero Section */}
      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto mt-32 mb-16">
        <div className="flex justify-center mb-10">
          <div className="bg-white p-5 rounded-full shadow-sm border border-slate-100">
            <Compass className="w-12 h-12 text-emerald-900" />
          </div>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-light text-black tracking-tight mb-8 font-serif italic">
          Wander<span className="text-emerald-900 not-italic font-sans font-bold">AI</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-500 mb-14 max-w-xl mx-auto leading-relaxed font-light tracking-wide">
          Curating exceptional travel experiences through the lens of AI. Your personal travel architect awaits.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link
            to="/preferences"
            onClick={resetJourney}
            className="group flex items-center gap-3 bg-emerald-900 text-white px-10 py-5 rounded-full text-sm uppercase tracking-widest font-bold hover:bg-emerald-800 transition-all shadow-xl shadow-emerald-900/10 hover:-translate-y-1"
          >
            Start Your Journey
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Recent Trips Section */}
      {recentTrips.length > 0 && (
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 mt-12">
          <div className="flex items-center justify-between mb-10 border-b border-slate-100 pb-4">
            <h2 className="text-xs uppercase tracking-[0.3em] font-bold text-slate-400">Recent Archives</h2>
            <button className="text-emerald-900 font-bold text-xs uppercase tracking-widest hover:underline">Explore All</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentTrips.map((trip) => (
              <div 
                key={trip.id}
                onClick={() => handleResumeTrip(trip.id)}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all cursor-pointer border border-slate-100"
              >
                <div className="h-64 overflow-hidden relative">
                  <img 
                    src={trip.thumbnail || trip.selectedAttractions[0]?.image || `https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800&auto=format&fit=crop`} 
                    alt={trip.name} 
                    className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                  
                  {confirmingDeleteId === trip.id ? (
                    <div className="absolute inset-0 z-30 bg-slate-900/95 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center">
                      <p className="text-white text-xs uppercase tracking-widest font-bold mb-6">Delete Archive?</p>
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={(e) => cancelDelete(e)}
                          className="px-4 py-2 border border-white/20 text-white rounded-full text-[10px] uppercase tracking-widest font-bold hover:bg-white/10 transition-colors"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={(e) => confirmDelete(e, trip.id)}
                          className="px-4 py-2 bg-white text-slate-900 rounded-full text-[10px] uppercase tracking-widest font-bold hover:bg-slate-100 transition-colors"
                        >
                          Confirm
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={(e) => initiateDelete(e, trip.id)}
                      className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-red-500/80 backdrop-blur-md rounded-full text-white transition-all opacity-0 group-hover:opacity-100 z-20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}

                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-2xl font-serif italic mb-2">{trip.name}</h3>
                    <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest font-bold text-white/70">
                      <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {trip.preferences.duration} Days</span>
                      <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> {new Date(trip.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="p-6 flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">View Collection</span>
                  <div className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-emerald-900 group-hover:text-white group-hover:border-emerald-900 transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
