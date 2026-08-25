function mountCityControls() {
  const city = document.querySelector('.city3d')
  if (!city || city.dataset.controlsReady === 'true') return

  city.dataset.controlsReady = 'true'
  city.setAttribute('aria-label', '3D AI company city')

  const controls = document.createElement('div')
  controls.className = 'city-controls'

  const button = document.createElement('button')
  button.className = 'city-enter-button'
  button.type = 'button'
  button.textContent = 'ENTER CITY'
  button.setAttribute('aria-label', 'Enter city fullscreen')

  const hint = document.createElement('span')
  hint.className = 'city-controls-hint'
  hint.textContent = 'Drag to rotate · scroll to zoom'

  controls.append(button, hint)
  city.appendChild(controls)

  const sync = () => {
    const active = document.fullscreenElement === city
    button.textContent = active ? 'EXIT CITY' : 'ENTER CITY'
    button.setAttribute('aria-label', active ? 'Exit city fullscreen' : 'Enter city fullscreen')
    city.classList.toggle('city-fullscreen', active)
  }

  button.addEventListener('click', async () => {
    try {
      if (document.fullscreenElement === city) {
        await document.exitFullscreen()
      } else if (city.requestFullscreen) {
        await city.requestFullscreen()
      }
    } catch (error) {
      city.classList.toggle('city-expanded')
    }
    sync()
  })

  document.addEventListener('fullscreenchange', sync)
}

const observer = new MutationObserver(mountCityControls)
observer.observe(document.body, { childList: true, subtree: true })
mountCityControls()
