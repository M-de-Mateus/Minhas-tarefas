import { useState } from 'react';
import './home.css'

export default function Home(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

    return(
      <div className='home-container'>
        <h1>Tarefas</h1>
        <span>Anote todas suas tarefas de forma fácil!</span>

        <form>
          <input type='text' placeholder='Digite o seu email' value={email} onChange={(e) => setEmail(e.target.value)}/>
          <input autoComplete={false} type='password' placeholder='******' value={password} onChange={(e) => setPassword(e.target.value)}/>

          <button type='submit'>Acessar</button>
        </form>
      </div>
    )
  }