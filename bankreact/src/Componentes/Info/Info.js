import React from 'react';
import './Info.css';

function Account({ account }) {
    if (!account || Object.keys(account).length === 0) {
        return null;
    }
    return (
        <div className="account-container">
            <div className="account">
                <h2>Owner: {account.owner}</h2>
                <p>Username: {account.username}</p>
                <p>Number Account: {account.numberAccount}</p>
                <p>Address: {account.address}</p>
                <p>Country: {account.country}</p>
                <p>National ID Number: {account.nationalIdNumber}</p>
            </div>
        </div>
    );
}

export default Account;
