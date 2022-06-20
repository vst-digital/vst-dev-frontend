const MockAdapter = require('axios-mock-adapter')
const axios = require('axios')
const Mock = new MockAdapter(axios)
const date = new Date()

const calendarEventDB = {
//This is how the API get method response should be structured
    events: [
        {
            id: '344jdfher3wh23',
            title: 'Test Event One',
            start: new Date(date.getFullYear(), date.getMonth(), 1),
            end: new Date(date.getFullYear(), date.getMonth(), 3),
        },
        {
            id: 'dfdfdsfedrevcr',
            title: 'Birthday',
            start: new Date(),
            end: new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate() + 2
            ),
        },
    ],
}

Mock.onGet('/api/calendar/events/all').reply((config) => {
    return [200, calendarEventDB.events]
})

Mock.onPost('/api/calendar/events/add').reply((config) => {
    let { start, end, ...others } = JSON.parse(config.data)
    let event = {
        start: new Date(start),
        end: new Date(end),
        ...others,
    }
    calendarEventDB.events.push(event)
    return [200, calendarEventDB.events]
})

Mock.onPost('/api/calendar/events/update').reply((config) => {
    let updatedEvent = JSON.parse(config.data)

    if (updatedEvent.event) {
        // resize or move event handling
        calendarEventDB.events.map((event) => {
            if (event.id === updatedEvent.event.id) {
                event.start = new Date(updatedEvent.start)
                event.end = new Date(updatedEvent.end)
            }
            return event
        })
    } else {
        calendarEventDB.events.map((event) => {
            if (event.id === updatedEvent.id) {
                event.start = new Date(updatedEvent.start)
                event.end = new Date(updatedEvent.end)
                event.title = updatedEvent.title
                event.location = updatedEvent.location
                event.note = updatedEvent.note
            }

            return event
        })
    }

    return [200, calendarEventDB.events]
})

Mock.onPost('/api/calendar/events/delete').reply((config) => {
    let event = JSON.parse(config.data)

    let index = { i: 0 }

    calendarEventDB.events.forEach((element) => {
        if (element.id === event.id) {
            return [200, calendarEventDB.events.splice(index.i, 1)]
        }
        index.i++
    })

    return [200, calendarEventDB.events]
})

Mock.onAny().passThrough()
