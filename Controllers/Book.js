const fs = require('fs');
const path = require('path');
const Book = require('../models/Books');

exports.addBook = (req, res) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject.id;
  delete bookObject.userId;
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
  });

  book.save()
    .then(() => { res.status(201).json({ message: 'Objet enregistré !' }); })
    .catch((error) => { res.status(400).json({ error }); });
};
exports.modifyBook = (req, res) => {
  const bookObject = req.file ? {
    ...JSON.parse(req.body.book),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
  } : { ...req.body };

  delete bookObject.userId;
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId !== req.auth.userId) {
        res.status(401).json({ message: 'Not authorized' });
      } else {
        Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet modifié!' }))
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};
exports.deleteBook = (req, res) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId !== req.auth.userId) {
        return res.status(401).json({ message: 'Not authorized' });
      }
      if (book.imageUrl) {
        const filename = book.imageUrl.split('/images/')[1];
        const filePath = path.join(__dirname, '..', 'public', 'images', filename);
        fs.unlink(filePath, (err) => {
          if (err) {
            return res.status(500).json({ error: 'File deletion failed' });
          }
        });
        Book.deleteOne({ _id: req.params.id })
          .then(() => { res.status(200).json({ message: 'Objet supprimé !' }); })
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};
exports.getOneBook = (req, res) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }));
};
exports.getAllBook = (req, res) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};
exports.addRate = (req, res) => {
  const { userId, rating: grade } = req.body;
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        res.status(404).json({ message: 'Livre non trouvé.' });
      }
      const existingRate = book.ratings.find((rating) => rating.userId === userId);
      if (existingRate) {
        res.status(400).json({ message: 'Vous avez déjà noté ce livre' });
      }
      book.ratings.push({ userId, grade });
      const totalRating = book.ratings.reduce((total, rating) => total + rating.grade, 0);
      const averageRating = Math.round((totalRating / book.ratings.length) * 100) / 100;
      book.set('averageRating', averageRating);

      book.save()
        .then(() => res.status(200).json(book))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.bestRating = (req, res) => {
  Book.find()
    .then((books) => {
      books.sort((a, b) => b.averageRating - a.averageRating);
      const top3Books = books.slice(0, 3);
      res.status(200).json(top3Books);
    })
    .catch((error) => res.status(400).json({ error }));
};
