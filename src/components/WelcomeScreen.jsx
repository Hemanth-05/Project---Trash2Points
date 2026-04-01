import { useState } from 'react'

function WelcomeScreen({ onStart }) {
  const [name, setName] = useState('')
  const [apartment, setApartment] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    const trimmedName = name.trim()
    const trimmedApartment = apartment.trim()

    if (!trimmedName || !trimmedApartment) {
      return
    }

    onStart({
      name: trimmedName,
      apartment: trimmedApartment,
    })
  }

  return (
    <main className="welcome-shell">
      <section className="welcome-panel">
        <div className="welcome-copy">
          <span className="eyebrow">Apartment Recycling Habit App</span>
          <h1>Trash2Points</h1>
          <p className="subtitle">Turn recycling into a rewarding habit</p>
          <p className="description">
            Log everyday recycling actions, earn points, build a streak, and climb your
            building leaderboard with small sustainable wins.
          </p>
        </div>

        <form className="welcome-form" onSubmit={handleSubmit}>
          <label>
            Your name
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Jamie Lee"
            />
          </label>

          <label>
            Apartment or building
            <input
              type="text"
              value={apartment}
              onChange={(event) => setApartment(event.target.value)}
              placeholder="Maple Court"
            />
          </label>

          <button type="submit" className="primary-button">
            Start Recycling
          </button>
        </form>
      </section>
    </main>
  )
}

export default WelcomeScreen
