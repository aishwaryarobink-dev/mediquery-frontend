import '../styles/App.scss'
const Welcome = ({ onSelect }) => {
  const suggestions = [
    "Cold vs flu symptoms?",
    "How to lower blood pressure?",
    "Foods to reduce cholesterol?",
  ]

  return (
    <div className="center">
      <h1>Understand your health?</h1>
      <p>Ask any general health question</p>

      <div className="cards">
        {suggestions.map((item, i) => (
          <div
            key={i}
            className="card"
            onClick={() => onSelect(item)}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Welcome