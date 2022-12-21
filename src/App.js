import { useState, useEffect } from 'react';
import { db, auth } from './firebaseconnection';
import { doc, setDoc, collection, addDoc, getDoc, getDocs, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore'
import './app.css';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { async } from '@firebase/util';

function App() {
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [idPost, setIdpost] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [user, setUser] = useState(false);
  const [userDetail, setUserDetail] = useState({});
  const [posts, setPosts] = useState([]);

  //carrega os itens em tempo real
  useEffect(() => {
    async function loadPosts(){
      const unsub = onSnapshot(collection(db, 'posts'), (snapshot) => {
        let listaPost = [];

        snapshot.forEach((doc)=>{
          listaPost.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor
          })
        })
        setPosts(listaPost);
        })
    }

    loadPosts();

  }, [])
// verifica se tem ususario logado
  useEffect(() => {
    async function checkLogin(){
      onAuthStateChanged(auth, (user) => {
        if(user){
          //caso tenha usuario vem pra ca
          setUser(true);
          setUserDetail({
            uid: user.uid,
            email: user.email
          })
        }else{
          //caso não tenha vem pra ca
          setUser(false);
          setUserDetail({});
        }
      })
    }
    checkLogin();
  }, [])

  async function handleAdd(){
  /*  await setDoc(doc(db, 'posts', '3'), {
      titulo: titulo,
      autor: autor
    })
    .then(() => {
      console.log('Dados registrados')
    })
    .catch((error) => {
      console.log('Erro ' + error + ' relatado')
    })*/
    // função para adicionar um post no banco de dados
    await addDoc(collection(db, 'posts'), {
      titulo: titulo,
      autor: autor
    })
    .then(() => {
      console.log('Cadastrado com sucesso')
      setAutor('');
      setTitulo('');
    })
    .catch((error) => {
      console.log('Erro: ' + error)
    })
  }
  // função par abuscar posts no banco de dados
  async function buscarPost(){
    /*const postRef = doc(db, "posts", '2BWtaJAQ5XPGrgh8RVcf')
    
    await getDoc(postRef)
    .then((snapshot) => {
      setAutor(snapshot.data().autor)
      setTitulo(snapshot.data().titulo)
    })
    .catch((error) => {
      console.log(error)
    })*/

    const postRef = collection(db, "posts")
    await getDocs(postRef)
    .then((snapshot)=> {
      let lista = [];

      snapshot.forEach((doc)=>{
        lista.push({
          id: doc.id,
          titulo: doc.data().titulo,
          autor: doc.data().autor
        })
      })
      setPosts(lista);
    })
    .catch((error) =>{
      console.log('Um erro ocorreu!')
    })
  }

  async function attPost(){
    const docRef = doc(db, 'posts', idPost)
    await updateDoc(docRef, {
      titulo: titulo,
      autor: autor
    })
    .then(()=>{
      console.log('post atualizado')
      setIdpost('');
      setTitulo('');
      setAutor('');
    })
    .catch((error)=>{
      console.log(error)
    })
  }
  // função para exclusão de posts no banco de dados
  async function excluirPost(id){
    const docRef = doc(db, 'posts', id)
    await deleteDoc(docRef)
    .then(() =>{
      alert('deletado com sucesso!')
      buscarPost();
    })
  }

  async function novoUsuario(){
    await createUserWithEmailAndPassword(auth, email, senha)
    .then(()=>{
      console.log('Cadastrado com sucesso')
      setEmail('');
      setSenha('');
    })
    .catch((error) =>{
      console.log('Erro ao cadastrar')
      if(error.code === 'auth/weak-password'){
        alert('senha muito fraca!')
      }else if (error.code === 'auth/email-already-in-use'){
        alert('Email já existe!')
      }
      
      setEmail('');
      setSenha('');
    })
  }

  async function logarUsuario(){
    await signInWithEmailAndPassword(auth, email, senha)
    .then((value) => {
      console.log('Logado com sucesso')

      setUserDetail({
        uid: value.user.uid,
        email: value.user.email
      })

      setUser(true);
      setEmail('');
      setSenha('');
    })
    .catch(() => {
      console.log('Erro ao fazer o Login')
    })
  }

  async function fazerLogout(){
    await signOut(auth)
    setUser(false);
    setUserDetail({});
  }

  return (
    <div>
      <h1>Fireapp</h1>

       {user && (
        <div>
          <strong>Seja bem-vindo(a) (Você está logado!)</strong><br/>
          <span>ID: {userDetail.uid} - Email: {userDetail.email}</span><br/>
          <button onClick={fazerLogout}>Sair</button>
          <br/>
          <br/>
        </div>
       )} 

      <h2>Usuários</h2>

      <div className='container'>
        <label>Email: </label>
        <input value={email} type='email' 
        onChange={(e) => setEmail(e.target.value)} placeholder='Digite um e-mail'/><br/>
        <label>Senha: </label>
        <input value={senha} type='password' 
        onChange={(e) => setSenha(e.target.value)} placeholder='Digite sua senha'/><br/>
        <button onClick={novoUsuario}>Cadastrar</button>
        <button onClick={logarUsuario}>Login</button>
      </div>

      <br/>
      <br/>
      <hr/>

      <h2>Posts</h2>
      <div className='container'>
        <label>ID do Post:</label>
        <input placeholder='Digite o id do post' value={idPost} onChange={(e) => setIdpost(e.target.value)}/>
        <br/>
        <label>Titulo:</label>
        <textarea type='text' placeholder='Digite o título' value={titulo} onChange={(e) => setTitulo(e.target.value)}/>
        <br/>
        <label>Autor:</label>
        <input type='text' placeholder='Autor do post' value={autor} onChange={(e) => setAutor(e.target.value)}/>
        <br/>

        <button onClick={handleAdd}>Cadastrar</button>
        <button onClick={buscarPost}>Buscar Post</button><br/>
        <button onClick={attPost}>Atualizar Post</button>

        <ul>
          {posts.map((post) => {
            return(
              <li key={post.id}>
                <strong>ID: {post.id}</strong><br/>
                <span>Titulo: {post.titulo}</span><br/>
                <span>Autor: {post.autor}</span><br/>
                <button onClick={() => excluirPost(post.id)}>Excluir</button><br/><br/>
              </li>
            )
          })}
        </ul>
      </div>

      

    </div>
  );
}

export default App;
