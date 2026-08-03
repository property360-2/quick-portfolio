import { useState, useEffect } from 'react';

function UserList() {
  // 1. Define states for the different lifecycles
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Fetch data when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true); // Start loading
        const response = await fetch('https://typicode.com');
        
        // Check if the server responded with an error (e.g., 404 or 500)
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUsers(data); // Success: Store data
      } catch (err) {
        setError(err.message); // Error: Store error message
      } finally {
        setLoading(false); // Turn off loading regardless of success/fail
      }
    };

    fetchUsers();
  }, []); // Empty dependency array means this runs exactly ONCE on mount

  // 3. Conditional Rendering based on state
  if (loading) return <p>Loading users, please wait...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  // 4. Success: Display the data
  return (
    <div>
      <h2>User Directory</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <strong>{user.name}</strong> — {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;
