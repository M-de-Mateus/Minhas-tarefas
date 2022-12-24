import { useState } from 'react';
import { Link } from 'react-router-dom'
import { auth } from '../firebaseconnection'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

export default function Register(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  async function handleRegister(e){
    e.preventDefault();

    if(email !== '' && password !== ''){
      await createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigate('/admin', {replace: true})
      })
      .catch(() => {
        console.log('erro ao cadastrar')
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
        <h1>Cadastre-se</h1>
        <span>Vamos criar sua conta</span>

        <form className='form' onSubmit={handleRegister}>
          <input type='text' placeholder='Digite o seu email' value={email} onChange={(e) => setEmail(e.target.value)}/>
          <input type='password' placeholder='******' value={password} onChange={(e) => setPassword(e.target.value)}/>

          <button type='submit'>Cadastrar</button>
        </form>

        <Link className='button-link' to='/'>
          Já possui uma conta? Faça o login!
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