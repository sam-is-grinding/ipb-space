import { MapPin, Users, ChalkboardTeacher } from "@phosphor-icons/react";

const FacilityCard = ({ facility }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden">
      {/* Gambar Dummy */}
      <div className="h-48 bg-gray-200 relative">
        <img 
          src={facility.image_url || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"} 
          alt={facility.name}
          className="w-full h-full object-cover"
        />
        {/* Badge Status */}
        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${
          facility.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}>
          {facility.is_active ? "Available" : "Maintenance"}
        </div>
      </div>

      {/* Konten Kartu */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 mb-1">{facility.name}</h3>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{facility.description}</p>

        {/* Info Detail */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <MapPin size={18} weight="duotone" className="text-blue-500" />
            <span>{facility.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={18} weight="duotone" className="text-orange-500" />
            <span>{facility.capacity} Org</span>
          </div>
        </div>

        {/* Tombol Booking */}
        <button 
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          disabled={!facility.is_active}
        >
          <ChalkboardTeacher size={20} weight="fill" />
          {facility.is_active ? "Book Now" : "Unavailable"}
        </button>
      </div>
    </div>
  );
};

export default FacilityCard;