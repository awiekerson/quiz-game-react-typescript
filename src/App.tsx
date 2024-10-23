
import './App.scss'
import { useEffect } from 'react';
import Score from './components/Score.tsx';
import Game from './components/Game.tsx';
import { useQuiz, Question, QuestionsResponse} from './QuizContext.tsx';
import FullPageLoader from "./components/FullPageLoader.tsx"


function App() {

  const {state, dispatch} = useQuiz();

async function fetchQuestion() {

  try {
    dispatch({type: "setStatus", payload: "fetching"});
    const response = await fetch('https://opentdb.com/api.php?amount=1');
    let data: QuestionsResponse = await(response.json());

    if (data.response_code === 0) {
      let question : Question = data.results[0];
      console.log(question);
       let randomIndex = Math.round(Math.random() * question.incorrect_answers.length);
      question.incorrect_answers.splice(randomIndex, 0, question.correct_answer);


      dispatch({type: "setStatus", payload: "ready"});
      dispatch({type: "setQuestion", payload: question});

    } else {
      dispatch({type: "setStatus", payload: "error"});
    }

  } catch (err){
    console.log(err);
    dispatch({type: "setStatus", payload: "error"});

  }

  
  
}


  useEffect(() => {
    if(state.gameStatus == "idle") {
      fetchQuestion();
    }
  });
  //Fired anytime there is a change in the state and once at the beginning

  return (
    <>
    { state.gameStatus == 'fetching' ?  
    <FullPageLoader/>
     : state.gameStatus == "error" ? 
     <p>Error...</p>

     : state.gameStatus == "ready" ?  
      <>
        <Score />
        <Game /> 
      </> 
     :
      ''
    }

    </>
  )
}

export default App
