// import { buildLetter, Wordle } from "../src/wordle.js";
import {jest} from '@jest/globals'

jest.unstable_mockModule('../src/words.js', () => {
    return {
        getWord: jest.fn(() => 'APPLE'),
        isWord: jest.fn(() => true)
    }
})

const { Wordle, buildLetter } = await import('../src/wordle.js');

describe('building a letter object', () => { 
    test('returns a letter object', () => {
        const letter = buildLetter('A', 'PRESENT')
        expect(letter).toEqual({letter: 'A', status: 'PRESENT'})
    })
 })

 describe('constructing a new Wordle game', ()=> {
    test('sets maxGuesses to 6 if no argument is passed', () => {
        const wordle = new Wordle();
        expect(wordle.maxGuesses).toBe(6)
    })

    test('sets maxGuesses to the argument passed', () => {
        const wordle = new Wordle(10)
        expect(wordle.maxGuesses).toBe(10)
    })

    test('sets guesses to an array of length maxGuesses', () => {
        const wordle = new Wordle()
        expect(wordle.guesses.length).toBe(6)
    })

    test('sets currGuess to 0', () => {
        const wordle = new Wordle()
        expect(wordle.currGuess).toBe(0)
    })

    test('sets word to a word from getWord', () => {
        const wordle = new Wordle()
        expect(wordle.word).toBe('APPLE')
    })
 })

describe('building a guess array from a string', () => {
    test('sets the status of a correct letter to CORRECT', () => {
        const wordle = new Wordle()
        const guess = wordle.buildGuessFromWord('A____')
        expect(guess[0].status).toBe('CORRECT')
    })

    test('sets the status of a present letter to PRESENT', () => {
        const wordle = new Wordle()
        const guess = wordle.buildGuessFromWord('E____')
        expect(guess[0].status).toBe("PRESENT")
    })

    test('sets the status of an absent letter to ABSENT', () => {
        const wordle = new Wordle()
        const guess = wordle.buildGuessFromWord('Z____')
        expect(guess[0].status).toBe('ABSENT')
    })
})

describe('making a guess', () => {
    test('throws an error if no more guesses are allowed', () => {
      const wordle = new Wordle(1);
      wordle.appendGuess('GUESS');
      expect(() => wordle.appendGuess('GUESS')).toThrow();
    });
  
    test('throws an error if the guess is not of length 5', () => {
      const wordle = new Wordle();
      expect(() => wordle.appendGuess('LONG GUESS')).toThrow();
    });
  
    test('throws an error if the guess is not a word', () => {
      const wordle = new Wordle();
      mockIsWord.mockReturnValueOnce(false);
      expect(() => wordle.appendGuess('GUESS')).toThrow();
    });
  
    test('appends the result of buildGuessFromWord to the guesses array', () => {
      const wordle = new Wordle();
      wordle.appendGuess('GUESS');
      expect(wordle.guesses[0]).toEqual(wordle.buildGuessFromWord('GUESS'));
    });
  
    test('increments the current guess', () => {
      const wordle = new Wordle();
      wordle.appendGuess('GUESS');
      expect(wordle.currGuess).toBe(1);
    });
  });

  describe('checking if the Wordle has been solved', () => {
    test('returns true if the latest guess is the correct word', () => {
      const wordle = new Wordle();
      wordle.appendGuess('APPLE');
      expect(wordle.isSolved()).toBe(true);
    });
  
    test('returns false if the latest guess is not the correct word', () => {
      const wordle = new Wordle();
      wordle.appendGuess('GUESS');
      expect(wordle.isSolved()).toBe(false);
    });
  });
  
  describe('checking if the game should end', () => {
    test('returns true if the latest guess is the correct word', () => {
      const wordle = new Wordle();
      wordle.appendGuess('APPLE');
      expect(wordle.shouldEndGame()).toBe(true);
    });
  
    test('returns true if there are no more guesses left', () => {
      const wordle = new Wordle(1);
      wordle.appendGuess('GUESS');
      expect(wordle.shouldEndGame()).toBe(true);
    });
  
    test('returns false if no guess has been made', () => {
      const wordle = new Wordle();
      expect(wordle.shouldEndGame()).toBe(false);
    });
  
    test('returns false if there are guesses left and the word has not been guessed', () => {
      const wordle = new Wordle();
      wordle.appendGuess('GUESS');
      expect(wordle.shouldEndGame()).toBe(false);
    });
  });