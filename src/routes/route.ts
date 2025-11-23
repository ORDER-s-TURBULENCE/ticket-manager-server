import { Hono } from 'hono'
import * as movieController from '../controllers/movieController.js'
import * as formController from '../controllers/formController.js'
import * as ticketController from '../controllers/ticketController.js'
import * as sheetController from '../controllers/sheetController.js'

const api = new Hono()
const admin = new Hono()
const user = new Hono()

// === Admin routes ===
api.route('/admin', admin)

// Forms
admin.get('/forms', formController.getForms)
admin.get('/forms/:formId', formController.getFormById)
admin.put('/forms/:formId', formController.putForm)
admin.delete('/forms/:formId', formController.deleteForm)

// Tickets
admin.get('/tickets', ticketController.getTickets)
admin.post('/tickets', ticketController.postTickets)
admin.get('/tickets/:ticketId', ticketController.getTicketById)
admin.put('/tickets/:ticketId', ticketController.putTicket)
admin.delete('/tickets/:ticketId', ticketController.deleteTicket)

// Sheets (nested under movie)
admin.get('/movies/:movieId/sheets', sheetController.getSheets)
admin.post('/movies/:movieId/sheets', sheetController.postSheet)
admin.get('/movies/:movieId/sheets/:sheetId', sheetController.getSheet)
admin.patch('/movies/:movieId/sheets/:sheetId', sheetController.patchSheet)
admin.delete('/movies/:movieId/sheets/:sheetId', sheetController.deleteSheet)

// Movies
admin.get('/movies', movieController.getMovies)
admin.post('/movies', movieController.postMovies)


// === User routes ===
api.route('/user', user)

// Forms
user.get('/forms/:formId', formController.getFormById)
user.post('/forms', formController.postForm)

// Tickets
user.get('/tickets/form/:formId', ticketController.getTicketsByFormId)
user.put('/tickets/:ticketId', ticketController.putTicket)

export default api
