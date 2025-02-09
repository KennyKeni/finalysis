import { useState } from 'react';

export default function SettingsPopup( {isOpen, closePopup} ) {
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();

  const handleSaveChanges = () => {
    console.log("Saved Changes:", { firstName, lastName });
    closePopup();
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="w-4/5 h-3/5 bg-white p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Settings</h2>
            <div className="mb-4">
              <p>
                First Name
              </p>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full p-2 border rounded-lg"
                placeholder="Enter your first name"
              />
            </div>
            <div className="mb-4">
              <p>
                Last Name
              </p>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full p-2 border rounded-lg"
                placeholder="Enter your last name"
              />
            </div>
            <button className="mr-6" onClick={handleSaveChanges}>
              Save Changes
            </button>
            <button onClick={closePopup}>
              Cancel Changes
            </button>
          </div>
        </div>
      )}
    </>
  );
}
