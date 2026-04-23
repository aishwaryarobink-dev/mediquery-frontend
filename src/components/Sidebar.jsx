import '../styles/App.scss'

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="logo">MediQuery</div>

      <button className="newChat">
        + New Chat
      </button>

      <div style={{ marginTop: '20px', opacity: 0.7 }}>
        <p>History</p>
        <p>Topics</p>
        <p>Settings</p>
      </div>
    </aside>
  )
}

export default Sidebar