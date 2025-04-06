// EventActions.jsx

const EventRegistration = ({ 
  onRegister, 
  onShare, 
  userId,
  event,
  registerText = "Register for Event",
  registeredText = "Registered ✓"
}) => {
  // Check if this user is already registered for this event
  const isRegistered = event.registeredUsers && event.registeredUsers.includes(userId);
  
  return (
    <div className="space-y-3">
      <button
        className={`w-full py-3 rounded-xl transition-colors ${
          isRegistered 
            ? "bg-green-600 text-white hover:bg-green-700" 
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
        onClick={onRegister}
        disabled={isRegistered}
      >
        {isRegistered ? registeredText : registerText}
      </button>
      <button
        className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-colors"
        onClick={onShare}
      >
        Share Event
      </button>
    </div>
  );
};

export default EventRegistration;