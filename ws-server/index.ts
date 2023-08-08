import cors from 'cors';
import express from 'express';
import { Server, Socket } from 'socket.io';

type PollState = {
  question: string;
  options: {
    id: number;
    text: string;
    description: string;
    votes: string[];
  }[];
};

interface ClientToServerEvents {
  vote: (optionId: number) => void;
  askForStateUpdate: () => void;
}
interface ServerToClientEvents {
  updateState: (state: PollState) => void;
}
interface InterServerEvents { }
interface SocketData {
  user: string;
}

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
const server = require('http').createServer(app);
const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

io.use(addUserToSocketDataIfAuthenticated);

async function addUserToSocketDataIfAuthenticated(socket: Socket, next: (err?: Error) => void) {
  const user = socket.handshake.auth.token;
  if (user) {
    try {
      socket.data = { ...socket.data, user: user };
    } catch (err) {}
  }
  next();
}

const poll: PollState = {
  question: "What are eating for lunch ✨ Let's order",
  options: [
    {
      id: 1,
      text: 'Party Pizza Place',
      description: 'Best pizza in town',
      votes: [],
    },
    {
      id: 2,
      text: 'Best Burger Joint',
      description: 'Best burger in town',
      votes: [],
    },
    {
      id: 3,
      text: 'Sus Sushi Place',
      description: 'Best sushi in town',
      votes: [],
    },
  ],
};

app.get('/', (req, res) => {
  res.send(`<h1>Hello World</h1>`);
});

io.on('connection', (socket) => {
  console.log('a user connected', socket.data.user);

  socket.on('askForStateUpdate', () => {
    console.log('client asked For State Update');
    socket.emit('updateState', poll);
  });

  socket.on('vote', (optionId: number) => {
    // If user has already voted, remove their vote.
    poll.options.forEach((option) => {
      option.votes = option.votes.filter((user) => user !== socket.data.user);
    });
    // And then add their vote to the new option.
    const option = poll.options.find((o) => o.id === optionId);
    if (!option) {
      return;
    }
    option.votes.push(socket.data.user);
    io.emit('updateState', poll);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(8000, () => {
  console.log('listening on *:8000');
});
