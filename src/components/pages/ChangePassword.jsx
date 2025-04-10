import { useState } from "react";
import axios from "axios";
import { baseURLAtom } from "../../recoil/atoms";
import { useRecoilValue } from "recoil";

const ChangePasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const baseURL = useRecoilValue(baseURLAtom);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const apiToken = localStorage.getItem("access"); // Replace with your token source
  console.log("API Token=="+apiToken);

  // Handle password change submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const formData = {
      password,
      confirm_password: confirmPassword,
    };

    try {
      setLoading(true);
      const response = await axios.post(
        `${baseURL}api/change-password/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${apiToken}`,
          },
        }
      );
      setSuccessMessage("Password changed successfully!");
      setPassword("");
      setConfirmPassword("");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error.response ? error.response.data.detail : "An error occurred");
    }
  };

  return (
    <div className="change-password-page">
      <h1 className="font-bold text-2xl mb-4">Change Password</h1>

      <form onSubmit={handleSubmit} className="m-4 p-4 border rounded-lg shadow-md max-w-sm w-full mx-auto">
        <div className="gap-2">
          {/* Password Field */}
          <div className="flex-1">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                {passwordVisible ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="flex-1 mt-4">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={confirmPasswordVisible ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                {confirmPasswordVisible ? "🙈" : "👁️"}
              </button>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-end justify-end mt-4">
          <button
            type="submit"
            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-[#167fc7]"
            disabled={loading}
          >
            {loading ? "Changing..." : "Change Password"}
          </button>
        </div>
      </form>

      {/* Success/Failure Message */}
      {error && (
        <div className="error-message text-red-500 mt-4">
          <p>{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="success-message text-green-500 mt-4">
          <p>{successMessage}</p>
        </div>
      )}
    </div>
  );
};

export default ChangePasswordPage;
