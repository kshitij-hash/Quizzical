import { useEffect, useState } from "react"
import Menu from "./Menu"
import Question from "./Question"
import { nanoid } from 'nanoid'

function App() {
  const [started, setStarted] = useState(false);
  const [count, setCount] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [checked, setChecked] = useState(false);
  const [questions, setQuestions] = useState([]);

  const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);

  useEffect(() => {
    async function getQuestion() {
      const res = await fetch('https://opentdb.com/api.php?amount=5&category=18&type=multiple&encode=base64');
      const data = await res.json();
      let q = [];
      data.results.forEach((question) => {
        q.push({
          id: nanoid(),
          question: question.question,
          correct: question.correct_answer,
          selected: null,
          checked: false,
          answers: shuffle(
            [...question.incorrect_answers, question.correct_answer]
          )
        })
      })
      setQuestions(q);
    }
    getQuestion();
  },[count])

  function handleCheck() {
    let selected = true;
    questions.forEach((question) => {
      if(question.selected === null) {
        selected = false;
        return
      }
    })
    if(!selected) {
      return
    }
    setQuestions(questions => questions.map(question => {
      return {...question, checked: true}
    }))
    setChecked(true);
    let correct = 0;
    questions.forEach((question) => {
      if(question.correct === question.selected) {
        correct++;
      }
    })
    setCorrect(correct);
  }

  function handleClickAnswer(id, answer) {
    setQuestions(questions => questions.map(question => {
      return question.id === id ? {...question, selected: answer} : question
    }))
  }

  function handlePlayAgain() {
    setCount(count => count + 1);
    setChecked(false);
  }

  const questionElement = questions ? questions.map(question => {
    return (
      <Question
        key={question.id}
        q={question}
        id={question.id}
        handleClickAnswer={handleClickAnswer}
      />
    )
  }) : []

  function start() {
    setStarted(prevStart => !prevStart)
  }
  return (
    <>
      <div className="main-container">
        <div className="content-container">
          {
            started ?
            <div className="start-content-container">
              {questionElement}
              <div className="end-div">
                {checked && <span className="score">You scored {correct}/5 correct answers.</span>}
                <button 
                  className="check" 
                  onClick={
                    checked ? handlePlayAgain : handleCheck
                  }
                >
                  {checked ? 'Play Again' : 'Check Answers'}
                </button>
              </div>
            </div> :
            <Menu start={start} />
          }
        </div>
      </div>
    </>
  )
}

export default App
