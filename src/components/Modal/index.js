import Modal from './src/index.vue'
export { Modal }
export function setupTable(app, name = 'c-modal') {
  app.component(name, Table)
}
