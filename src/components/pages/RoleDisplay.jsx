import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../ui/button"; // Assuming you're using a button component
import { useRecoilValue } from "recoil";
import { baseURLAtom, accessTokenAtom } from "@/recoil/atoms"; // Assuming you store baseURL and token in Recoil

const RoleDisplay = () => {
  const [roles, setRoles] = useState([]);  // State to store roles
  const [loading, setLoading] = useState(true);  // Loading state
  const [error, setError] = useState(null);  // Error state

  const baseURL = useRecoilValue(baseURLAtom);  // Fetch the baseURL from Recoil
  const accessToken = useRecoilValue(accessTokenAtom);  // Fetch the accessToken from Recoil

  useEffect(() => {
    // Fetch roles from the API
    const fetchRoles = async () => {
      try {
        const response = await axios.get(`${baseURL}api/get_roles/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,  // Use the token from Recoil
          },
        });

        // Log the response to see the structure
        console.log(response);

        // Directly use response.data if it's an array
        if (Array.isArray(response.data)) {
          setRoles(response.data);  // Store the fetched roles in state
        } else {
          setError("No roles found.");
        }
      } catch (err) {
        console.error("Error fetching roles:", err);
        setError("Failed to fetch roles.");  // Handle errors
      } finally {
        setLoading(false);  // Set loading to false once the data is fetched
      }
    };

    fetchRoles();  // Call the function to fetch roles
  }, [baseURL, accessToken]);  // Add baseURL and accessToken as dependencies

  if (loading) {
    return <div>Loading...</div>;  // Show loading text while data is being fetched
  }

  if (error) {
    return <div>{error}</div>;  // Show error message if something went wrong
  }

  return (
    <div className="role-display">
      <h1>Roles</h1>
      <table className="table-auto w-full border-collapse">
        <thead>
          <tr>
            <th>Sr No</th>
            <th>Name</th>
            <th>Permissions</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role, index) => (
            <tr key={role.id}>
              <td>{index + 1}</td>
              <td>{role.name}</td>
              <td>
                {/* Display Permissions (You can choose to display a subset or full permissions) */}
                <Button
                  onClick={() => {
                    // Handle permissions click (navigate to permissions page)
                    window.location.href = `/role-permissions/${role.id}`;
                  }}
                >
                  View Permissions
                </Button>
              </td>
              <td>
                <Button
                  onClick={() => {
                    // Handle edit action (navigate to edit role page)
                    window.location.href = `/edit-role/${role.id}`;
                  }}
                >
                  Edit Role
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoleDisplay;
