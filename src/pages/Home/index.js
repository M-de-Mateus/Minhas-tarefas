import { useState } from 'react'
import './home.css'

import { Link } from 'react-router-dom'
import { auth } from '../../firebaseconnection'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

export default function Home(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  async function handleLogin(e){
    e.preventDefault();

    if(email !== '' && password !== ''){
      await signInWithEmailAndPassword(auth, email, password)
      .then(() =>{
        // navegar para o admin
        navigate('/admin', {replace: true})
      })
      .catch(()=>{
        console.log('Erro ao fazer o login!')
      })
    }else{
      toast.warn('Preencha todos os campos!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        });
    }

  }

    return(
      <div className='home-container'>
        <h1>Minhas tarefas</h1>
        <span>Anote todas suas tarefas de forma fácil!</span>

        <form className='form' onSubmit={handleLogin}>
          <input type='text' placeholder='Digite o seu email' value={email} onChange={(e) => setEmail(e.target.value)}/>
          <input type='password' placeholder='******' value={password} onChange={(e) => setPassword(e.target.value)}/>

          <button type='submit'>Acessar</button>
        </form>

        <Link className='button-link' to='/register'>
          Ainda não tem uma conta? Cadastre-se!
        </Link>
        <ToastContainer 
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss={false}
            draggable
            pauseOnHover
            theme="colored"
            />
      </div>
    )
  }