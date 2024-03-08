import React, { useState } from "react";
import "./App.css";
import Welcome from "./Componentes/Welcome/Welcome";
import Login from "./Componentes/Login/Login";
import Summary from "./Componentes/Summary/Summary";
import Movements from "./Componentes/Movements/Movements";
import Balance from "./Componentes/Balance/Balance";
import CountdownTimer from "./Componentes/CountDown/CountDown";
import Account from "./Componentes/Info/Info";

function App() {
  const [account, setAccount] = useState({});
  const [token, setToken] = useState();

  const { movements = [], owner: user = "" } = account;

  const handleDeposit = (amount) => {

    const newMovements = [...movements, { type: "deposit", amount }];
    setAccount({ ...account, movements: newMovements });
    sendTransactionToServer({date: new Date().toISOString(), amount });
  };

  // Función para manejar retiros
  const handleWithdrawal = (amount) => {

    const withdrawalAmount = -Math.abs(amount);

    const newMovements = [
      ...movements,
      { type: "withdrawal", amount: withdrawalAmount },
    ];
    setAccount({ ...account, movements: newMovements });

    sendTransactionToServer({date: new Date().toISOString(), amount: withdrawalAmount });
    
  };

  const handleTransfer = (amount, targetAccount) => {

    const withdrawalAmount = -Math.abs(amount);
    const depositAmount = Math.abs(amount);

    const newMovements = [
      ...movements,
      { type: "withdrawal", amount: withdrawalAmount },
      { type: "deposit", amount: depositAmount, targetAccount },
    ];

    setAccount({ ...account, movements: newMovements });
    sendTransactionToServer({ type: "transfer", amount, targetAccount });
  };

  const handleLogin = (user, pin) => {
    // Validamos si el usuario y la contraseña son correctos.
    fetch(`http://localhost:4000/login?username=${user}&pin=${pin}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error en la llamada a la API");
        }
        return res.json();
      })
      .then((datos) => {
        setAccount(datos.account);
        setToken(datos.token);
        console.log(datos);
      })
      .catch((error) => console.error(error, "estas con error"));
  };

  const sendTransactionToServer = (transaction) => {
    // Envía la transacción al servidor
    fetch(`http://localhost:4000/movements?token=${token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(transaction),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error en la llamada a la API");
        }
        return res.json();
      })
      .then((response) => {
        console.log("Transacción enviada con éxito:", response);
        const newMovements = [...movements, transaction];
        setAccount({ ...account, movements: newMovements });
      })
      .catch((error) =>
        console.error("Error al enviar la transacción:", error)
      );
  };

  return (
    <>
      <nav>

        <Welcome user={user} />

        <Login onLogin={handleLogin} />
      </nav>
      <Account account={account} />
      {user && (
        <main className="app">
          <Balance movements={movements} />
          <Movements movements={movements} />
          <Summary movements={movements} />
          <div className="operation operation--loan">
            <h2>Haz un depósito</h2>
            <form
              className="form form--loan"
              onSubmit={(e) => {
                e.preventDefault();
                const amount = parseFloat(e.target.elements.amount.value);
                handleDeposit(amount);
              }}
            >
              <input
                type="number"
                step="0.01"
                className="form__input form__input--amount"
                name="amount"
                required
              />
              <button type="submit" className="form__btn form__btn--deposit">
                &uarr;
              </button>
              <label className="form__label">Amount</label>
            </form>
          </div>
          <div className="operation operation--withdrawal">
            <h2>Haz un retiro</h2>
            <form
              className="form form--withdrawal"
              onSubmit={(e) => {
                e.preventDefault();
                const amount = parseFloat(e.target.elements.amount.value);
                handleWithdrawal(amount);
              }}
            >
              <input
                type="number"
                step="0.01"
                className="form__input form__input--amount"
                name="amount"
                required
              />
              <button type="submit" className="form__btn form__btn--withdrawal">
                &darr;
              </button>
              <label className="form__label">Amount</label>
            </form>
          </div>
          <div className="operation operation--transfer">
            <h2>Transferencia</h2>
            <form className="form form--transfer">
              {(e) => {
                e.preventDefault();
                const amount = parseFloat(e.target.elements.amount.value);
                const targetAccount = e.target.elements.targetAccount.value;
                handleTransfer(amount, targetAccount);
              }}

              <input
                type="number"
                step="0.01"
                className="form__input form__input--amount"
                name="amount"
                required
              />
              <input
                type="text"
                className="form__input form__input--to"
                name="targetAccount"
                placeholder="Target Account"
                required
              />
              <button type="submit" className="form__btn form__btn--transfer">
                &rarr;
              </button>
              <label className="form__label">Transfer to</label>
              <label className="form__label">Amount</label>
            </form>
          </div>
          <div className="operation operation--close">
            <h2>Close account</h2>
            <form className="form form--close">
              <input type="text" className="form__input form__input--user" />
              <input
                type="password"
                maxlength="6"
                className="form__input form__input--pin"
              />
              <button className="form__btn form__btn--close">&rarr;</button>
              <label className="form__label">Confirm user</label>
              <label className="form__label">Confirm PIN</label>
            </form>
          </div>
          <p className="logout-timer">
            <CountdownTimer />
          </p>
        </main>
      )}
    </>
  );
}

export default App;