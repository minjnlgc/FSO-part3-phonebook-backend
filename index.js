const express = require("express");
const morgan = require('morgan');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'));
app.use(cors());

morgan.token('content', (request, response) => {
    if (!request.body) {
        return;
    }
    return JSON.stringify(request.body)
})

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456",
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523",
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345",
    },
    {
        id: 4,
        name: "Mary Poppendieck",
        number: "39-23-6423122",
    },
];

const generateId = () => {
    return Math.floor(Math.random() * 1000);
}

app.get('/api/persons', (request, response) => {
    response.send(persons);
})

app.get('/info', (request, response) => {
    const date = new Date();
    const message = `<p>Phonebook has info for ${persons.length} people</p><p>${date.toString()}</p>`
    response.send(message)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id);

    if (!person) {
        response.status(404).end();
    }
    response.send(person);
})

app.delete('/api/persons/:id', (request, response) => {

    const id = Number(request.params.id);
    persons = persons.filter(p => p.id !== id);

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body;

    console.log('post request')
    console.log('post body:', body)

    if (!body.name | !body.number) {
        console.log('missing content')
        return response.status(400).json({
            error: 'missing name or number'
        }).end();

    } else if (persons.find(p => p.name === body.name)) {
        console.log('duplicate name');
        return response.status(400).json({
            error: 'name must be unique'
        }).end();
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    response.send(person)
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
