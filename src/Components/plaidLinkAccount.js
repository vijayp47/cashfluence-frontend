import React, { useEffect, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
const BASE_URL = process.env.REACT_APP_BASE_URL;  

const PlaidLink = () => {
  const [linkToken, setLinkToken] = useState(null); // State to store the link token

  useEffect(() => {
    // Fetch the link token from your backend when the component mounts
    fetch(`${BASE_URL}/plaid/create_link_token`, {
      method: 'POST', // Make sure your backend is expecting a POST request
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setLinkToken(data.link_token); // Save link token to state
      })
      .catch((error) => console.error('Error fetching link token:', error));
  }, []);



  // Handle the success event after the user successfully links their account
  const { open, ready } = usePlaidLink({
    token: linkToken, // Use the link token from your backend
    onSuccess: (public_token, metadata) => {
       // Send the public_token to your backend to exchange for an access_token
      fetch(`${BASE_URL}/plaid/public_token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ public_token }), // Send public token to backend
      })
        .then((response) => response.json())
        .then((data) => {
         
          localStorage.setItem("plaidToken",data.accessToken)
         
        })
        .catch((error) => console.error('Error:', error));
    },
  
  });

  // Render a loading message or the Plaid Link button based on the linkToken availability
  if (!linkToken) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* Button to open Plaid Link when ready */}
      <button onClick={() => open()} disabled={!ready}>
        Link your account
      </button>
    </div>
  );
};

export default PlaidLink;
