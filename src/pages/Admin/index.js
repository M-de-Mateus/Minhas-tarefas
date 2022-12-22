import { useState, useEffect } from 'react'
import './admin.css'
import { auth, db } from '../../firebaseconnection'
import { signOut } from 'firebase/auth'
import { 
    addDoc,
    collection,
    onSnapshot,
    query,
    orderBy,
    where
} from 'firebase/firestore'

export default function Admin(){
    const [tarefa, setTarefa] = useState('');
    const [user, setUser] = useState({});
    const [listaTarefas, setListaTarefas] = useState([]);

    useEffect(()=>{
        async function loadTarefas(){
            const userDetail = localStorage.getItem('@detailUser')
            setUser(JSON.parse(userDetail))

            if(userDetail){
                const data = JSON.parse(userDetail);

                const tarefaRef = collection(db, 'tarefas')
                const q = query(tarefaRef, orderBy('create', 'desc'), where('userUid', '==', data?.uid))
                const unsub = onSnapshot(q, (snapshot) =>{
                    let lista = [];
                    
                    snapshot.forEach((doc) => {
                        lista.push({
                            id: doc.id,
                            tarefa: doc.data().tarefa,
                            userUid: doc.data().userUid
                        })
                    })

                    setListaTarefas(lista);
                })
            }
        }

        loadTarefas();
    }, [])

    async function handleRegister(e){
        e.preventDefault();

        if(tarefa === ''){
            alert('Digite sua tarefa...')
            return;
        }

        await addDoc(collection(db, 'tarefas'), {
            tarefa: tarefa,
            create: new Date(),
            userUid: user?.uid
        })
        .then(()=>{
            console.log('Tarefa Registrada')
            setTarefa('');
        })
        .catch((error)=>{
            console.log('Erro ' + error )
        })

    }

    async function handleSair(){
        await signOut(auth);
    }

    return(
        <div className='admin-container'>
            <h1>Minhas tarefas</h1>

            <form className='form' onSubmit={handleRegister}>
                <textarea 
                    placeholder='Digite sua tarefa...' 
                    value={tarefa}
                    onChange={(e) => setTarefa(e.target.value)}
                />

                <button className='btn-register' type='submit'>Adicionar tarefa</button>
            </form>

            <article className='lista-tarefas'>
                <p>Estudar javascript e reactjs hoje a noite</p>

                <div>
                    <button>Editar</button>
                    <button className='btn-delete'>Concluir</button>
                </div>
            </article>

            <hr className='regua'/>
            
            <button className='btn-sair' onClick={handleSair}>Sair</button>
        </div>
    )
}