import "./Movements.css";
import Movement from "./Movement";

function Movements({ movements }) {
  return (
    <div className="movements">
      {movements.map((movement, index) => (
        <Movement position={index} amount={movement.amount} date={movement.date} />
      ))}
    </div>
  );
}

export default Movements;


