const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
} else if (process.argv.length > 5) {
  console.log("did you type the number without double quotes?");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://mininm:${password}@fso.hduehj4.mongodb.net/?retryWrites=true&w=majority&appName=FSO`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 5) {
  const name = process.argv[3];
  const number = process.argv[4];

  const person = new Person({
    name: name,
    number: number,
  });

  person.save().then((res) => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
} else if (process.argv.length === 3) {
  Person.find({}).then((res) => {
    res.forEach((p, i) => {
      if (i === 0) {
        console.log("phonebook:");
      }
      console.log(`${p.name} ${p.number}`);
    });

    mongoose.connection.close();
  });
}
