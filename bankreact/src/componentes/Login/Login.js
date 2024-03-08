import "./Login.css";
import { useRef } from "react";

function Login({ onLogin }) {
  
  const userRef = useRef(null);
  const pinRef = useRef(null);

  const handleLogin = (e) => {
    e.preventDefault();
    const user = userRef.current.value;
    const pin = Number(pinRef.current.value);
    onLogin(user, pin);


  };
  return (
    <div>
      <h1>Bienvenido</h1>
      <form className="login">
        <label>
          Usuario:
          <input
            type="text"
            placeholder="user"
            className="login__input login__input--user"
            ref={userRef}
          />
        </label>
        <br />
        <label>
          Contraseña:
          <input
            type="text"
            placeholder="PIN"
            maxlength="4"
            className="login__input login__input--pin"
            ref={pinRef}
          />
        </label>
        <br />
        <button className="login__btn" onClick={handleLogin}>
          Iniciar sesión
        </button>
      </form>
    </div>
  );
}

export default Login;
