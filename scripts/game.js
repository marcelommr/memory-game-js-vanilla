// Logic
// game is an object.
let game = {
  lockMode: false,
  //"lockMode" is a property of the object "game".
  firstCard: null,
  //"firstCard" is a property of the object "game".
  secondCard: null,
  //"secondCard" is a property of the object "game".

  setCard: function (id) {
    let card = this.cards.filter((card) => card.id === id)[0];
    if (card.flipped || this.lockMode) {
      return false;
    }
    if (!this.firstCard) {
      this.firstCard = card;
      this.firstCard.flipped = true;
      return true;
    } else {
      this.secondCard = card;
      this.secondCard.flipped = true;
      this.lockMode = true;
      return true;
    }
  },
  //   "setCard" is a method of the object "game".
  checkMatch: function () {
    if (!this.firstCard || !this.secondCard) {
      return false;
    }
    return this.firstCard.icon === this.secondCard.icon;
  },
  //   "checkMatch" is a method of the object "game".

  clearCards: function () {
    this.firstCard = null;
    this.secondCard = null;
    this.lockMode = false;
  },
  //   "clearCards" is a method of the object "game".

  unflipCards: function () {
    this.firstCard.flipped = false;
    this.secondCard.flipped = false;
    this.clearCards();
  },
  //   "unflipCards" is a method of the object "game".

  checkGameOver: function () {
    return this.cards.filter((card) => !card.flipped).length == 0;
  },
  //   "checkGameOver" is a method of the object "game".

  techs: [
    "bootstrap",
    "css",
    "electron",
    "firebase",
    "html",
    "javascript",
    "jquery",
    "mongo",
    "node",
    "react",
  ],
  //"techs" is a property of the object "game".

  cards: null,
  // "cards" is a property of the object "game".

  createCards: function () {
    this.cards = [];
    // The keyword "this" is referring to the object "game".

    this.techs.forEach((tech) => {
      this.cards.push(this.createPair(tech));
    });

    this.cards = this.cards.flatMap((pair) => pair);
    this.shuffleCards();
    return this.cards;
  },
  //   "createCards" is a method of the object "game".

  createPair: function (tech) {
    return [
      {
        id: this.createId(tech),
        icon: tech,
        flipped: false,
      },
      {
        id: this.createId(tech),
        icon: tech,
        flipped: false,
      },
    ];
  },
  //   "createPair" is a method of the object "game".
  createId: function (tech) {
    return tech + parseInt(Math.random() * 1000);
  },
  //   "createId" is a method of the object "game".

  shuffleCards: function () {
    let currentIndex = this.cards.length;
    let randomIndex = 0;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [this.cards[randomIndex], this.cards[currentIndex]] = [
        this.cards[currentIndex],
        this.cards[randomIndex],
      ];
    }
  },
  //   "shuffleCards" is a method of the object "game
};
