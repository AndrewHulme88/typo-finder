const readline = require('readline');

const wordRegex = /^[a-z]{3,}$/i;

class TypoFinder {
  constructor(word) {
    if (!wordRegex.test(word)) {
      throw new Error(`Invalid word: ${word}`);
    }

    this.word = word;
    this.typoRegex = this.generateTypoRegex(word);
  }

  generateTypoRegex(word) {
    const addRegexStrs = this.generateAddRegexStrs(word);
    const deleteRegexStrs = this.generateDeleteRegexStrs(word);
    const replaceRegexStrs = this.generateReplaceRegexStrs(word);
    const transposeRegexStrs = this.generateTransposeRegexStrs(word);

    const regexStr = `(?:${addRegexStrs.join('|')}|${deleteRegexStrs.join('|')}|${replaceRegexStrs.join('|')}|${transposeRegexStrs.join('|')})\\b`;
    return new RegExp(regexStr, 'gi');
  }

  generateAddRegexStrs(word) {
    const regexStrs = [];
    for (let i = 1; i < word.length; i++) {
      const regexStr = word.slice(0, i) + '[a-z]' + word.slice(i);
      regexStrs.push(regexStr);
    }
    return regexStrs;
  }

  generateDeleteRegexStrs(word) {
    const regexStrs = [];
    for (let i = 0; i < word.length; i++) {
      const regexStr = word.slice(0, i) + word.slice(i + 1);
      regexStrs.push(regexStr);
    }
    return regexStrs;
  }

  generateReplaceRegexStrs(word) {
    const regexStrs = [];
    for (let i = 0; i < word.length; i++) {
      const regexStr = word.slice(0, i) + '[^' + word[i] + ']' + word.slice(i + 1);
      regexStrs.push(regexStr);
    }
    return regexStrs;
  }

  generateTransposeRegexStrs(word) {
    const regexStrs = [];
    for (let i = 1; i < word.length; i++) {
      const regexStr = word.slice(0, i - 1) + word[i] + word[i - 1] + word.slice(i + 1);
      regexStrs.push(regexStr);
    }
    return regexStrs;
  }

  findTypos(text) {
    const matches = text.match(this.typoRegex);
    if (!matches) {
      return [];
    }

    const typos = [];
    for (const match of matches) {
      if (match.toLowerCase() !== this.word.toLowerCase()) {
        typos.push({ typo: match, index: text.indexOf(match) });
      }
    }
    return typos;
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askForWord() {
  rl.question('Enter a word: ', (word) => {
    if (!wordRegex.test(word)) {
      console.log('Invalid word. Please enter a word with at least 3 letters.');
      askForWord();
      return;
    }

    const typoFinder = new TypoFinder(word);
    const text = 'Hello, helll, helol, hlelo, hillo, helloo';
    const typos = typoFinder.findTypos(text);

    console.log(`Typos found: ${typos.map((typo) => typo.typo).join(', ')}`);

    askForNextAction();
  });
}

function askForNextAction() {
  rl.question('Do you want to enter another word? (y/n): ', (answer) => {
    if (answer.toLowerCase() === 'y') {
      askForWord();
    } else if (answer.toLowerCase() === 'n') {
      console.log('Goodbye!');
      process.exit(0);
    } else {
      console.log('Invalid input. Please enter y or n.');
      askForNextAction();
    }
  });
}

askForWord();
