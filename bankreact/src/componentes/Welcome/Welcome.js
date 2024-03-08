import './Welcome.css'

function Welcome({user}) {
  //Obtener el nombre del usuario (sin apellido)
  const name = user.split (' ')[0]
  
    return (
    <>
      <img src="logo.png" alt="Logo" className="logo" />
    </>
  );
}

export default Welcome;
