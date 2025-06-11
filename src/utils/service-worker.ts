

export default function registerServiceWorker () {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('SW 注册成功:', registration.scope)
        })
        .catch(registrationError => {
          console.warn('SW 注册失败:', registrationError)
        })
    })
  }
}