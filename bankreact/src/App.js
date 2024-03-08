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
  const exampleDate = "2024-03-05T12:00:00"; // La fecha de ejemplo debe ser en formato ISO 8601
  //Si no recogemos ningun dato en movimientos, me lo das como un array vacío
  const { movements = [], owner: user = "" } = account;
  //Llamada al servidor
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
        console.log(response, response.status, response.ok);
        const newMovements = [...movements, transaction];
        setAccount({ ...account, movements: newMovements });
      })
      .catch((error) =>
        console.error("Error al enviar la transacción:", error)
      );
  };
  // Función para manejar depósitos
  const handleDeposit = (amount) =>
    sendTransactionToServer({
      type: "deposit",
      date: new Date().toISOString(),
      amount,
    });
  const handleWithdrawal = (amount) => {
    const withdrawalAmount = Math.abs(amount);
    const balance = account.movements.reduce((acc, mov) => acc + mov.amount, 0);
    console.log(withdrawalAmount, balance);
    if (withdrawalAmount <= balance) {
      //Retirar la transacción de retiro
      sendTransactionToServer({
        type: "withdrawal",
        date: new Date().toISOString(),
        amount: -withdrawalAmount,
      });
      // Actualizar el array de movimientos
      const newMovements = [
        ...movements,
        { type: "withdrawal", amount: -withdrawalAmount },
      ];
      // Calcular el nuevo balance
      const newBalance = newMovements.reduce(
        (acc, movement) => acc + movement.amount,
        0
      );
      // Actualizar el estado de la cuenta con los nuevos movimientos y saldo
      setAccount({
        ...account,
        movements: newMovements,
        balance: newBalance,
      });
    } else {
      alert("No tienes suficiente saldo");
    }
  };
  // Función para manejar transferencias
  const handleTransfer = (amount, targetAccount) => {
    const withdrawalAmount = -Math.abs(amount);
    const depositAmount = Math.abs(amount);
    const newMovements = [
      ...movements,
      { type: "withdrawal", amount: withdrawalAmount },
      { type: "deposit", amount: depositAmount, targetAccount },
    ];
    // Calcular el nuevo balance sumando todos los montos de los movimientos
    const newBalance = newMovements.reduce(
      (acc, movement) => acc + movement.amount,
      0
    );
    // Actualizar el estado de la cuenta con los nuevos movimientos
    setAccount({
      ...account,
      movements: newMovements,
    });
    // Enviar la transacción al servidor
    sendTransactionToServer({ type: "transfer", amount, targetAccount });
    // Actualizar el estado del balance después de la transferencia
    setAccount((prevAccount) => ({
      ...prevAccount,
      balance: newBalance,
    }));
  };
  const handleLogin = (user, pin) => {
    // Aquí realizamos la lógica de autenticación, por ejemplo, enviamos los datos a un servidor.
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
          {/* Función para realizar depósitos */}
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
          {/* Función para realizar retiros */}
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
          {/* Formulario para realizar transferencias */}
          <div className="operation operation--transfer">
            <h2>Transferencia</h2>
            <form
              className="form form--transfer"
              onSubmit={(e) => {
                e.preventDefault();
                const amount = parseFloat(e.target.elements.amount.value);
                const targetAccount = e.target.elements.targetAccount.value;
                handleTransfer(amount, targetAccount);
              }}
            >
              {/* Campo de entrada para la cantidad a transferir */}
              <input
                type="number"
                step="0.01"
                className="form__input form__input--amount"
                name="amount"
                required
              />
              {/* Campo de entrada para la cuenta de destino */}
              <input
                type="text"
                className="form__input form__input--to"
                name="targetAccount"
                placeholder="Target Account"
                required
              />
              {/* Botón de envío del formulario */}
              <button type="submit" className="form__btn form__btn--transfer">
                &rarr;
              </button>
              {/* Etiquetas para los campos del formulario */}
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









